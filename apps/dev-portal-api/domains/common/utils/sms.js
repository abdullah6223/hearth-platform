const conf = require('@open-hearth/config')

const { developmentClient, productionClient } = require('@dev-portal-api/domains/common/utils/serverClients')

class FakeSMSAdapter {
    async sendMessage (phone, message) {
        console.log(JSON.stringify({ adapter: 'Fake SMS Adapter', phone, message }))
    }
}

class HearthSMSAdapter {
    #client

    constructor (serverClient) {
        this.#client = serverClient
    }

    async sendMessage (phone, message) {
        await this.#client.sendMessage({ phone }, message)
    }
}

class SMSAdapter {
    #internalAdapter = null

    constructor (type = 'fake') {
        switch (type) {
            case 'hearth-dev':
                this.#internalAdapter = new HearthSMSAdapter(developmentClient)
                break
            case 'hearth-prod':
                this.#internalAdapter = new HearthSMSAdapter(productionClient)
                break
            default:
                this.#internalAdapter = new FakeSMSAdapter()
                break
        }
    }

    async sendMessage (phone, message) {
        return await this.#internalAdapter.sendMessage(phone, message)
    }
}

const DEFAULT_SMS_ADAPTER = new SMSAdapter(conf['SMS_PROVIDER'] || 'fake')

async function sendMessage (phone, message) {
    return await DEFAULT_SMS_ADAPTER.sendMessage(phone, message)
}

module.exports = {
    SMSAdapter,
    sendMessage,
}