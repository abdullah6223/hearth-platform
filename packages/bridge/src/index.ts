import { createHearthBridge } from './bridge'

const bridge = createHearthBridge()

export * from './types/methods'
export * from './types/bridge'
export * from './types/errors'

export { bridge as default }
