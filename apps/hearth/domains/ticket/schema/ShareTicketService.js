const { GQLCustomSchema } = require('@open-hearth/keystone/schema')

const { SHARE_TICKET_MESSAGE_TYPE } = require('@hearth/domains/notification/constants/constants')
const { sendMessage } = require('@hearth/domains/notification/utils/serverSchema')
const { OrganizationEmployee } = require('@hearth/domains/organization/utils/serverSchema')
const access = require('@hearth/domains/ticket/access/ShareTicketService')
const { Ticket } = require('@hearth/domains/ticket/utils/serverSchema')

// TODO: rename users to employees
const ShareTicketService = new GQLCustomSchema('ShareTicketService', {
    types: [
        {
            access: true,
            // TODO: we need to use OrganizationEmployeeWhereUniqueInput and TicketWhereUniqueInput
            type: 'input ShareTicketInput { sender: SenderFieldInput!, employees: [ID!]!, ticketId: ID! }',
        },
        {
            access: true,
            type: 'type ShareTicketOutput { status: String! }',
        },
    ],
    mutations: [
        {
            access: access.canShareTicket,
            schema: 'shareTicket(data: ShareTicketInput!): ShareTicketOutput',
            resolver: async (parent, args, context) => {
                const { data } = args
                const { employees, ticketId, sender } = data
                const [ticket] = await Ticket.getAll(context,
                    { id: ticketId },
                    'id number createdAt details'
                )
                const employeeUsers = await OrganizationEmployee.getAll(
                    context,
                    { id_in: employees },
                    'email user { id } organization { id }'
                )

                await Promise.all(employeeUsers.map(employee => {
                    return sendMessage(context, {
                        to: {
                            email: employee.email,
                            ...employee.user ? { user: { id: employee.user.id } } : {},
                        },
                        type: SHARE_TICKET_MESSAGE_TYPE,
                        meta: {
                            dv: 1,
                            ticketNumber: ticket.number,
                            date: ticket.createdAt,
                            id: ticket.id,
                            details: ticket.details,
                        },
                        sender,
                        organization: employee.organization && { id: employee.organization.id },
                    })
                }))
                return { status: 'ok' }
            },
        },
    ],
})

module.exports = {
    ShareTicketService,
}
