import getConfig from 'next/config'


const { publicRuntimeConfig: { runtimeTranslations } } = getConfig()

export async function messagesImporter (locale: string) {
    const localeData = await import(`@app/hearth/lang/${locale}/${locale}`)

    const customLocaleData = await import(`@app/hearth/lang/${locale}/${locale}.custom`)

    return {
        ...localeData.default,
        ...(customLocaleData ? customLocaleData.default : null),
        ...(runtimeTranslations?.[locale] ? runtimeTranslations[locale] : null),
    }
}
