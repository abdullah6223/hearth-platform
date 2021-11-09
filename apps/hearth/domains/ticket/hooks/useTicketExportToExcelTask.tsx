import { TicketExportTaskCreateInput }  from '@app/hearth/schema'
import React, { useCallback } from 'react'

import { getClientSideSenderInfo } from '@open-hearth/miniapp-utils/helpers/sender'
import { useIntl } from '@open-hearth/next/intl'
import { Button } from '@open-hearth/ui'

import { useTaskLauncher } from '@hearth/domains/common/components/tasks/TaskLauncher'

import { useTicketExportTaskUIInterface } from './useTicketExportTaskUIInterface'


export const useTicketExportToExcelTask = ({ where, sortBy, format, locale, timeZone, user }) => {
    const intl = useIntl()
    const ExportAsExcelLabel = intl.formatMessage({ id: 'ExportAsExcel' })

    const { TicketExportTask: TaskUIInterface } = useTicketExportTaskUIInterface()

    const { loading, handleRunTask } = useTaskLauncher<TicketExportTaskCreateInput>(TaskUIInterface, {
        dv: 1,
        sender: getClientSideSenderInfo(),
        where,
        format,
        sortBy,
        locale,
        timeZone,
        user: { connect: { id: user?.id || null } },
    })

    const handleClick = useCallback(() => handleRunTask(), [handleRunTask])
    const TicketsExportToXlsxButton = useCallback(() => (
        <Button
            type='secondary'
            loading={loading}
            onClick={handleClick}
            id='TicketsExportClick'
            children={ExportAsExcelLabel}
        />
    ), [ExportAsExcelLabel, handleClick, loading])

    return {
        TaskUIInterface,
        TicketsExportToXlsxButton,
    }
}
