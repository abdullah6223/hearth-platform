import { AcquiringIntegrationContext } from '@app/hearth/schema'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Button } from '@open-hearth/ui'

import { CONTEXT_VERIFICATION_STATUS } from '@hearth/domains/acquiring/constants/context'
import { EmptyListContent } from '@hearth/domains/common/components/EmptyListContent'
import { LoginWithSBBOLButton } from '@hearth/domains/common/components/LoginWithSBBOLButton'

interface SetupTabProps {
    acquiringContexts: AcquiringIntegrationContext[]
}

export const SetupTab: React.FC<SetupTabProps> = ({ acquiringContexts }) => {
    const router = useRouter()
    const intl = useIntl()

    const SetupIsNotCompletedTitle = intl.formatMessage({ id: 'pages.billing.setup.notCompleted.title' })
    const SetupIsNotCompletedMessage = intl.formatMessage({ id: 'pages.billing.setup.notCompleted.messsage' })
    const StartSetupTitle = intl.formatMessage({ id: 'pages.billing.setup.notCompleted.startButton.label' })
    const VerifyOrganizationTitle = intl.formatMessage({ id: 'pages.billing.setup.notCompleted.verify.label' })
    const VerifyOrganizationMessage = intl.formatMessage({ id: 'pages.billing.setup.notCompleted.verify.message' })

    const needsVerification = useMemo<boolean>(() => {
        const withVerification = acquiringContexts.filter(({ status }) => status === CONTEXT_VERIFICATION_STATUS)
        return !!withVerification.length
    }, [acquiringContexts])
    if (needsVerification) {
        return (
            <EmptyListContent
                image='/mascot/processing.webp'
                label={VerifyOrganizationTitle}
                message={VerifyOrganizationMessage}
                button={
                    <LoginWithSBBOLButton redirect={router.asPath} checkTlsCert/>
                }
            />
        )
    }

    return (
        <EmptyListContent
            image='/mascot/searching.webp'
            message={SetupIsNotCompletedMessage}
            label={SetupIsNotCompletedTitle}
            createLabel={StartSetupTitle}
            button={
                <Button type='primary' onClick={() => router.push('/billing/setup?step=0')}>
                    {StartSetupTitle}
                </Button>
            }
        />
    )
}
