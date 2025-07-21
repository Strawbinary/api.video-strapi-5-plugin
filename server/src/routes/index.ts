import apiVideoContentApiRoutes from './content-api-routes'
import apiVideoAdminRoutes from './admin-routes'
import apiVideoSettingsRoutes from './settings-routes'

const routes = {
    // routes for the admin panel (/api-video-strapi-5-plugin/api-video-asset/...)
    admin: {
        type: 'admin',
        routes: apiVideoAdminRoutes,
    },
    // routes for the plugin settings panel (/api-video-strapi-5-plugin/settings)
    settings: {
        routes: apiVideoSettingsRoutes,
    },
    // routes for the content api (/api/api-video-strapi-5-plugin/...)
    // Must be prefixed with 'api-video-asset' to match the name of the content type
    'api-video-asset': {
        type: 'content-api',
        routes: apiVideoContentApiRoutes,
    },
}

export default routes
