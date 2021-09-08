import get from 'lodash/get'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'
import { Typography } from '@open-hearth/ui'

import { Dashboard } from '@hearth/domains/analytics/components/Dashboard'
import { AccessDeniedPage } from '@hearth/domains/common/components/containers/AccessDeniedPage'
import { PageContent, PageHeader, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'
import { MANAGING_COMPANY_TYPE } from '@hearth/domains/organization/constants/common'


const IndexPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id: 'pages.hearth.analytics.index.PageTitle' })

    const { organization, link } = useOrganization()

    const canReadAnalytics = get(link, [ 'role', 'canReadAnalytics'], false)
        && get(organization, 'type') === MANAGING_COMPANY_TYPE

    if (!canReadAnalytics) {
        return <AccessDeniedPage />
    }

    return (
        <>
            <Head>
                <title>{PageTitleMsg}</title>
            </Head>
            <PageWrapper>
                <PageHeader title={<Typography.Title>{PageTitleMsg}</Typography.Title>} />
                <PageContent>
                    <Dashboard organizationId={organization.id} />
                </PageContent>
            </PageWrapper>
        </>
    )
}

IndexPage.requiredAccess = OrganizationRequired

export default IndexPage
