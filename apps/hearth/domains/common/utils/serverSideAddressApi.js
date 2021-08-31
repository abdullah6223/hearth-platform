const { createInstance } = require('@open-hearth/clients/address-service-client')

/**
 * @deprecated you should use `@open-hearth/keystone/plugins/utils/address-service-client`
 */
async function getAddressSuggestions (query, amount) {
    const addressServiceClient = createInstance({ address: query })
    return await addressServiceClient.suggest(query, { context: 'serverSide', count: amount }) || []
}

module.exports = {
    getAddressSuggestions,
}

