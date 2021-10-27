import { getFilter, getStringContainsFilter } from '@hearth/domains/common/utils/tables.utils'


const filterName = getStringContainsFilter(['name'])
const filterCategory = getFilter(['category', 'id'], 'array', 'string', 'in')

export const usePropertyDocumentsTableFilters = () => {
    return [
        {
            keyword: 'search',
            filters: [filterName],
        },
        {
            keyword: 'category',
            filters: [filterCategory],
        },
    ]
}