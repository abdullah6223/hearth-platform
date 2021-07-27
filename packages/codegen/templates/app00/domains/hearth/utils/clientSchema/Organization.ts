import { Organization, QueryAllOrganizationsArgs } from '@app/{{name}}/hearthSchema'

import { generateReactHooks } from '@open-hearth/codegen/generate.hooks'

import { clientGql } from '@{{name}}/domains/hearth/gql'


type EmptyObjectTypePlaceHolder = Record<string, never>

const {
    useObject,
    useObjects,
    useAllObjects,
    useCount,
} = generateReactHooks<Organization, EmptyObjectTypePlaceHolder, EmptyObjectTypePlaceHolder, QueryAllOrganizationsArgs>(clientGql.Organization)

export {
    useAllObjects,
    useObjects,
    useObject,
    useCount,
}
