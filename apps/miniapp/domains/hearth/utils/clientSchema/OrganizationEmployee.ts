import { OrganizationEmployee, QueryAllOrganizationEmployeesArgs } from '@app/miniapp/hearthSchema'

import { generateReactHooks } from '@open-hearth/codegen/generate.hooks'

import { clientGql } from '@miniapp/domains/hearth/gql'


type EmptyObjectTypePlaceHolder = Record<string, never>

const {
    useObject,
    useObjects,
    useAllObjects,
    useCount,
} = generateReactHooks<OrganizationEmployee, EmptyObjectTypePlaceHolder, EmptyObjectTypePlaceHolder, QueryAllOrganizationEmployeesArgs>(clientGql.OrganizationEmployee)

export {
    useAllObjects,
    useObjects,
    useObject,
    useCount,
}
