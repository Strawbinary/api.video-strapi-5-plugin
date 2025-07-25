import { factories, Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../admin/src/pluginId';
import { CustomVideo } from '../../../types';
import { configClient } from '../utils/config';
import { replacePrivateVideoTokens } from '../utils/private-videos';

import { winston } from '@strapi/logger';

const uid = `plugin::${PLUGIN_ID}.api-video-asset`;

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
        data = await replacePrivateVideoTokens(data, '11111111-1111-1111-1111-111111111111');
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
      const updatedVideo = await client.videos.update(videoId, data);
      let customVideo: any = {
        title: updatedVideo.title,
        description: updatedVideo.description,
        _public: updatedVideo._public,
        videoId: updatedVideo.videoId,
        hls: updatedVideo.assets?.hls,
        iframe: updatedVideo.assets?.iframe,
        mp4: updatedVideo.assets?.mp4,
        player: updatedVideo.assets?.player,
        thumbnail: updatedVideo.assets?.thumbnail,
        tags: updatedVideo.tags,
        metadata: updatedVideo.metadata as { key: string; value: string }[],
      };

      if (!customVideo._public) {
        customVideo = await replacePrivateVideoTokens(
          customVideo,
          '11111111-1111-1111-1111-111111111111'
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
        viewDuration: '30s' 
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
      winston.error(error);
    }
  },
}));
