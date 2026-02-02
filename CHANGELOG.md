# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 1.1.0 (2026-02-02)


### Features

* add analytics widget ([23a2360](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/23a2360126e071c47a9e05ae621ba43393dc619d))
* add settings page ([6f3c927](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/6f3c927cc4fa278413bb5ad1a39306580f90f3d1))
* add transform resolver for ApiVideoUploaderApiVideoAssetEntity ([5bc786f](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/5bc786f3d57cde51cd86d09167a592c6ea852839))
* add translations and adjust widget chart ([ffd7c01](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/ffd7c01fd1718385f7d6f12055e09f38446e6e46))
* add video duration webhook endpoint and migration for existing data ([84a515a](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/84a515a0fd1ce32f1f7d4f89489186d0b41c6eeb))
* check permissions in routers ([760179a](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/760179a530b96c1d2a073a74c58e478458c94e95))
* improve permission handling ([e7721f5](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/e7721f5abaf0059c36a2e7fdd83dece0c4c0c6fa))
* Improve UI ([c3b2570](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/c3b25708f2948392f57c4f6841c7fe6ced1ca4bf))
* **metadata:** Use Strapi design system ([8ef382d](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/8ef382db8b8bf5df32881ff71d6242268d4009a4))
* remove unused resolvers ([20527b9](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/20527b91518c6e6f7bb3550b39e58f6aea14a433))
* Use CreatableCombobox for video tags ([56d7fd2](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/56d7fd2db1ec6f5374eec7dfeea739c4822a7ec8))
* use getFetchClient ([aec90f9](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/aec90f900162616b9d88ebeeb7d88876ea24a7b4))
* Video description required ([069f0d5](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/069f0d5376c23036e22bab1662a6147dc2638a90))
* **video_card:** Follow Strapi design ([db2c35a](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/db2c35aa05764b8e641865b8fd2f1989f5ca3158))
* **video_card:** Follow Strapi design ([644bca9](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/644bca9fdd94340fd40fbea97f75a3333058e929))
* **video_tags:** Use Combobox ([12d1cc0](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/12d1cc0d91bd1839432ddc8eec21361bb5d433bf))


### Bug Fixes

* controllers and upload modal ([45a671b](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/45a671bef4d2eb4966f11e9aa82054ffc16c1a9e))
* graphql queries and permissions working ([4cb0be4](https://github.com/Strawbinary/api.video-strapi-5-plugin/commit/4cb0be4c7d5627678799b745de0a18f0909a855d))

## 1.0.1 (2025-07-27)

### ⚙️ Chore

- add MIT license
- add minor changes to readme and package.json
- add changelog file

## 1.0.0 (2025-07-25)

### 🚀 New feature

- initial release for Strapi v5
- use Strapi's native Document API for video record management
- upload, browse, manage and play videos in a grid view
- protected settings page for api.video API key and default visibility
- RBAC-based access control using Page.Protect
- new dashboard widget: "Top 5 Videos" with usage analytics
- i18n support: English, German, Russian

### 🔥 Improvement

- redesigned UI based on the Strapi Design System
- improved upload dialog and metadata handling
- updated package name and namespace to @strawbinary-io/video-plugin
