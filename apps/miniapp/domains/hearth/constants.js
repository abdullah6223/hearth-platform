const conf = require('@open-hearth/config')

const APP_TOKEN_KEY = conf.APP_TOKEN_KEY || 'appToken'
const HEARTH_ACCESS_TOKEN_KEY = conf.HEARTH_ACCESS_TOKEN_KEY || 'hearthAccessToken'
const HEARTH_REFRESH_TOKEN_KEY = conf.HEARTH_REFRESH_TOKEN_KEY || 'hearthRefreshToken'
const HEARTH_ORGANIZATION_ID_KEY = conf.HEARTH_ORGANIZATION_ID_KEY || 'hearthOrganizationId'
const ACCEPT_LANGUAGE = conf.ACCEPT_LANGUAGE || 'accept-language'

module.exports = {
    ACCEPT_LANGUAGE,
    APP_TOKEN_KEY,
    HEARTH_ACCESS_TOKEN_KEY,
    HEARTH_REFRESH_TOKEN_KEY,
    HEARTH_ORGANIZATION_ID_KEY,
}
