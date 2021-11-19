/**
 * @jest-environment node
 */

const index = require('@app/hearth/index')

const { setFakeClientMode, setAllFeatureFlags } = require('@open-hearth/keystone/test.utils')

const sendSubmitMeterReadingsPushNotificationsTask = require('@hearth/domains/meter/tasks/sendSubmitMeterReadingsPushNotificationsTask')


describe('Meter verification notification', () => {
    setFakeClientMode(index)

    describe('feature flag', () => {
        it('checks for proper result on enabled', async () => {
            setAllFeatureFlags(true)
            expect(await sendSubmitMeterReadingsPushNotificationsTask.delay.fn()).toBeUndefined()
        })

        it('checks for proper result on disabled', async () => {
            setAllFeatureFlags(false)
            expect(await sendSubmitMeterReadingsPushNotificationsTask.delay.fn()).toEqual('disabled')
        })
    })

})
