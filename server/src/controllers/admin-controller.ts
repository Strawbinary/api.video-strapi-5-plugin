import { Core } from '@strapi/strapi';
import { isAllowedTo } from '.';
import {
  mainCreateAction,
  mainDeleteAction,
  mainReadAction,
  mainUpdateAction,
} from '../../../admin/src/actions';
import { PLUGIN_ID } from '../../../admin/src/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async createVideoId(ctx: any) {
    try {
      if (!isAllowedTo(strapi, ctx, mainCreateAction)) {
        return ctx.forbidden();
      }

      return await strapi
        .plugin(PLUGIN_ID)
        .service('api-video-asset')
        .createVideoId(ctx.request.body.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async create(ctx: any) {
    try {
      if (!isAllowedTo(strapi, ctx, mainCreateAction)) {
        return ctx.forbidden();
      }

      ctx.body = await strapi
        .plugin(PLUGIN_ID)
        .service('api-video-asset')
        .create(ctx.request.body.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async findAll(ctx: any) {
    try {
      if (!isAllowedTo(strapi, ctx, mainReadAction)) {
        return ctx.forbidden();
      }

      ctx.body = await strapi
        .plugin(PLUGIN_ID)
        .service('api-video-asset')
        .findAll(ctx.request.body.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async token(ctx: any) {
    try {
      if (!isAllowedTo(strapi, ctx, mainReadAction)) {
        return ctx.forbidden();
      }

      ctx.body = await strapi
        .plugin(PLUGIN_ID)
        .service('api-video-asset')
        .token(ctx.params.videoId);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async update(ctx: any) {
    try {
      if (!isAllowedTo(strapi, ctx, mainUpdateAction)) {
        return ctx.forbidden();
      }

      ctx.body = await strapi
        .plugin(PLUGIN_ID)
        .service('api-video-asset')
        .update(ctx.params.id, ctx.params.videoId, ctx.request.body.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async delete(ctx: any) {
    try {
      if (!isAllowedTo(strapi, ctx, mainDeleteAction)) {
        return ctx.forbidden();
      }

      return await strapi
        .plugin(PLUGIN_ID)
        .service('api-video-asset')
        .delete(ctx.params.id, ctx.params.videoId);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async getTopVideos(ctx: any) {
    if (!isAllowedTo(strapi, ctx, mainReadAction)) {
      return ctx.forbidden();
    }

    return await strapi.plugin(PLUGIN_ID).service('api-video-asset').getTopVideos(ctx.query);
  },
});
