const { getSchemaCtx, find } = require('@open-hearth/keystone/schema')
const { createTask } = require('@open-hearth/keystone/tasks')

const { PropertyScopeProperty } = require('@hearth/domains/scope/utils/serverSchema')

/**
 * Soft delete related PropertyScopeProperty after delete PropertyScope object
 */
async function deleteRelatedPropertyScopeProperty (deletedPropertyScope, deletedMeterAt) {
    const { keystone: context } = await getSchemaCtx('Property')

    const propertyScopeId = deletedPropertyScope.id
    const propertyScopeProperties = await find('PropertyScopeProperty', {
        propertyScope: { id: propertyScopeId },
        deletedAt: null,
    })

    for (const propertyScopeProperty of propertyScopeProperties) {
        await PropertyScopeProperty.update(context, propertyScopeProperty.id, {
            deletedAt: deletedMeterAt,
            dv: deletedPropertyScope.dv,
            sender: deletedPropertyScope.sender,
        })
    }
}

module.exports = {
    deleteRelatedPropertyScopeProperty: createTask('deleteRelatedPropertyScopeProperty', deleteRelatedPropertyScopeProperty),
}
