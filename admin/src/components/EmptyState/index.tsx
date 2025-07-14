import { useState, FC } from 'react';
import { Box, EmptyStateLayout, Button } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { Illo } from '../../assets/Illo';
import AddVideoModal from '../Modal/AddVideo';

interface IEmptyStateProps {
  update: () => void;
}

const EmptyState: FC<IEmptyStateProps> = ({ update }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Box padding={10} background="neutral100">
      <EmptyStateLayout
        icon={<Illo />}
        content="You don't have any videos yet"
        action={
          <Button variant="secondary" startIcon={<Plus />} onClick={() => setIsVisible(true)}>
            Add your first videos
          </Button>
        }
      />

      {isVisible && <AddVideoModal update={update} close={() => setIsVisible(false)} />}
    </Box>
  );
};

export default EmptyState;
