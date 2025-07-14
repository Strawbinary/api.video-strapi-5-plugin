import { FC } from 'react';
import { Dialog, Button, Typography, Flex } from '@strapi/design-system';
import { WarningCircle, Trash } from '@strapi/icons';
import styled from 'styled-components';

interface IDialogDelete {
  title: string;
  isOpen: boolean;
  close: (isOpen: boolean) => void;
  deleteVideo: () => void;
}

const DialogDelete: FC<IDialogDelete> = ({ title, isOpen, close, deleteVideo }) => {
  return (
    <Dialog.Root onOpenChange={close}>
      <Dialog.Content>
        <Dialog.Header>Confirmation</Dialog.Header>
        <Dialog.Body icon={<WarningCircle />}>
          <Flex direction="column" gap={2}>
            <Flex justifyContent="center">
              <Typography id="confirm-description" textAlign={'center'}>
                Are you sure you want to delete the video named <Title>{title}</Title>?
              </Typography>
            </Flex>
          </Flex>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button variant="tertiary">
              Cancel
            </Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button fullWidth startIcon={<Trash />} onClick={deleteVideo} variant="danger-light">
              Confirm
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DialogDelete;

const Title = styled.span`
  font-weight: bold;
`;
