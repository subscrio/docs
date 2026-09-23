---
title: Subscrio
description: Initialize Subscrio, configure its objects, and manage the database schema in TypeScript and .NET.
reference_format: true
---

# Subscrio

## Purpose

<span id="method-reference" class="compatibility-anchor"></span>

<span id="subscrio-typescript" class="compatibility-anchor"></span>
<span id="subscrio-net" class="compatibility-anchor"></span>
<span id="method-catalog-typescript" class="compatibility-anchor"></span>
<span id="method-catalog-net" class="compatibility-anchor"></span>

<span id="main-class" class="compatibility-anchor"></span>

<span id="core-overview" class="compatibility-anchor"></span>

Subscrio is the entry point for the library. Configure its database connection, then use its objects to manage your catalog, subscriptions, feature checks, usage, and credits.

<span id="partial-updates" class="compatibility-anchor"></span>

## Access and initialization

### Access

Create one instance for your application or dependency-injection scope. Install the schema for a new database, or verify and migrate an existing installation before using the catalog. Examples on the object pages use this initialized `subscrio` instance.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
import { Subscrio } from 'subscrio';

const subscrio = new Subscrio({
  database: { connectionString: process.env.DATABASE_URL! }
});

const version = await subscrio.verifySchema();
if (version === null) await subscrio.installSchema();
else await subscrio.migrate();
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core;
using Subscrio.Core.Config;

using var subscrio = new Subscrio.Core.Subscrio(new SubscrioConfig
{
    Database = new DatabaseConfig
    {
        ConnectionString = Environment.GetEnvironmentVariable("DATABASE_URL")!
    }
});

var version = await subscrio.VerifySchemaAsync();
if (version is null) await subscrio.InstallSchemaAsync();
else await subscrio.MigrateAsync();
```

</div>

<div class="language-content" data-lang="net" markdown="1">

For ASP.NET Core, register with `services.AddSubscrio(config, ServiceLifetime.Scoped)` from `Subscrio.Core.DependencyInjection` and inject `Subscrio` into each request scope. The container disposes it with the scope. See [Getting Started](getting-started.md) for the complete registration example.

</div>

<div class="method-entry" markdown="1">

### Constructor { #constructor data-method-ts="Constructor" data-method-net="Constructor" }

<span id="description" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="signature-typescript" class="compatibility-anchor"></span>
<span id="signature-net" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="input-properties" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="returns-typescript" class="compatibility-anchor"></span>
<span id="returns-net" class="compatibility-anchor"></span>
<span id="return-properties" class="compatibility-anchor"></span>
<span id="return-properties-typescript" class="compatibility-anchor"></span>
<span id="return-properties-net" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>
<span id="example-typescript" class="compatibility-anchor"></span>
<span id="example-net" class="compatibility-anchor"></span>
<span id="configuration-object-typescript" class="compatibility-anchor"></span>
<span id="configuration-object-net" class="compatibility-anchor"></span>
<span id="database-object-typescript" class="compatibility-anchor"></span>
<span id="database-object-net" class="compatibility-anchor"></span>
<span id="adminpassphrase" class="compatibility-anchor"></span>
<span id="stripe-object-typescript" class="compatibility-anchor"></span>
<span id="stripe-object-net" class="compatibility-anchor"></span>
<span id="logging-object-typescript" class="compatibility-anchor"></span>
<span id="logging-object-net" class="compatibility-anchor"></span>

Create the library instance and its public objects. Construction does not install the schema or apply initial configuration. TypeScript supports PostgreSQL; .NET supports PostgreSQL and SQL Server.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
new Subscrio(config: SubscrioConfig)
```

</div>

**Parameters**

