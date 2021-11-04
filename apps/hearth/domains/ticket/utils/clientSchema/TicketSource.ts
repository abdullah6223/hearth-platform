import {
    TicketSource,
    TicketSourceCreateInput,
    TicketSourceUpdateInput,
    QueryAllTicketSourcesArgs,
} from '@app/hearth/schema'

import { generateReactHooks } from '@open-hearth/codegen/generate.hooks'

import { TicketSource as TicketSourceGQL } from '@hearth/domains/ticket/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<TicketSource, TicketSourceCreateInput, TicketSourceUpdateInput, QueryAllTicketSourcesArgs>(TicketSourceGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
