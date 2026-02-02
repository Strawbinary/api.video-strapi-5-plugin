import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../admin/src/pluginId';
import { configClient } from './config';
import { extractDurationFromStatus } from './video-status';

const uid = `plugin::${PLUGIN_ID}.api-video-asset`;
const MIGRATIONS_KEY = 'migrations';

type MigrationResult = {
  checked: number;
  updated: number;
  skipped: number;
};

type Migration = {
  id: string;
  run: (strapi: Core.Strapi) => Promise<MigrationResult>;
};

const backfillDurationMigration: Migration = {
  id: '2026-01-29-backfill-duration-from-status',
  run: async (strapi) => {
    const client = await configClient();
    const pageSize = 100;
    let lastId: number | null = null;
    let checked = 0;
    let updated = 0;
    let skipped = 0;

    while (true) {
      const batchLabel = lastId === null ? 'start' : `after ${lastId}`;
      strapi.log.info(`[api.video] migration batch ${batchLabel} limit=${pageSize}`);
      const videos: any[] = await strapi.documents(uid).findMany({
        filters: {
          duration: {
            $null: true,
          },
          ...(lastId === null
            ? {}
            : {
                id: {
                  $gt: lastId,
                },
              }),
        },
        limit: pageSize,
        sort: ['id:asc'],
      });

      if (!videos || videos.length === 0) {
        strapi.log.info('[api.video] migration batch empty, stopping');
        break;
      }

      strapi.log.info(`[api.video] migration batch size=${videos.length}`);
      for (const video of videos) {
        checked += 1;
        const documentId = video.documentId ?? video.id;
        if (!documentId || !video.videoId) {
          skipped += 1;
          continue;
        }

        try {
          const status = await client.videos.getStatus(video.videoId);
          strapi.log.info(`[api.video] status: ${JSON.stringify(status)}`);
          const duration = extractDurationFromStatus(status);
          strapi.log.info(`[api.video] duration: ${duration}`);
          if (duration === null) {
            skipped += 1;
            continue;
          }

          await strapi.documents(uid).update({
            documentId,
            data: {
              duration,
            } as any,
          });

          updated += 1;
        } catch (error) {
          skipped += 1;
          strapi.log.error(error);
        }
      }

      const lastVideoId = videos[videos.length - 1]?.id;
      if (typeof lastVideoId === 'number') {
        lastId = lastVideoId;
      } else {
        strapi.log.warn('[api.video] migration batch missing numeric id, stopping to avoid loop');
        break;
      }
    }

    return { checked, updated, skipped };
  },
};

const migrations: Migration[] = [backfillDurationMigration];

export const runMigrations = async (strapi: Core.Strapi) => {
  const store = strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: PLUGIN_ID,
  });

  const state = ((await store.get({ key: MIGRATIONS_KEY })) as Record<string, any>) ?? {};

  for (const migration of migrations) {
    if (state[migration.id]) {
      continue;
    }

    try {
      strapi.log.info(`[api.video] migration start: ${migration.id}`);
      const result = await migration.run(strapi);
      strapi.log.info(
        `[api.video] migration done: ${migration.id} (checked: ${result.checked}, updated: ${result.updated}, skipped: ${result.skipped})`
      );
      state[migration.id] = {
        ranAt: new Date().toISOString(),
        result,
      };

      await store.set({
        key: MIGRATIONS_KEY,
        value: state,
      });
    } catch (error) {
      strapi.log.error(`[api.video] migration failed: ${migration.id}`);
      strapi.log.error(error);
    }
  }

  strapi.log.info('[api.video] migrations: done');
};
