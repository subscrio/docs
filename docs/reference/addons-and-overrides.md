---
title: Add-ons and Overrides
description: Offer reusable packages and individual subscription exceptions without changing the plan for everyone.
---

# Add-ons and Overrides

Use an add-on for a package offered to several customers. Use an override for an individual agreement. Both change feature values; neither records a payment.

The examples continue the [Getting Started](getting-started.md) catalog: `projecthub`, a 10-project Starter plan, and Acme's `acme-starter` subscription. Run the sections in order.

## Attach a repeatable package

A five-project add-on with quantity two contributes ten projects. The numeric feature's additive rule combines that with the plan's ten.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.addons.createAddon({
  key: 'five-projects', productKey: 'projecthub', displayName: 'Five extra projects',
  compositionMode: 'additive', featureValues: { 'max-projects': '5' }
});
await subscrio.subscriptions.attachAddon('acme-starter', 'five-projects', 2);
const limit = await subscrio.featureChecker.getValueForCustomer(
  'acme', 'projecthub', 'max-projects', 0
);
console.log(limit); // 20
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
await subscrio.Addons.CreateAddonAsync(new CreateAddonDto(
    ProductKey: "projecthub", Key: "five-projects", DisplayName: "Five extra projects",
    CompositionMode: "additive", FeatureValues: new() { ["max-projects"] = "5" }));
await subscrio.Subscriptions.AttachAddonAsync("acme-starter", "five-projects", 2);
var limit = await subscrio.FeatureChecker.GetValueForCustomerAsync<int>(
    "acme", "projecthub", "max-projects", 0);
Console.WriteLine(limit); // 20
```

</div>

Attaching the same add-on again sets its absolute quantity. Passing three means three packs in total, not three more. A package can contain several feature values, and a feature can appear in several packages. Its features must already be associated with the package's product.

## Set an individual exception

This timed override sets the subscription's total to 50 for seven days. It replaces the plan-plus-add-on result.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
import { OverrideType } from 'subscrio';

await subscrio.subscriptions.addFeatureOverride(
  'acme-starter', 'max-projects', '50', OverrideType.Timed,
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
);
console.log(await subscrio.featureChecker.getValueForSubscription(
  'acme-starter', 'max-projects', 0
)); // 50
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core.Domain.ValueObjects;

await subscrio.Subscriptions.AddFeatureOverrideAsync(
    "acme-starter", "max-projects", "50", OverrideType.Timed, DateTime.UtcNow.AddDays(7));
Console.WriteLine(await subscrio.FeatureChecker.GetValueForSubscriptionAsync<int>(
    "acme-starter", "max-projects", 0)); // 50
```

</div>

At the expiration instant, resolution returns to the current plan/add-on value. No cleanup job is needed for the check to stop applying the override; the stored row remains available for inspection.

| Override type | When it stops applying |
| --- | --- |
| Permanent | Explicit removal or replacement. |
| Temporary | Your application calls the clear-temporary operation, removes it, or replaces it. |
| Timed | Its expiration instant, or earlier removal/replacement. |

Temporary does not mean one billing period. The current Stripe invoice handler does not clear temporary overrides. Use a timed override for an exact end date, and supply a timestamp with a timezone. .NET rejects an unspecified-kind expiration `DateTime`.

## Change or remove the package

Change the package's catalog values to affect existing active attachments. Change its attachment quantity to affect only one subscription. Removing an override reveals the underlying package result; detaching a package removes that contribution while preserving its attachment record as cancelled.

Archiving an add-on prevents new attachments but preserves existing benefits. An add-on with attachment history cannot be deleted, including when every attachment is cancelled. Replacement add-ons require quantity one; [How Feature Values Are Calculated](feature-resolution.md) explains precedence when more than one package supplies a value.

## Charge separately

Authorize the purchase in your billing workflow, then attach the package. Stripe Checkout quantity does not automatically set an add-on quantity, and Stripe events do not create add-on purchases. Likewise, an add-on can increase a metered limit, but it does not create a credit grant.

See [Add-ons](addons.md), [Subscriptions](subscriptions.md), and [Metered Usage Workflows](metered-usage-workflows.md) for the corresponding methods.
