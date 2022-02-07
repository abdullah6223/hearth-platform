const { getDevicePermissionsFields, getDevicePermissionFieldName, getDevicePermissions } = require('@hearth/domains/miniapp/schema/fields/devicePermissions')
const { AVAILABLE_ENVIRONMENTS } = require('@dev-portal-api/domains/miniapp/constants/publishing')

const { getEnvironmentalFields, getEnvironmentalFieldName } = require('./environmental')

function _getEnvironmentalNameFromHearthFormat (environment, hearthFieldName) {
    const fieldName = hearthFieldName.slice(2) // remove 'is' prefix

    return getEnvironmentalFieldName(environment, fieldName)
}

function getEnvironmentalPermissionsFieldsSelection ({ listKey }) {
    const result = []
    const permissions = getDevicePermissions({ listKey })
    for (const permission of permissions) {
        for (const environment of AVAILABLE_ENVIRONMENTS) {
            const hearthFieldName = getDevicePermissionFieldName(permission)
            const portalFieldName = _getEnvironmentalNameFromHearthFormat(environment, hearthFieldName)
            result.push(portalFieldName)
        }
    }
    return result.join(' ')
}

function getEnvironmentalPermissionsFields ({ listKey }) {
    const commonFields = getDevicePermissionsFields({ listKey })

    return Object.assign({}, ...Object.entries(commonFields).map(([name, field]) => {
        const fieldName = name.slice(2) // remove 'is' prefix

        return getEnvironmentalFields(fieldName, {
            ...field,
            schemaDoc: field.schemaDoc + ' on {environment} environment',
        })
    }))
}

function extractDevicePermissionsForHearth (devPortalApp, environment) {
    const hearthFields = {}
    const allPermissions = getDevicePermissions()

    for (const permission of allPermissions) {
        const hearthFieldName = getDevicePermissionFieldName(permission)
        const portalFieldName = _getEnvironmentalNameFromHearthFormat(environment, hearthFieldName)
        if (Object.hasOwn(devPortalApp, portalFieldName)) {
            hearthFields[hearthFieldName] = devPortalApp[portalFieldName]
        }
    }

    return hearthFields
}

module.exports = {
    getEnvironmentalPermissionsFields,
    extractDevicePermissionsForHearth,
    getEnvironmentalPermissionsFieldsSelection,
}
