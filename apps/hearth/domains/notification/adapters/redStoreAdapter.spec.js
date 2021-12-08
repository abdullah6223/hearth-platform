const { faker } = require('@faker-js/faker')
const dayjs = require('dayjs')

const conf = require('@open-hearth/config')

const {
    PUSH_FAKE_TOKEN_SUCCESS,
    PUSH_FAKE_TOKEN_FAIL,
    REDSTORE_CONFIG_TEST_PUSHTOKEN_ENV,
    PUSH_TYPE_DEFAULT,
    CUSTOM_CONTENT_MESSAGE_PUSH_TYPE,
} = require('@hearth/domains/notification/constants/constants')
const { buildPushDataByToken } = require('@hearth/domains/notification/utils/testSchema/utils')

const {
    RedStoreAdapter,
} = require('./redStoreAdapter')

const adapter = new RedStoreAdapter()
const REDSTORE_TEST_PUSHTOKEN = conf[REDSTORE_CONFIG_TEST_PUSHTOKEN_ENV] || null

jest.mock('@open-hearth/config', () => {
    const actual = jest.requireActual('@open-hearth/config')
    return {
        ...actual,
        APPS_WITH_DISABLED_NOTIFICATIONS: '["hearth.app.clients"]',
        REDSTORE_CONFIG_JSON: '{ "hearth": { "url": "http://localhost:4006", "project_id": "someProjectId", "service_token": "someServiceToken" } }',
    }
})

