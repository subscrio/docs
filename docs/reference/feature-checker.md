---
title: Feature checker
description: Resolve feature values at runtime from subscription overrides, then plan values, then feature defaults, at subscription or customer scope.
---

# Feature Checker Service Reference

## Service Overview
The Feature Checker service evaluates feature values at runtime. Every method enforces the hierarchy:

`subscription override → plan value → feature default`

The service answers questions at both subscription and customer levels, exposes plan-access helpers, and can summarize usage patterns. Results draw from `FeatureValueResolver`, so the hierarchy is consistent everywhere.

Resolved values are stored as strings, then converted by the typed getter. TypeScript infers the target from `defaultValue`: string, boolean, and number are supported. Without a default it returns a string. .NET converts to `string`, `bool`, numeric primitives, `decimal`, or `Guid` from the generic type. A failed or unsupported conversion returns the supplied default, or `null` / the type's default when no fallback exists.

TypeScript also exports `convertFeatureValue(value, defaultValue?, valueType?)`. Its explicit `valueType` can be `string`, `boolean`, or `number`. Boolean conversion in both libraries accepts `true`, `false`, `1`, `0`, `yes`, `no`, `on`, and `off`, ignoring case where applicable.

## Accessing the Service

=== "TypeScript"
    ```typescript
    import { Subscrio } from 'subscrio';

    const subscrio = new Subscrio({ database: { connectionString: process.env.DATABASE_URL! } });
    const featureChecker = subscrio.featureChecker;
    ```

=== ".NET"
    ```csharp
    using Subscrio.Core;

    var subscrio = new Subscrio(config);
    var featureChecker = subscrio.FeatureChecker;
    ```

## Method Catalog

=== "TypeScript"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `getValueForSubscription` | Resolve a feature for one subscription | `Promise<T \| null>` |
    | `isEnabledForSubscription` | Boolean helper for toggle features | `Promise<boolean>` |
    | `getAllFeaturesForSubscription` | Resolve every feature for a subscription's product | `Promise<Map<string, string>>` |
    | `getValueForCustomer` | Resolve a feature across a customer's active/trial subscriptions for a product | `Promise<T \| null>` |
    | `isEnabledForCustomer` | Boolean helper for customer/product queries | `Promise<boolean>` |
    | `getAllFeaturesForCustomer` | Aggregate all feature values for a customer/product pair | `Promise<Map<string, string>>` |
    | `hasPlanAccess` | Check if a customer currently has an active/trial subscription to a plan | `Promise<boolean>` |
    | `getActivePlans` | List active/trial plan keys for a customer | `Promise<string[]>` |
    | `getFeatureUsageSummary` | Summarize enabled/disabled/numeric/text states | `Promise<FeatureUsageSummaryDto>` |

=== ".NET"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `GetValueForSubscriptionAsync` | Resolve a feature for one subscription | `Task<T?>` |
    | `IsEnabledForSubscriptionAsync` | Boolean helper for toggle features | `Task<bool>` |
    | `GetAllFeaturesForSubscriptionAsync` | Resolve every feature for a subscription's product | `Task<Dictionary<string, string>>` |
    | `GetValueForCustomerAsync` | Resolve a feature across a customer's active/trial subscriptions for a product | `Task<T?>` |
    | `IsEnabledForCustomerAsync` | Boolean helper for customer/product queries | `Task<bool>` |
    | `GetAllFeaturesForCustomerAsync` | Aggregate all feature values for a customer/product pair | `Task<Dictionary<string, string>>` |
    | `HasPlanAccessAsync` | Check if a customer currently has an active/trial subscription to a plan | `Task<bool>` |
    | `GetActivePlansAsync` | List active/trial plan keys for a customer | `Task<List<string>>` |
    | `GetFeatureUsageSummaryAsync` | Summarize enabled/disabled/numeric/text states | `Task<FeatureUsageSummaryDto>` |

## Method Reference

### getValueForSubscription

#### Description
Resolves a feature value for a single subscription using override → plan value → feature default precedence.

