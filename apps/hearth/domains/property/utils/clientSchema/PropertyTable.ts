import { Property, PropertyCreateInput, PropertyUpdateInput, QueryAllPropertiesArgs } from '@app/hearth/schema'

import { generateReactHooks } from '@open-hearth/codegen/generate.hooks'

import { PropertyTable as PropertyTableGQL } from '@hearth/domains/property/gql'

const {
    useObject,
    useObjects,
    useCount,
} = generateReactHooks<Property, PropertyCreateInput, PropertyUpdateInput, QueryAllPropertiesArgs>(PropertyTableGQL)

export {
    useObject,
    useObjects,
    useCount,
}
