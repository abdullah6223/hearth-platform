import { z } from 'zod'

import type {
    GetAvailableMethodsParams,
    GetAvailableMethodsData,
    GetFragmentData,
    GetFragmentParams,
    RedirectData,
    RedirectParams,
    RequestAuthData,
    RequestAuthParams,
    ResizeWindowData,
    ResizeWindowParams,
    ShowModalWindowData,
    ShowModalWindowParams,
    ShowNotificationData,
    ShowNotificationParams,
    UpdateModalWindowData,
    UpdateModalWindowParams,
    CloseModalWindowData,
    CloseModalWindowParams,
    HearthBridgeResultResponseEvent,
    AnyRequestMethodName,
} from '@open-hearth/bridge'


import { isSafeUrl } from '../../urls'
import { generateUUIDv4 } from '../../uuid'
import { zodSchemaToValidator, sendResponseMessage } from '../utils'

import type { SourceMetadata, AddHandlerType, RegisteredHandlersType, HandlerScope } from '../types'

type SimpleRouter = {
    push(url: string): unknown
}

export type NotificationsApi = (params: ShowNotificationParams) => void

type ExtraShowModalParams = {
    onCancel?: () => void
    metadata?: SourceMetadata
}
export type ModalsApi = (params: ShowModalWindowParams & ExtraShowModalParams) => {
    update(params: UpdateModalWindowParams['data']): void
    destroy(): void
}

export type RegisterBridgeEventsOptions = {
    addHandler: AddHandlerType
    handlers: Readonly<RegisteredHandlersType>
    router?: SimpleRouter
    notificationsApi?: NotificationsApi
    modalsApi?: ModalsApi
}

