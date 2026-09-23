---
title: Metered Usage Workflows
description: Define quotas, record accepted usage atomically, and handle periods, overages, and retries.
---

# Metered Usage Workflows

A meter tracks consumption of one feature during a period. Its allowance comes from the same plan, add-on, and override resolution used for feature values.

Continue from [Getting Started](getting-started.md). Run this guide's examples in order on that development catalog.

## Define a monthly API allowance

Create a meter shared by Acme's subscriptions to ProjectHub. This example takes the most generous subscription allowance rather than adding every subscription's limit.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.features.createFeature({
  key: 'api-calls', displayName: 'API calls', valueType: 'metered', defaultValue: '0',
  meteredConfig: {
    usageScope: 'customer', aggregation: 'count', resetPeriod: 'monthly', enforcement: 'hard'
  }
});
await subscrio.products.associateFeature('projecthub', 'api-calls', {
  addonRule: 'additive', subscriptionRule: 'most_generous'
});
await subscrio.plans.setFeatureValue('starter', 'api-calls', '10000');
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
await subscrio.Features.CreateFeatureAsync(new CreateFeatureDto(
    Key: "api-calls", DisplayName: "API calls", ValueType: "metered", DefaultValue: "0",
    MeteredConfig: new MeteredFeatureConfigDto(
        UsageScope: "customer", Aggregation: "count", ResetPeriod: "monthly", Enforcement: "hard")));
await subscrio.Products.AssociateFeatureAsync("projecthub", "api-calls",
    new FeatureResolutionOptions(AddonRule: "additive", SubscriptionRule: "most_generous"));
await subscrio.Plans.SetFeatureValueAsync("starter", "api-calls", "10000");
```

</div>

Meter configuration belongs in feature creation and update. The plan stores the allowance, here 10,000, as the feature value.

## Choose who shares usage

| Scope | Counter and required input |
| --- | --- |
| Customer | One counter per customer, product, feature, and period. Omit the subscription key; supplying it is rejected. |
| Subscription | A separate counter for each subscription. Supply a subscription key owned by the customer and product. |

Reusing a feature in two products creates separate product meters. With customer scope, the resolution rule controls the allowance while all eligible subscriptions share consumption.

`count` records one event per call and requires quantity one. `sum` records a positive integral quantity, such as tokens or bytes. Quantities and totals must remain within 9,007,199,254,740,991.

## Read current usage

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const usage = await subscrio.metering.getUsage('acme', 'projecthub', 'api-calls', {
  requestedUsage: 0
});
console.log(usage.consumed, usage.limit, usage.remaining);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var usage = await subscrio.Metering.GetUsageAsync("acme", "projecthub", "api-calls",
    new UsageOptions(RequestedUsage: 0));
Console.WriteLine($"{usage.Consumed} used of {usage.Limit}; {usage.Remaining} remaining");
```

</div>

Passing zero inspects the current state without projecting another unit. The default requested usage is one. This read does not reserve capacity; another request can consume it immediately afterward.

## Record usage before doing the work

The report operation checks eligibility and allowance while recording the event in one transaction. Use a stable key from the business request:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const report = await subscrio.metering.reportUsage('acme', 'projecthub', 'api-calls', 1, {
  idempotencyKey: 'api-request-42'
});
const replay = await subscrio.metering.reportUsage('acme', 'projecthub', 'api-calls', 1, {
  idempotencyKey: 'api-request-42'
});
console.log(report.eventId === replay.eventId); // true
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var report = await subscrio.Metering.ReportUsageAsync("acme", "projecthub", "api-calls", 1,
    new UsageReportOptions(IdempotencyKey: "api-request-42"));
var replay = await subscrio.Metering.ReportUsageAsync("acme", "projecthub", "api-calls", 1,
    new UsageReportOptions(IdempotencyKey: "api-request-42"));
Console.WriteLine(report.EventId == replay.EventId); // True
```

</div>

Proceed with the protected work only after the report succeeds. Under hard enforcement, a denied report throws `UsageLimitExceededError` / `UsageLimitExceededException` and writes no event. Under soft enforcement, an eligible overage is recorded with `isOverage` / `IsOverage`; soft mode does not grant access without an eligible subscription.

Store and reuse the same key and input for a retry. A changed request under that key is an idempotency conflict. Keys are unique across all usage features for one customer, so include the operation identity rather than using a counter local to one feature. Replays return the original snapshot, even after a period changes.

The database transaction does not include your external work. If that work later fails, recorded usage remains; negative usage reports and automatic rollback are not supported. Make the downstream operation idempotent too.

## Calendar and billing periods

Calendar windows use UTC: hourly, daily, Monday-based weekly, monthly, or yearly. Their start is included and their end is excluded. A new window has a new counter; history remains.

Billing-period meters require subscription scope. The current instant must fall within that subscription's start and end dates. Missing or stale dates raise `MeteringPeriodError` / `MeteringPeriodException`. Update periods through your billing workflow before accepting more usage; do not hide the error by inventing a new window.

## Change an allowance safely

A plan change, add-on, or override changes the live limit without erasing consumption. Lowering the limit below consumption can make the next hard-enforced request fail. Once usage exists, the feature type, scope, aggregation, and reset period cannot change. Enforcement may change, but supply the complete meter configuration when updating it.

Use history methods for accepted events and stored response snapshots. Use current usage for today's state. See [Metered Usage](metering.md), [How Feature Values Are Calculated](feature-resolution.md), and [Credit Wallet Workflows](credit-wallet-workflows.md) if several actions should spend one shared balance instead.
