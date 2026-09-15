---
title: Stripe integration API
description: Process verified Stripe webhook events, create checkout sessions, and keep Subscrio customers and subscriptions aligned with Stripe.
---

# Stripe Integration Service Reference

## Service Overview
`StripeIntegrationService` connects verified Stripe webhook events to Subscrio customers and subscriptions. Call `processStripeEvent` only after Stripe's SDK validates the payload. TypeScript can verify it through the Stripe service. .NET can verify it through `StripeConfig`. Direct Stripe SDK verification remains supported. The built-in handlers cover customer lifecycle, subscription lifecycle, successful invoices, and checkout-session creation.

- Store the Subscrio customer key in Stripe metadata (`subscrioCustomerKey`) whenever you create a Stripe customer or subscription—this allows webhooks to backfill `Customer.externalBillingId` automatically.
- Persist Stripe customer IDs in `Customer.externalBillingId`. If it’s missing, the webhook handler will backfill it using the metadata described above.
- Persist Stripe price IDs in `BillingCycle.externalProductId` so events can map to billing cycles (and therefore plans). Once the price is mapped, Subscrio can create and update subscriptions with no additional customization.

TypeScript throws `ValidationError`, `NotFoundError`, `ConflictError`, and `ConfigurationError`. .NET throws the matching `ValidationException`, `NotFoundException`, `ConflictException`, and `ConfigurationException`. Potential Errors tables use the TypeScript names.

## Accessing the Service

=== "TypeScript"
    ```typescript
    import { Subscrio } from 'subscrio';

    const subscrio = new Subscrio({ database: { connectionString: process.env.DATABASE_URL! } });
    const stripeService = subscrio.stripe;
    ```

=== ".NET"
    ```csharp
    using Subscrio.Core;

    var subscrio = new Subscrio(config);
    var stripeService = subscrio.Stripe;
    ```

## Method Catalog

=== "TypeScript"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `constructStripeEvent` | Verifies a webhook signature with `config.stripe.webhookSecret` and constructs the event | `Stripe.Event` |
    | `processStripeEvent` | Entry point for verified Stripe webhook events | `Promise<void>` |
    | `createCheckoutSession` | Generate Stripe Checkout URL with automatic customer creation and subscription linking | `Promise<{ url, sessionId }>` |

=== ".NET"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `ProcessStripeEventAsync` | Entry point for verified Stripe webhook events | `Task` |
    | `CreateCheckoutSessionAsync` | Generate Stripe Checkout URL with automatic customer creation and subscription linking | `Task<(string Url, string SessionId)>` |

*(Handlers invoked internally by `processStripeEvent` are described for completeness.)*

## Method Reference

### constructStripeEvent and ConstructStripeEvent

#### Description

Verifies the `Stripe-Signature` header against the raw request body and configured webhook endpoint secret, then returns a verified Stripe event. The helper is located on the Stripe service in TypeScript and on `StripeConfig` in .NET.

#### Configuration

=== "TypeScript"
    ```typescript
    const subscrio = new Subscrio({
      database: { connectionString: process.env.DATABASE_URL! },
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY!,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!
      }
    });
    ```

=== ".NET"
    ```csharp
    var stripeConfig = new StripeConfig
    {
        SecretKey = stripeSecretKey,
        WebhookSecret = stripeWebhookSecret
    };

    using var subscrio = new Subscrio(new SubscrioConfig
    {
        Database = databaseConfig,
        Stripe = stripeConfig
    });
    ```

#### Signature

=== "TypeScript"
    ```typescript
    constructStripeEvent(
      payload: string | Buffer,
      signatureHeader: string
    ): Stripe.Event
    ```

=== ".NET"
    ```csharp
    Stripe.Event ConstructStripeEvent(
        string json,
        string signatureHeader
    )
    ```

#### Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `payload` / `json` | `string \| Buffer` / `string` | Yes | Raw, unparsed HTTP request body. |
| `signatureHeader` | `string` | Yes | Complete value of the `Stripe-Signature` request header. |

#### Returns

A verified `Stripe.Event`. The methods are synchronous and throw before returning when verification fails.

#### Potential errors

| Runtime | Error | When |
| --- | --- | --- |
| TypeScript | `ConfigurationError` | `stripe.webhookSecret` is missing. |
| .NET | `InvalidOperationException` | `StripeConfig.WebhookSecret` is missing. |
| Both | Stripe SDK signature exception | The signature, timestamp, secret, or raw body is invalid. |

#### Example

=== "TypeScript"
    ```typescript
    const event = subscrio.stripe.constructStripeEvent(rawBody, signatureHeader);
    await subscrio.stripe.processStripeEvent(event);
    ```

