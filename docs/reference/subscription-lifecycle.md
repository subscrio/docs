---
title: Subscription Lifecycle
description: Understand date precedence, trial outcomes, cancellation, and transitions between plans.
---

# Subscription Lifecycle

A subscription's status is calculated from dates; it is not a field you set directly. Billing-period dates and archive state are separate from that status.

<span id="complete-conditions-after-precedence"></span>
<span id="precedence-and-boundary-cases"></span>
<span id="status-definitions"></span>
<span id="status-flow"></span>
<span id="flow-access-title"></span>
<span id="flow-cancel-title"></span>
<span id="flow-expire-title"></span>
<span id="find-transitioned-subscriptions"></span>
<span id="configure-what-happens-after-a-trial"></span>
<span id="dates-used-by-a-trial"></span>
<span id="choose-the-outcome"></span>
<span id="start-billing-after-the-trial"></span>
<span id="create-the-subscription"></span>
<span id="state-when-created"></span>
<span id="state-after-the-trial-ends"></span>
<span id="move-to-a-free-plan-after-the-trial"></span>
<span id="configure-the-plan-once"></span>
<span id="create-the-subscription_1"></span>
<span id="state-when-created_1"></span>
<span id="run-the-transition-after-the-trial"></span>
<span id="result-of-the-transition"></span>
<span id="end-access-after-the-trial"></span>
<span id="create-the-subscription_2"></span>
<span id="state-when-created_2"></span>
<span id="state-after-the-trial-ends_1"></span>
<span id="details-worth-checking"></span>
<span id="common-operations"></span>
<span id="grant-reconciliation-during-lifecycle-changes"></span>

## How status is calculated

The first matching condition wins. A timestamp equal to the current time is considered reached.

| Order | Condition | Status |
| --- | --- | --- |
| 1 | A cancellation date is set and is still in the future. | `cancellation_pending` |
| 2 | A cancellation date is set and has been reached. | `cancelled` |
| 3 | The expiration date has been reached. | `expired` |
| 4 | The activation date is still in the future. | `pending` |
| 5 | The trial end date is still in the future. | `trial` |
| 6 | None of the above. | `active` |

Cancellation takes precedence even when another date would imply expiration or trial. `currentPeriodStart`, `currentPeriodEnd`, and `isArchived` do not participate in this status calculation. Creation defaults activation to the current time; provide a future activation date for pending access.

Normal reads use a database status view and the database's current time. Feature resolution and accounting use the configured library clock. Keep those clocks consistent; a test clock does not change the database view's time.

## Decide what happens after a trial

The examples use the customer and billing cycle created in [Getting Started](getting-started.md).

| Intended outcome | Configuration |
| --- | --- |
| Continue on the same plan | Set a trial end without an expiration date. Status becomes active when the trial ends. |
| End the trial's access | Set expiration to the trial end. Status becomes expired. |
| Replace it with a free plan | Set expiration to the trial end, configure the plan's transition target, and run the transition job. |

This example ends the trial after 14 days:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const end = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
await subscrio.subscriptions.createSubscription({
  key: 'acme-trial', customerKey: 'acme', billingCycleKey: 'starter-monthly',
  trialEndDate: end.toISOString(), expirationDate: end.toISOString()
});
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var end = DateTime.UtcNow.AddDays(14);
await subscrio.Subscriptions.CreateSubscriptionAsync(new CreateSubscriptionDto(
    CustomerKey: "acme", BillingCycleKey: "starter-monthly", Key: "acme-trial",
    TrialEndDate: end, ExpirationDate: end));
```

</div>

Becoming active does not initiate a payment. Billing belongs to your application or provider. To make a billing period start after the trial, explicitly set its start and end dates; the default period begins at creation.

To end a trial early, update the subscription with `clearTrialEndDate: true` / `ClearTrialEndDate: true`. This removes the trial end date; it does not remove an expiration date you previously set.

## Moving an expired subscription to another plan

Create the target billing cycle before assigning it to the current plan. The target must belong to the same product. This setting affects all subscriptions on that plan when they expire.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.plans.createPlan({
  key: 'free', productKey: 'projecthub', displayName: 'Free'
});
await subscrio.billingCycles.createBillingCycle({
  key: 'free-forever', planKey: 'free', displayName: 'No renewal', durationUnit: 'forever'
});
await subscrio.plans.updatePlan('starter', {
  onExpireTransitionToBillingCycleKey: 'free-forever'
});
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
await subscrio.Plans.CreatePlanAsync(new CreatePlanDto("projecthub", "free", "Free"));
await subscrio.BillingCycles.CreateBillingCycleAsync(new CreateBillingCycleDto(
    PlanKey: "free", Key: "free-forever", DisplayName: "No renewal", DurationUnit: "forever"));
await subscrio.Plans.UpdatePlanAsync("starter", new UpdatePlanDto(
    OnExpireTransitionToBillingCycleKey: "free-forever"));
```

</div>

Run the following operation periodically from your application's scheduler:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const report = await subscrio.subscriptions.transitionExpiredSubscriptions();
console.log(report.processed, report.transitioned, report.errors);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var report = await subscrio.Subscriptions.TransitionExpiredSubscriptionsAsync();
Console.WriteLine($"Processed: {report.Processed}; transitioned: {report.Transitioned}");
foreach (var error in report.Errors) Console.WriteLine(error);
```

</div>

Each call considers up to 1,000 eligible expired subscriptions. The library saves a replacement with a versioned key, then archives the original and records its transition time. The replacement keeps metadata, but does not copy feature overrides, add-on attachments, or the Stripe subscription ID. Credit grants already issued remain in their original accounting history.

The replacement and archive writes are not one transaction. Inspect report errors and reconcile partial failures before retrying blindly. Cancellation is not expiration and does not use this transition path.

## Cancellation and access

A future cancellation date immediately produces `cancellation_pending`. Whether access continues depends on the operation:

- Default customer feature selection excludes subscriptions with any cancellation date.
- Customer feature resolution with an explicit subscription rule and metered accounting accept a future cancellation until its timestamp.
- Subscription-specific feature getters resolve values without checking lifecycle eligibility.

Do not equate a returned value or the status name with a complete authorization decision. See [How Feature Values Are Calculated](feature-resolution.md#which-subscriptions-contribute) for the selection rules.

The current subscription update DTO cannot clear a cancellation or expiration date. Omitting the property or passing `null` leaves its existing value unchanged, so do not use either as an undo operation.

Automatic credit grants start after trials and stop when a subscription becomes ineligible. Cancellation retains issued credits by default; an `expire` grant policy expires the affected subscription's grants. Unrelated prepaid balances remain available.

## Billing periods and renewal

Reaching the current period's end does not itself expire or renew the subscription. Your integration must update its period dates. Billing-period meters reject stale boundaries instead of silently starting a new allowance. Scheduled credit issuance also depends on the configured cadence and current subscription dates.

Changing a subscription's billing cycle changes its plan relationship but does not automatically recalculate its period. Send the intended period dates with a plan change. Temporary overrides persist until your application clears them; neither passing time nor the current Stripe invoice handler clears them automatically.

## Archive and removal

Archiving prevents ordinary subscription updates and excludes the subscription from accounting and explicit-rule customer checks. It does not change the calculated date status, and default customer selection does not exclude archive state. Restore before updating an archived subscription.

Deletion is permanent and may be blocked by retained accounting or attachment records. Prefer preserving an ended subscription when its history is needed. See [Relationships](relationships.md#history-and-deletion) and [Subscriptions](subscriptions.md).
