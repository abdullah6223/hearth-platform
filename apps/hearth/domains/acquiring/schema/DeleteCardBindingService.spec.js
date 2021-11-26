const index = require('@app/hearth/index')
const { faker } = require('@faker-js/faker')

const {
    setFakeClientMode,
    makeLoggedInAdminClient,
} = require('@open-hearth/keystone/test.utils')

const { deleteUserCard } = require('@hearth/domains/acquiring/utils/serverSchema/cardsOnlineInteraction')
const { deleteCardBindingByTestClient } = require('@hearth/domains/acquiring/utils/testSchema')
const { TestUtils, AcquiringTestMixin } = require('@hearth/domains/billing/utils/testSchema/testUtils')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@hearth/domains/user/utils/testSchema')

jest.mock('@hearth/domains/acquiring/utils/serverSchema/cardsOnlineInteraction', () => ({
    deleteUserCard: jest.fn(),
}))

describe('DeleteCardBindingService', () => {
    let utils

    setFakeClientMode(index)

    beforeAll(async () => {
        utils = new TestUtils([AcquiringTestMixin])
        await utils.init()

        await utils.updateAcquiringIntegration({
            deleteUserCardUrl: 'https://example.com',
            getUserCardsUrl: 'https://example.com',
        })
    })

    test('should delete card binding', async () => {
        const client = await makeLoggedInAdminClient()

        const userId = faker.datatype.uuid()
        const cardId = faker.datatype.uuid()

        deleteUserCard.mockResolvedValue(true)

        await deleteCardBindingByTestClient(client, {
            user: {
                id: userId,
            },
            cardId,
        })

        expect(deleteUserCard).toHaveBeenCalledWith(
            'https://example.com',
            userId,
            cardId,
            utils.acquiringIntegration.id,
        )
    })
})
