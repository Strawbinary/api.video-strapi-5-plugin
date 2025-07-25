import { useState, FC } from 'react';
import { Button } from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../../utils/getTranslation';
import assetsRequests from '../../../api/assets';

export interface IUpdateButtonProps {
  title: string;
  description: string;
  _public: boolean;
  tags: string[];
  metadata: { key: string; value: string }[];
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
    };
    setIsUploading(true);

    try {
      const data = await assetsRequests.update(id, videoId, body);
      if (data) {
        setIsUploading(false);
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
    }
  };

  return (
    <Button onClick={updateData}>
      {formatMessage({
        id: getTranslation('general.update'),
        defaultMessage: 'Update',
      })}
    </Button>
  );
};

export default UpdateButton;
