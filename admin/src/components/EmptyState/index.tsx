import { useState, FC } from 'react';
import { Box, EmptyStateLayout, Button } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../utils/getTranslation';
import { Illo } from '../../assets/Illo';
import AddVideoModal from '../Modal/AddVideo';

interface IEmptyStateProps {
  update: () => void;
}

const EmptyState: FC<IEmptyStateProps> = ({ update }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <Box padding={10} background="neutral100">
      <EmptyStateLayout
        icon={<Illo />}
        content={formatMessage({
          id: getTranslation('emptyState.content'),
          defaultMessage: "You don't have any videos yet",
        })}
        action={
          <Button variant="secondary" startIcon={<Plus />} onClick={() => setIsVisible(true)}>
            {formatMessage({
              id: getTranslation('emptyState.action'),
              defaultMessage: 'Add your first videos',
            })}
          </Button>
        }
      />

      {isVisible && <AddVideoModal update={update} close={() => setIsVisible(false)} />}
    </Box>
  );
};

export default EmptyState;
