const { getLogger } = require('@open-hearth/keystone/logging')
const { createCronTask } = require('@open-hearth/keystone/tasks')

const logger = getLogger('simple-cron-task')

// Runs yearly
module.exportts = {
    sampleTask: createCronTask('commonSampleCronTask', '0 0 1 1 *', () => {
        logger.info('common-sample-cron-task successful call')
    }),
}