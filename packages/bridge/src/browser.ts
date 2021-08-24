import bridge from './index'

import type { HearthBridge } from './types/bridge'

declare global {
    interface Window { hearthBridge: HearthBridge }
}

window.hearthBridge = bridge