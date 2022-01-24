import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { useFeatureFlags } from '@open-hearth/featureflags/FeatureFlagsContext'
import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { CoworkLayout } from '@hearth/domains/ai/components/Cowork'
import { PageContent, PageHeader, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { UI_AI_COWORK_SETTINGS } from '@hearth/domains/common/constants/featureflags'
import { PageComponentType } from '@hearth/domains/common/types'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'

const CoworkSettingsPage: PageComponentType = () => {
    const intl = useIntl()
    const router = useRouter()
    const { useFlag } = useFeatureFlags()
    const settingsEnabled = useFlag(UI_AI_COWORK_SETTINGS)

    const titleLabel = intl.formatMessage({ id: 'ai.cowork.settings' })
    const subtitleLabel = intl.formatMessage({ id: 'ai.cowork.settings.subtitle' })
    const comingSoonLabel = intl.formatMessage({ id: 'ai.cowork.comingSoon' })

    useEffect(() => {
        if (!settingsEnabled) void router.replace('/ai-engineer')
    }, [settingsEnabled, router])

    if (!settingsEnabled) return null

    return (
        <PageWrapper>
            <PageContent>
                <PageHeader
                    title={<Typography.Title>{titleLabel}</Typography.Title>}
                    subTitle={subtitleLabel}
                />
                <Typography.Text type='secondary'>{comingSoonLabel}</Typography.Text>
            </PageContent>
        </PageWrapper>
    )
}

CoworkSettingsPage.requiredAccess = OrganizationRequired
CoworkSettingsPage.container = CoworkLayout

export default CoworkSettingsPage
