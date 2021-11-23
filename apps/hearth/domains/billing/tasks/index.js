const { createTask } = require('@open-hearth/keystone/tasks')

const { sendNewBillingReceiptFilesNotifications } = require('./sendNewBillingReceiptFilesNotifications')

module.exports = {
    sendNewBillingReceiptFilesNotifications: createTask('sendNewBillingReceiptFilesNotifications', sendNewBillingReceiptFilesNotifications),
}