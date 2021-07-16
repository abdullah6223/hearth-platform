# `@open-hearth/tsconfig`

> A set of frequently used tsconfig.json for various typescript applications within the hearth ecosystem.

## Table of contents
[Installation](#installation)\
[Usage](#usage)

## Installation
To install package simply run the following command if you're using npm as your package manager:
```bash
npm i @open-hearth/tsconfig
```
or it's yarn alternative
```bash
yarn add @open-hearth/tsconfig
```

## Usage

To use a config, simply add it to the `extends` field of your `tsconfig.json`.

### React library with `src` folder

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@open-hearth/tsconfig/react-lib.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Next.js application

```json
{
  "schema": "https://json.schemastore.org/tsconfig",
  "extends": "@open-hearth/tsconfig/next-app.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["**/*.ts", "**/*.tsx", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

> Make sure to override `exclude`, `include`, `rootDir`, `outDir` and `baseUrl` properties
> since it's calculation is relative to extendable tsconfig path