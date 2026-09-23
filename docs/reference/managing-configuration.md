---
title: Managing Configuration
description: Synchronize and export catalog definitions while preserving customer and accounting history.
---

# Managing Configuration

Configuration sync creates or updates a catalog from one object or JSON file. Use stable keys and keep reviewed configuration in source control. It is an explicit import operation, not a background watcher or a database backup.

## Apply a catalog

This example uses its own keys and can run after [Getting Started](getting-started.md). It defines a product, plan, package, and monthly billing cycle:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
import type { ConfigSyncDto } from 'subscrio';

const config: ConfigSyncDto = {
  version: '1.0',
  features: [{ key: 'storage-gb', displayName: 'Storage', valueType: 'numeric', defaultValue: '0' }],
  products: [{
    key: 'archive', displayName: 'Archive', features: ['storage-gb'],
    featureResolution: { 'storage-gb': { addonRule: 'additive', subscriptionRule: 'most_generous' } },
    addons: [{ key: 'storage-pack', displayName: 'Extra storage', featureValues: { 'storage-gb': '10' } }],
    plans: [{
      key: 'archive-basic', displayName: 'Basic', featureValues: { 'storage-gb': '25' },
      billingCycles: [{ key: 'archive-monthly', displayName: 'Monthly', durationUnit: 'months', durationValue: 1 }]
    }]
  }]
};
const report = await subscrio.configSync.syncFromJson(config);
if (report.errors.length) throw new Error(JSON.stringify(report.errors));
console.log(report);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var config = new ConfigSyncDto(
    Version: "1.0",
    Features: [new FeatureConfig(Key: "storage-gb", DisplayName: "Storage", ValueType: "numeric", DefaultValue: "0")],
    Products: [new ProductConfig(
        Key: "archive", DisplayName: "Archive", Features: ["storage-gb"],
        FeatureResolution: new() { ["storage-gb"] = new(AddonRule: "additive", SubscriptionRule: "most_generous") },
        Addons: [new AddonConfig(Key: "storage-pack", DisplayName: "Extra storage", FeatureValues: new() { ["storage-gb"] = "10" })],
        Plans: [new PlanConfig(
            Key: "archive-basic", DisplayName: "Basic", FeatureValues: new() { ["storage-gb"] = "25" },
            BillingCycles: [new BillingCycleConfig(
                Key: "archive-monthly", DisplayName: "Monthly", DurationUnit: "months", DurationValue: 1)])])]);
var report = await subscrio.ConfigSync.SyncFromJsonAsync(config);
if (report.Errors.Count > 0) throw new InvalidOperationException(string.Join(", ", report.Errors));
Console.WriteLine(report);
```

</div>

Use `syncFromFile` / `SyncFromFileAsync` for a UTF-8 JSON file. In TypeScript, `features` must appear before `products` in the file text; .NET does not impose that property order. When exporting .NET objects for the shared JSON format, use camelCase property names.

Initial configuration passed to the constructor is not applied automatically. Install or migrate the schema, then call the initial-sync method explicitly.

## Understand what sync replaces

Omitting an entity from the configuration leaves that entity unchanged. Including an entity is more specific than a generic partial update: supplied relationship collections can replace existing relationships.

| Configuration input | Effect |
| --- | --- |
| Product feature list | Replaces the product's associated features when supplied. |
| Plan feature-value map | Replaces the plan's configured values when supplied. |
| Add-on feature-value map | Replaces the package's contributions when supplied. |
| Plan credit grants | Replaces that plan's rules when supplied. |
| Feature-level credit consumption rules | Replaces that feature's rules when supplied. |
| Root credit consumption rules | Replaces rules across the catalog, including features outside this import's feature list. |
| Subscription override list | Applies the named changes; omitted overrides remain. |
| Included plan without an expiration-transition target | Clears its existing target. Omit the whole plan to leave it untouched. |

An empty supplied collection can remove all relationships in its scope. Do not send a small root consumption-rule list unless it represents the complete intended set. Defining the same feature/currency cost at both root and feature level is rejected.

Explicit archive flags change catalog status. Plans, billing cycles, and add-ons omitted from their parent lists are retained; these lists do not delete the unlisted entities. See [Configuration Sync](config-sync.md) for each input field.

## Treat the report as part of the result

Some validation failures throw before changes begin. Later entity failures can appear in the report after earlier writes have succeeded. Synchronization is not a transaction for the entire configuration and has no dry-run mode.

Check report errors, inspect the affected records, and fix the input before retrying. Existing usage and credit activity may prevent a requested feature or rule change. Plan-rule updates can also settle due grants, so importing catalog configuration can have accounting effects.

## Export definitions and selected overrides

The following exports all catalog definitions and only Acme's requested subscription overrides:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const config = await subscrio.configSync.exportConfig(['acme-starter']);
console.log(JSON.stringify(config, null, 2));
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var config = await subscrio.ConfigSync.ExportConfigAsync(["acme-starter"]);
Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(config,
    new System.Text.Json.JsonSerializerOptions
    {
        PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
        WriteIndented = true
    }));
```

</div>

The export includes archived catalog entries, associations, resolution rules, add-ons, metering settings, and credit rules. It excludes customer records, subscription lifecycle data, attached add-ons, usage events, credit balances, and ledger history. Requested subscriptions must already exist when their overrides are imported.

A catalog export is not a point-in-time database snapshot. Use a database backup for recovery, and review environment-specific Stripe price IDs before importing into another environment. See [Schema Upgrade](upgrading-entitlements.md) for database deployment and rollback boundaries.
