import { Organization, QueryAllOrganizationsArgs } from '@app/miniapp/hearthSchema'

import { generateReactHooks } from '@open-hearth/codegen/generate.hooks'

import { clientGql } from '@miniapp/domains/hearth/gql'


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
