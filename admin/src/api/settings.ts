import { getFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../pluginId';

const settingsRequests = {
  get: async () => {
    const { get } = getFetchClient();
    return await get(`/${PLUGIN_ID}/settings`);
  },
  update: async (body: object) => {
    const { post } = getFetchClient();
    return await post(`/${PLUGIN_ID}/settings`, {
      body,
    });
  },
};

export default settingsRequests;
