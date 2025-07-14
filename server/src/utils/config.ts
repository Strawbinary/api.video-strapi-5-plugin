import ApiVideoClient from '@api.video/nodejs-client'
import * as packageJson from '../../../package.json'
import { CustomSettings } from '../../../types'
import { PLUGIN_ID } from '../../../admin/src/pluginId'

const getConfig = async () => {
    const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: 'plugin',
        name: PLUGIN_ID,
    })

    const defaultPublic = await pluginStore.get({
        key: 'defaultPublic',
    })

    const configKey = await pluginStore.get({
        key: 'apiKey',
    })

    const res: CustomSettings = {
        apiKey: configKey as string,
        defaultPublic: defaultPublic as boolean ?? true,
    }
    return res;
}

const isValidApiKey = async (apiKey: string) => {
    const client = await configClient(apiKey)

    try {
        const { accessToken } = await client.getAccessToken()
        return accessToken ? true : false
    } catch (error) {
        return false
    }
}

const configClient = async (apiKey?: string) => new ApiVideoClient({
    apiKey: apiKey ? apiKey : (await getConfig()).apiKey,
    sdkName: 'strapi-plugin',
    sdkVersion: packageJson.version,
})

export { getConfig, isValidApiKey, configClient }
