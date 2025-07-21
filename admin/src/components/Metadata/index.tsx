import { useState, ChangeEvent, FC } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TFooter,
  Modal,
  Box,
  Button,
  Typography,
  TextInput,
  VisuallyHidden,
  Flex,
  IconButton,
  Field,
} from '@strapi/design-system';
import { Plus, Trash } from '@strapi/icons';
import { CustomBadge, SubTitle, Title } from '../../styles/form';
import { InputDataMetadata } from '../../../../types';
import { useTheme } from '../../utils/hooks';

interface MetadataTableProps {
  metadata?: {
    key: string;
    value: string;
  }[];
  handleSetMetadata: (metadata: InputDataMetadata) => void;
  handleRemoveMetadata: (metadata: InputDataMetadata) => void;
  editable: boolean;
}

const MetadataTable: FC<MetadataTableProps> = ({
  metadata,
  handleSetMetadata,
  handleRemoveMetadata,
  editable,
}) => {
  const [inputData, setInputData] = useState<InputDataMetadata>({
    key: '',
    value: '',
  });
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const { key, value } = inputData;
  const theme = useTheme();

  const clearInputData = () => setInputData({ key: '', value: '' });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputData((prevInputData) => ({ ...prevInputData, [name]: value }));
  };

  const saveMetadata = () => {
    handleSetMetadata({
      key: key,
      value: value,
    });
    closeModal();
  };

  const closeModal = () => {
    setModalIsVisible(false);
    clearInputData();
  };

  return (
    <>
      <Title dark={theme === 'dark'}>
        Metadata
        <CustomBadge active={metadata?.length !== 0}>{metadata?.length}</CustomBadge>
      </Title>
      <SubTitle>
        A list of key value pairs that you use to provide metadata for your video.
      </SubTitle>
      <Table
        colCount={5}
        rowCount={2}
        footer={
          <TFooter onClick={() => setModalIsVisible(true)} icon={<Plus />}>
            Add another metadata to this video
          </TFooter>
        }
      >
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Id</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Key</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Value</Typography>
            </Th>

            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {metadata?.map((entry, index) => (
            <Tr key={index}>
              <Td>
                <Typography textColor="neutral800">{index + 1}</Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">{entry.key}</Typography>
              </Td>
              <Td style={{ flex: '1' }}>
                <Typography textColor="neutral800">{entry.value}</Typography>
              </Td>
              <Td>
                {editable && (
                  <Flex justifyContent={'flex-end'}>
                    <IconButton
                      disabled={index === 0}
                      onClick={() => handleRemoveMetadata(entry)}
                      label={index === 0 ? "Default value, can't be deleted" : 'Delete'}
                      variant="ghost"
                    >
                      <Trash />
                    </IconButton>
                  </Flex>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {modalIsVisible && (
        <Modal.Root onOpenChange={closeModal} open={true}>
          <Modal.Content>
            <Modal.Header>
              <Typography fontWeight="bold" textColor="neutral800" variant="beta" id="title">
                Video metadata
              </Typography>
            </Modal.Header>
            <Modal.Body>
              <Flex gap={3}>
                <Box grow="1">
                  <Field.Root id="metadata_key">
                    <Field.Label>Key</Field.Label>
                    <TextInput
                      placeholder="Metadata key"
                      name="key"
                      onChange={handleChange}
                      value={key}
                    />
                  </Field.Root>
                </Box>
                <Box grow="1">
                  <Field.Root id="metadata_value">
                    <Field.Label>Value</Field.Label>
                    <TextInput
                      placeholder="Metadata value"
                      name="value"
                      onChange={handleChange}
                      value={value}
                    />
                  </Field.Root>
                </Box>
              </Flex>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button onClick={closeModal} variant="tertiary">
                  Cancel
                </Button>
              </Modal.Close>
              <Button onClick={saveMetadata}>Save</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      )}
    </>
  );
};

export default MetadataTable;
