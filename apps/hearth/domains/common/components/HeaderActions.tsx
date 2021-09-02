import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Tabs } from '@open-hearth/ui'

import { useAuthMethods } from '@hearth/domains/user/hooks/useAuthMethods'


type TabsAuthActionsProps = {
    currentActiveKey: string
}

export const TabsAuthAction: React.FC<TabsAuthActionsProps> = (props) => {
    const { currentActiveKey } = props
    const intl = useIntl()
    const registerTab = intl.formatMessage({ id: 'pages.auth.register.step.inputIdentifier.title' })
    const signInTab = intl.formatMessage({ id: 'pages.auth.signin.title' })

    const router = useRouter()
    const { queryParams } = useAuthMethods()

    const handleChange = useCallback((activeKey: string): void => {
        if (activeKey === 'signin') {
            router.push(`/auth/signin?${queryParams}`)
        } else if (activeKey === 'register') {
            router.push(`/auth/register?${queryParams}`)
        }
    }, [queryParams, router])

    const tabItems = useMemo(() => [
        { key: 'signin', label: signInTab },
        { key: 'register', label: registerTab },
    ], [registerTab, signInTab])

    return (
        <Tabs
            items={tabItems}
            defaultActiveKey={currentActiveKey}
            onChange={handleChange}
        />
    )
}
