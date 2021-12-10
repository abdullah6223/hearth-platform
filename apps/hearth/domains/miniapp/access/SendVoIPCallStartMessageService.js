const { throwAuthenticationError } = require('@open-hearth/keystone/apolloErrorFormatter')

const { canExecuteServiceAsB2CAppServiceUser } = require('@hearth/domains/miniapp/utils/b2cAppServiceUserAccess/server.utils')
const { SERVICE } = require('@hearth/domains/user/constants/common')

async function canSendVoIPCallStartMessage (args) {
    const { authentication: { item: user } } = args

    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    if (user.type === SERVICE) {
        return await canExecuteServiceAsB2CAppServiceUser(args)
    }
    
    return false
}

module.exports = {
    canSendVoIPCallStartMessage,
}