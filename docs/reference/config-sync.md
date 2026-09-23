---
title: Configuration Sync
description: Apply a declarative catalog and accounting configuration.
reference_format: true
---

# Configuration Sync

## Purpose

<span id="method-reference" class="compatibility-anchor"></span>

<span id="configuration-sync-service-reference" class="compatibility-anchor"></span>
<span id="overview" class="compatibility-anchor"></span>
<span id="quick-start" class="compatibility-anchor"></span>
<span id="option-1-sync-from-json-file" class="compatibility-anchor"></span>
<span id="option-2-sync-from-programmatic-config" class="compatibility-anchor"></span>
<span id="option-3-initial-config-at-construction" class="compatibility-anchor"></span>
<span id="json-schema" class="compatibility-anchor"></span>
<span id="root-configuration" class="compatibility-anchor"></span>
<span id="feature-configuration" class="compatibility-anchor"></span>
<span id="product-configuration" class="compatibility-anchor"></span>
<span id="plan-configuration" class="compatibility-anchor"></span>
<span id="billing-cycle-configuration" class="compatibility-anchor"></span>
<span id="complete-example" class="compatibility-anchor"></span>
<span id="sync-behavior" class="compatibility-anchor"></span>
<span id="create-operations" class="compatibility-anchor"></span>
<span id="update-operations" class="compatibility-anchor"></span>
<span id="archive-operations" class="compatibility-anchor"></span>
<span id="association-sync" class="compatibility-anchor"></span>
<span id="ignore-behavior" class="compatibility-anchor"></span>
<span id="sync-report" class="compatibility-anchor"></span>
<span id="validation" class="compatibility-anchor"></span>
<span id="schema-validation" class="compatibility-anchor"></span>
<span id="json-property-order" class="compatibility-anchor"></span>
<span id="duplicate-key-validation" class="compatibility-anchor"></span>
<span id="reference-validation" class="compatibility-anchor"></span>
<span id="feature-value-validation" class="compatibility-anchor"></span>
<span id="error-handling" class="compatibility-anchor"></span>
<span id="validation-errors" class="compatibility-anchor"></span>
<span id="sync-errors" class="compatibility-anchor"></span>
<span id="partial-completion" class="compatibility-anchor"></span>
<span id="best-practices" class="compatibility-anchor"></span>
<span id="1-version-control-your-config" class="compatibility-anchor"></span>
<span id="2-use-programmatic-config-for-dynamic-generation" class="compatibility-anchor"></span>
<span id="3-validate-before-production" class="compatibility-anchor"></span>
<span id="4-handle-errors-gracefully" class="compatibility-anchor"></span>
<span id="5-use-partial-syncs" class="compatibility-anchor"></span>
<span id="6-archive-instead-of-delete" class="compatibility-anchor"></span>
<span id="common-patterns" class="compatibility-anchor"></span>
<span id="toggle-features" class="compatibility-anchor"></span>
<span id="tiered-plans" class="compatibility-anchor"></span>
<span id="limitations" class="compatibility-anchor"></span>
<span id="troubleshooting" class="compatibility-anchor"></span>
<span id="features-must-appear-before-products-error" class="compatibility-anchor"></span>
<span id="feature-key-x-referenced-in-product-does-not-exist-error" class="compatibility-anchor"></span>
<span id="invalid-feature-value-for-numeric-type-error" class="compatibility-anchor"></span>
<span id="sync-report-shows-errors" class="compatibility-anchor"></span>

Configuration Sync creates or updates the catalog from a file or object. It supports features, products, plans, billing cycles, add-ons, credit rules, and overrides on existing subscriptions. It does not import usage events or wallet balances.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const configSync = subscrio.configSync;
```

</div>
<div class="language-content" data-lang="net" markdown="1">

```csharp
var configSync = subscrio.ConfigSync;
```

</div>

For construction-time configuration, see [Subscrio](core-overview.md#runinitialconfigsync). Sync must be invoked explicitly; merely supplying configuration does not apply it.

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`syncFromFile`](#syncfromfile) | Loads a JSON file and applies its configuration. |
| [`syncFromJson`](#syncfromjson) | Applies a configuration object and returns a report. |
| [`exportConfig`](#exportconfig) | Exports the catalog and optionally selected subscription overrides. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`SyncFromFileAsync`](#syncfromfile) | Loads a JSON file and applies its configuration. |
| [`SyncFromJsonAsync`](#syncfromjson) | Applies a configuration object and returns a report. |
| [`ExportConfigAsync`](#exportconfig) | Exports the catalog and optionally selected subscription overrides. |

</div>

## Method details

<div class="method-entry" markdown="1">

### syncFromFile { #syncfromfile data-method-ts="syncFromFile" data-method-net="SyncFromFileAsync" }

<span id="description" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="return-properties" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="return-properties_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>

Read a UTF-8 JSON file, validate it, and apply the same synchronization as the object method. TypeScript requires features to occur before products in the file text; .NET does not enforce property order.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
syncFromFile(filePath: string): Promise<ConfigSyncReport>
```

