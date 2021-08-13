const { find } = require('@open-hearth/keystone/schema')

async function sendModelWebhooks (modelName) {
    const { getWebhookTasks } = require('@open-hearth/webhooks/tasks')
    // TODO(HEARTH-4570): Add filter for only responsive subscriptions (failCount < threshold)
    // NOTE: find to bypass default limitations, since relations are not used here
    const subscriptions = await find('WebhookSubscription', {
        deletedAt: null,
        model: modelName,
        webhook: {  deletedAt: null },
    })

    const { sendWebhook } = getWebhookTasks()

    for (const subscription of subscriptions) {
        await sendWebhook.delay(subscription.id)
    }
}

module.exports = {
    sendModelWebhooks,
}
