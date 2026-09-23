---
title: Feature Checker
description: Resolve feature values and inspect their contributing sources.
reference_format: true
---

# Feature Checker

## Purpose

<span id="method-reference" class="compatibility-anchor"></span>

<span id="overview" class="compatibility-anchor"></span>

Feature Checker resolves plan values, add-ons, subscription overrides, and feature defaults. Use ordinary value and enabled checks for application decisions; explanation and summary methods help inspect configuration.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const featureChecker = subscrio.featureChecker;
```

</div>
<div class="language-content" data-lang="net" markdown="1">

```csharp
var featureChecker = subscrio.FeatureChecker;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`getValueForCustomer`](#getvalueforcustomer) | Resolves one customer feature value. |
| [`isEnabledForCustomer`](#isenabledforcustomer) | Checks a customer toggle value. |
| [`getAllFeaturesForCustomer`](#getallfeaturesforcustomer) | Resolves every product feature. |
| [`getValueForSubscription`](#getvalueforsubscription) | Resolves one subscription feature value. |
| [`isEnabledForSubscription`](#isenabledforsubscription) | Checks a subscription toggle value. |
| [`getAllFeaturesForSubscription`](#getallfeaturesforsubscription) | Resolves every feature for a subscription. |
| [`hasPlanAccess`](#hasplanaccess) | Checks active or trial plan membership. |
| [`getActivePlans`](#getactiveplans) | Lists active or trial plan keys. |
| [`getFeatureUsageSummary`](#getfeatureusagesummary) | Summarizes configured values for diagnostics. |
| [`explainForCustomer`](#explainforcustomer) | Explains a customer feature value. |
| [`explainForSubscription`](#explainforsubscription) | Explains a subscription feature value. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`GetValueForCustomerAsync`](#getvalueforcustomer) | Resolves one customer feature value. |
| [`IsEnabledForCustomerAsync`](#isenabledforcustomer) | Checks a customer toggle value. |
| [`GetAllFeaturesForCustomerAsync`](#getallfeaturesforcustomer) | Resolves every product feature. |
| [`GetValueForSubscriptionAsync`](#getvalueforsubscription) | Resolves one subscription feature value. |
| [`IsEnabledForSubscriptionAsync`](#isenabledforsubscription) | Checks a subscription toggle value. |
| [`GetAllFeaturesForSubscriptionAsync`](#getallfeaturesforsubscription) | Resolves every feature for a subscription. |
| [`HasPlanAccessAsync`](#hasplanaccess) | Checks active or trial plan membership. |
| [`GetActivePlansAsync`](#getactiveplans) | Lists active or trial plan keys. |
| [`GetFeatureUsageSummaryAsync`](#getfeatureusagesummary) | Summarizes configured values for diagnostics. |
| [`ExplainForCustomerAsync`](#explainforcustomer) | Explains a customer feature value. |
| [`ExplainForSubscriptionAsync`](#explainforsubscription) | Explains a subscription feature value. |

</div>

## Method details

<div class="method-entry" markdown="1">

### getValueForCustomer { #getvalueforcustomer data-method-ts="getValueForCustomer" data-method-net="GetValueForCustomerAsync" }

<span id="description_3" class="compatibility-anchor"></span>
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

Resolve a feature across the customer's subscriptions using the product-feature resolution rules. With no eligible subscriptions, the feature default applies. <div class="language-content" data-lang="ts" markdown="1">

Supply a numeric or boolean fallback to request that runtime conversion; a generic type argument alone does not convert the stored string.

</div>
<div class="language-content" data-lang="net" markdown="1">

The generic type controls conversion. Invalid conversions return the fallback or the type's default value.

</div>


<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getValueForCustomer<T = string>(customerKey: string, productKey: string, featureKey: string, defaultValue?: T): Promise<T | null>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Feature key.
- `defaultValue`: Optional fallback for missing records or failed conversion. Defaults to null.

**Returns** `T | null`: Resolved value or fallback.

**Example**

```typescript
const seats = await subscrio.featureChecker.getValueForCustomer('acme', 'saas', 'max-seats', 0);
console.log(seats);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The feature exists but is not associated with the product, or required resolution context is missing.
- `ValidationError`: Combining configured values overflows the supported numeric range.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<T?> GetValueForCustomerAsync<T>(string customerKey, string productKey, string featureKey, T? defaultValue)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Feature key.
- `defaultValue`: Optional fallback for missing records or failed conversion. Defaults to default(T).

**Returns** `T?`: Resolved value or fallback; a non-nullable value type uses its default when no fallback is supplied.

**Example**

```csharp
var seats = await subscrio.FeatureChecker.GetValueForCustomerAsync<int>("acme", "saas", "max-seats", 0);
Console.WriteLine(seats);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The feature exists but is not associated with the product, or required resolution context is missing.
- `ValidationException`: Combining configured values overflows the supported numeric range.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### isEnabledForCustomer { #isenabledforcustomer data-method-ts="isEnabledForCustomer" data-method-net="IsEnabledForCustomerAsync" }

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

Return true only when the resolved string equals true, ignoring case. Missing records return false.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
isEnabledForCustomer(customerKey: string, productKey: string, featureKey: string): Promise<boolean>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Toggle feature key.

**Returns** `boolean`: Whether the resolved value is true.

**Example**

```typescript
const enabled = await subscrio.featureChecker.isEnabledForCustomer('acme', 'saas', 'export');
console.log(enabled);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The feature exists but is not associated with the product.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<bool> IsEnabledForCustomerAsync(string customerKey, string productKey, string featureKey)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Toggle feature key.

**Returns** `bool`: Whether the resolved value is true.

**Example**

```csharp
var enabled = await subscrio.FeatureChecker.IsEnabledForCustomerAsync("acme", "saas", "export");
Console.WriteLine(enabled);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The feature exists but is not associated with the product.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getAllFeaturesForCustomer { #getallfeaturesforcustomer data-method-ts="getAllFeaturesForCustomer" data-method-net="GetAllFeaturesForCustomerAsync" }

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

Resolve all features associated with the product across the customer's subscriptions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getAllFeaturesForCustomer(customerKey: string, productKey: string): Promise<Map<string, string>>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.

**Returns** <code>Map&lt;string, string&gt;</code>: Feature keys mapped to resolved string values. Empty when customer or product is missing.

**Example**

```typescript
const values = await subscrio.featureChecker.getAllFeaturesForCustomer('acme', 'saas');
console.log(values);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: Combining configured values overflows the supported numeric range.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<Dictionary<string, string>> GetAllFeaturesForCustomerAsync(string customerKey, string productKey)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.

**Returns** <code>Dictionary&lt;string, string&gt;</code>: Feature keys mapped to resolved string values. Empty when customer or product is missing.

**Example**

```csharp
var values = await subscrio.FeatureChecker.GetAllFeaturesForCustomerAsync("acme", "saas");
Console.WriteLine(values.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: Combining configured values overflows the supported numeric range.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getValueForSubscription { #getvalueforsubscription data-method-ts="getValueForSubscription" data-method-net="GetValueForSubscriptionAsync" }

<span id="description" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>

Resolve a feature for one subscription, including its add-ons and unexpired override. This lookup does not reject inactive or archived subscriptions; it is not a subscription-status check. <div class="language-content" data-lang="ts" markdown="1">

Supply a numeric or boolean fallback to request that runtime conversion; a generic type argument alone does not convert the stored string.

</div>
<div class="language-content" data-lang="net" markdown="1">

The generic type controls conversion. Invalid conversions return the fallback or the type's default value.

</div>


<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getValueForSubscription<T = string>(subscriptionKey: string, featureKey: string, defaultValue?: T): Promise<T | null>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Feature key.
- `defaultValue`: Optional fallback for missing records or failed conversion. Defaults to null.

**Returns** `T | null`: Resolved value or fallback.

**Example**

```typescript
const seats = await subscrio.featureChecker.getValueForSubscription('acme-pro', 'max-seats', 0);
console.log(seats);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The feature exists but is not associated with the product, or required resolution context is missing.
- `ValidationError`: Combining configured values overflows the supported numeric range.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<T?> GetValueForSubscriptionAsync<T>(string subscriptionKey, string featureKey, T? defaultValue)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Feature key.
- `defaultValue`: Optional fallback for missing records or failed conversion. Defaults to default(T).

**Returns** `T?`: Resolved value or fallback; a non-nullable value type uses its default when no fallback is supplied.

**Example**

```csharp
var seats = await subscrio.FeatureChecker.GetValueForSubscriptionAsync<int>("acme-pro", "max-seats", 0);
Console.WriteLine(seats);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The feature exists but is not associated with the product, or required resolution context is missing.
- `ValidationException`: Combining configured values overflows the supported numeric range.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### isEnabledForSubscription { #isenabledforsubscription data-method-ts="isEnabledForSubscription" data-method-net="IsEnabledForSubscriptionAsync" }

<span id="description_1" class="compatibility-anchor"></span>
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

Return true only when the resolved string equals true, ignoring case. Missing records return false. Subscription status is not checked by this lookup.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
isEnabledForSubscription(subscriptionKey: string, featureKey: string): Promise<boolean>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Toggle feature key.

**Returns** `boolean`: Whether the resolved value is true.

**Example**

```typescript
const enabled = await subscrio.featureChecker.isEnabledForSubscription('acme-pro', 'export');
console.log(enabled);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The feature exists but is not associated with the product.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<bool> IsEnabledForSubscriptionAsync(string subscriptionKey, string featureKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Toggle feature key.

**Returns** `bool`: Whether the resolved value is true.

**Example**

```csharp
var enabled = await subscrio.FeatureChecker.IsEnabledForSubscriptionAsync("acme-pro", "export");
Console.WriteLine(enabled);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The feature exists but is not associated with the product.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getAllFeaturesForSubscription { #getallfeaturesforsubscription data-method-ts="getAllFeaturesForSubscription" data-method-net="GetAllFeaturesForSubscriptionAsync" }

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

Resolve all features associated with the subscription's product, without checking subscription status.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getAllFeaturesForSubscription(subscriptionKey: string): Promise<Map<string, string>>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** <code>Map&lt;string, string&gt;</code>: Feature keys mapped to resolved string values. Empty when the related plan is missing.

**Example**

```typescript
const values = await subscrio.featureChecker.getAllFeaturesForSubscription('acme-pro');
console.log(values);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The subscription or related product is missing.
- `ValidationError`: Combining configured values overflows the supported numeric range.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<Dictionary<string, string>> GetAllFeaturesForSubscriptionAsync(string subscriptionKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.

**Returns** <code>Dictionary&lt;string, string&gt;</code>: Feature keys mapped to resolved string values. Empty when the related plan is missing.

**Example**

```csharp
var values = await subscrio.FeatureChecker.GetAllFeaturesForSubscriptionAsync("acme-pro");
Console.WriteLine(values.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The subscription or related product is missing.
- `ValidationException`: Combining configured values overflows the supported numeric range.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### hasPlanAccess { #hasplanaccess data-method-ts="hasPlanAccess" data-method-net="HasPlanAccessAsync" }

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

Check for an active or trial subscription on the specified product and plan. This helper inspects up to the first 100 customer subscriptions and does not independently exclude archived records.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
hasPlanAccess(customerKey: string, productKey: string, planKey: string): Promise<boolean>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `planKey`: Plan key.

**Returns** `boolean`: False when any key is missing or the plan does not belong to the product.

**Example**

```typescript
const result = await subscrio.featureChecker.hasPlanAccess('acme', 'saas', 'pro');
console.log(result);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<bool> HasPlanAccessAsync(string customerKey, string productKey, string planKey)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `planKey`: Plan key.

**Returns** `bool`: False when any key is missing or the plan does not belong to the product.

**Example**

```csharp
var result = await subscrio.FeatureChecker.HasPlanAccessAsync("acme", "saas", "pro");
Console.WriteLine(result);
```

</div>

</div>

<div class="method-entry" markdown="1">

### getActivePlans { #getactiveplans data-method-ts="getActivePlans" data-method-net="GetActivePlansAsync" }

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

List distinct plan keys from active or trial subscriptions. This helper inspects up to the first 100 customer subscriptions and does not independently exclude archived records.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getActivePlans(customerKey: string): Promise<string[]>
```

</div>

**Parameters**

- `customerKey`: Customer key.

**Returns** `string[]`: Plan keys, or an empty array when the customer is missing.

**Example**

```typescript
const result = await subscrio.featureChecker.getActivePlans('acme');
console.log(result);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<string>> GetActivePlansAsync(string customerKey)
```

</div>

**Parameters**

- `customerKey`: Customer key.

**Returns** `List<string>`: Plan keys, or an empty list when the customer is missing.

**Example**

```csharp
var result = await subscrio.FeatureChecker.GetActivePlansAsync("acme");
Console.WriteLine(result);
```

</div>

</div>

<div class="method-entry" markdown="1">

### getFeatureUsageSummary { #getfeatureusagesummary data-method-ts="getFeatureUsageSummary" data-method-net="GetFeatureUsageSummaryAsync" }

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
<span id="diagnostic-methods-and-metered-summaries" class="compatibility-anchor"></span>

Inspect resolved feature values grouped by type. Despite its name, this diagnostic does not report consumed usage; use [Metered Usage](metering.md) for consumption. The subscription count considers up to 100 subscriptions and does not independently exclude archived records.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getFeatureUsageSummary(customerKey: string, productKey: string): Promise<{ activeSubscriptions: number; enabledFeatures: string[]; disabledFeatures: string[]; numericFeatures: Map<string, number>; meteredFeatures: Map<string, number>; textFeatures: Map<string, string> }>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.

**Returns** [Summary object](#FeatureUsageSummaryDto): Resolved toggles, numeric values, metered limits, text, and subscription count.

**Example**

```typescript
const summary = await subscrio.featureChecker.getFeatureUsageSummary('acme', 'saas');
console.log(summary.meteredFeatures);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<FeatureUsageSummaryDto> GetFeatureUsageSummaryAsync(string customerKey, string productKey)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.

**Returns** [FeatureUsageSummaryDto](#FeatureUsageSummaryDto): Resolved values and subscription count.

**Example**

```csharp
var summary = await subscrio.FeatureChecker.GetFeatureUsageSummaryAsync("acme", "saas");
Console.WriteLine(summary.MeteredFeatures.Count);
```

</div>

</div>

<div class="method-entry" markdown="1">

### explainForCustomer { #explainforcustomer data-method-ts="explainForCustomer" data-method-net="ExplainForCustomerAsync" }

<span id="description_9" class="compatibility-anchor"></span>
<span id="signature_18" class="compatibility-anchor"></span>
<span id="inputs_18" class="compatibility-anchor"></span>
<span id="returns_18" class="compatibility-anchor"></span>
<span id="return-properties" class="compatibility-anchor"></span>
<span id="example_18" class="compatibility-anchor"></span>
<span id="signature_19" class="compatibility-anchor"></span>
<span id="inputs_19" class="compatibility-anchor"></span>
<span id="returns_19" class="compatibility-anchor"></span>
<span id="return-properties_1" class="compatibility-anchor"></span>
<span id="example_19" class="compatibility-anchor"></span>
<span id="expected-results_9" class="compatibility-anchor"></span>
<span id="potential-errors_9" class="compatibility-anchor"></span>

Explain why a feature resolves to its current value, including plan/default values, add-ons, and applied or expired overrides. Use this optional diagnostic for troubleshooting or support screens.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
explainForCustomer(customerKey: string, productKey: string, featureKey: string): Promise<FeatureValueExplanationDto>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Feature key.

**Returns** <code><a href="#FeatureValueExplanationDto">FeatureValueExplanationDto</a></code>: Effective value, rules, and contributing sources.

**Example**

```typescript
const explanation = await subscrio.featureChecker.explainForCustomer('acme', 'saas', 'max-seats');
console.log(explanation.effectiveValue, explanation.subscriptions);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The customer, associated feature, or subscription context is missing.
- `ValidationError`: The subscription context is inconsistent or value arithmetic overflows.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<FeatureValueExplanationDto> ExplainForCustomerAsync(string customerKey, string productKey, string featureKey)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Feature key.

**Returns** <code><a href="#FeatureValueExplanationDto">FeatureValueExplanationDto</a></code>: Effective value, rules, and contributing sources.

**Example**

```csharp
var explanation = await subscrio.FeatureChecker.ExplainForCustomerAsync("acme", "saas", "max-seats");
Console.WriteLine(explanation.EffectiveValue);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The customer, associated feature, or subscription context is missing.
- `ValidationException`: The subscription context is inconsistent or value arithmetic overflows.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### explainForSubscription { #explainforsubscription data-method-ts="explainForSubscription" data-method-net="ExplainForSubscriptionAsync" }

<span id="description_10" class="compatibility-anchor"></span>
<span id="signature_20" class="compatibility-anchor"></span>
<span id="inputs_20" class="compatibility-anchor"></span>
<span id="returns_20" class="compatibility-anchor"></span>
<span id="return-properties_2" class="compatibility-anchor"></span>
<span id="example_20" class="compatibility-anchor"></span>
<span id="signature_21" class="compatibility-anchor"></span>
<span id="inputs_21" class="compatibility-anchor"></span>
<span id="returns_21" class="compatibility-anchor"></span>
<span id="return-properties_3" class="compatibility-anchor"></span>
<span id="example_21" class="compatibility-anchor"></span>
<span id="expected-results_10" class="compatibility-anchor"></span>
<span id="potential-errors_10" class="compatibility-anchor"></span>

Explain why a feature resolves to its current value, including plan/default values, add-ons, and applied or expired overrides. Use this optional diagnostic for troubleshooting or support screens. It evaluates one subscription even if inactive or archived.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
explainForSubscription(subscriptionKey: string, featureKey: string): Promise<FeatureValueExplanationDto>
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Feature key.

**Returns** <code><a href="#FeatureValueExplanationDto">FeatureValueExplanationDto</a></code>: Effective value, rules, and contributing sources.

**Example**

```typescript
const explanation = await subscrio.featureChecker.explainForSubscription('acme-pro', 'max-seats');
console.log(explanation.effectiveValue, explanation.subscriptions);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The customer, associated feature, or subscription context is missing.
- `ValidationError`: The subscription context is inconsistent or value arithmetic overflows.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<FeatureValueExplanationDto> ExplainForSubscriptionAsync(string subscriptionKey, string featureKey)
```

</div>

**Parameters**

- `subscriptionKey`: Subscription key.
- `featureKey`: Feature key.

**Returns** <code><a href="#FeatureValueExplanationDto">FeatureValueExplanationDto</a></code>: Effective value, rules, and contributing sources.

**Example**

```csharp
var explanation = await subscrio.FeatureChecker.ExplainForSubscriptionAsync("acme-pro", "max-seats");
Console.WriteLine(explanation.EffectiveValue);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The customer, associated feature, or subscription context is missing.
- `ValidationException`: The subscription context is inconsistent or value arithmetic overflows.

</details>

</div>

</div>

## Data types

Required indicates whether a returned property is guaranteed present.

<div class="data-type" markdown="1">

### FeatureUsageSummaryDto { #FeatureUsageSummaryDto }

Resolved-value summary, an inline object in TypeScript and a named DTO in .NET.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `activeSubscriptions` | <code>number</code> | Yes | Not applicable | Active or trial subscriptions counted for this product. |
| `enabledFeatures` | <code>string[]</code> | Yes | Not applicable | Toggle keys whose resolved value is true. |
| `disabledFeatures` | <code>string[]</code> | Yes | Not applicable | Other toggle keys. |
| `numericFeatures` | <code>Map&lt;string, number&gt;</code> | Yes | Not applicable | Feature keys mapped to resolved numeric values. |
| `meteredFeatures` | <code>Map&lt;string, number&gt;</code> | Yes | Not applicable | Metered feature keys mapped to resolved limits, not consumed usage. |
| `textFeatures` | <code>Map&lt;string, string&gt;</code> | Yes | Not applicable | Feature keys mapped to resolved text. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `ActiveSubscriptions` | <code>int</code> | Yes | Not applicable | Active or trial subscriptions counted for this product. |
| `EnabledFeatures` | <code>List&lt;string&gt;</code> | Yes | Not applicable | Toggle keys whose resolved value is true. |
| `DisabledFeatures` | <code>List&lt;string&gt;</code> | Yes | Not applicable | Other toggle keys. |
| `NumericFeatures` | <code>Dictionary&lt;string, double&gt;</code> | Yes | Not applicable | Feature keys mapped to resolved numeric values. |
| `TextFeatures` | <code>Dictionary&lt;string, string&gt;</code> | Yes | Not applicable | Feature keys mapped to resolved text. |
| `MeteredFeatures` | <code>Dictionary&lt;string, long&gt;</code> | Yes | Not applicable | Metered feature keys mapped to resolved limits, not consumed usage. |

</div>

</div>

<div class="data-type" markdown="1">

### FeatureValueExplanationDto { #FeatureValueExplanationDto }

Explanation returned by the diagnostic methods.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `evaluatedAt` | <code>string</code> | Yes | Not applicable | UTC evaluation timestamp. |
| `effectiveValue` | <code>string</code> | Yes | Not applicable | Final resolved value as a string. |
| `resolution` | <code><a href="../products/#FeatureResolutionOptions">FeatureResolutionOptions</a></code> | Yes | Not applicable | Product-feature [resolution options](products.md#FeatureResolutionOptions). |
| `subscriptions` | <code>Array&lt;{ subscriptionKey: string; value: string; sources: <a href="#FeatureValueSourceDto">FeatureValueSourceDto</a>[] }&gt;</code> | Yes | Not applicable | Per-subscription values and sources, documented below. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `EvaluatedAt` | <code>string</code> | Yes | Not applicable | UTC evaluation timestamp. |
| `EffectiveValue` | <code>string</code> | Yes | Not applicable | Final resolved value as a string. |
| `Resolution` | <code><a href="../products/#FeatureResolutionOptions">FeatureResolutionOptions</a></code> | Yes | Not applicable | Product-feature [resolution options](products.md#FeatureResolutionOptions). |
| `Subscriptions` | <code>List&lt;<a href="#SubscriptionFeatureValueDto">SubscriptionFeatureValueDto</a>&gt;</code> | Yes | Not applicable | Per-subscription values and sources, documented below. |

</div>

</div>

<div class="data-type" markdown="1">

### SubscriptionFeatureValueDto { #SubscriptionFeatureValueDto }

One subscription result; represented as an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `subscriptionKey` | `string` | Yes | Not applicable | Subscription key. |
| `value` | `string` | Yes | Not applicable | Resolved value for this subscription. |
| `sources` | <code><a href="#FeatureValueSourceDto">FeatureValueSourceDto</a>[]</code> | Yes | Not applicable | Candidate value sources. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `SubscriptionKey` | `string` | Yes | Not applicable | Subscription key. |
| `Value` | `string` | Yes | Not applicable | Resolved value for this subscription. |
| `Sources` | <code>List&lt;<a href="#FeatureValueSourceDto">FeatureValueSourceDto</a>&gt;</code> | Yes | Not applicable | Candidate value sources. |

</div>

</div>

<div class="data-type" markdown="1">

### FeatureValueSourceDto { #FeatureValueSourceDto }

A value considered during resolution.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `kind` | <code>&quot;override&quot; \| &quot;plan&quot; \| &quot;addon&quot; \| &quot;default&quot;</code> | Yes | Not applicable | override, plan, addon, or default. |
| `key` | <code>string</code> | Yes | Not applicable | Key of the source subscription, plan, add-on, or feature. |
| `value` | <code>string</code> | Yes | Not applicable | Unscaled source value as a string. |
| `quantity` | <code>number \| undefined</code> | No | Not applicable | Attachment quantity for an add-on. |
| `expiresAt` | <code>string \| null \| undefined</code> | No | Not applicable | Timed override expiry, when applicable. |
| `applied` | <code>boolean</code> | Yes | Not applicable | Whether the source contributed within its subscription; not a guarantee that it won across subscriptions. |
| `reason` | <code>string \| undefined</code> | No | Not applicable | Explanation when a source was replaced, lost priority, or expired. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Kind` | <code>string</code> | Yes | Not applicable | override, plan, addon, or default. |
| `Key` | <code>string</code> | Yes | Not applicable | Key of the source subscription, plan, add-on, or feature. |
| `Value` | <code>string</code> | Yes | Not applicable | Unscaled source value as a string. |
| `Applied` | <code>bool</code> | Yes | Not applicable | Whether the source contributed within its subscription; not a guarantee that it won across subscriptions. |
| `Quantity` | <code>int?</code> | Yes | Not applicable | Attachment quantity for an add-on. |
| `ExpiresAt` | <code>string?</code> | Yes | Not applicable | Timed override expiry, when applicable. |
| `Reason` | <code>string?</code> | Yes | Not applicable | Explanation when a source was replaced, lost priority, or expired. |

</div>

</div>

## Related guides

- [How Feature Values Are Calculated](feature-resolution.md): precedence and combining rules.
- [Products](products.md): configure rules when associating features.
- [Subscriptions](subscriptions.md): overrides and add-on attachments.
- [Metered Usage](metering.md): consumed usage and remaining allowance.
