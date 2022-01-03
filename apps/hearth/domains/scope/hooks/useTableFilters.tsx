import { TicketPropertyHintWhereInput } from '@app/hearth/schema'
import { useMemo } from 'react'

import { FiltersMeta } from '@hearth/domains/common/utils/filters.utils'
import { getStringContainsFilter } from '@hearth/domains/common/utils/tables.utils'

const filterName = getStringContainsFilter('name')

export const usePropertyScopeTableFilters = (): Array<FiltersMeta<TicketPropertyHintWhereInput>> => {
    return useMemo(() => {
        return [
            {
                keyword: 'search',
                filters: [
                    filterName,
                ],
                combineType: 'OR',
            },
        ]
    }, [])
}