/**
 * Start recurrent payment seeking for new billing receipts processing task
 *
 * Usage:
 *      yarn workspace @app/hearth node bin/billing/createRecurrentPaymentForNewBillingReceipt
 */

const path = require('path')

const { prepareKeystoneExpressApp } = require('@open-hearth/keystone/prepareKeystoneApp')

const {
    createRecurrentPaymentForNewBillingReceipt,
} = require('@hearth/domains/acquiring/tasks/createRecurrentPaymentForNewBillingReceipt')

async function main () {
    await prepareKeystoneExpressApp(
        path.resolve('./index.js'),
        { excludeApps: ['NextApp'] },
    )

    await createRecurrentPaymentForNewBillingReceipt()
    process.exit(0)
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
