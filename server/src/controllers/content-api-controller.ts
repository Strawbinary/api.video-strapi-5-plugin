import { factories, Core } from '@strapi/strapi';
import crypto from 'crypto';
import { PLUGIN_ID } from '../../../admin/src/pluginId';
import { CustomVideo } from '../../../types';
import { configClient } from '../utils/config';
import { replacePrivateVideoTokens } from '../utils/private-videos';
import { extractDurationFromStatus } from '../utils/video-status';

const uid = `plugin::${PLUGIN_ID}.api-video-asset`;
const RAW_BODY_SYMBOL = Symbol.for('unparsedBody');

export const findOneWithPrivateVideoTransform = async (
  documentId: string,
  strapi: Core.Strapi,
  params?: any
) => {
  const video = await strapi.documents(uid).findOne({
    documentId,
    ...(params ?? {}),
  });

  if (!video) {
    return null;
  }

  video._public = video._public ?? true;

  return video._public ? video : await replacePrivateVideoTokens(video);
};

export const findWithPrivateVideoTransform = async (strapi: Core.Strapi, params?: any) => {
  try {
    const videos: any[] = await strapi.documents(uid).findMany({
      ...(params ?? {}),
    });

    return await Promise.all(
      videos
        .map((video: CustomVideo) => ({
          ...video,
          _public: video._public ?? true,
        }))
        .map(async (video: CustomVideo) =>
          video._public ? video : await replacePrivateVideoTokens(video)
        )
    );
  } catch (e) {
    console.error('Error finding videos', e);
  }
};

export default factories.createCoreController(
  `plugin::${PLUGIN_ID}.api-video-asset`,
  ({ strapi }: { strapi: Core.Strapi }) => ({
    async webhookEncodingCompleted(ctx) {
      const webhookId = ctx.get('x-api-video-webhookid');
      const expectedSignature = ctx.get('x-api-video-signature');

      if (!webhookId || !expectedSignature) {
        ctx.status = 401;
        return { received: false };
      }

      const parsedBody = ctx.request.body as Record<PropertyKey, unknown> | undefined;
      const rawBody =
        (parsedBody && (Reflect.get(parsedBody, RAW_BODY_SYMBOL) as string | Buffer | undefined)) ||
        (ctx.request as typeof ctx.request & { rawBody?: string | Buffer }).rawBody;

      let bodyString: string | null = null;
      if (Buffer.isBuffer(rawBody)) {
        bodyString = rawBody.toString('utf8');
      } else if (typeof rawBody === 'string') {
        bodyString = rawBody;
      } else if (typeof parsedBody === 'string') {
        bodyString = parsedBody;
      } else if (parsedBody && typeof parsedBody === 'object') {
        strapi.log.warn(
          '[api.video] webhook verification: raw body missing, using JSON.stringify; enable raw body to avoid signature mismatch'
        );
        bodyString = JSON.stringify(parsedBody);
      }

      if (!bodyString) {
        ctx.status = 400;
        return { received: false };
      }

      try {
        const client = await configClient();
        const webhook = await client.webhooks.get(String(webhookId));
        const signatureSecret = webhook?.signatureSecret;
        if (!signatureSecret) {
          ctx.status = 401;
          return { received: false };
        }

        const actualSignature = crypto
          .createHmac('sha256', signatureSecret)
          .update(bodyString)
          .digest('hex');

        const expected = Buffer.from(String(expectedSignature), 'utf8');
        const actual = Buffer.from(actualSignature, 'utf8');
        const signaturesMatch =
          expected.length === actual.length && crypto.timingSafeEqual(expected, actual);

        if (!signaturesMatch) {
          ctx.status = 401;
          return { received: false };
        }

        const payload =
          typeof ctx.request?.body === 'object'
            ? ctx.request.body
            : (JSON.parse(bodyString) as any);
        const eventType = payload?.type;
        const videoId = payload?.videoId;

        if (eventType !== 'video.encoding.quality.completed' || !videoId) {
          ctx.status = 202;
          return { received: true };
        }

        const status = await client.videos.getStatus(videoId);
        const duration = extractDurationFromStatus(status);

        if (duration === null) {
          ctx.status = 202;
          return { received: true };
        }

        const videos: any[] = await strapi.documents(uid).findMany({
          filters: {
            videoId: {
              $eq: videoId,
            },
          },
          limit: 1,
        });

        if (!videos || videos.length === 0) {
          ctx.status = 202;
          return { received: true };
        }

        const documentId = videos[0]?.documentId ?? videos[0]?.id;
        if (!documentId) {
          ctx.status = 202;
          return { received: true };
        }

        if (videos[0]?.duration === duration) {
          ctx.status = 202;
          return { received: true };
        }

        await strapi.documents(uid).update({
          documentId,
          data: {
            duration,
          } as any,
        });

        ctx.status = 202;
        return { received: true };
      } catch (error) {
        strapi.log.error(error);
        ctx.status = 500;
        return { received: false };
      }
    },
    async count(ctx) {
      return await strapi.documents(uid).count(ctx.query);
    },
    async find(ctx) {
      return await findWithPrivateVideoTransform(strapi, ctx);
    },
    async findOne(ctx) {
      return (
        (await findOneWithPrivateVideoTransform(ctx.params.id, strapi, ctx.query)) ?? ctx.notFound()
      );
    },
  })
);
