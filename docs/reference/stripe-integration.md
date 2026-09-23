---
title: Stripe Integration
description: Create Checkout sessions and synchronize verified Stripe events.
reference_format: true
---

# Stripe Integration

## Purpose

<span id="method-reference" class="compatibility-anchor"></span>

<span id="overview" class="compatibility-anchor"></span>
<span id="constructstripeevent-and-constructstripeevent" class="compatibility-anchor"></span>
<span id="description" class="compatibility-anchor"></span>
<span id="configuration" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>

Stripe Integration connects existing Subscrio customers and billing cycles to Stripe. It creates Checkout sessions and applies supported webhook events. Your application owns webhook delivery, signature verification, and duplicate-event handling.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const stripe = subscrio.stripe;
```

</div>
<div class="language-content" data-lang="net" markdown="1">

```csharp
var stripe = subscrio.Stripe;
```

</div>

Configure Stripe credentials on [Subscrio](core-overview.md#StripeConfig). Checkout needs a secret key and a billing cycle whose external product ID is a Stripe price ID. Webhook processing accepts a verified event.

## Method catalog

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`createCheckoutSession`](#createcheckoutsession) | Creates a hosted Checkout session. |
| [`constructStripeEvent`](#constructstripeevent) | Verifies a webhook signature and parses the event. |
| [`processStripeEvent`](#processstripeevent) | Applies a verified event. |
| [`createStripeSubscription`](#createstripesubscription) | Deprecated; always throws. |

</div>
<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`CreateCheckoutSessionAsync`](#createcheckoutsession) | Creates a hosted Checkout session. |
| [Signature verification](#constructstripeevent) | No Subscrio method; use Stripe EventUtility. |
| [`ProcessStripeEventAsync`](#processstripeevent) | Applies a verified event. |
| [`CreateStripeSubscriptionAsync`](#createstripesubscription) | Obsolete; always throws. |

</div>

## Method details

<div class="method-entry" markdown="1">

### createCheckoutSession { #createcheckoutsession data-method-ts="createCheckoutSession" data-method-net="CreateCheckoutSessionAsync" }

<span id="description_2" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="input-properties" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_2" class="compatibility-anchor"></span>
<span id="example-new-subscription" class="compatibility-anchor"></span>
<span id="example-update-existing-subscription" class="compatibility-anchor"></span>
<span id="example-full-stripe-api-access" class="compatibility-anchor"></span>
<span id="related-workflows" class="compatibility-anchor"></span>
<span id="entitlement-accounting-behavior" class="compatibility-anchor"></span>
<span id="unsupported-subscription-creation" class="compatibility-anchor"></span>

Create a Stripe customer when needed, save its external billing ID, and return a hosted subscription Checkout session. Existing Stripe customer contact data and linking metadata are updated. These remote and database writes are not one transaction.

The optional subscription key links the resulting webhook to an existing Subscrio subscription; this call does not create or modify a Stripe subscription directly.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createCheckoutSession(params: { customerKey: string; billingCycleKey: string; subscriptionKey?: string; // Optional: existing subscription key to update stripeSecretKey?: string; // Optional: override config Stripe key successUrl: string; cancelUrl: string; // Convenience options quantity?: number; customerEmail?: string; customerName?: string; allowPromotionCodes?: boolean; billingAddressCollection?: 'auto' | 'required'; paymentMethodTypes?: Stripe.Checkout.SessionCreateParams.PaymentMethodType[]; trialPeriodDays?: number; metadata?: Record<string, string>; // Additional custom metadata // Full Stripe API access stripeOptions?: Partial<Stripe.Checkout.SessionCreateParams>; }): Promise<{ url: string; sessionId: string; }>
```

</div>

**Parameters**

