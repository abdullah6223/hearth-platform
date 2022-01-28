import { B2BAppContext, QueryAllB2BAppContextsArgs } from '@app/miniapp/hearthSchema'

import { generateReactHooks } from '@open-hearth/codegen/generate.hooks'

import { clientGql } from '@miniapp/domains/hearth/gql'


type EmptyObjectTypePlaceHolder = Record<string, never>

const {
    useObject,
    useObjects,
    useAllObjects,
    useCount,
} = generateReactHooks<B2BAppContext, EmptyObjectTypePlaceHolder, EmptyObjectTypePlaceHolder, QueryAllB2BAppContextsArgs>(clientGql.B2BAppContext)

export {
    useAllObjects,
    useObjects,
    useObject,
    useCount,
}
