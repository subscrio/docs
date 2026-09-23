---
title: Credit Wallet Workflows
description: Manage prepaid and recurring credits, shared action costs, expiration, retries, and corrections.
---

# Credit Wallet Workflows

Credits are a spendable balance. Each customer has one wallet per global currency, shared across products and subscriptions. Several features can charge that wallet at different rates.

Continue from [Getting Started](getting-started.md) and run these sections in order. The examples model a payment already confirmed by your application; creating a grant does not collect money.

## Define a currency and action cost

This configuration charges 50 AI credits for each image and grants Acme 500 prepaid credits.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.features.createFeature({
  key: 'generate-image', displayName: 'Image generation', valueType: 'toggle', defaultValue: 'false'
});
await subscrio.products.associateFeature('projecthub', 'generate-image');
await subscrio.plans.setFeatureValue('starter', 'generate-image', 'true');
await subscrio.credits.createCurrency({ key: 'ai-credits', displayName: 'AI credits' });
await subscrio.credits.setConsumptionRule('generate-image', 'ai-credits', 50);
await subscrio.credits.grant({
  customerKey: 'acme', currencyKey: 'ai-credits', amount: 500,
  grantType: 'prepaid', idempotencyKey: 'payment-42-ai-credits'
});
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
await subscrio.Features.CreateFeatureAsync(new CreateFeatureDto(
    Key: "generate-image", DisplayName: "Image generation", ValueType: "toggle", DefaultValue: "false"));
await subscrio.Products.AssociateFeatureAsync("projecthub", "generate-image");
await subscrio.Plans.SetFeatureValueAsync("starter", "generate-image", "true");
await subscrio.Credits.CreateCurrencyAsync(new CreateCreditCurrencyDto("ai-credits", "AI credits"));
await subscrio.Credits.SetConsumptionRuleAsync("generate-image", "ai-credits", 50);
await subscrio.Credits.GrantAsync(new CreditGrantInput(
    CustomerKey: "acme", CurrencyKey: "ai-credits", Amount: 500,
    GrantType: "prepaid", IdempotencyKey: "payment-42-ai-credits"));
```

</div>

Consumption rules belong to a feature and currency, not to an individual subscription. The same feature reused in another product keeps those costs. Add a second feature rule against the same currency to share the wallet. A metered feature cannot also have a credit consumption rule.

## Check access, then charge atomically

The application authenticates the request and selects its customer. A feature check determines whether image generation is included. Credit consumption determines whether the wallet can pay for it.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const enabled = await subscrio.featureChecker.isEnabledForCustomer(
  'acme', 'projecthub', 'generate-image'
);
if (!enabled) throw new Error('Image generation is not included');
const receipt = await subscrio.credits.consume({
  customerKey: 'acme', featureKey: 'generate-image', units: 2, idempotencyKey: 'image-job-42'
});
console.log(receipt.balances.find(b => b.currencyKey === 'ai-credits')?.available); // 400
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var enabled = await subscrio.FeatureChecker.IsEnabledForCustomerAsync(
    "acme", "projecthub", "generate-image");
if (!enabled) throw new InvalidOperationException("Image generation is not included");
var receipt = await subscrio.Credits.ConsumeAsync(new CreditConsumeInput(
    CustomerKey: "acme", FeatureKey: "generate-image", Units: 2, IdempotencyKey: "image-job-42"));
Console.WriteLine(receipt.Balances.Find(b => b.CurrencyKey == "ai-credits")?.Available); // 400
```

</div>

`canConsume` / `CanConsumeAsync` is useful for a preview, but does not reserve funds. Consumption checks and debits all configured currencies together. Insufficient funds raise `InsufficientCreditsError` / `InsufficientCreditsException` without a partial debit. A missing cost rule is a configuration error, not a free action.

Keep the receipt's operation ID and the request's idempotency key. Grant, consumption, and adjustment operations share one key namespace per customer. Retry identical input with the same key; different input conflicts. A replay returns its saved receipt rather than recalculating today's balance.

## Issue recurring plan credits

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.credits.setPlanGrant('starter', 'ai-credits', {
  amount: 1000, cadence: 'monthly', expiryPolicy: 'grant_period_end', cancellationPolicy: 'retain'
});
const report = await subscrio.credits.processScheduledGrants();
console.log(report);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
await subscrio.Credits.SetPlanGrantAsync("starter", "ai-credits", new PlanCreditGrantInput(
    Amount: 1000, Cadence: "monthly", ExpiryPolicy: "grant_period_end", CancellationPolicy: "retain"));
var report = await subscrio.Credits.ProcessScheduledGrantsAsync();
Console.WriteLine(report);
```

</div>

Run scheduled processing from your application's scheduler. Balance checks and spending also reconcile due grants and expirations, so these apparent reads may write accounting records.

| Setting | Meaning |
| --- | --- |
| `once` | One automatic grant per subscription and currency, even after catalog edits. |
| `monthly` or `yearly` | Grants anchored to the original eligible start, with month-end clamping rather than accumulating date drift. |
| `billing_period` | Grants based on subscription billing boundaries maintained by your integration. |
| `expiryPolicy: none` | Issued credits have no scheduled grant-period expiration. |
| `expiryPolicy: grant_period_end` | Remaining credits expire at that grant period's end. |
| `cancellationPolicy: retain` | Ending the subscription preserves issued credits until their own expiry. |
| `cancellationPolicy: expire` | Remaining grants attributed to the ending subscription expire. Other grants are unaffected. |

Trials receive no automatic plan grants until they end. Archived subscriptions stop issuance and do not backfill archived windows when restored. Rule changes settle already-due windows under the old rule; a cadence change starts at the next saved due boundary. Changing a plan rule does not rewrite amounts already issued.

Reconciliation is bounded to 240 due windows per subscription/currency. Excessive catch-up fails that reconciliation atomically. The scheduled batch processes customers separately, so an error does not roll back customers already processed. Monitor failures rather than assuming a single all-customer transaction.

## Expiration and spending order

The library spends lower-priority-number grants first, then the earliest expiry, then grant ID. Grants without expiry come last within their priority. Expiring a grant records the removal of its remaining amount; the original grant and ledger history remain.

Manual and promotional grants follow the same wallet accounting as prepaid grants. Archiving a currency prevents new grants and spending while keeping its history available. Retained references can prevent deletion.

## Correct a completed charge

The credit transaction does not include your external image-generation work. If that work fails, your application decides whether to issue a correction. Use a new key and a reason:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.credits.adjust({
  customerKey: 'acme', currencyKey: 'ai-credits', amount: 100,
  reason: 'Image job 42 failed after charging', idempotencyKey: 'image-job-42-refund'
});
const ledger = await subscrio.credits.listLedgerEntries('acme', 'ai-credits', { limit: 20 });
console.log(ledger);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
await subscrio.Credits.AdjustAsync(new CreditAdjustInput(
    CustomerKey: "acme", CurrencyKey: "ai-credits", Amount: 100,
    Reason: "Image job 42 failed after charging", IdempotencyKey: "image-job-42-refund"));
var ledger = await subscrio.Credits.ListLedgerEntriesAsync("acme", "ai-credits", limit: 20);
Console.WriteLine(ledger.Count);
```

</div>

A positive adjustment creates additional credits; a negative adjustment removes available credits and cannot overdraw the wallet. It does not erase the original charge or restore the original grant's expiry. Use the ledger to explain both entries.

See [Credits](credits.md) for types and methods, [Metered Usage Workflows](metered-usage-workflows.md) for independent quotas, and [Extending Subscrio](how-to-extend.md) for after-hook failures following committed accounting operations.
