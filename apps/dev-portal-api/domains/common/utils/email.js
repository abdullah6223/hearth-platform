const conf = require('@open-hearth/config')

const { developmentClient, productionClient } = require('@dev-portal-api/domains/common/utils/serverClients')

class FakeEmailAdapter {
    async sendMessage (email, subject, body) {
        console.log(JSON.stringify({ adapter: 'Fake Email Adapter', email, subject, body }))
    }
}

class HearthEmailAdapter {
    #client

    constructor (serverClient) {
        this.#client = serverClient
    }

    async sendMessage (email, subject, body) {
        await this.#client.sendMessage({ email }, body, { subject })
    }
}

class EmailAdapter {
    #internalAdapter = null

    constructor (type = 'faker') {
        switch (type) {
            case 'hearth-dev':
                this.#internalAdapter = new HearthEmailAdapter(developmentClient)
                break
            case 'hearth-prod':
                this.#internalAdapter = new HearthEmailAdapter(productionClient)
                break
            default:
                this.#internalAdapter = new FakeEmailAdapter()
                break
        }
    }

    async sendMessage (email, subject, body) {
        await this.#internalAdapter.sendMessage(email, subject, body)
    }
}

const DEFAULT_EMAIL_ADAPTER = new EmailAdapter(conf['EMAIL_PROVIDER'] || 'fake')

async function sendMessage (email, subject, body) {
    await DEFAULT_EMAIL_ADAPTER.sendMessage(email, subject, body)
}

module.exports = {
    sendMessage,
}