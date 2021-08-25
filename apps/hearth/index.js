const { NextApp } = require('@open-keystone/app-next')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
const isBetween = require('dayjs/plugin/isBetween')
const timezone = require('dayjs/plugin/timezone')
const utc = require('dayjs/plugin/utc')

const conf = require('@open-hearth/config')
const { FeaturesMiddleware } = require('@open-hearth/featureflags/FeaturesMiddleware')
const { FileMiddleware } = require('@open-hearth/files/fileMiddleware')
const { AdapterCache } = require('@open-hearth/keystone/adapterCache')
const { GQLError, GQLErrorCode: { FORBIDDEN } } = require('@open-hearth/keystone/errors')
const FileAdapter = require('@open-hearth/keystone/fileAdapter/fileAdapter')
const {
    HealthCheck,
    getRedisHealthCheck,
    getPostgresHealthCheck,
    getPfxCertificateHealthCheck,
} = require('@open-hearth/keystone/healthCheck')
const { prepareKeystone } = require('@open-hearth/keystone/KSv5v6/v5/prepareKeystone')
const { RequestCache } = require('@open-hearth/keystone/requestCache')
const { find } = require('@open-hearth/keystone/schema')
const { MessagingMiddleware, setupMessaging } = require('@open-hearth/messaging')
const { getWebhookModels } = require('@open-hearth/webhooks/schema')
const { getWebhookTasks } = require('@open-hearth/webhooks/tasks')

const { PaymentLinkMiddleware } = require('@hearth/domains/acquiring/PaymentLinkMiddleware')
const { WEBHOOK_EVENTS } = require('@hearth/domains/common/constants/webhooks')
const { VersioningMiddleware } = require('@hearth/domains/common/utils/VersioningMiddleware')
const { ACCESS_TOKEN_SESSION_ID_PREFIX } = require('@hearth/domains/miniapp/constants')
const { VoIPMiddleware } = require('@hearth/domains/miniapp/VoIPMiddleware')
const { UnsubscribeMiddleware } = require('@hearth/domains/notification/UnsubscribeMiddleware')
const { UserExternalIdentityMiddleware } = require('@hearth/domains/user/integration/UserExternalIdentityMiddleware')
const { OIDCMiddleware } = require('@hearth/domains/user/oidc')

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

const IS_BUILD_PHASE = conf.PHASE === 'build'

// TODO: HEARTH-2990: add FILE_FIELD_ADAPTER to env during build phase
if (IS_BUILD_PHASE) {
    process.env.FILE_FIELD_ADAPTER = 'local' // Test
}

const schemas = () => [
    require('@hearth/domains/common/schema'),
    require('@hearth/domains/user/schema'),
    require('@hearth/domains/organization/schema'),
    require('@hearth/domains/property/schema'),
    require('@hearth/domains/billing/schema'),
    require('@hearth/domains/banking/schema'),
    require('@hearth/domains/ticket/schema'),
    require('@hearth/domains/notification/schema'),
    require('@hearth/domains/contact/schema'),
    require('@hearth/domains/resident/schema'),
    require('@hearth/domains/onboarding/schema'),
    require('@hearth/domains/meter/schema'),
    require('@hearth/domains/subscription/schema'),
    require('@hearth/domains/acquiring/schema'),
    require('@hearth/domains/analytics/schema'),
    require('@hearth/domains/scope/schema'),
    require('@hearth/domains/news/schema'),
    require('@hearth/domains/miniapp/schema'),
    require('@hearth/domains/settings/schema'),
    require('@hearth/domains/marketplace/schema'),
    require('@hearth/domains/document/schema'),
    require('@hearth/domains/ai/schema'),
    getWebhookModels('@app/hearth/schema.graphql', WEBHOOK_EVENTS),
    require('@open-hearth/files/schema'),
]

const tasks = () => [
    require('@hearth/domains/common/tasks'),
    require('@hearth/domains/acquiring/tasks'),
    require('@hearth/domains/notification/tasks'),
    require('@hearth/domains/organization/tasks'),
    require('@hearth/domains/ticket/tasks'),
    require('@hearth/domains/resident/tasks'),
    require('@hearth/domains/scope/tasks'),
    require('@hearth/domains/news/tasks'),
    require('@hearth/domains/miniapp/tasks'),
    getWebhookTasks('low'),
    require('@hearth/domains/marketplace/tasks'),
    require('@hearth/domains/analytics/tasks'),
    require('@hearth/domains/ai/tasks'),
    require('@hearth/domains/subscription/tasks'),
]

