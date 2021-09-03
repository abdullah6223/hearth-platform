import React from 'react'

import { QuestionCircle } from '@open-hearth/icons'
import { Space, Tooltip } from '@open-hearth/ui'
import { colors } from '@open-hearth/ui/colors'

import styles from './styles.module.css'


type LabeledFieldProps = {
    key?: string
    hint?: string
}

export const LabeledField: React.FC<React.PropsWithChildren<LabeledFieldProps>> = ({
    key,
    hint,
    children,
}) => {
    return (
        <label key={key}>
            <Space size={4}>
                {children}
                {
                    hint && (
                        <Tooltip title={hint}>
                            <div className={styles.iconWrapper}>
                                <QuestionCircle color={colors.gray[7]} size='small' />
                            </div>
                        </Tooltip>
                    )
                }
            </Space>
        </label>
    )
}
