import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import { useFeatureFlags } from '@open-hearth/featureflags/FeatureFlagsContext'
import { useAuth } from '@open-hearth/next/auth'
import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'
import { Space, Typography } from '@open-hearth/ui'

import { useAIContext } from '@hearth/domains/ai/components/AIContext'
import { AIFlowButton } from '@hearth/domains/ai/components/AIFlowButton'
import { UI_AI_CHAT_WITH_HEARTH, UI_AI_COWORK, UI_HIDE_USER_LINKS } from '@hearth/domains/common/constants/featureflags'
import { analytics } from '@hearth/domains/common/utils/analytics'
import { UserMessagesList } from '@hearth/domains/notification/components/UserMessagesList'
import { InlineOrganizationSelect } from '@hearth/domains/organization/components/OrganizationSelect'
import { SBBOLIndicator } from '@hearth/domains/organization/components/SBBOLIndicator'
import { SubscriptionDaysIndicator, UpgradePlanButton } from '@hearth/domains/subscription/components'
import { useOrganizationSubscription } from '@hearth/domains/subscription/hooks'
import { useLinkedCardsModal } from '@hearth/domains/subscription/hooks/useLinkedCardsModal'
import { usePaymentHistoryModal } from '@hearth/domains/subscription/hooks/usePaymentHistoryModal'
import { UserMenu } from '@hearth/domains/user/components/UserMenu'


export interface ITopMenuItemsProps {
    headerAction?: React.ElementType
    hideAIButton?: boolean
    hideNotifications?: boolean
    hideCoworkMenuLink?: boolean
}

export const TopMenuItems: React.FC<ITopMenuItemsProps> = (props) => {
    const auth = useAuth()
    const intl = useIntl()
    const { organization } = useOrganization()
    const { hasSubscription } = useOrganizationSubscription()
    const { useFlag } = useFeatureFlags()
    const { isAIOverlayOpen, openAIOverlay } = useAIContext()

    const isAIChatEnabled = useFlag(UI_AI_CHAT_WITH_HEARTH)
    const isCoworkEnabled = useFlag(UI_AI_COWORK)

    const isUserMenuHidden = useFlag(UI_HIDE_USER_LINKS)

    const PaymentHistoryLabel = intl.formatMessage({ id: 'subscription.paymentHistory.title' })
    const LinkedCardsLabel = intl.formatMessage({ id: 'subscription.linkedCards.title' })
    const CoworkLabel = intl.formatMessage({ id: 'ai.cowork.menuLabel' })

    const { LinkedCardsModal, openModal: openLinkedCardsModal, hasPaymentMethod } = useLinkedCardsModal()
    const { PaymentHistoryModal, openModal: openPaymentHistoryModal, hasPaymentHistory } = usePaymentHistoryModal()

    const router = useRouter()

    const subscriptionMenuItems = useMemo(() => {
        if (!hasPaymentHistory) return []
        return [
            {
                key: 'paymentHistory',
                label: <Typography.Text size='medium' type='inherit'>{PaymentHistoryLabel}</Typography.Text>,
                onClick: openPaymentHistoryModal,
            },
            hasPaymentMethod && {
                key: 'linkedCards',
                label: <Typography.Text size='medium' type='inherit'>{LinkedCardsLabel}</Typography.Text>,
                onClick: openLinkedCardsModal,
            },
        ]
    }, [hasPaymentHistory, PaymentHistoryLabel, openPaymentHistoryModal, hasPaymentMethod, LinkedCardsLabel, openLinkedCardsModal])

    const userMenuExtraItems = useMemo(() => {
        const items = [...subscriptionMenuItems]
        if (isCoworkEnabled && !props.hideCoworkMenuLink) {
            items.push({
                key: 'cowork',
                label: <Typography.Text size='medium' type='inherit'>{CoworkLabel}</Typography.Text>,
                onClick: () => { void router.push('/ai-engineer') },
            })
        }
        return items
    }, [isCoworkEnabled, CoworkLabel, subscriptionMenuItems, router, props.hideCoworkMenuLink])

    if (auth.isLoading) return null

    return (
        <>
            {LinkedCardsModal}
            {PaymentHistoryModal}
            {props.headerAction ? props.headerAction : null}
            <Space direction='horizontal' size={40} className='top-menu-items'>
                <UpgradePlanButton />
                <SubscriptionDaysIndicator />
                <Space size={12}>
                    <SBBOLIndicator organization={organization} />
                    <InlineOrganizationSelect />
                </Space>
                {!isUserMenuHidden && <UserMenu extraMenuItems={userMenuExtraItems} />}
                {!props.hideNotifications && (
                    <div style={{ maxHeight: '24px' }}>
                        <UserMessagesList disabled={!hasSubscription} />
                    </div>
                )}
                { isAIChatEnabled && !isAIOverlayOpen && !props.hideAIButton && (
                    <AIFlowButton
                        onClick={() => {
                            void analytics.track('ai_assistant_open_click', {})
                            openAIOverlay()
                        }}
                    />
                ) }
            </Space>
        </>
    )
}
