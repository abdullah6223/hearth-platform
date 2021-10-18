const { throwAuthenticationError } = require('@open-hearth/keystone/apolloErrorFormatter')

async function canRegisterNewOrganization ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    return true
}

module.exports = {
    canRegisterNewOrganization,
}
