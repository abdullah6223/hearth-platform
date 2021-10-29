import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { IntlShape } from 'react-intl/src/types'

import { useIntl } from '@open-hearth/next/intl'

import { getFilterIcon } from '@hearth/domains/common/components/Table/Filters'
import { FiltersMeta, getFilterDropdownByKey } from '@hearth/domains/common/utils/filters.utils'
import { getFilteredValue } from '@hearth/domains/common/utils/helpers'
import { parseQuery } from '@hearth/domains/common/utils/tables.utils'
import { IFilters } from '@hearth/domains/contact/utils/helpers'

const getTypeRenderer = (intl: IntlShape) => (organization) => intl.formatMessage({ id: organization ? 'ContactRoles.types.custom' : 'ContactRoles.types.default' })

export function useContactRolesTableColumns<T> (filterMetas: Array<FiltersMeta<T>>): Array<Record<string, unknown>> {
    const intl = useIntl()
    const NameMessage = intl.formatMessage({ id: 'ContactRoles.name' })
    const TypeMessage = intl.formatMessage({ id: 'ContactRoles.type' })

    const router = useRouter()
    const { filters } = parseQuery(router.query)

    return useMemo(() => {
        return [
            {
                title: NameMessage,
                filteredValue: getFilteredValue<IFilters>(filters, 'name'),
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'name'),
                filterIcon: getFilterIcon,
                ellipsis: true,
            },
            {
                title: TypeMessage,
                dataIndex: 'organization',
                key: 'type',
                render: getTypeRenderer(intl),
            },
        ]
    }, [NameMessage, filters, filterMetas])
}
