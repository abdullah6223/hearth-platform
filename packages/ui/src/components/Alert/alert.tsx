import { Alert as DefaultAlert, AlertProps as DefaultAlertProps } from 'antd'
import React from 'react'

type HearthAlertProps = {
    type: 'success' | 'info' | 'warning' | 'error'
}

const ALERT_CLASS_PREFIX = 'hearth-alert'

export type AlertProps = Pick<DefaultAlertProps, 'message' | 'showIcon' | 'description' | 'banner' | 'action'> & HearthAlertProps

const Alert: React.FC<AlertProps> = (props) => {
    return (
        <DefaultAlert
            {...props}
            prefixCls={ALERT_CLASS_PREFIX}
        />
    )
}

export {
    Alert,
}
