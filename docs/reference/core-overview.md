---
title: Core API
description: Reference for the Subscrio class, configuration, and public services in the TypeScript package and the Subscrio.Core .NET package.
---

# Subscrio Core API Reference

Reference for the shared entitlement model and public services exposed by the `subscrio` TypeScript package and `Subscrio.Core` .NET package.

## Main Class

### Subscrio

=== "TypeScript"
    ```typescript
    import { Subscrio } from 'subscrio';

    const subscrio = new Subscrio({
      database: {
        connectionString: process.env.DATABASE_URL
      }
    });
    ```

=== ".NET"
    Direct construction:

    ```csharp
    using Subscrio.Core;

    var subscrio = new Subscrio(new SubscrioConfig
    {
        Database = new DatabaseConfig
        {
            ConnectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? ""
        }
    });
    ```

    **Dependency injection (ASP.NET Core / generic host):** Register Subscrio with the service collection so it is resolved per scope (recommended for web apps). Add `using Subscrio.Core.DependencyInjection;` and call `services.AddSubscrio(config, ServiceLifetime.Scoped)`. Then inject `Subscrio` in controllers or minimal API handlers. Use `ServiceLifetime.Scoped` for web apps; use `Transient` for console or background services. See [Getting Started](getting-started.md) for a full bootstrap and DI example.

## Method Catalog

=== "TypeScript"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `installSchema` | Creates every Subscrio database table, seeds configuration rows, and optionally writes the admin passphrase hash | `Promise<void>` |
    | `migrate` | Runs pending database migrations to update the schema to the latest version | `Promise<number>` |
    | `verifySchema` | Confirms whether the Subscrio schema is already installed and returns the current schema version | `Promise<string \| null>` |
    | `dropSchema` | Verifies the configured administrator passphrase when required, then removes every table created by Subscrio | `Promise<void>` |
    | `runInitialConfigSync` | If `initialConfig` was passed to the constructor, runs config sync (file or JSON) and returns the report; otherwise returns `null` | `Promise<ConfigSyncReport \| null>` |
    | `close` | Closes the database connection pool | `Promise<void>` |

=== ".NET"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `InstallSchemaAsync` | Creates every Subscrio database table, seeds configuration rows, and optionally writes the admin passphrase hash | `Task` |
    | `MigrateAsync` | Runs pending database migrations to update the schema to the latest version | `Task<int>` |
    | `VerifySchemaAsync` | Confirms whether the Subscrio schema is already installed and returns the current schema version | `Task<string?>` |
    | `DropSchemaAsync` | Verifies the configured administrator passphrase when required, then removes every table created by Subscrio | `Task` |
    | `RunInitialConfigSyncAsync` | If `InitialConfig` was passed to the constructor, runs config sync (file or JSON) and returns the report; otherwise returns `null` | `Task<ConfigSyncReport?>` |
    | `Dispose` | Closes the database connection pool | `void` |

## Method Reference

### Constructor

#### Description
 Instantiates the core library, initializes the database connection, and wires every repository and service so callers can use Subscrio synchronously after construction.

#### Signature

=== "TypeScript"
    ```typescript
    new Subscrio(config: SubscrioConfig)
    ```

=== ".NET"
    ```csharp
    new Subscrio(SubscrioConfig config)
    ```

#### Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `config` | [`SubscrioConfig`](#configuration-object) | Yes | Database connection plus optional passphrase, Stripe, logging, hooks, and initial config. |

#### Input Properties

