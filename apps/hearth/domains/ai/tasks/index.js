const { createTask } = require('@open-hearth/keystone/tasks')

const { executeAIFlow } = require('./executeAIFlow')


module.exports = {
    executeAIFlow: createTask('executeAIFlow', executeAIFlow),
}
