import { useState, FC } from 'react';
import { Button } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../../utils/getTranslation';

import { Plus } from '@strapi/icons';
import AddVideoModal from '../../Modal/AddVideo';

interface IAddButtonProps {
  update: () => void;
}

const AddButton: FC<IAddButtonProps> = ({ update }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <>
      <Button endIcon={<Plus />} onClick={() => setIsVisible(true)}>
        {formatMessage({
          id: getTranslation('addButton.label'),
          defaultMessage: 'Add a video',
        })}
      </Button>
      {isVisible && <AddVideoModal update={update} close={() => setIsVisible(false)} />}
    </>
  );
};

export default AddButton;
