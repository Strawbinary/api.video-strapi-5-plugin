import { useState, FC } from 'react';
import { Button } from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../../utils/getTranslation';
import assetsRequests from '../../../api/assets';
import { fileToBase64 } from '../../../utils/fileToBase64';

export interface IUpdateButtonProps {
  title: string;
  description: string;
  _public: boolean;
  tags: string[];
  metadata: { key: string; value: string }[];
  thumbnailFile?: File;
  resetThumbnail?: boolean;
  id: string;
  videoId: string;
  update: () => void;
  close: () => void;
}

const UpdateButton: FC<IUpdateButtonProps> = ({
  title,
  description,
  _public,
  tags,
  metadata,
  thumbnailFile,
  resetThumbnail,
  id,
  videoId,
  update,
  close,
}): JSX.Element => {
  const [_isUploading, setIsUploading] = useState(false);
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();

  const updateData = async () => {
    const body = {
      title: title,
      description: description,
      _public: _public,
      tags: tags,
      metadata: metadata,
      resetThumbnail: resetThumbnail ?? false,
    };
    setIsUploading(true);

    try {
      let thumbnailUrl: string | undefined;

      if (thumbnailFile) {
        try {
          const thumbnailRes: any = await assetsRequests.uploadThumbnail(videoId, {
            fileName: thumbnailFile.name,
            mimeType: thumbnailFile.type,
            base64: await fileToBase64(thumbnailFile),
          });
          thumbnailUrl = thumbnailRes?.data?.thumbnail;
        } catch (error) {
          console.error(error);
          toggleNotification({
            type: 'warning',
            message:
              'Thumbnail upload failed. The video metadata will be updated with the existing thumbnail.',
          });
        }
      }

      const data = await assetsRequests.update(id, videoId, {
        ...body,
        ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
      });
      if (data) {
        update();
        close();
      } else {
        toggleNotification({
          type: 'warning',
          message: 'Error while creating video',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button loading={_isUploading} onClick={updateData}>
      {formatMessage({
        id: getTranslation('general.update'),
        defaultMessage: 'Update',
      })}
    </Button>
  );
};

export default UpdateButton;
