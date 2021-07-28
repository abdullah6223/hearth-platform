const {
    serverGql: {
        B2BAppRole: B2BAppRoleGQL,
        Organization: OrganizationGQL,
        OrganizationEmployee: OrganizationEmployeeGQL,
        User: UserGQL,
    },
} = require('@{{name}}/domains/hearth/gql')

const { generateHearthServerUtils } = require('@open-hearth/codegen/generate.hearth.server.utils')


const B2BAppRole = generateHearthServerUtils(B2BAppRoleGQL)
const Organization = generateHearthServerUtils(OrganizationGQL)
const OrganizationEmployee = generateHearthServerUtils(OrganizationEmployeeGQL)
const User = generateHearthServerUtils(UserGQL)


module.exports = {
    B2BAppRole,
    Organization,
    OrganizationEmployee,
    User,
}
