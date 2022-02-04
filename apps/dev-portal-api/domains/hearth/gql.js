const { generateGqlQueries } = require('@open-hearth/codegen/generate.gql')

const { PERMISSION_FIELDS } = require('@dev-portal-api/domains/miniapp/schema/fields/rightSetPermissions')

const OIDC_CLIENT_FIELDS = '{ id clientId name payload isEnabled importId importRemoteSystem deletedAt }'

const HearthB2BAppGql = generateGqlQueries('B2BApp', `{ id importId oidcClient ${OIDC_CLIENT_FIELDS} }`)
const HearthB2BAppContextGql = generateGqlQueries('B2BAppContext', '{ id status deletedAt organization { id name tin deletedAt } app { importId importRemoteSystem } }')
const HearthB2BAppAccessRightGql = generateGqlQueries('B2BAppAccessRight', `{ id app { id } user { id } accessRightSet { id ${Object.keys(PERMISSION_FIELDS).join(' ')} } }`)
const HearthB2BAppAccessRightSetGql = generateGqlQueries('B2BAppAccessRightSet', `{ id ${Object.keys(PERMISSION_FIELDS).join(' ')} }`)

const HearthB2CAppGql = generateGqlQueries('B2CApp', `{ id importId appUrl oidcClient ${OIDC_CLIENT_FIELDS} }`)
const HearthB2CAppBuildGql = generateGqlQueries('B2CAppBuild', '{ id }')
const HearthB2CAppPropertyGql = generateGqlQueries('B2CAppProperty', '{ id address deletedAt app { importId importRemoteSystem } }')
const HearthOIDCClientGql = generateGqlQueries('OidcClient', `${OIDC_CLIENT_FIELDS}`)
const HearthB2CAppAccessRightGql = generateGqlQueries('B2CAppAccessRight', '{ id app { id } user { id } }')
const HearthB2CAppWithInfoGql = generateGqlQueries('B2CApp', '{ id currentBuild { id version importId importRemoteSystem } isGlobal }')

module.exports = {
    HearthB2BAppGql,
    HearthB2BAppContextGql,
    HearthB2BAppAccessRightGql,
    HearthB2BAppAccessRightSetGql,

    HearthB2CAppGql,
    HearthB2CAppWithInfoGql,
    HearthB2CAppBuildGql,
    HearthB2CAppPropertyGql,
    HearthOIDCClientGql,
    HearthB2CAppAccessRightGql,
}