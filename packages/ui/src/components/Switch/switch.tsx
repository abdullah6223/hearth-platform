import {
    Switch as DefaultSwitch,
    SwitchProps as DefaultSwitchProps,
} from 'antd'
import React, { useCallback } from 'react'

import { sendAnalyticsChangeEvent } from '../_utils/analytics'

import './style.less'


const SWITCH_CLASS_PREFIX = 'hearth-switch'

type HearthSwitchSize = 'small' | 'large'

export type SwitchProps = Pick<DefaultSwitchProps,
'className' |
'id' |
'autoFocus' |
'checked' |
'defaultChecked' |
'disabled' |
'onChange'
> & {
    size: HearthSwitchSize
}

const SWITCH_SIZE_MAP: Record<HearthSwitchSize, DefaultSwitchProps['size']> = {
    small: 'small',
    large: 'default',
}

export const Switch: React.FC<SwitchProps> = (props) => {
    const {
        disabled,
        id,
        onChange,
        size = 'large',
        ...rest
    } = props

    const handleChange = useCallback((checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => {
        sendAnalyticsChangeEvent('Switch', { checked, id })

        if (onChange) {
            onChange(checked, event)
        }
    }, [id, onChange])

    return (
        <DefaultSwitch
            {...rest}
            id={id}
            prefixCls={SWITCH_CLASS_PREFIX}
            disabled={disabled}
            onChange={handleChange}
            size={SWITCH_SIZE_MAP[size]}
        />
    )
}