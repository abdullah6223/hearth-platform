const conf = require('@open-hearth/config')

function getFileServicePublicOrigin () {
    return conf.HEARTH_DOMAIN || conf.FILE_SERVICE_URL || conf.SERVER_URL
}

module.exports = {
    getFileServicePublicOrigin,
}
