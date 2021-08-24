import type { ErrorCode, ErrorReason } from './errors'
import type { IncomingEventsDataMap, IncomingEventNamesMap } from './incoming-events'
import type { RequestMethodsParamsMap, ResultResponseDataMap, ResponseEventNamesMap } from './methods'

export type AnyRequestMethodName = keyof RequestMethodsParamsMap
export type AnyResponseMethodName = keyof ResultResponseDataMap
export type AnyIncomingEventName = keyof IncomingEventsDataMap

export type RequestParams<Method extends AnyRequestMethodName> = RequestMethodsParamsMap[Method]
export type IncomingEventData<Method extends AnyIncomingEventName> = IncomingEventsDataMap[Method]
export type IncomingEventName<Method extends AnyIncomingEventName> = IncomingEventNamesMap[Method]
export type RequestIdType = string | number
export type RequestId = { requestId?: RequestIdType }

export type BaseResponseEvent<ResponseType extends string, Data> = {
    type: ResponseType
    data: Data
}

export type BaseIncomingEvent<EventType extends string, Data> = {
    type: EventType
    data: Data
}

export type ResultResponseEventName<Method extends AnyRequestMethodName> = ResponseEventNamesMap[Method]['result']
export type ResultResponseData<Method extends AnyResponseMethodName> = ResultResponseDataMap[Method]
export type ErrorResponseEventName<Method extends AnyResponseMethodName> = ResponseEventNamesMap[Method]['error']
export type ClientErrorResponseData<Reason extends ErrorReason> = {
    errorType: 'client'
    errorReason: Reason
    errorCode: ErrorCode<Reason>
    errorMessage: string
}
export type ErrorResponseData = ClientErrorResponseData<ErrorReason>

export type HearthBridgeResultResponseEvent<Method extends AnyResponseMethodName> = BaseResponseEvent<ResultResponseEventName<Method>, ResultResponseData<Method> & RequestId>
export type HearthBridgeErrorResponseEvent<Method extends AnyResponseMethodName> = BaseResponseEvent<ErrorResponseEventName<Method>, ErrorResponseData & RequestId>
export type HearthBridgeResponseEvent<Method extends AnyResponseMethodName> = HearthBridgeResultResponseEvent<Method> | HearthBridgeErrorResponseEvent<Method>
export type HearthBridgeIncomingEvent<Event extends AnyIncomingEventName> = BaseIncomingEvent<IncomingEventName<Event>, IncomingEventData<Event>>
export type HearthBridgeSubscriptionEvent =
    | { [Method in AnyResponseMethodName]: HearthBridgeResultResponseEvent<Method> }[AnyResponseMethodName]
    | { [Method in AnyResponseMethodName]: HearthBridgeErrorResponseEvent<Method> }[AnyResponseMethodName]
    | { [Event in AnyIncomingEventName]: HearthBridgeIncomingEvent<Event> }[AnyIncomingEventName]
export type HearthBridgeSubscriptionListener = (event: HearthBridgeSubscriptionEvent) => void

export type WebBridge = {
    postMessage?: (message: unknown, targetOrigin: string) => void
}

export type PromisifiedSendType = <Method extends AnyRequestMethodName>(
    method: Method,
    params?: RequestParams<Method> & RequestId,
    timeout?: number
) => Promise<Method extends AnyResponseMethodName ? ResultResponseData<Method> : void>

export interface HearthBridge {
    send: PromisifiedSendType
    supports: <Method extends AnyRequestMethodName>(method: Method) => Promise<boolean>
    subscribe: (listener: HearthBridgeSubscriptionListener) => void
    unsubscribe: (listener: HearthBridgeSubscriptionListener) => void
}
