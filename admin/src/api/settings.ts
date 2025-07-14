import { useFetchClient } from '@strapi/strapi/admin';
import { CustomSettings } from '../../../types'

import {PLUGIN_ID} from '../pluginId'

const settingsRequests = {
    get: async () => {
        const { get } = useFetchClient();
        return await get(`/${PLUGIN_ID}/settings`)
    },
    update: async (body: Object) => {
        const { post } = useFetchClient();
        return await post(`/${PLUGIN_ID}/settings`, {
            body,
        })
    },
}

export default settingsRequests
