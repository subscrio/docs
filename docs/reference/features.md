---
title: Features
description: Define, update, retrieve, and archive feature definitions, including metered settings and related add-ons, in TypeScript and .NET.
reference_format: true
---

# Features

## Purpose

<span id="overview" class="compatibility-anchor"></span>
<span id="access-typescript" class="compatibility-anchor"></span>
<span id="access-net" class="compatibility-anchor"></span>
<span id="method-catalog-typescript" class="compatibility-anchor"></span>
<span id="method-catalog-net" class="compatibility-anchor"></span>


A feature defines a capability or limit your products offer: a toggle, a numeric limit, a text setting, or a metered allowance. Define it once, associate it with products, and assign values through plans or subscription overrides. Use [Feature Checker](feature-checker.md) to resolve access and [Metered Usage](metering.md) to record consumption.

## Access and initialization { #access-and-initialization }

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const features = subscrio.features;
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core.Application.DTOs;

var features = subscrio.Features;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. The entries below document method-specific errors.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`createFeature`](#createfeature) | Creates a feature. |
| [`updateFeature`](#updatefeature) | Updates mutable fields. |
| [`getFeature`](#getfeature) | Gets one feature or null. |
| [`listFeatures`](#listfeatures) | Lists matching features. |
| [`getFeaturesByProduct`](#getfeaturesbyproduct) | Lists a product’s features. |
| [`archiveFeature`](#archivefeature) | Archives a feature. |
| [`unarchiveFeature`](#unarchivefeature) | Restores a feature. |
| [`deleteFeature`](#deletefeature) | Deletes an unused feature. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`CreateFeatureAsync`](#createfeature) | Creates a feature. |
| [`UpdateFeatureAsync`](#updatefeature) | Updates mutable fields. |
| [`GetFeatureAsync`](#getfeature) | Gets one feature or null. |
| [`ListFeaturesAsync`](#listfeatures) | Lists matching features. |
| [`GetFeaturesByProductAsync`](#getfeaturesbyproduct) | Lists a product’s features. |
| [`ArchiveFeatureAsync`](#archivefeature) | Archives a feature. |
| [`UnarchiveFeatureAsync`](#unarchivefeature) | Restores a feature. |
| [`DeleteFeatureAsync`](#deletefeature) | Deletes an unused feature. |

</div>

## Method details { #method-details }

<span id="method-reference"></span>

<div class="method-entry" markdown="1">

<span id="createFeature" class="compatibility-anchor"></span>

<span id="description" class="compatibility-anchor"></span>
<span id="description-typescript" class="compatibility-anchor"></span>
<span id="description-net" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="input-properties" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="input-properties_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>

### createFeature { #createfeature data-method-ts="createFeature" data-method-net="CreateFeatureAsync" }

Create an active, global feature with a unique key, value type, default value, and optional metering settings. The feature and its settings are saved together; invalid settings cancel the entire operation.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createFeature(dto: CreateFeatureDto): Promise<FeatureDto>
```

</div>

**Parameters**

- `dto`: [CreateFeatureDto](#CreateFeatureDto) containing the feature properties to create. Metered features require all four [metering settings](#MeteredFeatureConfigDto); other feature types reject them. A `billing_period` reset requires usage to be tracked per subscription.

**Returns** <code><a href="#FeatureDto">FeatureDto</a></code>: The persisted feature snapshot, including related add-ons and any metering configuration.

**Example**

```typescript
await features.createFeature({
  key: 'max-projects',
  displayName: 'Max Projects',
  valueType: 'numeric',
  defaultValue: '10'
});
```

<details class="additional-example" markdown="1">
<summary>Metered feature example</summary>

```typescript
await subscrio.features.createFeature({
  key: 'requests', displayName: 'API requests', valueType: 'metered', defaultValue: '0',
  meteredConfig: { resetPeriod: 'monthly', enforcement: 'hard', aggregation: 'sum', usageScope: 'customer' }
});
await subscrio.features.updateFeature('requests', {
  meteredConfig: { resetPeriod: 'monthly', enforcement: 'soft', aggregation: 'sum', usageScope: 'customer' }
});
const feature = await subscrio.features.getFeature('requests');
console.log(feature?.meteredConfig, feature?.addons);
```

</details>

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationError`: Invalid input, default value, or metering configuration.
- `ConflictError`: The key already exists.

</details>


</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<FeatureDto> CreateFeatureAsync(CreateFeatureDto dto)
```

</div>

**Parameters**

- `dto`: [CreateFeatureDto](#CreateFeatureDto) containing the feature properties to create. Metered features require all four [metering settings](#MeteredFeatureConfigDto); other feature types reject them. A `billing_period` reset requires usage to be tracked per subscription.

**Returns** <code><a href="#FeatureDto">FeatureDto</a></code>: The persisted feature snapshot, including related add-ons and any metering configuration.

**Example**

```csharp
await subscrio.Features.CreateFeatureAsync(new CreateFeatureDto(
    Key: "max-projects",
    DisplayName: "Max Projects",
    ValueType: "numeric",
    DefaultValue: "10"
));
```

<details class="additional-example" markdown="1">
<summary>Metered feature example</summary>

```csharp
await subscrio.Features.CreateFeatureAsync(new("requests", "API requests", "metered", "0",
    MeteredConfig: new("monthly", "hard", "sum", "customer")));
await subscrio.Features.UpdateFeatureAsync("requests", new(
    MeteredConfig: new("monthly", "soft", "sum", "customer")));
var feature = await subscrio.Features.GetFeatureAsync("requests");
Console.WriteLine(feature?.MeteredConfig);
Console.WriteLine(feature?.Addons.Count);
```

</details>

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationException`: Invalid input, default value, or metering configuration.
- `ConflictException`: The key already exists.

</details>


</div>

</div>

<div class="method-entry" markdown="1">

<span id="updateFeature" class="compatibility-anchor"></span>

<span id="description_1" class="compatibility-anchor"></span>
<span id="description_1-typescript" class="compatibility-anchor"></span>
<span id="description_1-net" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>

### updateFeature { #updatefeature data-method-ts="updateFeature" data-method-net="UpdateFeatureAsync" }

Change an existing feature without changing its key. Invalid metering settings cancel the entire update.

Once you have recorded usage for a metered feature, you cannot change its feature type, whether usage is tracked per customer or per subscription, how usage is counted, or when usage resets. You can still switch between rejecting usage over the limit (`hard`) and recording it (`soft`).

Saving a text feature also updates its product associations: add-on rules and any explicitly configured rules for combining subscriptions become `override_wins`. This selects one value by priority instead of combining values. See [How Feature Values Are Calculated](feature-resolution.md) for value priority.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
updateFeature(key: string, dto: UpdateFeatureDto): Promise<FeatureDto>
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.
- `dto`: [UpdateFeatureDto](#UpdateFeatureDto) containing the feature properties to change. Uses [partial updates](getting-started.md#partial-updates). Update properties do not accept `null`.

**Returns** <code><a href="#FeatureDto">FeatureDto</a></code>: The updated feature snapshot.

**Example**

Uses an existing feature with key `max-projects`.

```typescript
await features.updateFeature('max-projects', {
  defaultValue: '25',
  metadata: { tier: 'enterprise' }
});
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationError`: Invalid input, incompatible value, or restricted metering change.
- `NotFoundError`: The feature does not exist.

</details>


</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<FeatureDto> UpdateFeatureAsync(string key, UpdateFeatureDto dto)
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.
- `dto`: [UpdateFeatureDto](#UpdateFeatureDto) containing the feature properties to change. Uses [partial updates](getting-started.md#partial-updates).

**Returns** <code><a href="#FeatureDto">FeatureDto</a></code>: The updated feature snapshot.

**Example**

Uses an existing feature with key `max-projects`.

```csharp
await subscrio.Features.UpdateFeatureAsync("max-projects", new UpdateFeatureDto(
    DefaultValue: "25",
    Metadata: new Dictionary<string, object?> { ["tier"] = "enterprise" }
));
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationException`: Invalid input, incompatible value, or restricted metering change.
- `NotFoundException`: The feature does not exist.

</details>


</div>

</div>

<div class="method-entry" markdown="1">

<span id="getFeature" class="compatibility-anchor"></span>

<span id="description_2" class="compatibility-anchor"></span>
<span id="description_2-typescript" class="compatibility-anchor"></span>
<span id="description_2-net" class="compatibility-anchor"></span>
<span id="signature_4" class="compatibility-anchor"></span>
<span id="inputs_4" class="compatibility-anchor"></span>
<span id="returns_4" class="compatibility-anchor"></span>
<span id="example_4" class="compatibility-anchor"></span>
<span id="signature_5" class="compatibility-anchor"></span>
<span id="inputs_5" class="compatibility-anchor"></span>
<span id="returns_5" class="compatibility-anchor"></span>
<span id="example_5" class="compatibility-anchor"></span>
<span id="expected-results_2" class="compatibility-anchor"></span>
<span id="potential-errors_2" class="compatibility-anchor"></span>

### getFeature { #getfeature data-method-ts="getFeature" data-method-net="GetFeatureAsync" }

Retrieve a feature definition by its key.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getFeature(key: string): Promise<FeatureDto | null>
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.

**Returns** <code><a href="#FeatureDto">FeatureDto</a> | null</code>: The feature snapshot, including related add-ons and any metering configuration, or null if the key is missing.

**Example**

Returns null if `max-projects` does not exist.

```typescript
const feature = await features.getFeature('max-projects');
console.log(feature);
```


</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<FeatureDto?> GetFeatureAsync(string key)
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.

**Returns** <code><a href="#FeatureDto">FeatureDto</a>?</code>: The feature snapshot, including related add-ons and any metering configuration, or null if the key is missing.

**Example**

Returns null if `max-projects` does not exist.

```csharp
var feature = await subscrio.Features.GetFeatureAsync("max-projects");
Console.WriteLine(feature?.Key);
```


</div>

</div>

<div class="method-entry" markdown="1">

<span id="listFeatures" class="compatibility-anchor"></span>

<span id="description_3" class="compatibility-anchor"></span>
<span id="description_3-typescript" class="compatibility-anchor"></span>
<span id="description_3-net" class="compatibility-anchor"></span>
<span id="signature_6" class="compatibility-anchor"></span>
<span id="inputs_6" class="compatibility-anchor"></span>
<span id="returns_6" class="compatibility-anchor"></span>
<span id="example_6" class="compatibility-anchor"></span>
<span id="signature_7" class="compatibility-anchor"></span>
<span id="inputs_7" class="compatibility-anchor"></span>
<span id="returns_7" class="compatibility-anchor"></span>
<span id="example_7" class="compatibility-anchor"></span>
<span id="expected-results_3" class="compatibility-anchor"></span>
<span id="potential-errors_3" class="compatibility-anchor"></span>

### listFeatures { #listfeatures data-method-ts="listFeatures" data-method-net="ListFeaturesAsync" }

Browse feature definitions with filtering, sorting, and pagination.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listFeatures(filters?: FeatureFilterDto): Promise<FeatureDto[]>
```

</div>

**Parameters**

- `filters`: [FeatureFilterDto](#FeatureFilterDto) options. Optional; when omitted, returns up to 50 records starting at offset 0.

**Returns** <code><a href="#FeatureDto">FeatureDto</a>[]</code>: Matching feature snapshots, each including related add-ons; an empty collection when nothing matches.

**Example**

```typescript
const toggles = await features.listFeatures({ valueType: 'toggle', limit: 20, offset: 0 });
console.log(toggles);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: A filter is invalid.

</details>


</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<FeatureDto>> ListFeaturesAsync(FeatureFilterDto? filters)
```

</div>

**Parameters**

- `filters`: [FeatureFilterDto](#FeatureFilterDto) options. Optional; when omitted, returns up to 50 records starting at offset 0.

**Returns** <code>List&lt;<a href="#FeatureDto">FeatureDto</a>&gt;</code>: Matching feature snapshots, each including related add-ons; an empty collection when nothing matches.

**Example**

```csharp
var toggles = await subscrio.Features.ListFeaturesAsync(new FeatureFilterDto(
    ValueType: "toggle",
    Limit: 20
));
Console.WriteLine(toggles.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: A filter is invalid.

</details>


</div>

</div>

<div class="method-entry" markdown="1">

<span id="getFeaturesByProduct" class="compatibility-anchor"></span>

<span id="description_7" class="compatibility-anchor"></span>
<span id="description_7-typescript" class="compatibility-anchor"></span>
<span id="description_7-net" class="compatibility-anchor"></span>
<span id="signature_14" class="compatibility-anchor"></span>
<span id="inputs_14" class="compatibility-anchor"></span>
<span id="returns_14" class="compatibility-anchor"></span>
<span id="example_14" class="compatibility-anchor"></span>
<span id="signature_15" class="compatibility-anchor"></span>
<span id="inputs_15" class="compatibility-anchor"></span>
<span id="returns_15" class="compatibility-anchor"></span>
<span id="example_15" class="compatibility-anchor"></span>
<span id="expected-results_7" class="compatibility-anchor"></span>
<span id="potential-errors_7" class="compatibility-anchor"></span>

### getFeaturesByProduct { #getfeaturesbyproduct data-method-ts="getFeaturesByProduct" data-method-net="GetFeaturesByProductAsync" }

List the feature definitions associated with a product.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getFeaturesByProduct(productKey: string): Promise<FeatureDto[]>
```

</div>

**Parameters**

- `productKey`: The key of an existing product.

**Returns** <code><a href="#FeatureDto">FeatureDto</a>[]</code>: Associated feature snapshots; an empty collection when none are associated.

**Example**

Requires an existing product with key `pro-suite`.

```typescript
const productFeatures = await features.getFeaturesByProduct('pro-suite');
console.log(productFeatures);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The product does not exist.

</details>


</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<FeatureDto>> GetFeaturesByProductAsync(string productKey)
```

</div>

**Parameters**

- `productKey`: The key of an existing product.

**Returns** <code>List&lt;<a href="#FeatureDto">FeatureDto</a>&gt;</code>: Associated feature snapshots; an empty collection when none are associated.

**Example**

Requires an existing product with key `pro-suite`.

```csharp
var productFeatures = await subscrio.Features.GetFeaturesByProductAsync("pro-suite");
Console.WriteLine(productFeatures.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The product does not exist.

</details>


</div>

</div>

<div class="method-entry" markdown="1">

<span id="archiveFeature" class="compatibility-anchor"></span>

<span id="description_4" class="compatibility-anchor"></span>
<span id="description_4-typescript" class="compatibility-anchor"></span>
<span id="description_4-net" class="compatibility-anchor"></span>
<span id="signature_8" class="compatibility-anchor"></span>
<span id="inputs_8" class="compatibility-anchor"></span>
<span id="returns_8" class="compatibility-anchor"></span>
<span id="example_8" class="compatibility-anchor"></span>
<span id="signature_9" class="compatibility-anchor"></span>
<span id="inputs_9" class="compatibility-anchor"></span>
<span id="returns_9" class="compatibility-anchor"></span>
<span id="example_9" class="compatibility-anchor"></span>
<span id="expected-results_4" class="compatibility-anchor"></span>
<span id="potential-errors_4" class="compatibility-anchor"></span>

### archiveFeature { #archivefeature data-method-ts="archiveFeature" data-method-net="ArchiveFeatureAsync" }

Mark a feature as archived while retaining its saved definition and relationships. Archiving is required before deletion; use the [unarchive method](#unarchivefeature) to restore active status.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
archiveFeature(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.

**Returns** No returned value.

**Example**

Uses an existing feature with key `max-projects`.

```typescript
await features.archiveFeature('max-projects');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The feature does not exist.

</details>


</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task ArchiveFeatureAsync(string key)
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.

**Returns** No returned value.

**Example**

Uses an existing feature with key `max-projects`.

```csharp
await subscrio.Features.ArchiveFeatureAsync("max-projects");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The feature does not exist.

</details>


</div>

</div>

<div class="method-entry" markdown="1">

<span id="unarchiveFeature" class="compatibility-anchor"></span>

<span id="description_5" class="compatibility-anchor"></span>
<span id="description_5-typescript" class="compatibility-anchor"></span>
<span id="description_5-net" class="compatibility-anchor"></span>
<span id="signature_10" class="compatibility-anchor"></span>
<span id="inputs_10" class="compatibility-anchor"></span>
<span id="returns_10" class="compatibility-anchor"></span>
<span id="example_10" class="compatibility-anchor"></span>
<span id="signature_11" class="compatibility-anchor"></span>
<span id="inputs_11" class="compatibility-anchor"></span>
<span id="returns_11" class="compatibility-anchor"></span>
<span id="example_11" class="compatibility-anchor"></span>
<span id="expected-results_5" class="compatibility-anchor"></span>
<span id="potential-errors_5" class="compatibility-anchor"></span>

### unarchiveFeature { #unarchivefeature data-method-ts="unarchiveFeature" data-method-net="UnarchiveFeatureAsync" }

Restore an archived feature to active status.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
unarchiveFeature(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.

**Returns** No returned value.

**Example**

Uses an archived feature with key `max-projects`.

```typescript
await features.unarchiveFeature('max-projects');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The feature does not exist.

</details>


</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task UnarchiveFeatureAsync(string key)
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.

**Returns** No returned value.

**Example**

Uses an archived feature with key `max-projects`.

```csharp
await subscrio.Features.UnarchiveFeatureAsync("max-projects");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The feature does not exist.

</details>


</div>

</div>

<div class="method-entry" markdown="1">

<span id="deleteFeature" class="compatibility-anchor"></span>

<span id="description_6" class="compatibility-anchor"></span>
<span id="description_6-typescript" class="compatibility-anchor"></span>
<span id="description_6-net" class="compatibility-anchor"></span>
<span id="signature_12" class="compatibility-anchor"></span>
<span id="inputs_12" class="compatibility-anchor"></span>
<span id="returns_12" class="compatibility-anchor"></span>
<span id="example_12" class="compatibility-anchor"></span>
<span id="signature_13" class="compatibility-anchor"></span>
<span id="inputs_13" class="compatibility-anchor"></span>
<span id="returns_13" class="compatibility-anchor"></span>
<span id="example_13" class="compatibility-anchor"></span>
<span id="expected-results_6" class="compatibility-anchor"></span>
<span id="potential-errors_6" class="compatibility-anchor"></span>

### deleteFeature { #deletefeature data-method-ts="deleteFeature" data-method-net="DeleteFeatureAsync" }

Permanently delete an archived feature. Remove product associations, plan values, and subscription overrides first; other stored references may also block deletion.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
deleteFeature(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.

**Returns** No returned value.

**Example**

Requires `max-projects` to be archived and free of references.

```typescript
await features.deleteFeature('max-projects');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The feature does not exist.
- `DomainError`: The feature is active or has references checked by the library.

</details>


</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DeleteFeatureAsync(string key)
```

</div>

**Parameters**

- `key`: The key identifying the feature, such as `max-projects`.

**Returns** No returned value.

**Example**

Requires `max-projects` to be archived and free of references.

```csharp
await subscrio.Features.DeleteFeatureAsync("max-projects");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The feature does not exist.
- `DomainException`: The feature is active or has references checked by the library.

</details>


</div>

</div>

<span id="dto-reference" class="compatibility-anchor"></span>

## Data types

For input types, Required means the caller must supply the property. For returned types, it means the property is present in the response; its value may still be null where the type allows it.

<div class="data-type" markdown="1">

<span id="createfeaturedto-typescript" class="compatibility-anchor"></span>
<span id="createfeaturedto-net" class="compatibility-anchor"></span>

### CreateFeatureDto { #CreateFeatureDto }

<span id="createfeaturedto"></span>

The properties used to define a feature.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Stable feature identifier. Letters, digits, hyphens and underscores; 1–255 characters. |
| `displayName` | <code>string</code> | Yes | None | Human-readable label, 1–255 characters. |
| `valueType` | <code>"toggle" \| "numeric" \| "text" \| "metered"</code> | Yes | None | toggle, numeric, text, or metered. |
| `defaultValue` | <code>string</code> | Yes | None | Fallback value stored as a string. Toggle: true or false (case-insensitive); numeric: a finite number; metered: a nonnegative safe integer; text: a nonempty string. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `groupName` | <code>string \| undefined</code> | No | None | Optional catalog group, up to 255 characters. |
| `meteredConfig` | <code><a href="#MeteredFeatureConfigDto">MeteredFeatureConfigDto</a> \| undefined</code> | When metered | None | Required for a metered feature; rejected for other feature types. |
| `validator` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Custom validation metadata. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application-defined metadata. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Stable feature identifier. Letters, digits, hyphens and underscores; 1–255 characters. |
| `DisplayName` | <code>string</code> | Yes | None | Human-readable label, 1–255 characters. |
| `ValueType` | <code>string</code> | Yes | None | toggle, numeric, text, or metered. |
| `DefaultValue` | <code>string</code> | Yes | None | Fallback value stored as a string. Toggle: true or false (case-insensitive); numeric: a finite number; metered: a nonnegative safe integer; text: a nonempty string. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `GroupName` | <code>string?</code> | No | null | Optional catalog group, up to 255 characters. |
| `Validator` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Custom validation metadata. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application-defined metadata. |
| `MeteredConfig` | <code><a href="#MeteredFeatureConfigDto">MeteredFeatureConfigDto</a>?</code> | When metered | null | Required for a metered feature; rejected for other feature types. |

</div>

</div>

<div class="data-type" markdown="1">

<span id="metered-feature-type" class="compatibility-anchor"></span>
<span id="metered-configuration" class="compatibility-anchor"></span>
<span id="metered-configuration-typescript" class="compatibility-anchor"></span>
<span id="metered-configuration-net" class="compatibility-anchor"></span>

### MeteredFeatureConfigDto { #MeteredFeatureConfigDto }

<span id="meteredfeatureconfigdto"></span>

How usage is recorded and limited for a metered feature. All four settings are required when supplying this object.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `resetPeriod` | <code>"monthly" \| "yearly" \| "billing_period" \| "hourly" \| "daily" \| "weekly"</code> | Yes | None | hourly, daily, weekly, monthly, yearly, or billing_period. Calendar periods use UTC. |
| `enforcement` | <code>"hard" \| "soft"</code> | Yes | None | hard rejects over-limit usage; soft records usage and reports overage. |
| `aggregation` | <code>"count" \| "sum"</code> | Yes | None | sum adds the quantity; count requires quantity one per event. |
| `usageScope` | <code>"customer" \| "subscription"</code> | Yes | None | customer shares the product usage bucket; subscription keeps a separate bucket per subscription. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `ResetPeriod` | <code>string</code> | Yes | None | hourly, daily, weekly, monthly, yearly, or billing_period. Calendar periods use UTC. |
| `Enforcement` | <code>string</code> | Yes | None | hard rejects over-limit usage; soft records usage and reports overage. |
| `Aggregation` | <code>string</code> | Yes | None | sum adds the quantity; count requires quantity one per event. |
| `UsageScope` | <code>string</code> | Yes | None | customer shares the product usage bucket; subscription keeps a separate bucket per subscription. |

</div>

Calendar reset periods use UTC. Billing-period resets require usage to be tracked per subscription. Once usage is recorded, only enforcement can change among these four settings. See [Metered Usage](metering.md) for quota checks and reports.

</div>

<div class="data-type" markdown="1">

<span id="featuredto-typescript" class="compatibility-anchor"></span>
<span id="featuredto-net" class="compatibility-anchor"></span>

### FeatureDto { #FeatureDto }

<span id="featuredto"></span>

The complete feature definition returned by create, update, get, and list operations.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `addons` | <code><a href="../addons/#getaddon">AddonDto</a>[]</code> | Yes | Not applicable | Related add-on definitions, including each add-on's complete feature-value map. See [AddonDto properties](addons.md#getaddon). |
| `meteredConfig` | <code><a href="#MeteredFeatureConfigDto">MeteredFeatureConfigDto</a> \| null \| undefined</code> | No | Not applicable | Current metering settings, or absent/null when not configured. |
| `key` | <code>string</code> | Yes | Not applicable | Stable feature identifier. Letters, digits, hyphens and underscores; 1–255 characters. |
| `displayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1–255 characters. |
| `description` | <code>string \| null \| undefined</code> | No | Not applicable | Optional description, up to 1,000 characters. |
| `valueType` | <code>string</code> | Yes | Not applicable | toggle, numeric, text, or metered. |
| `defaultValue` | <code>string</code> | Yes | Not applicable | Fallback value stored as a string. Toggle: true or false (case-insensitive); numeric: a finite number; metered: a nonnegative safe integer; text: a nonempty string. |
| `groupName` | <code>string \| null \| undefined</code> | No | Not applicable | Optional catalog group, up to 255 characters. |
| `status` | <code>string</code> | Yes | Not applicable | Feature status: active or archived. |
| `validator` | <code>Record&lt;string, unknown&gt; \| null \| undefined</code> | No | Not applicable | Custom validation metadata. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| null \| undefined</code> | No | Not applicable | Application-defined metadata. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation timestamp in ISO format. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update timestamp in ISO format. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | Not applicable | Stable feature identifier. Letters, digits, hyphens and underscores; 1–255 characters. |
| `DisplayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1–255 characters. |
| `Description` | <code>string?</code> | Yes | Not applicable | Optional description, up to 1,000 characters. |
| `ValueType` | <code>string</code> | Yes | Not applicable | toggle, numeric, text, or metered. |
| `DefaultValue` | <code>string</code> | Yes | Not applicable | Fallback value stored as a string. Toggle: true or false (case-insensitive); numeric: a finite number; metered: a nonnegative safe integer; text: a nonempty string. |
| `GroupName` | <code>string?</code> | Yes | Not applicable | Optional catalog group, up to 255 characters. |
| `Status` | <code>string</code> | Yes | Not applicable | Feature status: active or archived. |
| `Validator` | <code>Dictionary&lt;string, object?&gt;?</code> | Yes | Not applicable | Custom validation metadata. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | Yes | Not applicable | Application-defined metadata. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation timestamp in ISO format. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update timestamp in ISO format. |
| `MeteredConfig` | <code><a href="#MeteredFeatureConfigDto">MeteredFeatureConfigDto</a>?</code> | Yes | Not applicable | Current metering settings, or absent/null when not configured. |
| `Addons` | <code>List&lt;<a href="../addons/#getaddon">AddonDto</a>&gt;</code> | Yes | Not applicable | Related add-on definitions, including each add-on's complete feature-value map. See [AddonDto properties](addons.md#getaddon). |

</div>

</div>

<div class="data-type" markdown="1">

<span id="updatefeaturedto-typescript" class="compatibility-anchor"></span>
<span id="updatefeaturedto-net" class="compatibility-anchor"></span>

### UpdateFeatureDto { #UpdateFeatureDto }

<span id="updatefeaturedto"></span>

The editable properties of a feature. The key cannot be changed. See [partial updates](getting-started.md#partial-updates).

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `displayName` | <code>string \| undefined</code> | No | None | Human-readable label, 1–255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `valueType` | <code>"toggle" \| "numeric" \| "text" \| "metered" \| undefined</code> | No | None | toggle, numeric, text, or metered. Remove credit consumption rules before changing to metered. The existing or supplied default value must be valid for the new type. |
| `defaultValue` | <code>string \| undefined</code> | No | None | Fallback value stored as a string. Toggle: true or false (case-insensitive); numeric: a finite number; metered: a nonnegative safe integer; text: a nonempty string. |
| `groupName` | <code>string \| undefined</code> | No | None | Optional catalog group, up to 255 characters. |
| `meteredConfig` | <code><a href="#MeteredFeatureConfigDto">MeteredFeatureConfigDto</a> \| undefined</code> | No | None | Supply all four settings to update this object. Only metered features accept it. |
| `validator` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Custom validation metadata. Replaces all saved entries; an empty object clears them. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application-defined metadata. Replaces all saved entries; an empty object clears them. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `DisplayName` | <code>string?</code> | No | null | Human-readable label, 1–255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `ValueType` | <code>string?</code> | No | null | toggle, numeric, text, or metered. Remove credit consumption rules before changing to metered. The existing or supplied default value must be valid for the new type. |
| `DefaultValue` | <code>string?</code> | No | null | Fallback value stored as a string. Toggle: true or false (case-insensitive); numeric: a finite number; metered: a nonnegative safe integer; text: a nonempty string. |
| `GroupName` | <code>string?</code> | No | null | Optional catalog group, up to 255 characters. |
| `Validator` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Custom validation metadata. Replaces all saved entries; an empty object clears them. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application-defined metadata. Replaces all saved entries; an empty object clears them. |
| `MeteredConfig` | <code><a href="#MeteredFeatureConfigDto">MeteredFeatureConfigDto</a>?</code> | No | null | Supply all four settings to update this object. Only metered features accept it. |

</div>

</div>

<div class="data-type" markdown="1">

<span id="featurefilterdto-typescript" class="compatibility-anchor"></span>
<span id="featurefilterdto-net" class="compatibility-anchor"></span>

### FeatureFilterDto { #FeatureFilterDto }

<span id="featurefilterdto"></span>

Filters, pagination, and ordering for the feature catalog.

<div class="language-content" data-lang="ts" markdown="1">

When supplying a filters object, its TypeScript type requires `limit` and `offset`. Omitting the whole argument uses the method defaults.

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `limit` | <code>number</code> | Yes | 50 | Page size, from 1 to 100. |
| `offset` | <code>number</code> | Yes | 0 | Nonnegative number of records to skip. |
| `status` | <code>"archived" \| "active" \| undefined</code> | No | None | Feature status: active or archived. |
| `valueType` | <code>"toggle" \| "numeric" \| "text" \| "metered" \| undefined</code> | No | None | Filter by toggle, numeric, text, or metered. |
| `groupName` | <code>string \| undefined</code> | No | None | Filter by group name. |
| `search` | <code>string \| undefined</code> | No | None | Text search term. |
| `sortBy` | <code>"displayName" \| "createdAt" \| undefined</code> | No | None | Sort by displayName or createdAt. |
| `sortOrder` | <code>"asc" \| "desc" \| undefined</code> | No | None | Sort direction; the query uses asc when omitted. |

</div>

<div class="language-content" data-lang="net" markdown="1">

All constructor arguments are optional.

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Status` | <code>string?</code> | No | null | Feature status: active or archived. |
| `ValueType` | <code>string?</code> | No | null | Filter by toggle, numeric, text, or metered. |
| `GroupName` | <code>string?</code> | No | null | Filter by group name. |
| `Search` | <code>string?</code> | No | null | Text search term. |
| `SortBy` | <code>string?</code> | No | null | Sort by displayName or createdAt. |
| `SortOrder` | <code>string?</code> | No | null | Sort direction; the query uses asc when omitted. |
| `Limit` | <code>int</code> | No | 50 | Page size, from 1 to 100. |
| `Offset` | <code>int</code> | No | 0 | Nonnegative number of records to skip. |

</div>

</div>

<span id="related-workflows"></span>

## Related guides

- [Products](products.md): associate features with products.
- [Plans](plans.md): set plan-specific feature values.
- [Subscriptions](subscriptions.md): override a feature value for a subscription.
- [How Feature Values Are Calculated](feature-resolution.md): how plan values, add-ons, and overrides determine access.
- [Metered Usage](metering.md): check allowances and record consumption.
