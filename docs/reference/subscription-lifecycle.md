---
title: Subscription lifecycle
description: How Subscrio computes pending, trial, active, cancellation_pending, cancelled, and expired from subscription dates in TypeScript and .NET.
---

# Subscription lifecycle

A subscription's `status` is calculated from its dates each time you read it, so you do not update the status directly. Both SDKs use the same rules: TypeScript reads the `subscrio.subscription_status_view` SQL view, while .NET applies the equivalent logic in `SubscriptionMapper.ComputeStatus`.

This page explains which date wins when several are set, the usual paths between statuses, and how to configure the end of a trial.

!!! note
    `suspended` is a customer status, not a subscription status. A subscription can be `pending`, `trial`, `active`, `cancellation_pending`, `cancelled`, or `expired`.

## How status is calculated

Subscrio does not calculate each status from one date in isolation. It evaluates an ordered decision tree against the current time and returns as soon as a condition matches. The PostgreSQL view used by normal reads and the .NET application fallback implement the same sequence:

```text
if cancellationDate is set:
    if cancellationDate > now: return cancellation_pending
    otherwise:                 return cancelled

if expirationDate is set and expirationDate <= now:
    return expired

if activationDate is set and activationDate > now:
    return pending

if trialEndDate is set and trialEndDate > now:
    return trial

return active
```

The database implementation compares the stored timestamps with PostgreSQL `NOW()`. The .NET fallback captures `DateHelper.Now()` once, which returns `DateTime.UtcNow`, and compares every date with that value.

### Complete conditions after precedence

The conditions below include the earlier checks that must fail before a status can be returned.

`cancellation_pending`
: `cancellationDate` is set and is later than the current time. No other date is considered.

`cancelled`
: `cancellationDate` is set and is equal to or earlier than the current time. No other date is considered.

`expired`
: `cancellationDate` is not set, and `expirationDate` is set and has been reached.

`pending`
: `cancellationDate` is not set; `expirationDate` is either not set or is still in the future; and `activationDate` is set and is still in the future.

`trial`
: `cancellationDate` is not set; `expirationDate` is either not set or is still in the future; `activationDate` is either not set or has been reached; and `trialEndDate` is set and is still in the future.

`active`
: No earlier rule matches. In full, `cancellationDate` is not set; `expirationDate` is either not set or is still in the future; `activationDate` is either not set or has been reached; and `trialEndDate` is either not set or has been reached.

### Precedence and boundary cases

- Cancellation has the highest priority. Any non-null `cancellationDate` produces either `cancellation_pending` or `cancelled`, even when the subscription has already reached its expiration date.
- Expiration is checked before activation and trial. A reached `expirationDate` produces `expired` even when `activationDate` or `trialEndDate` is still in the future.
- Activation is checked before trial. If both dates are in the future, the result is `pending`, not `trial`.
- A date equal to the current time is considered reached. Equality produces `cancelled` or `expired`; it does not produce `pending` or `trial`.
- A future `expirationDate` does not create a separate status. The subscription can still be `pending`, `trial`, or `active` until that date is reached.

Only `cancellationDate`, `expirationDate`, `activationDate`, and `trialEndDate` participate in this calculation. `currentPeriodStart`, `currentPeriodEnd`, `isArchived`, `transitionedAt`, Stripe identifiers, metadata, and feature overrides do not affect `status`.

When a subscription is created without an explicit `activationDate`, both SDKs default it to the current time. The new subscription therefore does not start as `pending` unless you provide a future activation date.

## Status definitions

<div class="status-definitions" markdown>

| Status | What it means | Common use |
| --- | --- | --- |
| `pending` | Access is scheduled to begin later. | A subscription with a future start date. |
| `trial` | The trial end date has not been reached. | Temporary access before billing or expiration. |
| `active` | No higher-priority rule applies. | Normal ongoing access. This can include an expiration date that is still in the future. |
| `cancellation_pending` | Cancellation is scheduled for a future date. | Keeping access through the end of a paid period after a cancellation request. |
| `cancelled` | The cancellation date has been reached. | A subscription ended by cancellation. |
| `expired` | The expiration date has been reached and no cancellation rule applies. | A fixed term ended, or a trial was configured to expire. |

