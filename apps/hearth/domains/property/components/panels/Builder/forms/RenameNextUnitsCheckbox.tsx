import React, { MutableRefObject, useCallback, useState } from 'react'

import { QuestionCircle } from '@open-hearth/icons'
import { useIntl } from '@open-hearth/next/intl'
import { Checkbox, Space, Tooltip, Typography } from '@open-hearth/ui'

import { MapViewMode } from '../MapConstructor'


type RenameNextUnitsCheckboxProps = {
    mapViewMode: MapViewMode
    renameNextUnitsRef: MutableRefObject<boolean>
}

export const RenameNextUnitsCheckbox: React.FC<RenameNextUnitsCheckboxProps> = ({ mapViewMode, renameNextUnitsRef }) => {
    const intl = useIntl()
    const RenameNextUnitsLabel = intl.formatMessage({ id: 'pages.hearth.property.modal.RenameNextUnits' })
    const RenameNextUnitsTooltip = mapViewMode === MapViewMode.parking ?
        intl.formatMessage({ id: 'pages.hearth.property.modal.RenameNextParkingUnits.tooltip' }) :
        intl.formatMessage({ id: 'pages.hearth.property.modal.RenameNextUnits.tooltip' })

    const [checked, setChecked] = useState<boolean>(renameNextUnitsRef.current)

    const toggleRenameNextUnits = useCallback((event) => {
        const newValue = event.target.checked
        renameNextUnitsRef.current = newValue
        setChecked(newValue)
    }, [renameNextUnitsRef])

    return (
        <Checkbox
            checked={checked}
            onChange={toggleRenameNextUnits}
            data-cy='property-map__unit-form__rename-units-checkbox'
        >
            <Space size={8}>
                {RenameNextUnitsLabel}
                <Tooltip title={RenameNextUnitsTooltip}>
                    <Typography.Text type='secondary'>
                        <QuestionCircle size='small'/>
                    </Typography.Text>
                </Tooltip>
            </Space>
        </Checkbox>
    )
}