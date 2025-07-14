import { ChangeEvent, useEffect, useState } from 'react';

import { Page, useNotification } from '@strapi/strapi/admin';

import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';
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
      <HeaderLayout
        title={'api.video uploader'}
        primaryAction={
          <Button type="submit" onClick={handleOnSubmit} startIcon={<Check />} size="L">
            Save
          </Button>
        }
      />

      <ContentLayout>
        <Box
          background="neutral0"
          hasRadius
          shadow="filterShadow"
          paddingTop={6}
          paddingBottom={6}
          paddingLeft={7}
          paddingRight={7}
        >
          <Stack size={4}>
            <Typography variant="delta" as="h2">
              Settings
            </Typography>
            <Grid gap={6}>
              <GridItem col={12} s={12}>
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
              </GridItem>
              <GridItem col={12} s={12}>
                <Toggle
                  label="Default Video Privacy"
                  checked={settings.defaultPublic}
                  required={true}
                  onLabel="Public"
                  offLabel="Private"
                  onChange={handleSetPublic}
                />
              </GridItem>
            </Grid>
          </Stack>
        </Box>
      </ContentLayout>
    </>
  );
};

export default () => (
  <Page.Protect permissions={pluginPermissions.settingsRoles}>
    <Settings />
  </Page.Protect>
);
