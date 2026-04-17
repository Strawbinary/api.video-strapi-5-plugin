import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useNotification } from '@strapi/strapi/admin';
import { Button } from '@strapi/design-system';
import { Trash, Upload } from '@strapi/icons';
import { getTranslation } from '../../../utils/getTranslation';
import { useTheme } from '../../../utils/hooks';

interface ThumbnailImportZoneProps {
  initialThumbnail?: string;
  showResetMessage?: boolean;
  onFileSelected: (file: File) => void;
  onFileCleared?: () => void;
}

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

const ThumbnailImportZone = ({
  initialThumbnail,
  showResetMessage,
  onFileSelected,
  onFileCleared,
}: ThumbnailImportZoneProps) => {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const generatedPreview = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);

      if (generatedPreview.current) {
        URL.revokeObjectURL(generatedPreview.current);
      }

      generatedPreview.current = objectUrl;
      setPreviewUrl(objectUrl);
      return;
    }

    if (showResetMessage) {
      if (generatedPreview.current) {
        URL.revokeObjectURL(generatedPreview.current);
        generatedPreview.current = undefined;
      }
      setPreviewUrl(undefined);
      return;
    }

    if (!initialThumbnail) {
      if (generatedPreview.current) {
        URL.revokeObjectURL(generatedPreview.current);
        generatedPreview.current = undefined;
      }
      setPreviewUrl(undefined);
      return;
    }

    let cancelled = false;

    const loadRemoteThumbnail = async () => {
      try {
        const response = await fetch(initialThumbnail);
        if (!response.ok) {
          throw new Error(`Failed to load thumbnail: ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        if (generatedPreview.current) {
          URL.revokeObjectURL(generatedPreview.current);
        }

        generatedPreview.current = objectUrl;
        setPreviewUrl(objectUrl);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setPreviewUrl(initialThumbnail);
        }
      }
    };

    loadRemoteThumbnail();

    return () => {
      cancelled = true;
    };
  }, [initialThumbnail, selectedFile, showResetMessage]);

  useEffect(() => {
    return () => {
      if (generatedPreview.current) {
        URL.revokeObjectURL(generatedPreview.current);
      }
    };
  }, []);

  const openFilePicker = () => {
    if (inputFile.current) {
      inputFile.current.value = '';
    }
    inputFile.current?.click();
  };

  const setFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: getTranslation('thumbnailImportZone.onlyImage'),
          defaultMessage: 'Only JPG, PNG, or WEBP images are allowed',
        }),
      });
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();

    let file: File | null = null;

    if (ev.dataTransfer.items) {
      if (ev.dataTransfer.items.length > 1) {
        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: getTranslation('thumbnailImportZone.onlyOneFile'),
            defaultMessage: 'Only one file is allowed',
          }),
        });
        return;
      }

      const item = ev.dataTransfer.items[0];
      if (item.kind === 'file') {
        file = item.getAsFile();
      }
    } else if (ev.dataTransfer.files) {
      if (ev.dataTransfer.files.length > 1) {
        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: getTranslation('thumbnailImportZone.onlyOneFile'),
            defaultMessage: 'Only one file is allowed',
          }),
        });
        return;
      }

      file = ev.dataTransfer.files[0];
    }

    if (file) {
      setFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (generatedPreview.current) {
      URL.revokeObjectURL(generatedPreview.current);
      generatedPreview.current = undefined;
    }
    if (inputFile.current) {
      inputFile.current.value = '';
    }
    setSelectedFile(undefined);
    onFileCleared?.();
  };

  const hasPreview = Boolean(previewUrl);
  const isResetMessageVisible = Boolean(showResetMessage && !selectedFile);

  return (
    <Wrapper onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={openFilePicker}>
      {isResetMessageVisible ? (
        <ResetNotice dark={theme === 'dark'}>
          {formatMessage({
            id: getTranslation('thumbnailImportZone.resetting'),
            defaultMessage: 'Das Zurücksetzen des Thumbnails dauert ein paar Minuten',
          })}
        </ResetNotice>
      ) : hasPreview ? (
        <Preview src={previewUrl} alt="thumbnail preview" />
      ) : (
        <Placeholder dark={theme === 'dark'}>
          {formatMessage({
            id: getTranslation('thumbnailImportZone.select'),
            defaultMessage: 'Select a thumbnail image',
          })}
          <Subtitle>
            {formatMessage({
              id: getTranslation('thumbnailImportZone.orDragDrop'),
              defaultMessage: 'or drag and drop it here',
            })}
          </Subtitle>
        </Placeholder>
      )}

      <Actions>
        <Button startIcon={<Upload />} variant="secondary" onClick={(e) => {
          e.stopPropagation();
          openFilePicker();
        }}>
          {formatMessage({
            id: getTranslation('thumbnailImportZone.replace'),
            defaultMessage: hasPreview ? 'Replace thumbnail' : 'Upload thumbnail',
          })}
        </Button>
        {hasPreview && (
          <Button startIcon={<Trash />} variant="tertiary" onClick={handleClear}>
            {formatMessage({
              id: getTranslation('thumbnailImportZone.clear'),
              defaultMessage: 'Clear',
            })}
          </Button>
        )}
      </Actions>

      <input
        type="file"
        id="thumbnail-upload"
        accept="image/jpeg,image/png,image/webp"
        ref={inputFile}
        name="thumbnail"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
    </Wrapper>
  );
};

export default ThumbnailImportZone;

const Wrapper = styled.div`
  width: 100%;
  min-height: 260px;
  border: 1px dashed #eaeaea;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: border 0.4s ease-in-out;
  margin: 20px 0;
  padding: 16px;

  &:hover {
    border: 1px dashed #4642eb;
  }
`;

const Placeholder = styled.div<{ dark: boolean }>`
  min-height: 160px;
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(p) => (p.dark ? '#ffffff' : '#32324d')};
  background: ${(p) => (p.dark ? 'rgba(255,255,255,0.04)' : '#f6f6f9')};
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 20px;
`;

const Subtitle = styled.p`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  color: #666687;
`;

const Preview = styled.img`
  width: 100%;
  max-width: 420px;
  max-height: 220px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const ResetNotice = styled.div<{ dark: boolean }>`
  min-height: 160px;
  width: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: ${(p) => (p.dark ? 'rgba(255,255,255,0.04)' : '#f6f6f9')};
  color: ${(p) => (p.dark ? '#ffffff' : '#32324d')};
  font-size: 18px;
  font-weight: 600;
  padding: 20px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;
