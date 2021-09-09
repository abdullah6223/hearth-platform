const { EMAIL_TYPE, IPv4_TYPE } = require('@hearth/domains/user/constants/identifiers')
const { EMAIL_COUNTER_LIMIT_TYPE } = require('@hearth/domains/user/constants/limits')

const { RedisGuardResetter } = require('./RedisGuardResetter')

class EmailGuardResetter extends RedisGuardResetter {
    constructor () {
        super(EMAIL_COUNTER_LIMIT_TYPE, [EMAIL_TYPE, IPv4_TYPE])
    }
}

module.exports = {
    EmailGuardResetter,
}
