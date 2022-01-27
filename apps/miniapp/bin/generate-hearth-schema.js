const { generateHearthSchema } = require('@open-hearth/codegen/generate-hearth-schema')

const { HEARTH_CONFIG } = require('@miniapp/domains/hearth/gql')


generateHearthSchema(HEARTH_CONFIG)