=== ".NET"
    ```csharp
    var stripeEvent = stripeConfig.ConstructStripeEvent(rawBody, signatureHeader);
    await subscrio.Stripe.ProcessStripeEventAsync(stripeEvent);
    ```

### processStripeEvent

#### Description
Routes a verified `Stripe.Event` to the appropriate handler (subscription lifecycle or invoice events).

#### Signature

=== "TypeScript"
    ```typescript
    processStripeEvent(event: Stripe.Event): Promise<void>
    ```

=== ".NET"
    ```csharp
    Task ProcessStripeEventAsync(Event stripeEvent)
    ```

#### Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `event` | `Stripe.Event` | Yes | Stripe webhook payload that your endpoint already verified. |

#### Returns

=== "TypeScript"
    `Promise<void>`

=== ".NET"
    `Task`

#### Expected Results
- Switches on `event.type` and handles:
  - `customer.created`
  - `customer.updated`
  - `customer.deleted`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
- Unhandled event types are ignored. TypeScript is silent. .NET writes the event type to the console when `ASPNETCORE_ENVIRONMENT` is `Development`.
- Missing entities (customer, plan, billing cycle, subscription) throw so you can fix data mapping.
- Stripe subscription status mapping is `active` to `active`, `trialing` to `trial`, `canceled` to `cancelled`, `past_due` or `unpaid` to `cancellation_pending`, `incomplete` or `paused` to `pending`, and `incomplete_expired` to `expired`.
- An unsupported Stripe subscription status throws a validation error. The subscription is not written with an unknown or permissive state.
- Read status still comes from subscription dates. Mapping Stripe `paused` to `pending` does not persist as `pending` unless the dates also produce that status.

#### Potential Errors

| Error | When |
| --- | --- |
| `NotFoundError` | Customer, billing cycle, plan, or subscription cannot be resolved. |
| `ValidationError` | Required data such as `externalBillingId` is missing. |
| `ValidationError` | The Stripe subscription status is unsupported. |
| `ConflictError` (TypeScript) | Metadata identifies a Subscrio customer whose `externalBillingId` already points to a different Stripe customer. TypeScript refuses to overwrite it. The current .NET implementation overwrites it. |

#### Example

=== "TypeScript"
    ```typescript
    const event = stripeService.constructStripeEvent(body, sig);
    await stripeService.processStripeEvent(event);
    ```

=== ".NET"
    ```csharp
    var stripeEvent = config.Stripe!.ConstructStripeEvent(body, sig);
    await stripeService.ProcessStripeEventAsync(stripeEvent);
    ```

#### Internal Handlers
- **`handleCustomerCreated/Updated`**
  - Resolves existing customers by `externalBillingId` or `subscrioCustomerKey` metadata and backfills the Stripe customer ID.
- **`handleCustomerDeleted`**
  - Clears `externalBillingId` when Stripe deletes a customer.
- **`handleSubscriptionCreated`**
  - Resolves the customer, billing cycle (via `externalProductId`), and owning plan.
  - **Subscription Linking Behavior:**
    1. First checks if a subscription with the Stripe subscription ID already exists (already linked).
    2. If metadata contains `subscrioSubscriptionKey`, looks up the existing Subscrio subscription by key.
    3. If found and belongs to the customer, **updates the existing subscription** (links Stripe ID, updates plan/billing cycle, preserves feature overrides).
    4. If no existing subscription found, **creates a new subscription**.
  - Sets `stripeSubscriptionId`, period dates, and metadata on the subscription.
- **`handleSubscriptionUpdated`**
  - Syncs plan/billing-cycle changes, period dates, and cancellation status for an existing subscription.
- **`handleSubscriptionDeleted`**
  - Calls `subscription.expire()` when Stripe marks the subscription deleted so the computed status becomes `expired`.
- **`handlePaymentSucceeded`**
  - Updates the subscription’s `currentPeriodStart`/`currentPeriodEnd` from the invoice line’s billing period after a successful payment.

### createCheckoutSession

#### Description
Generates a Stripe Checkout Session URL for subscription purchases. This helper method:
- **Automatically creates Stripe customers** if they don't exist (sets proper metadata)
- **Supports linking to existing Subscrio subscriptions** via `subscriptionKey` parameter
- Provides full access to Stripe Checkout options including quantity, trial periods, and custom metadata
- Sets all required metadata for webhook reconciliation

When a customer completes checkout, the webhook handler will:
- If `subscriptionKey` was provided: **update the existing subscription** (link Stripe ID, update plan/billing cycle)
- If no `subscriptionKey`: **create a new subscription**

#### Signature

