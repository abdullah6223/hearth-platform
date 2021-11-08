import { Ticket } from '@app/hearth/schema'
import { useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'

import { FiltersTooltipDataObject } from '@hearth/domains/common/hooks/useMultipleFiltersModal'

export function useFiltersTooltipData (): FiltersTooltipDataObject<Ticket>[] {
    const intl = useIntl()
    const SourceMessage = intl.formatMessage({ id: 'field.Source' })
    const ClientPhoneMessage = intl.formatMessage({ id: 'pages.hearth.ticket.filters.ClientPhone' })
    const AuthorMessage = intl.formatMessage({ id: 'pages.hearth.ticket.filters.Author' })

    return useMemo(() => [
        { name: 'source', label: SourceMessage, getFilteredValue: (ticket) => ticket.source.id, getTooltipValue: (ticket) => ticket.source.name },
        { name: 'clientPhone', label: ClientPhoneMessage, getFilteredValue: (ticket) => ticket.clientPhone, getTooltipValue: (ticket) => ticket.clientPhone },
        { name: 'createdBy', label: AuthorMessage, getFilteredValue: (ticket) => ticket.createdBy.id, getTooltipValue: (ticket) => ticket.createdBy.name },
    ], [AuthorMessage, ClientPhoneMessage, SourceMessage])
}