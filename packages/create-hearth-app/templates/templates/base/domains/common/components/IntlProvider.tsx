import React, { useEffect, useState } from 'react'
import { IntlProvider as DefaultIntlProvider } from 'react-intl'

import { useLaunchParams } from '@/domains/common/components/LaunchParamsContext'
import { useTranslations, translationsHelper, parseLocaleString } from '@/domains/common/utils/i18n'

export const IntlProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { messages, selectedLocale, switchLocale } = useTranslations()
    const [isParamsSynced, setIsParamsSynced] = useState(false)

    const { launchParams } = useLaunchParams()

    useEffect(() => {
        if (launchParams?.hearthLocale && !isParamsSynced) {
            setIsParamsSynced(true)
            const { selectedLocale: newSelectedLocale } = translationsHelper.selectSupportedLocale([
                parseLocaleString(launchParams.hearthLocale),
                ...window.navigator.languages.map((lang) => parseLocaleString(lang)),
            ])
            switchLocale(newSelectedLocale)
        }
    }, [isParamsSynced, launchParams?.hearthLocale, switchLocale])


    return (
        <DefaultIntlProvider locale={selectedLocale} messages={messages}>
            {children}
        </DefaultIntlProvider>
    )
}