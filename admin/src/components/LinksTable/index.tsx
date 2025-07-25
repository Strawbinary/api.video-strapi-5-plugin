import {
  Button,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
  VisuallyHidden,
} from '@strapi/design-system';
import { Link } from '@strapi/icons';
import { FC, useState } from 'react';
import { replacePrivateVideoTokens } from '../../../../server/src/utils/private-videos';
import { CustomAssets } from '../../../../types';
import assetsRequests from '../../api/assets';
import { EnhancedCustomVideo } from '../../pages/HomePage';
import { SubTitle, Title } from '../../styles/form';
import { copyClipboard } from '../../utils';
import { useTheme } from '../../utils/hooks';

interface LinksProps {
  video: EnhancedCustomVideo;
}

const videoToAssets = (video: EnhancedCustomVideo): CustomAssets => {
  const assets = {
    hls: video.hls,
    iframe: video.iframe,
    mp4: video.mp4,
    player: video.player,
  };
  return assets;
};

const LinksTable: FC<LinksProps> = ({ video }) => {
  const [assets, setAssets] = useState<CustomAssets | undefined>(
    !!video?.token ? undefined : videoToAssets(video)
  );
  const theme = useTheme();
  const COL_COUNT = 4;
  const ROW_COUNT = 2;

  const isPrivate = !!video?.token;

  const generateToken = async () => {
    const token = (await assetsRequests.getToken(video.videoId)).data.token;
    setAssets(videoToAssets(await replacePrivateVideoTokens(video, token)));
  };

  return (
    <>
      <Title dark={theme === 'dark'} style={{ marginTop: '20px' }}>
        Links
      </Title>
      {isPrivate ? (
        <>
          <SubTitle>
            The URLs for assets of private videos can only be used once. To obtain new URLs, you can
            click on the button below to generate fresh links. Each time you access a private video
            through the Strapi Content API, a new set of private asset URLs will be generated.
          </SubTitle>
          <Button onClick={() => generateToken()}>Generate new urls</Button>
        </>
      ) : (
        <SubTitle>A list of links you can copy by clicking on the copy button.</SubTitle>
      )}

      {assets && (
        <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Type</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Link</Typography>
              </Th>
              <Th>
                <VisuallyHidden>Copy</VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(assets).map((links, index) => (
              <Tr key={index}>
                <Td>
                  <Typography textColor="neutral800">{links[0]}</Typography>
                </Td>
                <Td
                  style={{
                    flex: '1',
                    overflow: 'hidden',
                    maxWidth: '50ch',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography textColor="neutral800">{links[1]}</Typography>
                </Td>
                <Td>
                  <Flex justifyContent={'flex-end'}>
                    <IconButton
                      onClick={() => copyClipboard(links[1])}
                      label={'Copy'}
                      variant="ghost"
                    >
                      <Link />
                    </IconButton>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
};

export default LinksTable;
