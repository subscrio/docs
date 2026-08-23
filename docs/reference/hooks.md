# Hooks

Hooks let implementors observe and optionally mutate customer and subscription writes, plus inbound Stripe events. Every domain mutation emits a **before** event and an **after** event.

See also: [How to Extend](./how-to-extend.md) for packaging extensions and the audit-log and payments examples.

## Accessing Hooks

=== "TypeScript"
    ```typescript
    import { Subscrio, HookEvents } from 'subscrio';

    const subscrio = new Subscrio({
      database: { connectionString: process.env.DATABASE_URL! }
    });

    const hooks = subscrio.hooks;
    ```

=== ".NET"
    ```csharp
    using Subscrio.Core;
    using Subscrio.Core.Application.Hooks;

    var subscrio = new Subscrio(config);
    var hooks = subscrio.Hooks;
    ```

## Before vs After

| Phase | Event suffix | When it runs | Mutate `new`? | Throw aborts write? |
| --- | --- | --- | --- | --- |
| `before` | `*.before` | After the proposed DTO is built, **before** the database write | Yes (applied to the entity before persist) | Yes — mutation does not run |
| `after` | `*.after` | **After** a successful database write | No — `new` is an immutable clone of the persisted DTO | No — row already committed; API still throws |

- Handlers are awaited sequentially. The first throw stops remaining handlers for that emit.
- Payload data is loaded/built **only when at least one listener is registered** for that event. Multiple handlers share one payload (built once).
- Each domain event includes `source`: `api` | `stripe` | `system`.
- Each domain event includes `phase`: `before` | `after`.

## Mutation Rules (`before` only)

- Handlers may mutate fields on `evt.new` (or `evt.New` in .NET).
- Subscrio applies those fields onto the domain entity before persist.
- Identity fields:
  - On **create**, changing `key` via a before-hook is allowed (conflict checks re-run).
  - On **update**, changing `key` via a before-hook is rejected.
- Status transitions for archive/unarchive are still driven by the service (entity methods), not by free-form status edits alone.
- `after` payloads clone DTOs; mutations to `new` are not applied.

## `entityId` and `customerId`

| Field | Meaning |
| --- | --- |
| `entityId` | Numeric primary key of the customer or subscription when known. |
| `customerId` | On subscription events only: numeric customer PK when known. |

Typical values:

- `*.created.before`: `entityId` is `null` (row not inserted yet).
- `*.created.after`: `entityId` is set to the new PK.
- Update / archive / delete before and after: `entityId` is set when the row already exists.

## Throw Semantics

| Hook | Effect of throw |
| --- | --- |
| `*.before` | Operation aborted. Nothing is written for that mutation. |
| `*.after` | Database write has already committed. The public API call still rejects/throws. Callers must treat the row as persisted. |
| `stripe.received.before` | `processStripeEvent` aborts before handling the Stripe payload. |
| `stripe.received.after` | Stripe handling already finished. The API call still throws. |

## Event Catalog

Event names use the pattern `{resource}.{action}.{before\|after}`.

### Customer

=== "TypeScript"
    | Event string | `HookEvents` constant | When | `old` | `new` |
    | --- | --- | --- | --- | --- |
    | `customer.created.before` | `CustomerCreatedBefore` | Before insert | `null` | proposed (mutable) |
    | `customer.created.after` | `CustomerCreatedAfter` | After insert | `null` | persisted |
    | `customer.updated.before` | `CustomerUpdatedBefore` | Before save | current | proposed (mutable) |
    | `customer.updated.after` | `CustomerUpdatedAfter` | After save | previous | persisted |
    | `customer.archived.before` | `CustomerArchivedBefore` | Before archive save | current | proposed |
    | `customer.archived.after` | `CustomerArchivedAfter` | After archive save | previous | persisted |
    | `customer.unarchived.before` | `CustomerUnarchivedBefore` | Before unarchive save | current | proposed |
    | `customer.unarchived.after` | `CustomerUnarchivedAfter` | After unarchive save | previous | persisted |
    | `customer.deleted.before` | `CustomerDeletedBefore` | Before delete | current | `null` |
    | `customer.deleted.after` | `CustomerDeletedAfter` | After delete | previous | `null` |

