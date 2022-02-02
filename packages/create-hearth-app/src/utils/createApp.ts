import { mkdirSync, existsSync } from 'fs'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

import { cyan, green, blue, yellowBright } from 'picocolors'

import { resolveLocalDependencies, resolveLocalSchema, replaceEnvToConf, replaceLocalHearthAddress } from '@/utils/hearth'
import { getConfig } from '@/utils/config'
import { copyAppTemplate, copyAppDir } from '@/utils/copy'
import { resolveTemplatesDir } from '@/utils/fs'
import { tryGitInit } from '@/utils/git'
import { adjustScripts, install, exec, runScript } from '@/utils/packageManagers'

async function runTypeGen (knownScripts: Array<string>) {
    await exec('next', ['typegen'])
    if (knownScripts.includes('maketypes')) {
        await runScript('maketypes')
    }
}

async function setAppName () {
    const { projectPath, appName } = getConfig()
    const packageJsonPath = join(projectPath, 'package.json')
    if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
        packageJson.name = appName
        await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
    }
}

export async function initAppFromTemplate () {
    const { preferences, monorepoInfo, projectPath, appName, packageManager } = getConfig()

    console.log()
    console.log(`Creating new Hearth app in ${green(projectPath)}`)
    console.log()

    mkdirSync(projectPath, { recursive: true })
    process.chdir(projectPath)

    const templateName = typeof preferences.template === 'string' ? preferences.template : 'base'
    console.log(`Copying ${cyan(templateName)} template. This might take a moment...`)
    console.log()
    await copyAppTemplate(templateName)
    await setAppName()

    if (preferences.examples) {
        console.log(`Adding ${cyan('examples')} files...`)
        console.log()
        await copyAppDir(join(resolveTemplatesDir(), 'examples', 'basic'))
    }
    if (monorepoInfo.isHearthRepo) {
        console.log(`Hearth monorepo detected. Adding ${cyan('hearth-specific')} files...`)
        console.log()
        await copyAppDir(join(resolveTemplatesDir(), 'examples', 'hearth'))
        await resolveLocalDependencies()
        await replaceLocalHearthAddress()
        await resolveLocalSchema()
        await replaceEnvToConf()
    }

    const hasPackageJson = existsSync(join(projectPath, 'package.json'))

    let scripts: Array<string> = []

    if (hasPackageJson) {
        console.log(`Rewriting scripts to use ${blue(packageManager)}`)
        console.log()
        scripts = adjustScripts()

        console.log(`${blue('Installing packages.')} This might take a couple of minutes...`)
        console.log()
        await install()
    }

    console.log(`${blue('Generating types.')} This might take a moment...`)
    console.log()
    await runTypeGen(scripts)
    console.log()

    if (!preferences.git) {
        console.log(`${yellowBright('Skipping')} git initialization`)
        console.log()
    } else if (tryGitInit()) {
        console.log('Initialized a git repository')
        console.log()
    }

    console.log(`${green('Success!')} Created ${appName} at ${projectPath}`)
}