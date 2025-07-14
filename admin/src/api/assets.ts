import { useFetchClient } from '@strapi/strapi/admin';
import { InputData } from '../../../types';
import { PLUGIN_ID } from '../pluginId';

const assetsRequests = {
  getAllvideos: async () => {
    const { get } = useFetchClient();
    return await get<Array<any>>(`/${PLUGIN_ID}/api-video-asset`);
  },
  getToken: async (videoId: string) => {
    const { get } = useFetchClient();
    return await get(`/${PLUGIN_ID}/api-video-asset/token/${videoId}`);
  },
  createVideoId: async (body: Object) => {
    const { post } = useFetchClient();
    return await post(`/${PLUGIN_ID}/api-video-asset/create`, {
      body,
    });
  },
  create: async (body: Object) => {
    const { post } = useFetchClient();
    return await post(`/${PLUGIN_ID}/api-video-asset`, {
      body,
    });
  },
  update: async (id: number, videoId: string, body: InputData) => {
    const { put } = useFetchClient();
    return await put(`/${PLUGIN_ID}/api-video-asset/${id}/${videoId}`, {
      body,
    });
  },
  delete: async (id: number, videoId: string) => {
    const { del } = useFetchClient();
    return await del(`/${PLUGIN_ID}/api-video-asset/${id}/${videoId}`);
  },
};

export default assetsRequests;
