const { getSchemaCtx, find } = require('@open-hearth/keystone/schema')
const { createTask } = require('@open-hearth/keystone/tasks')

const { MeterReading } = require('@hearth/domains/meter/utils/serverSchema')
const { PropertyMeterReading } = require('@hearth/domains/meter/utils/serverSchema')

/**
 * Soft delete meter readings after soft delete meter
 */
async function deleteReadingsOfDeletedMeter (deletedMeter, deletedMeterAt, isPropertyMeter = false) {
    const { keystone: context } = await getSchemaCtx('Property')

    const meterId = deletedMeter.id
    const meterReadings = await find(isPropertyMeter ? 'PropertyMeterReading' : 'MeterReading', {
        meter: { id: meterId },
        deletedAt: null,
    })

    const readingModel = isPropertyMeter ? PropertyMeterReading : MeterReading

    for (const reading of meterReadings) {
        await readingModel.update(context, reading.id, {
            deletedAt: deletedMeterAt,
            dv: deletedMeter.dv,
            sender: deletedMeter.sender,
        })
    }
}

module.exports = createTask('deleteReadingsOfDeletedMeter', deleteReadingsOfDeletedMeter)
