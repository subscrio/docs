---
title: Stripe Setup
description: Map Stripe prices and verified webhook events to customer subscriptions.
---

# Stripe Setup

Subscrio creates Checkout Sessions and translates supported Stripe events into local subscription changes. Your server owns the HTTP endpoint, signature verification, event delivery, and authorization of checkout requests.

<span id="prerequisites"></span>
<span id="1-map-stripe-prices-to-billing-cycles"></span>
<span id="2-attach-subscrio-metadata-when-creating-stripe-entities"></span>
<span id="subscription-linking-behavior"></span>
<span id="manual-metadata-setup"></span>
<span id="3-receiving-and-verifying-webhooks"></span>
<span id="4-required-stripe-events"></span>
<span id="5-data-requirements-for-security-and-mapping"></span>
<span id="6-creating-checkout-sessions-recommended"></span>
<span id="basic-usage"></span>
<span id="updating-existing-subscriptions"></span>
<span id="stripe-customer-creation"></span>
<span id="full-feature-access"></span>
<span id="stripe-secret-key"></span>
<span id="7-end-to-end-flow-summary"></span>
<span id="flow-1-new-subscription-via-checkout-recommended"></span>
<span id="flow-2-update-existing-subscription-via-checkout"></span>
<span id="flow-3-manual-stripe-integration"></span>
<span id="credits-meters-and-stripe-changes"></span>

## Map the catalog

Create the local customer, plan, and billing cycle first. Store the Stripe price ID in the billing cycle's `externalProductId`, despite that property's name. Use Stripe test-mode resources while developing.

The example updates the [Getting Started](getting-started.md) billing cycle. Replace the example ID with an actual test price before creating Checkout:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
await subscrio.billingCycles.updateBillingCycle('starter-monthly', {
  externalProductId: 'price_replace_with_your_test_price'
});
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
await subscrio.BillingCycles.UpdateBillingCycleAsync("starter-monthly", new UpdateBillingCycleDto(
    ExternalProductId: "price_replace_with_your_test_price"));
```

</div>

Use a distinct mapping for each sellable cycle. The current integration selects the first subscription item/price; a multi-item Stripe subscription is not automatically a bundle of Subscrio plans or add-ons.

## Create Checkout on your server

Authenticate the request and derive the customer key from the authorized account. Do not accept an arbitrary customer key supplied by an untrusted browser. Return the resulting URL to that browser for navigation.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const checkout = await subscrio.stripe.createCheckoutSession({
  customerKey: 'acme', billingCycleKey: 'starter-monthly',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  successUrl: 'https://app.example.com/billing/success',
  cancelUrl: 'https://app.example.com/billing/cancel'
});
console.log(checkout.url);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var checkout = await subscrio.Stripe.CreateCheckoutSessionAsync(
    customerKey: "acme", billingCycleKey: "starter-monthly",
    successUrl: "https://app.example.com/billing/success",
    cancelUrl: "https://app.example.com/billing/cancel",
    stripeSecretKey: Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY"));
Console.WriteLine(checkout.Url);
```

</div>

The helper reuses the customer's external billing ID or creates a Stripe customer and saves the link. It supplies `subscrioCustomerKey` metadata on Checkout and the Stripe subscription. Keep API and webhook secrets in server configuration.

An optional `subscriptionKey` links the resulting Stripe subscription to an existing local subscription. Checkout still creates a Stripe subscription; it does not edit or cancel an existing paid Stripe subscription. Use your Stripe billing-change workflow for that case, then process the resulting events.

Do not overwrite Subscrio's linking metadata. TypeScript's `stripeOptions` is merged after generated Checkout options and can replace required settings. Quantity, trials, promotion codes, and other supported parameters are documented in [Stripe Integration](stripe-integration.md).

## Verify and process webhooks

Read the unchanged request body and the `Stripe-Signature` header. Verify before passing an event into Subscrio; its process method does not verify a signature. These framework-independent handlers use the installed Stripe SDK:

<div class="language-content" data-lang="ts" markdown="1">

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
async function processVerifiedWebhook(rawBody: string, signature: string): Promise<void> {
  const event = stripe.webhooks.constructEvent(
    rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!
  );
  await subscrio.stripe.processStripeEvent(event);
}
// Call processVerifiedWebhook from your endpoint with the unchanged body and header.
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
async Task ProcessVerifiedWebhook(string rawBody, string signature)
{
    var stripeEvent = Stripe.EventUtility.ConstructEvent(
        rawBody, signature, Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET")!);
    await subscrio.Stripe.ProcessStripeEventAsync(stripeEvent);
}
// Call ProcessVerifiedWebhook from your endpoint with the unchanged body and header.
```

</div>

Your endpoint calls the handler, acknowledges successful processing, and distinguishes an invalid signature from a processing failure. If your framework parses JSON globally, preserve the original body for this route. The TypeScript library also provides `constructStripeEvent`; .NET provides the helper on `StripeConfig`, not on `subscrio.Stripe`.

Subscrio does not persist a processed-event inbox, deduplicate every webhook by event ID, or enforce delivery order. Build retry, duplicate, and stale-event handling around the endpoint. Do not mark an event complete before processing succeeds, and account for after-hook failures that happen after a write committed.

## Subscribe to supported events

| Event | Local effect |
| --- | --- |
| `customer.created`, `customer.updated` | Resolve the existing local customer and record its Stripe ID. |
| `customer.deleted` | Clear the external customer ID; retain the local customer. |
| `customer.subscription.created` | Create a mapped subscription or update the local subscription named in metadata. |
| `customer.subscription.updated` | Update the mapped plan/cycle and lifecycle or period information. |
| `customer.subscription.deleted` | End the matching local subscription without deleting its history. |
| `invoice.payment_succeeded` | Update the matching subscription's period from the invoice. |

Other event types have no core subscription handler. Stripe before/after hooks can still receive them. Subscrio's status is calculated from dates; it is not a direct copy of Stripe's status string. Review [Subscription Lifecycle](subscription-lifecycle.md), especially scheduled cancellation.

## Link manually created Stripe records

When bypassing the Checkout helper, add `subscrioCustomerKey` to the Stripe subscription metadata and, when linking an existing local subscription, `subscrioSubscriptionKey`. Customer lookup can also use an already-stored external ID. Missing or inconsistent mappings can fail processing; they do not create arbitrary local customers on demand.

Creating a remote customer/session and saving local links are not one database transaction. Reconcile remote results if a later step fails instead of repeatedly creating Checkout Sessions.

## Connect accounting and extensions

Stripe subscription changes use the library's accounting coordination. Keep billing dates current for billing-period meters and grants. Invoice success does not automatically buy an add-on or top up a credit wallet. Map confirmed purchases explicitly and use a payment-derived idempotency key when granting credits.

The invoice handler does not clear temporary overrides. The optional [payments extension](how-to-extend.md#track-successful-stripe-invoices) records mapped successful invoices; it does not replace webhook verification or the core credit ledger.
