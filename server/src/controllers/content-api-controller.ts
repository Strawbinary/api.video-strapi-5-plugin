import { factories, Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../admin/src/pluginId';
import { CustomVideo } from '../../../types';
import { replacePrivateVideoTokens } from '../utils/private-videos';

const uid = `plugin::${PLUGIN_ID}.api-video-asset`;

export const findOneWithPrivateVideoTransform = async (documentId: string, strapi: Core.Strapi, params?: any, ) => {
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
};

export default factories.createCoreController(
  'plugin::api-video-uploader.api-video-asset',
  ({ strapi }: {strapi: Core.Strapi}) => ({
    async count(ctx) {
    //   return await strapi.entityService.count(model, ctx.query);
    return await strapi.documents(uid).count(ctx.query);
    },
    async find(ctx) {
      return await findWithPrivateVideoTransform(strapi, ctx);
    },
    async findOne(ctx) {
      return (await findOneWithPrivateVideoTransform(ctx.params.id, strapi, ctx.query)) ?? ctx.notFound();
    },
  })
);
