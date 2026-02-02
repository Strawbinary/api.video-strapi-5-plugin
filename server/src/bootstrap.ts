import { PLUGIN_ID } from '../../admin/src/pluginId';
import { runMigrations } from './utils/migrations';

export default async ({ strapi }: { strapi: any }) => {
  strapi.log.info('[api.video] plugin bootstrap start');
  const actions = [
    // App
    {
      section: 'plugins',
      displayName: 'Read',
      uid: 'read',
      pluginName: PLUGIN_ID,
    },
    {
      section: 'plugins',
      displayName: 'Create',
      uid: 'create',
      pluginName: PLUGIN_ID,
    },
    {
      section: 'plugins',
      displayName: 'Update',
      uid: 'update',
      pluginName: PLUGIN_ID,
    },
    {
      section: 'plugins',
      displayName: 'Delete',
      uid: 'delete',
      pluginName: PLUGIN_ID,
    },
    // Settings
    {
      section: 'plugins',
      displayName: 'Read',
      subCategory: 'settings',
      uid: 'settings.read',
      pluginName: PLUGIN_ID,
    },
    {
      section: 'plugins',
      displayName: 'Update',
      subCategory: 'settings',
      uid: 'settings.update',
      pluginName: PLUGIN_ID,
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);

  await runMigrations(strapi);
};
