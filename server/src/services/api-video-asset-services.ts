import { factories, Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../admin/src/pluginId';
import { CustomVideo } from '../../../types';
import { configClient } from '../utils/config';
import { replacePrivateVideoTokens } from '../utils/private-videos';
import { extractDurationFromStatus } from '../utils/video-status';

const uid = `plugin::${PLUGIN_ID}.api-video-asset`;
const PRIVATE_VIDEO_TOKEN_PLACEHOLDER = '11111111-1111-1111-1111-111111111111';
const DEFAULT_SYNC_PAGE_SIZE = 100;
const REQUIRED_ASSET_FIELDS = [
  'title',
  'description',
  'videoId',
  'hls',
  'iframe',
  'mp4',
  'player',
  'thumbnail',
] as const;

type SyncSummary = {
  created: number;
  skippedExisting: number;
  skippedIncomplete: number;
  failed: number;
};

type ApiVideoAssetCandidate = {
  title?: string;
  description?: string;
  _public?: boolean;
  videoId?: string;
  assets?: {
    hls?: string;
    iframe?: string;
    mp4?: string;
    player?: string;
    thumbnail?: string;
  };
  tags?: string[];
  metadata?: { key?: string; value?: string }[];
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const normalizeMetadata = (metadata: ApiVideoAssetCandidate['metadata']) =>
  (metadata ?? []).flatMap((item) => {
    if (!isNonEmptyString(item?.key) || !isNonEmptyString(item?.value)) {
      return [];
    }

    return [{ key: item.key, value: item.value }];
  });

const hasRequiredAssetFields = (asset: Partial<Record<(typeof REQUIRED_ASSET_FIELDS)[number], unknown>>) =>
  REQUIRED_ASSET_FIELDS.every((field) => isNonEmptyString(asset[field]));

const buildAssetData = async (
  video: ApiVideoAssetCandidate,
  client: Awaited<ReturnType<typeof configClient>>,
  logger: Core.Strapi['log']
) => {
  const data: Partial<CustomVideo> = {
    title: video.title?.trim(),
    description: video.description?.trim(),
    _public: video._public ?? true,
    videoId: video.videoId,
    hls: video.assets?.hls,
    iframe: video.assets?.iframe,
    mp4: video.assets?.mp4,
    player: video.assets?.player,
    thumbnail: video.assets?.thumbnail,
    tags: video.tags ?? [],
    metadata: normalizeMetadata(video.metadata),
  };

  try {
    const status = await client.videos.getStatus(String(video.videoId));
    const duration = extractDurationFromStatus(status);

    if (duration !== null) {
      data.duration = duration;
    }
  } catch (error) {
    logger.warn(
      `[api.video] daily sync: unable to fetch duration for videoId=${video.videoId}, continuing without duration`
    );
    logger.error(error);
  }

  if (data._public === false) {
    return replacePrivateVideoTokens(data, PRIVATE_VIDEO_TOKEN_PLACEHOLDER);
  }

  return data;
};

export default factories.createCoreService(uid, ({ strapi }: { strapi: Core.Strapi }) => ({
  async createVideoId(data: any) {
    const client = await configClient();
    const newVideo = await client.videos.create({
      title: data.title,
      description: data.description,
      _public: data._public,
      tags: data.tags,
      metadata: data.metadata,
    });
    const token = await client.getAccessToken();
    return { newVideo, token };
  },

  async uploadThumbnail(
    videoId: string,
    file: { base64: string; mimeType?: string; fileName?: string }
  ) {
    const client = await configClient();
    if (!file?.base64) {
      throw new Error('Thumbnail file is missing');
    }

    const buffer = Buffer.from(file.base64, 'base64');
    const updatedVideo = await client.videos.uploadThumbnail(videoId, buffer);
    return {
      thumbnail: updatedVideo.assets?.thumbnail,
      video: updatedVideo,
    };
  },

  async findAll(query: any) {
    return strapi.documents(uid).findMany(query);
  },

  async token(videoId: string) {
    const client = await configClient();
    const video = await client.videos.get(videoId);
    return { token: video._public ? undefined : video.assets?.player?.split('=')[1] };
  },

  async create(data: CustomVideo) {
    try {
      if (!data._public) {
        data = await replacePrivateVideoTokens(data, PRIVATE_VIDEO_TOKEN_PLACEHOLDER);
      }
      await strapi.documents(uid).create({ data });
      return true;
    } catch (error) {
      return false;
    }
  },

  async delete(id: string, videoId: string): Promise<boolean> {
    const client = await configClient();
    try {
      await client.videos.delete(videoId);
      await strapi.documents(uid).delete({ documentId: id });
      return true;
    } catch {
      return false;
    }
  },

  async update(id: string, videoId: string, data: any) {
    const client = await configClient();
    try {
      const { thumbnail, resetThumbnail, ...videoUpdatePayload } = data || {};
      let updatedVideo = await client.videos.update(videoId, videoUpdatePayload);

      if (resetThumbnail) {
        updatedVideo = await client.videos.pickThumbnail(videoId, {
          timecode: '00:00:00.000',
        });
      }

      let customVideo: any = {
        title: updatedVideo.title,
        description: updatedVideo.description,
        _public: updatedVideo._public,
        videoId: updatedVideo.videoId,
        hls: updatedVideo.assets?.hls,
        iframe: updatedVideo.assets?.iframe,
        mp4: updatedVideo.assets?.mp4,
        player: updatedVideo.assets?.player,
        thumbnail: thumbnail ?? updatedVideo.assets?.thumbnail,
        tags: updatedVideo.tags,
        metadata: updatedVideo.metadata as { key: string; value: string }[],
      };

      if (!customVideo._public) {
        customVideo = await replacePrivateVideoTokens(
          customVideo,
          PRIVATE_VIDEO_TOKEN_PLACEHOLDER
        );
      }

      const res = await strapi.documents(uid).update({
        documentId: id,
        data: customVideo,
      });

      return res;
    } catch {
      return false;
    }
  },

  async getTopVideos(query: any) {
    const client = await configClient();

    const { startDate, endDate } = query;
    const now = new Date();
    const from = startDate
      ? new Date(startDate as string)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const to = endDate ? new Date(endDate as string) : now;

    try {
      const { data } = await client.analytics.getMetricsBreakdown({
        metric: 'view',
        breakdown: 'media-id',
        from,
        to,
        sortBy: 'metricValue',
        sortOrder: 'desc',
        viewDuration: '30s',
      });

      const topMetrics = data.sort((a, b) => b.metricValue - a.metricValue).slice(0, 5);

      return await Promise.all(
        topMetrics.map(async ({ dimensionValue, metricValue }) => {
          const videoRes = await client.videos.get(dimensionValue);
          const title = videoRes.title || dimensionValue;
          return {
            videoId: dimensionValue,
            metrics: { views: metricValue },
            video: { title },
          };
        })
      );
    } catch (error) {
      strapi.log.error(error);
    }
  },

  async syncMissingAssetsFromApiVideo(): Promise<SyncSummary> {
    strapi.log.info('[api.video] Starting daily missing asset sync');

    const client = await configClient();
    const summary: SyncSummary = {
      created: 0,
      skippedExisting: 0,
      skippedIncomplete: 0,
      failed: 0,
    };

    let currentPage = 1;

    while (true) {
      let response;

      try {
        response = await client.videos.list({
          currentPage,
          pageSize: DEFAULT_SYNC_PAGE_SIZE,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        });
      } catch (error) {
        summary.failed += 1;
        strapi.log.error(`[api.video] daily sync: failed to fetch page ${currentPage}`);
        strapi.log.error(error);
        break;
      }

      const videos = response?.data ?? [];
      if (videos.length === 0) {
        break;
      }

      for (const video of videos as ApiVideoAssetCandidate[]) {
        try {
          if (!video.videoId) {
            summary.skippedIncomplete += 1;
            strapi.log.info('[api.video] daily sync: skipped video without videoId');
            continue;
          }

          const existing = await strapi.documents(uid).findMany({
            filters: {
              videoId: {
                $eq: video.videoId,
              },
            },
            limit: 1,
          });

          if (existing?.length) {
            summary.skippedExisting += 1;
            continue;
          }

          const assetData = await buildAssetData(video, client, strapi.log);

          if (!hasRequiredAssetFields(assetData as Partial<Record<(typeof REQUIRED_ASSET_FIELDS)[number], unknown>>)) {
            summary.skippedIncomplete += 1;
            strapi.log.info(
              `[api.video] daily sync: skipped incomplete videoId=${video.videoId} (required assets are not ready yet)`
            );
            continue;
          }

          await strapi.documents(uid).create({
            data: assetData as CustomVideo,
          });

          summary.created += 1;
        } catch (error) {
          summary.failed += 1;
          strapi.log.error(`[api.video] daily sync: failed videoId=${video.videoId ?? 'unknown'}`);
          strapi.log.error(error);
        }
      }

      const pagination = response?.pagination;
      const pagesTotal = pagination?.pagesTotal;

      if (typeof pagesTotal === 'number' && currentPage >= pagesTotal) {
        break;
      }

      if (videos.length < DEFAULT_SYNC_PAGE_SIZE) {
        break;
      }

      currentPage += 1;
    }

    strapi.log.info(
      `[api.video] Finished daily missing asset sync (created: ${summary.created}, skippedExisting: ${summary.skippedExisting}, skippedIncomplete: ${summary.skippedIncomplete}, failed: ${summary.failed})`
    );

    return summary;
  },
}));
