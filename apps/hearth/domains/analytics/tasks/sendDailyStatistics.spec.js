/**
 * @jest-environment node
 */
const index = require('@app/hearth/index')

const { setFakeClientMode, setFeatureFlag } = require('@open-hearth/keystone/test.utils')

const { RETENTION_LOOPS_ENABLED } = require('@hearth/domains/common/constants/featureflags')

const { sendDailyStatisticsTask } = require('./sendDailyStatistics')


describe('sendDailyStatistics', () => {
    setFakeClientMode(index)

    describe('task should correct work', () => {
        test('should return "disabled" if feature flag is disabled', async () => {
            setFeatureFlag(RETENTION_LOOPS_ENABLED, false)
            expect(await sendDailyStatisticsTask.delay.fn()).toBe('disabled')
        })
    })
})