=== "TypeScript"
    #### Signature
    ```typescript
    getValueForSubscription<T = string>(
      subscriptionKey: string,
      featureKey: string,
      defaultValue?: T
    ): Promise<T | null>
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription identifier. |
    | `featureKey` | `string` | Yes | Feature key to resolve. |
    | `defaultValue` | `T` | No | Optional fallback when any entity is missing. |

    #### Returns
    `Promise<T | null>`. The resolved value is converted according to the runtime type of `defaultValue`. Conversion failure returns `defaultValue ?? null`.

    #### Example
    ```typescript
    const seats = await featureChecker.getValueForSubscription(
      'sub_1001',
      'seat-limit',
      0
    );
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<T?> GetValueForSubscriptionAsync<T>(
        string subscriptionKey,
        string featureKey,
        T? defaultValue = default
    )
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription identifier. |
    | `featureKey` | `string` | Yes | Feature key to resolve. |
    | `defaultValue` | `T?` | No | Optional fallback when any entity is missing. |

    #### Returns
    `Task<T?>`. The resolved value is converted to `T`. Conversion failure returns the supplied or type-default value.

    #### Example
    ```csharp
    var seats = await subscrio.FeatureChecker.GetValueForSubscriptionAsync<int>(
        "sub_1001",
        "seat-limit",
        0
    );
    ```

#### Expected Results
- Loads subscription, plan, and feature.
- Applies resolver hierarchy; if any entity is missing returns fallback rather than throwing.
- Converts the stored string to the requested supported type. A failed conversion returns the fallback.

#### Potential Errors
- None.

### isEnabledForSubscription

#### Description
Convenience helper for toggle features at the subscription level.

=== "TypeScript"
    #### Signature
    ```typescript
    isEnabledForSubscription(subscriptionKey: string, featureKey: string): Promise<boolean>
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription identifier. |
    | `featureKey` | `string` | Yes | Feature key to resolve. |

    #### Returns
    `Promise<boolean>` – `true` when the resolved value equals `'true'` (case-insensitive).

    #### Example
    ```typescript
    const hasBranding = await featureChecker.isEnabledForSubscription(
      'sub_enterprise',
      'custom-branding'
    );
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<bool> IsEnabledForSubscriptionAsync(string subscriptionKey, string featureKey)
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription identifier. |
    | `featureKey` | `string` | Yes | Feature key to resolve. |

    #### Returns
    `Task<bool>` – `true` when the resolved value equals `'true'` (case-insensitive).

    #### Example
    ```csharp
    var hasBranding = await subscrio.FeatureChecker.IsEnabledForSubscriptionAsync(
        "sub_enterprise",
        "custom-branding"
    );
    ```

#### Expected Results
- Wraps `getValueForSubscription` and checks for `'true'`.

#### Potential Errors
- None.

### getAllFeaturesForSubscription

#### Description
Resolves every feature for the subscription's product, returning a map of `featureKey → value`.

=== "TypeScript"
    #### Signature
    ```typescript
    getAllFeaturesForSubscription(subscriptionKey: string): Promise<Map<string, string>>
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription identifier. |

    #### Returns
    `Promise<Map<string, string>>`

    #### Example
    ```typescript
    const resolved = await featureChecker.getAllFeaturesForSubscription('sub_1001');
    console.log(resolved.get('max-projects'));
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<Dictionary<string, string>> GetAllFeaturesForSubscriptionAsync(string subscriptionKey)
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription identifier. |

    #### Returns
    `Task<Dictionary<string, string>>`

    #### Example
    ```csharp
    var resolved = await subscrio.FeatureChecker.GetAllFeaturesForSubscriptionAsync("sub_1001");
    Console.WriteLine(resolved.GetValueOrDefault("max-projects"));
    ```

#### Expected Results
- Loads subscription, plan, and product, then queries all product features.
- Resolves each feature via the hierarchy and populates the map.
- Returns empty map when the plan cannot be resolved.

#### Potential Errors

| Error | When |
| --- | --- |
| `NotFoundError` | Subscription missing or product cannot be resolved. |

### getValueForCustomer

#### Description
Resolves a feature for a customer/product pair by scanning up to 100 of that customer's subscriptions. Both repositories apply the `MAX_SUBSCRIPTIONS_PER_CUSTOMER` limit.

