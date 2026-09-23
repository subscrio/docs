---
title: Add-ons
description: Define and manage reusable subscription add-ons and their feature contributions.
reference_format: true
---

# Add-ons

## Purpose

<span id="define-contributions-in-one-place" class="compatibility-anchor"></span>

Add-ons are reusable packages of feature values for a product. A package can affect several features, such as seats and storage, and can be attached to multiple subscriptions. Define contributions here; attach packages through [Subscriptions](subscriptions.md#attachaddon). For an individual exception, see [overrides or add-ons](entitlements-guide.md#overrides-or-subscription-add-ons).

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const addons = subscrio.addons;
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core.Application.DTOs;

var addons = subscrio.Addons;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`createAddon`](#createaddon) | Creates an add-on and its contributions. |
| [`updateAddon`](#updateaddon) | Updates an add-on and selected contributions. |
| [`getAddon`](#getaddon) | Gets an add-on or null. |
| [`listAddons`](#listaddons) | Lists a product's add-ons. |
| [`archiveAddon`](#archiveaddon) | Stops new attachments. |
| [`unarchiveAddon`](#unarchiveaddon) | Allows attachments again. |
| [`deleteAddon`](#deleteaddon) | Deletes an unused archived add-on. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`CreateAddonAsync`](#createaddon) | Creates an add-on and its contributions. |
| [`UpdateAddonAsync`](#updateaddon) | Updates an add-on and selected contributions. |
| [`GetAddonAsync`](#getaddon) | Gets an add-on or null. |
| [`ListAddonsAsync`](#listaddons) | Lists a product's add-ons. |
| [`ArchiveAddonAsync`](#archiveaddon) | Stops new attachments. |
| [`UnarchiveAddonAsync`](#unarchiveaddon) | Allows attachments again. |
| [`DeleteAddonAsync`](#deleteaddon) | Deletes an unused archived add-on. |

</div>

## Method details

<div class="method-entry" markdown="1">

### createAddon { #createaddon data-method-ts="createAddon" data-method-net="CreateAddonAsync" }

<span id="description" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="input-properties" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="return-properties" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="input-properties_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="return-properties_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>

Create an active add-on with a globally unique key. The definition and all contributions are saved together; invalid contributions cancel the operation. Each contributed feature must be associated with the add-on's product.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createAddon(input: CreateAddonDto): Promise<AddonDto>
```

</div>

**Parameters**

- `input`: [CreateAddonDto](#CreateAddonDto) containing the product, label, and feature contributions.

**Returns** <code><a href="#AddonDto">AddonDto</a></code>: The saved definition, including its complete feature-value map.

**Example**

```typescript
// studio must be active, with an associated numeric seats feature.
await subscrio.addons.createAddon({
  key: 'seat-pack',
  productKey: 'studio',
  displayName: 'Extra seats',
  featureValues: { seats: '3' }
});
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationError`: A key, label, mode, priority, or feature value is invalid.
- `NotFoundError`: The product is missing or inactive, or a feature is not associated with it.
- `ConflictError`: The add-on key already exists.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<AddonDto> CreateAddonAsync(CreateAddonDto input)
```

</div>

**Parameters**

- `input`: [CreateAddonDto](#CreateAddonDto) containing the product, label, and feature contributions.

**Returns** <code><a href="#AddonDto">AddonDto</a></code>: The saved definition, including its complete feature-value map.

**Example**

```csharp
// studio must be active, with an associated numeric seats feature.
await subscrio.Addons.CreateAddonAsync(new CreateAddonDto(
    Key: "seat-pack",
    ProductKey: "studio",
    DisplayName: "Extra seats",
    FeatureValues: new() { ["seats"] = "3" }));
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationException`: A key, label, mode, priority, or feature value is invalid.
- `NotFoundException`: The product is missing or inactive, or a feature is not associated with it.
- `ConflictException`: The add-on key already exists.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### updateAddon { #updateaddon data-method-ts="updateAddon" data-method-net="UpdateAddonAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="input-properties_2" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="return-properties_2" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="input-properties_3" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="return-properties_3" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>

Update an add-on without changing its key or product. Supplied feature entries add, replace, or remove individual contributions; other entries are retained. Definition and contribution changes commit together. Switching to replacement mode requires every active attachment to have quantity one.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
updateAddon(addonKey: string, input: UpdateAddonDto): Promise<AddonDto>
```

</div>

**Parameters**

- `addonKey`: Add-on to update.
- `input`: [UpdateAddonDto](#UpdateAddonDto). Uses [partial updates](getting-started.md#partial-updates); feature-map entries have their own removal rules.

**Returns** <code><a href="#AddonDto">AddonDto</a></code>: The saved definition, including its complete feature-value map.

**Example**

```typescript
// seat-pack exists; seats and storage are associated with its product.
await subscrio.addons.updateAddon('seat-pack', {
  featureValues: { seats: '5', storage: null }
});
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationError`: A supplied property or contribution is invalid.
- `NotFoundError`: The add-on or an associated feature is missing.
- `ConflictError`: Replacement mode conflicts with an active attachment quantity.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<AddonDto> UpdateAddonAsync(string key, UpdateAddonDto input)
```

</div>

**Parameters**

- `key`: Add-on to update.
- `input`: [UpdateAddonDto](#UpdateAddonDto). Uses [partial updates](getting-started.md#partial-updates); feature-map entries have their own removal rules.

**Returns** <code><a href="#AddonDto">AddonDto</a></code>: The saved definition, including its complete feature-value map.

**Example**

```csharp
// seat-pack exists; seats and storage are associated with its product.
await subscrio.Addons.UpdateAddonAsync("seat-pack", new UpdateAddonDto(
    FeatureValues: new() { ["seats"] = "5", ["storage"] = null }));
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationException`: A supplied property or contribution is invalid.
- `NotFoundException`: The add-on or an associated feature is missing.
- `ConflictException`: Replacement mode conflicts with an active attachment quantity.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getAddon { #getaddon data-method-ts="getAddon" data-method-net="GetAddonAsync" }

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

Retrieve one add-on definition, including archived definitions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getAddon(addonKey: string): Promise<AddonDto | null>
```

</div>

**Parameters**

- `addonKey`: Add-on key.

**Returns** <code><a href="#AddonDto">AddonDto</a> | null</code>: Definition and complete contributions, or null when the key is missing.

**Example**

```typescript
const addon = await subscrio.addons.getAddon('seat-pack');
console.log(addon?.featureValues);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<AddonDto?> GetAddonAsync(string key)
```

</div>

**Parameters**

- `key`: Add-on key.

**Returns** <code><a href="#AddonDto">AddonDto</a>?</code>: Definition and complete contributions, or null when the key is missing.

**Example**

```csharp
var addon = await subscrio.Addons.GetAddonAsync("seat-pack");
Console.WriteLine(addon?.FeatureValues.Count);
```

</div>

</div>

<div class="method-entry" markdown="1">

### listAddons { #listaddons data-method-ts="listAddons" data-method-net="ListAddonsAsync" }

<span id="description_3" class="compatibility-anchor"></span>
<span id="signature_6" class="compatibility-anchor"></span>
<span id="inputs_6" class="compatibility-anchor"></span>
<span id="input-properties_4" class="compatibility-anchor"></span>
<span id="returns_6" class="compatibility-anchor"></span>
<span id="return-properties_6" class="compatibility-anchor"></span>
<span id="example_6" class="compatibility-anchor"></span>
<span id="signature_7" class="compatibility-anchor"></span>
<span id="inputs_7" class="compatibility-anchor"></span>
<span id="returns_7" class="compatibility-anchor"></span>
<span id="return-properties_7" class="compatibility-anchor"></span>
<span id="example_7" class="compatibility-anchor"></span>
<span id="expected-results_3" class="compatibility-anchor"></span>
<span id="potential-errors_3" class="compatibility-anchor"></span>

List a product's add-ons in ascending key order. Both active and archived definitions are included unless filtered. TypeScript also supports searching by add-on key.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listAddons(productKey: string, filter?: PageFilter): Promise<AddonDto[]>
```

</div>

**Parameters**

- `productKey`: Product whose add-ons to retrieve.
- `filter`: Optional [PageFilter](#PageFilter). Defaults to 50 results at offset zero.

**Returns** <code><a href="#AddonDto">AddonDto</a>[]</code>: Matching definitions and contributions; empty when no results or product exist.

**Example**

```typescript
const addons = await subscrio.addons.listAddons('studio', { status: 'active' });
console.log(addons);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: Pagination is outside the allowed range.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<AddonDto>> ListAddonsAsync(string productKey, int limit, int offset, string? status)
```

</div>

**Parameters**

- `productKey`: Product whose add-ons to retrieve.
- `limit`: Optional page size, 1 to 500; defaults to 50.
- `offset`: Optional nonnegative number of records to skip; defaults to zero.
- `status`: Optional status filter; defaults to null, which includes all statuses.

**Returns** <code>List&lt;<a href="#AddonDto">AddonDto</a>&gt;</code>: Matching definitions and contributions; empty when no results or product exist.

**Example**

```csharp
var addons = await subscrio.Addons.ListAddonsAsync("studio", status: "active");
Console.WriteLine(addons.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: Pagination is outside the allowed range.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### archiveAddon { #archiveaddon data-method-ts="archiveAddon" data-method-net="ArchiveAddonAsync" }

<span id="description_4" class="compatibility-anchor"></span>
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

Archive the add-on to prevent new attachments. Existing attachments and their contributions remain; archive does not detach subscriptions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
archiveAddon(k: string): Promise<void>
```

</div>

**Parameters**

- `k`: Add-on key.

**Returns** No returned value.

**Example**

```typescript
// seat-pack must exist.
await subscrio.addons.archiveAddon('seat-pack');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The add-on does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task ArchiveAddonAsync(string key)
```

</div>

**Parameters**

- `key`: Add-on key.

**Returns** No returned value.

**Example**

```csharp
// seat-pack must exist.
await subscrio.Addons.ArchiveAddonAsync("seat-pack");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The add-on does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### unarchiveAddon { #unarchiveaddon data-method-ts="unarchiveAddon" data-method-net="UnarchiveAddonAsync" }

<span id="description_5" class="compatibility-anchor"></span>
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

Restore the add-on to active status so it can be attached again. Existing definitions and attachments are retained.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
unarchiveAddon(k: string): Promise<void>
```

</div>

**Parameters**

- `k`: Add-on key.

**Returns** No returned value.

**Example**

```typescript
// seat-pack must exist.
await subscrio.addons.unarchiveAddon('seat-pack');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The add-on does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task UnarchiveAddonAsync(string key)
```

</div>

**Parameters**

- `key`: Add-on key.

**Returns** No returned value.

**Example**

```csharp
// seat-pack must exist.
await subscrio.Addons.UnarchiveAddonAsync("seat-pack");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The add-on does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### deleteAddon { #deleteaddon data-method-ts="deleteAddon" data-method-net="DeleteAddonAsync" }

<span id="description_6" class="compatibility-anchor"></span>
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

Permanently delete an archived add-on and its feature contributions. Any attachment history blocks deletion, including cancelled attachments.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
deleteAddon(k: string): Promise<void>
```

</div>

**Parameters**

- `k`: Add-on key.

**Returns** No returned value.

**Example**

```typescript
// seat-pack must exist and be archived with no attachment history.
await subscrio.addons.deleteAddon('seat-pack');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The add-on does not exist.
- `ConflictError`: The add-on is active or has attachment history.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DeleteAddonAsync(string key)
```

</div>

**Parameters**

- `key`: Add-on key.

**Returns** No returned value.

**Example**

```csharp
// seat-pack must exist and be archived with no attachment history.
await subscrio.Addons.DeleteAddonAsync("seat-pack");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The add-on does not exist.
- `ConflictException`: The add-on is active or has attachment history.

</details>

</div>

</div>

## Data types

For input types, Required means the caller must supply the property. For returned types, it means the property is present; nullability is shown separately.

<div class="data-type" markdown="1">

### CreateAddonDto { #CreateAddonDto }

Properties used to define an add-on.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Globally unique add-on key; cannot be changed. |
| `productKey` | <code>string</code> | Yes | None | Owning product; cannot be changed. |
| `displayName` | <code>string</code> | Yes | None | Nonblank label, at most 255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Optional description. |
| `compositionMode` | <code>&quot;additive&quot; \| &quot;override&quot; \| undefined</code> | No | additive | Add contributions to the base value, or replace it. Replacement attachments require quantity one. |
| `priority` | <code>number \| undefined</code> | No | 0 | Lower values win when choosing between replacements. .NET uses a 32-bit integer; TypeScript accepts integers from -2,147,483,647 to 2,147,483,647. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application-defined metadata. |
| `featureValues` | <code>Record&lt;string, string&gt; \| undefined</code> | No | None | Associated feature keys mapped to contributions, stored as strings and validated for the feature type. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Globally unique add-on key; cannot be changed. |
| `ProductKey` | <code>string</code> | Yes | None | Owning product; cannot be changed. |
| `DisplayName` | <code>string</code> | Yes | None | Nonblank label, at most 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description. |
| `CompositionMode` | <code>string</code> | No | additive | Add contributions to the base value, or replace it. Replacement attachments require quantity one. |
| `Priority` | <code>int</code> | No | 0 | Lower values win when choosing between replacements. .NET uses a 32-bit integer; TypeScript accepts integers from -2,147,483,647 to 2,147,483,647. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application-defined metadata. |
| `FeatureValues` | <code>Dictionary&lt;string, string&gt;?</code> | No | null | Associated feature keys mapped to contributions, stored as strings and validated for the feature type. |

</div>

</div>

<div class="data-type" markdown="1">

### AddonDto { #AddonDto }

Complete add-on definition. Products and plans include their product's catalog; features include contributing add-ons, and subscriptions include attached definitions.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | Not applicable | Globally unique add-on key; cannot be changed. |
| `productKey` | <code>string</code> | Yes | Not applicable | Owning product; cannot be changed. |
| `displayName` | <code>string</code> | Yes | Not applicable | Nonblank label, at most 255 characters. |
| `description` | <code>string \| undefined</code> | No | Not applicable | Optional description. |
| `compositionMode` | <code>&quot;additive&quot; \| &quot;override&quot;</code> | Yes | Not applicable | Add contributions to the base value, or replace it. Replacement attachments require quantity one. |
| `priority` | <code>number</code> | Yes | Not applicable | Lower values win when choosing between replacements. .NET uses a 32-bit integer; TypeScript accepts integers from -2,147,483,647 to 2,147,483,647. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | Not applicable | Application-defined metadata. |
| `featureValues` | <code>Record&lt;string, string&gt;</code> | Yes | Not applicable | Associated feature keys mapped to contributions, stored as strings and validated for the feature type. |
| `status` | <code>&quot;active&quot; \| &quot;archived&quot;</code> | Yes | Not applicable | Catalog status. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | Not applicable | Globally unique add-on key; cannot be changed. |
| `ProductKey` | <code>string</code> | Yes | Not applicable | Owning product; cannot be changed. |
| `DisplayName` | <code>string</code> | Yes | Not applicable | Nonblank label, at most 255 characters. |
| `Description` | <code>string?</code> | Yes | Not applicable | Optional description. |
| `CompositionMode` | <code>string</code> | Yes | Not applicable | Add contributions to the base value, or replace it. Replacement attachments require quantity one. |
| `Priority` | <code>int</code> | Yes | Not applicable | Lower values win when choosing between replacements. .NET uses a 32-bit integer; TypeScript accepts integers from -2,147,483,647 to 2,147,483,647. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | Yes | Not applicable | Application-defined metadata. |
| `FeatureValues` | <code>Dictionary&lt;string, string&gt;</code> | Yes | Not applicable | Associated feature keys mapped to contributions, stored as strings and validated for the feature type. |
| `Status` | <code>string</code> | Yes | Not applicable | Catalog status. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

</div>

<div class="data-type" markdown="1">

### UpdateAddonDto { #UpdateAddonDto }

Editable add-on properties. Feature contributions are patched per key; metadata is replaced as a whole.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `displayName` | <code>string \| undefined</code> | No | None | Nonblank label, at most 255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Optional description. |
| `compositionMode` | <code>&quot;additive&quot; \| &quot;override&quot; \| undefined</code> | No | None | Add contributions to the base value, or replace it. Replacement attachments require quantity one. |
| `priority` | <code>number \| undefined</code> | No | None | Lower values win when choosing between replacements. .NET uses a 32-bit integer; TypeScript accepts integers from -2,147,483,647 to 2,147,483,647. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Replaces the saved metadata object. An empty object clears its entries. |
| `featureValues` | <code>Record&lt;string, string \| null&gt; \| undefined</code> | No | None | Omit to keep all contributions. Supplied entries add or replace values; null removes a key. An empty map makes no changes. A null map is rejected. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `DisplayName` | <code>string?</code> | No | null | Nonblank label, at most 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description. |
| `CompositionMode` | <code>string?</code> | No | null | Add contributions to the base value, or replace it. Replacement attachments require quantity one. |
| `Priority` | <code>int?</code> | No | null | Lower values win when choosing between replacements. .NET uses a 32-bit integer; TypeScript accepts integers from -2,147,483,647 to 2,147,483,647. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Replaces the saved metadata object. An empty object clears its entries. |
| `FeatureValues` | <code>Dictionary&lt;string, string?&gt;?</code> | No | null | Omit to keep all contributions. Supplied entries add or replace values; null removes a key. An empty map makes no changes. A null map also makes no changes. |

</div>

</div>

<div class="data-type" markdown="1">

### PageFilter { #PageFilter }

TypeScript pagination and filtering options. .NET takes pagination and status as individual method arguments and has no search argument.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `limit` | `number` | No | 50 | Integer page size, 1 to 500. |
| `offset` | `number` | No | 0 | Nonnegative safe integer; number of rows to skip. |
| `search` | `string` | No | None | Case-insensitive key pattern; SQL wildcard characters apply. |
| `status` | `string` | No | None | Filter by active or archived status. |

</div>

<div class="language-content" data-lang="net" markdown="1">

No PageFilter DTO is used by this method. See the parameters of [ListAddonsAsync](#listaddons).

</div>

</div>

## Related guides

- [Overrides or subscription add-ons](entitlements-guide.md#overrides-or-subscription-add-ons): choose an exception or reusable package.
- [How Feature Values Are Calculated](feature-resolution.md): combine plan values, add-ons, and overrides.
- [Subscriptions](subscriptions.md#attachaddon): attach or detach an add-on.
- [Extending Subscrio](how-to-extend.md): software extensions are separate from subscription add-ons.
