import conf from '@open-hearth/config'
import {antGlobalVariables} from '@hearth/domains/common/constants/style'
import {DEFAULT_LOCALE} from '@{{name}}/domains/common/constants'
import type { NextConfig } from 'next'

const serverUrl = conf['SERVER_URL']
const apolloGraphQLUrl = `${serverUrl}/graphql`
const hearthUrl = conf['HEARTH_DOMAIN']
const b2bAppId = conf['HEARTH_B2B_APP_ID'] || null
const defaultLocale = DEFAULT_LOCALE

const nextConfig: NextConfig = {
    publicRuntimeConfig: {
        // Will be available on both server and client
        serverUrl,
        apolloGraphQLUrl,
        hearthUrl,
        b2bAppId,
        defaultLocale,
    },
    lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: antGlobalVariables,
    },
    webpack: (config) => {

        return config
    },
}

export default nextConfig