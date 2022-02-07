const { GQLError, GQLErrorCode: { BAD_USER_INPUT } } = require('@open-hearth/keystone/errors')
const { getByCondition } = require('@open-hearth/keystone/schema')

const { productionClient, developmentClient } = require('@dev-portal-api/domains/common/utils/serverClients')
const { HearthB2BAppGql, HearthB2CAppGql } = require('@dev-portal-api/domains/hearth/gql')
const { APP_NOT_FOUND } = require('@dev-portal-api/domains/miniapp/constants/errors')
const { PROD_ENVIRONMENT } = require('@dev-portal-api/domains/miniapp/constants/publishing')



const ERRORS = {
    APP_NOT_FOUND: {
        code: BAD_USER_INPUT,
        type: APP_NOT_FOUND,
        message: 'The application with the specified ID was not found',
        messageForUser: 'api.miniapp.APP_NOT_FOUND',
    },
}

async function findHearthApp ({ args, context, modelGql, modelName }) {
    const { data: { app: { id }, environment } } = args

    const exportField = `${environment}ExportId`
    const serverClient = environment === PROD_ENVIRONMENT
        ? productionClient
        : developmentClient

    const app = await getByCondition(modelName, { id, deletedAt: null })
    if (!app || !app[exportField]) {
        throw new GQLError(ERRORS.APP_NOT_FOUND, context)
    }

    const hearthAppId = app[exportField]
    const hearthApp = await serverClient.findExportedModel({
        modelGql,
        exportId: hearthAppId,
        id: app.id,
        context,
    })

    if (!hearthApp) {
        throw new GQLError(ERRORS.APP_NOT_FOUND, context)
    }

    return { hearthApp, serverClient }
}

async function findHearthB2BApp ({ args, context }) {
    return await findHearthApp({ args, context, modelGql: HearthB2BAppGql, modelName: 'B2BApp' })
}

async function findHearthB2CApp ({ args, context }) {
    return await findHearthApp({ args, context, modelGql: HearthB2CAppGql, modelName: 'B2CApp' })
}

module.exports = {
    findHearthB2CApp,
    findHearthB2BApp,
}