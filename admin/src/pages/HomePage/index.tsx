/*
 *
 * HomePage
 *
 */

import { Layouts } from '@strapi/admin/strapi-admin';
import { Page, useRBAC } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../utils/getTranslation';

import { PrivateVideoSession } from '@api.video/private-video-session';
import { CustomVideo } from '../../../../types';
import assetsRequests from '../../api/assets';
import settingsRequests from '../../api/settings';
import AddButton from '../../components/Button/AddButton';
import EmptyState from '../../components/EmptyState';
import SearchBar from '../../components/SearchBar';
import SetupNeeded from '../../components/SetupNeeded';
import VideoView from '../../components/Videos';
import { GridBroadcast } from '../../components/Videos/styles';
import { PLUGIN_ID } from '../../pluginId';

export type EnhancedCustomVideo = CustomVideo & {
  token?: string;
  privateSession?: string;
};

const HomePage = () => {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingConfiguration, setIsLoadingConfiguration] = useState(false);
  const [isConfigurated, setIsConfigurated] = useState(false);
  const [assets, setAssets] = useState<CustomVideo[]>([]);
  const [search, setSearch] = useState('');
  const { formatMessage } = useIntl();

  const { allowedActions, isLoading: isLoadingPermissions } = useRBAC([
    { action: `plugin::${PLUGIN_ID}.create`, subject: null },
    { action: `plugin::${PLUGIN_ID}.update`, subject: null },
    { action: `plugin::${PLUGIN_ID}.delete`, subject: null },
  ]);

  const fetchData = async () => {
    if (isLoadingData === false) setIsLoadingData(true);
    const data = await Promise.all(
      (await assetsRequests.getAllvideos()).data.map(
        async (video: CustomVideo): Promise<EnhancedCustomVideo> => {
          video._public = video._public ?? true;
          if (video._public) {
            return video;
          }
          const token = (await assetsRequests.getToken(video.videoId)).data.token;
          const privateSession = new PrivateVideoSession({
            token,
            videoId: video.videoId,
          });

          return {
            ...video,
            thumbnail: await privateSession.getThumbnailUrl(),
            privateSession: await privateSession.getSessionToken(),
            token,
          };
        }
      )
    );

    setIsLoadingData(false);
    setAssets(data);
  };

  const getApiKey = async () => {
    setIsLoadingConfiguration(true);
    const settings = await settingsRequests.get();
    setIsConfigurated(settings?.data.apiKey?.length > 0);
    setIsLoadingConfiguration(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    getApiKey();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
  };
  if (isLoadingConfiguration || isLoadingPermissions) return <Page.Loading />;

  return (
    <Layouts.Root>
      <Layouts.BaseHeader
        title={formatMessage({
          id: getTranslation('homePage.title'),
          defaultMessage: 'api.video uploader',
        })}
        subtitle={formatMessage({
          id: getTranslation('homePage.subtitle'),
          defaultMessage: 'Upload to and manage your api.video library directly within Strapi',
        })}
        variant="beta"
        primaryAction={
          isConfigurated && allowedActions.canCreate && <AddButton update={fetchData} />
        }
      />
      {isConfigurated ? (
        !isLoadingData && assets?.length > 0 ? (
          <Layouts.Content>
            <SearchBar
              search={search}
              handleSearch={(query) => handleSearch(query)}
              clearSearch={() => setSearch('')}
            />
            <GridBroadcast>
              {assets
                .filter((item) => item.title.includes(search))
                .map((video) => {
                  const { videoId } = video;
                  return (
                    <VideoView
                      video={video}
                      key={videoId}
                      updateData={fetchData}
                      editable={allowedActions.canUpdate}
                      deletable={allowedActions.canDelete}
                    />
                  );
                })}
            </GridBroadcast>
          </Layouts.Content>
        ) : (
          <EmptyState update={fetchData} />
        )
      ) : (
        <SetupNeeded />
      )}
    </Layouts.Root>
  );
};

export default () => (
  <Page.Protect permissions={[{ action: 'plugin::api-video-strapi-5-plugin.read', subject: null }]}>
    <HomePage />
  </Page.Protect>
);
