import { TicketPropertyHint } from '@app/hearth/schema'
import get from 'lodash/get'
import map from 'lodash/map'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'

import { getFilterIcon } from '@hearth/domains/common/components/Table/Filters'
import { getTableCellRenderer } from '@hearth/domains/common/components/Table/Renders'
import { FiltersMeta, getFilterDropdownByKey } from '@hearth/domains/common/utils/filters.utils'
import { getFilteredValue } from '@hearth/domains/common/utils/helpers'
import { parseQuery } from '@hearth/domains/common/utils/tables.utils'
import { IFilters } from '@hearth/domains/contact/utils/helpers'
import { getManyPropertiesAddressRender } from '@hearth/domains/property/utils/clientSchema/Renders'
import { TicketPropertyHintContent } from '@hearth/domains/ticket/components/TicketPropertyHint/TicketPropertyHintContent'
import { TicketPropertyHintProperty } from '@hearth/domains/ticket/utils/clientSchema'

import styles from './useTicketPropertyHintTableColumns.module.css'

export function useTicketPropertyHintTableColumns <T> (filterMetas: Array<FiltersMeta<T>>, ticketPropertyHints: TicketPropertyHint[]) {
    const intl = useIntl()
    const NameMessage  = intl.formatMessage({ id: 'pages.hearth.property.section.form.name' })
    const HintMessage = intl.formatMessage({ id: 'Hint' })
    const BuildingsMessage = intl.formatMessage({ id: 'pages.hearth.property.index.TableField.Buildings' })

    const router = useRouter()
    const { filters } = parseQuery(router.query)
    const search = getFilteredValue(filters, 'search')

    const render = useMemo(() => getTableCellRenderer({ search }), [search])

    const ticketPropertyHintIds = useMemo(() => map(ticketPropertyHints, 'id'), [ticketPropertyHints])
    const { objs: ticketPropertyHintsProperties } = TicketPropertyHintProperty.useAllObjects({
        where: {
            ticketPropertyHint: {
                id_in: ticketPropertyHintIds,
            },
        },
    })

    const renderTicketPropertyHintAddresses = useCallback((intl, ticketPropertyHint) => {
        const properties = ticketPropertyHintsProperties
            .filter(ticketPropertyHintProperty => get(ticketPropertyHintProperty, 'ticketPropertyHint.id') === ticketPropertyHint.id)
            .map(ticketPropertyHintProperty => ticketPropertyHintProperty.property)

        return getManyPropertiesAddressRender(search)(intl, properties)
    }, [search, ticketPropertyHintsProperties])

    const renderTicketPropertyHint = useCallback((value, _) => {
        return (
            <TicketPropertyHintContent
                content={value}
                className={styles.ticketPropertyHintContent}
            />
        )
    }, [])

    return useMemo(() => {
        return [
            {
                title: BuildingsMessage,
                ellipsis: true,
                key: 'properties',
                render: (_, ticketPropertyHint) => renderTicketPropertyHintAddresses(intl, ticketPropertyHint),
                width: '35%',
            },
            {
                title: NameMessage,
                filteredValue: getFilteredValue<IFilters>(filters, 'name'),
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'name'),
                filterIcon: getFilterIcon,
                render,
                ellipsis: true,
            },
            {
                title: HintMessage,
                ellipsis: true,
                dataIndex: 'content',
                key: 'content',
                render: renderTicketPropertyHint,
            },
        ]
    }, [BuildingsMessage, NameMessage, filters, filterMetas, render, HintMessage, renderTicketPropertyHint, renderTicketPropertyHintAddresses, intl])
}