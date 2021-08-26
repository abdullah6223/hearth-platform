/**
 * Start recurrent payment notification processing task
 *
 * Usage:
 *      yarn workspace @app/hearth node bin/billing/notifyBeforeRecurrentPaymentDate
 */

const path = require('path')

const { prepareKeystoneExpressApp } = require('@open-hearth/keystone/prepareKeystoneApp')

const {
    notifyBeforeRecurrentPaymentDate,
} = require('@hearth/domains/acquiring/tasks/notifyBeforeRecurrentPaymentDate')

async function main () {
    await prepareKeystoneExpressApp(
        path.resolve('./index.js'),
        { excludeApps: ['NextApp'] },
    )

    await notifyBeforeRecurrentPaymentDate()
    process.exit(0)
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
