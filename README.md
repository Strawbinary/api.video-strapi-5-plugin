# Strapi v5 – api.video Uploader

A powerful Strapi plugin to easily manage your videos and integrate them in your project.

**Core Contributor**: [Strawbinary](https://github.com/Strawbinary)  
Follow [@strawbinary](https://www.linkedin.com/company/strawbinary-gbr/ )

---

![Plugin UI Preview](public/assets/preview_dark.png)

## ✨ Features

- **Upload videos** directly from your Strapi admin via file picker to [api.video](https://api.video)  
- **Manage assets** with a responsive grid and built-in pagination  
- **Search** your library by title or tags  
- **Preview** with the embedded api.video player ([api.video-player-react](https://github.com/apivideo/api.video-react-player))  
- **Delete** assets (removes on both Strapi and api.video sides)

## ⏳ Installation

This plugin is published on npm. You can install it with your preferred package manager—npm, yarn, or pnpm.

```bash
# Using npm (recommended)
npm install @strawbinary-io/api-video-strapi-5-plugin@latest

# Or with yarn
yarn add @strawbinary-io/api-video-strapi-5-plugin@latest

# Or with pnpm
pnpm add @strawbinary-io/api-video-strapi-5-plugin@latest
```

After installation, rebuild your Strapi admin:

```bash
npm run build
npm run develop
```

Once Strapi is up, the **API.VIDEO** plugin will in the sidebar.

## 🖐 Requirements

- **api.video**
  - An [api.video](https://api.video) account
  - An API key from the [api.video Dashboard](https://dashboard.api.video/apikeys)
- **Node.js**
  - Version: 18.x – 20.x
- **Strapi**
  - Strapi v5 only (not compatible with v4 or earlier)

## 🔧 Configuration

Before using the plugin, you must supply your api.video API key in Strapi’s settings panel.

1. In Strapi Admin, go to **Settings** → **API.VIDEO Plugin**.
2. Enter your API key and click **Save**.

### Content Security Policy

To allow thumbnails, embeds and the player to load correctly, update your `config/middlewares.ts` file with the following security entry:

```ts
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'embed.api.video',
            'cdn.api.video/vod/',
          ],
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          'frame-src': ["'self'", 'data:', 'blob:', 'embed.api.video'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## 👤 Permissions

Configure fine-grained permissions under **Roles & Permissions** → **Plugins**.

## 💾 Metadata

By default, uploads carry an `uploadSource` metadata field set to `"Strapi"`. This cannot be changed.

## 🤝 Contributing

We welcome contributions, issues and feature requests!

- Report bugs or request features in the [issue tracker](https://github.com/Strawbinary/api.video-strapi-5-plugin/issues)

## 📚 References

- [api.video Documentation](https://docs.api.video/docs/apivideo-api-reference)
- [Strapi Documentation](https://docs.strapi.io)
