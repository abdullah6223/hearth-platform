const { HealthCheck, getPostgresHealthCheck, getRedisHealthCheck } = require('@open-hearth/keystone/healthCheck')
const { StitchSchemaMiddleware } = require('@open-hearth/keystone/stitchSchema')
const { HearthOIDCMiddleware } = require('@app/{{name}}/middlewares/oidc')
const { FeaturesMiddleware } = require('@open-hearth/featureflags/FeaturesMiddleware')
const { prepareKeystone } = require('@open-hearth/keystone/KSv5v6/v5/prepareKeystone')


const schemas = () => [
    require('@{{name}}/domains/user/schema'),
]

const apps = () => [
    new HealthCheck({ checks: [getPostgresHealthCheck(), getRedisHealthCheck()] }),
    new StitchSchemaMiddleware({ apiUrl: '/graphql' }),
    new HearthOIDCMiddleware(),
    new FeaturesMiddleware(),
]

const tasks = () => []

module.exports = prepareKeystone({
    schemas, apps, tasks,
})