</div>

## Status flow

The first row shows the usual path into ongoing access. The second and third rows show the two ways a subscription commonly ends. These are examples, not enforced steps: setting a date in the past can move a subscription directly to `cancelled` or `expired`.

<div class="subscription-flow" role="img" aria-label="Common subscription status paths. Pending can lead to trial or active. Trial can lead to active. A subscription can become cancellation pending and then cancelled, or become expired when its expiration date is reached.">
  <section class="subscription-flow__section" aria-labelledby="flow-access-title">
    <h3 id="flow-access-title">Starting and continuing access</h3>
    <div class="subscription-flow__path subscription-flow__path--access">
      <div class="subscription-flow__status subscription-flow__status--pending">
        <code>pending</code>
        <span>Access has not started</span>
      </div>
      <div class="subscription-flow__arrow" aria-hidden="true"><span>start date reached</span></div>
      <div class="subscription-flow__status subscription-flow__status--trial">
        <code>trial</code>
        <span>Trial access</span>
      </div>
      <div class="subscription-flow__arrow" aria-hidden="true"><span>trial ends</span></div>
      <div class="subscription-flow__status subscription-flow__status--active">
        <code>active</code>
        <span>Ongoing access</span>
      </div>
    </div>
    <p class="subscription-flow__aside"><code>pending</code> may move straight to <code>active</code> when there is no trial.</p>
  </section>

  <section class="subscription-flow__section" aria-labelledby="flow-cancel-title">
    <h3 id="flow-cancel-title">Ending by cancellation</h3>
    <div class="subscription-flow__path subscription-flow__path--ending">
      <div class="subscription-flow__origin">From any current status</div>
      <div class="subscription-flow__arrow" aria-hidden="true"><span>set a future cancellation date</span></div>
      <div class="subscription-flow__status subscription-flow__status--cancellation-pending">
        <code>cancellation_<wbr>pending</code>
        <span>Access continues for now</span>
      </div>
      <div class="subscription-flow__arrow" aria-hidden="true"><span>date reached</span></div>
      <div class="subscription-flow__status subscription-flow__status--cancelled">
        <code>cancelled</code>
        <span>Cancellation is final</span>
      </div>
    </div>
  </section>

  <section class="subscription-flow__section" aria-labelledby="flow-expire-title">
    <h3 id="flow-expire-title">Ending by expiration</h3>
    <div class="subscription-flow__path subscription-flow__path--expiration">
      <div class="subscription-flow__origin">From any current status</div>
      <div class="subscription-flow__arrow" aria-hidden="true"><span>expiration date reached</span></div>
      <div class="subscription-flow__status subscription-flow__status--expired">
        <code>expired</code>
        <span>The fixed term has ended</span>
      </div>
    </div>
  </section>
</div>

Removing or changing a date can make the calculated status move back to an earlier state. For example, clearing a future `cancellationDate` returns the subscription to the status determined by its activation, trial, and expiration dates.

## Moving an expired subscription to another plan

An expired subscription can move automatically to another billing cycle. This is useful when a paid trial should fall back to a free plan. Set `onExpireTransitionToBillingCycleKey` on the current plan, then run `transitionExpiredSubscriptions()` in TypeScript or `TransitionExpiredSubscriptionsAsync()` in .NET.

The transition job:

1. Finds expired subscriptions whose plans have a transition target.
2. Archives the old subscription and records the time in `transitioned_at`.
3. Creates a subscription for the target billing cycle.
4. Versions the key, such as `original-key` to `original-key-v1`, then `original-key-v2`.

The new subscription keeps the old metadata but not its feature overrides. The original Stripe subscription ID stays on the archived record for historical reference.

### Find transitioned subscriptions

To find all subscriptions that were transitioned:

=== "TypeScript"
    ```sql
    SELECT * FROM subscrio.subscriptions 
    WHERE transitioned_at IS NOT NULL;
    ```

=== ".NET"
    ```sql
    SELECT * FROM subscrio.subscriptions 
    WHERE transitioned_at IS NOT NULL;
    ```

Add a date range to the query when you need to audit a particular period.

## Configure what happens after a trial

