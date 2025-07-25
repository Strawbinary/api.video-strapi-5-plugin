import { FC } from 'react';
import { Dialog, Button, Typography, Flex } from '@strapi/design-system';
import { WarningCircle, Trash } from '@strapi/icons';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../utils/getTranslation';

interface IDialogDelete {
  title: string;
  isOpen: boolean;
  close: (isOpen: boolean) => void;
  deleteVideo: () => void;
}

const DialogDelete: FC<IDialogDelete> = ({ title, isOpen, close, deleteVideo }) => {
  const { formatMessage } = useIntl();
  return (
    <Dialog.Root onOpenChange={close} defaultOpen={true}>
      <Dialog.Content>
        <Dialog.Header>
          {formatMessage({
            id: getTranslation('dialog.confirmation'),
            defaultMessage: 'Confirmation',
          })}
        </Dialog.Header>
        <Dialog.Body icon={<WarningCircle />}>
          <Flex direction="column" gap={2}>
            <Flex justifyContent="center">
              <Typography id="confirm-description" textAlign={'center'}>
                {formatMessage({
                  id: getTranslation('dialog.message'),
                  defaultMessage: 'Are you sure you want to delete the video named',
                })}{' '}
                <Title>{title}</Title>?
              </Typography>
            </Flex>
          </Flex>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button variant="tertiary">
              {formatMessage({ id: getTranslation('dialog.cancel'), defaultMessage: 'Cancel' })}
            </Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button fullWidth startIcon={<Trash />} onClick={deleteVideo} variant="danger-light">
              {formatMessage({ id: getTranslation('dialog.confirm'), defaultMessage: 'Confirm' })}
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
