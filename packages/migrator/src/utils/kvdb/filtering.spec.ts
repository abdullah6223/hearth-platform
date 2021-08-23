import { isAppUsingKV } from './filtering'

import type { Monorepo } from '@/utils/tests/repo'

import { createTestMonoRepo } from '@/utils/tests/repo'

describe('Utils for filtering specific packages', () => {
    let repo: Monorepo | undefined
    afterEach(() => {
        repo?.destroy()
    })
    
    describe('isAppUsingKV', () => {
        test('Must return "true" if "@open-hearth/keystone" or "ioredis" found in package dependencies / devDependencies', () => {
            repo = createTestMonoRepo()
                .createApp({ dependencies: { 'ioredis': '^4.28.5' } })
                .createApp({ dependencies: { '@open-hearth/keystone': 'workspace:^' } })
                .createApp({ devDependencies: { 'ioredis': '^4.28.5' } })
                .createApp({ devDependencies: { '@open-hearth/keystone': 'workspace:^' } })

            const detectedApps = repo.apps.filter(isAppUsingKV)
            expect(detectedApps).toHaveLength(repo.apps.length)
        })
        test('Must return "false" if dependencies / devDependencies are empty or not containing "@open-hearth/keystone" or "ioredis" package', () => {
            repo = createTestMonoRepo()
                .createApp()
                .createApp({ dependencies: { '@open-hearth/ui': 'workspace:^' } })
                .createApp({ devDependencies: { '@open-hearth/tsconfig': 'workspace:^' } })
                .createApp({ devDependencies: { '@open-hearth/tsconfig': 'workspace:^' }, dependencies: { '@open-hearth/ui': 'workspace:^' } })

            const detectedApps = repo.apps.filter(isAppUsingKV)
            expect(detectedApps).toHaveLength(0)
        })
    })
})