Before creating a trial subscription, decide what the customer should receive when the trial ends. The dates you set determine whether paid access begins, the customer moves to a free plan, or access ends.

### Dates used by a trial

- `trialEndDate` keeps the subscription in `trial` until that time, unless a higher-priority rule applies.
- `expirationDate` ends access. Set it to the trial end time when the subscription should expire with the trial.
- `currentPeriodStart` and `currentPeriodEnd` describe the billing period. Set `currentPeriodStart` to the trial end time when the first paid period should begin then.

### Choose the outcome

| Desired outcome | `trialEndDate` | `expirationDate` | Plan transition | Result after the trial |
|----------|----------------|------------------|------------------|------------------|
| Start billing | Future date | Not set | None | The existing subscription becomes `active`. |
| Move to a free plan | Future date | Same as `trialEndDate` | Set `onExpireTransitionToBillingCycleKey` | The existing subscription expires, and the transition job creates the free subscription. |
| End access | Future date | Same as `trialEndDate` | None | The subscription becomes `expired`. |

### Start billing after the trial

Use this setup for a paid subscription that should continue after its trial. Do not set `expirationDate`. At the trial end time, the calculated status changes from `trial` to `active`.

#### Create the subscription

=== "TypeScript"
    ```typescript
    // Calculate trial end date (7 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    // Create subscription
    const subscription = await subscrio.subscriptions.createSubscription({
      key: 'customer-123-pro-subscription',
      customerKey: 'customer-123',
      billingCycleKey: 'pro-monthly',
      trialEndDate: trialEndDate.toISOString(),
      currentPeriodStart: trialEndDate.toISOString(),
      // expirationDate is NOT set - billing will start after trial
    });
    ```

=== ".NET"
    ```csharp
    // Calculate trial end date (7 days from now)
    var trialEndDate = DateTime.UtcNow.AddDays(7);

    // Create subscription
    var subscription = await subscrio.Subscriptions.CreateSubscriptionAsync(new CreateSubscriptionDto(
        Key: "customer-123-pro-subscription",
        CustomerKey: "customer-123",
        BillingCycleKey: "pro-monthly",
        TrialEndDate: trialEndDate,
        CurrentPeriodStart: trialEndDate
        // ExpirationDate is NOT set - billing will start after trial
    ));
    ```

#### State when created

=== "TypeScript"
    ```typescript
    {
      trialEndDate: "2025-01-27T00:00:00Z",      // 7 days from now
      expirationDate: null,                      // NOT set
      currentPeriodStart: "2025-01-27T00:00:00Z", // Same as trialEndDate (billing starts when trial ends)
      currentPeriodEnd: "2025-02-27T00:00:00Z",   // currentPeriodStart + 1 month
      activationDate: "2025-01-20T00:00:00Z",    // Now
      status: "trial"                             // Because trialEndDate > NOW()
    }
    ```

=== ".NET"
    ```csharp
    // SubscriptionDto shape (equivalent structure):
    // TrialEndDate: "2025-01-27T00:00:00Z", ExpirationDate: null,
    // CurrentPeriodStart: "2025-01-27T00:00:00Z", CurrentPeriodEnd: "2025-02-27T00:00:00Z",
    // ActivationDate: "2025-01-20T00:00:00Z", Status: "trial"
    ```

#### State after the trial ends

=== "TypeScript"
    ```typescript
    {
      trialEndDate: "2025-01-27T00:00:00Z",      // Still set (historical record)
      expirationDate: null,                       // Still not set
      currentPeriodStart: "2025-01-27T00:00:00Z", // Billing period started
      currentPeriodEnd: "2025-02-27T00:00:00Z",   // First billing period ends
      status: "active"                            // trialEndDate <= NOW(), no expiration
    }
    ```

=== ".NET"
    ```csharp
    // SubscriptionDto shape: TrialEndDate, ExpirationDate: null,
    // CurrentPeriodStart, CurrentPeriodEnd, Status: "active"
    ```

The subscription is now in its first paid billing period. Charging the customer is the responsibility of your billing integration.

---

### Move to a free plan after the trial

Use this setup when the trial should expire and a transition job should create a replacement subscription on a free plan.

#### Configure the plan once

Set the paid plan's transition target to a billing cycle on the free plan:

