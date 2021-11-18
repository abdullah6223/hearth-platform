import {
    GetMeterReadingExportTasksDocument,
    CreateMeterReadingExportTaskDocument,
    UpdateMeterReadingExportTaskDocument, type GetMeterReadingExportTasksQuery,
} from '@app/hearth/gql'

import { ITask } from '@hearth/domains/common/components/tasks'
import { useExportTaskUIInterface } from '@hearth/domains/common/hooks/useExportTaskUIInterface'


type TaskRecordType = GetMeterReadingExportTasksQuery['tasks'][number]
type UseMeterReadingExportTaskUIInterfaceType = () => ({ MeterReadingExportTask: ITask<TaskRecordType> })

export const useMeterReadingExportTaskUIInterface: UseMeterReadingExportTaskUIInterfaceType = () => {
    const { TaskUIInterface } = useExportTaskUIInterface({
        schemaName: 'MeterReadingExportTask',
        getTasksDocument: GetMeterReadingExportTasksDocument,
        createTaskDocument: CreateMeterReadingExportTaskDocument,
        updateTaskDocument: UpdateMeterReadingExportTaskDocument,
    })

    return { MeterReadingExportTask: TaskUIInterface }
}
