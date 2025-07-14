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
import pluginPermissions from '../../permissions';

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
        title={'api.video uploader'}
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
          <Flex direction="column" gap={4}>
            <Typography variant="delta">Settings</Typography>
            <Grid.Root gap={6}>
              <Grid.Item col={12} s={12}>
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
              </Grid.Item>
              <Grid.Item col={12} s={12}>
                <Toggle
                  label="Default Video Privacy"
                  checked={settings.defaultPublic}
                  required={true}
                  onLabel="Public"
                  offLabel="Private"
                  onChange={handleSetPublic}
                />
              </Grid.Item>
            </Grid.Root>
          </Flex>
        </Box>
      </Layouts.Content>
    </>
  );
};

export default () => (
  <Page.Protect permissions={pluginPermissions.settingsRoles}>
    <Settings />
  </Page.Protect>
);