- `params`: [Checkout options](#CheckoutOptions), including customer, billing cycle, and redirect URLs.

**Returns** <code>{ url: string; sessionId: string }</code>: [Checkout result](#CheckoutResult) used to redirect the customer.

**Example**

```typescript
// acme exists; pro-monthly has a Stripe price ID.
const checkout = await subscrio.stripe.createCheckoutSession({
  customerKey: 'acme', billingCycleKey: 'pro-monthly',
  successUrl: 'https://app.example.com/billing/success',
  cancelUrl: 'https://app.example.com/billing'
});
console.log(checkout.url);
```

<details class="method-errors" markdown="1">
<summary>Errors (5)</summary>

- `ConfigurationError`: No Stripe secret key is available.
- `NotFoundError`: The customer, cycle, or supplied subscription is missing.
- `ConflictError`: The supplied subscription belongs to another customer.
- `ValidationError`: The cycle has no price ID or Stripe returns no Checkout URL.
- `Stripe.errors.StripeError`: The Stripe request fails.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<(string Url, string SessionId)> CreateCheckoutSessionAsync(string customerKey, string billingCycleKey, string successUrl, string cancelUrl, string? subscriptionKey, string? stripeSecretKey, int? quantity, string? customerEmail, string? customerName, bool? allowPromotionCodes, string? billingAddressCollection, string[]? paymentMethodTypes, int? trialPeriodDays, Dictionary<string, string>? metadata)
```

</div>

**Parameters**

- `customerKey`: Existing Subscrio customer.
- `billingCycleKey`: Cycle mapped to a Stripe price.
- `successUrl`, `cancelUrl`: Redirect destinations after Checkout.
- `subscriptionKey`: Optional existing subscription to link; must belong to the customer. Defaults to null.
- `stripeSecretKey`: Optional secret-key override; defaults to the configured key.
- `quantity`: Optional purchase quantity; defaults to 1.
- `customerEmail`, `customerName`: Optional Stripe customer contact values; default null.
- `allowPromotionCodes`: Optional promotion-code setting; defaults to the Stripe API behavior.
- `billingAddressCollection`: Optional auto or required; defaults to Stripe behavior.
- `paymentMethodTypes`: Optional payment-method names; defaults to Stripe behavior.
- `trialPeriodDays`: Optional trial duration; default null.
- `metadata`: Optional string metadata copied to the session and subscription; default null. Preserve the Subscrio linking keys.

**Returns** `(string Url, string SessionId)`: [Checkout result](#CheckoutResult) used to redirect the customer.

**Example**

```csharp
// acme exists; pro-monthly has a Stripe price ID.
var checkout = await subscrio.Stripe.CreateCheckoutSessionAsync(
    "acme", "pro-monthly",
    "https://app.example.com/billing/success",
    "https://app.example.com/billing");
Console.WriteLine(checkout.Url);
```

<details class="method-errors" markdown="1">
<summary>Errors (5)</summary>

- `ConfigurationException`: No Stripe secret key is available.
- `NotFoundException`: The customer, cycle, or supplied subscription is missing.
- `ConflictException`: The supplied subscription belongs to another customer.
- `ValidationException`: The cycle has no price ID or Stripe returns no Checkout URL.
- `StripeException`: The Stripe request fails.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### constructStripeEvent { #constructstripeevent }

Verify a webhook signature against the original raw request body. Parsing or reserializing the body before verification changes the signed bytes.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
constructStripeEvent(payload: string | Buffer, signatureHeader: string): Stripe.Event
```

</div>

**Parameters**

- `payload`: Original raw webhook body.
- `signatureHeader`: Value of the Stripe-Signature header.

**Returns** [Stripe.Event](#StripeEvent): Verified parsed provider event.

**Example**

```typescript
function verifyWebhook(rawBody: string, signature: string) {
  return subscrio.stripe.constructStripeEvent(rawBody, signature);
}
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ConfigurationError`: The configured webhook secret is missing.
- `Stripe.errors.StripeSignatureVerificationError`: Signature verification fails. Invalid JSON can also raise a parsing error.

</details>

</div>
<div class="language-content" data-lang="net" markdown="1">

Subscrio has no .NET equivalent. Use the Stripe SDK's `EventUtility.ConstructEvent` with the raw body, signature header, and your endpoint secret before calling [ProcessStripeEventAsync](#processstripeevent).

**Example**

```csharp
Stripe.Event VerifyWebhook(string rawBody, string signature, string endpointSecret)
{
    return Stripe.EventUtility.ConstructEvent(rawBody, signature, endpointSecret);
}
```

</div>
</div>

<div class="method-entry" markdown="1">

### processStripeEvent { #processstripeevent data-method-ts="processStripeEvent" data-method-net="ProcessStripeEventAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="internal-handlers" class="compatibility-anchor"></span>

Apply an already-verified provider event to Subscrio. This method does not verify signatures or deduplicate event IDs. Unknown event types are ignored, but still trigger the Stripe before/after hooks. Supported events and their effects are listed under [StripeEvent](#StripeEvent).

Customers are matched by external billing ID, then linking metadata. Subscriptions are matched by Stripe subscription ID, then a customer-owned Subscrio subscription key. Otherwise a new Subscrio subscription is created. Price mapping uses the subscription's first item to find its billing cycle.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
processStripeEvent(event: Stripe.Event): Promise<void>
```

</div>

**Parameters**

- `event`: Verified [Stripe.Event](#StripeEvent).

**Returns** No returned value.

**Example**

```typescript
async function handleWebhook(rawBody: string, signature: string) {
  const event = subscrio.stripe.constructStripeEvent(rawBody, signature);
  await subscrio.stripe.processStripeEvent(event);
}
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `NotFoundError`: Customer metadata cannot resolve an existing customer, or price/plan mapping is missing.
- `ValidationError`: The event has no subscription price or an unsupported subscription status.
- `ConflictError`: Customer metadata attempts to replace a different external billing ID.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task ProcessStripeEventAsync(Stripe.Event stripeEvent)
```

</div>

**Parameters**

- `stripeEvent`: Verified [Stripe.Event](#StripeEvent).

**Returns** No returned value.

**Example**

```csharp
async Task HandleWebhook(string rawBody, string signature, string endpointSecret)
{
    var stripeEvent = Stripe.EventUtility.ConstructEvent(rawBody, signature, endpointSecret);
    await subscrio.Stripe.ProcessStripeEventAsync(stripeEvent);
}
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The customer, price mapping, plan, or required update record is missing.
- `ValidationException`: Required subscription data or a supported status is missing.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### createStripeSubscription { #createstripesubscription data-method-ts="createStripeSubscription" data-method-net="CreateStripeSubscriptionAsync" }

Deprecated and unsupported: this method always throws. Use Checkout to start a purchase or process a verified webhook to synchronize a subscription.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createStripeSubscription(_customerKey: string, _planKey: string, _billingCycleKey: string, _stripePriceId: string): Promise<Subscription>
```

</div>

**Parameters**

- `_customerKey`, `_planKey`, `_billingCycleKey`, `_stripePriceId`: Unused compatibility parameters.

**Returns** No value is returned; the method always throws.

**Example**

```typescript
// Use the supported Checkout method instead.
const checkout = await subscrio.stripe.createCheckoutSession({
  customerKey: 'acme', billingCycleKey: 'pro-monthly',
  successUrl: 'https://app.example.com/billing/success',
  cancelUrl: 'https://app.example.com/billing'
});
console.log(checkout.url);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: Always thrown because direct creation is unsupported.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<Subscrio.Core.Domain.Entities.Subscription> CreateStripeSubscriptionAsync(string customerKey, string planKey, string billingCycleKey, string stripePriceId)
```

</div>

**Parameters**

- `customerKey`, `planKey`, `billingCycleKey`, `stripePriceId`: Unused compatibility parameters.

**Returns** No value is returned; the method always throws.

**Example**

```csharp
// Use the supported Checkout method instead.
var checkout = await subscrio.Stripe.CreateCheckoutSessionAsync(
    "acme", "pro-monthly", "https://app.example.com/billing/success",
    "https://app.example.com/billing");
Console.WriteLine(checkout.Url);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotSupportedException`: Always thrown because direct creation is unsupported.

</details>

</div>

</div>

## Data types

<div class="data-type" markdown="1">

### CheckoutOptions { #CheckoutOptions }

TypeScript accepts this inline object. .NET accepts the corresponding individual arguments and has no arbitrary Stripe-options parameter.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `customerKey` | <code>string</code> | Yes | None | Existing Subscrio customer key. |
| `billingCycleKey` | <code>string</code> | Yes | None | Billing cycle with an external Stripe price ID. |
| `subscriptionKey` | <code>string</code> | No | None | Existing customer-owned subscription to link. |
| `stripeSecretKey` | <code>string</code> | No | Configured key | Secret key override. |
| `successUrl` | <code>string</code> | Yes | None | Successful Checkout redirect. |
| `cancelUrl` | <code>string</code> | Yes | None | Cancelled Checkout redirect. |
| `quantity` | <code>number</code> | No | 1 | Stripe subscription item quantity; does not attach Subscrio add-ons. |
| `customerEmail` | <code>string</code> | No | None | Email sent when creating/updating the Stripe customer. |
| `customerName` | <code>string</code> | No | None | Name sent when creating/updating the Stripe customer. |
| `allowPromotionCodes` | <code>boolean</code> | No | Stripe default | Whether Checkout accepts promotion codes. |
| `billingAddressCollection` | <code>&quot;auto&quot; \| &quot;required&quot;</code> | No | Stripe default | Checkout address requirement. |
| `paymentMethodTypes` | <code>Stripe.Checkout.SessionCreateParams.PaymentMethodType[]</code> | No | Stripe default | Allowed provider payment methods. |
| `trialPeriodDays` | <code>number</code> | No | None | Provider trial length. |
| `metadata` | <code>Record&lt;string, string&gt;</code> | No | None | Copied to session and subscription. Values can override generated linking keys; retain their correct values. |
| `stripeOptions` | <code>Partial&lt;Stripe.Checkout.SessionCreateParams&gt;</code> | No | None | TypeScript-only provider options, merged last. Can replace generated metadata, line items, mode, or customer fields. |

</div>
<div class="language-content" data-lang="net" markdown="1">

See [CreateCheckoutSessionAsync](#createcheckoutsession) for its complete argument list.

</div>
</div>

<div class="data-type" markdown="1">

### CheckoutResult { #CheckoutResult }

Hosted Checkout destination, returned as an inline object in TypeScript and a named tuple in .NET.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `url` | `string` | Yes | Not applicable | Hosted Checkout URL. |
| `sessionId` | `string` | Yes | Not applicable | Stripe Checkout session identifier. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Url` | `string` | Yes | Not applicable | Hosted Checkout URL. |
| `SessionId` | `string` | Yes | Not applicable | Stripe Checkout session identifier. |

</div>

</div>

<div class="data-type" markdown="1">

### StripeEvent { #StripeEvent }

`Stripe.Event` is supplied by the installed Stripe SDK, not a Subscrio DTO. It includes the event ID, event type, creation timestamp, and provider object under data.object / Data.Object. The object shape depends on the event type. Subscrio handles these events:

| Value | Meaning |
| --- | --- |
| customer.created / customer.updated | Resolve an existing Subscrio customer and link its Stripe customer ID. Does not import a new customer or copy its name/email. |
| customer.deleted | Clear the customer's external billing ID; retain the Subscrio customer. |
| customer.subscription.created / customer.subscription.updated | Create or update the linked subscription, mapped plan/cycle, period dates, trial, cancellation data, and metadata. |
| customer.subscription.deleted | Set the linked subscription's expiration time; retain the record. Missing subscriptions are ignored. |
| invoice.payment_succeeded | Update matching subscription period dates from the matching price line, or the first line as fallback. Missing links are ignored. |

Renewal processing does not clear temporary overrides. Call the explicit [temporary-override clearing method](subscriptions.md#cleartemporaryoverrides) when your workflow needs that effect. Stripe schedule IDs are stored in subscription metadata as stripeScheduleId.

</div>

## Related guides

- [Stripe Setup](how-to-integrate-with-stripe.md): webhook and price-mapping setup.
- [Billing Cycles](billing-cycles.md): external price IDs.
- [Customers](customers.md): external billing identities.
- [Subscriptions](subscriptions.md): lifecycle dates and overrides.
- [Hooks](hooks.md): provider and entity events.
