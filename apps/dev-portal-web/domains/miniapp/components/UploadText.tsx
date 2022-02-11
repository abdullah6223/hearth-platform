import React from 'react'

import { Download } from '@open-hearth/icons'
import { Typography, Space } from '@open-hearth/ui'

export const UploadText: React.FC<{ children: string }>  = ({ children }) => {
    return (
        <Typography.Link size='medium'>
            <Space size={8} direction='horizontal'>
                <Download size='medium'/>
                {children}
            </Space>
        </Typography.Link>
    )
}