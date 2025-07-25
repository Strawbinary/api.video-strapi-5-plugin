import { ChartCircle } from '@strapi/icons';

import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: async () => {
        const App = await import('./pages/App');

        return App;
      },
    });

    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}.plugin.name`,
          defaultMessage: 'api.video Plugin',
        },
      },
      [
        {
          intlLabel: {
            id: `${PLUGIN_ID}.plugin.name`,
            defaultMessage: 'api.video Plugin settings',
          },
          id: 'settings',
          to: `/settings/${PLUGIN_ID}`,
          Component: async () => {
            return import('./pages/Settings');
          },
        },
      ]
    );

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.widgets.register({
      icon: ChartCircle,
      title: {
        id: `${PLUGIN_ID}.widget.top5videos`,
        defaultMessage: 'API.video Top 5 Videos',
      },
      component: async () => {
        const component = await import('./components/Widgets/Top5Videos');
        return component.default;
      },
      id: `widget.top5videos`,
      pluginId: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
