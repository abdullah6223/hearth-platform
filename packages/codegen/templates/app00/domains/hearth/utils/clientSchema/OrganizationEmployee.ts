import { OrganizationEmployee, QueryAllOrganizationEmployeesArgs } from '@app/{{name}}/hearthSchema'

import { generateReactHooks } from '@open-hearth/codegen/generate.hooks'

import { clientGql } from '@{{name}}/domains/hearth/gql'


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
