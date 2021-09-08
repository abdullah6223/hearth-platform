const path = require('path')

const index = require('@app/hearth/index')

const conf = require('@open-hearth/config')
const { FileMiddlewareTests } = require('@open-hearth/files/fileMiddleware.test')
const { FileMiddlewareUtilsTests } = require('@open-hearth/files/utils.test')
const { setFakeClientMode } = require('@open-hearth/keystone/test.utils')

const { createTestOrganization } = require('@hearth/domains/organization/utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser, User } = require('@hearth/domains/user/utils/testSchema')

const TEST_FILE = path.resolve(conf['PROJECT_ROOT'], 'apps/hearth/domains/common/test-assets/dino.png')

setFakeClientMode(index, { excludeApps: ['NextApp', 'AdminUIApp'] })

describe('external file middleware tests', () => {
    FileMiddlewareTests(TEST_FILE, User, makeClientWithNewRegisteredAndLoggedInUser, createTestOrganization)
})

describe('external file middleware utils', () => {
    FileMiddlewareUtilsTests()
})
