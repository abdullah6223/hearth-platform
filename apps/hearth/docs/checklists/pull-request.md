Before you make a pull request
=====

Apply linter:

```shell
yarn lint --quiet
```

Try to build:

```shell
yarn workspace @app/hearth build
```

Look at errors, reported by TypeScript project-wide in IDE, you are using.

Sync database schema with schemas in Keystone:

```shell
docker-compose run app yarn workspace @app/hearth makemigrations
```

Sync TypeScript declarations for GraphQL entities:

```shell
yarn workspace @app/hearth maketypes
```

Check imports, that should be from absolute paths, like following:

```jsx
import { something } from '@app/hearth/domains/…' // correct
import { something } from '../../..//domains/…' // incorrect
```

Process all `svg` files via [SVGO](https://jakearchibald.github.io/svgomg/)