- [`SubscrioConfig`](#configuration-object) – high-level shape that includes the `database`, `stripe`, `logging`, `hooks`, and `initialConfig` objects defined later in this page.

#### Returns

=== "TypeScript"
    Creates a new `Subscrio` instance that exposes the services listed in the [Service Reference Index](#service-reference-index).

=== ".NET"
    Creates a new `Subscrio` instance that exposes the services listed in the [Service Reference Index](#service-reference-index).

#### Return Properties

=== "TypeScript"
    - `Subscrio` – instance with properties such as `products`, `plans`, `featureChecker`, etc.

=== ".NET"
    - `Subscrio` – instance with properties such as `Products`, `Plans`, `FeatureChecker`, etc.

#### Expected Results

- TypeScript opens a PostgreSQL connection using `config.database`. `installSchema`, `migrate`, `verifySchema`, `dropSchema`, and all service queries use that PostgreSQL pool.
- TypeScript throws `ConfigurationError` at construction when the connection string or `databaseType` selects SQL Server. SQL Server schema SQL exists for test parity; it is not a public `Subscrio` runtime.
- .NET opens PostgreSQL or SQL Server using `config.Database`, including `DatabaseType` (default `PostgreSQL`).
- Constructs repository instances and wires each service with its dependencies.
- Keeps a shared schema installer for schema management helpers.

#### Potential Errors

| Error | When |
| --- | --- |
| `ConfigurationError` | TypeScript: the connection string or `databaseType` selects SQL Server. The TypeScript query runtime requires PostgreSQL. |
| `Error` / `ApplicationException` | Thrown if required config such as `DATABASE_URL` is missing when using `loadConfig()` / `ConfigLoader.LoadConfig()`. |

#### Example

=== "TypeScript"
    ```typescript
    const subscrio = new Subscrio({
      database: { connectionString: process.env.DATABASE_URL! },
      adminPassphrase: process.env.ADMIN_PASSPHRASE
    });
    ```

=== ".NET"
    ```csharp
    var subscrio = new Subscrio(new SubscrioConfig
    {
        Database = new DatabaseConfig { ConnectionString = Environment.GetEnvironmentVariable("DATABASE_URL")! },
        AdminPassphrase = Environment.GetEnvironmentVariable("ADMIN_PASSPHRASE")
    });
    ```

#### Configuration object

`Subscrio` consumes a strongly typed config. Only `database.connectionString` (TypeScript) / `Database.ConnectionString` (.NET) is required; every other field is optional.

=== "TypeScript"
    Config is defined in `src/config/types.ts`:

    ```typescript
    export interface SubscrioConfig {
      database: {
        connectionString: string;
        ssl?: boolean;
        poolSize?: number;
        databaseType?: 'postgres' | 'sqlserver';
      };
      adminPassphrase?: string;
      stripe?: {
        secretKey: string;
        webhookSecret?: string;
      };
      logging?: { level: 'debug' | 'info' | 'warn' | 'error' };
      initialConfig?: InitialConfigSync;  // { type: 'file', filePath: string } | { type: 'json', config: ConfigSyncDto }
      hooks?: HooksConfig;
    }
    ```

=== ".NET"
    Config is defined in `Subscrio.Core.Config`:

    ```csharp
    public class SubscrioConfig
    {
        public required DatabaseConfig Database { get; init; }
        public string? AdminPassphrase { get; init; }
        public StripeConfig? Stripe { get; init; }
        public LoggingConfig? Logging { get; init; }
        public InitialConfigOptions? InitialConfig { get; init; }  // FilePath and/or Config for config sync
        public SubscrioHooksOptions? Hooks { get; init; }
    }

    public class DatabaseConfig
    {
        public required string ConnectionString { get; init; }
        public bool Ssl { get; init; }
        public int PoolSize { get; init; } = 10;
        public DatabaseType DatabaseType { get; init; } = DatabaseType.PostgreSQL;
    }
    ```

##### `database` object

=== "TypeScript"
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | `connectionString` | `string` | Yes | PostgreSQL URI (`postgresql://user:pass@host:port/db`). |
    | `ssl` | `boolean` | No | When `true`, the pg pool uses `{ rejectUnauthorized: true }`. |
    | `poolSize` | `number` | No | Custom pg pool size; defaults to 10. |
    | `databaseType` | `'postgres' \| 'sqlserver'` | No | Optional dialect hint. Detected from the connection string when omitted. `sqlserver` is not a TypeScript runtime; construction throws `ConfigurationError`. `loadConfig()` does not read `DATABASE_TYPE`. |

=== ".NET"
    | Property | Type | Required | Description |
    | --- | --- | --- | --- |
    | `ConnectionString` | `string` | Yes | PostgreSQL or SQL Server connection string. |
    | `Ssl` | `bool` | No | Forces SSL when running outside trusted networks. |
    | `PoolSize` | `int` | No | Custom pool size; defaults to 10. |
    | `DatabaseType` | `DatabaseType` | No | `PostgreSQL` (default) or `SqlServer`. |

##### `adminPassphrase`

Optional passphrase for privileged schema operations. `installSchema()` / `InstallSchemaAsync()` hashes and stores it only when no administrator passphrase hash exists. Installation never replaces an existing hash. `dropSchema()` / `DropSchemaAsync()` requires a matching passphrase when a hash is stored. A method argument takes precedence over the constructor setting.

##### `initialConfig` / `InitialConfig`

Optional config sync input (same as used by [ConfigSyncService](config-sync.md)): a file path or a `ConfigSyncDto` object. If set, call `runInitialConfigSync()` / `RunInitialConfigSyncAsync()` after construction (e.g. after installing or verifying the schema) to apply the configuration. When provided, that method runs the sync and returns the report; when omitted, it returns `null`.

##### `stripe` object

=== "TypeScript"
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | `secretKey` | `string` | Yes | Private Stripe secret used by `createCheckoutSession` and by your webhook endpoint when creating a Stripe client. |
    | `webhookSecret` | `string` | No | Stripe endpoint signing secret, normally beginning with `whsec_`. Required by `subscrio.stripe.constructStripeEvent()`. |

=== ".NET"
    | Property | Type | Required | Description |
    | --- | --- | --- | --- |
    | `SecretKey` | `string` | Yes | Private Stripe secret used by `CreateCheckoutSessionAsync` and by your webhook endpoint when creating a Stripe client. |
    | `WebhookSecret` | `string?` | No | Stripe endpoint signing secret, normally beginning with `whsec_`. Required by `StripeConfig.ConstructStripeEvent()`. |

Webhook verification is exposed in different places. TypeScript provides `subscrio.stripe.constructStripeEvent(payload, signatureHeader)`. .NET provides `config.Stripe.ConstructStripeEvent(json, signatureHeader)`. See [Stripe Integration](stripe-integration.md) for complete examples.

##### `logging` object

=== "TypeScript"
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | `level` | `'debug' \| 'info' \| 'warn' \| 'error'` | Yes | Reserved configuration value. The current TypeScript library loads this value but does not emit or filter diagnostics with it. |

=== ".NET"
    | Property | Type | Required | Description |
    | --- | --- | --- | --- |
    | `Level` | `LogLevel` | No | Reserved configuration value. The current .NET library loads `Debug`, `Info` (default), `Warn`, or `Error`, but does not emit or filter diagnostics with it. |

### installSchema

#### Description
 Creates every Subscrio database table, seeds configuration rows, and optionally writes the admin passphrase hash when setting up a fresh environment.

#### Signature

=== "TypeScript"
    ```typescript
    installSchema(adminPassphrase?: string): Promise<void>
    ```

=== ".NET"
    ```csharp
    Task InstallSchemaAsync(string? adminPassphrase = null)
    ```

#### Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `adminPassphrase` | `string` | No | Optional override that supersedes `config.adminPassphrase`. |

#### Input Properties

- `adminPassphrase` – plain text string that will be hashed before being stored in `system_config`.

#### Returns

=== "TypeScript"
    `Promise<void>` – resolves when the schema is fully installed.

=== ".NET"
    `Task` – completes when the schema is fully installed.

#### Return Properties

=== "TypeScript"
    - `void`

=== ".NET"
    - None (`Task` returns no value)

#### Expected Results

- Runs the schema installer to create all tables, extensions, and seed configuration rows.
- Stores the admin passphrase hash when provided and no hash already exists. Installation never replaces an existing hash.

#### Potential Errors

| Error | When |
| --- | --- |
| `ConfigurationError` | Database connection unavailable or migration prerequisites missing. |
| `DomainError` | Passphrase validation fails the policy enforced by the installer. |

#### Example

=== "TypeScript"
    ```typescript
    await subscrio.installSchema('super-secret-passphrase');
    ```

=== ".NET"
    ```csharp
    await subscrio.InstallSchemaAsync("super-secret-passphrase");
    ```

### migrate

#### Description
Runs pending database migrations to update the schema to the latest version. Migrations are tracked via `schema_version` in the `system_config` table, so only pending migrations are applied.

#### Signature

=== "TypeScript"
    ```typescript
    migrate(): Promise<number>
    ```

=== ".NET"
    ```csharp
    Task<int> MigrateAsync()
    ```

#### Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| _None_ |  |  |  |

#### Input Properties

- None.

#### Returns

=== "TypeScript"
    `Promise<number>` – resolves to the number of migrations applied.

=== ".NET"
    `Task<int>` – resolves to the number of migrations applied.

#### Return Properties

=== "TypeScript"
    - `number` – count of migrations that were applied (0 if database is up to date).

=== ".NET"
    - `int` – count of migrations that were applied (0 if database is up to date).

#### Expected Results

- Checks current schema version from `system_config`.
- Runs only pending migrations (those with version numbers greater than current).
- Updates `schema_version` in `system_config` after each migration.
- Returns count of migrations applied.

#### Potential Errors

| Error | When |
| --- | --- |
| `ConfigurationError` | Database connection unavailable or migration fails. |

#### Example

=== "TypeScript"
    ```typescript
    const migrationsApplied = await subscrio.migrate();
    if (migrationsApplied > 0) {
      console.log(`Applied ${migrationsApplied} migration(s)`);
    } else {
      console.log('Database is up to date');
    }
    ```

    Or via CLI after installing the package: `npx subscrio-migrate`

=== ".NET"
    ```csharp
    var migrationsApplied = await subscrio.MigrateAsync();
    if (migrationsApplied > 0)
    {
        Console.WriteLine($"Applied {migrationsApplied} migration(s)");
    }
    else
    {
        Console.WriteLine("Database is up to date");
    }
    ```

### verifySchema

#### Description
 Confirms whether the Subscrio schema is already installed and returns the current schema version. Returns `null` if the schema is not installed, allowing callers to decide whether to run `installSchema()` or proceed with normal operations.

#### Signature

=== "TypeScript"
    ```typescript
    verifySchema(): Promise<string | null>
    ```

=== ".NET"
    ```csharp
    Task<string?> VerifySchemaAsync()
    ```

#### Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| _None_ |  |  |  |

#### Input Properties

- None.

#### Returns

=== "TypeScript"
    `Promise<string | null>` – resolves to the current schema version (e.g., `"1.1.0"`) when installed, or `null` if not installed.

=== ".NET"
    `Task<string?>` – resolves to the current schema version (e.g., `"1.1.0"`) when installed, or `null` if not installed.

#### Return Properties

=== "TypeScript"
    - `string | null` – the schema version string if installed, or `null` if not installed.

=== ".NET"
    - `string?` – the schema version string if installed, or `null` if not installed.

#### Expected Results

- Executes lightweight checks on required tables and indexes via the schema installer.
- If schema exists, retrieves and returns the current schema version from `system_config`.
- Returns `null` if schema is not installed or version cannot be determined.

#### Potential Errors

| Error | When |
| --- | --- |
| `ConfigurationError` | Database connection is unavailable. |

#### Example

=== "TypeScript"
    ```typescript
    const version = await subscrio.verifySchema();
    if (version === null) {
      console.warn('Subscrio schema missing – run installSchema() first.');
    } else {
      console.log(`Schema version: ${version}`);
    }
    ```

=== ".NET"
    ```csharp
    var version = await subscrio.VerifySchemaAsync();
    if (version == null)
    {
        Console.WriteLine("Subscrio schema missing – run InstallSchemaAsync() first.");
    }
    else
    {
        Console.WriteLine($"Schema version: {version}");
    }
    ```

### runInitialConfigSync

#### Description

Runs the constructor-supplied initial configuration. Use this after the schema has been installed or verified. The method returns `null` when the constructor did not receive an initial configuration.

#### Signature

=== "TypeScript"
    ```typescript
    runInitialConfigSync(): Promise<ConfigSyncReport | null>
    ```

=== ".NET"
    ```csharp
    Task<ConfigSyncReport?> RunInitialConfigSyncAsync()
    ```

#### Inputs

The method has no arguments. It uses `initialConfig` or `InitialConfig` from the constructor configuration.

#### Returns

=== "TypeScript"
    `Promise<ConfigSyncReport | null>`

=== ".NET"
    `Task<ConfigSyncReport?>`

The result is the same report returned by `configSync.syncFromFile()` / `syncFromJson()` or the corresponding .NET methods. It is `null` when no initial configuration was supplied.

#### Expected results

- A file configuration calls `syncFromFile` or `SyncFromFileAsync`.
- An object configuration calls `syncFromJson` or `SyncFromJsonAsync`.
- An absent configuration returns `null` without changing the catalog.
- In .NET, an `InitialConfigOptions` object with neither `FilePath` nor `Config` also returns `null`.

#### Potential errors

The method can propagate the configuration, validation, lookup, and database errors documented for [ConfigSyncService](config-sync.md).

#### Example

=== "TypeScript"
    ```typescript
    const subscrio = new Subscrio({
      database: { connectionString: process.env.DATABASE_URL! },
      initialConfig: { type: 'file', filePath: './subscrio.json' }
    });

    await subscrio.installSchema();
    const report = await subscrio.runInitialConfigSync();
    ```

=== ".NET"
    ```csharp
    using var subscrio = new Subscrio(new SubscrioConfig
    {
        Database = new DatabaseConfig { ConnectionString = connectionString },
        InitialConfig = new InitialConfigOptions { FilePath = "./subscrio.json" }
    });

    await subscrio.InstallSchemaAsync();
    var report = await subscrio.RunInitialConfigSyncAsync();
    ```

### dropSchema

#### Description
 Removes every table created by Subscrio. When installation stored an administrator passphrase hash, the caller must provide the matching passphrase. This method is intended for local development resets or automated tests.

#### Signature

=== "TypeScript"
    ```typescript
    dropSchema(adminPassphrase?: string): Promise<void>
    ```

=== ".NET"
    ```csharp
    Task DropSchemaAsync(string? adminPassphrase = null)
    ```

#### Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `adminPassphrase` | `string` / `string?` | No | Passphrase to verify before dropping the schema. The method uses the constructor's `adminPassphrase` / `AdminPassphrase` when this argument is omitted. |

#### Input Properties

- A plain text passphrase. It is checked against the stored BCrypt hash and is never persisted by the drop operation.

#### Returns

=== "TypeScript"
    `Promise<void>` – resolves after the installer drops all managed tables.

=== ".NET"
    `Task` – completes after the installer drops all managed tables.

#### Return Properties

=== "TypeScript"
    - `void`

=== ".NET"
    - None

#### Expected Results

- If no administrator hash exists, the drop proceeds without a passphrase.
- If a hash exists, the supplied or constructor-configured passphrase must match.
- After verification, the installer drops every Subscrio-owned table and the subscription status view.

#### Potential Errors

| Error | When |
| --- | --- |
| `ValidationError` / `ValidationException` | An administrator hash exists and the passphrase is missing or does not match. |
| `ConfigurationError` | Database refuses the drop (permissions, locks). |

#### Example

=== "TypeScript"
    ```typescript
    if (process.env.NODE_ENV === 'test') {
      await subscrio.dropSchema(process.env.ADMIN_PASSPHRASE);
    }
    ```

=== ".NET"
    ```csharp
    if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Testing")
    {
        await subscrio.DropSchemaAsync(
            Environment.GetEnvironmentVariable("ADMIN_PASSPHRASE"));
    }
    ```

### close

#### Description
 Closes the shared database connection pool so the process can exit cleanly.

#### Signature

=== "TypeScript"
    ```typescript
    close(): Promise<void>
    ```

=== ".NET"
    ```csharp
    void Dispose()
    ```

#### Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| _None_ |  |  |  |

#### Input Properties

- None.

#### Returns

=== "TypeScript"
    `Promise<void>` – resolves after all connections are closed.

=== ".NET"
    `void` – `Dispose()` is synchronous. Use `using var subscrio = new Subscrio(config);` or call `Dispose()` when finished.

#### Return Properties

=== "TypeScript"
    - `void`

=== ".NET"
    - None

#### Expected Results

- Closes database connections and releases resources.

#### Potential Errors

| Error | When |
| --- | --- |
| `ConfigurationError` | Database connection has already been torn down unexpectedly. |

#### Example

=== "TypeScript"
    ```typescript
    await subscrio.close();
    ```

=== ".NET"
    ```csharp
    subscrio.Dispose();
    // Or: using var subscrio = new Subscrio(config);
    ```

---

## Supported public surface

The supported application API consists of the `Subscrio` facade, its service properties, configuration types, service input and output DTOs, error types, hook registration types, and the value-object enums used by those DTOs.

The TypeScript package currently exports additional schemas, date helpers, constants, domain entities, repository interfaces, and lower-level utility functions through its root barrel. The .NET assembly also exposes persistence records, the EF context and configurations, repository implementations, mappers, validators, helpers, and domain services as public types. Those lower-level declarations are available for compatibility and testing, but they are not documented as stable application API. Consumers should use the facade and service contracts described by this site. A future major release may narrow these exports without preserving their current public shape.

One lower-level TypeScript helper is intentionally supported: `convertFeatureValue`. Its conversion behavior is documented in [Feature Checker](feature-checker.md).

## Service Reference Index

All service-level documentation now lives in dedicated markdown files so each method, DTO, error, and example can be described in depth. The following table shows where to find those references:

| Service | Scope | Reference |
| --- | --- | --- |
| ProductManagementService | Product CRUD, feature associations | [`products.md`](./products.md) |
| FeatureManagementService | Global feature definitions | [`features.md`](./features.md) |
| PlanManagementService | Plans, feature values, transitions | [`plans.md`](./plans.md) |
| BillingCycleManagementService | Billing cadence + price mappings | [`billing-cycles.md`](./billing-cycles.md) |
| CustomerManagementService | Customer lifecycle | [`customers.md`](./customers.md) |
| SubscriptionManagementService | Subscriptions, overrides, batch jobs | [`subscriptions.md`](./subscriptions.md) |
| FeatureCheckerService | Runtime feature resolution APIs | [`feature-checker.md`](./feature-checker.md) |
| ConfigSyncService | Catalog sync from JSON file or `ConfigSyncDto` | [`config-sync.md`](./config-sync.md) |
| StripeIntegrationService | Stripe webhook processing & checkout helpers | [`stripe-integration.md`](./stripe-integration.md) |
| Hooks | Before/after customer/subscription hooks + `stripe.received.before` / `.after` | [`hooks.md`](./hooks.md) |

> Every service doc follows a standard structure that standardizes sections for usage, inputs/outputs, DTOs, expected results, errors, and working examples.

## Additional Reference Guides

- `hooks.md` documents the before/after hook catalog, payloads, mutation rules, and registration API.
- `how-to-extend.md` covers the first-party audit-log and payments packages and how to package your own extensions.
- `subscriptions.md` covers CRUD APIs, DTOs, overrides, and lifecycle automation APIs.
- `subscription-lifecycle.md` fully documents how each status is calculated (with diagrams) and how transitions work.
- `relationships.md` centralizes the product/plan/feature/billing-cycle/customer relationships, the feature resolution hierarchy, and the customer key conventions.
- `products.md`, `plans.md`, `features.md`, and `billing-cycles.md` document CRUD flows, DTOs, and association helpers for each domain surface.
- `feature-checker.md` explains the subscription override → plan value → feature default resolution order in depth.
- `customers.md` details how caller-supplied customer keys map to internal IDs and where they are required.
- [Configuration Sync](config-sync.md) documents catalog sync from a JSON file or `ConfigSyncDto`.
- [Stripe Integration](stripe-integration.md) contains the full Stripe API, including where signature verification must happen before calling `processStripeEvent()`.
