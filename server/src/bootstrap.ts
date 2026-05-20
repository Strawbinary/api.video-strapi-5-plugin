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

  const cronConfig = strapi.plugin(PLUGIN_ID).config('cron') as
    | {
        enabled?: boolean;
        rule?: string;
      }
    | undefined;

  if (cronConfig?.enabled === false) {
    strapi.log.info('[api.video] daily missing asset sync cron disabled by configuration');
    return;
  }

  if (!strapi.cron?.add) {
    strapi.log.warn('[api.video] daily missing asset sync cron unavailable on this Strapi instance');
    return;
  }

  const rule = cronConfig?.rule?.trim() ? cronConfig.rule : '0 3 * * *';
  strapi.cron.add({
    'api-video-strapi-5-plugin.sync-missing-assets': {
      task: async ({ strapi: cronStrapi }) => {
        await cronStrapi
          .plugin(PLUGIN_ID)
          .service('api-video-asset')
          .syncMissingAssetsFromApiVideo();
      },
      options: {
        rule,
      },
    },
  });

  strapi.log.info(`[api.video] daily missing asset sync cron registered (${rule})`);
};
