import { CustomVideo } from '../../../types';
import { PLUGIN_ID } from '../../../admin/src/pluginId';

export const replacePrivateVideoTokens = async (video: any, token?: string) => {
  if (video._public) {
    return video;
  }

  token =
    token ??
    (
      await strapi
        .plugin(PLUGIN_ID)
        .service('api-video-asset')
        .token(video.videoId)
    ).token;

  return {
    ...video,
    mp4: video.mp4.replace(/token\/[\w-]+\//, `token/${token}/`),
    thumbnail: video.thumbnail.replace(/token\/[\w-]+\//, `token/${token}/`),
    hls: video.hls.replace(/token\/[\w-]+\//, `token/${token}/`),
    iframe: video.iframe.replace(/token=[\w-]+/, `token=${token}`),
    player: video.player.replace(/token=[\w-]+/, `token=${token}`),
  } as CustomVideo;
};
