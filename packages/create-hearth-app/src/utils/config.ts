export type PackageManager = 'npm' | 'yarn' | 'pnpm'

export type MonorepoInfo = {
    isMonorepo: boolean
    packageManager: PackageManager | null
    root: string
    isHearthRepo: boolean
}

type Config = {
    appName: string
    projectPath: string
    packageManager: PackageManager
    preferences: Record<string, string | boolean>
    monorepoInfo: MonorepoInfo
}

let config: Config = {
    appName: '',
    projectPath: process.cwd(),
    packageManager: 'npm',
    preferences: {},
    monorepoInfo: {
        isMonorepo: false,
        packageManager: null,
        root: process.cwd(),
        isHearthRepo: false,
    },
}

export function setConfig (updatedConfig: Partial<Config>) {
    config = { ...config, ...updatedConfig }
}

export function getConfig (): Config {
    return config
}