=== "TypeScript"
    ```typescript
    createCheckoutSession(params: {
      customerKey: string;
      billingCycleKey: string;
      subscriptionKey?: string;  // Optional: existing subscription key to update
      stripeSecretKey?: string;  // Optional: override config Stripe key
      successUrl: string;
      cancelUrl: string;
      // Convenience options
      quantity?: number;
      customerEmail?: string;
      customerName?: string;
      allowPromotionCodes?: boolean;
      billingAddressCollection?: 'auto' | 'required';
      paymentMethodTypes?: Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
      trialPeriodDays?: number;
      metadata?: Record<string, string>;  // Additional custom metadata
      // Full Stripe API access
      stripeOptions?: Partial<Stripe.Checkout.SessionCreateParams>;
    }): Promise<{ url: string; sessionId: string }>
    ```

=== ".NET"
    ```csharp
    Task<(string Url, string SessionId)> CreateCheckoutSessionAsync(
        string customerKey,
        string billingCycleKey,
        string successUrl,
        string cancelUrl,
        string? subscriptionKey = null,
        string? stripeSecretKey = null,
        int? quantity = null,
        string? customerEmail = null,
        string? customerName = null,
        bool? allowPromotionCodes = null,
        string? billingAddressCollection = null,
        string[]? paymentMethodTypes = null,
        int? trialPeriodDays = null,
        Dictionary<string, string>? metadata = null
    )
    ```

#### Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `customerKey` | `string` | Yes | Subscrio customer key. Stripe customer will be created if missing. |
| `billingCycleKey` | `string` | Yes | Billing cycle key (must have `externalProductId` set to Stripe price ID). |
| `subscriptionKey` | `string` | No | Existing Subscrio subscription key to link/update. If provided, webhook will update this subscription instead of creating new. |
| `stripeSecretKey` | `string` | No | Stripe secret key (overrides `config.stripe.secretKey`). |
| `successUrl` | `string` | Yes | URL to redirect after successful checkout. |
| `cancelUrl` | `string` | Yes | URL to redirect if checkout is cancelled. |

#### Input Properties

=== "TypeScript"
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | `quantity` | `number` | No | Subscription quantity (default: 1). |
    | `customerEmail` | `string` | No | Pre-fill customer email in checkout. |
    | `customerName` | `string` | No | Pre-fill customer name in checkout. |
    | `allowPromotionCodes` | `boolean` | No | Enable promotion code input in checkout. |
    | `billingAddressCollection` | `'auto' \| 'required'` | No | Control billing address collection. |
    | `paymentMethodTypes` | `PaymentMethodType[]` | No | Restrict allowed payment methods. |
    | `trialPeriodDays` | `number` | No | Set trial period duration in days. |
    | `metadata` | `Record<string, string>` | No | Additional custom metadata to pass through. |
    | `stripeOptions` | `Partial<SessionCreateParams>` | No | Full Stripe API access for any checkout option. |

=== ".NET"
    | Parameter | Type | Required | Description |
    | --- | --- | --- | --- |
    | `quantity` | `int?` | No | Subscription quantity (default: 1). |
    | `customerEmail` | `string?` | No | Pre-fill customer email in checkout. |
    | `customerName` | `string?` | No | Pre-fill customer name in checkout. |
    | `allowPromotionCodes` | `bool?` | No | Enable promotion code input in checkout. |
    | `billingAddressCollection` | `string?` | No | `auto` or `required`. |
    | `paymentMethodTypes` | `string[]?` | No | Restrict allowed payment methods. |
    | `trialPeriodDays` | `int?` | No | Set trial period duration in days. |
    | `metadata` | `Dictionary<string, string>?` | No | Additional custom metadata to pass through. |

#### Returns

=== "TypeScript"
    `Promise<{ url: string; sessionId: string }>` – Checkout URL to redirect user and session ID for tracking.

=== ".NET"
    `Task<(string Url, string SessionId)>` – Checkout URL to redirect user and session ID for tracking.

#### Expected Results
- **Stripe Customer Creation**: If customer doesn't have `externalBillingId`, creates Stripe customer automatically with `subscrioCustomerKey` metadata.
- **Metadata Setup**: Sets `subscrioCustomerKey` and optionally `subscrioSubscriptionKey` in both session and subscription metadata.
- **Subscription Linking**: If `subscriptionKey` provided, validates subscription exists and belongs to customer. Webhook will update this subscription when checkout completes.
- **Full Stripe Support**: TypeScript also accepts `stripeOptions` for extra Checkout Session fields. .NET has no `stripeOptions` passthrough.

#### Potential Errors

| Error | When |
| --- | --- |
| `ConfigurationError` | Stripe secret key not provided (neither in config nor parameter). |
| `NotFoundError` | Customer, billing cycle, or subscription (if key provided) not found. |
| `ValidationError` | Billing cycle missing `externalProductId`, invalid URLs, etc. |
| `ConflictError` | Subscription key provided but doesn't belong to customer. |

#### Example: New Subscription

