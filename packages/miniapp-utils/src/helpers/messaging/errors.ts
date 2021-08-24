import type { ErrorReason, ErrorCode } from '@open-hearth/bridge'

export function getClientErrorMessage<Reason extends ErrorReason> (
    reason: Reason,
    code: ErrorCode<Reason>,
    message: string,
    requestId?: string | number,
    eventName?: string
) {
    return {
        type: eventName ? `${eventName}Error` : 'HearthWebAppCommonError',
        data: {
            errorType: 'client',
            errorCode: code,
            errorReason: reason,
            errorMessage: message,
            ...(typeof requestId !== 'undefined' ? { requestId } : null),
        },
    }
}