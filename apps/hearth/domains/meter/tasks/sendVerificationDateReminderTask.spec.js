/**
 * @jest-environment node
 */

const index = require('@app/hearth/index')

const { setFakeClientMode, setAllFeatureFlags } = require('@open-hearth/keystone/test.utils')

const sendVerificationDateReminderTask = require('@hearth/domains/meter/tasks/sendVerificationDateReminderTask')


describe('Meter verification notification task', () => {
    setFakeClientMode(index)

    describe('feature flag', () => {
        it('checks for proper result on enabled', async () => {
            setAllFeatureFlags(true)
            expect(await sendVerificationDateReminderTask.delay.fn()).toBeUndefined()
        })

        it('checks for proper result on disabled', async () => {
            setAllFeatureFlags(false)
            expect(await sendVerificationDateReminderTask.delay.fn()).toEqual('disabled')
        })
    })
})
