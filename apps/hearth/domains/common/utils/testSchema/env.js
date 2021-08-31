function mockEnv (envMock) {
    jest.mock('@open-hearth/config', () => {
        const actual = jest.requireActual('@open-hearth/config')
        return new Proxy(actual, {
            set: () => {},
            get: (target, p) => {
                const mockedValueOrGetter = envMock[p]
                if (!mockedValueOrGetter) {
                    return target[p]
                }

                let mockedValue = mockedValueOrGetter
                if (typeof mockedValueOrGetter === 'function') {
                    mockedValue = mockedValueOrGetter()
                }

                return JSON.stringify(mockedValue)
            },
        })
    })
}

module.exports = {
    mockEnv,
}