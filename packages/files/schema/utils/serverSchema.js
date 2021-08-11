const { generateServerUtils } = require('@open-hearth/codegen/generate.server.utils')

const FileRecord = generateServerUtils('FileRecord')

module.exports = {
    FileRecord,
}
