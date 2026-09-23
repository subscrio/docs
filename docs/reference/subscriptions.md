---
title: Subscriptions
description: Manage customer subscriptions, add-ons, overrides, and lifecycle transitions.
reference_format: true
---

# Subscriptions

## Purpose

<span id="dto-reference" class="compatibility-anchor"></span>

<span id="method-reference" class="compatibility-anchor"></span>

<span id="subscriptions-service-reference" class="compatibility-anchor"></span>
<span id="overview" class="compatibility-anchor"></span>

Subscriptions connect a customer to a plan through a billing cycle. Use this object to manage dates, attach add-ons, apply customer-specific feature overrides, and archive or transition subscriptions.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const subscriptions = subscrio.subscriptions;
```

</div>
<div class="language-content" data-lang="net" markdown="1">

```csharp
var subscriptions = subscrio.Subscriptions;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`createSubscription`](#createsubscription) | Creates a customer subscription. |
| [`updateSubscription`](#updatesubscription) | Updates dates and billing cycle. |
| [`getSubscription`](#getsubscription) | Gets a subscription or null. |
| [`listSubscriptions`](#listsubscriptions) | Lists matching subscriptions. |
| [`findSubscriptions`](#findsubscriptions) | Searches with additional date and presence filters. |
| [`getSubscriptionsByCustomer`](#getsubscriptionsbycustomer) | Lists all subscriptions for a customer. |
| [`attachAddon`](#attachaddon) | Attaches an add-on or replaces its quantity. |
| [`detachAddon`](#detachaddon) | Cancels an add-on attachment. |
| [`getAddons`](#getaddons) | Lists attachment details. |
| [`addFeatureOverride`](#addfeatureoverride) | Sets a subscription-specific feature value. |
| [`removeFeatureOverride`](#removefeatureoverride) | Removes a feature override. |
| [`clearTemporaryOverrides`](#cleartemporaryoverrides) | Removes temporary overrides. |
| [`archiveSubscription`](#archivesubscription) | Archives a subscription. |
| [`unarchiveSubscription`](#unarchivesubscription) | Restores an archived subscription. |
| [`deleteSubscription`](#deletesubscription) | Permanently deletes a subscription. |
| [`transitionExpiredSubscriptions`](#transitionexpiredsubscriptions) | Processes configured expiration transitions. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`CreateSubscriptionAsync`](#createsubscription) | Creates a customer subscription. |
| [`UpdateSubscriptionAsync`](#updatesubscription) | Updates dates and billing cycle. |
| [`GetSubscriptionAsync`](#getsubscription) | Gets a subscription or null. |
| [`ListSubscriptionsAsync`](#listsubscriptions) | Lists matching subscriptions. |
| [`FindSubscriptionsAsync`](#findsubscriptions) | Searches with additional date and presence filters. |
| [`GetSubscriptionsByCustomerAsync`](#getsubscriptionsbycustomer) | Lists all subscriptions for a customer. |
| [`AttachAddonAsync`](#attachaddon) | Attaches an add-on or replaces its quantity. |
| [`DetachAddonAsync`](#detachaddon) | Cancels an add-on attachment. |
| [`GetAddonsAsync`](#getaddons) | Lists attachment details. |
| [`AddFeatureOverrideAsync`](#addfeatureoverride) | Sets a subscription-specific feature value. |
| [`RemoveFeatureOverrideAsync`](#removefeatureoverride) | Removes a feature override. |
| [`ClearTemporaryOverridesAsync`](#cleartemporaryoverrides) | Removes temporary overrides. |
| [`ArchiveSubscriptionAsync`](#archivesubscription) | Archives a subscription. |
| [`UnarchiveSubscriptionAsync`](#unarchivesubscription) | Restores an archived subscription. |
| [`DeleteSubscriptionAsync`](#deletesubscription) | Permanently deletes a subscription. |
| [`TransitionExpiredSubscriptionsAsync`](#transitionexpiredsubscriptions) | Processes configured expiration transitions. |

</div>

## Method details

<div class="method-entry" markdown="1">

### createSubscription { #createsubscription data-method-ts="createSubscription" data-method-net="CreateSubscriptionAsync" }

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

Create a subscription using the selected billing cycle's plan and product. Activation and period start default to now; period end is calculated from the cycle unless supplied. A forever cycle has no period end. Mutations emit before and after [hooks](hooks.md).

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createSubscription(dto: CreateSubscriptionDto): Promise<SubscriptionDto>
```

</div>

**Parameters**

- `dto`: [CreateSubscriptionDto](#CreateSubscriptionDto) identifying the customer and billing cycle.

**Returns** <code><a href="#SubscriptionDto">SubscriptionDto</a></code>: Saved subscription, overrides, and add-on attachments.

**Example**

```typescript
// acme and pro-monthly exist.
await subscrio.subscriptions.createSubscription({
  key: 'acme-pro', customerKey: 'acme', billingCycleKey: 'pro-monthly'
});
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationError`: The input properties are invalid.
- `NotFoundError`: The customer, cycle, plan, or product is missing.
- `ConflictError`: The subscription key or Stripe subscription ID already exists.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<SubscriptionDto> CreateSubscriptionAsync(CreateSubscriptionDto dto)
```

</div>

**Parameters**

- `dto`: [CreateSubscriptionDto](#CreateSubscriptionDto) identifying the customer and billing cycle.

**Returns** <code><a href="#SubscriptionDto">SubscriptionDto</a></code>: Saved subscription, overrides, and add-on attachments.

**Example**

```csharp
// acme and pro-monthly exist.
await subscrio.Subscriptions.CreateSubscriptionAsync(new CreateSubscriptionDto(
    Key: "acme-pro", CustomerKey: "acme", BillingCycleKey: "pro-monthly"));
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationException`: The input properties are invalid.
- `NotFoundException`: The customer, cycle, plan, or product is missing.
- `ConflictException`: The subscription key or Stripe subscription ID already exists.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### updateSubscription { #updatesubscription data-method-ts="updateSubscription" data-method-net="UpdateSubscriptionAsync" }

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

Update a subscription that is not archived. The key, customer, and activation date cannot change. Selecting another billing cycle also changes the plan but does not recalculate the stored period dates. Supplied metadata replaces the entire object.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
updateSubscription(subscriptionKey: string, dto: UpdateSubscriptionDto): Promise<SubscriptionDto>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `dto`: [UpdateSubscriptionDto](#UpdateSubscriptionDto). Uses [partial updates](getting-started.md#partial-updates). Date nulls and empty date strings are treated as omission at runtime; use the trial-clear flag to remove a trial end.

**Returns** <code><a href="#SubscriptionDto">SubscriptionDto</a></code>: Updated subscription details.

**Example**

```typescript
await subscrio.subscriptions.updateSubscription('acme-pro', {
  clearTrialEndDate: true
});
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationError`: The updated properties are invalid.
- `NotFoundError`: The subscription or selected billing cycle is missing.
- `DomainError`: The subscription is archived.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<SubscriptionDto> UpdateSubscriptionAsync(string subscriptionKey, UpdateSubscriptionDto dto)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `dto`: [UpdateSubscriptionDto](#UpdateSubscriptionDto). Uses [partial updates](getting-started.md#partial-updates); use the trial-clear flag to remove a trial end.

**Returns** <code><a href="#SubscriptionDto">SubscriptionDto</a></code>: Updated subscription details.

**Example**

```csharp
await subscrio.Subscriptions.UpdateSubscriptionAsync("acme-pro",
    new UpdateSubscriptionDto(ClearTrialEndDate: true));
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationException`: The updated properties are invalid.
- `NotFoundException`: The subscription or selected billing cycle is missing.
- `DomainException`: The subscription is archived.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getSubscription { #getsubscription data-method-ts="getSubscription" data-method-net="GetSubscriptionAsync" }

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

Retrieve subscription details, including archived subscriptions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getSubscription(subscriptionKey: string): Promise<SubscriptionDto | null>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** <code><a href="#SubscriptionDto">SubscriptionDto</a> | null</code>: Subscription details, or null when missing.

**Example**

```typescript
const subscription = await subscrio.subscriptions.getSubscription('acme-pro');
console.log(subscription?.addons);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<SubscriptionDto?> GetSubscriptionAsync(string subscriptionKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** <code><a href="#SubscriptionDto">SubscriptionDto</a>?</code>: Subscription details, or null when missing.

**Example**

```csharp
var subscription = await subscrio.Subscriptions.GetSubscriptionAsync("acme-pro");
Console.WriteLine(subscription?.Addons.Count);
```

</div>

</div>

<div class="method-entry" markdown="1">

### listSubscriptions { #listsubscriptions data-method-ts="listSubscriptions" data-method-net="ListSubscriptionsAsync" }

<span id="description_3" class="compatibility-anchor"></span>
<span id="signature_6" class="compatibility-anchor"></span>
<span id="inputs_6" class="compatibility-anchor"></span>
<span id="input-properties_4" class="compatibility-anchor"></span>
<span id="returns_6" class="compatibility-anchor"></span>
<span id="return-properties_6" class="compatibility-anchor"></span>
<span id="example_6" class="compatibility-anchor"></span>
<span id="signature_7" class="compatibility-anchor"></span>
<span id="inputs_7" class="compatibility-anchor"></span>
<span id="input-properties_5" class="compatibility-anchor"></span>
<span id="returns_7" class="compatibility-anchor"></span>
<span id="return-properties_7" class="compatibility-anchor"></span>
<span id="example_7" class="compatibility-anchor"></span>
<span id="expected-results_3" class="compatibility-anchor"></span>
<span id="potential-errors_3" class="compatibility-anchor"></span>

List subscriptions with pagination, including archived records unless filtered out. Missing customer, plan, or product filter keys return an empty collection.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listSubscriptions(filters?: SubscriptionFilterDto): Promise<SubscriptionDto[]>
```

</div>

**Parameters**

- `filters`: [SubscriptionFilterDto](#SubscriptionFilterDto). Optional; defaults to 50 results at offset zero.

**Returns** <code><a href="#SubscriptionDto">SubscriptionDto</a>[]</code>: Matching subscriptions with customer details, overrides, and attachments.

**Example**

```typescript
const matches = await subscrio.subscriptions.listSubscriptions({
  customerKey: 'acme', isArchived: false, limit: 20, offset: 0
});
console.log(matches);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: The filter values are invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<SubscriptionDto>> ListSubscriptionsAsync(SubscriptionFilterDto? filters)
```

</div>

**Parameters**

- `filters`: [SubscriptionFilterDto](#SubscriptionFilterDto). Optional; defaults to 50 results at offset zero.

**Returns** <code>List&lt;<a href="#SubscriptionDto">SubscriptionDto</a>&gt;</code>: Matching subscriptions with customer details, overrides, and attachments.

**Example**

```csharp
var matches = await subscrio.Subscriptions.ListSubscriptionsAsync(
    new SubscriptionFilterDto(CustomerKey: "acme", IsArchived: false, Limit: 20));
Console.WriteLine(matches.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: The filter values are invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### findSubscriptions { #findsubscriptions data-method-ts="findSubscriptions" data-method-net="FindSubscriptionsAsync" }

<span id="description_4" class="compatibility-anchor"></span>
<span id="signature_8" class="compatibility-anchor"></span>
<span id="inputs_8" class="compatibility-anchor"></span>
<span id="input-properties_6" class="compatibility-anchor"></span>
<span id="returns_8" class="compatibility-anchor"></span>
<span id="return-properties_8" class="compatibility-anchor"></span>
<span id="example_8" class="compatibility-anchor"></span>
<span id="signature_9" class="compatibility-anchor"></span>
<span id="inputs_9" class="compatibility-anchor"></span>
<span id="input-properties_7" class="compatibility-anchor"></span>
<span id="returns_9" class="compatibility-anchor"></span>
<span id="return-properties_9" class="compatibility-anchor"></span>
<span id="example_9" class="compatibility-anchor"></span>
<span id="expected-results_4" class="compatibility-anchor"></span>
<span id="potential-errors_4" class="compatibility-anchor"></span>

Search subscriptions using additional date and presence filters. The override-presence check runs after pagination, so a page can contain fewer results than requested. Feature-key and metadata filters are currently ignored in both libraries.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
findSubscriptions(filters: DetailedSubscriptionFilterDto): Promise<SubscriptionDto[]>
```

</div>

**Parameters**

- `filters`: [DetailedSubscriptionFilterDto](#DetailedSubscriptionFilterDto).

**Returns** <code><a href="#SubscriptionDto">SubscriptionDto</a>[]</code>: Matching subscriptions with customer details, overrides, and attachments.

**Example**

```typescript
const matches = await subscrio.subscriptions.findSubscriptions({
  customerKey: 'acme', isArchived: false, limit: 20, offset: 0
});
console.log(matches);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: The filter values are invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<SubscriptionDto>> FindSubscriptionsAsync(DetailedSubscriptionFilterDto filters)
```

</div>

**Parameters**

- `filters`: [DetailedSubscriptionFilterDto](#DetailedSubscriptionFilterDto).

**Returns** <code>List&lt;<a href="#SubscriptionDto">SubscriptionDto</a>&gt;</code>: Matching subscriptions with customer details, overrides, and attachments.

**Example**

```csharp
var matches = await subscrio.Subscriptions.FindSubscriptionsAsync(
    new DetailedSubscriptionFilterDto(CustomerKey: "acme", IsArchived: false, Limit: 20));
Console.WriteLine(matches.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: The filter values are invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getSubscriptionsByCustomer { #getsubscriptionsbycustomer data-method-ts="getSubscriptionsByCustomer" data-method-net="GetSubscriptionsByCustomerAsync" }

<span id="description_5" class="compatibility-anchor"></span>
<span id="signature_10" class="compatibility-anchor"></span>
<span id="inputs_10" class="compatibility-anchor"></span>
<span id="returns_10" class="compatibility-anchor"></span>
<span id="return-properties_10" class="compatibility-anchor"></span>
<span id="example_10" class="compatibility-anchor"></span>
<span id="signature_11" class="compatibility-anchor"></span>
<span id="inputs_11" class="compatibility-anchor"></span>
<span id="returns_11" class="compatibility-anchor"></span>
<span id="return-properties_11" class="compatibility-anchor"></span>
<span id="example_11" class="compatibility-anchor"></span>
<span id="expected-results_5" class="compatibility-anchor"></span>
<span id="potential-errors_5" class="compatibility-anchor"></span>

Retrieve every subscription for the customer, including archived subscriptions. This lookup does not paginate.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getSubscriptionsByCustomer(customerKey: string): Promise<SubscriptionDto[]>
```

</div>

**Parameters**

- `customerKey`: Customer key.

**Returns** <code><a href="#SubscriptionDto">SubscriptionDto</a>[]</code>: Customer subscriptions, or an empty collection.

**Example**

```typescript
const subscriptions = await subscrio.subscriptions.getSubscriptionsByCustomer('acme');
console.log(subscriptions);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The customer does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<SubscriptionDto>> GetSubscriptionsByCustomerAsync(string customerKey)
```

</div>

**Parameters**

- `customerKey`: Customer key.

**Returns** <code>List&lt;<a href="#SubscriptionDto">SubscriptionDto</a>&gt;</code>: Customer subscriptions, or an empty collection.

**Example**

```csharp
var subscriptions = await subscrio.Subscriptions.GetSubscriptionsByCustomerAsync("acme");
Console.WriteLine(subscriptions.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The customer does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### attachAddon { #attachaddon data-method-ts="attachAddon" data-method-net="AttachAddonAsync" }

<span id="description_13" class="compatibility-anchor"></span>
<span id="signature_26" class="compatibility-anchor"></span>
<span id="inputs_26" class="compatibility-anchor"></span>
<span id="returns_26" class="compatibility-anchor"></span>
<span id="return-properties_14" class="compatibility-anchor"></span>
<span id="example_26" class="compatibility-anchor"></span>
<span id="signature_27" class="compatibility-anchor"></span>
<span id="inputs_27" class="compatibility-anchor"></span>
<span id="returns_27" class="compatibility-anchor"></span>
<span id="return-properties_15" class="compatibility-anchor"></span>
<span id="example_27" class="compatibility-anchor"></span>
<span id="expected-results_13" class="compatibility-anchor"></span>
<span id="potential-errors_13" class="compatibility-anchor"></span>

Attach an active add-on from the subscription's product. Reattaching replaces the quantity and reactivates a cancelled attachment. The subscription must not be archived; replacement add-ons require quantity one.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
attachAddon(subscriptionKey: string, addonKey: string, quantity?: number): Promise<SubscriptionAddonDto>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `addonKey`: Add-on definition key.
- `quantity`: Optional positive integer, at most 2,147,483,647; defaults to 1.

**Returns** <code><a href="#SubscriptionAddonDto">SubscriptionAddonDto</a></code>: Saved attachment with the add-on definition.

**Example**

```typescript
// extra-seats is an additive add-on for this subscription's product.
await subscrio.subscriptions.attachAddon('acme-pro', 'extra-seats', 2);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The subscription, customer, or add-on is missing.
- `ValidationError`: The quantity, product, add-on status, or subscription archive status is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<SubscriptionAddonDto> AttachAddonAsync(string subscriptionKey, string addonKey, int quantity)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `addonKey`: Add-on definition key.
- `quantity`: Optional positive integer, at most 2,147,483,647; defaults to 1.

**Returns** <code><a href="#SubscriptionAddonDto">SubscriptionAddonDto</a></code>: Saved attachment with the add-on definition.

**Example**

```csharp
// extra-seats is an additive add-on for this subscription's product.
await subscrio.Subscriptions.AttachAddonAsync("acme-pro", "extra-seats", 2);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The subscription, customer, or add-on is missing.
- `ValidationException`: The quantity, product, add-on status, or subscription archive status is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### detachAddon { #detachaddon data-method-ts="detachAddon" data-method-net="DetachAddonAsync" }

<span id="description_14" class="compatibility-anchor"></span>
<span id="signature_28" class="compatibility-anchor"></span>
<span id="inputs_28" class="compatibility-anchor"></span>
<span id="returns_28" class="compatibility-anchor"></span>
<span id="example_28" class="compatibility-anchor"></span>
<span id="signature_29" class="compatibility-anchor"></span>
<span id="inputs_29" class="compatibility-anchor"></span>
<span id="returns_29" class="compatibility-anchor"></span>
<span id="example_29" class="compatibility-anchor"></span>
<span id="expected-results_14" class="compatibility-anchor"></span>
<span id="potential-errors_14" class="compatibility-anchor"></span>

Mark the attachment cancelled so it no longer contributes feature values. Its history remains available; calling again on an already-cancelled attachment succeeds.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
detachAddon(subscriptionKey: string, addonKey: string): Promise<void>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `addonKey`: Attached add-on key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.subscriptions.detachAddon('acme-pro', 'extra-seats');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The subscription or attachment does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DetachAddonAsync(string subscriptionKey, string addonKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `addonKey`: Attached add-on key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Subscriptions.DetachAddonAsync("acme-pro", "extra-seats");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The subscription or attachment does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getAddons { #getaddons data-method-ts="getAddons" data-method-net="GetAddonsAsync" }

<span id="description_15" class="compatibility-anchor"></span>
<span id="signature_30" class="compatibility-anchor"></span>
<span id="inputs_30" class="compatibility-anchor"></span>
<span id="input-properties_8" class="compatibility-anchor"></span>
<span id="returns_30" class="compatibility-anchor"></span>
<span id="return-properties_16" class="compatibility-anchor"></span>
<span id="example_30" class="compatibility-anchor"></span>
<span id="signature_31" class="compatibility-anchor"></span>
<span id="inputs_31" class="compatibility-anchor"></span>
<span id="returns_31" class="compatibility-anchor"></span>
<span id="return-properties_17" class="compatibility-anchor"></span>
<span id="example_31" class="compatibility-anchor"></span>
<span id="expected-results_15" class="compatibility-anchor"></span>
<span id="potential-errors_15" class="compatibility-anchor"></span>

List active and cancelled attachments in add-on-key order. Each includes the current add-on definition.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getAddons(subscriptionKey: string, filter?: PageFilter): Promise<SubscriptionAddonDto[]>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `filter`: Optional [PageFilter](addons.md#PageFilter); defaults to 50 results at offset zero.

**Returns** <code><a href="#SubscriptionAddonDto">SubscriptionAddonDto</a>[]</code>: Attachments, or an empty collection when none exist or the subscription is missing.

**Example**

```typescript
const addons = await subscrio.subscriptions.getAddons('acme-pro');
console.log(addons);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: Pagination is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<SubscriptionAddonDto>> GetAddonsAsync(string subscriptionKey, int limit, int offset)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `limit`: Optional page size, 1 to 500; defaults to 50.
- `offset`: Optional nonnegative rows to skip; defaults to 0.

**Returns** <code>List&lt;<a href="#SubscriptionAddonDto">SubscriptionAddonDto</a>&gt;</code>: Attachments, or an empty collection when none exist or the subscription is missing.

**Example**

```csharp
var addons = await subscrio.Subscriptions.GetAddonsAsync("acme-pro");
Console.WriteLine(addons.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: Pagination is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### addFeatureOverride { #addfeatureoverride data-method-ts="addFeatureOverride" data-method-net="AddFeatureOverrideAsync" }

<span id="description_9" class="compatibility-anchor"></span>
<span id="signature_18" class="compatibility-anchor"></span>
<span id="inputs_18" class="compatibility-anchor"></span>
<span id="returns_18" class="compatibility-anchor"></span>
<span id="example_18" class="compatibility-anchor"></span>
<span id="signature_19" class="compatibility-anchor"></span>
<span id="inputs_19" class="compatibility-anchor"></span>
<span id="returns_19" class="compatibility-anchor"></span>
<span id="example_19" class="compatibility-anchor"></span>
<span id="expected-results_9" class="compatibility-anchor"></span>
<span id="potential-errors_9" class="compatibility-anchor"></span>

Set a feature value specifically for this subscription, replacing any existing override for that feature. Timed overrides stop applying at their expiry but remain in returned history. The subscription must not be archived.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
addFeatureOverride(subscriptionKey: string, featureKey: string, value: string, overrideType?: OverrideType, expiresAt?: Date | string | null): Promise<void>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Feature key.
- `value`: String value valid for the feature's type.
- `overrideType`: Optional [OverrideType](#OverrideType), default Permanent.
- `expiresAt`: Required future UTC timestamp for Timed; omitted or null for other types.

**Returns** No returned value.

**Example**

```typescript
import { OverrideType } from 'subscrio';

// max-seats is a numeric feature.
await subscrio.subscriptions.addFeatureOverride(
  'acme-pro', 'max-seats', '50', OverrideType.Permanent
);
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `NotFoundError`: The subscription or feature is missing.
- `ValidationError`: The value, override type, or expiry is invalid.
- `DomainError`: The subscription is archived.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task AddFeatureOverrideAsync(string subscriptionKey, string featureKey, string value, OverrideType overrideType, DateTime? expiresAt)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Feature key.
- `value`: String value valid for the feature's type.
- `overrideType`: Optional [OverrideType](#OverrideType), default Permanent.
- `expiresAt`: Required future UTC timestamp for Timed; omitted or null for other types.

**Returns** No returned value.

**Example**

```csharp
// max-seats is a numeric feature.
await subscrio.Subscriptions.AddFeatureOverrideAsync(
    "acme-pro", "max-seats", "50",
    Subscrio.Core.Domain.ValueObjects.OverrideType.Permanent);
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `NotFoundException`: The subscription or feature is missing.
- `ValidationException`: The value, override type, or expiry is invalid.
- `DomainException`: The subscription is archived.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### removeFeatureOverride { #removefeatureoverride data-method-ts="removeFeatureOverride" data-method-net="RemoveFeatureOverrideAsync" }

<span id="description_10" class="compatibility-anchor"></span>
<span id="signature_20" class="compatibility-anchor"></span>
<span id="inputs_20" class="compatibility-anchor"></span>
<span id="returns_20" class="compatibility-anchor"></span>
<span id="example_20" class="compatibility-anchor"></span>
<span id="signature_21" class="compatibility-anchor"></span>
<span id="inputs_21" class="compatibility-anchor"></span>
<span id="returns_21" class="compatibility-anchor"></span>
<span id="example_21" class="compatibility-anchor"></span>
<span id="expected-results_10" class="compatibility-anchor"></span>
<span id="potential-errors_10" class="compatibility-anchor"></span>

Remove the override for one feature. If no override is set, the operation succeeds without adding one. The subscription must not be archived.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
removeFeatureOverride(subscriptionKey: string, featureKey: string): Promise<void>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Feature key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.subscriptions.removeFeatureOverride('acme-pro', 'max-seats');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The subscription or feature is missing.
- `DomainError`: The subscription is archived.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task RemoveFeatureOverrideAsync(string subscriptionKey, string featureKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Feature key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Subscriptions.RemoveFeatureOverrideAsync("acme-pro", "max-seats");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The subscription or feature is missing.
- `DomainException`: The subscription is archived.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### clearTemporaryOverrides { #cleartemporaryoverrides data-method-ts="clearTemporaryOverrides" data-method-net="ClearTemporaryOverridesAsync" }

<span id="description_11" class="compatibility-anchor"></span>
<span id="signature_22" class="compatibility-anchor"></span>
<span id="inputs_22" class="compatibility-anchor"></span>
<span id="returns_22" class="compatibility-anchor"></span>
<span id="example_22" class="compatibility-anchor"></span>
<span id="signature_23" class="compatibility-anchor"></span>
<span id="inputs_23" class="compatibility-anchor"></span>
<span id="returns_23" class="compatibility-anchor"></span>
<span id="example_23" class="compatibility-anchor"></span>
<span id="expected-results_11" class="compatibility-anchor"></span>
<span id="potential-errors_11" class="compatibility-anchor"></span>

Remove only Temporary overrides. Permanent and Timed overrides remain. The subscription must not be archived.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
clearTemporaryOverrides(subscriptionKey: string): Promise<void>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.subscriptions.clearTemporaryOverrides('acme-pro');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The subscription is missing.
- `DomainError`: The subscription is archived.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task ClearTemporaryOverridesAsync(string subscriptionKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Subscriptions.ClearTemporaryOverridesAsync("acme-pro");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The subscription is missing.
- `DomainException`: The subscription is archived.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### archiveSubscription { #archivesubscription data-method-ts="archiveSubscription" data-method-net="ArchiveSubscriptionAsync" }

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

Archive the subscription without changing its dates or calculated status. It cannot be updated until restored. Customer feature checks exclude archived subscriptions when an explicit cross-subscription rule is configured; the default selection behavior does not.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
archiveSubscription(subscriptionKey: string): Promise<void>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.subscriptions.archiveSubscription('acme-pro');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The subscription is missing.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task ArchiveSubscriptionAsync(string subscriptionKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Subscriptions.ArchiveSubscriptionAsync("acme-pro");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The subscription is missing.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### unarchiveSubscription { #unarchivesubscription data-method-ts="unarchiveSubscription" data-method-net="UnarchiveSubscriptionAsync" }

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

Clear the archive flag. Existing dates still determine whether the subscription is active, expired, or cancelled.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
unarchiveSubscription(subscriptionKey: string): Promise<void>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.subscriptions.unarchiveSubscription('acme-pro');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The subscription is missing.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task UnarchiveSubscriptionAsync(string subscriptionKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Subscriptions.UnarchiveSubscriptionAsync("acme-pro");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The subscription is missing.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### deleteSubscription { #deletesubscription data-method-ts="deleteSubscription" data-method-net="DeleteSubscriptionAsync" }

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

Permanently delete the subscription and dependent overrides and add-on attachments, regardless of archive status. Retained accounting history can prevent deletion.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
deleteSubscription(subscriptionKey: string): Promise<void>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.subscriptions.deleteSubscription('acme-pro');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The subscription is missing.
- `ConflictError`: Retained accounting or related history blocks deletion.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DeleteSubscriptionAsync(string subscriptionKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Subscriptions.DeleteSubscriptionAsync("acme-pro");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The subscription is missing.
- `ConflictException`: Retained accounting or related history blocks deletion.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### transitionExpiredSubscriptions { #transitionexpiredsubscriptions data-method-ts="transitionExpiredSubscriptions" data-method-net="TransitionExpiredSubscriptionsAsync" }

<span id="description_12" class="compatibility-anchor"></span>
<span id="signature_24" class="compatibility-anchor"></span>
<span id="inputs_24" class="compatibility-anchor"></span>
<span id="returns_24" class="compatibility-anchor"></span>
<span id="return-properties_12" class="compatibility-anchor"></span>
<span id="example_24" class="compatibility-anchor"></span>
<span id="signature_25" class="compatibility-anchor"></span>
<span id="inputs_25" class="compatibility-anchor"></span>
<span id="returns_25" class="compatibility-anchor"></span>
<span id="return-properties_13" class="compatibility-anchor"></span>
<span id="example_25" class="compatibility-anchor"></span>
<span id="expected-results_12" class="compatibility-anchor"></span>
<span id="potential-errors_12" class="compatibility-anchor"></span>
<span id="usage-notes" class="compatibility-anchor"></span>
<span id="createsubscriptiondto" class="compatibility-anchor"></span>
<span id="updatesubscriptiondto" class="compatibility-anchor"></span>
<span id="subscriptiondto" class="compatibility-anchor"></span>
<span id="featureoverridedto" class="compatibility-anchor"></span>
<span id="subscriptionfilterdto" class="compatibility-anchor"></span>
<span id="detailedsubscriptionfilterdto" class="compatibility-anchor"></span>
<span id="related-workflows" class="compatibility-anchor"></span>
<span id="add-ons-and-timed-overrides" class="compatibility-anchor"></span>
<span id="subscription-add-on-methods" class="compatibility-anchor"></span>

Process up to 1,000 unarchived expired subscriptions whose plans specify a transition billing cycle. Each replacement receives a versioned key and copied metadata, but no old overrides, add-ons, trial, or Stripe ID. The replacement is saved before the old subscription is archived. These writes are not one transaction; inspect the report for partial failures.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
transitionExpiredSubscriptions(): Promise<TransitionExpiredSubscriptionsReport>
```

</div>

**Returns** <code><a href="#TransitionExpiredSubscriptionsReport">TransitionExpiredSubscriptionsReport</a></code>: Counts and per-subscription failures.

**Example**

```typescript
const report = await subscrio.subscriptions.transitionExpiredSubscriptions();
console.log(report.transitioned, report.errors);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<TransitionExpiredSubscriptionsReport> TransitionExpiredSubscriptionsAsync()
```

</div>

**Returns** <code><a href="#TransitionExpiredSubscriptionsReport">TransitionExpiredSubscriptionsReport</a></code>: Counts and per-subscription failures.

**Example**

```csharp
var report = await subscrio.Subscriptions.TransitionExpiredSubscriptionsAsync();
Console.WriteLine($"Transitioned: {report.Transitioned}, errors: {report.Errors.Count}");
```

</div>

</div>

## Data types

Required means an input must be supplied, or an output property is guaranteed present.

<div class="data-type" markdown="1">

### CreateSubscriptionDto { #CreateSubscriptionDto }

Subscription creation properties.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Globally unique key, 1 to 255 letters, digits, hyphens, or underscores. |
| `customerKey` | <code>string</code> | Yes | None | Customer key. |
| `billingCycleKey` | <code>string</code> | Yes | None | Lowercase billing-cycle key; determines the plan and product. |
| `activationDate` | <code>string \| Date \| undefined</code> | No | None | Activation time; defaults to now when creating. Immutable afterward. |
| `expirationDate` | <code>string \| Date \| undefined</code> | No | None | Explicit subscription expiration time, independent of period end. |
| `cancellationDate` | <code>string \| Date \| undefined</code> | No | None | Cancellation time; a future date schedules cancellation. |
| `trialEndDate` | <code>string \| Date \| undefined</code> | No | None | Trial end time. |
| `currentPeriodStart` | <code>string \| Date \| undefined</code> | No | None | Billing period start; defaults to now on creation. |
| `currentPeriodEnd` | <code>string \| Date \| undefined</code> | No | None | Billing period end; calculated from the cycle on creation when omitted. |
| `stripeSubscriptionId` | <code>string \| undefined</code> | No | None | External Stripe subscription ID; unique when set. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application metadata; supplied updates replace the saved object. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Globally unique key, 1 to 255 letters, digits, hyphens, or underscores. |
| `CustomerKey` | <code>string</code> | Yes | None | Customer key. |
| `BillingCycleKey` | <code>string</code> | Yes | None | Lowercase billing-cycle key; determines the plan and product. |
| `ActivationDate` | <code>DateTime?</code> | No | null | Activation time; defaults to now when creating. Immutable afterward. |
| `ExpirationDate` | <code>DateTime?</code> | No | null | Explicit subscription expiration time, independent of period end. |
| `CancellationDate` | <code>DateTime?</code> | No | null | Cancellation time; a future date schedules cancellation. |
| `TrialEndDate` | <code>DateTime?</code> | No | null | Trial end time. |
| `CurrentPeriodStart` | <code>DateTime?</code> | No | null | Billing period start; defaults to now on creation. |
| `CurrentPeriodEnd` | <code>DateTime?</code> | No | null | Billing period end; calculated from the cycle on creation when omitted. |
| `StripeSubscriptionId` | <code>string?</code> | No | null | External Stripe subscription ID; unique when set. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application metadata; supplied updates replace the saved object. |

</div>

</div>

<div class="data-type" markdown="1">

### SubscriptionDto { #SubscriptionDto }

Returned subscription properties.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `addons` | <code><a href="#SubscriptionAddonDto">SubscriptionAddonDto</a>[]</code> | Yes | Not applicable | Active and cancelled [attachments](#SubscriptionAddonDto), including add-on definitions. |
| `key` | <code>string</code> | Yes | Not applicable | Globally unique key, 1 to 255 letters, digits, hyphens, or underscores. |
| `customerKey` | <code>string</code> | Yes | Not applicable | Customer key. |
| `productKey` | <code>string</code> | Yes | Not applicable | Owning product key. |
| `planKey` | <code>string</code> | Yes | Not applicable | Plan key. |
| `billingCycleKey` | <code>string</code> | Yes | Not applicable | Lowercase billing-cycle key; determines the plan and product. |
| `status` | <code>string</code> | Yes | Not applicable | Calculated lifecycle status; see [Subscription Lifecycle](subscription-lifecycle.md). |
| `isArchived` | <code>boolean</code> | Yes | Not applicable | Archive flag, separate from calculated status. |
| `activationDate` | <code>string \| null \| undefined</code> | No | Not applicable | Activation time; defaults to now when creating. Immutable afterward. |
| `expirationDate` | <code>string \| null \| undefined</code> | No | Not applicable | Explicit subscription expiration time, independent of period end. |
| `cancellationDate` | <code>string \| null \| undefined</code> | No | Not applicable | Cancellation time; a future date schedules cancellation. |
| `trialEndDate` | <code>string \| null \| undefined</code> | No | Not applicable | Trial end time. |
| `currentPeriodStart` | <code>string \| null \| undefined</code> | No | Not applicable | Billing period start; defaults to now on creation. |
| `currentPeriodEnd` | <code>string \| null \| undefined</code> | No | Not applicable | Billing period end; calculated from the cycle on creation when omitted. |
| `stripeSubscriptionId` | <code>string \| null \| undefined</code> | No | Not applicable | External Stripe subscription ID; unique when set. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| null \| undefined</code> | No | Not applicable | Application metadata; supplied updates replace the saved object. |
| `customer` | <code><a href="../customers/#CustomerDto">CustomerDto</a> \| null \| undefined</code> | No | Not applicable | Customer details included by list/find methods; may be null in other results. |
| `featureOverrides` | <code><a href="#FeatureOverrideDto">FeatureOverrideDto</a>[] \| undefined</code> | No | Not applicable | All saved overrides, including expired timed overrides. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Addons` | <code>List&lt;<a href="#SubscriptionAddonDto">SubscriptionAddonDto</a>&gt;</code> | Yes | Not applicable | Active and cancelled [attachments](#SubscriptionAddonDto), including add-on definitions. |
| `FeatureOverrides` | <code>List&lt;<a href="#FeatureOverrideDto">FeatureOverrideDto</a>&gt;</code> | Yes | Not applicable | All saved overrides, including expired timed overrides. |
| `Key` | <code>string</code> | Yes | Not applicable | Globally unique key, 1 to 255 letters, digits, hyphens, or underscores. |
| `CustomerKey` | <code>string</code> | Yes | Not applicable | Customer key. |
| `ProductKey` | <code>string</code> | Yes | Not applicable | Owning product key. |
| `PlanKey` | <code>string</code> | Yes | Not applicable | Plan key. |
| `BillingCycleKey` | <code>string</code> | Yes | Not applicable | Lowercase billing-cycle key; determines the plan and product. |
| `Status` | <code>string</code> | Yes | Not applicable | Calculated lifecycle status; see [Subscription Lifecycle](subscription-lifecycle.md). |
| `IsArchived` | <code>bool</code> | Yes | Not applicable | Archive flag, separate from calculated status. |
| `ActivationDate` | <code>string?</code> | Yes | Not applicable | Activation time; defaults to now when creating. Immutable afterward. |
| `ExpirationDate` | <code>string?</code> | Yes | Not applicable | Explicit subscription expiration time, independent of period end. |
| `CancellationDate` | <code>string?</code> | Yes | Not applicable | Cancellation time; a future date schedules cancellation. |
| `TrialEndDate` | <code>string?</code> | Yes | Not applicable | Trial end time. |
| `CurrentPeriodStart` | <code>string?</code> | Yes | Not applicable | Billing period start; defaults to now on creation. |
| `CurrentPeriodEnd` | <code>string?</code> | Yes | Not applicable | Billing period end; calculated from the cycle on creation when omitted. |
| `StripeSubscriptionId` | <code>string?</code> | Yes | Not applicable | External Stripe subscription ID; unique when set. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | Yes | Not applicable | Application metadata; supplied updates replace the saved object. |
| `Customer` | <code><a href="../customers/#CustomerDto">CustomerDto</a>?</code> | Yes | Not applicable | Customer details included by list/find methods; may be null in other results. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

</div>

<div class="data-type" markdown="1">

### UpdateSubscriptionDto { #UpdateSubscriptionDto }

Subscription update properties.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `billingCycleKey` | <code>string \| undefined</code> | No | None | Lowercase billing-cycle key; determines the plan and product. |
| `expirationDate` | <code>string \| Date \| undefined</code> | No | None | Explicit subscription expiration time, independent of period end. |
| `cancellationDate` | <code>string \| Date \| undefined</code> | No | None | Cancellation time; a future date schedules cancellation. |
| `trialEndDate` | <code>string \| Date \| undefined</code> | No | None | Trial end time. |
| `clearTrialEndDate` | <code>boolean \| undefined</code> | No | false | Set true to clear the trial end, taking precedence over a supplied trial end. |
| `currentPeriodStart` | <code>string \| Date \| undefined</code> | No | None | Billing period start; defaults to now on creation. |
| `currentPeriodEnd` | <code>string \| Date \| undefined</code> | No | None | Billing period end; calculated from the cycle on creation when omitted. |
| `stripeSubscriptionId` | <code>string \| undefined</code> | No | None | External Stripe subscription ID; unique when set. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application metadata; supplied updates replace the saved object. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `BillingCycleKey` | <code>string?</code> | No | null | Lowercase billing-cycle key; determines the plan and product. |
| `ExpirationDate` | <code>DateTime?</code> | No | null | Explicit subscription expiration time, independent of period end. |
| `CancellationDate` | <code>DateTime?</code> | No | null | Cancellation time; a future date schedules cancellation. |
| `TrialEndDate` | <code>DateTime?</code> | No | null | Trial end time. |
| `ClearTrialEndDate` | <code>bool</code> | No | false | Set true to clear the trial end, taking precedence over a supplied trial end. |
| `CurrentPeriodStart` | <code>DateTime?</code> | No | null | Billing period start; defaults to now on creation. |
| `CurrentPeriodEnd` | <code>DateTime?</code> | No | null | Billing period end; calculated from the cycle on creation when omitted. |
| `StripeSubscriptionId` | <code>string?</code> | No | null | External Stripe subscription ID; unique when set. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application metadata; supplied updates replace the saved object. |

</div>

</div>

<div class="data-type" markdown="1">

### SubscriptionFilterDto { #SubscriptionFilterDto }

Subscription filters. TypeScript requires limit and offset in a supplied object.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `limit` | <code>number</code> | Yes | 50 | Maximum page size, 1 to 100. |
| `offset` | <code>number</code> | Yes | 0 | Nonnegative number of rows to skip. |
| `customerKey` | <code>string \| undefined</code> | No | None | Customer key. |
| `productKey` | <code>string \| undefined</code> | No | None | Owning product key. |
| `planKey` | <code>string \| undefined</code> | No | None | Plan key. |
| `status` | <code>&quot;active&quot; \| &quot;cancelled&quot; \| &quot;pending&quot; \| &quot;trial&quot; \| &quot;cancellation_pending&quot; \| &quot;expired&quot; \| undefined</code> | No | None | pending, active, trial, cancelled, cancellation_pending, or expired. |
| `isArchived` | <code>boolean \| undefined</code> | No | None | Select archived or unarchived records; omit to include both. |
| `sortBy` | <code>&quot;createdAt&quot; \| &quot;activationDate&quot; \| &quot;expirationDate&quot; \| &quot;currentPeriodStart&quot; \| &quot;currentPeriodEnd&quot; \| &quot;updatedAt&quot; \| undefined</code> | No | None | activationDate, expirationDate, createdAt, currentPeriodStart, or currentPeriodEnd. updatedAt currently falls back to createdAt. |
| `sortOrder` | <code>&quot;asc&quot; \| &quot;desc&quot; \| undefined</code> | No | None | asc or desc; defaults to desc. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CustomerKey` | <code>string?</code> | No | null | Customer key. |
| `ProductKey` | <code>string?</code> | No | null | Owning product key. |
| `PlanKey` | <code>string?</code> | No | null | Plan key. |
| `Status` | <code>string?</code> | No | null | pending, active, trial, cancelled, cancellation_pending, or expired. |
| `IsArchived` | <code>bool?</code> | No | null | Select archived or unarchived records; omit to include both. |
| `SortBy` | <code>string?</code> | No | null | Accepted but ignored; results use createdAt descending. |
| `SortOrder` | <code>string?</code> | No | null | Accepted but ignored; results use descending creation time. |
| `Limit` | <code>int?</code> | No | 50 | Maximum page size, 1 to 100. |
| `Offset` | <code>int?</code> | No | 0 | Nonnegative number of rows to skip. |

</div>

</div>

<div class="data-type" markdown="1">

### DetailedSubscriptionFilterDto { #DetailedSubscriptionFilterDto }

Subscription filters. TypeScript requires limit and offset in a supplied object.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `limit` | <code>number</code> | Yes | 50 | Maximum page size, 1 to 100. |
| `offset` | <code>number</code> | Yes | 0 | Nonnegative number of rows to skip. |
| `customerKey` | <code>string \| undefined</code> | No | None | Customer key. |
| `productKey` | <code>string \| undefined</code> | No | None | Owning product key. |
| `planKey` | <code>string \| undefined</code> | No | None | Plan key. |
| `billingCycleKey` | <code>string \| undefined</code> | No | None | Billing cycle key. |
| `status` | <code>&quot;active&quot; \| &quot;cancelled&quot; \| &quot;pending&quot; \| &quot;trial&quot; \| &quot;cancellation_pending&quot; \| &quot;expired&quot; \| undefined</code> | No | None | pending, active, trial, cancelled, cancellation_pending, or expired. |
| `isArchived` | <code>boolean \| undefined</code> | No | None | Select archived or unarchived records; omit to include both. |
| `activationDateFrom` | <code>Date \| undefined</code> | No | None | Inclusive earliest activation date. |
| `activationDateTo` | <code>Date \| undefined</code> | No | None | Inclusive latest activation date. |
| `expirationDateFrom` | <code>Date \| undefined</code> | No | None | Inclusive earliest expiration date. |
| `expirationDateTo` | <code>Date \| undefined</code> | No | None | Inclusive latest expiration date. |
| `trialEndDateFrom` | <code>Date \| undefined</code> | No | None | Inclusive earliest trial end date. |
| `trialEndDateTo` | <code>Date \| undefined</code> | No | None | Inclusive latest trial end date. |
| `currentPeriodStartFrom` | <code>Date \| undefined</code> | No | None | Inclusive earliest current period start. |
| `currentPeriodStartTo` | <code>Date \| undefined</code> | No | None | Inclusive latest current period start. |
| `currentPeriodEndFrom` | <code>Date \| undefined</code> | No | None | Inclusive earliest current period end. |
| `currentPeriodEndTo` | <code>Date \| undefined</code> | No | None | Inclusive latest current period end. |
| `hasStripeId` | <code>boolean \| undefined</code> | No | None | Match whether a Stripe subscription ID is present. |
| `hasTrial` | <code>boolean \| undefined</code> | No | None | Match whether a trial end date is present, including past trials. |
| `hasFeatureOverrides` | <code>boolean \| undefined</code> | No | None | Match saved override presence after pagination; expired timed overrides still count. |
| `featureKey` | <code>string \| undefined</code> | No | None | Accepted but currently ignored. |
| `metadataKey` | <code>string \| undefined</code> | No | None | Accepted but currently ignored. |
| `metadataValue` | <code>unknown</code> | No | None | Accepted but currently ignored. |
| `sortBy` | <code>&quot;createdAt&quot; \| &quot;activationDate&quot; \| &quot;expirationDate&quot; \| &quot;currentPeriodStart&quot; \| &quot;currentPeriodEnd&quot; \| &quot;updatedAt&quot; \| undefined</code> | No | None | activationDate, expirationDate, createdAt, currentPeriodStart, or currentPeriodEnd. updatedAt currently falls back to createdAt. |
| `sortOrder` | <code>&quot;asc&quot; \| &quot;desc&quot; \| undefined</code> | No | None | asc or desc; defaults to desc. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CustomerKey` | <code>string?</code> | No | null | Customer key. |
| `ProductKey` | <code>string?</code> | No | null | Owning product key. |
| `PlanKey` | <code>string?</code> | No | null | Plan key. |
| `BillingCycleKey` | <code>string?</code> | No | null | Billing cycle key. |
| `Status` | <code>string?</code> | No | null | pending, active, trial, cancelled, cancellation_pending, or expired. |
| `IsArchived` | <code>bool?</code> | No | null | Select archived or unarchived records; omit to include both. |
| `ActivationDateFrom` | <code>DateTime?</code> | No | null | Inclusive earliest activation date. |
| `ActivationDateTo` | <code>DateTime?</code> | No | null | Inclusive latest activation date. |
| `ExpirationDateFrom` | <code>DateTime?</code> | No | null | Inclusive earliest expiration date. |
| `ExpirationDateTo` | <code>DateTime?</code> | No | null | Inclusive latest expiration date. |
| `TrialEndDateFrom` | <code>DateTime?</code> | No | null | Inclusive earliest trial end date. |
| `TrialEndDateTo` | <code>DateTime?</code> | No | null | Inclusive latest trial end date. |
| `CurrentPeriodStartFrom` | <code>DateTime?</code> | No | null | Inclusive earliest current period start. |
| `CurrentPeriodStartTo` | <code>DateTime?</code> | No | null | Inclusive latest current period start. |
| `CurrentPeriodEndFrom` | <code>DateTime?</code> | No | null | Inclusive earliest current period end. |
| `CurrentPeriodEndTo` | <code>DateTime?</code> | No | null | Inclusive latest current period end. |
| `HasStripeId` | <code>bool?</code> | No | null | Match whether a Stripe subscription ID is present. |
| `HasTrial` | <code>bool?</code> | No | null | Match whether a trial end date is present, including past trials. |
| `HasFeatureOverrides` | <code>bool?</code> | No | null | Match saved override presence after pagination; expired timed overrides still count. |
| `FeatureKey` | <code>string?</code> | No | null | Accepted but currently ignored. |
| `MetadataKey` | <code>string?</code> | No | null | Accepted but currently ignored. |
| `MetadataValue` | <code>object?</code> | No | null | Accepted but currently ignored. |
| `SortBy` | <code>string?</code> | No | null | Accepted but ignored; results use createdAt descending. |
| `SortOrder` | <code>string?</code> | No | null | Accepted but ignored; results use descending creation time. |
| `Limit` | <code>int?</code> | No | 50 | Maximum page size, 1 to 100. |
| `Offset` | <code>int?</code> | No | 0 | Nonnegative number of rows to skip. |

</div>

</div>

<div class="data-type" markdown="1">

### SubscriptionAddonDto { #SubscriptionAddonDto }

Attachment details returned with subscription snapshots and add-on queries.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `addon` | <code><a href="../addons/#AddonDto">AddonDto</a></code> | Yes | Not applicable | Current [add-on definition](addons.md#AddonDto). |
| `subscriptionKey` | <code>string</code> | Yes | Not applicable | Subscription owning the attachment. |
| `addonKey` | <code>string</code> | Yes | Not applicable | Add-on key. |
| `quantity` | <code>number</code> | Yes | Not applicable | Number of units attached. |
| `status` | <code>&quot;active&quot; \| &quot;cancelled&quot;</code> | Yes | Not applicable | active or cancelled. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `SubscriptionKey` | <code>string</code> | Yes | Not applicable | Subscription owning the attachment. |
| `AddonKey` | <code>string</code> | Yes | Not applicable | Add-on key. |
| `Quantity` | <code>int</code> | Yes | Not applicable | Number of units attached. |
| `Status` | <code>string</code> | Yes | Not applicable | active or cancelled. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |
| `Addon` | <code><a href="../addons/#AddonDto">AddonDto</a>?</code> | Yes | Not applicable | Current [add-on definition](addons.md#AddonDto). |

</div>

</div>

<div class="data-type" markdown="1">

### OverrideType { #OverrideType }

Override lifetime.

<div class="language-content" data-lang="ts" markdown="1">

| Value | Meaning |
| --- | --- |
| `OverrideType.Permanent` | Retained until replaced or removed. |
| `OverrideType.Temporary` | Removed by the explicit temporary-override clearing method. |
| `OverrideType.Timed` | Applies only before its required future expiry. |

</div>
<div class="language-content" data-lang="net" markdown="1">

| Value | Meaning |
| --- | --- |
| `OverrideType.Permanent` | Retained until replaced or removed. |
| `OverrideType.Temporary` | Removed by the explicit temporary-override clearing method. |
| `OverrideType.Timed` | Applies only before its required future expiry. |

</div>
</div>

<div class="data-type" markdown="1">

### TransitionExpiredSubscriptionsReport { #TransitionExpiredSubscriptionsReport }

Outcome of one transition-processing call.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `processed` | <code>number</code> | Yes | Not applicable | Subscriptions attempted. |
| `transitioned` | <code>number</code> | Yes | Not applicable | Replacements saved and their after-hooks completed. |
| `archived` | <code>number</code> | Yes | Not applicable | Old subscriptions archived and their after-hooks completed. |
| `errors` | <code>Array&lt;{ subscriptionKey: string; error: string }&gt;</code> | Yes | Not applicable | Per-subscription failures; other subscriptions continue processing. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Processed` | <code>int</code> | Yes | Not applicable | Subscriptions attempted. |
| `Transitioned` | <code>int</code> | Yes | Not applicable | Replacements saved and their after-hooks completed. |
| `Archived` | <code>int</code> | Yes | Not applicable | Old subscriptions archived and their after-hooks completed. |
| `Errors` | <code>List&lt;<a href="#TransitionError">TransitionError</a>&gt;</code> | Yes | Not applicable | Per-subscription failures; other subscriptions continue processing. |

</div>

</div>

<div class="data-type" markdown="1">

### FeatureOverrideDto { #FeatureOverrideDto }

Saved override details; expired timed overrides remain visible.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `expiresAt` | <code>string \| null \| undefined</code> | No | Not applicable | Expiry timestamp for timed overrides; null otherwise. |
| `isActive` | <code>boolean \| undefined</code> | No | Not applicable | False when a timed override has expired; true otherwise. |
| `featureKey` | <code>string</code> | Yes | Not applicable | Feature key. |
| `value` | <code>string</code> | Yes | Not applicable | Stored feature value. |
| `type` | <code>string</code> | Yes | Not applicable | permanent, temporary, or timed. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `FeatureId` | <code>long</code> | Yes | Not applicable | Internal feature identifier. |
| `Value` | <code>string</code> | Yes | Not applicable | Stored feature value. |
| `Type` | <code>string</code> | Yes | Not applicable | permanent, temporary, or timed. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `FeatureKey` | <code>string?</code> | Yes | Not applicable | Feature key. |
| `ExpiresAt` | <code>string?</code> | Yes | Not applicable | Expiry timestamp for timed overrides; null otherwise. |
| `IsActive` | <code>bool</code> | Yes | Not applicable | False when a timed override has expired; true otherwise. |

</div>

</div>

<div class="data-type" markdown="1">

### TransitionError { #TransitionError }

A failed transition, represented as an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `subscriptionKey` | `string` | Yes | Not applicable | Subscription being processed. |
| `error` | `string` | Yes | Not applicable | Failure message. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `SubscriptionKey` | `string` | Yes | Not applicable | Subscription being processed. |
| `Error` | `string` | Yes | Not applicable | Failure message. |

</div>

</div>

## Related guides

- [Subscription Lifecycle](subscription-lifecycle.md): status, dates, and expiration transitions.
- [How Subscrio Works](entitlements-guide.md): choosing overrides or add-ons.
- [How Feature Values Are Calculated](feature-resolution.md): how saved values contribute to access.
- [Hooks](hooks.md): subscription mutation events.
- [Billing Cycles](billing-cycles.md): duration calculations and month-end differences.
