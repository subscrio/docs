---
title: How Feature Values Are Calculated
description: Follow a seat limit from its plan value through add-ons and subscription overrides.
---

<span id="feature-resolution"></span>

# How Feature Values Are Calculated

Your Team plan includes 20 seats. A customer buys 30 extra seats, so your application should allow 50. Later, you agree to give that customer a total of 80 seats without changing the Team plan for everyone else.

Subscrio calculates the value your application should use from the plan, attached add-ons, and subscription overrides. The code calls this *feature resolution*. This guide follows that calculation using one customer's seat allowance.

<span id="resolution-order"></span>

## Where the value comes from

| Source | Meaning in this example |
| --- | --- |
| Feature default | Use 0 seats when no plan value is available. |
| Plan value | Everyone on Team starts with 20 seats. |
| Attached add-on | Each purchased pack adds 10 seats to a subscription. |
| Subscription override | Give this particular subscription a total of 80 seats. |

An override replaces the calculated total. It can raise or lower the allowance without changing the plan or add-on definitions.

<span id="when-to-configure-feature-resolution"></span>

## Start with 20 seats

Use an initialized `subscrio` instance and an installed schema, as shown in [Getting Started](getting-started.md#install-and-connect). Run these examples in order in a development database. They create their own records; the `seats-demo` keys must not already exist.

<details markdown="1">
<summary>Create the example feature, plan, and subscription</summary>

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.features.createFeature({
  key: 'seats-demo', displayName: 'Seats', valueType: 'numeric', defaultValue: '0'
});
await subscrio.products.createProduct({ key: 'seats-demo', displayName: 'Team workspace' });
await subscrio.products.associateFeature('seats-demo', 'seats-demo', {
  addonRule: 'additive', subscriptionRule: 'most_generous'
});
await subscrio.plans.createPlan({
  key: 'seats-demo-team', productKey: 'seats-demo', displayName: 'Team'
});
await subscrio.plans.setFeatureValue('seats-demo-team', 'seats-demo', '20');
await subscrio.billingCycles.createBillingCycle({
  key: 'seats-demo-monthly', planKey: 'seats-demo-team', displayName: 'Monthly',
  durationUnit: 'months', durationValue: 1
});
await subscrio.customers.createCustomer({ key: 'seats-demo-acme', displayName: 'Acme' });
await subscrio.subscriptions.createSubscription({
  key: 'seats-demo-acme-team', customerKey: 'seats-demo-acme',
  billingCycleKey: 'seats-demo-monthly'
});
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core.Application.DTOs;

await subscrio.Features.CreateFeatureAsync(new CreateFeatureDto(
    Key: "seats-demo", DisplayName: "Seats", ValueType: "numeric", DefaultValue: "0"));
await subscrio.Products.CreateProductAsync(new CreateProductDto("seats-demo", "Team workspace"));
await subscrio.Products.AssociateFeatureAsync("seats-demo", "seats-demo",
    new FeatureResolutionOptions(AddonRule: "additive", SubscriptionRule: "most_generous"));
await subscrio.Plans.CreatePlanAsync(new CreatePlanDto("seats-demo", "seats-demo-team", "Team"));
await subscrio.Plans.SetFeatureValueAsync("seats-demo-team", "seats-demo", "20");
await subscrio.BillingCycles.CreateBillingCycleAsync(new CreateBillingCycleDto(
    PlanKey: "seats-demo-team", Key: "seats-demo-monthly", DisplayName: "Monthly",
    DurationUnit: "months", DurationValue: 1));
await subscrio.Customers.CreateCustomerAsync(new CreateCustomerDto("seats-demo-acme", "Acme"));
await subscrio.Subscriptions.CreateSubscriptionAsync(new CreateSubscriptionDto(
    CustomerKey: "seats-demo-acme", BillingCycleKey: "seats-demo-monthly", Key: "seats-demo-acme-team"));
```

</div>

</details>

The setup associates Seats with the product and makes two choices:

- `addonRule: 'additive'` adds the seat packs to the plan's allowance.
- `subscriptionRule: 'most_generous'` uses the largest allowance if the customer has several subscriptions to this product. With one subscription, it uses that subscription's allowance.

The rules belong to the product-feature association. The plan still holds its own value of 20.

Read Acme's limit through Feature Checker:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const planLimit = await subscrio.featureChecker.getValueForCustomer(
  'seats-demo-acme', 'seats-demo', 'seats-demo', 0
);
console.log(planLimit); // 20
```

The final argument, `0`, requests a numeric result and supplies a fallback if conversion fails.

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var planLimit = await subscrio.FeatureChecker.GetValueForCustomerAsync<int>(
    "seats-demo-acme", "seats-demo", "seats-demo", 0);
Console.WriteLine(planLimit); // 20
```

The `int` type requests a numeric result; `0` is the fallback if conversion fails.

</div>

The plan supplies 20, so the feature default of 0 is not used. Your application compares this limit with its seat count before adding a user. The getter does not count users or enforce the limit for you.

## Add 30 seats

Define a reusable 10-seat add-on and attach three copies to Acme's subscription:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.addons.createAddon({
  key: 'seats-demo-pack', productKey: 'seats-demo', displayName: '10 extra seats',
  compositionMode: 'additive', featureValues: { 'seats-demo': '10' }
});
await subscrio.subscriptions.attachAddon('seats-demo-acme-team', 'seats-demo-pack', 3);
console.log(await subscrio.featureChecker.getValueForCustomer(
  'seats-demo-acme', 'seats-demo', 'seats-demo', 0
)); // 50
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
await subscrio.Addons.CreateAddonAsync(new CreateAddonDto(
    ProductKey: "seats-demo", Key: "seats-demo-pack", DisplayName: "10 extra seats",
    CompositionMode: "additive", FeatureValues: new() { ["seats-demo"] = "10" }));
await subscrio.Subscriptions.AttachAddonAsync("seats-demo-acme-team", "seats-demo-pack", 3);
Console.WriteLine(await subscrio.FeatureChecker.GetValueForCustomerAsync<int>(
    "seats-demo-acme", "seats-demo", "seats-demo", 0)); // 50
```

</div>

The calculation is 20 + (10 × 3) = 50 seats. Creating the add-on alone does not change Acme's limit; attaching it does.

The add-on's `compositionMode` says it contributes extra seats. The association's `addonRule` says to add those contributions to the plan value.

<span id="timed-temporary-and-permanent-overrides"></span>

## Set an agreed total for one subscription

Suppose Acme negotiates a total of 80 seats. Set a subscription override:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
import { OverrideType } from 'subscrio';

await subscrio.subscriptions.addFeatureOverride(
  'seats-demo-acme-team', 'seats-demo', '80', OverrideType.Permanent
);
console.log(await subscrio.featureChecker.getValueForCustomer(
  'seats-demo-acme', 'seats-demo', 'seats-demo', 0
)); // 80
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core.Domain.ValueObjects;

await subscrio.Subscriptions.AddFeatureOverrideAsync(
    "seats-demo-acme-team", "seats-demo", "80", OverrideType.Permanent);
Console.WriteLine(await subscrio.FeatureChecker.GetValueForCustomerAsync<int>(
    "seats-demo-acme", "seats-demo", "seats-demo", 0)); // 80
```

</div>

The result is 80, not 130. Subscrio calculates the plan and add-ons first, then replaces that total with the override. Other customers on Team keep their own limits.

Remove the override to return to Acme's plan and add-ons:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.subscriptions.removeFeatureOverride('seats-demo-acme-team', 'seats-demo');
console.log(await subscrio.featureChecker.getValueForCustomer(
  'seats-demo-acme', 'seats-demo', 'seats-demo', 0
)); // 50
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
await subscrio.Subscriptions.RemoveFeatureOverrideAsync("seats-demo-acme-team", "seats-demo");
Console.WriteLine(await subscrio.FeatureChecker.GetValueForCustomerAsync<int>(
    "seats-demo-acme", "seats-demo", "seats-demo", 0)); // 50
```

</div>

The plan and attachments were retained, so the limit returns to 50. A timed override works the same way while active, then stops applying at its expiration time. See [Add-ons and Overrides](addons-and-overrides.md) for choosing an override type.

## When a customer has several subscriptions

Subscrio calculates each subscription's value separately, then uses `subscriptionRule` to choose or combine the results for the requested product.

For example, suppose Acme keeps the 50-seat subscription above and obtains another worth 10 seats:

| Subscription rule | Customer's limit | Meaning |
| --- | --- | --- |
| `most_generous` | 50 | Use the largest subscription allowance. |
| `additive` | 60 | Combine purchased capacity into a shared pool. |
| `override_wins` | 50 if the 50-seat subscription was created first | Use the first eligible subscription, ordered by creation time, then database ID. |

Set this rule on the product-feature association, as in the setup. A subscription-specific getter still returns only that subscription's value.

An override applies before subscriptions are combined. With `additive`, an 80-seat override on one subscription plus 10 seats from another gives 90. The override does not set a customer-wide ceiling.

## Other ways to combine values

The example uses addition for seat packs. For a 20-seat plan and one 30-seat additive add-on, `addonRule` supports these choices:

| Add-on rule | Result | Meaning |
| --- | --- | --- |
| `additive` | 50 | Add 20 and 30. |
| `most_generous` | 30 | Take the larger value. |
| `override_wins` | 20 | Keep the plan value; additive add-ons do not increase it. |

For metered features, these rules calculate the allowance without changing recorded usage. For toggles, `additive` and `most_generous` both return `true` if any contributing value is `true`. Text features use `override_wins` to select one value.

<details markdown="1">
<summary>Replacement add-ons</summary>

An add-on with `compositionMode: 'override'` replaces the plan value before additive packs are considered. A replacement of 40 seats plus an additive 10-seat pack produces 50 under the `additive` rule.

If several replacement add-ons are attached, the lowest numeric priority wins; the add-on key breaks ties. They require quantity one. A subscription override still replaces the final total afterward.

</details>

<span id="diagnostic-explanations"></span>

## Understand an unexpected result

Use the diagnostic explanation helper to see where a value came from:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const explanation = await subscrio.featureChecker.explainForCustomer(
  'seats-demo-acme', 'seats-demo', 'seats-demo'
);
console.log(explanation.effectiveValue); // "50"
console.dir(explanation.subscriptions, { depth: null });
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var explanation = await subscrio.FeatureChecker.ExplainForCustomerAsync(
    "seats-demo-acme", "seats-demo", "seats-demo");
Console.WriteLine(explanation.EffectiveValue); // 50
foreach (var subscription in explanation.Subscriptions)
    foreach (var source in subscription.Sources)
        Console.WriteLine(source);
```

</div>

Look for the plan value of 20 and the add-on value of 10 with quantity 3. The explanation includes the evaluation time, rules, and sources for each subscription. Its values are strings. It does not change configuration or record usage.

An `applied` source contributed within its subscription; the final `effectiveValue` is the customer-level result. [Feature Checker](feature-checker.md) documents these properties and the equivalent helper for one subscription.

<span id="defaults-and-existing-associations"></span>

### Defaults and existing settings

New numeric and metered associations add additive packs by default; toggles combine with OR. Associations upgraded from an older schema keep their previous replacement behavior. Set `addonRule: 'additive'` explicitly when enabling extra-capacity packs on an existing catalog.

<details markdown="1">
<summary>Omitting or changing the rules</summary>

Without a subscription rule, customer selection gives subscription overrides priority, then selects a plan/add-on value, then falls back to the feature default. It neither adds subscriptions nor guarantees the largest value. Choose an explicit rule when that distinction matters.

Calling the association method without options preserves saved settings. If you supply options, omitting `addonRule` keeps its setting, but omitting `subscriptionRule` or setting it to `null` restores default customer selection. Supply both to retain an explicit subscription rule while changing the add-on rule.

</details>

### Which subscriptions contribute? { #which-subscriptions-contribute }

With the explicit subscription rule used here, customer checks exclude archived subscriptions, subscriptions that have not started, and subscriptions whose cancellation or expiration time has arrived. A scheduled cancellation still contributes until its timestamp.

If none contributes, the feature default can be returned. Choose a default appropriate for a customer without a subscription, such as 0 seats or `false` for a toggle.

<details markdown="1">
<summary>How other checks select subscriptions</summary>

Without an explicit subscription rule, customer checks exclude a subscription as soon as any cancellation date is set, even a future date. They also exclude pending and expired subscriptions, but do not exclude archived ones.

A subscription-specific getter calculates the named subscription's value even when it is inactive or archived. Metered accounting excludes archived subscriptions and permits a scheduled cancellation until its timestamp. See [Subscription Lifecycle](subscription-lifecycle.md) for the date rules.

</details>
