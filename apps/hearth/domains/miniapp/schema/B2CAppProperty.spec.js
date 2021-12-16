/**
 * @jest-environment node
 */

const index = require('@app/hearth/index')
const { faker } = require('@faker-js/faker')
const { set } = require('lodash')

const { AddressServiceClient } = require('@open-hearth/clients/address-service-client/AddressServiceClient')
const { FakeAddressServiceClient } = require('@open-hearth/clients/address-service-client/FakeAddressServiceClient')
const { GQLErrorCode: { BAD_USER_INPUT } } = require('@open-hearth/keystone/errors')
const {
    makeLoggedInAdminClient,
    expectToThrowGQLError, setFakeClientMode,
} = require('@open-hearth/keystone/test.utils')

const { WRONG_VALUE } = require('@hearth/domains/common/constants/errors')
const {
    INCORRECT_HOUSE_TYPE_ERROR,
    INCORRECT_ADDRESS_ERROR,
} = require('@hearth/domains/miniapp/constants')
const {
    createTestB2CApp,
    createTestB2CAppAccessRight,
    createTestB2CAppProperty,
} = require('@hearth/domains/miniapp/utils/testSchema')
const { VALID_HOUSE_TYPES } = require('@hearth/domains/property/constants/common')
const {
    makeClientWithServiceUser,
} = require('@hearth/domains/user/utils/testSchema')

describe('B2CAppProperty spec', () => {
    let admin
    let app
    let permittedUser
    let anotherPermittedUser

    setFakeClientMode(index, { excludeApps: ['OIDCMiddleware'] })

    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()

        permittedUser = await makeClientWithServiceUser()
        const [b2cApp] = await createTestB2CApp(admin)
        app = b2cApp
        await createTestB2CAppAccessRight(admin, permittedUser.user, app)

        anotherPermittedUser = await makeClientWithServiceUser()
        const [secondApp] = await createTestB2CApp(admin)
        await createTestB2CAppAccessRight(admin, anotherPermittedUser.user, secondApp)
    })

    describe('Validation tests', () => {

        // TODO(HEARTH-8887) Need to start hearth in fake mode to have an ability to mock the `search` function.
        describe.skip('Should validate address and throw error', () => {

            afterEach(() => {
                jest.restoreAllMocks()
            })

            test('If house type is not supported', async () => {

                jest.spyOn(AddressServiceClient.prototype, 'search').mockImplementationOnce(async (s) => {
                    const cli = new FakeAddressServiceClient(faker.internet.url())
                    const result = await cli.search(s)
                    set(result, ['addressMeta', 'data', 'house_type_full'], faker.datatype.string(8))
                    return result
                })

                await expectToThrowGQLError(async () => {
                    await createTestB2CAppProperty(admin, app)
                }, {
                    code: BAD_USER_INPUT,
                    type: WRONG_VALUE,
                    variable: ['data', 'address'],
                    message: `${INCORRECT_HOUSE_TYPE_ERROR}. Valid values are: [${VALID_HOUSE_TYPES.join(', ')}]`,
                })
            })
            test('If address suggestion don\'t match input address', async () => {
                jest.spyOn(AddressServiceClient.prototype, 'search').mockImplementationOnce(async (s) => {
                    const cli = new FakeAddressServiceClient(faker.internet.url())
                    const result = await cli.search(s)
                    set(result, ['addressMeta', 'value'], faker.address.streetAddress())
                    return result
                })
                await expectToThrowGQLError(async () => {
                    await createTestB2CAppProperty(admin, app)
                }, {
                    code: BAD_USER_INPUT,
                    type: WRONG_VALUE,
                    variable: ['data', 'address'],
                    message: INCORRECT_ADDRESS_ERROR,
                })
            })
        })
    })
})
