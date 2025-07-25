import { FC, useEffect, useState, useRef, ChangeEvent } from 'react';
import { Modal, Button, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../../utils/getTranslation';
import FieldComp from '../../FieldComp/Fields';
import UploadButton from '../../Button/UploadButton';
import ImportZone, { ImportZoneHandles } from './importZone';
import Tags from '../../Tags';
import Toggle from '../../Toggle';
import settingsRequests from '../../../api/settings';
import { InputData } from '../../../../../types';
import MetadataTable from '../../Metadata';

interface IAddVideoModalProps {
  close: () => void;
  update: () => void;
}

const AddVideoModal: FC<IAddVideoModalProps> = ({ update, close }): JSX.Element => {
  const [inputData, setInputData] = useState<InputData>({
    title: '',
    description: '',
    _public: true,
    tags: [],
    metadata: [
      {
        key: 'Upload source',
        value: 'Strapi',
      },
    ],
  });

  const [file, setFile] = useState<File | undefined>();
  const [initialState, setInitialState] = useState<number>(0);
  const { formatMessage } = useIntl();

  // CONSTANTS
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceRef = useRef<HTMLSourceElement>(null);
  const { title, description, _public, tags, metadata } = inputData;

  const importZoneRef = useRef<ImportZoneHandles>(null);

  const displayVideoFrame = (video: HTMLVideoElement, source: HTMLSourceElement, file: File) => {
    // Object Url as the video source
    source.setAttribute('src', URL.createObjectURL(file));
    // Load the video and show it
    video.load();
  };

  const getSettings = async () => {
    const settings = await settingsRequests.get();
    setInputData({ ...inputData, _public: settings.data.defaultPublic });
  };

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
    const newTags = inputData.tags && inputData.tags.filter((t) => t !== tag);
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

  const onFileSelected = (file: File) => {
    const video = importZoneRef.current?.video;
    const source = importZoneRef.current?.source;
    if (video && source) {
      displayVideoFrame(video, source, file);
    }

    setFile(file);
    setInputData((prevInputData) => ({
      ...prevInputData,
      title: file.name.replace(/\.[^/.]+$/, ''),
    }));
    if (initialState === 0) {
      setInitialState(1);
    }
    if (videoRef.current && sourceRef.current)
      displayVideoFrame(videoRef.current, sourceRef.current, file);
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <Modal.Root onOpenChange={close} open={true}>
      <Modal.Content>
        <Modal.Header>
          <Typography fontWeight="bold" textColor="neutral800" variant="beta" id="title">
            {formatMessage({
              id: getTranslation('addVideoModal.title'),
              defaultMessage: 'Upload a video',
            })}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <ImportZone
            initialState={initialState}
            onFileSelected={onFileSelected}
            ref={importZoneRef}
          />
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
            required
          />
          <br />

          <Toggle
            label={formatMessage({
              id: getTranslation('addVideoModal.field.public'),
              defaultMessage: 'Public',
            })}
            required={true}
            checked={_public}
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
            editable={true}
          />

          <MetadataTable
            metadata={metadata}
            handleSetMetadata={handleSetMetadata}
            handleRemoveMetadata={handleRemoveMetadata}
            editable={true}
          />
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
          <UploadButton
            currentFile={file}
            title={title}
            description={description}
            _public={_public}
            tags={tags || []}
            metadata={metadata || []}
            update={update}
            close={close}
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default AddVideoModal;