- `config`: [SubscrioConfig](#SubscrioConfig) with the database connection and optional integration settings.

**Example**

```typescript
const configured = new Subscrio({
  database: { connectionString: process.env.DATABASE_URL! },
  initialConfig: { type: 'file', filePath: './subscrio.json' }
});
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ConfigurationError`: SQL Server was selected for the TypeScript runtime.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
new Subscrio(SubscrioConfig config)
```

</div>

**Parameters**

- `config`: [SubscrioConfig](#SubscrioConfig) with the database connection and optional integration settings.

**Example**

```csharp
using var configured = new Subscrio.Core.Subscrio(new SubscrioConfig
{
    Database = new DatabaseConfig
    {
        ConnectionString = Environment.GetEnvironmentVariable("DATABASE_URL")!
    },
    InitialConfig = new InitialConfigOptions { FilePath = "./subscrio.json" }
});
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ArgumentException`: The configured database provider is unsupported.

</details>

</div>

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`installSchema`](#installschema) | Installs the database schema. |
| [`migrate`](#migrate) | Applies pending schema migrations. |
| [`verifySchema`](#verifyschema) | Reads the installed schema version. |
| [`runInitialConfigSync`](#runinitialconfigsync) | Applies the initial catalog configuration. |
| [`dropSchema`](#dropschema) | Permanently removes Subscrio tables and data. |
| [`close`](#close) | Releases database resources. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`InstallSchemaAsync`](#installschema) | Installs the database schema. |
| [`MigrateAsync`](#migrate) | Applies pending schema migrations. |
| [`VerifySchemaAsync`](#verifyschema) | Reads the installed schema version. |
| [`RunInitialConfigSyncAsync`](#runinitialconfigsync) | Applies the initial catalog configuration. |
| [`DropSchemaAsync`](#dropschema) | Permanently removes Subscrio tables and data. |
| [`Dispose`](#close) | Releases database resources. |

</div>

## Method details

<div class="method-entry" markdown="1">

### installSchema { #installschema data-method-ts="installSchema" data-method-net="InstallSchemaAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="signature_1-typescript" class="compatibility-anchor"></span>
<span id="signature_1-net" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="input-properties_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="returns_1-typescript" class="compatibility-anchor"></span>
<span id="returns_1-net" class="compatibility-anchor"></span>
<span id="return-properties_1" class="compatibility-anchor"></span>
<span id="return-properties_1-typescript" class="compatibility-anchor"></span>
<span id="return-properties_1-net" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="example_1-typescript" class="compatibility-anchor"></span>
<span id="example_1-net" class="compatibility-anchor"></span>

Create the Subscrio tables and initial configuration. A supplied administrator passphrase is hashed and stored only if no hash exists; installation never replaces an existing hash. Use migration to upgrade an existing schema.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
installSchema(adminPassphrase?: string): Promise<void>
```

</div>

**Parameters**

- `adminPassphrase`: Optional passphrase. The argument takes precedence over the constructor setting; when omitted, the configured passphrase is used.

**Returns** No returned value.

**Example**

```typescript
await subscrio.installSchema();
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: The installed schema is newer than the library.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task InstallSchemaAsync(string? adminPassphrase)
```

</div>

**Parameters**

- `adminPassphrase`: Optional passphrase. The argument takes precedence over the constructor setting; when omitted, the configured passphrase is used.

**Returns** No returned value.

**Example**

```csharp
await subscrio.InstallSchemaAsync();
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: The installed schema is newer than the library.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### migrate { #migrate data-method-ts="migrate" data-method-net="MigrateAsync" }

<span id="description_2" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="signature_2-typescript" class="compatibility-anchor"></span>
<span id="signature_2-net" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="input-properties_2" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="returns_2-typescript" class="compatibility-anchor"></span>
<span id="returns_2-net" class="compatibility-anchor"></span>
<span id="return-properties_2" class="compatibility-anchor"></span>
<span id="return-properties_2-typescript" class="compatibility-anchor"></span>
<span id="return-properties_2-net" class="compatibility-anchor"></span>
<span id="expected-results_2" class="compatibility-anchor"></span>
<span id="potential-errors_2" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>
<span id="example_2-typescript" class="compatibility-anchor"></span>
<span id="example_2-net" class="compatibility-anchor"></span>

Apply pending schema migrations and save the updated version. Already-applied migrations are skipped. See [Schema Upgrade](upgrading-entitlements.md) before upgrading an existing database.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
migrate(): Promise<number>
```

</div>

**Returns** `number`: Number of migrations applied, or zero when already current.

**Example**

```typescript
const applied = await subscrio.migrate();
console.log(applied);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: The installed schema is newer than the library.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<int> MigrateAsync()
```

</div>

**Returns** `int`: Number of migrations applied, or zero when already current.

**Example**

```csharp
var applied = await subscrio.MigrateAsync();
Console.WriteLine(applied);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: The installed schema is newer than the library.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### verifySchema { #verifyschema data-method-ts="verifySchema" data-method-net="VerifySchemaAsync" }

<span id="description_3" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="signature_3-typescript" class="compatibility-anchor"></span>
<span id="signature_3-net" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="input-properties_3" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="returns_3-typescript" class="compatibility-anchor"></span>
<span id="returns_3-net" class="compatibility-anchor"></span>
<span id="return-properties_3" class="compatibility-anchor"></span>
<span id="return-properties_3-typescript" class="compatibility-anchor"></span>
<span id="return-properties_3-net" class="compatibility-anchor"></span>
<span id="expected-results_3" class="compatibility-anchor"></span>
<span id="potential-errors_3" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>
<span id="example_3-typescript" class="compatibility-anchor"></span>
<span id="example_3-net" class="compatibility-anchor"></span>

Read the stored schema version to determine whether installation or migration is needed. Unexpected database failures propagate to the caller.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
verifySchema(): Promise<string | null>
```

</div>

**Returns** `string | null`: Installed version, or null when the schema or version is missing.

**Example**

```typescript
const version = await subscrio.verifySchema();
console.log(version);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<string?> VerifySchemaAsync()
```

</div>

**Returns** `string?`: Installed version, or null when the schema or version is missing.

**Example**

```csharp
var version = await subscrio.VerifySchemaAsync();
Console.WriteLine(version);
```

</div>

</div>

<div class="method-entry" markdown="1">

### runInitialConfigSync { #runinitialconfigsync data-method-ts="runInitialConfigSync" data-method-net="RunInitialConfigSyncAsync" }

<span id="description_4" class="compatibility-anchor"></span>
<span id="signature_4" class="compatibility-anchor"></span>
<span id="signature_4-typescript" class="compatibility-anchor"></span>
<span id="signature_4-net" class="compatibility-anchor"></span>
<span id="inputs_4" class="compatibility-anchor"></span>
<span id="returns_4" class="compatibility-anchor"></span>
<span id="returns_4-typescript" class="compatibility-anchor"></span>
<span id="returns_4-net" class="compatibility-anchor"></span>
<span id="expected-results_4" class="compatibility-anchor"></span>
<span id="potential-errors_4" class="compatibility-anchor"></span>
<span id="example_4" class="compatibility-anchor"></span>
<span id="example_4-typescript" class="compatibility-anchor"></span>
<span id="example_4-net" class="compatibility-anchor"></span>

Apply the file or catalog configuration supplied to the constructor. Call this after schema setup; supplying configuration alone does not run a sync. In .NET, a file path takes precedence over an object, and empty initial-config options return null.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
runInitialConfigSync(): Promise<ConfigSyncReport | null>
```

</div>

**Returns** <code><a href="../config-sync/#sync-report">ConfigSyncReport</a> | null</code>: Sync results, or null when no initial configuration was supplied.

**Example**

```typescript
const report = await subscrio.runInitialConfigSync();
console.log(report);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- Errors from [configuration sync](config-sync.md) and file access propagate to the caller.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<ConfigSyncReport?> RunInitialConfigSyncAsync()
```

</div>

**Returns** <code><a href="../config-sync/#sync-report">ConfigSyncReport</a>?</code>: Sync results, or null when no initial configuration was supplied.

**Example**

```csharp
var report = await subscrio.RunInitialConfigSyncAsync();
Console.WriteLine(report);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- Errors from [configuration sync](config-sync.md) and file access propagate to the caller.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### dropSchema { #dropschema data-method-ts="dropSchema" data-method-net="DropSchemaAsync" }

<span id="description_5" class="compatibility-anchor"></span>
<span id="signature_5" class="compatibility-anchor"></span>
<span id="signature_5-typescript" class="compatibility-anchor"></span>
<span id="signature_5-net" class="compatibility-anchor"></span>
<span id="inputs_5" class="compatibility-anchor"></span>
<span id="input-properties_4" class="compatibility-anchor"></span>
<span id="returns_5" class="compatibility-anchor"></span>
<span id="returns_5-typescript" class="compatibility-anchor"></span>
<span id="returns_5-net" class="compatibility-anchor"></span>
<span id="return-properties_4" class="compatibility-anchor"></span>
<span id="return-properties_4-typescript" class="compatibility-anchor"></span>
<span id="return-properties_4-net" class="compatibility-anchor"></span>
<span id="expected-results_5" class="compatibility-anchor"></span>
<span id="potential-errors_5" class="compatibility-anchor"></span>
<span id="example_5" class="compatibility-anchor"></span>
<span id="example_5-typescript" class="compatibility-anchor"></span>
<span id="example_5-net" class="compatibility-anchor"></span>

Permanently remove all Subscrio tables and their data. If an administrator passphrase hash is stored, a matching passphrase is required. Without a stored hash, this operation does not require a passphrase.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
dropSchema(adminPassphrase?: string): Promise<void>
```

</div>

**Parameters**

- `adminPassphrase`: Optional passphrase. The argument takes precedence over the constructor setting; when omitted, the configured passphrase is used.

**Returns** No returned value.

**Example**

```typescript
// Run only against a disposable database.
await subscrio.dropSchema(process.env.ADMIN_PASSPHRASE);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: A stored passphrase hash exists and the supplied passphrase is missing or incorrect.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DropSchemaAsync(string? adminPassphrase)
```

</div>

**Parameters**

- `adminPassphrase`: Optional passphrase. The argument takes precedence over the constructor setting; when omitted, the configured passphrase is used.

**Returns** No returned value.

**Example**

```csharp
// Run only against a disposable database.
await subscrio.DropSchemaAsync(
    Environment.GetEnvironmentVariable("ADMIN_PASSPHRASE"));
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: A stored passphrase hash exists and the supplied passphrase is missing or incorrect.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### close { #close data-method-ts="close" data-method-net="Dispose" }

<span id="description_6" class="compatibility-anchor"></span>
<span id="signature_6" class="compatibility-anchor"></span>
<span id="signature_6-typescript" class="compatibility-anchor"></span>
<span id="signature_6-net" class="compatibility-anchor"></span>
<span id="inputs_6" class="compatibility-anchor"></span>
<span id="input-properties_5" class="compatibility-anchor"></span>
<span id="returns_6" class="compatibility-anchor"></span>
<span id="returns_6-typescript" class="compatibility-anchor"></span>
<span id="returns_6-net" class="compatibility-anchor"></span>
<span id="return-properties_5" class="compatibility-anchor"></span>
<span id="return-properties_5-typescript" class="compatibility-anchor"></span>
<span id="return-properties_5-net" class="compatibility-anchor"></span>
<span id="expected-results_6" class="compatibility-anchor"></span>
<span id="potential-errors_6" class="compatibility-anchor"></span>
<span id="example_6" class="compatibility-anchor"></span>
<span id="example_6-typescript" class="compatibility-anchor"></span>
<span id="example_6-net" class="compatibility-anchor"></span>
<span id="supported-public-surface" class="compatibility-anchor"></span>
<span id="additional-reference-guides" class="compatibility-anchor"></span>
<span id="add-ons-metering-and-credits" class="compatibility-anchor"></span>

Release database resources when the application finishes using Subscrio. TypeScript closes the shared PostgreSQL pool. In .NET, `using` and dependency-injection scopes can dispose the instance automatically.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
close(): Promise<void>
```

</div>

**Returns** No returned value.

**Example**

```typescript
await subscrio.close();
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
void Dispose()
```

</div>

**Returns** No returned value.

**Example**

```csharp
subscrio.Dispose();
```

</div>

</div>

## Data types

For input types, Required means the caller must supply the property. Defaults apply when an optional property is omitted.

<div class="data-type" markdown="1">

### SubscrioConfig { #SubscrioConfig }

<span id="configuration-object" class="compatibility-anchor"></span>

Constructor configuration. Only the database connection is required.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `database` | <code><a href="#DatabaseConfig">DatabaseConfig</a></code> | Yes | None | Database connection and provider settings. |
| `adminPassphrase` | <code>string</code> | No | None | Default passphrase for schema installation and deletion. |
| `stripe` | <code><a href="#StripeConfig">StripeConfig</a></code> | No | None | Stripe API and webhook credentials. |
| `logging` | <code><a href="#LoggingConfig">LoggingConfig</a></code> | No | None | Reserved logging configuration; currently does not control emitted diagnostics. |
| `initialConfig` | <code><a href="#InitialConfigSync">InitialConfigSync</a></code> | No | None | Catalog configuration applied by the initial-config method. |
| `hooks` | <code><a href="../hooks/#config-time-registration">HooksConfig</a></code> | No | None | Hook handlers registered during construction. See [Hooks](hooks.md). |
| `clock` | <code><a href="#Clock">Clock</a></code> | No | System clock | Clock used for usage periods, credits, and time-based decisions. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Database` | <code><a href="#DatabaseConfig">DatabaseConfig</a></code> | Yes | None | Database connection and provider settings. |
| `AdminPassphrase` | <code>string?</code> | No | null | Default passphrase for schema installation and deletion. |
| `Stripe` | <code><a href="#StripeConfig">StripeConfig</a>?</code> | No | null | Stripe API and webhook credentials. |
| `Logging` | <code><a href="#LoggingConfig">LoggingConfig</a>?</code> | No | null | Reserved logging configuration; currently does not control emitted diagnostics. |
| `InitialConfig` | <code><a href="#InitialConfigSync">InitialConfigOptions</a>?</code> | No | null | Catalog configuration applied by the initial-config method. |
| `Hooks` | <code><a href="../hooks/#config-time-registration">SubscrioHooksOptions</a>?</code> | No | null | Hook handlers registered during construction. See [Hooks](hooks.md). |
| `Clock` | <code><a href="#Clock">IClock</a>?</code> | No | System clock | Clock used for usage periods, credits, and time-based decisions. |

</div>

</div>

<div class="data-type" markdown="1">

### DatabaseConfig { #DatabaseConfig }

<span id="database-object" class="compatibility-anchor"></span>

Database connection settings. In TypeScript, this is the nested `SubscrioConfig["database"]` object.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `connectionString` | `string` | Yes | None | PostgreSQL connection URI. |
| `ssl` | `boolean` | No | Unset | When true, enables TLS and certificate verification. |
| `poolSize` | `number` | No | 10 | Maximum PostgreSQL pool size. |
| `databaseType` | <code>&#x27;postgres&#x27; &#124; &#x27;sqlserver&#x27;</code> | No | Detected | Dialect hint; selecting SQL Server throws at construction. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `ConnectionString` | `string` | Yes | None | PostgreSQL or SQL Server provider connection string. |
| `Ssl` | `bool` | No | false | Enables the provider SSL settings. |
| `PoolSize` | `int` | No | 10 | Configuration hint; currently not applied by the .NET initializer. Configure pooling in the connection string. |
| `DatabaseType` | `DatabaseType` | No | PostgreSQL | Provider: PostgreSQL or SqlServer, from `Subscrio.Core.Domain.ValueObjects`. |

</div>

</div>

<div class="data-type" markdown="1">

### StripeConfig { #StripeConfig }

<span id="stripe-object" class="compatibility-anchor"></span>

Optional Stripe configuration. See [Stripe Integration](stripe-integration.md) for event verification and checkout.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `secretKey` | `string` | Yes | None | Secret API key. |
| `webhookSecret` | `string` | No | None | Endpoint signing secret required to verify incoming webhooks. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `SecretKey` | `string` | Yes | None | Secret API key. |
| `WebhookSecret` | `string?` | No | null | Endpoint signing secret required by `ConstructStripeEvent`. |

</div>

</div>

<div class="data-type" markdown="1">

### LoggingConfig { #LoggingConfig }

<span id="logging-object" class="compatibility-anchor"></span>

Reserved logging settings. The current library does not emit or filter diagnostics using this configuration.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `level` | <code>&#x27;debug&#x27; &#124; &#x27;info&#x27; &#124; &#x27;warn&#x27; &#124; &#x27;error&#x27;</code> | Yes | None | Reserved level value. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Level` | `LogLevel` | No | Info | Debug, Info, Warn, or Error. |

</div>

</div>

<div class="data-type" markdown="1">

### InitialConfigSync { #InitialConfigSync data-method-ts="InitialConfigSync" data-method-net="InitialConfigOptions" }

<span id="initialconfig-initialconfig" class="compatibility-anchor"></span>

Configuration applied by the initial-config method after schema setup. In TypeScript, supply either the file variant or the JSON variant.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `type` | <code>&#x27;file&#x27; &#124; &#x27;json&#x27;</code> | Yes | None | Selects a local file or an in-memory catalog. |
| `filePath` | `string` | When file | None | JSON file to read. |
| `config` | [ConfigSyncDto](config-sync.md#ConfigSyncDto) | When json | None | Catalog to synchronize. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `FilePath` | `string?` | No | null | JSON file to read; takes precedence when nonblank. |
| `Config` | [ConfigSyncDto](config-sync.md#ConfigSyncDto) | No | null | Catalog to synchronize when no file path is supplied. |

</div>

</div>

<div class="data-type" markdown="1">

### Clock { #Clock data-method-ts="Clock" data-method-net="IClock" }

Optional time provider for deterministic application behavior and tests.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `now()` | `() => Date` | Yes | None | Returns the current time. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `UtcNow` | `DateTime` | Yes | None | Read-only current UTC time, from `Subscrio.Core.Application.DTOs.IClock`. |

</div>

</div>

<div class="data-type" markdown="1">

### Subscrio objects { #reference-index }

The instance exposes the following objects. Use these public access paths rather than constructing their implementation classes.

<div class="language-content" data-lang="ts" markdown="1">

| Property | Purpose |
| --- | --- |
| [`features`](features.md) | Define reusable features. |
| [`addons`](addons.md) | Define optional subscription packages. |
| [`products`](products.md) | Group features and plans. |
| [`plans`](plans.md) | Define subscription offerings and feature values. |
| [`billingCycles`](billing-cycles.md) | Define billing cadence. |
| [`customers`](customers.md) | Manage customer records. |
| [`subscriptions`](subscriptions.md) | Manage subscriptions, overrides, and add-on attachments. |
| [`featureChecker`](feature-checker.md) | Resolve feature access. |
| [`metering`](metering.md) | Record usage against feature limits. |
| [`credits`](credits.md) | Manage credit wallets and spending. |
| [`hooks`](hooks.md) | Register operation callbacks. |
| [`configSync`](config-sync.md) | Synchronize catalog configuration. |
| [`stripe`](stripe-integration.md) | Process Stripe events and create checkout sessions. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Purpose |
| --- | --- |
| [`Features`](features.md) | Define reusable features. |
| [`Addons`](addons.md) | Define optional subscription packages. |
| [`Products`](products.md) | Group features and plans. |
| [`Plans`](plans.md) | Define subscription offerings and feature values. |
| [`BillingCycles`](billing-cycles.md) | Define billing cadence. |
| [`Customers`](customers.md) | Manage customer records. |
| [`Subscriptions`](subscriptions.md) | Manage subscriptions, overrides, and add-on attachments. |
| [`FeatureChecker`](feature-checker.md) | Resolve feature access. |
| [`Metering`](metering.md) | Record usage against feature limits. |
| [`Credits`](credits.md) | Manage credit wallets and spending. |
| [`Hooks`](hooks.md) | Register operation callbacks. |
| [`ConfigSync`](config-sync.md) | Synchronize catalog configuration. |
| [`Stripe`](stripe-integration.md) | Process Stripe events and create checkout sessions. |

</div>

</div>

The supported application surface includes these objects, their configuration and DTO types, public errors, hooks, and related enums. Lower-level exports such as repositories and persistence records are not stable application contracts. The supported TypeScript conversion helper is documented under [Feature Checker](feature-checker.md).

## Related guides

- [Getting Started](getting-started.md): installation and application setup.
- [How Subscrio Works](entitlements-guide.md): choose between overrides, add-ons, usage limits, and credits.
- [Schema Upgrade](upgrading-entitlements.md): migrate existing databases.
- [Extending Subscrio](how-to-extend.md): integrate additional packages.