=== ".NET"
    | Event string | `HookEvents` constant | Register with | When | `Old` | `New` |
    | --- | --- | --- | --- | --- | --- |
    | `customer.created.before` | `CustomerCreatedBefore` | `OnCustomerCreatedBefore` | Before insert | `null` | proposed (mutable) |
    | `customer.created.after` | `CustomerCreatedAfter` | `OnCustomerCreatedAfter` | After insert | `null` | persisted |
    | `customer.updated.before` | `CustomerUpdatedBefore` | `OnCustomerUpdatedBefore` | Before save | current | proposed (mutable) |
    | `customer.updated.after` | `CustomerUpdatedAfter` | `OnCustomerUpdatedAfter` | After save | previous | persisted |
    | `customer.archived.before` | `CustomerArchivedBefore` | `OnCustomerArchivedBefore` | Before archive | current | proposed |
    | `customer.archived.after` | `CustomerArchivedAfter` | `OnCustomerArchivedAfter` | After archive | previous | persisted |
    | `customer.unarchived.before` | `CustomerUnarchivedBefore` | `OnCustomerUnarchivedBefore` | Before unarchive | current | proposed |
    | `customer.unarchived.after` | `CustomerUnarchivedAfter` | `OnCustomerUnarchivedAfter` | After unarchive | previous | persisted |
    | `customer.deleted.before` | `CustomerDeletedBefore` | `OnCustomerDeletedBefore` | Before delete | current | `null` |
    | `customer.deleted.after` | `CustomerDeletedAfter` | `OnCustomerDeletedAfter` | After delete | previous | `null` |

### Subscription

=== "TypeScript"
    | Event string | `HookEvents` constant | When | `old` | `new` |
    | --- | --- | --- | --- | --- |
    | `subscription.created.before` / `.after` | `SubscriptionCreatedBefore` / `After` | Before/after insert | `null` | proposed / persisted |
    | `subscription.updated.before` / `.after` | `SubscriptionUpdatedBefore` / `After` | Before/after save | current / previous | proposed / persisted |
    | `subscription.archived.before` / `.after` | `SubscriptionArchivedBefore` / `After` | Before/after archive | current / previous | proposed / persisted |
    | `subscription.unarchived.before` / `.after` | `SubscriptionUnarchivedBefore` / `After` | Before/after unarchive | current / previous | proposed / persisted |
    | `subscription.deleted.before` / `.after` | `SubscriptionDeletedBefore` / `After` | Before/after delete | current / previous | `null` |
    | `subscription.featureOverrideAdded.before` / `.after` | `SubscriptionFeatureOverrideAddedBefore` / `After` | Before/after override save | (+ `featureKey`, `value`, `overrideType`) | |
    | `subscription.featureOverrideRemoved.before` / `.after` | `SubscriptionFeatureOverrideRemovedBefore` / `After` | Before/after override remove | (+ `featureKey`) | |
    | `subscription.temporaryOverridesCleared.before` / `.after` | `SubscriptionTemporaryOverridesClearedBefore` / `After` | Before/after clear | | |

    `transitionExpiredSubscriptions()` emits normal per-row before/after events with `source: 'system'`.

=== ".NET"
    | Event string | Register with | When |
    | --- | --- | --- |
    | `subscription.created.before` / `.after` | `OnSubscriptionCreatedBefore` / `After` | Before/after insert |
    | `subscription.updated.before` / `.after` | `OnSubscriptionUpdatedBefore` / `After` | Before/after save |
    | `subscription.archived.before` / `.after` | `OnSubscriptionArchivedBefore` / `After` | Before/after archive |
    | `subscription.unarchived.before` / `.after` | `OnSubscriptionUnarchivedBefore` / `After` | Before/after unarchive |
    | `subscription.deleted.before` / `.after` | `OnSubscriptionDeletedBefore` / `After` | Before/after delete |
    | `subscription.featureOverrideAdded.before` / `.after` | `OnSubscriptionFeatureOverrideAddedBefore` / `After` | Before/after override save (+ `FeatureKey`, `Value`, `OverrideType`) |
    | `subscription.featureOverrideRemoved.before` / `.after` | `OnSubscriptionFeatureOverrideRemovedBefore` / `After` | Before/after override remove (+ `FeatureKey`) |
    | `subscription.temporaryOverridesCleared.before` / `.after` | `OnSubscriptionTemporaryOverridesClearedBefore` / `After` | Before/after clear |

    `TransitionExpiredSubscriptionsAsync()` emits normal per-row before/after events with `Source: "system"`.

