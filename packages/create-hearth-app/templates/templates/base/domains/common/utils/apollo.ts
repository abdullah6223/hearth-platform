import getConfig from 'next/config'

import { ApolloHelper } from '@open-hearth/apollo'
import type { InitCacheConfig, UseApollo } from '@open-hearth/apollo'
import { getTracingMiddleware } from '@open-hearth/miniapp-utils/helpers/apollo'


import { AUTH_TOKEN_KEY } from '@/domains/user/constants/auth'

import type { ApolloClient, NormalizedCacheObject, DefaultContext, RequestHandler } from '@apollo/client'

const { publicRuntimeConfig: { hearthDomain, revision } } = getConfig()

/**
 * Caching configuration for Apollo client. By default, all queries are cached for 15 minutes and cache key consists of all args.
 * If you want to change that behavior, you can use list helpers from `@open-hearth/apollo`.
 * @param _cacheOptions
 */
const cacheConfig: InitCacheConfig = (_cacheOptions) => {
    return {
        invalidationPolicies: {
            timeToLive: 15 * 60 * 1000, // 15 minutes in milliseconds
        },
    }
}

function getAuthMiddleware (): RequestHandler {
    return function (operation, forward) {
        operation.setContext((previousContext: DefaultContext) => {
            const { headers: previousHeaders } = previousContext

            const authToken = typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null
            const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {}

            return {
                ...previousContext,
                headers: {
                    ...previousHeaders,
                    ...authHeaders,
                },
            }
        })

        return forward(operation)
    }
}

const apolloHelper = new ApolloHelper({
    uri: `${hearthDomain}/admin/api`,
    cacheConfig,
    middlewares: [
        getTracingMiddleware({
            serviceUrl: typeof window !== 'undefined' ? window?.location.origin : '',
            codeVersion: revision ?? '',
            target: 'miniapps',
        }),
        getAuthMiddleware(),
    ],
})

export const useApollo = apolloHelper.generateUseApolloHook() as unknown as UseApollo<ApolloClient<NormalizedCacheObject>>

