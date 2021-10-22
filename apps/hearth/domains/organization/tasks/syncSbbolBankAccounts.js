const get = require('lodash/get')
const isEmpty = require('lodash/isEmpty')

const { getLogger } = require('@open-hearth/keystone/logging')
const { getSchemaCtx } = require('@open-hearth/keystone/schema')
const { createCronTask } = require('@open-hearth/keystone/tasks')

const { BANK_INTEGRATION_IDS } = require('@hearth/domains/banking/constants')
const { BankIntegration } = require('@hearth/domains/banking/utils/serverSchema')
const { SBBOL_IMPORT_NAME } = require('@hearth/domains/organization/integrations/sbbol/constants')
const { syncBankAccounts } = require('@hearth/domains/organization/integrations/sbbol/sync/syncBankAccounts')
const { OrganizationEmployee } = require('@hearth/domains/organization/utils/serverSchema')
const { SBBOL_IDP_TYPE } = require('@hearth/domains/user/constants/identityProviders')
const { UserExternalIdentity } = require('@hearth/domains/user/utils/serverSchema')



const logger = getLogger()

/**
 * Syncs bank accounts with SBBOL accounts
 */
async function syncSbbolBankAccounts () {
    const { keystone: context } = await getSchemaCtx('User')
    // TODO: HEARTH-5239 Should not receive deleted instances with admin context
    const usersWithSBBOLExternalIdentity = await UserExternalIdentity.getAll(context, {
        identityType: SBBOL_IDP_TYPE,
        deletedAt: null,
    }, 'id user { id }')
    if (isEmpty(usersWithSBBOLExternalIdentity)) return logger.info('no users imported from SBBOL found. Cancel sync bank accounts')

    const integration = await BankIntegration.getOne(context, { id: BANK_INTEGRATION_IDS.SBBOL })
    if (!integration) throw new Error(`Cannot find SBBOL integration by id=" ${BANK_INTEGRATION_IDS.SBBOL}"`)

    const syncedOrgIds = []
    for (let identity of usersWithSBBOLExternalIdentity) {
        const [employee] = await OrganizationEmployee.getAll(context, {
            user: {
                id: identity.user.id,
            },
            organization: {
                id_not_in: syncedOrgIds,
                importRemoteSystem: SBBOL_IMPORT_NAME,
                deletedAt: null,
            },
            deletedAt: null,
            isRejected: false,
            isBlocked: false,
        }, 'organization { id tin name }', { first: 1 })

        if (employee) {
            const organization = get(employee, 'organization')
            await syncBankAccounts(identity.user.id, organization)
            syncedOrgIds.push(organization.id)
        }
    }

}

module.exports = {
    syncSbbolBankAccountsCron: createCronTask(
        'syncSbbolBankAccountsCron',
        '0 0 * * *',
        syncSbbolBankAccounts
    ),
}
