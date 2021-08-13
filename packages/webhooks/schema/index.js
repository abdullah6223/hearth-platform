const { Webhook } = require('@open-hearth/webhooks/schema/models/Webhook')
const { getWebhookPayloadModel } = require('@open-hearth/webhooks/schema/models/WebhookPayload')
const { getWebhookSubscriptionModel } = require('@open-hearth/webhooks/schema/models/WebhookSubscription')

/**
 * Returns all webhook models (Webhook, WebhookSubscription, WebhookPayload)
 *
 * IMPORTANT: This function must be called AFTER all domain schemas that use
 * webHooked() plugin have been registered. The WebhookSubscription.model field
 * will be a Select containing ONLY models registered via webHooked() plugin.
 * If no webHooked() models are registered, the field degrades to Text.
 * In the schemas() array, always place getWebhookModels() after domain schemas.
 *
 * @param {string} schemaPath - Path to GraphQL schema file
 * @param {Array<string>} [appWebhooksEventsTypes] - Array of event types supported by the application
 * @returns {Object} Object with Webhook, WebhookSubscription, and WebhookPayload models
 */
function getWebhookModels (schemaPath, appWebhooksEventsTypes = []) {
    return {
        Webhook,
        WebhookSubscription: getWebhookSubscriptionModel(schemaPath),
        WebhookPayload: getWebhookPayloadModel(appWebhooksEventsTypes),
    }
}

module.exports = {
    getWebhookModels,
}
