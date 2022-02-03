const { createWorker } = require('@open-hearth/keystone/tasks')

const index = require('./index')

createWorker(index, process.argv.slice(2))
    .catch((error) => {
        console.error(error)
        process.exit(2)
    })