=== "TypeScript"
    #### Signature
    ```typescript
    getValueForCustomer<T = string>(
      customerKey: string,
      productKey: string,
      featureKey: string,
      defaultValue?: T
    ): Promise<T | null>
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product containing the feature. |
    | `featureKey` | `string` | Yes | Feature to resolve. |
    | `defaultValue` | `T` | No | Optional fallback. |

    #### Returns
    `Promise<T | null>`

    #### Example
    ```typescript
    const maxProjects = await featureChecker.getValueForCustomer(
      'acme-corp',
      'projecthub',
      'max-projects',
      '0'
    );
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<T?> GetValueForCustomerAsync<T>(
        string customerKey,
        string productKey,
        string featureKey,
        T? defaultValue = default
    )
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product containing the feature. |
    | `featureKey` | `string` | Yes | Feature to resolve. |
    | `defaultValue` | `T?` | No | Optional fallback. |

    #### Returns
    `Task<T?>`

    #### Example
    ```csharp
    var maxProjects = await subscrio.FeatureChecker.GetValueForCustomerAsync<string>(
        "acme-corp",
        "projecthub",
        "max-projects",
        "0"
    );
    ```

#### Expected Results
- Loads customer, product, and feature; returns fallback when any missing.
- Fetches subscriptions for the customer, filters to active/trial entries for the product.
- For each feature, the first subscription override wins. If no override exists, the first encountered plan value wins. The feature default is used only when no applicable plan supplies a value.

#### Potential Errors
- None.

### isEnabledForCustomer

#### Description
Boolean helper that wraps `getValueForCustomer`.

=== "TypeScript"
    #### Signature
    ```typescript
    isEnabledForCustomer(
      customerKey: string,
      productKey: string,
      featureKey: string
    ): Promise<boolean>
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product containing the feature. |
    | `featureKey` | `string` | Yes | Feature to resolve. |

    #### Returns
    `Promise<boolean>` – `true` when the resolved value equals `'true'`.

    #### Example
    ```typescript
    const hasApiAccess = await featureChecker.isEnabledForCustomer(
      'acme-corp',
      'projecthub',
      'api-access'
    );
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<bool> IsEnabledForCustomerAsync(
        string customerKey,
        string productKey,
        string featureKey
    )
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product containing the feature. |
    | `featureKey` | `string` | Yes | Feature to resolve. |

    #### Returns
    `Task<bool>` – `true` when the resolved value equals `'true'`.

    #### Example
    ```csharp
    var hasApiAccess = await subscrio.FeatureChecker.IsEnabledForCustomerAsync(
        "acme-corp",
        "projecthub",
        "api-access"
    );
    ```

#### Expected Results
- Wraps `getValueForCustomer` and checks for `'true'`.

#### Potential Errors
- None.

### getAllFeaturesForCustomer

#### Description
Aggregates every feature value for a customer/product pair by considering all active/trial subscriptions.

=== "TypeScript"
    #### Signature
    ```typescript
    getAllFeaturesForCustomer(
      customerKey: string,
      productKey: string
    ): Promise<Map<string, string>>
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product key. |

    #### Returns
    `Promise<Map<string, string>>` – defaults when no matching subscriptions exist.

    #### Example
    ```typescript
    const customerFeatures = await featureChecker.getAllFeaturesForCustomer(
      'acme-corp',
      'projecthub'
    );
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<Dictionary<string, string>> GetAllFeaturesForCustomerAsync(
        string customerKey,
        string productKey
    )
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product key. |

    #### Returns
    `Task<Dictionary<string, string>>` – defaults when no matching subscriptions exist.

    #### Example
    ```csharp
    var customerFeatures = await subscrio.FeatureChecker.GetAllFeaturesForCustomerAsync(
        "acme-corp",
        "projecthub"
    );
    ```

#### Expected Results
- Loads customer/product; returns empty map when either missing.
- Resolves all product features using the resolver across relevant subscriptions.

#### Potential Errors
- None.

### hasPlanAccess

#### Description
Checks whether a customer currently holds an active or trial subscription for a given plan.

