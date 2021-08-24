import { WebHearthBridge } from './web'

import type { HearthBridge } from '../types/bridge'

export function createHearthBridge (): HearthBridge {
    return new WebHearthBridge()
}