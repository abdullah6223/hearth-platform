import {
    Ticket,
    TicketCreateInput,
    TicketUpdateInput,
    QueryAllTicketsArgs,
} from '@app/hearth/schema'

import { generateReactHooks } from '@open-hearth/codegen/generate.hooks'

import { TicketLastCommentsTime as TicketLastCommentsTimeGql } from '@hearth/domains/ticket/gql'

const {
    useObject,
    useObjects,
    useCount,
} = generateReactHooks<Ticket, TicketCreateInput, TicketUpdateInput, QueryAllTicketsArgs>(TicketLastCommentsTimeGql)

export {
    useObject,
    useObjects,
    useCount,
}