import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ConfigProvider } from 'antd'
import enUS from 'antd/lib/locale/en_US'
import ruRU from 'antd/lib/locale/ru_RU'
import dayjs from 'dayjs'
import { gql } from 'graphql-tag'
import get from 'lodash/get'
import getConfig from 'next/config'
import Head from 'next/head'
import React, { useContext, useEffect } from 'react'

import { withApollo } from '@open-hearth/next/apollo'
import { withAuth } from '@open-hearth/next/auth'
import { LocaleContext, useIntl, withIntl } from '@open-hearth/next/intl'

import GlobalStyle from '@app/hearth/domains/common/components/containers/GlobalStyle'
import { AppFrameWrapper } from '@miniapp/domains/common/components/AppFrameWrapper'
import { BaseLayout } from '@miniapp/domains/common/components/containers/BaseLayout'
import { useLaunchParams } from '@miniapp/domains/common/hooks/useLaunchParams'
import { withOidcAuth } from '@miniapp/domains/common/utils/oidcAuth'

import 'antd/dist/antd.less'
import '@open-hearth/ui/dist/styles.min.css'


const emotionCache = createCache({ key: 'css', prepend: true })

const {
    publicRuntimeConfig: {
        defaultLocale,
    },
} = getConfig()

interface ILocaleContext {
    setLocale: (lang: string) => void
    locale: string
}

const ANT_LOCALES = {
    ru: ruRU,
    en: enUS,
}
const ANT_DEFAULT_LOCALE = ruRU

const useHearthLocale = () => {
    const localeContext = useContext<ILocaleContext>(LocaleContext)
    const { context: launchContext, loading: launchContextLoading } = useLaunchParams()

    useEffect(() => {
        if (launchContextLoading) return
        if (!localeContext || !launchContext) return

        const locale = get(launchContext, 'hearthLocale', defaultLocale)
        localeContext.setLocale(locale)
    }, [launchContextLoading])
}

const MyApp = ({ Component, pageProps }) => {
    const intl = useIntl()

    useHearthLocale()
    dayjs.locale(intl.locale)

    const LayoutComponent = Component.container || BaseLayout
    const RequiredAccess = Component.requiredAccess || React.Fragment

    return (
        <>
            <Head>
                <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon'/>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
                />
            </Head>
            <GlobalStyle/>
            <AppFrameWrapper>
                <ConfigProvider locale={ANT_LOCALES[intl.locale] || ANT_DEFAULT_LOCALE} componentSize='large'>
                    <CacheProvider value={emotionCache}>
                        <LayoutComponent>
                            <RequiredAccess>
                                <Component {...pageProps} />
                            </RequiredAccess>
                        </LayoutComponent>
                    </CacheProvider>
                </ConfigProvider>
            </AppFrameWrapper>
        </>
    )
}

async function messagesImporter (locale) {
    return await import(`@app/miniapp/lang/${locale}/${locale}`)
}


const userFragment = `
  id
  name
  isAdmin
  isSupport
  email
  type
`

export const USER_QUERY = gql`
    query {
        authenticatedUser {
            ${userFragment}
        }
    }
`

const customAuthMutations = {
    USER_QUERY,
}

// Function to skip some HOC restrictions
const resolveBypass = ({ router }) => {
    // We do not need any hearth information here
    return router.route.includes('/grant-storage-access/')
}

export default (
    withApollo({ ssr: true })(
        withIntl({ ssr: true, messagesImporter })(
            withAuth({ ssr: true, ...customAuthMutations })(
                withOidcAuth({ resolveBypass })(
                    MyApp
                )
            )
        )
    )
)
