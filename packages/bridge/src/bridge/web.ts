import pkg from '../../package.json'
import { promisifySend } from '../utils/promisify'
import { isValidResponse } from '../utils/response'

import type {
    AnyRequestMethodName,
    HearthBridge,
    HearthBridgeSubscriptionListener,
    PromisifiedSendType,
    RequestId,
    RequestParams,
} from '../types/bridge'

export class WebHearthBridge implements HearthBridge {
    #subscribers: Array<HearthBridgeSubscriptionListener> = []
    send: PromisifiedSendType

    constructor () {
        this.subscribe = this.subscribe.bind(this)
        this.unsubscribe = this.unsubscribe.bind(this)
        this.send = promisifySend(this.#sendMessage, this.subscribe)

        const bindResponse = this.#handleResponseEvent.bind(this)

        if (typeof window !== 'undefined' && 'addEventListener' in window) {
            window.addEventListener('message', bindResponse)
        }
    }

    #sendMessage<K extends AnyRequestMethodName>(method: K, params?: RequestParams<K> & RequestId) {
        if (typeof window !== 'undefined') {
            // NOTE: bridge as transport can be used for many platforms with different origins
            // nosemgrep: javascript.browser.security.wildcard-postmessage-configuration.wildcard-postmessage-configuration
            parent.postMessage({
                handler: method,
                params,
                type: 'hearth-bridge',
                version: pkg.version,
            }, '*')
        }
    }

    #handleResponseEvent (event: MessageEvent) {
        const response = event.data
        if (!isValidResponse(response)) {
            return
        }

        this.#subscribers.forEach(listener => listener(response))
    }

    subscribe (listener: HearthBridgeSubscriptionListener) {
        this.#subscribers.push(listener)
    }

    unsubscribe (listener: HearthBridgeSubscriptionListener) {
        const idx = this.#subscribers.indexOf(listener)

        if (idx >= 0) {
            this.#subscribers.splice(idx, 1)
        }
    }

    async supports<K extends AnyRequestMethodName> (method: K) {
        const methods = await this.send('HearthWebAppGetAvailableMethods')
            .then(data => data.methods)
            .catch(() => [] as Array<K>)

        return methods.includes(method)
    }
}