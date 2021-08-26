/**
 * Start recurrent payment processing task
 *
 * Usage:
 *      yarn workspace @app/hearth node bin/billing/chargeRecurrentPayments
 */

const path = require('path')

const { prepareKeystoneExpressApp } = require('@open-hearth/keystone/prepareKeystoneApp')

const {
    chargeRecurrentPayments,
} = require('@hearth/domains/acquiring/tasks/chargeRecurrentPayments')

async function main () {
    await prepareKeystoneExpressApp(
        path.resolve('./index.js'),
        { excludeApps: ['NextApp'] },
    )

    await chargeRecurrentPayments()
    process.exit(0)
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
