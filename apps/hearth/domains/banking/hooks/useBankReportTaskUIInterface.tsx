import {
    GetBankAccountReportTasksDocument,
    CreateBankAccountReportTaskDocument,
    UpdateBankAccountReportTaskDocument,
    type GetBankAccountReportTasksQuery,
} from '@app/hearth/gql'
import { BankAccountReportTaskCreateInput }  from '@app/hearth/schema'
import { notification } from 'antd'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'

import { getClientSideSenderInfo } from '@open-hearth/miniapp-utils/helpers/sender'
import { useIntl } from '@open-hearth/next/intl'
import { Button } from '@open-hearth/ui'
import type { ButtonProps } from '@open-hearth/ui'

import { ITask, TASK_REMOVE_STRATEGY } from '@hearth/domains/common/components/tasks'
import { TasksHearthStorage } from '@hearth/domains/common/components/tasks/storage/TasksHearthStorage'
import { useTaskLauncher } from '@hearth/domains/common/components/tasks/TaskLauncher'
import { TASK_COMPLETED_STATUS } from '@hearth/domains/common/constants/tasks'

import type { BankAccount as BankAccountType } from '@app/hearth/schema'


type TaskRecordType = GetBankAccountReportTasksQuery['tasks'][number]

type UseBankReportTaskUIInterfaceType = () => ({ BankReportTask: ITask<TaskRecordType> })

export const useBankReportTaskUIInterface: UseBankReportTaskUIInterfaceType = () => {
    const intl = useIntl()
    const TaskProgressTitle = intl.formatMessage({ id: 'tasks.BankReportTask.progress.title' })
    const TaskProgressDescriptionProcessing = intl.formatMessage({ id: 'tasks.BankReportTask.progress.description.processing' })
    const TaskProgressDescriptionCompleted = intl.formatMessage({ id: 'tasks.BankReportTask.progress.description.completed' })
    const UpdateTitle = intl.formatMessage({ id: 'Update' })

    const { reload } = useRouter()

    const TaskUIInterface: ITask<TaskRecordType> = {
        storage: new TasksHearthStorage({
            getTasksDocument: GetBankAccountReportTasksDocument,
            createTaskDocument: CreateBankAccountReportTaskDocument,
            updateTaskDocument: UpdateBankAccountReportTaskDocument,
        }),
        removeStrategy: [TASK_REMOVE_STRATEGY.PANEL],
        translations: {
            title: () => TaskProgressTitle,
            description: (taskRecord) => {
                return taskRecord.status === TASK_COMPLETED_STATUS
                    ? TaskProgressDescriptionCompleted
                    : TaskProgressDescriptionProcessing
            },
        },
        calculateProgress: (task: TaskRecordType) => {
            return task.progress
        },
        onComplete: () => {
            notification.success({
                message: TaskProgressDescriptionCompleted,
                btn: <Button onClick={() => reload()} type='primary'>{UpdateTitle}</Button>,
            })
        },
        onCancel: () => null,
    }

    return {
        BankReportTask: TaskUIInterface,
    }
}

type UserBankReportTaskButtonProps = {
    organizationId: string
    userId: string
    bankAccount: BankAccountType
    type?: ButtonProps['type']
}

export const useBankReportTaskButton = (props: UserBankReportTaskButtonProps) => {
    const intl = useIntl()
    const CreateReportTitle = intl.formatMessage({ id: 'pages.hearth.property.report.createReport.title' })

    const { organizationId, userId, bankAccount, type = 'primary' } = props

    const { BankReportTask: TaskUIInterface } = useBankReportTaskUIInterface()

    const { loading, handleRunTask } = useTaskLauncher<BankAccountReportTaskCreateInput>(TaskUIInterface, {
        dv: 1,
        sender: getClientSideSenderInfo(),
        account: { connect: { id: bankAccount.id } },
        progress: 0,
        organization: { connect: { id: organizationId } },
        user: { connect: { id: userId } },
    })

    const handleClick = useCallback(() => handleRunTask(), [handleRunTask])
    const BankReportTaskButton = useCallback(() => (
        <Button type={type} onClick={handleClick} loading={loading}>
            {CreateReportTitle}
        </Button>
    ), [CreateReportTitle, handleClick, loading, type])

    return {
        BankReportTaskButton,
        TaskUIInterface,
    }
}
