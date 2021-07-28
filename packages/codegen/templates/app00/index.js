const { NextApp } = require('@open-keystone/app-next')

const conf = require('@open-hearth/config')
const { HealthCheck, getPostgresHealthCheck, getRedisHealthCheck } = require('@open-hearth/keystone/healthCheck')
const { StitchSchemaMiddleware } = require('@open-hearth/keystone/stitchSchema')
const { HearthOIDCMiddleware } = require('@app/{{name}}/middlewares/oidc')
const { prepareKeystone } = require('@open-hearth/keystone/KSv5v6/v5/prepareKeystone')


const lastApp = conf.DISABLE_NEXT_APP ? undefined : new NextApp({ dir: '.' })

const schemas = () => [
    require('@{{name}}/domains/user/schema'),
]

const apps = () => [
    new HealthCheck({ checks: [getPostgresHealthCheck(), getRedisHealthCheck()] }),
    new StitchSchemaMiddleware({ apiUrl: '/graphql' }),
    new HearthOIDCMiddleware(),
]

const tasks = () => []

module.exports = prepareKeystone({
    lastApp, schemas, apps, tasks,
})