import { existsSync } from 'fs'
import { readFile, writeFile, readdir } from 'fs/promises'
import { join, relative } from 'path'

import { parse } from 'yaml'

import { getConfig } from './config'

const CODEGEN_REGEXP = /schema: '(.+)'/gi
const ENV_REGEXP = /process\.env\.([A-Z_]+)/gi
const PUBLIC_ENV_PREFIX = 'NEXT_PUBLIC_'
const FILES_TO_ENV_REPLACE = [
    'next.config.ts',
    'middleware.ts',
]
const CONF_TS_IMPORT = 'import conf from \'@open-hearth/config\''
const HEARTH_DEMO_STAND = 'https://hearth.d.hearth.example.com'

async function _resolveHearthLocalAddress () {
    const { monorepoInfo } = getConfig()
    if (!monorepoInfo.isMonorepo || !monorepoInfo.isHearthRepo) return 'http://localhost:3000'

    const children = await readdir(join(monorepoInfo.root, 'apps'), { withFileTypes: true })
    const apps = children.filter(child => child.isDirectory() && child.name !== 'node_modules').map(child => child.name)
    const idx = apps.indexOf('hearth')
    if (idx === -1) return 'http://localhost:3000'

    return `https://hearth.app.localhost:${idx + 8000 + 1}`
}

async function _getReusedPackages () {
    const { monorepoInfo } = getConfig()
    if (!monorepoInfo.isMonorepo || !monorepoInfo.isHearthRepo || monorepoInfo.packageManager !== 'yarn') return []
    const hasYarnRC = existsSync(join(monorepoInfo.root, '.yarnrc.yml'))
    if (!hasYarnRC) return []
    const yarnRCContent = parse(await readFile(join(monorepoInfo.root, '.yarnrc.yml'), 'utf-8'))
    if (!yarnRCContent.catalog) return []

    return Object.keys(yarnRCContent.catalog)
}

export async function resolveLocalDependencies () {
    const { projectPath, monorepoInfo } = getConfig()
    const packageJson = join(projectPath, 'package.json')

    if (!existsSync(packageJson) || !monorepoInfo.isHearthRepo) return

    const packageJsonContent = JSON.parse(await readFile(packageJson, 'utf-8'))
    const reusedPackages = await _getReusedPackages()

    for (const key of ['dependencies', 'devDependencies', 'peerDependencies']) {
        if (Object.hasOwn(packageJsonContent, key)) {
            packageJsonContent[key] = Object.fromEntries(
                Object.entries(packageJsonContent[key])
                    .map(([name, version]) => {
                        // Safety-guard for non-yarn package managers
                        if (monorepoInfo.packageManager !== 'yarn') return [name, version]

                        // Local packages resolve
                        if (name.startsWith('@open-hearth/')) {
                            return [name, 'workspace:^']
                        }

                        // Reused packages resolve
                        if (reusedPackages.includes(name)) {
                            return [name, 'catalog:']
                        }

                        return [name, version]
                    })
            )
        }
    }

    await writeFile(packageJson, JSON.stringify(packageJsonContent, null, 2))
}

export async function resolveLocalSchema () {
    const { monorepoInfo, projectPath } = getConfig()
    if (!monorepoInfo.isMonorepo || !monorepoInfo.isHearthRepo) return

    const codegenPath = join(projectPath, 'codegen.ts')
    if (!existsSync(codegenPath)) return

    const targetSchemaPath = join(monorepoInfo.root, 'apps', 'hearth', 'schema.graphql')
    const relativeSchemaPath = relative(projectPath, targetSchemaPath)

    const codegenContent = await readFile(codegenPath, 'utf-8')
    const updatedContent = codegenContent.replace(CODEGEN_REGEXP, `schema: '${relativeSchemaPath}'`)

    await writeFile(codegenPath, updatedContent)
}

async function replaceEnvToConfInFile (filePath: string) {
    if (!existsSync(filePath)) return
    const fileContent = await readFile(filePath, 'utf-8')
    if (!fileContent.includes('process.env.')) return

    const updatedContent = fileContent.replace(ENV_REGEXP, (_match, envName) => {
        const confName = typeof envName === 'string' && envName.startsWith(PUBLIC_ENV_PREFIX)
            ? envName.slice(PUBLIC_ENV_PREFIX.length)
            : envName
        return `conf['${confName}']`
    })
    const importMatch = fileContent.match(/^import\s+/m)
    const insertPosition = importMatch ? importMatch.index! : 0

    const finalContent = updatedContent.slice(0, insertPosition) + `${CONF_TS_IMPORT}\n` + updatedContent.slice(insertPosition)

    await writeFile(filePath, finalContent)
}

export async function replaceEnvToConf () {
    const { projectPath } = getConfig()
    // NOTE: controlled paths
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
    return Promise.all(FILES_TO_ENV_REPLACE.map(filePath => replaceEnvToConfInFile(join(projectPath, filePath))))
}

async function replaceLocalHearthAddressInFile (filePath: string) {
    if (!existsSync(filePath)) return
    const fileContent = await readFile(filePath, 'utf-8')
    const localHearthAddress = await _resolveHearthLocalAddress()

    await writeFile(filePath, fileContent.replaceAll(HEARTH_DEMO_STAND, localHearthAddress))
}

export async function replaceLocalHearthAddress () {
    const { projectPath } = getConfig()
    // NOTE: controlled paths
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
    return Promise.all(FILES_TO_ENV_REPLACE.map(filePath => replaceLocalHearthAddressInFile(join(projectPath, filePath))))
}