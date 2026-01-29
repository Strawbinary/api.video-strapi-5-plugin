import { Core } from '@strapi/strapi';
import { isAllowedTo } from '.';
import {
  mainCreateAction,
  mainDeleteAction,
  mainReadAction,
  mainUpdateAction,
  settingsReadAction,
  settingsUpdateAction,
} from '../../../admin/src/actions';
import { PLUGIN_ID } from '../../../admin/src/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings(ctx: any) {
    try {
      if (
        !isAllowedTo(strapi, ctx, settingsReadAction) &&
        !isAllowedTo(strapi, ctx, mainReadAction) &&
        !!isAllowedTo(strapi, ctx, mainCreateAction) &&
        !!isAllowedTo(strapi, ctx, mainUpdateAction) &&
        !!isAllowedTo(strapi, ctx, mainDeleteAction)
      ) {
        return ctx.forbidden();
      }

      return await strapi.plugin(PLUGIN_ID).service('settings').getSettings(ctx);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async saveSettings(ctx: any) {
    try {
      if (!isAllowedTo(strapi, ctx, settingsUpdateAction)) {
        return ctx.forbidden();
      }

      return await strapi.plugin(PLUGIN_ID).service('settings').saveSettings(ctx.request.body.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});
