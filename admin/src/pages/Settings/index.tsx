import { ChangeEvent, useEffect, useState } from 'react';
import { Page, useNotification } from '@strapi/strapi/admin';
import { Box, Button, Grid } from '@strapi/design-system';
import { Layouts } from '@strapi/admin/strapi-admin';
import { Flex, Typography } from '@strapi/design-system';
import { Check } from '@strapi/icons';

import { CustomSettings } from '../../../../types';
import settingsRequests from '../../api/settings';
import FieldComp from '../../components/FieldComp/Fields';
import Toggle from '../../components/Toggle';

const Settings = () => {
  const [settings, setSettings] = useState<CustomSettings>({
    apiKey: '',
    defaultPublic: true,
  });
  const { toggleNotification } = useNotification();

  const getSettings = async () => {
    const settings = await settingsRequests.get();
    setSettings(settings.data);
  };

  useEffect(() => {
    getSettings();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, apiKey: event.target.value });
  };

  const handleSetPublic = (event: ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, defaultPublic: event.target.checked });
  };

  const handleOnSubmit = async () => {
    const response = await settingsRequests.update(settings);

    if (response) {
      toggleNotification({
        type: 'success',
        message: 'Changes saved',
      });
    } else {
      toggleNotification({
        type: 'warning',
        message: 'Please enter valid settings',
      });
    }
  };

  return (
    <>
      <Layouts.Header
        title={'api.video plugin settings'}
        primaryAction={
          <Button type="submit" onClick={handleOnSubmit} startIcon={<Check />} size="L">
            Save
          </Button>
        }
      />

      <Layouts.Content>
        <Box
          background="neutral0"
          hasRadius
          shadow="filterShadow"
          paddingTop={6}
          paddingBottom={6}
          paddingLeft={7}
          paddingRight={7}
        >
          <FieldComp
            name="API Key"
            label="API Key"
            value={settings.apiKey}
            placeholder="Enter your API Key"
            description="Generated in the api.video's dashboard and used for authenticating API calls."
            detailsLink="https://dashboard.api.video"
            isPassword
            onChange={handleChange}
          />
          <br />
          <Toggle
            label="Default Video Privacy"
            checked={settings.defaultPublic}
            required={true}
            onLabel="Public"
            offLabel="Private"
            onChange={handleSetPublic}
          />
        </Box>
      </Layouts.Content>
    </>
  );
};

export default () => (
  <Page.Protect permissions={[{ action: 'plugin::api-video-strapi-5-plugin.settings.read', subject: null }]}>
    <Settings />
  </Page.Protect>
);