</div>

**Parameters**

- `filePath`: File containing [ConfigSyncDto](#ConfigSyncDto).

**Returns** <code><a href="#ConfigSyncReport">ConfigSyncReport</a></code>: Counts, changes, warnings, and per-entity failures.

**Example**

```typescript
// catalog.json contains a ConfigSyncDto document.
const report = await subscrio.configSync.syncFromFile('./catalog.json');
console.log(report.errors);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: Reading, parsing, validation, or an uncaught sync operation fails.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<ConfigSyncReport> SyncFromFileAsync(string filePath)
```

</div>

**Parameters**

- `filePath`: File containing [ConfigSyncDto](#ConfigSyncDto).

**Returns** <code><a href="#ConfigSyncReport">ConfigSyncReport</a></code>: Counts, changes, warnings, and per-entity failures.

**Example**

```csharp
// catalog.json contains a ConfigSyncDto document.
var report = await subscrio.ConfigSync.SyncFromFileAsync("./catalog.json");
Console.WriteLine(report.Errors.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: Reading, parsing, validation, or an uncaught sync operation fails.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### syncFromJson { #syncfromjson data-method-ts="syncFromJson" data-method-net="SyncFromJsonAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="return-properties_2" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="return-properties_3" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>
<span id="see-also" class="compatibility-anchor"></span>
<span id="add-on-metering-credit-and-override-configuration" class="compatibility-anchor"></span>
<span id="description_2" class="compatibility-anchor"></span>
<span id="signature_4" class="compatibility-anchor"></span>
<span id="inputs_4" class="compatibility-anchor"></span>
<span id="returns_4" class="compatibility-anchor"></span>
<span id="return-properties_4" class="compatibility-anchor"></span>
<span id="example_4" class="compatibility-anchor"></span>
<span id="signature_5" class="compatibility-anchor"></span>
<span id="inputs_5" class="compatibility-anchor"></span>
<span id="returns_5" class="compatibility-anchor"></span>
<span id="return-properties_5" class="compatibility-anchor"></span>
<span id="example_5" class="compatibility-anchor"></span>
<span id="expected-results_2" class="compatibility-anchor"></span>
<span id="potential-errors_2" class="compatibility-anchor"></span>

Validate configuration and references, then apply changes through the public library operations. Listed entities are created or updated; omitted entities remain untouched. An explicit archive flag changes status. Supplied relationship collections can remove associations or rules, as described on their fields.

The entire sync is not one transaction. Entity failures are collected and processing continues, so inspect the report even when the call succeeds. Earlier successful writes remain if later work fails.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
syncFromJson(config: ConfigSyncDto): Promise<ConfigSyncReport>
```

</div>

**Parameters**

- `config`: [ConfigSyncDto](#ConfigSyncDto). This is declarative synchronization, not the generic partial-update convention.

**Returns** <code><a href="#ConfigSyncReport">ConfigSyncReport</a></code>: Catalog counts and configuration changes, including partial failures.

**Example**

```typescript
const report = await subscrio.configSync.syncFromJson({
  version: '1',
  features: [{ key: 'max-seats', displayName: 'Seats', valueType: 'numeric', defaultValue: '1' }],
  products: [{
    key: 'saas', displayName: 'SaaS', features: ['max-seats'],
    plans: [{
      key: 'pro', displayName: 'Pro', featureValues: { 'max-seats': '20' },
      billingCycles: [{ key: 'pro-monthly', displayName: 'Monthly', durationUnit: 'months', durationValue: 1 }]
    }]
  }]
});
console.log(report.created, report.errors);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ZodError`: The TypeScript schema, duplicate keys, or catalog references are invalid.
- `ValidationError`: Accounting configuration or cross-references fail preflight validation.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<ConfigSyncReport> SyncFromJsonAsync(ConfigSyncDto config)
```

</div>

**Parameters**

- `config`: [ConfigSyncDto](#ConfigSyncDto). This is declarative synchronization, not the generic partial-update convention.

**Returns** <code><a href="#ConfigSyncReport">ConfigSyncReport</a></code>: Catalog counts and configuration changes, including partial failures.

**Example**

```csharp
var report = await subscrio.ConfigSync.SyncFromJsonAsync(new ConfigSyncDto(
    Version: "1",
    Features: [new FeatureConfig("max-seats", "Seats", ValueType: "numeric", DefaultValue: "1")],
    Products: [new ProductConfig("saas", "SaaS",
        Features: ["max-seats"],
        Plans: [new PlanConfig("pro", "Pro",
            FeatureValues: new() { ["max-seats"] = "20" },
            BillingCycles: [new BillingCycleConfig("pro-monthly", "Monthly", DurationValue: 1, DurationUnit: "months")])])]
));
Console.WriteLine($"Created plans: {report.Created.Plans}, errors: {report.Errors.Count}");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: Accounting configuration or cross-references fail preflight validation.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### exportConfig { #exportconfig data-method-ts="exportConfig" data-method-net="ExportConfigAsync" }

Read catalog definitions, including archived entries, feature relationships, add-ons, metering settings, and credit rules, into a configuration object. Subscription overrides are included only for the keys you request. This export does not include customer records, subscription lifecycle data, add-on attachments, usage history, or credit balances and transactions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
exportConfig(subscriptionKeys?: string[]): Promise<ConfigSyncDto>
```

</div>

**Parameters**

- `subscriptionKeys`: Optional existing subscription keys whose overrides to include; defaults to an empty array.

**Returns** [ConfigSyncDto](#ConfigSyncDto): Catalog configuration that can be passed to `syncFromJson`.

**Example**

```typescript
const config = await subscrio.configSync.exportConfig();
console.log(config.products.length);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `Error`: A requested subscription does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<ConfigSyncDto> ExportConfigAsync(IEnumerable<string>? subscriptionKeys)
```

</div>

**Parameters**

- `subscriptionKeys`: Optional existing subscription keys whose overrides to include; null or an empty collection includes none.

**Returns** [ConfigSyncDto](#ConfigSyncDto): Catalog configuration that can be passed to `SyncFromJsonAsync`.

**Example**

```csharp
var config = await subscrio.ConfigSync.ExportConfigAsync();
Console.WriteLine(config.Products.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: A requested subscription does not exist.

</details>

</div>

</div>

## Data types

Required means an input must be supplied, or a returned property is guaranteed present. Nested keys inherit their parent product or plan; keys remain globally unique. Refer to the corresponding object page for field validation limits.

<div class="data-type" markdown="1">

### ConfigSyncDto { #ConfigSyncDto }

Root synchronization input.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `creditConsumptionRules` | <code><a href="#CreditConsumptionConfig">CreditConsumptionConfig</a>[] \| undefined</code> | No | None | When supplied at the root, replaces the complete set of feature/currency costs across the catalog. An empty array removes all costs. Do not duplicate a feature/currency pair in nested feature rules. |
| `creditCurrencies` | <code><a href="#CreditCurrencyConfig">CreditCurrencyConfig</a>[] \| undefined</code> | No | None | Currencies to create or update; omitted currencies remain unchanged. |
| `subscriptions` | <code><a href="#SubscriptionOverrideConfig">SubscriptionOverrideConfig</a>[] \| undefined</code> | No | None | Override changes for existing subscriptions only; this does not create subscriptions. |
| `version` | <code>string</code> | Yes | None | Configuration version label. Supply a nonempty string; no version-specific schema selection is performed. |
| `features` | <code>{ key: string; displayName: string; valueType: &quot;toggle&quot; \| &quot;numeric&quot; \| &quot;text&quot; \| &quot;metered&quot;; defaultValue: string; description?: string \| undefined; groupName?: string \| undefined; meteredConfig?: { resetPeriod: &quot;hourly&quot; \| &quot;daily&quot; \| &quot;weekly&quot; \| &quot;monthly&quot; \| &quot;yearly&quot; \| &quot;billing_period&quot;; enforcement: &quot;hard&quot; \| &quot;soft&quot;; aggregation: &quot;count&quot; \| &quot;sum&quot;; usageScope: &quot;customer&quot; \| &quot;subscription&quot;; } \| undefined; validator?: Record&lt;string, unknown&gt; \| undefined; metadata?: Record&lt;string, unknown&gt; \| undefined; creditConsumptionRules?: { currencyKey: string; creditsPerUnit: number; }[] \| undefined; archived?: boolean \| undefined; }[]</code> | Yes | None | Feature definitions. Product associations must refer to these keys in TypeScript. |
| `products` | <code>{ key: string; displayName: string; description?: string \| undefined; metadata?: Record&lt;string, unknown&gt; \| undefined; addons?: { key: string; displayName: string; description?: string \| undefined; compositionMode?: &quot;additive&quot; \| &quot;override&quot; \| undefined; priority?: number \| undefined; archived?: boolean \| undefined; metadata?: Record&lt;string, unknown&gt; \| undefined; featureValues?: Record&lt;string, string&gt; \| undefined; }[] \| undefined; featureResolution?: Record&lt;string, { addonRule?: &quot;additive&quot; \| &quot;most_generous&quot; \| &quot;override_wins&quot; \| undefined; subscriptionRule?: &quot;additive&quot; \| &quot;most_generous&quot; \| &quot;override_wins&quot; \| null \| undefined; }&gt; \| undefined; archived?: boolean \| undefined; features?: string[] \| undefined; plans?: { key: string; displayName: string; description?: string \| undefined; metadata?: Record&lt;string, unknown&gt; \| undefined; onExpireTransitionToBillingCycleKey?: string \| undefined; archived?: boolean \| undefined; creditGrants?: { currencyKey: string; amount: number; cadence: &quot;monthly&quot; \| &quot;yearly&quot; \| &quot;billing_period&quot; \| &quot;once&quot;; expiryPolicy?: &quot;none&quot; \| &quot;grant_period_end&quot; \| undefined; cancellationPolicy?: &quot;retain&quot; \| &quot;expire&quot; \| undefined; }[] \| undefined; featureValues?: Record&lt;string, string&gt; \| undefined; billingCycles?: { key: string; displayName: string; durationUnit: &quot;days&quot; \| &quot;weeks&quot; \| &quot;months&quot; \| &quot;years&quot; \| &quot;forever&quot;; description?: string \| undefined; durationValue?: number \| undefined; externalProductId?: string \| undefined; archived?: boolean \| undefined; }[] \| undefined; }[] \| undefined; }[]</code> | Yes | None | Products with nested plans and billing cycles. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Version` | <code>string</code> | Yes | None | Configuration version label. Supply a nonempty string; no version-specific schema selection is performed. |
| `Features` | <code>List&lt;<a href="#FeatureConfig">FeatureConfig</a>&gt;</code> | Yes | None | Feature definitions. Product associations must refer to these keys in TypeScript. |
| `Products` | <code>List&lt;<a href="#ProductConfig">ProductConfig</a>&gt;</code> | Yes | None | Products with nested plans and billing cycles. |
| `CreditCurrencies` | <code>List&lt;<a href="#CreditCurrencyConfig">CreditCurrencyConfig</a>&gt;?</code> | No | null | Currencies to create or update; omitted currencies remain unchanged. |
| `Subscriptions` | <code>List&lt;<a href="#SubscriptionOverrideConfig">SubscriptionOverrideConfig</a>&gt;?</code> | No | null | Override changes for existing subscriptions only; this does not create subscriptions. |
| `CreditConsumptionRules` | <code>List&lt;<a href="#CreditConsumptionConfig">CreditConsumptionConfig</a>&gt;?</code> | No | null | When supplied at the root, replaces the complete set of feature/currency costs across the catalog. An empty array removes all costs. Do not duplicate a feature/currency pair in nested feature rules. |

</div>

</div>

<div class="data-type" markdown="1">

### ConfigSyncReport { #ConfigSyncReport }

Synchronization outcome. TypeScript count, message, and details fields use the inline shapes documented below.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `created` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | New core catalog entities. |
| `updated` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | Changed core catalog entities. |
| `archived` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | Entities archived. |
| `unarchived` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | Entities restored. |
| `ignored` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | Database entities absent from configuration. |
| `errors` | <code><a href="#ConfigSyncError">ConfigSyncError</a>[]</code> | Yes | Not applicable | Failures recorded while applying individual changes. |
| `warnings` | <code><a href="#ConfigSyncWarning">ConfigSyncWarning</a>[]</code> | Yes | Not applicable | Nonfatal skipped references or values. |
| `details` | <code><a href="#AccountingSyncReport">AccountingSyncReport</a> \| undefined</code> | No | Not applicable | Detailed before/after accounting-configuration changes; may be absent. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Created` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | New core catalog entities. |
| `Updated` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | Changed core catalog entities. |
| `Archived` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | Entities archived. |
| `Unarchived` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | Entities restored. |
| `Ignored` | <code><a href="#ConfigSyncCounts">ConfigSyncCounts</a></code> | Yes | Not applicable | Database entities absent from configuration. |
| `Errors` | <code>List&lt;<a href="#ConfigSyncError">ConfigSyncError</a>&gt;</code> | Yes | Not applicable | Failures recorded while applying individual changes. |
| `Warnings` | <code>List&lt;<a href="#ConfigSyncWarning">ConfigSyncWarning</a>&gt;</code> | Yes | Not applicable | Nonfatal skipped references or values. |
| `Details` | <code><a href="#AccountingSyncReport">AccountingSyncReport</a>?</code> | Yes | Not applicable | Detailed before/after accounting-configuration changes; may be absent. |

</div>

</div>

<div class="data-type" markdown="1">

### FeatureConfig { #FeatureConfig }

Nested feature definition.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Stable identifier. |
| `displayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `valueType` | <code>&quot;toggle&quot; \| &quot;numeric&quot; \| &quot;text&quot; \| &quot;metered&quot;</code> | Yes | None | toggle, numeric, text, or metered. |
| `defaultValue` | <code>string</code> | Yes | None | String default matching the value type. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `groupName` | <code>string \| undefined</code> | No | None | Optional feature grouping label. |
| `meteredConfig` | <code><a href="../features/#MeteredFeatureConfigDto">MeteredFeatureConfigDto</a> \| undefined</code> | No | None | Complete [metering configuration](features.md#MeteredFeatureConfigDto); required only for metered features. |
| `validator` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Optional feature validator configuration. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application-defined metadata. |
| `creditConsumptionRules` | <code>Array&lt;{ currencyKey: string; creditsPerUnit: number }&gt; \| undefined</code> | No | None | When supplied, replaces costs for this feature; an empty array removes its costs. |
| `archived` | <code>boolean \| undefined</code> | No | None | true archives, false restores, omission preserves existing status. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `ValueType` | <code>string</code> | No | "toggle" | toggle, numeric, text, or metered. |
| `DefaultValue` | <code>string</code> | No | "false" | String default matching the value type. |
| `GroupName` | <code>string?</code> | No | null | Optional feature grouping label. |
| `Validator` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Optional feature validator configuration. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application-defined metadata. |
| `Archived` | <code>bool?</code> | No | null | true archives, false restores, omission preserves existing status. |
| `MeteredConfig` | <code><a href="../features/#MeteredFeatureConfigDto">MeteredFeatureConfigDto</a>?</code> | No | null | Complete [metering configuration](features.md#MeteredFeatureConfigDto); required only for metered features. |
| `CreditConsumptionRules` | <code>List&lt;<a href="../credits/#CreditConsumptionRuleDto">CreditConsumptionRuleDto</a>&gt;?</code> | No | null | When supplied, replaces costs for this feature; an empty array removes its costs. |

</div>

</div>

<div class="data-type" markdown="1">

### ProductConfig { #ProductConfig }

Nested product definition.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Stable identifier. |
| `displayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application-defined metadata. |
| `addons` | <code><a href="#AddonConfig">AddonConfig</a>[] \| undefined</code> | No | None | Add-on definitions for this product; omitted add-ons are retained. |
| `featureResolution` | <code>Record&lt;string, <a href="../products/#FeatureResolutionOptions">FeatureResolutionOptions</a>&gt; \| undefined</code> | No | None | Feature-key map of [resolution options](products.md#FeatureResolutionOptions) applied to associated features. Omitted entries preserve current rules. |
| `archived` | <code>boolean \| undefined</code> | No | None | true archives, false restores, omission preserves existing status. |
| `features` | <code>string[] \| undefined</code> | No | None | When supplied, replaces product-feature associations; an empty array dissociates all features. |
| `plans` | <code><a href="#PlanConfig">PlanConfig</a>[] \| undefined</code> | No | None | Plans to create or update; omitted plans are retained. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application-defined metadata. |
| `Archived` | <code>bool?</code> | No | null | true archives, false restores, omission preserves existing status. |
| `Features` | <code>List&lt;string&gt;?</code> | No | null | When supplied, replaces product-feature associations; an empty array dissociates all features. |
| `Plans` | <code>List&lt;<a href="#PlanConfig">PlanConfig</a>&gt;?</code> | No | null | Plans to create or update; omitted plans are retained. |
| `Addons` | <code>List&lt;<a href="#AddonConfig">AddonConfig</a>&gt;?</code> | No | null | Add-on definitions for this product; omitted add-ons are retained. |
| `FeatureResolution` | <code>Dictionary&lt;string, <a href="../products/#FeatureResolutionOptions">FeatureResolutionOptions</a>&gt;?</code> | No | null | Feature-key map of [resolution options](products.md#FeatureResolutionOptions) applied to associated features. Omitted entries preserve current rules. |

</div>

</div>

<div class="data-type" markdown="1">

### PlanConfig { #PlanConfig }

Nested plan definition.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Stable identifier. |
| `displayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application-defined metadata. |
| `onExpireTransitionToBillingCycleKey` | <code>string \| undefined</code> | No | None | Expiration-transition target; see [PlanConfig](#PlanConfig) details below. |
| `archived` | <code>boolean \| undefined</code> | No | None | true archives, false restores, omission preserves existing status. |
| `creditGrants` | <code>Array&lt;{ currencyKey: string; amount: number; cadence: &quot;once&quot; \| &quot;monthly&quot; \| &quot;yearly&quot; \| &quot;billing_period&quot;; expiryPolicy?: &quot;none&quot; \| &quot;grant_period_end&quot;; cancellationPolicy?: &quot;retain&quot; \| &quot;expire&quot; }&gt; \| undefined</code> | No | None | When supplied, replaces active currency grant rules for this plan. An empty array deactivates them; issued grants remain. |
| `featureValues` | <code>Record&lt;string, string&gt; \| undefined</code> | No | None | When supplied, replaces plan feature values; an empty map removes all plan values. |
| `billingCycles` | <code><a href="#BillingCycleConfig">BillingCycleConfig</a>[] \| undefined</code> | No | None | Billing cycles to create or update; omitted cycles are retained. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `OnExpireTransitionToBillingCycleKey` | <code>string?</code> | No | null | Expiration-transition target; see [PlanConfig](#PlanConfig) details below. |
| `FeatureValues` | <code>Dictionary&lt;string, string&gt;?</code> | No | null | When supplied, replaces plan feature values; an empty map removes all plan values. |
| `BillingCycles` | <code>List&lt;<a href="#BillingCycleConfig">BillingCycleConfig</a>&gt;?</code> | No | null | Billing cycles to create or update; omitted cycles are retained. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application-defined metadata. |
| `Archived` | <code>bool?</code> | No | null | true archives, false restores, omission preserves existing status. |
| `CreditGrants` | <code>List&lt;<a href="../credits/#PlanCreditGrantDto">PlanCreditGrantDto</a>&gt;?</code> | No | null | When supplied, replaces active currency grant rules for this plan. An empty array deactivates them; issued grants remain. |

</div>

</div>

Transition targets must belong to the same product. TypeScript validates that the target is present in this configuration's nested billing cycles. When an existing plan is included without a transition target, synchronization clears its saved target. Include the target to preserve it; omitting the plan entirely leaves it unchanged.

<div class="data-type" markdown="1">

### BillingCycleConfig { #BillingCycleConfig }

Nested billingcycle definition.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Stable identifier. |
| `displayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `durationUnit` | <code>&quot;days&quot; \| &quot;weeks&quot; \| &quot;months&quot; \| &quot;years&quot; \| &quot;forever&quot;</code> | Yes | None | days, weeks, months, years, or forever. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `durationValue` | <code>number \| undefined</code> | No | None | Positive count required for a finite duration; omit for forever. |
| `externalProductId` | <code>string \| undefined</code> | No | None | External payment-provider price identifier. |
| `archived` | <code>boolean \| undefined</code> | No | None | true archives, false restores, omission preserves existing status. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `DurationValue` | <code>int?</code> | No | null | Positive count required for a finite duration; omit for forever. |
| `DurationUnit` | <code>string</code> | No | "days" | days, weeks, months, years, or forever. |
| `ExternalProductId` | <code>string?</code> | No | null | External payment-provider price identifier. |
| `Archived` | <code>bool?</code> | No | null | true archives, false restores, omission preserves existing status. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditCurrencyConfig { #CreditCurrencyConfig }

Currency input; TypeScript uses an inline shape.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Currency key. |
| `displayName` | <code>string</code> | Yes | None | Nonblank label. |
| `archived` | <code>boolean</code> | No | None | true archives, false restores, omission preserves existing status. |
| `metadata` | <code>Record&lt;string, unknown&gt;</code> | No | None | Replacement application metadata. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Currency key. |
| `DisplayName` | <code>string</code> | Yes | None | Nonblank label. |
| `Archived` | <code>bool?</code> | No | null | true archives, false restores, omission preserves existing status. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Replacement application metadata. |

</div>

</div>

<div class="data-type" markdown="1">

### AddonConfig { #AddonConfig }

Add-on input; TypeScript uses an inline shape and the parent supplies the product key.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Add-on key. |
| `displayName` | <code>string</code> | Yes | None | Nonblank label. |
| `description` | <code>string</code> | No | None | Optional description. |
| `compositionMode` | <code>&quot;additive&quot; \| &quot;override&quot;</code> | No | None | How the add-on contributes; additive on creation when omitted. |
| `priority` | <code>number</code> | No | None | Replacement priority, lower first; defaults to zero on creation. |
| `archived` | <code>boolean</code> | No | None | true archives, false restores, omission preserves existing status. |
| `metadata` | <code>Record&lt;string, unknown&gt;</code> | No | None | Replacement application metadata. |
| `featureValues` | <code>Record&lt;string, string&gt;</code> | No | None | Supplied feature-key/value map replaces the existing map; an empty map clears all stored contributions. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Add-on key. |
| `DisplayName` | <code>string</code> | Yes | None | Nonblank label. |
| `Description` | <code>string?</code> | No | null | Optional description. |
| `CompositionMode` | <code>string?</code> | No | null | How the add-on contributes; additive on creation when omitted. |
| `Priority` | <code>int?</code> | No | null | Replacement priority, lower first; defaults to zero on creation. |
| `Archived` | <code>bool?</code> | No | null | true archives, false restores, omission preserves existing status. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Replacement application metadata. |
| `FeatureValues` | <code>Dictionary&lt;string, string&gt;?</code> | No | null | Supplied feature-key/value map replaces the existing map; an empty map clears all stored contributions. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditConsumptionConfig { #CreditConsumptionConfig }

Root feature cost rule; TypeScript uses an inline shape.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `featureKey` | <code>string</code> | Yes | None | Non-metered feature key. |
| `currencyKey` | <code>string</code> | Yes | None | Active credit currency key. |
| `creditsPerUnit` | <code>number</code> | Yes | None | Positive safe integer cost per action unit. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `FeatureKey` | <code>string</code> | Yes | None | Non-metered feature key. |
| `CurrencyKey` | <code>string</code> | Yes | None | Active credit currency key. |
| `CreditsPerUnit` | <code>long</code> | Yes | None | Positive safe integer cost per action unit. |

</div>

</div>

<div class="data-type" markdown="1">

### SubscriptionOverrideConfig { #SubscriptionOverrideConfig }

Changes to an existing subscription; TypeScript uses an inline shape.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Existing unarchived subscription key. |
| `featureOverrides` | <code><a href="#FeatureOverrideConfig">FeatureOverrideConfig</a>[]</code> | Yes | None | Explicit changes only; omitted overrides are retained. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Existing unarchived subscription key. |
| `FeatureOverrides` | <code>List&lt;<a href="#FeatureOverrideConfig">FeatureOverrideConfig</a>&gt;</code> | Yes | None | Explicit changes only; omitted overrides are retained. |

</div>

</div>

<div class="data-type" markdown="1">

### FeatureOverrideConfig { #FeatureOverrideConfig }

One override change. TypeScript accepts either a removal object or a value-setting object.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `featureKey` | <code>string</code> | Yes | None | Feature key. |
| `remove` | <code>boolean</code> | No | None | true removes the override and permits only featureKey and remove in TypeScript. Omit or false to set. |
| `value` | <code>string</code> | No | None | Required unless removing; must match the feature type. |
| `type` | <code>&quot;permanent&quot; \| &quot;temporary&quot; \| &quot;timed&quot;</code> | No | None | Required unless removing. |
| `expiresAt` | <code>string \| null</code> | No | None | Future UTC timestamp required for timed; omit or null otherwise. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `FeatureKey` | <code>string</code> | Yes | None | Feature key. |
| `Value` | <code>string?</code> | No | null | Required unless removing; must match the feature type. |
| `Type` | <code>string?</code> | No | null | Required unless removing. |
| `ExpiresAt` | <code>DateTime?</code> | No | null | Future UTC timestamp required for timed; omit or null otherwise. |
| `Remove` | <code>bool</code> | No | false | true removes the override and permits only featureKey and remove in TypeScript. Omit or false to set. |

</div>

</div>

<div class="data-type" markdown="1">

### ConfigSyncCounts { #ConfigSyncCounts }

Core entity counters; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `features` | <code>number</code> | Yes | Not applicable | Count of features. |
| `products` | <code>number</code> | Yes | Not applicable | Count of products. |
| `plans` | <code>number</code> | Yes | Not applicable | Count of plans. |
| `billingCycles` | <code>number</code> | Yes | Not applicable | Count of billingCycles. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Features` | <code>int</code> | Yes | Not applicable | Count of features. |
| `Products` | <code>int</code> | Yes | Not applicable | Count of products. |
| `Plans` | <code>int</code> | Yes | Not applicable | Count of plans. |
| `BillingCycles` | <code>int</code> | Yes | Not applicable | Count of billingCycles. |

</div>

</div>

<div class="data-type" markdown="1">

### ConfigSyncError { #ConfigSyncError }

One report message; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `entityType` | <code>&quot;feature&quot; \| &quot;product&quot; \| &quot;plan&quot; \| &quot;billingCycle&quot; \| &quot;entitlement&quot;</code> | Yes | Not applicable | Wire category of the affected operation. |
| `key` | <code>string</code> | Yes | Not applicable | Affected entity key. |
| `message` | <code>string</code> | Yes | Not applicable | Failure or warning explanation. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `EntityType` | <code>string</code> | Yes | Not applicable | Wire category of the affected operation. |
| `Key` | <code>string</code> | Yes | Not applicable | Affected entity key. |
| `Message` | <code>string</code> | Yes | Not applicable | Failure or warning explanation. |

</div>

</div>

<div class="data-type" markdown="1">

### ConfigSyncWarning { #ConfigSyncWarning }

One report message; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `entityType` | <code>&quot;feature&quot; \| &quot;product&quot; \| &quot;plan&quot; \| &quot;billingCycle&quot; \| &quot;entitlement&quot;</code> | Yes | Not applicable | Wire category of the affected operation. |
| `key` | <code>string</code> | Yes | Not applicable | Affected entity key. |
| `message` | <code>string</code> | Yes | Not applicable | Failure or warning explanation. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `EntityType` | <code>string</code> | Yes | Not applicable | Wire category of the affected operation. |
| `Key` | <code>string</code> | Yes | Not applicable | Affected entity key. |
| `Message` | <code>string</code> | Yes | Not applicable | Failure or warning explanation. |

</div>

</div>

<div class="data-type" markdown="1">

### AccountingSyncReport { #AccountingSyncReport }

Configuration comparison; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `created` | <code>number</code> | Yes | Not applicable | Configuration entries added. |
| `updated` | <code>number</code> | Yes | Not applicable | Entries changed. |
| `removed` | <code>number</code> | Yes | Not applicable | Entries removed. |
| `unchanged` | <code>number</code> | Yes | Not applicable | Entries unchanged. |
| `changes` | <code><a href="#AccountingSyncChange">AccountingSyncChange</a>[]</code> | Yes | Not applicable | Individual configuration changes. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Created` | <code>int</code> | Yes | Not applicable | Configuration entries added. |
| `Updated` | <code>int</code> | Yes | Not applicable | Entries changed. |
| `Removed` | <code>int</code> | Yes | Not applicable | Entries removed. |
| `Unchanged` | <code>int</code> | Yes | Not applicable | Entries unchanged. |
| `Changes` | <code>List&lt;<a href="#AccountingSyncChange">AccountingSyncChange</a>&gt;</code> | Yes | Not applicable | Individual configuration changes. |

</div>

</div>

<div class="data-type" markdown="1">

### AccountingSyncChange { #AccountingSyncChange }

One configuration change; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `entityType` | <code>string</code> | Yes | Not applicable | Affected configuration kind. |
| `key` | <code>string</code> | Yes | Not applicable | Configuration entry identifier. |
| `action` | <code>string</code> | Yes | Not applicable | created, updated, removed, or unchanged. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `EntityType` | <code>string</code> | Yes | Not applicable | Affected configuration kind. |
| `Key` | <code>string</code> | Yes | Not applicable | Configuration entry identifier. |
| `Action` | <code>string</code> | Yes | Not applicable | created, updated, removed, or unchanged. |

</div>

</div>

## Related guides

- [Subscrio](core-overview.md): initialization and initial configuration.
- [Features](features.md): values and metering settings.
- [Add-ons](addons.md): feature contributions.
- [Credits](credits.md): grant and consumption rules.
- [Subscriptions](subscriptions.md): override lifetime and restrictions.
