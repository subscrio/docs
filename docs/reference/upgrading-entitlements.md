---
title: Schema Upgrade
description: Upgrade an existing database and verify catalog, usage, and credit behavior against the current library.
---

# Schema Upgrade

The current core schema version is `1.4.0`. New installations create the current schema. Existing installations apply pending migrations through the library.

<span id="upgrade-the-entitlement-schema"></span>
<span id="version-sequence"></span>
<span id="commands"></span>
<span id="rollback-and-operational-boundaries"></span>

## What changes

| Version | Schema additions |
| --- | --- |
| 1.2.0 | Add-on definitions, feature contributions, and subscription attachments; resolution settings on product-feature associations; timed-override expiration. |
| 1.3.0 | Meter configuration, usage balances, and accepted events with retry keys and response snapshots. |
| 1.4.0 | Credit currencies, plan grants, feature costs, wallets, grants, operations, ledger entries, and grant scheduling state. |

These changes add fourteen tables under `subscrio`. Original records and stored overrides remain. Existing product-feature associations preserve their earlier replacement behavior; migration does not opt them into additive packages. Configure [feature resolution](feature-resolution.md) explicitly when introducing those packages.

Migrations do not backfill usage events or historical credit grants. Later accounting reconciliation can issue due grants under configured rules, so review those rules and subscription dates before enabling it.

## Prepare the deployment

Back up the database and verify recovery against a restored copy. Check that every application and worker sharing it uses a compatible library. TypeScript's public database path uses PostgreSQL; .NET supports PostgreSQL and SQL Server. Test the provider your application actually runs.

Run schema changes as a controlled deployment step before starting writers that depend on them. Keep credentials in your application's private configuration. A database newer than the running library is rejected; do not use an older installer as a downgrade tool.

## Apply pending migrations

Use an initialized instance connected to the intended database:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const before = await subscrio.verifySchema();
if (before === null) throw new Error('Install the schema for a new database first');
const applied = await subscrio.migrate();
const after = await subscrio.verifySchema();
console.log({ before, applied, after });
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var before = await subscrio.VerifySchemaAsync();
if (before is null) throw new InvalidOperationException("Install the schema for a new database first");
var applied = await subscrio.MigrateAsync();
var after = await subscrio.VerifySchemaAsync();
Console.WriteLine($"{before} -> {after}; migrations applied: {applied}");
```

</div>

The current target returned afterward is `1.4.0`. Running migration again applies no already-recorded versions. Migration uses a database lock and transaction so competing migrators serialize and a failure does not advance a partially applied schema.

The TypeScript package also includes the `subscrio-migrate` command. Set `DATABASE_URL` through its standard configuration and run `npx subscrio-migrate`. In the library source checkout, `npm run migrate` runs the source command. The .NET workflow uses the library method above.

Audit-log and payments extensions have separate install, verify, and migrate methods. Upgrading core does not perform their schema maintenance.

## Verify the result

1. Confirm the stored version and rerun migration to check that nothing remains pending.
2. Compare representative existing customer feature results before and after migration, including overrides and multiple subscriptions.
3. On disposable test records, attach an add-on and verify its resolved value. Test a timed override before and after its expiry.
4. Record a usage event, replay its key, and verify that the counter increased once. Test a denied hard-limit report.
5. Grant and spend credits, replay the operation, and inspect allocations, balances, and ledger entries. Exercise scheduled grants and expiry with your application clock.
6. If used, verify Stripe mappings and extension writes independently. Recheck application permissions for the new tables.

These checks complement provider-specific migration tests. A successful version query alone does not verify the application's packaging and accounting rules.

## Recovery and operational limits

There is no automatic down-migration. Restore a coordinated database/application backup when a rollback is required. For business corrections after accounting begins, use supported adjustments and configuration changes that preserve history.

Do not reset a deployed database by dropping tables. Schema removal is destructive and may require the configured administrator passphrase. The tables belong to `subscrio`, not `public`.

Plan-rule changes and subscription updates can settle due grants. Monitor scheduled processing failures, including the 240-window catch-up limit. See [Credit Wallet Workflows](credit-wallet-workflows.md) and [Relationships](relationships.md) for retained history and deletion constraints.