### Stripe Inbound

=== "TypeScript"
    | Event string | `HookEvents` constant | When | Payload |
    | --- | --- | --- | --- |
    | `stripe.received.before` | `StripeReceivedBefore` | Start of `processStripeEvent`, before domain handling | Full verified Stripe event |
    | `stripe.received.after` | `StripeReceivedAfter` | End of `processStripeEvent`, after domain handling | Full verified Stripe event |

    Domain customer/subscription hooks for resulting writes still fire between these with `source: 'stripe'`.

=== ".NET"
    | Event string | Register with | When | Payload |
    | --- | --- | --- | --- |
    | `stripe.received.before` | `OnStripeReceivedBefore` | Start of `ProcessStripeEventAsync` | Full verified Stripe event |
    | `stripe.received.after` | `OnStripeReceivedAfter` | End of `ProcessStripeEventAsync` | Full verified Stripe event |

    Domain customer/subscription hooks for resulting writes still fire between these with `Source: "stripe"`.

## Payload Shape

### Domain Mutation Payload

=== "TypeScript"
    ```typescript
    type HookSource = 'api' | 'stripe' | 'system';
    type HookPhase = 'before' | 'after';

    interface EntityMutationHookEvent<T> {
      type: string;
      phase: HookPhase;
      source: HookSource;
      occurredAt: string; // ISO
      entityId: number | null;
      customerId?: number | null; // subscription events
      old: T | null;
      /** before: mutable proposed DTO; after: immutable clone of persisted DTO */
      new: T | null;
    }

    interface CustomerMutationHookEvent extends EntityMutationHookEvent<CustomerDto> {}

    interface SubscriptionMutationHookEvent extends EntityMutationHookEvent<SubscriptionDto> {
      featureKey?: string;
      value?: string;
      overrideType?: string;
    }
    ```

    | Field | Type | Description |
    | --- | --- | --- |
    | `type` | `string` | Event name (e.g. `customer.updated.before`). |
    | `phase` | `'before' \| 'after'` | Hook phase. |
    | `source` | `'api' \| 'stripe' \| 'system'` | Origin of the write. |
    | `occurredAt` | `string` | ISO timestamp when the hook fired. |
    | `entityId` | `number \| null` | Numeric PK when known. |
    | `customerId` | `number \| null` | Subscription events: customer PK when known. |
    | `old` | `T \| null` | DTO before mutation (`null` on create). |
    | `new` | `T \| null` | Proposed (before) or persisted (after) DTO (`null` on delete). |
    | `featureKey` | `string` | Optional; override events only. |
    | `value` | `string` | Optional; override-added events only. |
    | `overrideType` | `string` | Optional; override-added events only. |

