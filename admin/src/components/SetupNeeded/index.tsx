import { Box, EmptyStateLayout, Button } from '@strapi/design-system';
import { ArrowRight } from '@strapi/icons';
import { Illo } from '../../assets/Illo';
import { useNavigate } from 'react-router-dom';
import { PLUGIN_ID } from '../../pluginId';

const SetupNeeded = () => {
  const navigate = useNavigate();
  const onSettingsClick = () => {
    navigate(`/settings/${PLUGIN_ID}`);
  };
  return (
    <Box padding={10} background="neutral100">
      <EmptyStateLayout
        icon={<Illo />}
        content="In order for uploads to function, an administrator will need to complete the setup of this plugin by visiting the settings page. Click the button below to be taken there now."
        action={
          <Button variant="default" endIcon={<ArrowRight />} onClick={onSettingsClick}>
            Go to settings
          </Button>
        }
      />
    </Box>
  );
};

export default SetupNeeded;
