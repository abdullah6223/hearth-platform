import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useFeatureFlags } from '@open-hearth/featureflags/FeatureFlagsContext'
import { useIntl } from '@open-hearth/next/intl'

import LoadingOrErrorPage from '@hearth/domains/common/components/containers/LoadingOrErrorPage'
import { SERVICE_PROVIDER_PROFILE, UI_BILLING_SPP_COMBINED_PAGE } from '@hearth/domains/common/constants/featureflags'
import { useGlobalHints } from '@hearth/domains/common/hooks/useGlobalHints'
import { PageComponentType } from '@hearth/domains/common/types'
import { BillingAppPage } from '@hearth/domains/miniapp/components/AppIndex'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'


const { publicRuntimeConfig: {
    sppConfig,
} } = getConfig()

const ServiceProviderProfilePage: PageComponentType = () => {
    const intl = useIntl()
    const router = useRouter()
    const PageTitle = intl.formatMessage({ id: 'global.section.SPP' })
    const NoPermissionsMessage = intl.formatMessage({ id: 'global.noPageViewPermission' })
    const { useFlag } = useFeatureFlags()
    const isSPPOrg = useFlag(SERVICE_PROVIDER_PROFILE)
    const isCombinedBillingPageEnabled = useFlag(UI_BILLING_SPP_COMBINED_PAGE)
    const { GlobalHints } = useGlobalHints()

    useEffect(() => {
        if (isSPPOrg && isCombinedBillingPageEnabled) {
            router.replace('/billing')
        }
    }, [isCombinedBillingPageEnabled, isSPPOrg, router])

    if (isSPPOrg && isCombinedBillingPageEnabled) {
        return null
    }

    if (sppConfig && 'BillingIntegrationId' in sppConfig && isSPPOrg) {
        return (
            <BillingAppPage id={sppConfig.BillingIntegrationId} title={PageTitle}>
                {GlobalHints}
            </BillingAppPage>
        )
    }

    return <LoadingOrErrorPage title={PageTitle} error={NoPermissionsMessage}/>
}

ServiceProviderProfilePage.requiredAccess = OrganizationRequired

export default ServiceProviderProfilePage