=== ".NET"
    ```csharp
    public class CustomerMutationHookEvent
    {
        public required string Type { get; init; }
        public required string Phase { get; init; }   // "before" | "after"
        public required string Source { get; init; }  // "api" | "stripe" | "system"
        public required string OccurredAt { get; init; }
        public long? EntityId { get; init; }
        public CustomerDto? Old { get; init; }
        public CustomerDto? New { get; set; } // mutable on before
    }

    public class SubscriptionMutationHookEvent
    {
        public required string Type { get; init; }
        public required string Phase { get; init; }
        public required string Source { get; init; }
        public required string OccurredAt { get; init; }
        public long? EntityId { get; init; }
        public long? CustomerId { get; init; }
        public SubscriptionDto? Old { get; init; }
        public SubscriptionDto? New { get; set; }
        public string? FeatureKey { get; set; }
        public string? Value { get; set; }
        public string? OverrideType { get; set; }
    }
    ```

    | Property | Type | Description |
    | --- | --- | --- |
    | `Type` | `string` | Event name (e.g. `customer.updated.before`). |
    | `Phase` | `string` | `"before"` or `"after"`. |
    | `Source` | `string` | `"api"`, `"stripe"`, or `"system"`. |
    | `OccurredAt` | `string` | ISO timestamp when the hook fired. |
    | `EntityId` | `long?` | Numeric PK when known. |
    | `CustomerId` | `long?` | Subscription events: customer PK when known. |
    | `Old` | `T?` | DTO before mutation (`null` on create). |
    | `New` | `T?` | Proposed (before) or persisted (after) DTO (`null` on delete). |
    | `FeatureKey` | `string?` | Optional; override events only. |
    | `Value` | `string?` | Optional; override-added events only. |
    | `OverrideType` | `string?` | Optional; override-added events only. |

`T` / DTO types are the public JSON shapes (`CustomerDto` / `SubscriptionDto`), not domain entities.

### Stripe Received Payload

=== "TypeScript"
    ```typescript
    interface StripeReceivedHookEvent {
      type: 'stripe.received.before' | 'stripe.received.after';
      phase: 'before' | 'after';
      occurredAt: string;
      data: Stripe.Event;
    }
    ```

=== ".NET"
    ```csharp
    public class StripeReceivedHookEvent
    {
        public required string Type { get; init; }
        public required string Phase { get; init; }
        public required string OccurredAt { get; init; }
        public required Event Data { get; init; }
    }
    ```

## Registration API

### Method Catalog

=== "TypeScript"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `on(event, handler)` | Register a handler | `() => void` unsubscribe |
    | `off(event, handler)` | Remove a handler | `void` |
    | `hasListeners(event)` | Whether any handler is registered | `boolean` |

=== ".NET"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `OnCustomer*Before` / `OnCustomer*After` | Typed customer handlers | `Action` unsubscribe |
    | `OnSubscription*Before` / `OnSubscription*After` | Typed subscription handlers | `Action` unsubscribe |
    | `OnStripeReceivedBefore` / `OnStripeReceivedAfter` | Inbound Stripe handlers | `Action` unsubscribe |
    | `HasListeners(eventName)` | Whether any handler is registered | `bool` |

### Config-Time Registration

=== "TypeScript"
    ```typescript
    import { Subscrio, HookEvents } from 'subscrio';

    const subscrio = new Subscrio({
      database: { connectionString: process.env.DATABASE_URL! },
      hooks: {
        [HookEvents.StripeReceivedBefore]: async ({ data }) => {
          await audit.logInboundStripe(data);
        },
        [HookEvents.CustomerUpdatedBefore]: async ({ old, new: next, source }) => {
          await audit.log('customer.updated.before', { old, new: next, source });
        },
        [HookEvents.CustomerCreatedAfter]: async ({ entityId, new: customer }) => {
          await notify.customerReady(entityId!, customer!);
        },
      },
    });
    ```

=== ".NET"
    ```csharp
    using Subscrio.Core;
    using Subscrio.Core.Application.Hooks;
    using Subscrio.Core.Config;

    var subscrio = new Subscrio(new SubscrioConfig
    {
        Database = new DatabaseConfig { ConnectionString = conn },
        Hooks = new SubscrioHooksOptions
        {
            OnStripeReceivedBefore = async (evt, ct) =>
                await audit.LogInboundStripeAsync(evt.Data, ct),
            OnCustomerUpdatedBefore = async (evt, ct) =>
                await audit.LogAsync(evt.Type, evt.Old, evt.New, evt.Source, ct),
            OnCustomerCreatedAfter = async (evt, ct) =>
                await notify.CustomerReadyAsync(evt.EntityId!.Value, evt.New!, ct),
        }
    });
    ```

### Runtime Registration

=== "TypeScript"
    ```typescript
    const off = subscrio.hooks.on(HookEvents.SubscriptionUpdatedBefore, async (evt) => {
      await audit.logDiff(evt.old, evt.new, evt.source);
    });

    // later
    off();

    // or
    subscrio.hooks.off(HookEvents.SubscriptionUpdatedBefore, handler);
    ```