=== "TypeScript"
    ```typescript
    // Create or update the paid plan to specify transition target
    const paidPlan = await subscrio.plans.createPlan({
      productKey: 'my-product',
      key: 'pro-plan',
      displayName: 'Pro Plan',
      onExpireTransitionToBillingCycleKey: 'free-monthly'
    });
    ```

=== ".NET"
    ```csharp
    // Create plan with transition target, or update existing plan:
    var paidPlan = await subscrio.Plans.CreatePlanAsync(new CreatePlanDto(
        ProductKey: "my-product",
        Key: "pro-plan",
        DisplayName: "Pro Plan",
        OnExpireTransitionToBillingCycleKey: "free-monthly"
    ));
    // Or: await subscrio.Plans.UpdatePlanAsync("pro-plan", new UpdatePlanDto(OnExpireTransitionToBillingCycleKey: "free-monthly"));
    ```

!!! note
    `onExpireTransitionToBillingCycleKey` belongs to the plan. The target billing cycle, such as `free-monthly`, must already exist.

#### Create the subscription

=== "TypeScript"
    ```typescript
    // Calculate trial end date (14 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14);

    const subscription = await subscrio.subscriptions.createSubscription({
      key: 'customer-123-pro-trial',
      customerKey: 'customer-123',
      billingCycleKey: 'pro-monthly',
      trialEndDate: trialEndDate.toISOString(),
      expirationDate: trialEndDate.toISOString(), // Same as trialEndDate - expires when trial ends
    });
    ```

=== ".NET"
    ```csharp
    // Calculate trial end date (14 days from now)
    var trialEndDate = DateTime.UtcNow.AddDays(14);

    var subscription = await subscrio.Subscriptions.CreateSubscriptionAsync(new CreateSubscriptionDto(
        Key: "customer-123-pro-trial",
        CustomerKey: "customer-123",
        BillingCycleKey: "pro-monthly",
        TrialEndDate: trialEndDate,
        ExpirationDate: trialEndDate  // Same as trialEndDate - expires when trial ends
    ));
    ```

#### State when created

=== "TypeScript"
    ```typescript
    {
      trialEndDate: "2025-02-03T00:00:00Z",      // 14 days from now
      expirationDate: "2025-02-03T00:00:00Z",    // Same as trialEndDate
      currentPeriodStart: "<now unless you pass currentPeriodStart>",
      currentPeriodEnd: "<currentPeriodStart + billing cycle>",
      status: "trial"                             // trialEndDate > NOW()
    }
    ```

=== ".NET"
    ```csharp
    // SubscriptionDto: TrialEndDate, ExpirationDate (same), CurrentPeriodStart, CurrentPeriodEnd, Status: "trial"
    ```

#### Run the transition after the trial

Once `expirationDate` is reached, the subscription becomes `expired`. Run the transition job on a schedule to create the free subscription:

=== "TypeScript"
    ```typescript
    // Run this periodically (e.g., via cron job) to process expired subscriptions
    const report = await subscrio.subscriptions.transitionExpiredSubscriptions();

    console.log(`Processed: ${report.processed}`);
    console.log(`Transitioned: ${report.transitioned}`);
    console.log(`Errors: ${report.errors.length}`);
    ```

=== ".NET"
    ```csharp
    // Run this periodically (e.g., via cron job) to process expired subscriptions
    var report = await subscrio.Subscriptions.TransitionExpiredSubscriptionsAsync();

    Console.WriteLine($"Processed: {report.Processed}");
    Console.WriteLine($"Transitioned: {report.Transitioned}");
    Console.WriteLine($"Errors: {report.Errors.Count}");
    ```

#### Result of the transition

The job archives the trial subscription, sets its `transitioned_at` timestamp, and creates the replacement. The new key is versioned from `customer-123-pro-trial` to `customer-123-pro-trial-v1`. Metadata carries over, but feature overrides do not. The old Stripe subscription ID remains on the archived record.

The replacement subscription looks like this:

=== "TypeScript"
    ```typescript
    {
      key: "customer-123-pro-trial-v1",
      billingCycleKey: "free-monthly", // Transitioned to free plan
      trialEndDate: null,               // No trial on free plan
      expirationDate: null,              // Free plan doesn't expire
      status: "active"                   // Immediately active
    }
    ```