export function registerBridgeEvents ({
    addHandler,
    router,
    handlers,
    notificationsApi,
    modalsApi,
}: RegisterBridgeEventsOptions) {
    addHandler<GetAvailableMethodsParams, GetAvailableMethodsData>('hearth-bridge', 'HearthWebAppGetAvailableMethods', '*', zodSchemaToValidator(z.strictObject({})), ({ source }) => {
        let localScope: HandlerScope = '*'
        switch (source.type) {
            case 'frame':
                localScope = source.id
                break
            case 'window':
                localScope = 'parent'
                break
            case 'worker':
                localScope = 'worker'
                break
        }

        const localHandlers = Object.keys(handlers[localScope]?.['hearth-bridge'] ?? {}) as Array<AnyRequestMethodName>
        const globalHandlers = Object.keys(handlers['*']?.['hearth-bridge'] ?? {}) as Array<AnyRequestMethodName>

        return { methods: [...new Set([...localHandlers, ...globalHandlers])] }
    })

    addHandler<ResizeWindowParams, ResizeWindowData>('hearth-bridge', 'HearthWebAppResizeWindow', '*', zodSchemaToValidator(z.strictObject({
        height: z.number(),
    })), ({ params, source }) => {
        if (source.type !== 'frame') {
            throw new Error('Forbidden source type. Resize window is only available for registered iframes')
        }

        source.ref.height = `${params.height}px`

        return { height: params.height }
    })
    addHandler<GetFragmentParams, GetFragmentData>('hearth-bridge', 'HearthWebAppGetFragment', '*', zodSchemaToValidator(z.strictObject({})), () => {
        const hash = window.location.hash
        const rawFragment = hash.startsWith('#') ? hash.substring(1) : hash
        const fragment = decodeURIComponent(rawFragment)

        return { fragment }
    })

    addHandler<RedirectParams, RedirectData>('hearth-bridge', 'HearthWebAppRedirect', '*', zodSchemaToValidator(z.strictObject({
        url: z.url(),
        target: z.union([z.literal('_blank'), z.literal('_self')]),
    })), async ({
        params: { url, target },
    }) => {
        if (!isSafeUrl(url)) {
            throw new Error('Forbidden url. Your url is probably injected')
        }

        if (target === '_blank') {
            window.open(url, target)
        } else {
            const urlOrigin = (new URL(url)).origin
            if (window.origin !== urlOrigin) {
                throw new Error('The redirect url must have the same origin as parent window, if target is not _blank')
            }
            if (router) {
                router.push(url)
            } else {
                window.open(url, target)
            }
        }

        return { success: true }
    })

    addHandler<RequestAuthParams, RequestAuthData>('hearth-bridge', 'HearthWebAppRequestAuth', '*', zodSchemaToValidator(z.strictObject({
        url: z.url(),
    })), async ({
        params: { url },
    }) => {
        if (!isSafeUrl(url)) {
            throw new Error('Forbidden url. Your url is probably injected')
        }

        const response = await fetch(url, { credentials: 'include' })
        const body = await response.text()

        return { response: { status: response.status, body, url: response.url } }
    })

    if (notificationsApi) {
        addHandler<ShowNotificationParams, ShowNotificationData>('hearth-bridge', 'HearthWebAppShowNotification', '*', zodSchemaToValidator(z.strictObject({
            message: z.string(),
            description: z.string().optional(),
            type: z.enum(['success', 'error', 'warning', 'info']),
        })), ({ params }) => {
            notificationsApi(params)
            return { success: true }
        })
    }

    if (modalsApi) {
        addHandler<ShowModalWindowParams, ShowModalWindowData>('hearth-bridge', 'HearthWebAppShowModalWindow', '*', zodSchemaToValidator(z.strictObject({
            title: z.string(),
            url: z.url(),
            size: z.enum(['big', 'small']).optional(),
            initialHeight: z.number().optional(),
        })), ({
            source,
            params,
            storage,
        }) => {
            if (source.type === 'worker') {
                throw new Error('Forbidden source type. Modals cannot be opened from service workers')
            }

            const modalId = generateUUIDv4()
            if (!isSafeUrl(params.url)) {
                throw new Error('Forbidden url. Your url is probably injected')
            }
            const originalSrc = new URL(params.url)
            originalSrc.searchParams.set('modalId', modalId)

            const sourceOrigin = new URL(source.type === 'frame' ? source.ref.src : window.location.href).origin
            const sourceTarget = source.type === 'frame' ? source.ref.contentWindow : source.ref

            if (sourceOrigin && originalSrc.origin !== sourceOrigin) {
                throw new Error('Forbidden url. Url must have same origin as sender')
            }

            const closeEventData: HearthBridgeResultResponseEvent<'HearthWebAppCloseModalWindow'> = {
                type: 'HearthWebAppCloseModalWindowResult',
                data: {
                    success: true,
                    modalId,
                },
            }

            const onCancel = () => {
                storage.events.delete(`modals:${modalId}`)
                if (sourceTarget) {
                    sendResponseMessage({
                        data: closeEventData,
                        target: sourceTarget,
                        origin: sourceOrigin,
                    })
                }
            }

            storage.events.set(`modals:${modalId}`, modalsApi({
                ...params,
                url: originalSrc.toString(),
                onCancel,
                metadata: source.type === 'frame' ? source.metadata : undefined,
            }))

            return { modalId }
        })

        addHandler<UpdateModalWindowParams, UpdateModalWindowData>('hearth-bridge', 'HearthWebAppUpdateModalWindow', '*', zodSchemaToValidator(z.strictObject({
            modalId: z.string(),
            data: z.strictObject({
                title: z.string().optional(),
                size: z.enum(['big', 'small']).optional(),
            }),
        })), ({ params, storage }) => {
            const modalActions = storage.events.get(`modals:${params.modalId}`) as ReturnType<ModalsApi>
            if (!modalActions) {
                return { updated: false }
            }

            modalActions.update(params.data)

            return { updated: true }
        })

        // NOTE: make sure to keep * scope, so parent window can close modals too
        addHandler<CloseModalWindowParams, CloseModalWindowData>('hearth-bridge', 'HearthWebAppCloseModalWindow', '*', zodSchemaToValidator(z.strictObject({
            modalId: z.string(),
        })), ({ params, storage }) => {
            const modalActions = storage.events.get(`modals:${params.modalId}`) as ReturnType<ModalsApi>
            if (!modalActions) {
                return { modalId: params.modalId, success: false }
            }

            modalActions.destroy()
            storage.events.delete(`modals:${params.modalId}`)

            return { modalId: params.modalId, success: true }
        })
    }
}