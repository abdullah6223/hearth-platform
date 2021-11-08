import { TicketOrganizationSetting } from '@app/hearth/schema'
import { Typography } from 'antd'
import get from 'lodash/get'
import isNull from 'lodash/isNull'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'

import { SettingCard } from '@hearth/domains/common/components/settings/SettingCard'
import { TICKET_DEFAULT_DEADLINE_DURATION_FIELDS } from '@hearth/domains/ticket/constants/common'
import { convertDurationToDays } from '@hearth/domains/ticket/utils/helpers'

interface TicketDeadlineSettingCardProps {
    ticketSetting?: TicketOrganizationSetting
}

const TICKET_DEADLINE_SETTINGS_URL = '/settings/ticketDeadlines'

const TYPOGRAPHY_STYLE: React.CSSProperties = { width: '100%' }

export const TicketDeadlineSettingCard: React.FC<TicketDeadlineSettingCardProps> = ({ ticketSetting }) => {
    const intl = useIntl()
    const TicketDeadlineTitle = intl.formatMessage({ id: 'pages.hearth.settings.callCenter.card.ticketDeadlines.title' })
    const TicketWithoutDefaultDeadlineLabel = intl.formatMessage({ id: 'pages.hearth.settings.callCenter.card.ticketDeadlines.withoutDeadline' })

    const router = useRouter()

    const handleClickCard = useCallback(() => {
        router.push(TICKET_DEADLINE_SETTINGS_URL)
    }, [router])

    return useMemo(() => {
        if (!ticketSetting) return null

        const humanizeDeadlines = TICKET_DEFAULT_DEADLINE_DURATION_FIELDS.map((fieldName) => {
            const typeMessage = intl.formatMessage({ id: `pages.hearth.settings.callCenter.card.ticketDeadlines.type.${fieldName}` as FormatjsIntl.Message['ids'] })
            const deadlineDuration = get(ticketSetting, fieldName, null)
            let deadlineText
            if (deadlineDuration === null) {
                deadlineText = TicketWithoutDefaultDeadlineLabel
            } else {
                const deadline = convertDurationToDays(deadlineDuration)
                deadlineText = `+${intl.formatMessage({ id: 'DaysShort' }, { days: deadline })}`
            }
            return {
                label: `${typeMessage}: ${deadlineText}`,
                type: fieldName,
                deadlineDuration,
            }
        })

        return (
            <SettingCard title={TicketDeadlineTitle} onClick={handleClickCard}>
                {
                    humanizeDeadlines.every(({ deadlineDuration }) => isNull(deadlineDuration))
                        ? (
                            <Typography.Text type='secondary' ellipsis style={TYPOGRAPHY_STYLE}>
                                {TicketWithoutDefaultDeadlineLabel}
                            </Typography.Text>
                        )
                        : humanizeDeadlines.map(({ label, type }) => (
                            <Typography.Text key={type} type='secondary' ellipsis style={TYPOGRAPHY_STYLE}>
                                {label}
                            </Typography.Text>
                        ))
                }
            </SettingCard>
        )
    }, [TicketDeadlineTitle, TicketWithoutDefaultDeadlineLabel, handleClickCard, intl, ticketSetting])
}