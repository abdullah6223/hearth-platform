import { Dropdown } from 'antd'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { CSSProperties, useCallback, useMemo } from 'react'

import { MoreVertical } from '@open-hearth/icons'
import { useAuth } from '@open-hearth/next/auth'
import { useIntl } from '@open-hearth/next/intl'
import { Space, Typography } from '@open-hearth/ui'
import type { TypographyTextProps } from '@open-hearth/ui'

import { useLayoutContext } from '@hearth/domains/common/components/LayoutContext'
import { useBroadcastChannel } from '@hearth/domains/common/hooks/useBroadcastChannel'

import type { DropdownProps, MenuProps } from 'antd'


const SIGN_OUT_BROADCAST_CHANNEL = 'signOut'

function formatUserName (name) {
    const splittedName = name.split(' ')
    return splittedName[0]
}

const DROPDOWN_OVERLAY_STYLES: CSSProperties = { maxWidth: 180, width: '100%' }

type UserMenuProps = {
    goToAfterLogout?: () => unknown | Promise<unknown>
    extraMenuItems?: MenuProps['items']
}
export const UserMenu: React.FC<UserMenuProps> = ({
    goToAfterLogout,
    extraMenuItems,
}) => {
    const { breakpoints } = useLayoutContext()

    const intl = useIntl()
    const MyProfileMessage = intl.formatMessage({ id: 'profile' })
    const SignOutMessage = intl.formatMessage({ id: 'SignOut' })
    const auth = useAuth()
    const router = useRouter()
    const userName = formatUserName(get(auth, ['user', 'name'], ''))

    const handleProfileClick = useCallback(() => {
        router.push('/user')
    }, [router])

    const { 
        sendMessageToBroadcastChannel: sendSignOutToBroadcast,
    } = useBroadcastChannel(
        SIGN_OUT_BROADCAST_CHANNEL,
        async () => {
            await router.push('/auth/signin?' + qs.stringify({ next: router.asPath }))
        }
    )

    const handleSignOutClick = useCallback(async () => {
        sendSignOutToBroadcast()

        await auth.signOut()
        if (isFunction(goToAfterLogout)) {
            await goToAfterLogout()
        }
    }, [auth, sendSignOutToBroadcast, goToAfterLogout])

    const isCoworkPage = router.pathname?.startsWith('/ai-engineer')
    const BackToHearthLabel = intl.formatMessage({ id: 'ai.cowork.backToHearth' })

    const menu = useMemo<DropdownProps['menu']>(() => {
        return {
            items: [
                {
                    key: 'profile',
                    label: (
                        <Typography.Text size='medium' type='inherit'>{MyProfileMessage}</Typography.Text>
                    ),
                    onClick: handleProfileClick,
                },
                ...(extraMenuItems ?? []),
                ...(isCoworkPage ? [{
                    key: 'backToHearth',
                    label: (
                        <Typography.Text size='medium' type='inherit'>{BackToHearthLabel}</Typography.Text>
                    ),
                    onClick: () => { void router.push('/') },
                }] : []),
                {
                    key: 'signOut',
                    label: (
                        <Typography.Text size='medium' type='inherit'>{SignOutMessage}</Typography.Text>
                    ),
                    onClick: handleSignOutClick,
                },
            ],
        }
    }, [MyProfileMessage, SignOutMessage, BackToHearthLabel, handleProfileClick, handleSignOutClick, extraMenuItems, isCoworkPage, router])

    const textSize: TypographyTextProps['size'] = !breakpoints.TABLET_LARGE ? 'small' : 'medium'

    return (
        <Dropdown placement='bottomRight' menu={menu} overlayClassName='user-dropdown-overlay' overlayStyle={DROPDOWN_OVERLAY_STYLES}>
            <Space size={8} direction='horizontal' className='user-dropdown'>
                <Typography.Text size={textSize} onClick={handleProfileClick}>
                    {userName}
                </Typography.Text>
                <div className='expand-icon-wrapper'>
                    <MoreVertical size='small'/>
                </div>
            </Space>
        </Dropdown>
    )
}
