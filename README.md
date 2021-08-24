# Hearth

Hearth is an open-source property management platform for management companies, covering tickets, properties, residents, meters, billing and payments, with an extension system for mini-apps.

## Project Structure

```text
.
├── packages/
│   ├── keystone/               # Keystone helpers: fields, plugins, adapters, test utils
│   ├── ui/                     # React UI kit (with Storybook)
│   ├── icons/                  # SVG icons as React components
│   ├── next/                   # Next.js integration: auth, apollo, intl, org context
│   ├── apollo/                 # Apollo client wrapper with persistent cache
│   ├── apollo-server-client/   # Server-side GraphQL client
│   ├── bridge/                 # Messaging bridge between mini-apps and the main UI
│   ├── miniapp-utils/          # Helpers, hooks and components for building mini-apps
│   ├── codegen/                # Code generation for schemas, services and GraphQL utils
│   ├── billing/                # Billing and acquiring utilities shared between apps
│   ├── webhooks/               # Webhook subscriptions for Keystone apps
│   ├── messaging/              # Real-time messaging over NATS
│   ├── featureflags/           # Feature flag helpers
│   ├── files/                  # File upload helpers
│   ├── clients/                # Clients for local and external services
│   ├── config/                 # Environment-based configuration loader
│   ├── locales/                # Shared locale helpers
│   ├── migrator/               # CLI to run code and infrastructure migrations
│   ├── surveys/                # Survey helpers
│   ├── cli/                    # Helpers used by the bin/ scripts
│   ├── create-hearth-app/      # CLI that scaffolds a new mini-app
│   └── tsconfig/               # Shared TypeScript configs
├── turbo.json                  # Turborepo pipeline
└── package.json                # Workspaces, root scripts and shared dependency resolutions
```
