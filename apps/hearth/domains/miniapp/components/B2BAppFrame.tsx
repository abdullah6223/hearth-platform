import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import { z } from 'zod'

import bridge, { type IncomingEventData } from '@open-hearth/bridge'
import type {
    CloseApplicationParams,
    CloseApplicationData,
    GetLaunchParamsParams,
    GetLaunchParamsData,
    RequestAuthParams,
    RequestAuthData,
    SetPageActionsParams,
    SetPageActionsData,
} from '@open-hearth/bridge'
import { usePostMessageContext, zodSchemaToValidator } from '@open-hearth/miniapp-utils/helpers/messaging'
import { getClientSideFingerprint } from '@open-hearth/miniapp-utils/helpers/sender'
import { replaceDomain } from '@open-hearth/miniapp-utils/helpers/urls'
import { generateUUIDv4 } from '@open-hearth/miniapp-utils/helpers/uuid'
import { useAuth } from '@open-hearth/next/auth'
import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'
import { ActionBar, Button } from '@open-hearth/ui'

import { IFrame } from '@hearth/domains/common/components/IFrame'

import { DynamicIcon, IconName } from '../../common/components/DynamicIcon'

import type { IFrameProps } from '@hearth/domains/common/components/IFrame'

const MAX_ACTIONS_COUNT = 3

type ActionParams = SetPageActionsParams['actions'][number] & {
    id: string
    onClick: () => void
}

export type B2BAppFrameProps = Pick<IFrameProps,
'src' | 'metadata' | 'initialHeight' | 'onRegister' | 'hidden' | 'reloadScope' | 'onLoad'> & {
    actions?: boolean
}

export const B2BAppFrame: React.FC<B2BAppFrameProps>  = ({ src, metadata, initialHeight, actions, onRegister, hidden, reloadScope, onLoad }) => {
    const intl = useIntl()
    const { addHandler, addMiddleware } = usePostMessageContext()
    const router = useRouter()
    const { user } = useAuth()
    const { organization } = useOrganization()
    const [activeActions, setActiveActions] = useState<Array<ActionParams>>([])

    const mappedSrc = useMemo(() => {
        let result = src
        const mapping = metadata?.domainsMapping ?? []
        
        for (const { from, to } of mapping) {
            result = replaceDomain(result, from, to, { encoded: true })
        }
        
        return result
    }, [metadata?.domainsMapping, src])

    const onB2BAppFrameRegister: NonNullable<IFrameProps['onRegister']> = useCallback((event) => {
        // NOTE: Clear previous state if needed
        setActiveActions([])

        const { frameId, frameRef, frameOrigin } = event

        if (user?.id && user?.type &&  organization?.id) {
            addHandler<GetLaunchParamsParams, GetLaunchParamsData>(
                'hearth-bridge',
                'HearthWebAppGetLaunchParams',
                frameId,
                zodSchemaToValidator(z.strictObject({})),
                () => ({
                    hearthUserId: user.id,
                    hearthUserType: (user.type ?? 'staff') as GetLaunchParamsData['hearthUserType'],
                    hearthContextEntity: 'Organization',
                    hearthContextEntityId: organization.id,
                    hearthLocale: intl.locale,
                    hearthDeviceId: getClientSideFingerprint(),
                })
            )
        }

        addMiddleware<RequestAuthParams, RequestAuthData>({
            scope: frameId,
            eventType: 'hearth-bridge',
            eventName: 'HearthWebAppRequestAuth',
            fn: ({ next, params }) => {
                let url = params.url

                for (const { from, to } of (metadata?.domainsMapping ?? [])) {
                    url = replaceDomain(url, from, to, { encoded: true })
                }

                return next({ params: { ...params, url } })
            },
        })

        addHandler<CloseApplicationParams, CloseApplicationData>(
            'hearth-bridge',
            'HearthWebAppCloseApplication',
            frameId,
            zodSchemaToValidator(z.strictObject({})),
            async () => {
                const srcUrl = new URL(src)
                const modalId = srcUrl.searchParams.get('modalId')
                // NOTE 1: Case 1. B2BApp frame is opened via modal (HearthWebAppShowModalWindow call),
                // In that case we should treat CloseApplication call as alias to HearthWebAppCloseModalWindow with it's modalId
                if (modalId) {
                    const { success } = await bridge
                        .send('HearthWebAppCloseModalWindow', { modalId })
                        .then(({ success }) => ({ success }))
                        .catch(() => ({ success: false }))

                    if (success) {
                        return { success }
                    }
                }

                // Default case, just redirect to home page
                void router.push('/')

                return {
                    success: true,
                }
            }
        )

        if (actions) {
            addHandler<SetPageActionsParams, SetPageActionsData>(
                'hearth-bridge',
                'HearthWebAppSetPageActions',
                frameId,
                zodSchemaToValidator(z.strictObject({
                    actions: z.array(z.object({
                        label: z.string().optional(),
                        icon: z.string().optional(),
                        disabled: z.boolean().optional(),
                        loading: z.boolean().optional(),
                    })),
                })),
                ({ params, source }) => {
                    if (source.type !== 'frame') {
                        throw new Error('Invalid source type')
                    }
                    if (params.actions.length > MAX_ACTIONS_COUNT) {
                        throw new Error('Too many actions')
                    }

                    const newActions = params.actions.map(action => {
                        const id = generateUUIDv4()
                        const response: IncomingEventData<'HearthWebAppActionClick'> = {
                            actionId: id,
                        }
                        const onClick = () => {
                            frameRef.current?.contentWindow?.postMessage({
                                type: 'HearthWebAppActionClickEvent',
                                data: response,
                            }, frameOrigin)
                        }

                        return {
                            ...action,
                            id,
                            onClick,
                        }
                    })

                    setActiveActions(newActions)

                    return {
                        actionIds: newActions.map(action => action.id),
                    }
                }
            )
        }

        if (onRegister) {
            return onRegister(event)
        }
        // NOTE: router intentionally excluded — useRouter() changes identity on every navigation and would reload the iframe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        actions,
        addHandler,
        addMiddleware,
        intl.locale,
        metadata?.domainsMapping,
        onRegister,
        organization?.id,
        src,
        user?.id,
        user?.type,
    ])

    const ActionsBar = useMemo(() => {
        if (!actions || !activeActions.length) {
            return null
        }

        const buttons = activeActions.map((action, idx) => (
            <Button
                key={action.id}
                id={action.id}
                type={idx === 0 ? 'primary' : 'secondary'}
                loading={action.loading}
                disabled={action.disabled}
                onClick={action.onClick}
                icon={action.icon ? <DynamicIcon name={action.icon as IconName} /> : undefined}
            >
                {action.label}
            </Button>
        ))

        return <ActionBar actions={buttons as [ReactElement, ...ReactElement[]]}/>
    }, [actions, activeActions])


    return (
        <>
            <IFrame
                reloadScope={reloadScope}
                onRegister={onB2BAppFrameRegister}
                src={mappedSrc}
                metadata={metadata}
                initialHeight={initialHeight}
                hidden={hidden}
                onLoad={onLoad}
            />
            {!hidden && ActionsBar}
        </>
    )
}