=== "TypeScript"
    ```typescript
    const { url, sessionId } = await subscrio.stripe.createCheckoutSession({
      customerKey: 'customer_123',
      billingCycleKey: 'pro-monthly',
      successUrl: 'https://yourapp.com/success',
      cancelUrl: 'https://yourapp.com/cancel',
      quantity: 2,
      allowPromotionCodes: true,
      customerEmail: 'user@example.com'
    });
    window.location.href = url;
    ```

=== ".NET"
    ```csharp
    var (url, sessionId) = await subscrio.Stripe.CreateCheckoutSessionAsync(
        customerKey: "customer_123",
        billingCycleKey: "pro-monthly",
        successUrl: "https://yourapp.com/success",
        cancelUrl: "https://yourapp.com/cancel",
        quantity: 2,
        allowPromotionCodes: true,
        customerEmail: "user@example.com"
    );
    return Redirect(url);
    ```

#### Example: Update Existing Subscription

=== "TypeScript"
    ```typescript
    // Create checkout to update existing subscription (change plan/billing cycle)
    const { url, sessionId } = await subscrio.stripe.createCheckoutSession({
      customerKey: 'customer_123',
      billingCycleKey: 'pro-annual',
      subscriptionKey: 'sub_456',
      successUrl: 'https://yourapp.com/success',
      cancelUrl: 'https://yourapp.com/cancel'
    });

    // When checkout completes, webhook will update subscription 'sub_456'
    // with new plan/billing cycle and link Stripe subscription ID
    ```

=== ".NET"
    ```csharp
    // Create checkout to update existing subscription (change plan/billing cycle)
    var (url, sessionId) = await subscrio.Stripe.CreateCheckoutSessionAsync(
        customerKey: "customer_123",
        billingCycleKey: "pro-annual",
        successUrl: "https://yourapp.com/success",
        cancelUrl: "https://yourapp.com/cancel",
        subscriptionKey: "sub_456"
    );

    // When checkout completes, webhook will update subscription 'sub_456'
    // with new plan/billing cycle and link Stripe subscription ID
    return Redirect(url);
    ```

#### Example: Full Stripe API Access

=== "TypeScript"
    ```typescript
    // Use stripeOptions for any Stripe Checkout parameter
    const { url } = await subscrio.stripe.createCheckoutSession({
      customerKey: 'customer_123',
      billingCycleKey: 'pro-monthly',
      successUrl: 'https://yourapp.com/success',
      cancelUrl: 'https://yourapp.com/cancel',
      stripeOptions: {
        consent_collection: {
          terms_of_service: 'required'
        },
        phone_number_collection: {
          enabled: true
        },
        custom_fields: [
          {
            key: 'company_name',
            label: { type: 'custom', custom: 'Company Name' },
            type: 'text'
          }
        ]
      }
    });
    ```

=== ".NET"
    ```csharp
    // Use supported parameters: quantity, trialPeriodDays, metadata, allowPromotionCodes, etc.
    // For custom Stripe Checkout options (e.g. consent_collection), use the Stripe .NET SDK directly.
    var (url, _) = await subscrio.Stripe.CreateCheckoutSessionAsync(
        customerKey: "customer_123",
        billingCycleKey: "pro-monthly",
        successUrl: "https://yourapp.com/success",
        cancelUrl: "https://yourapp.com/cancel",
        quantity: 2,
        allowPromotionCodes: true,
        trialPeriodDays: 14
    );
    return Redirect(url);
    ```

## Related Workflows
- Webhook verification: verify through `subscrio.stripe.constructStripeEvent`, `StripeConfig.ConstructStripeEvent`, or the Stripe SDK before calling the processing method.
- **Customer metadata** – Attach `subscrioCustomerKey` (and optionally `subscrioSubscriptionKey`) to every Stripe customer and subscription you create so Subscrio can reconcile records automatically.
- **Billing-cycle mapping** – Store Stripe price IDs in `BillingCycle.externalProductId` to map subscriptions/billing cycles accurately.
- **How-to guide** – See [How to Integrate with Stripe](how-to-integrate-with-stripe.md) for setup, metadata, and webhook handling.
- **Hooks** – See [hooks.md](./hooks.md) and [how-to-extend.md](./how-to-extend.md).

=== "TypeScript"
    `processStripeEvent` emits `stripe.received.before`, then customer/subscription `*.before` / `*.after` hooks with `source: 'stripe'`, then `stripe.received.after`.

=== ".NET"
    `ProcessStripeEventAsync` emits `stripe.received.before`, then customer/subscription before/after hooks with `Source: "stripe"`, then `stripe.received.after`.

The event supplied to `stripe.received.before` is a snapshot. Throwing from the hook aborts processing, but mutating the snapshot does not change the event handled by `processStripeEvent` or `ProcessStripeEventAsync`.
