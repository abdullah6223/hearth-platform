const { generateHearthServerUtils } = require('@open-hearth/codegen/generate.hearth.server.utils')

const {
    serverGql: {
        B2BAppRole: B2BAppRoleGQL,
        Organization: OrganizationGQL,
        OrganizationEmployee: OrganizationEmployeeGQL,
        User: UserGQL,
    },
} = require('@miniapp/domains/hearth/gql')

/* AUTOGENERATE MARKER <IMPORT> */

const B2BAppRole = generateHearthServerUtils(B2BAppRoleGQL)
const Organization = generateHearthServerUtils(OrganizationGQL)
const OrganizationEmployee = generateHearthServerUtils(OrganizationEmployeeGQL)
const User = generateHearthServerUtils(UserGQL)
/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    B2BAppRole,
    Organization,
    OrganizationEmployee,
    User,
    /* AUTOGENERATE MARKER <EXPORTS> */
}
