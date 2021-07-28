const { prepareHearthAppOidcConfig, prepareHearthAppB2BAppConfig, updateAppEnvFile, prepareAppEnvLocalAdminUsers, getAppEnvValue } = require('@open-hearth/cli')


const main = async ([B2BAppName = '{{name}}']) => {
    // 1) register oidc url in hearth
    const appName = '{{name}}'
    const oidcConf = await prepareHearthAppOidcConfig(appName)
    await updateAppEnvFile(appName, 'OIDC_HEARTH_CLIENT_CONFIG', JSON.stringify(oidcConf))
    await updateAppEnvFile(appName, 'APP_TOKEN_KEY', 'appToken')
    await updateAppEnvFile(appName, 'HEARTH_ACCESS_TOKEN_KEY', 'hearthAccessToken')
    await updateAppEnvFile(appName, 'HEARTH_REFRESH_TOKEN_KEY', 'hearthRefreshToken')
    await updateAppEnvFile(appName, 'HEARTH_ORGANIZATION_ID_KEY', 'hearthOrganizationId')
    await updateAppEnvFile(appName, 'ACCEPT_LANGUAGE', 'accept-language')
    // 2) prepare B2BApp in hearth
    await prepareHearthAppB2BAppConfig(appName, B2BAppName)
    // 4) add local admin user
    await prepareAppEnvLocalAdminUsers(appName)
    // 5) add hearth url conf
    const hearthUrl = await getAppEnvValue('hearth', 'SERVER_URL') || 'http://localhost:3000'
    await updateAppEnvFile(appName, 'HEARTH_DOMAIN', hearthUrl)
    console.log('Done')
}

main(process.argv.slice(2))
    .then(() => {
        process.exit()
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
