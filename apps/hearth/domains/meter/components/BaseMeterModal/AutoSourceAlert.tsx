import { Alert, Typography } from 'antd'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'

type IAutoSourceAlertProps = {
    sourceAppName: string
}

export const AutoSourceAlert: React.FC<IAutoSourceAlertProps> = ({ sourceAppName }) => {
    const intl = useIntl()
    const Title = intl.formatMessage({ id: 'pages.hearth.meter.AutoSourceAlert.title' })
    const Message = intl.formatMessage({ id: 'pages.hearth.meter.AutoSourceAlert.message' }, {
        app: sourceAppName,
    })
    return (
        <Alert
            type='warning'
            showIcon
            message={<Typography.Text strong>{Title}</Typography.Text>}
            description={Message}
        />
    )
}