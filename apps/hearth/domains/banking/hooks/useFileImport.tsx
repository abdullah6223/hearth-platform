import { BankSyncTaskCreateInput }  from '@app/hearth/schema'
import isNull from 'lodash/isNull'
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'

import { getClientSideSenderInfo } from '@open-hearth/miniapp-utils/helpers/sender'
import { useAuth } from '@open-hearth/next/auth'

import FileImportButton from '@hearth/domains/banking/components/FileImportButton'
import { _1C_CLIENT_BANK_EXCHANGE } from '@hearth/domains/banking/constants'
import { useBankSyncTaskUIInterface } from '@hearth/domains/banking/hooks/useBankSyncTaskUIInterface'
import { useTaskLauncher } from '@hearth/domains/common/components/tasks/TaskLauncher'

import type { BankAccount as BankAccountType } from '@app/hearth/schema'
import type { FileImportProps } from '@hearth/domains/banking/components/FileImportButton'
import type { UploadRequestOption } from 'rc-upload/lib/interface'


type FileImportHookProps = {
    propertyId: string
    organizationId: string
    bankAccount?: BankAccountType
}

type WrappedComponentType = (props: Pick<FileImportProps, 'type' | 'children' | 'hidden'>) => ReturnType<typeof FileImportButton>

interface IUseFileImport {
    ({ propertyId, bankAccount, organizationId }: FileImportHookProps): ({
        Component: WrappedComponentType
        file: UploadRequestOption['file']
        loading: boolean
    })
}

const useFileImport: IUseFileImport = ({ propertyId, bankAccount, organizationId }) => {
    const [file, setFile] = useState<UploadRequestOption['file']>(null)
    const taskWasStarted = useRef(false)

    const { user } = useAuth()
    const { BankSyncTask: BankSyncTaskUIInterface } = useBankSyncTaskUIInterface()
    const { loading, handleRunTask } = useTaskLauncher<BankSyncTaskCreateInput>(BankSyncTaskUIInterface, {
        dv: 1,
        sender: getClientSideSenderInfo(),
        user: { connect: { id: user?.id } },
        property: { connect: { id: propertyId } },
        organization: { connect: { id: organizationId } },
        ...(bankAccount && { account: { connect: { id: bankAccount?.id } } }),
        ...(bankAccount && { integrationContext: { connect: { id: bankAccount?.integrationContext?.id } } }),
        file,
        options: {
            type: _1C_CLIENT_BANK_EXCHANGE,
        },
    })

    useEffect(() => {
        if (!isNull(file) && !loading && !taskWasStarted.current) {
            handleRunTask()
            taskWasStarted.current = true
        }
    }, [file, loading])

    const handleUpload = useCallback((options: UploadRequestOption) => {
        taskWasStarted.current = false
        setFile(options.file)
    }, [])

    const Component = useMemo<WrappedComponentType>(() => (props) => {
        return (
            <FileImportButton
                handleUpload={handleUpload}
                type={props.type}
                loading={loading}
                hidden={props.hidden}
            >
                {props.children}
            </FileImportButton>
        )
    }, [handleUpload, loading])

    return {
        Component,
        file,
        loading,
    }
}

export { useFileImport }
