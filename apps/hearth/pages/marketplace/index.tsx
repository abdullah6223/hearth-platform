import { AcquiringIntegrationTypeType } from '@app/hearth/schema'
import get from 'lodash/get'
import Head from 'next/head'
import React, { useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'

import { CONTEXT_FINISHED_STATUS } from '@hearth/domains/acquiring/constants/context'
import { AcquiringIntegrationContext } from '@hearth/domains/acquiring/utils/clientSchema'
import { AccessDeniedPage } from '@hearth/domains/common/components/containers/AccessDeniedPage'
import LoadingOrErrorPage from '@hearth/domains/common/components/containers/LoadingOrErrorPage'
import { usePreviousSortAndFilters } from '@hearth/domains/common/hooks/usePreviousQueryParams'
import { PageComponentType } from '@hearth/domains/common/types'
import { MarketplacePageContent } from '@hearth/domains/marketplace/components/MarketplacePageContent'
import {
    AcquiringContext as AcquiringContextProvider,
} from '@hearth/domains/marketplace/components/MarketplacePageContent/ContextProvider'
import { MarketplaceReadPermissionRequired } from '@hearth/domains/marketplace/components/PageAccess'
import { MANAGING_COMPANY_TYPE, SERVICE_PROVIDER_TYPE } from '@hearth/domains/organization/constants/common'

const MarketplacePage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.hearth.marketplace.title' })

    const { organization, link } = useOrganization()
    const orgId = get(organization, 'id', null)
    const employeeId = get(link, 'id')
    const isServiceProviderOrganization = useMemo(() => (get(organization, 'type', MANAGING_COMPANY_TYPE) === SERVICE_PROVIDER_TYPE), [organization])

    usePreviousSortAndFilters({ paramNamesForPageChange: ['tab'], employeeSpecificKey: employeeId })

    const {
        obj: acquiringIntegrationContext,
        loading,
        error,
        refetch: refetchAcquiringIntegrationContext,
    } = AcquiringIntegrationContext.useObject({
        where: {
            invoiceStatus_in: [CONTEXT_FINISHED_STATUS],
            organization: { id: orgId },
            integration: { type: AcquiringIntegrationTypeType.OnlineProcessing },
        },
    })

    const payload = useMemo(() => ({
        acquiringContext: acquiringIntegrationContext,
        refetchAcquiringContext: refetchAcquiringIntegrationContext,
    }), [acquiringIntegrationContext, refetchAcquiringIntegrationContext])

    if (isServiceProviderOrganization) return <AccessDeniedPage/>

    if (loading || error) {
        return <LoadingOrErrorPage title={PageTitle} error={error} loading={loading}/>
    }

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <AcquiringContextProvider.Provider value={payload}>
                <MarketplacePageContent/>
            </AcquiringContextProvider.Provider>
        </>
    )
}

MarketplacePage.requiredAccess = MarketplaceReadPermissionRequired

export default MarketplacePage
