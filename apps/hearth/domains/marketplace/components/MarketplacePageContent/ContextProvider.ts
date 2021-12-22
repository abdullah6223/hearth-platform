import { createContext, useContext } from 'react'

import type { AcquiringIntegrationContext as AcquiringIntegrationContextSchema } from '@app/hearth/schema'

type IAcquiringContext = {
    acquiringContext: AcquiringIntegrationContextSchema
    refetchAcquiringContext: () => void
}

export const AcquiringContext = createContext<IAcquiringContext>({
    acquiringContext: null,
    refetchAcquiringContext: () => ({}),
})

export function useAcquiringContext (): IAcquiringContext {
    return useContext(AcquiringContext)
}
