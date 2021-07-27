const clientGql = require('./gql.client')
const { HEARTH_CONFIG } = clientGql
const serverGql = require('./gql.server')

module.exports = {
    clientGql,
    serverGql,
    HEARTH_CONFIG,
}
