import { File } from '@app/hearth/schema'
import isFunction from 'lodash/isFunction'
import isNil from 'lodash/isNil'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useAuth } from '@open-hearth/next/auth'
import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'
import { Button } from '@open-hearth/ui'

import { ActiveModalType, BaseImportWrapper } from '@hearth/domains/common/components/Import/BaseImportWrapper'
import {
    IImportWrapperProps,
    IMPORT_EVENT,
    ImportEmitter,
} from '@hearth/domains/common/components/Import/Index'
import { MetersDataImporter } from '@hearth/domains/meter/components/MetersDataImporter'
import { TOnMetersUpload } from '@hearth/domains/meter/components/MetersDataImporterTypes'
import { useMeterReadingsImportTask } from '@hearth/domains/meter/hooks/useMeterReadingsImportTaskUIInterface'


export type IMetersImportWrapperProps<TExtraProps = unknown> = Pick<IImportWrapperProps<TExtraProps>, 'accessCheck' | 'onFinish' | 'uploadButtonLabel' | 'importCardButton' | 'extraProps'>
interface IMetersImportWrapperExtraProps {
    isPropertyMeters?: boolean
}

const MetersImportWrapper: React.FC<IMetersImportWrapperProps<IMetersImportWrapperExtraProps>> = (props) => {
    const {
        accessCheck,
        onFinish: handleFinish,
        uploadButtonLabel,
        importCardButton,
        extraProps,
    } = props

    const intl = useIntl()
    const domain = extraProps?.isPropertyMeters ? 'propertyMeter' : 'meter'
    const { organization } = useOrganization()
    const { user } = useAuth()

    const ChooseFileForUploadLabel = intl.formatMessage({ id: 'import.uploadModal.chooseFileForUpload' })
    const ErrorsMessage = intl.formatMessage({ id: 'import.Errors' })

    const [activeModal, setActiveModal] = useState<ActiveModalType>()

    useEffect(() => {
        if (typeof activeModal !== 'undefined') {
            ImportEmitter.emit(IMPORT_EVENT, { domain, status: activeModal })
        }
    }, [activeModal, domain])

    const totalRowsRef = useRef(0)
    const successRowsRef = useRef(0)
    const [fileRef, setFileRef] = useState<File>()

    const closeModal = () => setActiveModal(null)
    const closeForRunningModal = useCallback(() =>  {
        closeModal()
        if (isFunction(handleFinish)) {
            handleFinish()
        }
    }, [handleFinish])

    const handleUpload = useCallback<TOnMetersUpload>((blob: File) => {
        setFileRef(blob)
    }, [setFileRef])

    const { handleRunTask } = useMeterReadingsImportTask({
        file: fileRef,
        userId: user?.id || null,
        organizationId: organization?.id || null,
        isPropertyMeters: Boolean(extraProps?.isPropertyMeters),
    })

    useEffect(() => {
        if (!isNil(fileRef) && isFunction(handleRunTask)) {
            handleRunTask()
            closeForRunningModal()
        }
    }, [fileRef])

    const handleDownloadPartyLoadedData = useCallback(() => {
        return new Promise<void>((resolve) => resolve())
    }, [ErrorsMessage])

    const metersDataImporter = useMemo(() => {
        return (
            <MetersDataImporter onUpload={handleUpload}>
                <Button type='primary'>
                    {ChooseFileForUploadLabel}
                </Button>
            </MetersDataImporter>
        )
    }, [ChooseFileForUploadLabel, handleUpload])

    return (
        accessCheck && (
            <BaseImportWrapper
                {...{
                    importCardButton,
                    setActiveModal,
                    domainName: domain,
                    uploadButtonLabel,
                    closeModal,
                    activeModal,
                    handleBreakImport: closeForRunningModal,
                    progress: 0,
                    handleDownloadPartyLoadedData,
                    successRowsRef,
                    totalRowsRef,
                    error: null,
                    dataImporter: metersDataImporter,
                }}
            />
        )
    )
}

export {
    MetersImportWrapper,
}
