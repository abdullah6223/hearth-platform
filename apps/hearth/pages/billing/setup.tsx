import React, { useCallback, useMemo } from 'react'

import { useFeatureFlags } from '@open-hearth/featureflags/FeatureFlagsContext'
import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'

import { AcquiringIntegrationContext as AcquiringContext } from '@hearth/domains/acquiring/utils/clientSchema'
import { BillingAndAcquiringContext } from '@hearth/domains/billing/components/BillingPageContent/ContextProvider'
import { BillingOnboardingCombinedFlowPage } from '@hearth/domains/billing/components/OnBoarding/BillingOnboardingCombinedFlowPage'
import { BillingIntegrationOrganizationContext as BillingContext } from '@hearth/domains/billing/utils/clientSchema'
import { AccessDeniedPage } from '@hearth/domains/common/components/containers/AccessDeniedPage'
import LoadingOrErrorPage from '@hearth/domains/common/components/containers/LoadingOrErrorPage'
import { UI_BILLING_SPP_COMBINED_PAGE } from '@hearth/domains/common/constants/featureflags'
import { PageComponentType } from '@hearth/domains/common/types'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'

const SetupBillingPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'global.section.accrualsAndPayments' })

    const { useFlag } = useFeatureFlags()
    const isCombinedFlow = useFlag(UI_BILLING_SPP_COMBINED_PAGE)

    const userOrganization = useOrganization()
    const orgId = userOrganization?.organization?.id ?? null

    const { objs: billingContexts, loading: billingLoading, error: billingError, refetch: refetchBilling } = BillingContext.useObjects({
        where: {
            organization: { id: orgId },
            deletedAt: null,
        },
    }, { skip: !orgId })

    const { objs: acquiringContexts, loading: acquiringLoading, error: acquiringError, refetch: refetchAcquiring } = AcquiringContext.useObjects({
        where: {
            organization: { id: orgId },
            deletedAt: null,
        },
    }, { skip: !orgId })

    const handleFinishSetup = useCallback(() => {
        refetchBilling().then(() => refetchAcquiring())
    }, [refetchBilling, refetchAcquiring])

    const providerValue = useMemo(() => ({
        billingContexts: billingContexts,
        acquiringContexts: acquiringContexts,
        refetchBilling,
    }), [acquiringContexts, billingContexts, refetchBilling])

    if (acquiringLoading || acquiringError || billingLoading || billingError) {
        return (
            <LoadingOrErrorPage
                title={PageTitle}
                error={acquiringError || billingError}
                loading={acquiringLoading || billingLoading}
            />
        )
    }
    if (!isCombinedFlow) {
        return <AccessDeniedPage />
    }

    return (
        <BillingAndAcquiringContext.Provider value={providerValue}>
            <BillingOnboardingCombinedFlowPage onFinish={handleFinishSetup}/>
        </BillingAndAcquiringContext.Provider>
    )
}

SetupBillingPage.requiredAccess = OrganizationRequired

export default SetupBillingPage
