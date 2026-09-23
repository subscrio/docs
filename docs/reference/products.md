---
title: Products
description: Manage products and their feature associations in TypeScript and .NET.
reference_format: true
---

# Products

## Purpose

<span id="method-reference" class="compatibility-anchor"></span>

<span id="overview" class="compatibility-anchor"></span>

Products group your plans and associated features. Define features first, associate them with a product, then assign plan-specific values. Product results also include the add-on catalog and feature-resolution settings.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const products = subscrio.products;
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core.Application.DTOs;

var products = subscrio.Products;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`createProduct`](#createproduct) | Creates an active product. |
| [`updateProduct`](#updateproduct) | Updates product details. |
| [`getProduct`](#getproduct) | Gets a product or null. |
| [`listProducts`](#listproducts) | Lists matching products. |
| [`associateFeature`](#associatefeature) | Associates a feature and configures resolution. |
| [`dissociateFeature`](#dissociatefeature) | Removes a feature association. |
| [`archiveProduct`](#archiveproduct) | Archives a product. |
| [`unarchiveProduct`](#unarchiveproduct) | Restores a product. |
| [`deleteProduct`](#deleteproduct) | Permanently deletes an unused product. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`CreateProductAsync`](#createproduct) | Creates an active product. |
| [`UpdateProductAsync`](#updateproduct) | Updates product details. |
| [`GetProductAsync`](#getproduct) | Gets a product or null. |
| [`ListProductsAsync`](#listproducts) | Lists matching products. |
| [`AssociateFeatureAsync`](#associatefeature) | Associates a feature and configures resolution. |
| [`DissociateFeatureAsync`](#dissociatefeature) | Removes a feature association. |
| [`ArchiveProductAsync`](#archiveproduct) | Archives a product. |
| [`UnarchiveProductAsync`](#unarchiveproduct) | Restores a product. |
| [`DeleteProductAsync`](#deleteproduct) | Permanently deletes an unused product. |

</div>

## Method details

<div class="method-entry" markdown="1">

### createProduct { #createproduct data-method-ts="createProduct" data-method-net="CreateProductAsync" }

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

Create an active product with a globally unique, immutable key.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createProduct(dto: CreateProductDto): Promise<ProductDto>
```

</div>

**Parameters**

- `dto`: [CreateProductDto](#CreateProductDto) with the product key and label.

**Returns** <code><a href="#ProductDto">ProductDto</a></code>: Product details, associated features, and the add-on catalog.

**Example**

```typescript
await subscrio.products.createProduct({
  key: 'pro-suite',
  displayName: 'Pro Suite',
  description: 'Advanced subscription plans'
});
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationError`: The key or product properties are invalid.
- `ConflictError`: The product key is already in use.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<ProductDto> CreateProductAsync(CreateProductDto dto)
```

</div>

**Parameters**

- `dto`: [CreateProductDto](#CreateProductDto) with the product key and label.

**Returns** <code><a href="#ProductDto">ProductDto</a></code>: Product details, associated features, and the add-on catalog.

**Example**

```csharp
await subscrio.Products.CreateProductAsync(new CreateProductDto(
    Key: "pro-suite",
    DisplayName: "Pro Suite",
    Description: "Advanced subscription plans"));
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationException`: The key or product properties are invalid.
- `ConflictException`: The product key is already in use.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### updateProduct { #updateproduct data-method-ts="updateProduct" data-method-net="UpdateProductAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="input-properties-updateproductdto" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="input-properties_2" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>

Update the label, description, or metadata without changing the product key.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
updateProduct(key: string, dto: UpdateProductDto): Promise<ProductDto>
```

</div>

**Parameters**

- `key`: Product to update.
- `dto`: [UpdateProductDto](#UpdateProductDto). Uses [partial updates](getting-started.md#partial-updates).

**Returns** <code><a href="#ProductDto">ProductDto</a></code>: Product details, associated features, and the add-on catalog.

**Example**

```typescript
// pro-suite exists.
await subscrio.products.updateProduct('pro-suite', {
  displayName: 'Pro Suite Plus',
  metadata: { tier: 'pro' }
});
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationError`: The supplied properties are invalid.
- `NotFoundError`: The product does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<ProductDto> UpdateProductAsync(string key, UpdateProductDto dto)
```

</div>

**Parameters**

- `key`: Product to update.
- `dto`: [UpdateProductDto](#UpdateProductDto). Uses [partial updates](getting-started.md#partial-updates).

**Returns** <code><a href="#ProductDto">ProductDto</a></code>: Product details, associated features, and the add-on catalog.

**Example**

```csharp
// pro-suite exists.
await subscrio.Products.UpdateProductAsync("pro-suite", new UpdateProductDto(
    DisplayName: "Pro Suite Plus",
    Metadata: new() { ["tier"] = "pro" }));
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationException`: The supplied properties are invalid.
- `NotFoundException`: The product does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getProduct { #getproduct data-method-ts="getProduct" data-method-net="GetProductAsync" }

<span id="description_2" class="compatibility-anchor"></span>
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

Retrieve a product by its key, including archived products.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getProduct(key: string): Promise<ProductDto | null>
```

</div>

**Parameters**

- `key`: Product key.

**Returns** <code><a href="#ProductDto">ProductDto</a> | null</code>: Product with related catalog snapshots, or null when absent.

**Example**

```typescript
const product = await subscrio.products.getProduct('pro-suite');
console.log(product?.features);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<ProductDto?> GetProductAsync(string key)
```

</div>

**Parameters**

- `key`: Product key.

**Returns** <code><a href="#ProductDto">ProductDto</a>?</code>: Product with related catalog snapshots, or null when absent.

**Example**

```csharp
var product = await subscrio.Products.GetProductAsync("pro-suite");
Console.WriteLine(product?.Features.Count);
```

</div>

</div>

<div class="method-entry" markdown="1">

### listProducts { #listproducts data-method-ts="listProducts" data-method-net="ListProductsAsync" }

<span id="description_3" class="compatibility-anchor"></span>
<span id="signature_6" class="compatibility-anchor"></span>
<span id="inputs_6" class="compatibility-anchor"></span>
<span id="input-properties_3" class="compatibility-anchor"></span>
<span id="returns_6" class="compatibility-anchor"></span>
<span id="example_6" class="compatibility-anchor"></span>
<span id="signature_7" class="compatibility-anchor"></span>
<span id="inputs_7" class="compatibility-anchor"></span>
<span id="input-properties_4" class="compatibility-anchor"></span>
<span id="returns_7" class="compatibility-anchor"></span>
<span id="example_7" class="compatibility-anchor"></span>
<span id="expected-results_3" class="compatibility-anchor"></span>
<span id="potential-errors_3" class="compatibility-anchor"></span>

List products with filtering and pagination. TypeScript orders by creation time, newest first, regardless of supplied sort options. .NET defaults to label order and honors its sort options.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listProducts(filters?: ProductFilterDto): Promise<ProductDto[]>
```

</div>

**Parameters**

- `filters`: Optional [ProductFilterDto](#ProductFilterDto). Omitting it uses 50 records at offset zero.

**Returns** <code><a href="#ProductDto">ProductDto</a>[]</code>: Matching product snapshots, or an empty collection.

**Example**

```typescript
const products = await subscrio.products.listProducts({
  status: 'active', limit: 20, offset: 0, sortOrder: 'asc'
});
console.log(products);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: A filter or pagination value is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<ProductDto>> ListProductsAsync(ProductFilterDto? filters)
```

</div>

**Parameters**

- `filters`: Optional [ProductFilterDto](#ProductFilterDto). Omitting it uses 50 records at offset zero.

**Returns** <code>List&lt;<a href="#ProductDto">ProductDto</a>&gt;</code>: Matching product snapshots, or an empty collection.

**Example**

```csharp
var products = await subscrio.Products.ListProductsAsync(
    new ProductFilterDto(Status: "active", Limit: 20));
Console.WriteLine(products.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: A filter or pagination value is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### associateFeature { #associatefeature data-method-ts="associateFeature" data-method-net="AssociateFeatureAsync" }

<span id="description_7" class="compatibility-anchor"></span>
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

Associate a global feature with a product and optionally set how its values are resolved. Calling again updates the association's settings. Omitting the entire resolution argument preserves existing rules. Supplying options without a subscription rule resets that rule to the default subscription selection. See [How Feature Values Are Calculated](feature-resolution.md) for how the rules affect results.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
associateFeature(productKey: string, featureKey: string, resolution?: FeatureResolutionOptions): Promise<void>
```

</div>

**Parameters**

- `productKey`: Product key.
- `featureKey`: Global feature key.
- `resolution`: Optional [FeatureResolutionOptions](#FeatureResolutionOptions). Defaults depend on the feature type.

**Returns** No returned value.

**Example**

```typescript
// pro-suite and the numeric seats feature already exist.
await subscrio.products.associateFeature('pro-suite', 'seats', {
  addonRule: 'additive',
  subscriptionRule: 'most_generous'
});
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The product or feature does not exist.
- `ValidationError`: A resolution rule is invalid or incompatible with a text feature.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task AssociateFeatureAsync(string productKey, string featureKey, FeatureResolutionOptions? resolution)
```

</div>

**Parameters**

- `productKey`: Product key.
- `featureKey`: Global feature key.
- `resolution`: Optional [FeatureResolutionOptions](#FeatureResolutionOptions). Defaults depend on the feature type.

**Returns** No returned value.

**Example**

```csharp
// pro-suite and the numeric seats feature already exist.
await subscrio.Products.AssociateFeatureAsync("pro-suite", "seats",
    new FeatureResolutionOptions(
        AddonRule: "additive", SubscriptionRule: "most_generous"));
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The product or feature does not exist.
- `ValidationException`: A resolution rule is invalid or incompatible with a text feature.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### dissociateFeature { #dissociatefeature data-method-ts="dissociateFeature" data-method-net="DissociateFeatureAsync" }

<span id="description_8" class="compatibility-anchor"></span>
<span id="signature_16" class="compatibility-anchor"></span>
<span id="inputs_16" class="compatibility-anchor"></span>
<span id="returns_16" class="compatibility-anchor"></span>
<span id="example_16" class="compatibility-anchor"></span>
<span id="signature_17" class="compatibility-anchor"></span>
<span id="inputs_17" class="compatibility-anchor"></span>
<span id="returns_17" class="compatibility-anchor"></span>
<span id="example_17" class="compatibility-anchor"></span>
<span id="expected-results_8" class="compatibility-anchor"></span>
<span id="potential-errors_8" class="compatibility-anchor"></span>
<span id="related-workflows" class="compatibility-anchor"></span>
<span id="product-feature-associations-and-add-ons" class="compatibility-anchor"></span>

Remove the product-feature association. This does not delete the global feature, plan values, or subscription overrides. If both records exist, removing an absent association makes no changes.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
dissociateFeature(productKey: string, featureKey: string): Promise<void>
```

</div>

**Parameters**

- `productKey`: Product key.
- `featureKey`: Feature key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.products.dissociateFeature('pro-suite', 'seats');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The product or feature does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DissociateFeatureAsync(string productKey, string featureKey)
```

</div>

**Parameters**

- `productKey`: Product key.
- `featureKey`: Feature key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Products.DissociateFeatureAsync("pro-suite", "seats");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The product or feature does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### archiveProduct { #archiveproduct data-method-ts="archiveProduct" data-method-net="ArchiveProductAsync" }

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

Mark the product as archived, retaining its plans and feature associations. This does not archive its plans or subscriptions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
archiveProduct(key: string): Promise<ProductDto>
```

</div>

**Parameters**

- `key`: Product key.

**Returns** <code><a href="#ProductDto">ProductDto</a></code>: Product details, associated features, and the add-on catalog.

**Example**

```typescript
// pro-suite exists.
await subscrio.products.archiveProduct('pro-suite');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The product does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<ProductDto> ArchiveProductAsync(string key)
```

</div>

**Parameters**

- `key`: Product key.

**Returns** <code><a href="#ProductDto">ProductDto</a></code>: Product details, associated features, and the add-on catalog.

**Example**

```csharp
// pro-suite exists.
await subscrio.Products.ArchiveProductAsync("pro-suite");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The product does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### unarchiveProduct { #unarchiveproduct data-method-ts="unarchiveProduct" data-method-net="UnarchiveProductAsync" }

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

Restore the product to active status without changing its plans or feature associations.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
unarchiveProduct(key: string): Promise<ProductDto>
```

</div>

**Parameters**

- `key`: Product key.

**Returns** <code><a href="#ProductDto">ProductDto</a></code>: Product details, associated features, and the add-on catalog.

**Example**

```typescript
// pro-suite exists.
await subscrio.products.unarchiveProduct('pro-suite');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The product does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<ProductDto> UnarchiveProductAsync(string key)
```

</div>

**Parameters**

- `key`: Product key.

**Returns** <code><a href="#ProductDto">ProductDto</a></code>: Product details, associated features, and the add-on catalog.

**Example**

```csharp
// pro-suite exists.
await subscrio.Products.UnarchiveProductAsync("pro-suite");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The product does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### deleteProduct { #deleteproduct data-method-ts="deleteProduct" data-method-net="DeleteProductAsync" }

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

Permanently delete an archived product. All plans, including archived plans, must be removed first. Other stored references can also prevent deletion.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
deleteProduct(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: Product key.

**Returns** No returned value.

**Example**

```typescript
// pro-suite exists and is archived with no plans or other references.
await subscrio.products.deleteProduct('pro-suite');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The product does not exist.
- `DomainError`: The product is active, has plans, or has other references that block deletion.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DeleteProductAsync(string key)
```

</div>

**Parameters**

- `key`: Product key.

**Returns** No returned value.

**Example**

```csharp
// pro-suite exists and is archived with no plans or other references.
await subscrio.Products.DeleteProductAsync("pro-suite");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The product does not exist.
- `DomainException`: The product is active, has plans, or has other references that block deletion.

</details>

</div>

</div>

## Data types

Required refers to caller-supplied input fields, or guaranteed presence for returned fields. Nullability is shown in Type.

<div class="data-type" markdown="1">

### CreateProductDto { #CreateProductDto }

Properties for a new product.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Immutable key, 1 to 255 lowercase letters, digits, and hyphens. |
| `displayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application-defined metadata. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Immutable key, 1 to 255 lowercase letters, digits, and hyphens. |
| `DisplayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application-defined metadata. |

</div>

</div>

<div class="data-type" markdown="1">

### ProductDto { #ProductDto }

Product details and related catalog snapshots.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `addons` | <code><a href="../addons/#AddonDto">AddonDto</a>[]</code> | Yes | Not applicable | Related [add-on definitions](addons.md#AddonDto). |
| `features` | <code>{ featureKey: string; resolution: <a href="#FeatureResolutionOptions">FeatureResolutionOptions</a>; }[]</code> | Yes | Not applicable | Associated feature keys and resolution options. See [ProductFeatureDto](#ProductFeatureDto) for each entry. |
| `key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `displayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| null \| undefined</code> | No | Not applicable | Optional description, up to 1,000 characters. |
| `status` | <code>string</code> | Yes | Not applicable | Current record status. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| null \| undefined</code> | No | Not applicable | Application-defined metadata. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | Yes | Not applicable | Optional description, up to 1,000 characters. |
| `Status` | <code>string</code> | Yes | Not applicable | Current record status. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | Yes | Not applicable | Application-defined metadata. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |
| `Addons` | <code>List&lt;<a href="../addons/#AddonDto">AddonDto</a>&gt;</code> | Yes | Not applicable | Related [add-on definitions](addons.md#AddonDto). |
| `Features` | <code>List&lt;<a href="#ProductFeatureDto">ProductFeatureDto</a>&gt;</code> | Yes | Not applicable | Associated feature keys and resolution options. See [ProductFeatureDto](#ProductFeatureDto) for each entry. |

</div>

</div>

<div class="data-type" markdown="1">

### UpdateProductDto { #UpdateProductDto }

Editable product properties. Uses [partial updates](getting-started.md#partial-updates).

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `displayName` | <code>string \| undefined</code> | No | None | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Replacement description, at most 1,000 characters. Null is rejected. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Replaces the saved metadata; an empty object clears its entries. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `DisplayName` | <code>string?</code> | No | null | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | No | null | Replacement description, at most 1,000 characters. Null retains the saved value. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Replaces the saved metadata; an empty object clears its entries. |

</div>

</div>

<div class="data-type" markdown="1">

### ProductFilterDto { #ProductFilterDto }

Filtering and pagination for products. In TypeScript, a supplied filter object requires limit, offset, and sortOrder; the whole argument can be omitted.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `sortOrder` | <code>&quot;asc&quot; \| &quot;desc&quot;</code> | Yes | asc | Accepted but currently ignored by the query. |
| `limit` | <code>number</code> | Yes | 50 | Maximum page size, 1 to 100. |
| `offset` | <code>number</code> | Yes | 0 | Nonnegative number of rows to skip. |
| `sortBy` | <code>&quot;displayName&quot; \| &quot;createdAt&quot; \| undefined</code> | No | None | Accepted values: displayName or createdAt. Currently ignored; results are newest first. |
| `status` | <code>&quot;active&quot; \| &quot;archived&quot; \| undefined</code> | No | None | Filter by active or archived status. |
| `search` | <code>string \| undefined</code> | No | None | Matches product key or label without case sensitivity. When supplied with status, the search predicate takes precedence in the current TypeScript query. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Status` | <code>string?</code> | No | null | Filter by active or archived status. |
| `Search` | <code>string?</code> | No | null | Matches product key or label; case sensitivity follows the database collation. Combines with status. |
| `Limit` | <code>int</code> | No | 50 | Maximum page size, 1 to 100. |
| `Offset` | <code>int</code> | No | 0 | Nonnegative number of rows to skip. |
| `SortBy` | <code>string?</code> | No | null | displayName or createdAt. Without this value, sorts by displayName. |
| `SortOrder` | <code>string</code> | No | asc | asc or desc; applied when SortBy is supplied. |

</div>

</div>

<div class="data-type" markdown="1">

### FeatureResolutionOptions { #FeatureResolutionOptions }

Rules on the product-feature relationship. Text features allow only override_wins as an explicit rule.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `addonRule` | <code>FeatureValueRule \| undefined</code> | No | None | Combines add-ons: additive, most_generous, or override_wins. A new association defaults to additive for numeric/metered, most_generous for toggle, and override_wins for text. Omission preserves an existing add-on rule. |
| `subscriptionRule` | <code>FeatureValueRule \| null \| undefined</code> | No | None | Combines eligible subscriptions: additive, most_generous, or override_wins. Null or omission inside supplied options restores default subscription selection. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `AddonRule` | <code>string?</code> | No | null | Combines add-ons: additive, most_generous, or override_wins. A new association defaults to additive for numeric/metered, most_generous for toggle, and override_wins for text. Omission preserves an existing add-on rule. |
| `SubscriptionRule` | <code>string?</code> | No | null | Combines eligible subscriptions: additive, most_generous, or override_wins. Null or omission inside supplied options restores default subscription selection. |

</div>

</div>

<div class="data-type" markdown="1">

### ProductFeatureDto { #ProductFeatureDto }

An associated feature and its resolution settings. TypeScript uses this anonymous entry shape inside ProductDto.features.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `featureKey` | `string` | Yes | Not applicable | Associated global feature key. |
| `resolution` | [FeatureResolutionOptions](#FeatureResolutionOptions) | Yes | Not applicable | Rules currently stored for this association. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `FeatureKey` | `string` | Yes | Not applicable | Associated global feature key. |
| `Resolution` | [FeatureResolutionOptions](#FeatureResolutionOptions) | Yes | Not applicable | Rules currently stored for this association. |

</div>

</div>

## Related guides

- [Features](features.md): define the global feature catalog.
- [Plans](plans.md): assign plan-specific feature values.
- [How Feature Values Are Calculated](feature-resolution.md): understand value selection.
- [Add-ons](addons.md): define reusable contributions for this product.
