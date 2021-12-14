import { useState, useEffect } from 'react'

import type { ResultResponseData, ErrorResponseData } from '@open-hearth/bridge'
import bridge from '@open-hearth/bridge'

type IUseLaunchParams = {
    loading: boolean
    error: ErrorResponseData | null
    context: ResultResponseData<'HearthWebAppGetLaunchParams'> | Record<string, never>
}
export function useLaunchParams (): IUseLaunchParams {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<IUseLaunchParams['error']>(null)
    const [context, setContext] = useState<IUseLaunchParams['context']>({})

    useEffect(() => {
        bridge
            .send('HearthWebAppGetLaunchParams')
            .then(setContext)
            .catch((err) => {
                setContext({})
                setError(err)
            })
            .finally(() => setLoading(false))
    }, [])

    return {
        loading,
        error,
        context,
    }
}