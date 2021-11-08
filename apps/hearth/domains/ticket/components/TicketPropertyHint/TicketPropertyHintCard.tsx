import { useGetTicketPropertyHintByIdQuery, useGetTicketPropertyHintPropertyByPropertyQuery } from '@app/hearth/gql'
import styled from '@emotion/styled'
import { Col, ColProps, Typography } from 'antd'
import React, { useMemo } from 'react'

import { useCachePersistor } from '@open-hearth/apollo'
import { useIntl } from '@open-hearth/next/intl'
import { Alert } from '@open-hearth/ui'
import { colors } from '@open-hearth/ui/colors'

import { TicketPropertyHintContent } from './TicketPropertyHintContent'


const StyledAlert = styled(Alert)`
   background-color: ${colors.green[1]} !important;
  
   .hearth-alert-description > div {
     overflow: hidden;
     position: relative;
   }
  
  & svg {
    color: ${colors.green[5]} !important;
  }
`

type TicketPropertyHintCardProps = {
    propertyId: string
    colProps?: ColProps
    className?: string
}

export const TicketPropertyHintCard: React.FC<TicketPropertyHintCardProps> = ({ propertyId, colProps, className }) => {
    const intl = useIntl()
    const PropertyHintMessage = intl.formatMessage({ id: 'pages.hearth.settings.hint.ticketPropertyHint' })

    const { persistor } = useCachePersistor()
    const {
        data: ticketPropertyHintPropertyData,
    } = useGetTicketPropertyHintPropertyByPropertyQuery({
        variables: {
            propertyId,
        },
        skip: !persistor || !propertyId,
    })
    const ticketPropertyHintProperty = useMemo(() => ticketPropertyHintPropertyData?.ticketPropertyHintProperty?.filter(Boolean)[0],
        [ticketPropertyHintPropertyData?.ticketPropertyHintProperty])
    const ticketPropertyHintId = useMemo(() => ticketPropertyHintProperty?.ticketPropertyHint?.id,
        [ticketPropertyHintProperty?.ticketPropertyHint?.id])

    const {
        data: ticketPropertyHintData,
    } = useGetTicketPropertyHintByIdQuery({
        variables: {
            id: ticketPropertyHintId,
        },
        skip: !persistor || !ticketPropertyHintId,
    })
    const ticketPropertyHint = useMemo(() => ticketPropertyHintData?.ticketPropertyHints?.filter(Boolean)[0],
        [ticketPropertyHintData?.ticketPropertyHints])

    const content = useMemo(() => ticketPropertyHint?.content ?? '', [ticketPropertyHint])

    const Hint = useMemo(() => (
        <StyledAlert
            message={<Typography.Text strong>{PropertyHintMessage}</Typography.Text>}
            description={
                <TicketPropertyHintContent
                    content={content}
                    className={className}
                    linkToHint={`/property/${propertyId}/hint`}
                />
            }
            showIcon
            type='info'
        />
    ), [PropertyHintMessage, className, content, propertyId])

    if (!ticketPropertyHintProperty || !ticketPropertyHint) {
        return null
    }

    return colProps ? (<Col {...colProps}>{Hint}</Col>) : Hint
}