import React from 'react'

import { Sparkles } from '@open-hearth/icons'
import { Button, ButtonProps } from '@open-hearth/ui'

import styles from './AIFlowButton.module.css'

type AIFlowButtonProps = Omit<ButtonProps, 'type'>

export function AIFlowButton ({ children, loading, disabled, ...props }: AIFlowButtonProps & { loading?: boolean, disabled?: boolean }) {
    return (
        <Button
            className={styles.aiFlowButton}
            type='secondary'
            icon={<Sparkles size='small'/>}
            loading={loading}
            disabled={disabled || loading}
            {...props}
        >
            {children}
        </Button>
    )
}
