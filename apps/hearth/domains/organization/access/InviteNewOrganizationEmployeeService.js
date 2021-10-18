const { get } = require('lodash')

const { throwAuthenticationError } = require('@open-hearth/keystone/apolloErrorFormatter')

const { checkPermissionsInEmployedOrRelatedOrganizations } = require('@hearth/domains/organization/utils/accessSchema')
const { canDirectlyExecuteService } = require('@hearth/domains/user/utils/directAccess')

async function canInviteNewOrganizationEmployee ({ authentication: { item: user }, args, context }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin || user.isSupport) return true

    const hasDirectAccess = await canDirectlyExecuteService(user, 'inviteNewOrganizationEmployee')
    if (hasDirectAccess) return true

    const organizationId = get(args, ['data', 'organization', 'id'])
    if (!organizationId) return false

    return await checkPermissionsInEmployedOrRelatedOrganizations(context, user, organizationId, 'canInviteNewOrganizationEmployees')
}

module.exports = {
    canInviteNewOrganizationEmployee,
}
