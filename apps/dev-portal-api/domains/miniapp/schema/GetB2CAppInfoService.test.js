const { makeClient } = require('@open-hearth/keystone/test.utils')
const { expectToThrowAccessDeniedErrorToResult, expectToThrowAuthenticationErrorToResult } = require('@open-hearth/keystone/test.utils')

const { DEV_ENVIRONMENT } = require('@dev-portal-api/domains/miniapp/constants/publishing')
const {
    B2CApp,
    getB2CAppInfoByTestClient,
    createTestB2CApp,
    createTestB2CAppBuild,
    publishB2CAppByTestClient,
    createHearthB2CApp,
    createHearthB2CAppBuild,
    updateHearthB2CApp,
    importB2CAppByTestClient,
} = require('@dev-portal-api/domains/miniapp/utils/testSchema')
const {
    makeLoggedInAdminClient,
    makeLoggedInSupportClient,
    makeRegisteredAndLoggedInUser,
    makeLoggedInHearthAdminClient,
} = require('@dev-portal-api/domains/user/utils/testSchema')

describe('GetB2CAppInfoService', () => {
    let admin
    let support
    let b2cUser
    let b2cApp
    let b2bUser
    let anonymous
    let build
    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()
        support = await makeLoggedInSupportClient()
        b2cUser = await makeRegisteredAndLoggedInUser()
        b2bUser = await makeRegisteredAndLoggedInUser()
        anonymous = await makeClient();

        [b2cApp] = await createTestB2CApp(b2cUser);
        [build] = await createTestB2CAppBuild(b2cUser, b2cApp)
        await publishB2CAppByTestClient(b2cUser, b2cApp, { info: true, build: { id: build.id } })
        b2cApp = await B2CApp.getOne(b2cUser, { id: b2cApp.id })
    })
    describe('Access tests', () => {
        test('Admin can get app info of any app', async () => {
            const [info] = await getB2CAppInfoByTestClient(admin, b2cApp)
            expect(info).toEqual({
                id: b2cApp.developmentExportId,
                environment: DEV_ENVIRONMENT,
                currentBuild: { id: expect.stringContaining(''), version: build.version },
                isGlobal: false,
            })
        })
        test('Support can get app info of any app', async () => {
            const [info] = await getB2CAppInfoByTestClient(support, b2cApp)
            expect(info).toEqual({
                id: b2cApp.developmentExportId,
                environment: DEV_ENVIRONMENT,
                currentBuild: { id: expect.stringContaining(''), version: build.version },
                isGlobal: false,
            })
        })
        describe('User', () => {
            test('Can get app info of app he created', async () => {
                const [info] = await getB2CAppInfoByTestClient(b2cUser, b2cApp)
                expect(info).toEqual({
                    id: b2cApp.developmentExportId,
                    environment: DEV_ENVIRONMENT,
                    currentBuild: { id: expect.stringContaining(''), version: build.version },
                    isGlobal: false,
                })
            })
            test('Cannot for other apps', async () => {
                await expectToThrowAccessDeniedErrorToResult(async () => {
                    await getB2CAppInfoByTestClient(b2bUser, b2cApp)
                })
            })
        })
        test('Anonymous cannot get any app info', async () => {
            await expectToThrowAuthenticationErrorToResult(async () => {
                await getB2CAppInfoByTestClient(anonymous, b2cApp)
            })
        })
    })
    describe('Build version', () => {
        let hearthAdmin
        beforeAll(async () => {
            hearthAdmin = await makeLoggedInHearthAdminClient()
        })
        test('Must omit hash-suffix if published with zip-modification', async () => {
            const [app] = await createTestB2CApp(b2cUser)
            const [appBuild] = await createTestB2CAppBuild(b2cUser, app)
            await publishB2CAppByTestClient(b2cUser, app, { info: true, build: { id: appBuild.id } })
            const publishedApp = await B2CApp.getOne(b2cUser, { id: app.id })

            const [info] = await getB2CAppInfoByTestClient(b2cUser, publishedApp)

            expect(info.currentBuild.version).toBe(appBuild.version)
            expect(info).toHaveProperty('isGlobal', false)
        })
        test('Must show original version if created directly in hearth', async () => {
            const [hearthApp] = await createHearthB2CApp(hearthAdmin)
            const [hearthBuild] = await createHearthB2CAppBuild(hearthAdmin, hearthApp, { version: 'my-custom-version' })
            await updateHearthB2CApp(hearthAdmin, hearthApp, { currentBuild: { connect: { id: hearthBuild.id } } })

            const [app] = await createTestB2CApp(b2cUser)
            await importB2CAppByTestClient(support, app, hearthApp)
            const importedApp = await B2CApp.getOne(b2cUser, { id: app.id })

            const [info] = await getB2CAppInfoByTestClient(b2cUser, importedApp)

            expect(info.currentBuild.version).toBe(hearthBuild.version)
            expect(Object.keys(info.currentBuild).toSorted()).toEqual(['id', 'version'].toSorted())
            expect(info).toHaveProperty('isGlobal', false)
        })
    })
    describe('isGlobal field', () => {
        test('Returns true for global app', async () => {
            const [app] = await createTestB2CApp(b2cUser)
            const [appBuild] = await createTestB2CAppBuild(b2cUser, app)
            await publishB2CAppByTestClient(b2cUser, app, { info: true, build: { id: appBuild.id } })
            const publishedApp = await B2CApp.getOne(b2cUser, { id: app.id })

            const hearthAdmin = await makeLoggedInHearthAdminClient()
            await updateHearthB2CApp(hearthAdmin, { id: publishedApp.developmentExportId }, { isGlobal: true })

            const [info] = await getB2CAppInfoByTestClient(b2cUser, publishedApp)
            expect(info).toHaveProperty('isGlobal', true)
        })
    })
})