import { useState, FC } from 'react';
import { VideoUploader } from '@api.video/video-uploader';
import assetsRequests from '../../../api/assets';
import { Button } from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';

import { CloudUpload } from '@strapi/icons';

export interface IUploadButtonProps {
  currentFile: File | undefined;
  title: string;
  description: string;
  _public: boolean;
  tags: string[];
  metadata: { key: string; value: string }[];
  update: () => void;
  close: () => void;
}

const UploadButton: FC<IUploadButtonProps> = ({
  currentFile,
  title,
  description,
  _public,
  tags,
  metadata,
  update,
  close,
}): JSX.Element => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadIsDisabled =
    currentFile === undefined || title.trim().length < 1 || description.trim().length < 1;

  const { toggleNotification } = useNotification();

  const fileInputChange = async () => {
    const body = {
      title: title,
      description: description,
      _public: _public,
      tags: tags,
      metadata: metadata,
    };
    const { data }: any = await assetsRequests.createVideoId(body);

    if (currentFile) {
      setIsUploading(true);
      const uploader = new VideoUploader({
        file: currentFile,
        accessToken: data.token?.accessToken,
        refreshToken: data.token?.refreshToken,
        videoId: data.newVideo?.videoId,
      });
      try {
        uploader.onProgress((e) => setProgress(Math.round((e.uploadedBytes * 100) / e.totalBytes)));

        const res: any = await uploader.upload();

        const body = {
          title: res.title,
          description: res.description,
          _public: res._public,
          videoId: res.videoId,
          hls: res.assets.hls,
          iframe: res.assets.iframe,
          mp4: res?.assets?.mp4,
          player: res.assets.player,
          thumbnail: res?.assets?.thumbnail,
          tags: res.tags,
          metadata: res.metadata,
        };
        const data = await assetsRequests.create(body);
        if (data) {
          setIsUploading(false);
          update();
        } else {
          toggleNotification({
            type: 'warning',
            message: 'Error while creating video',
          });
        }
      } catch (e) {
        console.error(e);
      }
      close();
    }
  };

  return (
    <Button
      endIcon={<CloudUpload />}
      loading={isUploading}
      onClick={fileInputChange}
      disabled={uploadIsDisabled}
    >
      {isUploading ? `Uploading ${progress}%` : `Upload`}
    </Button>
  );
};

export default UploadButton;