=== ".NET"
    ```csharp
    var off = subscrio.Hooks.OnSubscriptionUpdatedBefore(async (evt, ct) =>
    {
        await audit.LogDiffAsync(evt.Old, evt.New, evt.Source, ct);
    });

    // later
    off();
    ```

### Aborting a Mutation (before only)

=== "TypeScript"
    ```typescript
    subscrio.hooks.on(HookEvents.CustomerUpdatedBefore, async ({ new: next }) => {
      if (next?.email?.endsWith('@blocked.test')) {
        throw new Error('Blocked customer domain');
      }
    });
    ```

=== ".NET"
    ```csharp
    subscrio.Hooks.OnCustomerUpdatedBefore(async (evt, ct) =>
    {
        if (evt.New?.Email?.EndsWith("@blocked.test") == true)
        {
            throw new InvalidOperationException("Blocked customer domain");
        }
    });
    ```

### Mutating Proposed Data (before only)

=== "TypeScript"
    ```typescript
    subscrio.hooks.on(HookEvents.CustomerCreatedBefore, async (evt) => {
      evt.new!.displayName = evt.new!.displayName?.trim() ?? null;
    });
    ```

=== ".NET"
    ```csharp
    subscrio.Hooks.OnCustomerCreatedBefore(async (evt, ct) =>
    {
        if (evt.New != null)
        {
            evt.New.DisplayName = evt.New.DisplayName?.Trim();
        }
    });
    ```

## Migration from Old Event Names

Older docs and code used unsuffixed names such as `customer.created` and `HookEvents.CustomerCreated`. Those names are removed.

| Old | New (pick phase) |
| --- | --- |
| `customer.created` | `customer.created.before` or `customer.created.after` |
| `customer.updated` | `customer.updated.before` / `.after` |
| `customer.archived` | `customer.archived.before` / `.after` |
| `customer.unarchived` | `customer.unarchived.before` / `.after` |
| `customer.deleted` | `customer.deleted.before` / `.after` |
| `subscription.*` | `subscription.*.before` / `.after` |
| `stripe.received` | `stripe.received.before` / `.after` |

TypeScript: replace `HookEvents.CustomerCreated` with `HookEvents.CustomerCreatedBefore` or `CustomerCreatedAfter` (same pattern for every event).

.NET: replace `OnCustomerCreated` with `OnCustomerCreatedBefore` or `OnCustomerCreatedAfter` (same pattern for every registration method and `SubscrioHooksOptions` property).

Guidance:

- Validation, enrichment, and abort → `*.before`
- Side effects that need a committed row / `entityId` → `*.after`
- Audit that must not write if the mutation fails → prefer `*.after`, or accept before-hook trade-offs

## Coverage

Hooks fire from:

=== "TypeScript"
    - `subscrio.customers.*` mutations (`source: 'api'`)
    - `subscrio.subscriptions.*` mutations (`source: 'api'`)
    - `subscrio.subscriptions.transitionExpiredSubscriptions()` (`source: 'system'`)
    - `subscrio.stripe.processStripeEvent` (`stripe.received.before` / `.after`) and related writes (`source: 'stripe'`)

=== ".NET"
    - `subscrio.Customers.*` mutations (`Source: "api"`)
    - `subscrio.Subscriptions.*` mutations (`Source: "api"`)
    - `subscrio.Subscriptions.TransitionExpiredSubscriptionsAsync()` (`Source: "system"`)
    - `subscrio.Stripe.ProcessStripeEventAsync` (`stripe.received.before` / `.after`) and related writes (`Source: "stripe"`)

## Related Workflows

- Customer and subscription public APIs emit domain hooks around each write. See [Customers](./customers.md) and [Subscriptions](./subscriptions.md).
- Stripe inbound processing emits `stripe.received.before`, domain hooks with `source: stripe`, then `stripe.received.after`. See [Stripe Integration](./stripe-integration.md).
- Packaging reusable handlers (audit log, etc.): [How to Extend](./how-to-extend.md).
