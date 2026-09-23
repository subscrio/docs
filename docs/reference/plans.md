---
title: Plans
description: Manage plans, plan feature values, and expiration-transition targets.
reference_format: true
---

# Plans

## Purpose

<span id="dto-reference" class="compatibility-anchor"></span>

<span id="method-reference" class="compatibility-anchor"></span>

<span id="overview" class="compatibility-anchor"></span>

Plans define the feature values offered by a product. Billing cycles provide their billing cadence, and subscriptions select a plan through a billing cycle. Plans can also nominate a billing cycle to use after expiration.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const plans = subscrio.plans;
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core.Application.DTOs;

var plans = subscrio.Plans;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`createPlan`](#createplan) | Creates an active plan. |
| [`updatePlan`](#updateplan) | Updates plan details or its transition target. |
| [`getPlan`](#getplan) | Gets a plan or null. |
| [`listPlans`](#listplans) | Lists matching plans. |
| [`getPlansByProduct`](#getplansbyproduct) | Lists all plans for a product. |
| [`setFeatureValue`](#setfeaturevalue) | Sets a plan feature value. |
| [`removeFeatureValue`](#removefeaturevalue) | Removes a plan feature value. |
| [`getFeatureValue`](#getfeaturevalue) | Reads a stored plan value. |
| [`getPlanFeatures`](#getplanfeatures) | Lists stored plan feature values. |
| [`archivePlan`](#archiveplan) | Archives a plan. |
| [`unarchivePlan`](#unarchiveplan) | Restores a plan. |
| [`deletePlan`](#deleteplan) | Permanently deletes an unused plan. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`CreatePlanAsync`](#createplan) | Creates an active plan. |
| [`UpdatePlanAsync`](#updateplan) | Updates plan details or its transition target. |
| [`GetPlanAsync`](#getplan) | Gets a plan or null. |
| [`ListPlansAsync`](#listplans) | Lists matching plans. |
| [`GetPlansByProductAsync`](#getplansbyproduct) | Lists all plans for a product. |
| [`SetFeatureValueAsync`](#setfeaturevalue) | Sets a plan feature value. |
| [`RemoveFeatureValueAsync`](#removefeaturevalue) | Removes a plan feature value. |
| [`GetFeatureValueAsync`](#getfeaturevalue) | Reads a stored plan value. |
| [`GetPlanFeaturesAsync`](#getplanfeatures) | Lists stored plan feature values. |
| [`ArchivePlanAsync`](#archiveplan) | Archives a plan. |
| [`UnarchivePlanAsync`](#unarchiveplan) | Restores a plan. |
| [`DeletePlanAsync`](#deleteplan) | Permanently deletes an unused plan. |

</div>

## Method details

<div class="method-entry" markdown="1">

### createPlan { #createplan data-method-ts="createPlan" data-method-net="CreatePlanAsync" }

<span id="description" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="input-properties-createplandto" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="return-properties" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="input-properties-createplandto_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="return-properties_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>

Create an active plan under an existing product. The plan key is globally unique and cannot be changed. Assign feature values after creation.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createPlan(dto: CreatePlanDto): Promise<PlanDto>
```

</div>

**Parameters**

- `dto`: [CreatePlanDto](#CreatePlanDto) with its product, key, and label.

**Returns** <code><a href="#PlanDto">PlanDto</a></code>: Saved plan details and its product's add-on catalog.

**Example**

```typescript
// pro-suite exists.
await subscrio.plans.createPlan({
  productKey: 'pro-suite', key: 'pro', displayName: 'Pro'
});
```

<details class="method-errors" markdown="1">
<summary>Errors (4)</summary>

- `ValidationError`: The plan properties are invalid.
- `ConflictError`: The plan key already exists.
- `NotFoundError`: The product is missing.
- `Error`: The specified expiration billing cycle does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<PlanDto> CreatePlanAsync(CreatePlanDto dto)
```

</div>

**Parameters**

- `dto`: [CreatePlanDto](#CreatePlanDto) with its product, key, and label.

**Returns** <code><a href="#PlanDto">PlanDto</a></code>: Saved plan details and its product's add-on catalog.

**Example**

```csharp
// pro-suite exists.
await subscrio.Plans.CreatePlanAsync(new CreatePlanDto(
    ProductKey: "pro-suite", Key: "pro", DisplayName: "Pro"));
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationException`: The plan properties are invalid.
- `ConflictException`: The plan key already exists.
- `NotFoundException`: The product or specified expiration billing cycle is missing.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### updatePlan { #updateplan data-method-ts="updatePlan" data-method-net="UpdatePlanAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="input-properties-updateplandto" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="input-properties-updateplandto_1" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>

Update mutable plan details without changing its key or product. Use the explicit clear flag to remove an expiration-transition target; the clear flag takes precedence over a supplied target. Changing the target does not itself transition subscriptions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
updatePlan(planKey: string, dto: UpdatePlanDto): Promise<PlanDto>
```

</div>

**Parameters**

- `planKey`: Plan to update.
- `dto`: [UpdatePlanDto](#UpdatePlanDto). Uses [partial updates](getting-started.md#partial-updates).

**Returns** <code><a href="#PlanDto">PlanDto</a></code>: Saved plan details and its product's add-on catalog.

**Example**

```typescript
await subscrio.plans.updatePlan('pro', {
  clearOnExpireTransitionToBillingCycleKey: true
});
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationError`: A supplied property is invalid.
- `NotFoundError`: The plan does not exist.
- `Error`: The specified expiration billing cycle does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<PlanDto> UpdatePlanAsync(string planKey, UpdatePlanDto dto)
```

</div>

**Parameters**

- `planKey`: Plan to update.
- `dto`: [UpdatePlanDto](#UpdatePlanDto). Uses [partial updates](getting-started.md#partial-updates).

**Returns** <code><a href="#PlanDto">PlanDto</a></code>: Saved plan details and its product's add-on catalog.

**Example**

```csharp
await subscrio.Plans.UpdatePlanAsync("pro", new UpdatePlanDto(
    ClearOnExpireTransitionToBillingCycleKey: true));
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationException`: A supplied property is invalid.
- `NotFoundException`: The plan or specified expiration billing cycle does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getPlan { #getplan data-method-ts="getPlan" data-method-net="GetPlanAsync" }

<span id="description_2" class="compatibility-anchor"></span>
<span id="signature_4" class="compatibility-anchor"></span>
<span id="inputs_4" class="compatibility-anchor"></span>
<span id="returns_4" class="compatibility-anchor"></span>
<span id="return-properties_2" class="compatibility-anchor"></span>
<span id="example_4" class="compatibility-anchor"></span>
<span id="signature_5" class="compatibility-anchor"></span>
<span id="inputs_5" class="compatibility-anchor"></span>
<span id="returns_5" class="compatibility-anchor"></span>
<span id="return-properties_3" class="compatibility-anchor"></span>
<span id="example_5" class="compatibility-anchor"></span>
<span id="expected-results_2" class="compatibility-anchor"></span>
<span id="potential-errors_2" class="compatibility-anchor"></span>

Retrieve a plan definition, including archived plans.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getPlan(planKey: string): Promise<PlanDto | null>
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** <code><a href="#PlanDto">PlanDto</a> | null</code>: Plan and add-on catalog, or null when missing.

**Example**

```typescript
const plan = await subscrio.plans.getPlan('pro');
console.log(plan?.addons);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<PlanDto?> GetPlanAsync(string planKey)
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** <code><a href="#PlanDto">PlanDto</a>?</code>: Plan and add-on catalog, or null when missing.

**Example**

```csharp
var plan = await subscrio.Plans.GetPlanAsync("pro");
Console.WriteLine(plan?.Addons.Count);
```

</div>

</div>

<div class="method-entry" markdown="1">

### listPlans { #listplans data-method-ts="listPlans" data-method-net="ListPlansAsync" }

<span id="description_3" class="compatibility-anchor"></span>
<span id="signature_6" class="compatibility-anchor"></span>
<span id="inputs_6" class="compatibility-anchor"></span>
<span id="input-properties-planfilterdto" class="compatibility-anchor"></span>
<span id="returns_6" class="compatibility-anchor"></span>
<span id="return-properties_4" class="compatibility-anchor"></span>
<span id="example_6" class="compatibility-anchor"></span>
<span id="signature_7" class="compatibility-anchor"></span>
<span id="inputs_7" class="compatibility-anchor"></span>
<span id="input-properties-planfilterdto_1" class="compatibility-anchor"></span>
<span id="returns_7" class="compatibility-anchor"></span>
<span id="return-properties_5" class="compatibility-anchor"></span>
<span id="example_7" class="compatibility-anchor"></span>
<span id="expected-results_3" class="compatibility-anchor"></span>
<span id="potential-errors_3" class="compatibility-anchor"></span>

List plans with filtering, sorting, and pagination. TypeScript defaults to creation time ascending; .NET defaults to display name ascending.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listPlans(filters?: PlanFilterDto): Promise<PlanDto[]>
```

</div>

**Parameters**

- `filters`: Optional [PlanFilterDto](#PlanFilterDto). Defaults to 50 records at offset zero.

**Returns** <code><a href="#PlanDto">PlanDto</a>[]</code>: Matching plans and add-on catalogs, or an empty collection.

**Example**

```typescript
const plans = await subscrio.plans.listPlans({
  productKey: 'pro-suite', status: 'active', limit: 20, offset: 0
});
console.log(plans);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: A filter or pagination value is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<PlanDto>> ListPlansAsync(PlanFilterDto? filters)
```

</div>

**Parameters**

- `filters`: Optional [PlanFilterDto](#PlanFilterDto). Defaults to 50 records at offset zero.

**Returns** <code>List&lt;<a href="#PlanDto">PlanDto</a>&gt;</code>: Matching plans and add-on catalogs, or an empty collection.

**Example**

```csharp
var plans = await subscrio.Plans.ListPlansAsync(
    new PlanFilterDto(ProductKey: "pro-suite", Status: "active", Limit: 20));
Console.WriteLine(plans.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: A filter or pagination value is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getPlansByProduct { #getplansbyproduct data-method-ts="getPlansByProduct" data-method-net="GetPlansByProductAsync" }

<span id="description_4" class="compatibility-anchor"></span>
<span id="signature_8" class="compatibility-anchor"></span>
<span id="inputs_8" class="compatibility-anchor"></span>
<span id="returns_8" class="compatibility-anchor"></span>
<span id="return-properties_6" class="compatibility-anchor"></span>
<span id="example_8" class="compatibility-anchor"></span>
<span id="signature_9" class="compatibility-anchor"></span>
<span id="inputs_9" class="compatibility-anchor"></span>
<span id="returns_9" class="compatibility-anchor"></span>
<span id="return-properties_7" class="compatibility-anchor"></span>
<span id="example_9" class="compatibility-anchor"></span>
<span id="expected-results_4" class="compatibility-anchor"></span>
<span id="potential-errors_4" class="compatibility-anchor"></span>

List every plan belonging to a product, including archived plans. This method does not paginate.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getPlansByProduct(productKey: string): Promise<PlanDto[]>
```

</div>

**Parameters**

- `productKey`: Product key.

**Returns** <code><a href="#PlanDto">PlanDto</a>[]</code>: Product plans, or an empty collection when none exist.

**Example**

```typescript
const plans = await subscrio.plans.getPlansByProduct('pro-suite');
console.log(plans);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The product does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<PlanDto>> GetPlansByProductAsync(string productKey)
```

</div>

**Parameters**

- `productKey`: Product key.

**Returns** <code>List&lt;<a href="#PlanDto">PlanDto</a>&gt;</code>: Product plans, or an empty collection when none exist.

**Example**

```csharp
var plans = await subscrio.Plans.GetPlansByProductAsync("pro-suite");
Console.WriteLine(plans.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The product does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### setFeatureValue { #setfeaturevalue data-method-ts="setFeatureValue" data-method-net="SetFeatureValueAsync" }

<span id="description_8" class="compatibility-anchor"></span>
<span id="signature_16" class="compatibility-anchor"></span>
<span id="inputs_16" class="compatibility-anchor"></span>
<span id="input-properties" class="compatibility-anchor"></span>
<span id="returns_16" class="compatibility-anchor"></span>
<span id="example_16" class="compatibility-anchor"></span>
<span id="expected-results_8" class="compatibility-anchor"></span>
<span id="potential-errors_8" class="compatibility-anchor"></span>

Set or replace a plan's value for a feature associated with its product. This value participates in feature resolution; it does not change the global feature default.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
setFeatureValue(planKey: string, featureKey: string, value: string): Promise<void>
```

</div>

**Parameters**

- `planKey`: Plan key.
- `featureKey`: Global feature key.
- `value`: Value stored as a string; must be valid for the feature type.

**Returns** No returned value.

**Example**

```typescript
// pro exists; seats is associated with its product.
await subscrio.plans.setFeatureValue('pro', 'seats', '20');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The plan or feature does not exist.
- `ValidationError`: The feature is not associated with the plan's product, or the value is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task SetFeatureValueAsync(string planKey, string featureKey, string value)
```

</div>

**Parameters**

- `planKey`: Plan key.
- `featureKey`: Global feature key.
- `value`: Value stored as a string; must be valid for the feature type.

**Returns** No returned value.

**Example**

```csharp
// pro exists; seats is associated with its product.
await subscrio.Plans.SetFeatureValueAsync("pro", "seats", "20");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The plan or feature does not exist.
- `ValidationException`: The feature is not associated with the plan's product, or the value is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### removeFeatureValue { #removefeaturevalue data-method-ts="removeFeatureValue" data-method-net="RemoveFeatureValueAsync" }

<span id="description_9" class="compatibility-anchor"></span>
<span id="signature_17" class="compatibility-anchor"></span>
<span id="inputs_17" class="compatibility-anchor"></span>
<span id="returns_17" class="compatibility-anchor"></span>
<span id="example_17" class="compatibility-anchor"></span>
<span id="signature_18" class="compatibility-anchor"></span>
<span id="inputs_18" class="compatibility-anchor"></span>
<span id="returns_18" class="compatibility-anchor"></span>
<span id="example_18" class="compatibility-anchor"></span>
<span id="expected-results_9" class="compatibility-anchor"></span>
<span id="potential-errors_9" class="compatibility-anchor"></span>

Remove the stored plan value. Feature resolution can then fall back to the feature default unless another applicable source supplies a value. Removing an absent value makes no changes.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
removeFeatureValue(planKey: string, featureKey: string): Promise<void>
```

</div>

**Parameters**

- `planKey`: Plan key.
- `featureKey`: Global feature key.

**Returns** No returned value.

**Example**

```typescript
// pro exists; seats is associated with its product.
await subscrio.plans.removeFeatureValue('pro', 'seats');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The plan or feature does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task RemoveFeatureValueAsync(string planKey, string featureKey)
```

</div>

**Parameters**

- `planKey`: Plan key.
- `featureKey`: Global feature key.

**Returns** No returned value.

**Example**

```csharp
// pro exists; seats is associated with its product.
await subscrio.Plans.RemoveFeatureValueAsync("pro", "seats");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The plan or feature does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getFeatureValue { #getfeaturevalue data-method-ts="getFeatureValue" data-method-net="GetFeatureValueAsync" }

<span id="description_10" class="compatibility-anchor"></span>
<span id="signature_19" class="compatibility-anchor"></span>
<span id="inputs_19" class="compatibility-anchor"></span>
<span id="returns_19" class="compatibility-anchor"></span>
<span id="return-properties_8" class="compatibility-anchor"></span>
<span id="example_19" class="compatibility-anchor"></span>
<span id="signature_20" class="compatibility-anchor"></span>
<span id="inputs_20" class="compatibility-anchor"></span>
<span id="returns_20" class="compatibility-anchor"></span>
<span id="return-properties_9" class="compatibility-anchor"></span>
<span id="example_20" class="compatibility-anchor"></span>
<span id="expected-results_10" class="compatibility-anchor"></span>
<span id="potential-errors_10" class="compatibility-anchor"></span>

Read the stored plan value directly. This does not resolve subscription overrides or add-ons.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getFeatureValue(planKey: string, featureKey: string): Promise<string | null>
```

</div>

**Parameters**

- `planKey`: Plan key.
- `featureKey`: Global feature key.

**Returns** `string | null`: Stored value, or null if the feature or value is missing.

**Example**

```typescript
// pro exists; seats is associated with its product.
const value = await subscrio.plans.getFeatureValue('pro', 'seats');
console.log(value);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The plan does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<string?> GetFeatureValueAsync(string planKey, string featureKey)
```

</div>

**Parameters**

- `planKey`: Plan key.
- `featureKey`: Global feature key.

**Returns** `string?`: Stored value, or null if the feature or value is missing.

**Example**

```csharp
// pro exists; seats is associated with its product.
var value = await subscrio.Plans.GetFeatureValueAsync("pro", "seats");
Console.WriteLine(value);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The plan does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getPlanFeatures { #getplanfeatures data-method-ts="getPlanFeatures" data-method-net="GetPlanFeaturesAsync" }

<span id="description_11" class="compatibility-anchor"></span>
<span id="signature_21" class="compatibility-anchor"></span>
<span id="inputs_21" class="compatibility-anchor"></span>
<span id="returns_21" class="compatibility-anchor"></span>
<span id="return-properties_10" class="compatibility-anchor"></span>
<span id="example_21" class="compatibility-anchor"></span>
<span id="signature_22" class="compatibility-anchor"></span>
<span id="inputs_22" class="compatibility-anchor"></span>
<span id="returns_22" class="compatibility-anchor"></span>
<span id="return-properties_11" class="compatibility-anchor"></span>
<span id="example_22" class="compatibility-anchor"></span>
<span id="expected-results_11" class="compatibility-anchor"></span>
<span id="potential-errors_11" class="compatibility-anchor"></span>
<span id="createplandto" class="compatibility-anchor"></span>
<span id="updateplandto" class="compatibility-anchor"></span>
<span id="plandto" class="compatibility-anchor"></span>
<span id="planfilterdto" class="compatibility-anchor"></span>
<span id="related-workflows" class="compatibility-anchor"></span>
<span id="plan-credit-grants" class="compatibility-anchor"></span>
<span id="add-ons-in-plan-results" class="compatibility-anchor"></span>

List the feature values explicitly stored on a plan. Features using only their global defaults are not included.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getPlanFeatures(planKey: string): Promise<{ featureKey: string; value: string; }[]>
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** <code>Array&lt;{ featureKey: string; value: string }&gt;</code>: [Stored feature-value entries](#PlanFeatureDto); empty when none are set.

**Example**

```typescript
const values = await subscrio.plans.getPlanFeatures('pro');
console.log(values);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The plan does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<PlanFeatureDto>> GetPlanFeaturesAsync(string planKey)
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** <code>List&lt;<a href="#PlanFeatureDto">PlanFeatureDto</a>&gt;</code>: Stored feature values; empty when none are set.

**Example**

```csharp
var values = await subscrio.Plans.GetPlanFeaturesAsync("pro");
Console.WriteLine(values.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The plan does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### archivePlan { #archiveplan data-method-ts="archivePlan" data-method-net="ArchivePlanAsync" }

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

Mark the plan as archived while retaining its feature values and billing cycles. Existing subscriptions are not cancelled by this operation.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
archivePlan(planKey: string): Promise<void>
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** No returned value.

**Example**

```typescript
// pro exists.
await subscrio.plans.archivePlan('pro');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The plan does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task ArchivePlanAsync(string planKey)
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** No returned value.

**Example**

```csharp
// pro exists.
await subscrio.Plans.ArchivePlanAsync("pro");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The plan does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### unarchivePlan { #unarchiveplan data-method-ts="unarchivePlan" data-method-net="UnarchivePlanAsync" }

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

Restore the plan to active status, retaining its saved values and billing cycles.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
unarchivePlan(planKey: string): Promise<void>
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** No returned value.

**Example**

```typescript
// pro exists.
await subscrio.plans.unarchivePlan('pro');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The plan does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task UnarchivePlanAsync(string planKey)
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** No returned value.

**Example**

```csharp
// pro exists.
await subscrio.Plans.UnarchivePlanAsync("pro");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The plan does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### deletePlan { #deleteplan data-method-ts="deletePlan" data-method-net="DeletePlanAsync" }

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

Permanently delete an archived plan. All subscriptions and billing cycles referencing it must be removed first, regardless of their status. Cancelling subscriptions or archiving billing cycles alone does not permit deletion.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
deletePlan(planKey: string): Promise<void>
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** No returned value.

**Example**

```typescript
// pro is archived and has no references.
await subscrio.plans.deletePlan('pro');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The plan does not exist.
- `DomainError`: The plan is active or has references that block deletion.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DeletePlanAsync(string planKey)
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** No returned value.

**Example**

```csharp
// pro is archived and has no references.
await subscrio.Plans.DeletePlanAsync("pro");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The plan does not exist.
- `DomainException`: The plan is active or has references that block deletion.

</details>

</div>

</div>

## Data types

Required refers to supplied input fields or guaranteed returned properties. Type documents nullability.

<div class="data-type" markdown="1">

### CreatePlanDto { #CreatePlanDto }

Properties for a new plan.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `productKey` | <code>string</code> | Yes | None | Owning product key. |
| `key` | <code>string</code> | Yes | None | Stable identifier. |
| `displayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `onExpireTransitionToBillingCycleKey` | <code>string \| undefined</code> | No | None | Existing billing cycle to use for expiration transitions. The subscription transition processor applies this target. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application-defined metadata. Supplying it on update replaces the saved object; an empty object clears entries. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `ProductKey` | <code>string</code> | Yes | None | Owning product key. |
| `Key` | <code>string</code> | Yes | None | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `OnExpireTransitionToBillingCycleKey` | <code>string?</code> | No | null | Existing billing cycle to use for expiration transitions. The subscription transition processor applies this target. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application-defined metadata. Supplying it on update replaces the saved object; an empty object clears entries. |

</div>

</div>

<div class="data-type" markdown="1">

### PlanDto { #PlanDto }

Plan details and the owning product's add-on catalog.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `addons` | <code><a href="../addons/#AddonDto">AddonDto</a>[]</code> | Yes | Not applicable | Related [add-on definitions](addons.md#AddonDto). |
| `productKey` | <code>string</code> | Yes | Not applicable | Owning product key. |
| `key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `displayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| null \| undefined</code> | No | Not applicable | Optional description, up to 1,000 characters. |
| `status` | <code>string</code> | Yes | Not applicable | Current record status. |
| `onExpireTransitionToBillingCycleKey` | <code>string \| null \| undefined</code> | No | Not applicable | Existing billing cycle to use for expiration transitions. The subscription transition processor applies this target. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| null \| undefined</code> | No | Not applicable | Application-defined metadata. Supplying it on update replaces the saved object; an empty object clears entries. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `ProductKey` | <code>string</code> | Yes | Not applicable | Owning product key. |
| `Key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | Yes | Not applicable | Optional description, up to 1,000 characters. |
| `Status` | <code>string</code> | Yes | Not applicable | Current record status. |
| `OnExpireTransitionToBillingCycleKey` | <code>string?</code> | Yes | Not applicable | Existing billing cycle to use for expiration transitions. The subscription transition processor applies this target. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | Yes | Not applicable | Application-defined metadata. Supplying it on update replaces the saved object; an empty object clears entries. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |
| `Addons` | <code>List&lt;<a href="../addons/#AddonDto">AddonDto</a>&gt;</code> | Yes | Not applicable | Related [add-on definitions](addons.md#AddonDto). |

</div>

</div>

<div class="data-type" markdown="1">

### UpdatePlanDto { #UpdatePlanDto }

Editable plan properties. Uses [partial updates](getting-started.md#partial-updates).

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `displayName` | <code>string \| undefined</code> | No | None | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `onExpireTransitionToBillingCycleKey` | <code>string \| undefined</code> | No | None | Existing billing cycle to use for expiration transitions. The subscription transition processor applies this target. |
| `clearOnExpireTransitionToBillingCycleKey` | <code>boolean \| undefined</code> | No | None | True removes the expiration target, even when a replacement target is also supplied. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application-defined metadata. Supplying it on update replaces the saved object; an empty object clears entries. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `DisplayName` | <code>string?</code> | No | null | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `OnExpireTransitionToBillingCycleKey` | <code>string?</code> | No | null | Existing billing cycle to use for expiration transitions. The subscription transition processor applies this target. |
| `ClearOnExpireTransitionToBillingCycleKey` | <code>bool</code> | No | false | True removes the expiration target, even when a replacement target is also supplied. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application-defined metadata. Supplying it on update replaces the saved object; an empty object clears entries. |

</div>

</div>

<div class="data-type" markdown="1">

### PlanFilterDto { #PlanFilterDto }

Filters for the plan catalog. TypeScript requires limit and offset when supplying a filter object.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `limit` | <code>number</code> | Yes | 50 | Maximum page size, 1 to 100. |
| `offset` | <code>number</code> | Yes | 0 | Nonnegative number of rows to skip. |
| `productKey` | <code>string \| undefined</code> | No | None | Restrict results to one product. |
| `status` | <code>&quot;active&quot; \| &quot;archived&quot; \| undefined</code> | No | None | Filter by active or archived status. |
| `search` | <code>string \| undefined</code> | No | None | Match plan key or display name. |
| `sortBy` | <code>&quot;displayName&quot; \| &quot;createdAt&quot; \| undefined</code> | No | None | displayName or createdAt. Defaults to createdAt. |
| `sortOrder` | <code>&quot;asc&quot; \| &quot;desc&quot; \| undefined</code> | No | None | asc or desc; defaults to asc when omitted. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `ProductKey` | <code>string?</code> | No | null | Restrict results to one product. |
| `Status` | <code>string?</code> | No | null | Filter by active or archived status. |
| `Search` | <code>string?</code> | No | null | Match plan key or display name. |
| `SortBy` | <code>string?</code> | No | null | displayName or createdAt. Defaults to displayName. |
| `SortOrder` | <code>string?</code> | No | null | asc or desc; defaults to asc when omitted. |
| `Limit` | <code>int</code> | No | 50 | Maximum page size, 1 to 100. |
| `Offset` | <code>int</code> | No | 0 | Nonnegative number of rows to skip. |

</div>

</div>

<div class="data-type" markdown="1">

### PlanFeatureDto { #PlanFeatureDto }

A stored plan feature value. TypeScript returns anonymous objects with these fields; .NET uses PlanFeatureDto.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `featureKey` | `string` | Yes | Not applicable | Feature key. |
| `value` | `string` | Yes | Not applicable | Stored value, not a resolved subscription allowance. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `FeatureKey` | `string` | Yes | Not applicable | Feature key. |
| `Value` | `string` | Yes | Not applicable | Stored value, not a resolved subscription allowance. |

</div>

</div>

## Related guides

- [Products](products.md#associatefeature): associate a feature before setting a plan value.
- [Billing Cycles](billing-cycles.md): define billing cadence and transition targets.
- [Subscription Lifecycle](subscription-lifecycle.md): expiration and transitions.
- [How Feature Values Are Calculated](feature-resolution.md): combine plan values, add-ons, and overrides.
