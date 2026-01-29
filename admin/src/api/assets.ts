import { getFetchClient } from '@strapi/strapi/admin';
import { InputData } from '../../../types';
import { PLUGIN_ID } from '../pluginId';

const assetsRequests = {
  getAllvideos: async () => {
    const { get } = getFetchClient();
    return await get(`/${PLUGIN_ID}/api-video-asset`);
  },
  getToken: async (videoId: string) => {
    const { get } = getFetchClient();
    return await get(`/${PLUGIN_ID}/api-video-asset/token/${videoId}`);
  },
  createVideoId: async (body: object) => {
    const { post } = getFetchClient();
    return await post(`/${PLUGIN_ID}/api-video-asset/create`, {
      body,
    });
  },
  create: async (body: object) => {
    const { post } = getFetchClient();
    return await post(`/${PLUGIN_ID}/api-video-asset`, {
      body,
    });
  },
  update: async (id: string, videoId: string, body: InputData) => {
    const { put } = getFetchClient();
    return await put(`/${PLUGIN_ID}/api-video-asset/${id}/${videoId}`, {
      body,
    });
  },
  delete: async (id: string, videoId: string) => {
    const { del } = getFetchClient();
    return await del(`/${PLUGIN_ID}/api-video-asset/${id}/${videoId}`);
  },
};

export default assetsRequests;
