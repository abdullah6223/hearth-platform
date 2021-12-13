const { getById } = require('@open-hearth/keystone/schema')

const { NON_SERVICE_USER_ERROR } = require('@hearth/domains/miniapp/constants')
const { SERVICE } = require('@hearth/domains/user/constants/common')

const SERVICE_USER_FIELD = {
    schemaDoc: `Link to user. Note, that user must be of "${SERVICE}" type`,
    type: 'Relationship',
    ref: 'User',
    isRequired: true,
    knexOptions: { isNotNullable: true }, // Required relationship only!
    kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
    hooks: {
        validateInput: async ({ resolvedData, fieldPath, addFieldValidationError }) => {
            if (resolvedData[fieldPath]) {
                const user = await getById('User', resolvedData[fieldPath])
                if (!user || user.type !== SERVICE) {
                    addFieldValidationError(NON_SERVICE_USER_ERROR)
                }
            }
        },
    },
}

module.exports = {
    SERVICE_USER_FIELD,
}