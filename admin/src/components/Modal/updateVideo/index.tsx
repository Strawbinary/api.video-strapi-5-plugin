import { Button, Modal, Typography } from '@strapi/design-system';
import { ChangeEvent, FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../../utils/getTranslation';
import { InputData } from '../../../../../types';
import { EnhancedCustomVideo } from '../../../pages/HomePage';
import UpdateButton from '../../Button/UpdateButton';
import FieldComp from '../../FieldComp/Fields';
import LinksTable from '../../LinksTable';
import MetadataTable from '../../Metadata';
import Tags from '../../Tags';
import Toggle from '../../Toggle';
import PlayerView from './PlayerView';

interface IUpdateVideoModalProps {
  video: EnhancedCustomVideo;
  update: () => void;
  close: () => void;
  editable: boolean;
}

const UpdateVideoModal: FC<IUpdateVideoModalProps> = ({
  video,
  update,
  close,
  editable,
}): JSX.Element => {
  const [inputData, setInputData] = useState<InputData>({
    title: video.title,
    description: video.description,
    _public: video._public,
    tags: video.tags,
    metadata: video.metadata,
  });

  // CONSTANTS
  const { title, description, _public, tags, metadata } = inputData;
  const { formatMessage } = useIntl();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputData((prevInputData) => ({ ...prevInputData, [name]: value }));
  };

  const handleSetPublic = (event: ChangeEvent<HTMLInputElement>) => {
    setInputData({ ...inputData, _public: event.target.checked });
  };

  const handleSetTag = (tag: string) => {
    if (tag) {
      setInputData({ ...inputData, tags: [...(inputData.tags || []), tag] });
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = inputData.tags && inputData.tags.filter((t: any) => t !== tag);
    setInputData({ ...inputData, tags: newTags });
  };

  const handleSetMetadata = (metadata: any) => {
    if (metadata) {
      setInputData({
        ...inputData,
        metadata: [...(inputData.metadata || []), metadata],
      });
    }
  };

  const handleRemoveMetadata = (metadata: Object) => {
    const newMetadata = inputData?.metadata && inputData?.metadata.filter((m) => m !== metadata);
    setInputData({ ...inputData, metadata: newMetadata });
  };

  return (
    <Modal.Root onOpenChange={close} open={true}>
      <Modal.Content>
        <Modal.Header>
          <Typography fontWeight="bold" textColor="neutral800" variant="beta" id="title">
            {formatMessage({
              id: getTranslation('updateVideoModal.title'),
              defaultMessage: 'Update video',
            })}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <PlayerView video={video} />
          <FieldComp
            name="title"
            label={formatMessage({
              id: getTranslation('addVideoModal.field.title'),
              defaultMessage: 'Title',
            })}
            value={title}
            placeholder={formatMessage({
              id: getTranslation('addVideoModal.field.placeholder.title'),
              defaultMessage: 'Enter your title',
            })}
            onChange={handleChange}
            editable={editable}
            required
          />
          <br />
          <FieldComp
            name="description"
            label={formatMessage({
              id: getTranslation('addVideoModal.field.description'),
              defaultMessage: 'Description',
            })}
            value={description || ''}
            placeholder={formatMessage({
              id: getTranslation('addVideoModal.field.placeholder.description'),
              defaultMessage: 'Enter a description',
            })}
            onChange={handleChange}
            editable={editable}
          />
          <br />

          <Toggle
            label={formatMessage({
              id: getTranslation('addVideoModal.field.public'),
              defaultMessage: 'Public',
            })}
            required={true}
            checked={inputData._public}
            onLabel={formatMessage({
              id: getTranslation('addVideoModal.field.public.on'),
              defaultMessage: 'True',
            })}
            offLabel={formatMessage({
              id: getTranslation('addVideoModal.field.public.off'),
              defaultMessage: 'False',
            })}
            onChange={handleSetPublic}
          />
          <br />

          <Tags
            handleSetTag={handleSetTag}
            handleRemoveTag={handleRemoveTag}
            tags={tags || []}
            editable={editable}
          />

          <MetadataTable
            metadata={metadata}
            handleSetMetadata={handleSetMetadata}
            handleRemoveMetadata={handleRemoveMetadata}
            editable={editable}
          />

          <LinksTable video={video} />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button onClick={close} variant="tertiary">
              {formatMessage({
                id: getTranslation('addVideoModal.cancel'),
                defaultMessage: 'Cancel',
              })}
            </Button>
          </Modal.Close>
          {editable && (
            <>
              <UpdateButton
                title={title}
                description={description || ''}
                _public={_public}
                tags={tags || []}
                metadata={metadata || []}
                id={video.documentId}
                videoId={video.videoId}
                update={update}
                close={close}
              />
            </>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default UpdateVideoModal;
