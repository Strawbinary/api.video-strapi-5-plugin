import { Core } from '@strapi/strapi';
import adminController from './admin-controller';
import settingsController from './settings-controller';
import contentApiControler from './content-api-controller';
import { PLUGIN_ID } from '../../../admin/src/pluginId';

const model = `plugin::${PLUGIN_ID}.api-video-asset`;

export const isAllowedTo = (strapi: Core.Strapi, ctx: any, action: string) => {
  const pm = (strapi as any).admin.services.permission.createPermissionsManager({
    ability: ctx.state.userAbility,
    action: action,
    model,
  });
  return pm.isAllowed;
};

export default {
  admin: adminController,
  'content-api': contentApiControler,
  settings: settingsController,
};
