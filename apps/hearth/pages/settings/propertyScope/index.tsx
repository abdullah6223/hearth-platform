import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { PropertyScopeSettingsContent } from '@hearth/domains/scope/components/PropertyScopeSettingsContent'
import { SettingsReadPermissionRequired } from '@hearth/domains/settings/components/PageAccess'


const PropertyScopesPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.hearth.settings.propertyScope.title' })

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <PropertyScopeSettingsContent />
                </PageContent>
            </PageWrapper>
        </>
    )
}

PropertyScopesPage.requiredAccess = SettingsReadPermissionRequired

export default PropertyScopesPage