=== ".NET"
    ```csharp
    // SubscriptionDto: Key: "customer-123-pro-trial-v1", BillingCycleKey: "free-monthly",
    // TrialEndDate: null, ExpirationDate: null, Status: "active"
    ```

---

### End access after the trial

Use this setup when the subscription should simply expire at the end of the trial. Set `expirationDate` to the same time as `trialEndDate`, and leave the plan transition target unset.

#### Create the subscription

=== "TypeScript"
    ```typescript
    // Calculate trial end date (7 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    const subscription = await subscrio.subscriptions.createSubscription({
      key: 'customer-123-trial-only',
      customerKey: 'customer-123',
      billingCycleKey: 'premium-monthly',
      trialEndDate: trialEndDate.toISOString(),
      expirationDate: trialEndDate.toISOString(), // Same as trialEndDate - expires when trial ends
      // Plan does NOT have onExpireTransitionToBillingCycleKey set
    });
    ```

=== ".NET"
    ```csharp
    // Calculate trial end date (7 days from now)
    var trialEndDate = DateTime.UtcNow.AddDays(7);

    var subscription = await subscrio.Subscriptions.CreateSubscriptionAsync(new CreateSubscriptionDto(
        Key: "customer-123-trial-only",
        CustomerKey: "customer-123",
        BillingCycleKey: "premium-monthly",
        TrialEndDate: trialEndDate,
        ExpirationDate: trialEndDate  // Same as trialEndDate - expires when trial ends
        // Plan does NOT have OnExpireTransitionToBillingCycleKey set
    ));
    ```

#### State when created

=== "TypeScript"
    ```typescript
    {
      trialEndDate: "2025-01-27T00:00:00Z",      // 7 days from now
      expirationDate: "2025-01-27T00:00:00Z",    // Same as trialEndDate
      currentPeriodStart: "<now unless you pass currentPeriodStart>",
      currentPeriodEnd: "<currentPeriodStart + billing cycle>",
      status: "trial"                             // trialEndDate > NOW()
    }
    ```

=== ".NET"
    ```csharp
    // SubscriptionDto: TrialEndDate, ExpirationDate (same), CurrentPeriodStart, CurrentPeriodEnd, Status: "trial"
    ```

#### State after the trial ends

=== "TypeScript"
    ```typescript
    {
      trialEndDate: "2025-01-27T00:00:00Z",      // Historical record
      expirationDate: "2025-01-27T00:00:00Z",    // Now in the past
      status: "expired"                          // expirationDate <= NOW()
    }
    ```

=== ".NET"
    ```csharp
    // SubscriptionDto: TrialEndDate, ExpirationDate (historical), Status: "expired"
    ```

The record remains in the database for history, but its status is `expired` and the feature checker grants no access from it.

---

### Details worth checking

- If you omit `currentPeriodStart`, the create operation sets it to the current time, not the trial end time.
- If you omit `currentPeriodEnd`, Subscrio calculates it from the period start and the billing cycle duration. Forever cycles have no period end.
- Stripe webhooks usually supply the authoritative billing period dates. Update the subscription from those events.
- A plan transition does not run by itself. Schedule `transitionExpiredSubscriptions()` or `TransitionExpiredSubscriptionsAsync()`.
- When `trialEndDate` and `expirationDate` are the same future time, the subscription is `trial` until that instant and `expired` afterward.

## Common operations

- To leave a trial immediately, remove `trialEndDate` or move it into the past.
- To cancel at the end of the current period, set `cancellationDate` to that period's end. The subscription remains accessible as `cancellation_pending` until then.
- To undo a scheduled cancellation, remove `cancellationDate`. The other dates then determine whether the subscription is `trial`, `active`, or another status.
- Subscription APIs do not include `suspend()` or `resume()`. `suspended` applies to customers instead.

Refer back to [Subscriptions](subscriptions.md) for lifecycle-related APIs (`archiveSubscription`, `unarchiveSubscription`, `clearTemporaryOverrides`, `transitionExpiredSubscriptions`), and to [Feature Checker](feature-checker.md) for how these statuses affect runtime feature access.
