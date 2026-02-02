import { configClient } from './config';

const normalizeDuration = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value);
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.round(parsed);
    }
  }

  return null;
};

export const extractDurationFromStatus = (status: any): number | null => {
  return normalizeDuration(status?.encoding?.metadata?.duration);
};

export const fetchVideoDuration = async (videoId: string): Promise<number | null> => {
  try {
    const client = await configClient();
    const status = await client.videos.getStatus(videoId);
    return extractDurationFromStatus(status);
  } catch (error) {
    if (typeof strapi !== 'undefined' && strapi?.log?.error) {
      strapi.log.error(error);
    } else {
      // Fallback for contexts where strapi is not initialized yet
      console.error(error);
    }
    return null;
  }
};