const checks = [
    getRedisHealthCheck(),
    getPostgresHealthCheck(),
    getPfxCertificateHealthCheck({
        certificateName: 'sber_id_client',
        getPfxParams: () => {
            const { certificate, passphrase } = conf['SBER_ID_CONFIG'] && JSON.parse(conf['SBER_ID_CONFIG']) || {}
            return { pfx: certificate, passphrase }
        },
    }),
    getPfxCertificateHealthCheck({
        certificateName: 'sbbol_client',
        getPfxParams: () => {
            const SBBOL_PFX = conf['SBBOL_PFX'] && JSON.parse(conf['SBBOL_PFX']) || {}
            return { pfx: SBBOL_PFX.certificate, passphrase: SBBOL_PFX.passphrase }
        },
    }),
    getPfxCertificateHealthCheck({
        certificateName: 'sbbol_client_extended',
        getPfxParams: () => {
            const SBBOL_PFX_EXTENDED = conf['SBBOL_PFX_EXTENDED'] && JSON.parse(conf['SBBOL_PFX_EXTENDED']) || {}
            return { pfx: SBBOL_PFX_EXTENDED.certificate, passphrase: SBBOL_PFX_EXTENDED.passphrase }
        },
    }),
]

const lastApp = conf.DISABLE_NEXT_APP ? undefined : new NextApp({ dir: '.' })

const apps = () => {
    return [
        new HealthCheck({ checks }),
        new RequestCache(conf.REQUEST_CACHE_CONFIG ? JSON.parse(conf.REQUEST_CACHE_CONFIG) : { enabled: false }),
        new AdapterCache(conf.ADAPTER_CACHE_CONFIG ? JSON.parse(conf.ADAPTER_CACHE_CONFIG) : { enabled: false }),
        new VersioningMiddleware(),
        new OIDCMiddleware(),
        new FeaturesMiddleware(),
        new MessagingMiddleware(),
        new PaymentLinkMiddleware(),
        new UnsubscribeMiddleware(),
        new FileMiddleware({ apiPrefix: '/api/files' }),
        FileAdapter.makeFileAdapterMiddleware(),
        new UserExternalIdentityMiddleware(),
        new VoIPMiddleware(),
    ]
}

/** @type {(app: import('express').Application) => void} */
const extendExpressApp = (app) => {
    // shared state visible to the helper
    app.locals._grace = app.locals._grace || { draining: false, inflight: 0 }

    app.get('/.well-known/apollo/server-health', (req, res, next) => {
        if (req.app.locals._grace.draining) return res.status(503).json({ status: 'shutting_down' })
        next()
    })

    app.get('/.well-known/change-password', function (req, res) {
        res.redirect('/auth/forgot')
    })
}

const authStrategyOpts = {
    hooks: {
        // Sessions linked can be permanent tokens can only be destroyed by deleting linking model, such as B2BAppToken
        beforeUnauth ({ context }) {
            const sessionId = context.req.sessionID
            const isManualSession = [ACCESS_TOKEN_SESSION_ID_PREFIX].some(prefix => sessionId.startsWith(prefix))
            if (isManualSession) {
                throw new GQLError({
                    type: FORBIDDEN,
                    code: FORBIDDEN,
                    message: 'You can not log out with token',
                }, context)
            }
        },
    },
}

setupMessaging({
    accessCheckers: {
        organization: async (context, userId, organizationId) => {
            const employees = await find('OrganizationEmployee', {
                user: { id: userId },
                organization: { id: organizationId },
                isAccepted: true,
                isRejected: false,
                isBlocked: false,
                deletedAt: null,
            })
            return employees.length > 0
        },
    },
})

module.exports = prepareKeystone({
    extendExpressApp,
    schemas, tasks, queues: ['low', 'medium', 'high'],
    apps, lastApp,
    ui: { hooks: require.resolve('@app/hearth/admin-ui') },
    authStrategyOpts,
})
