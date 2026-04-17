import { useState, FC } from 'react';
import { VideoUploader } from '@api.video/video-uploader';
import assetsRequests from '../../../api/assets';
import { Button } from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';

import { CloudUpload } from '@strapi/icons';
import { fileToBase64 } from '../../../utils/fileToBase64';

export interface IUploadButtonProps {
  currentFile: File | undefined;
  thumbnailFile?: File;
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
  thumbnailFile,
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
    const { data: createResponse }: any = await assetsRequests.createVideoId(body);
    let thumbnailUrl: string | undefined;

    if (currentFile) {
      setIsUploading(true);
      const uploader = new VideoUploader({
        file: currentFile,
        accessToken: createResponse.token?.accessToken,
        refreshToken: createResponse.token?.refreshToken,
        videoId: createResponse.newVideo?.videoId,
      });
      try {
        uploader.onProgress((e) => setProgress(Math.round((e.uploadedBytes * 100) / e.totalBytes)));

        const res: any = await uploader.upload();

        if (thumbnailFile) {
          try {
            const thumbnailRes: any = await assetsRequests.uploadThumbnail(
              createResponse.newVideo?.videoId,
              {
                fileName: thumbnailFile.name,
                mimeType: thumbnailFile.type,
                base64: await fileToBase64(thumbnailFile),
              }
            );
            thumbnailUrl = thumbnailRes?.data?.thumbnail;
          } catch (error) {
            console.error(error);
            toggleNotification({
              type: 'warning',
              message:
                'Thumbnail upload failed. The video will be saved with the default thumbnail.',
            });
          }
        }

        const body = {
          title: res.title,
          description: res.description,
          _public: res._public,
          videoId: res.videoId,
          hls: res.assets.hls,
          iframe: res.assets.iframe,
          mp4: res?.assets?.mp4,
          player: res.assets.player,
          thumbnail: thumbnailUrl ?? res?.assets?.thumbnail,
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
