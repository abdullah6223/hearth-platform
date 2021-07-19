const os = require('os')

const conf = require('@open-hearth/config')

const HOSTNAME = os.hostname() || 'nohost'
const NAMESPACE = conf.NAMESPACE || 'nospace'
const VERSION = conf.WERF_COMMIT_HASH || 'local'
const APP = conf.APP_NAME

/**
 * Examples: hearth-worker-low, hearth-worker-medium, hearth-worker-high, hearth-app
 * @returns {string}
 */
function getAppName () {
    if (typeof APP === 'string' && APP) {
        return APP
    }

    if (!HOSTNAME.startsWith('hearth')) {
        return HOSTNAME
    }

    const splittedHostname = HOSTNAME.split('-')
    if (splittedHostname.length < 3) {
        return HOSTNAME
    }

    return HOSTNAME
        .split('-')
        .reverse()
        .slice(2)
        .reverse()
        .join('-')
}

/**
 * Examples: development-hearth-app, production-hearth-app, production-hearth-worker-low, development-hearth-worker-low
 * @returns {string}
 */
function getXRemoteApp () {
    const deployment = getAppName()
    return NAMESPACE ? `${NAMESPACE}-${deployment}` : deployment
}

/**
 * Example: hearth-app-dccbd8f8-8wn7x
 * @returns {string}
 */
function getXRemoteClient () {
    return HOSTNAME
}

/**
 * Example: 84100eb7ce4ed9f01930aea291df53cc013734e8
 * @returns {string}
 */
function getXRemoteVersion () {
    return VERSION
}

module.exports = {
    getAppName,
    getXRemoteApp,
    getXRemoteClient,
    getXRemoteVersion,
}