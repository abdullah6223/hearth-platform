import { AcquiringIntegrationTypeType } from '@app/hearth/schema'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'


import { useOrganization } from '@open-hearth/next/organization'

import { AcquiringIntegrationContext as AcquiringIntegrationContextApi } from '@hearth/domains/acquiring/utils/clientSchema'
import LoadingOrErrorPage from '@hearth/domains/common/components/containers/LoadingOrErrorPage'
import { extractOrigin } from '@hearth/domains/common/utils/url.utils'
import { MARKETPLACE_SETUP_URL_PATH } from '@hearth/domains/marketplace/constants'
import { B2BAppFrame } from '@hearth/domains/miniapp/components/B2BAppFrame'


type SetupAcquiringProps = {
    onFinish: () => void
}

export const OfferSetupPage: React.FC<SetupAcquiringProps> = ({ onFinish }) => {
    const router = useRouter()

    const { organization } = useOrganization()
    const orgId = get(organization, 'id', null)
    const {
        obj: acquiringContext,
        loading: acquiringContextLoading,
        error: acquiringContextError,
    } = AcquiringIntegrationContextApi.useObject({
        where: {
            organization: { id: orgId },
            integration: { type: AcquiringIntegrationTypeType.OnlineProcessing },
        },
    })

    const acquiringContextId = get(acquiringContext, 'id', null)
    const acquiringIntegrationHostUrl = get(acquiringContext, ['integration', 'hostUrl'])

    useEffect(() => {
        if (
            (!acquiringContextLoading && !acquiringContextError)
            && (
                !acquiringContextId
                || !get(acquiringContext, ['invoiceRecipient', 'bankAccount'])
                || !get(acquiringContext, ['invoiceRecipient', 'bic'])
                || !get(acquiringContext, ['invoiceRecipient', 'tin'])
                || !get(acquiringContext, 'invoiceTaxRegime')
            )
        ) {
            router.replace({ query: { step: 0 } }, undefined, { shallow: true })
        }
    }, [acquiringContextId, router, acquiringContext, acquiringContextLoading, acquiringContextError])

    const setupUrl = `${acquiringIntegrationHostUrl}${MARKETPLACE_SETUP_URL_PATH}`
    const setupOrigin = extractOrigin(setupUrl)

    const handleDoneMessage = useCallback((event: MessageEvent) => {
        if (event.origin === setupOrigin && get(event.data, 'success') === true) {
            onFinish()
        }
    }, [setupOrigin, onFinish])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('message', handleDoneMessage)

            return () => window.removeEventListener('message', handleDoneMessage)
        }
    }, [handleDoneMessage])

    if (!acquiringContext || !!acquiringContextLoading || !!acquiringContextError) {
        return <LoadingOrErrorPage loading={acquiringContextLoading} error={acquiringContextError}/>
    }

    return <B2BAppFrame src={setupUrl} initialHeight={400}/>
}