=== "TypeScript"
    #### Signature
    ```typescript
    hasPlanAccess(
      customerKey: string,
      productKey: string,
      planKey: string
    ): Promise<boolean>
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product identifier (used to validate plan ownership). |
    | `planKey` | `string` | Yes | Plan to check. |

    #### Returns
    `Promise<boolean>` – `false` when customer/product/plan missing or no qualifying subscription is found.

    #### Example
    ```typescript
    const hasPro = await featureChecker.hasPlanAccess('acme-corp', 'projecthub', 'professional');
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<bool> HasPlanAccessAsync(
        string customerKey,
        string productKey,
        string planKey
    )
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product identifier (used to validate plan ownership). |
    | `planKey` | `string` | Yes | Plan to check. |

    #### Returns
    `Task<bool>` – `false` when customer/product/plan missing or no qualifying subscription is found.

    #### Example
    ```csharp
    var hasPro = await subscrio.FeatureChecker.HasPlanAccessAsync("acme-corp", "projecthub", "professional");
    ```

#### Expected Results
- Validates all entities exist.
- Loads subscriptions for the customer and searches for an active/trial entry referencing the plan.

#### Potential Errors
- None.

### getActivePlans

#### Description
Lists distinct plan keys from up to 100 active or trial subscriptions for the customer.

=== "TypeScript"
    #### Signature
    ```typescript
    getActivePlans(customerKey: string): Promise<string[]>
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |

    #### Returns
    `Promise<string[]>`. Returns distinct active or trial plan keys, or an empty array when the customer is missing or has no qualifying subscriptions.

    #### Example
    ```typescript
    const plans = await featureChecker.getActivePlans('acme-corp');
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<List<string>> GetActivePlansAsync(string customerKey)
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |

    #### Returns
    `Task<List<string>>`. Returns distinct active or trial plan keys, or an empty list when the customer is missing or has no qualifying subscriptions.

    #### Example
    ```csharp
    var plans = await subscrio.FeatureChecker.GetActivePlansAsync("acme-corp");
    ```

#### Expected Results
- Loads up to 100 customer subscriptions and keeps only active or trial entries.
- Batch-fetches plans, deduplicates their keys, and returns the result.

#### Potential Errors
- None.

### getFeatureUsageSummary

#### Description
Produces a usage rollup showing how features resolve (enabled/disabled/numeric/text) for a customer/product pair. Its subscription count includes only active or trial subscriptions whose plans belong to the requested product.

=== "TypeScript"
    #### Signature
    ```typescript
    getFeatureUsageSummary(
      customerKey: string,
      productKey: string
    ): Promise<{
      activeSubscriptions: number;
      enabledFeatures: string[];
      disabledFeatures: string[];
      numericFeatures: Map<string, number>;
      textFeatures: Map<string, string>;
    }>
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product key. |

    #### Returns
    Object containing `activeSubscriptions`, `enabledFeatures`, `disabledFeatures`, `numericFeatures` (`Map<string, number>`), `textFeatures` (`Map<string, string>`).

    #### Example
    ```typescript
    const summary = await featureChecker.getFeatureUsageSummary('acme-corp', 'projecthub');
    console.log(summary.enabledFeatures);
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<FeatureUsageSummaryDto> GetFeatureUsageSummaryAsync(
        string customerKey,
        string productKey
    )
    ```

    #### Inputs

    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |
    | `productKey` | `string` | Yes | Product key. |

    #### Returns
    `Task<FeatureUsageSummaryDto>` – contains `ActiveSubscriptions`, `EnabledFeatures`, `DisabledFeatures`, `NumericFeatures` (`Dictionary<string, double>`), `TextFeatures` (`Dictionary<string, string>`).

    #### Example
    ```csharp
    var summary = await subscrio.FeatureChecker.GetFeatureUsageSummaryAsync("acme-corp", "projecthub");
    Console.WriteLine(string.Join(", ", summary.EnabledFeatures));
    ```

#### Expected Results
- Counts active or trial subscriptions for the requested product, within the 100-subscription customer cap.
- Resolves all product features (using defaults when customer/product missing) and classifies values by `FeatureDto.valueType`.

#### Potential Errors
- None.

## Related Workflows
- Products must associate features and plans must set feature values for meaningful results; otherwise values fall back to feature defaults.
- Subscription-level overrides come from `SubscriptionManagementService.addFeatureOverride`.
- Cache high-traffic queries such as `getAllFeaturesForCustomer` to avoid recalculating the same maps repeatedly.