jest.mock('@open-hearth/keystone/fetch', () => {
    return {
        fetch: jest.fn().mockImplementation((url, options) => {
            const { body: rawBody, method, headers } = options
            // validation of fetch options
            if (!rawBody) throw new Error('sendPush error. Body is empty')
            if (!method) throw new Error('sendPush error. Method is null or undefined')
            if (method.toUpperCase() !== 'POST') throw new Error('sendPush error. Method should be POST')
            if (!headers) throw new Error('sendPush error. Headers is null or undefined')
            if (headers['Content-Type'] !== 'application/json') throw new Error('sendPush error. Header \'Content-Type\' is not provided or not equal \'application/json\' ')
            if (!headers['Authorization']) throw new Error('sendPush error. Header \'Authorization\' is not provided')

            const body = JSON.parse(rawBody)
            if (!body?.message?.notification?.title) throw new Error('sendPush error. Title of push is null or undefined')
            if (!body?.message?.notification?.body) throw new Error('sendPush error. Body of push is null or undefined')
            if (!body?.message?.token) throw new Error('sendPush error. Token is null or undefined')

            const errorState = {
                'error': {
                    'code': 400,
                    'message': 'The registration token is not a valid FCM registration token',
                    'status': 'INVALID_ARGUMENT',
                },
            }

            const response = {}
            if (body?.message?.token === 'PUSH_FAKE_TOKEN_SUCCESS') {
                response.json = () => ({})
            }
            if (body?.message?.token === 'PUSH_FAKE_TOKEN_FAIL') {
                response.json = () => errorState
            }
            return response
        }),
    }
})
describe('redStore adapter utils', () => {
    it('should succeed sending push notification to fake success push token ', async () => {
        const tokens = [PUSH_FAKE_TOKEN_SUCCESS]
        const [isOk, result] = await adapter.sendNotification({
            ...buildPushDataByToken(tokens, {
                notification: {
                    title: 'Hearth',
                    body: `${dayjs().format()} Hearth greets you!`,
                },
                data: {
                    appId: 'hearth',
                    type: 'notification',
                },
            }),
            appIds: {
                [PUSH_FAKE_TOKEN_SUCCESS]: 'hearth',
            },
            pushTypes: {
                [PUSH_FAKE_TOKEN_SUCCESS]: PUSH_TYPE_DEFAULT,
            },
        })

        expect(isOk).toBeTruthy()
        expect(result).toBeDefined()
        expect(result.successCount).toEqual(1)
        expect(result.responses).toBeDefined()
        expect(result.responses).toHaveLength(1)
    })

    it('tries to send push notification to real test push token if provided ', async () => {
        if (!REDSTORE_TEST_PUSHTOKEN) return

        const tokens = [REDSTORE_TEST_PUSHTOKEN]
        const [isOk, result] = await adapter.sendNotification({
            type: CUSTOM_CONTENT_MESSAGE_PUSH_TYPE,
            tokens,
            notification: {
                title: 'Hearth',
                body: `${dayjs().format()} Hearth greets you!`,
            },
            dataByToken: {
                [REDSTORE_TEST_PUSHTOKEN]: {
                    // app: 'hearth',
                    // type: 'notification',
                    recurrentPaymentContextId: faker.datatype.uuid(),
                    recurrentPaymentContext: { id: faker.datatype.uuid() },
                    errorCode: 'test2',
                },
            },
        })

        expect(isOk).toBeTruthy()
        expect(result).toBeDefined()
        expect(result.successCount).toEqual(1)
        expect(result.responses).toBeDefined()
        expect(result.responses).toHaveLength(1)
        expect(result.responses[0].success).toBeTruthy()
    })

    it('should fail sending push notification to fake fail push token ', async () => {
        const [isOk, result] = await adapter.sendNotification({
            ...buildPushDataByToken([PUSH_FAKE_TOKEN_FAIL], {
                notification: {
                    title: 'Hearth',
                    body: `${dayjs().format()} Hearth greets you!`,
                },
                data: {
                    appId: 'hearth',
                    type: 'notification',
                },
            }),
            appIds: {
                [PUSH_FAKE_TOKEN_FAIL]: 'hearth',
            },
            pushTypes: {
                [PUSH_FAKE_TOKEN_FAIL]: PUSH_TYPE_DEFAULT,
            },
        })

        expect(isOk).toBeFalsy()
        expect(result).toBeDefined()
        expect(result.failureCount).toEqual(1)
        expect(result.responses).toBeDefined()
        expect(result.responses).toHaveLength(1)
        expect(result.responses[0].success).toBeFalsy()
        expect(result.responses[0].error).toBeDefined()
    })

    it('should succeed sending push notification to fake success and fail push token ', async () => {
        const [isOk, result] = await adapter.sendNotification({
            ...buildPushDataByToken([PUSH_FAKE_TOKEN_SUCCESS, PUSH_FAKE_TOKEN_FAIL], {
                notification: {
                    title: 'Hearth',
                    body: `${dayjs().format()} Hearth greets you!`,
                },
                data: {
                    appId: 'hearth',
                    type: 'notification',
                },
            }),
            appIds: {
                [PUSH_FAKE_TOKEN_FAIL]: 'hearth',
                [PUSH_FAKE_TOKEN_SUCCESS]: 'hearth',
            },
            pushTypes: {
                [PUSH_FAKE_TOKEN_FAIL]: PUSH_TYPE_DEFAULT,
                [PUSH_FAKE_TOKEN_SUCCESS]: PUSH_TYPE_DEFAULT,
            },
        })

        expect(isOk).toBeTruthy()
        expect(result).toBeDefined()
        expect(result.successCount).toEqual(1)
        expect(result.failureCount).toEqual(1)
        expect(result.responses).toBeDefined()
        expect(result.responses).toHaveLength(2)

        const [successResponse, failResponse] = result.responses
        expect(successResponse.error).toBeFalsy()
        expect(successResponse.success).toBe(true)
        expect(failResponse.error).toBeDefined()
        expect(failResponse.success).toBe(false)
    })

    it('sends push notification of proper structure on pushType = PUSH_TYPE_DEFAULT', async () => {
        const pushData = {
            ...buildPushDataByToken([PUSH_FAKE_TOKEN_SUCCESS], {
                notification: {
                    title: 'Hearth',
                    body: `${dayjs().format()} Hearth greets you!`,
                },
                data: {
                    appId: 'hearth',
                    type: 'notification',
                },
            }),
            appIds: {
                [PUSH_FAKE_TOKEN_SUCCESS]: 'hearth',
            },
            pushTypes: {
                [PUSH_FAKE_TOKEN_SUCCESS]: PUSH_TYPE_DEFAULT,
            },
        }
        const [isOk, result] = await adapter.sendNotification(pushData)

        expect(isOk).toBeTruthy()
        expect(result).toBeDefined()
        expect(result.successCount).toEqual(1)
        expect(result.responses).toBeDefined()
        expect(result.responses).toHaveLength(1)
        expect(result.pushContext).toBeDefined()

        const pushContext = result.pushContext[PUSH_TYPE_DEFAULT]

        expect(pushContext).toBeDefined()
        expect(pushContext.notification).toBeDefined()
        expect(pushContext.notification.title).toEqual(pushData.notificationByToken[PUSH_FAKE_TOKEN_SUCCESS].title)
        expect(pushContext.notification.body).toEqual(pushData.notificationByToken[PUSH_FAKE_TOKEN_SUCCESS].body)
    })

    it.skip('doesnt send push notification to app with disabled notifications', async () => {
        const pushData = {
            tokens: [PUSH_FAKE_TOKEN_SUCCESS],
            notification: {
                title: 'Hearth',
                body: `${dayjs().format()} Hearth greets you!`,
            },
            data: {
                appId : 'hearth.app.clients',
                type: 'notification',
            },
            appIds: {
                [PUSH_FAKE_TOKEN_FAIL]: 'hearth.app.clients',
                [PUSH_FAKE_TOKEN_FAIL]: 'hearth',
            },
            pushTypes: {
                [PUSH_FAKE_TOKEN_FAIL]: PUSH_TYPE_DEFAULT,
                [PUSH_FAKE_TOKEN_SUCCESS]: PUSH_TYPE_DEFAULT,
            },
        }
        const [isOk, result] = await adapter.sendNotification(pushData)

        // it should be FALSE ?!
        expect(isOk).toBeFalsy()
        expect(result).toBeDefined()
        expect(result.pushContext).toBeDefined()
    })

    it('should fail to send invalid push notification with missing title to fake success push token ', async () => {
        await expect(
            adapter.sendNotification({
                tokens: [PUSH_FAKE_TOKEN_SUCCESS],
                notification: {
                    body: `${dayjs().format()} Hearth greets you!`,
                },
                dataByToken: {
                    [PUSH_FAKE_TOKEN_SUCCESS]: {
                        appId: 'hearth',
                        type: 'notification',
                    },
                },
                appIds: {
                    [PUSH_FAKE_TOKEN_SUCCESS]: 'hearth',
                },
                pushTypes: {
                    [PUSH_FAKE_TOKEN_SUCCESS]: PUSH_TYPE_DEFAULT,
                },
            }),
        ).rejects.toThrow('Missing notification.title or notification.body')
    })

    it('should fail to send invalid push notification with missing body to fake success push token ', async () => {
        await expect(
            adapter.sendNotification({
                tokens: [PUSH_FAKE_TOKEN_SUCCESS],
                notification: {
                    title: 'hearth',
                },
                dataByToken: {
                    [PUSH_FAKE_TOKEN_SUCCESS]: {
                        appId: 'hearth',
                        type: 'notification',
                    },
                },
                appIds: {
                    [PUSH_FAKE_TOKEN_SUCCESS]: 'hearth',
                },
                pushTypes: {
                    [PUSH_FAKE_TOKEN_SUCCESS]: PUSH_TYPE_DEFAULT,
                },
            }),
        ).rejects.toThrow('Missing notification.title or notification.body')
    })

    it('makes sure that PUSH notification data fields are all of string type (converted & normalized)', async () => {
        const data = {
            ticketId: faker.datatype.uuid(),
            ticketNumber: faker.datatype.number(8), // number type
            userId: faker.datatype.uuid(),
        }
        const preparedData = RedStoreAdapter.prepareData(data)

        expect(typeof preparedData.ticketNumber).toEqual('string')
    })

})
