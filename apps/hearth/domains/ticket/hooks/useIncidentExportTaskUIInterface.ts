import {
    GetIncidentExportTasksDocument,
    CreateIncidentExportTaskDocument,
    UpdateIncidentExportTaskDocument,
    type GetIncidentExportTasksQuery,
} from '@app/hearth/gql'

import { ITask } from '@hearth/domains/common/components/tasks'
import { useExportTaskUIInterface } from '@hearth/domains/common/hooks/useExportTaskUIInterface'


type TaskRecordType = GetIncidentExportTasksQuery['tasks'][number]
type UseIncidentExportTaskUIInterfaceType = () => ({ IncidentExportTask: ITask<TaskRecordType> })

export const useIncidentExportTaskUIInterface: UseIncidentExportTaskUIInterfaceType = () => {
    const { TaskUIInterface } = useExportTaskUIInterface({
        schemaName: 'IncidentExportTask',
        getTasksDocument: GetIncidentExportTasksDocument,
        createTaskDocument: CreateIncidentExportTaskDocument,
        updateTaskDocument: UpdateIncidentExportTaskDocument,
    })

    return { IncidentExportTask: TaskUIInterface }
}
