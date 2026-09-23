---
title: Hooks
description: Register handlers for customer, subscription, Stripe, usage, and credit events.
reference_format: true
---

# Hooks

## Purpose

<span id="config-time-registration" class="compatibility-anchor"></span>
<span id="runtime-registration" class="compatibility-anchor"></span>
<span id="aborting-a-mutation-before-only" class="compatibility-anchor"></span>
<span id="mutating-proposed-data-before-only" class="compatibility-anchor"></span>
<span id="migration-from-old-event-names" class="compatibility-anchor"></span>
<span id="coverage" class="compatibility-anchor"></span>
<span id="related-workflows" class="compatibility-anchor"></span>
<span id="add-on-usage-and-credit-hooks" class="compatibility-anchor"></span>

<span id="accessing-hooks" class="compatibility-anchor"></span>
<span id="before-and-after" class="compatibility-anchor"></span>
<span id="mutation-rules-for-before-hooks" class="compatibility-anchor"></span>
<span id="fields-copied-from-customer-hooks" class="compatibility-anchor"></span>
<span id="fields-copied-from-subscription-hooks" class="compatibility-anchor"></span>
<span id="entityid-and-customerid" class="compatibility-anchor"></span>
<span id="throw-semantics" class="compatibility-anchor"></span>
<span id="event-catalog" class="compatibility-anchor"></span>
<span id="customer" class="compatibility-anchor"></span>
<span id="subscription" class="compatibility-anchor"></span>
<span id="stripe-inbound" class="compatibility-anchor"></span>
<span id="payload-shape" class="compatibility-anchor"></span>
<span id="domain-mutation-payload" class="compatibility-anchor"></span>
<span id="stripe-received-payload" class="compatibility-anchor"></span>
<span id="registration-api" class="compatibility-anchor"></span>

Hooks let application code validate or adjust proposed changes before saving and react after saving. Handlers run sequentially in registration order. A thrown error stops later handlers; after-hook failure does not undo an already-saved operation.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const hooks = subscrio.hooks;
```

</div>
<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core.Application.Hooks;

var hooks = subscrio.Hooks;
```

</div>

TypeScript registers events through `on`; .NET provides one named registration method per event. Construction-time registration uses [HooksConfig](#HooksConfig). Domain events have old/new snapshots; accounting events have input/result payloads.

## Method catalog

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`on`](#on) | Registers a handler and returns an unsubscribe function. |
| [`off`](#off) | Removes a handler. |
| [`hasListeners`](#haslisteners) | Checks registrations for diagnostics. |
| [`emit`](#emit) | Dispatches a payload without persisting data. |

</div>
<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`OnCustomerCreatedBefore`](#oncustomercreatedbefore) | Registers a before handler. |
| [`OnCustomerCreatedAfter`](#oncustomercreatedafter) | Registers an after handler. |
| [`OnCustomerUpdatedBefore`](#oncustomerupdatedbefore) | Registers a before handler. |
| [`OnCustomerUpdatedAfter`](#oncustomerupdatedafter) | Registers an after handler. |
| [`OnCustomerArchivedBefore`](#oncustomerarchivedbefore) | Registers a before handler. |
| [`OnCustomerArchivedAfter`](#oncustomerarchivedafter) | Registers an after handler. |
| [`OnCustomerUnarchivedBefore`](#oncustomerunarchivedbefore) | Registers a before handler. |
| [`OnCustomerUnarchivedAfter`](#oncustomerunarchivedafter) | Registers an after handler. |
| [`OnCustomerDeletedBefore`](#oncustomerdeletedbefore) | Registers a before handler. |
| [`OnCustomerDeletedAfter`](#oncustomerdeletedafter) | Registers an after handler. |
| [`OnSubscriptionCreatedBefore`](#onsubscriptioncreatedbefore) | Registers a before handler. |
| [`OnSubscriptionCreatedAfter`](#onsubscriptioncreatedafter) | Registers an after handler. |
| [`OnSubscriptionUpdatedBefore`](#onsubscriptionupdatedbefore) | Registers a before handler. |
| [`OnSubscriptionUpdatedAfter`](#onsubscriptionupdatedafter) | Registers an after handler. |
| [`OnSubscriptionArchivedBefore`](#onsubscriptionarchivedbefore) | Registers a before handler. |
| [`OnSubscriptionArchivedAfter`](#onsubscriptionarchivedafter) | Registers an after handler. |
| [`OnSubscriptionUnarchivedBefore`](#onsubscriptionunarchivedbefore) | Registers a before handler. |
| [`OnSubscriptionUnarchivedAfter`](#onsubscriptionunarchivedafter) | Registers an after handler. |
| [`OnSubscriptionDeletedBefore`](#onsubscriptiondeletedbefore) | Registers a before handler. |
| [`OnSubscriptionDeletedAfter`](#onsubscriptiondeletedafter) | Registers an after handler. |
| [`OnSubscriptionFeatureOverrideAddedBefore`](#onsubscriptionfeatureoverrideaddedbefore) | Registers a before handler. |
| [`OnSubscriptionFeatureOverrideAddedAfter`](#onsubscriptionfeatureoverrideaddedafter) | Registers an after handler. |
| [`OnSubscriptionFeatureOverrideRemovedBefore`](#onsubscriptionfeatureoverrideremovedbefore) | Registers a before handler. |
| [`OnSubscriptionFeatureOverrideRemovedAfter`](#onsubscriptionfeatureoverrideremovedafter) | Registers an after handler. |
| [`OnSubscriptionTemporaryOverridesClearedBefore`](#onsubscriptiontemporaryoverridesclearedbefore) | Registers a before handler. |
| [`OnSubscriptionTemporaryOverridesClearedAfter`](#onsubscriptiontemporaryoverridesclearedafter) | Registers an after handler. |
| [`OnStripeReceivedBefore`](#onstripereceivedbefore) | Registers a before handler. |
| [`OnStripeReceivedAfter`](#onstripereceivedafter) | Registers an after handler. |
| [`OnSubscriptionAddonAttachedBefore`](#onsubscriptionaddonattachedbefore) | Registers a before handler. |
| [`OnSubscriptionAddonAttachedAfter`](#onsubscriptionaddonattachedafter) | Registers an after handler. |
| [`OnSubscriptionAddonDetachedBefore`](#onsubscriptionaddondetachedbefore) | Registers a before handler. |
| [`OnSubscriptionAddonDetachedAfter`](#onsubscriptionaddondetachedafter) | Registers an after handler. |
| [`OnUsageReportedBefore`](#onusagereportedbefore) | Registers a before handler. |
| [`OnUsageReportedAfter`](#onusagereportedafter) | Registers an after handler. |
| [`OnCreditConsumedBefore`](#oncreditconsumedbefore) | Registers a before handler. |
| [`OnCreditConsumedAfter`](#oncreditconsumedafter) | Registers an after handler. |
| [`OnCreditGrantedBefore`](#oncreditgrantedbefore) | Registers a before handler. |
| [`OnCreditGrantedAfter`](#oncreditgrantedafter) | Registers an after handler. |
| [`OnCreditAdjustedBefore`](#oncreditadjustedbefore) | Registers a before handler. |
| [`OnCreditAdjustedAfter`](#oncreditadjustedafter) | Registers an after handler. |
| [`HasListeners`](#haslisteners) | Checks registrations for diagnostics. |
| [`EmitCustomerBeforeAsync`](#emitcustomerbeforeasync) | Dispatch helper for custom integrations. |
| [`EmitCustomerAfterAsync`](#emitcustomerafterasync) | Dispatch helper for custom integrations. |
| [`EmitSubscriptionBeforeAsync`](#emitsubscriptionbeforeasync) | Dispatch helper for custom integrations. |
| [`EmitSubscriptionAfterAsync`](#emitsubscriptionafterasync) | Dispatch helper for custom integrations. |
| [`EmitStripeReceivedAsync`](#emitstripereceivedasync) | Dispatch helper for custom integrations. |

</div>

## Method details

<div class="language-content" data-lang="ts" markdown="1">

<div class="method-entry" markdown="1">

### on { #on }

Register one handler for an event. Registering the same function for the same event twice keeps one registration. .NET uses the event-specific methods shown in its language view.

<div class="signature" markdown="1">

```typescript
on<E extends HookEventName>(event: E, handler: HookHandler<E>): () => void
```

</div>

**Parameters**

- `event`: [HookEventName](#HookEventName).
- `handler`: [HookHandler](#HookHandler) receiving the event-specific payload.

**Returns** `() => void`: Call this function to unsubscribe.

**Example**

```typescript
import { HookEvents } from 'subscrio';

const unsubscribe = subscrio.hooks.on(HookEvents.CustomerCreatedAfter, event => {
  console.log(event.new?.key);
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="ts" markdown="1">

<div class="method-entry" markdown="1">

### off { #off }

Remove a previously registered function. Unknown registrations are ignored. .NET uses the Action returned by its registration method.

<div class="signature" markdown="1">

```typescript
off<E extends HookEventName>(event: E, handler: HookHandler<E>): void
```

</div>

**Parameters**

- `event`: Registered [event name](#HookEventName).
- `handler`: The same function reference originally registered.

**Returns** No returned value.

**Example**

```typescript
import { HookEvents, type HookHandler } from 'subscrio';

const handler: HookHandler<typeof HookEvents.CustomerCreatedAfter> = event => {
  console.log(event.new?.key);
};
subscrio.hooks.on(HookEvents.CustomerCreatedAfter, handler);
subscrio.hooks.off(HookEvents.CustomerCreatedAfter, handler);
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerCreatedBefore { #oncustomercreatedbefore }

Register a handler before `customer.created`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnCustomerCreatedBefore(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerCreatedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerCreatedAfter { #oncustomercreatedafter }

Register a handler after `customer.created`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnCustomerCreatedAfter(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerCreatedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerUpdatedBefore { #oncustomerupdatedbefore }

Register a handler before `customer.updated`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnCustomerUpdatedBefore(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerUpdatedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerUpdatedAfter { #oncustomerupdatedafter }

Register a handler after `customer.updated`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnCustomerUpdatedAfter(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerUpdatedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerArchivedBefore { #oncustomerarchivedbefore }

Register a handler before `customer.archived`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnCustomerArchivedBefore(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerArchivedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerArchivedAfter { #oncustomerarchivedafter }

Register a handler after `customer.archived`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnCustomerArchivedAfter(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerArchivedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerUnarchivedBefore { #oncustomerunarchivedbefore }

Register a handler before `customer.unarchived`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnCustomerUnarchivedBefore(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerUnarchivedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerUnarchivedAfter { #oncustomerunarchivedafter }

Register a handler after `customer.unarchived`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnCustomerUnarchivedAfter(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerUnarchivedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerDeletedBefore { #oncustomerdeletedbefore }

Register a handler before `customer.deleted`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnCustomerDeletedBefore(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerDeletedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCustomerDeletedAfter { #oncustomerdeletedafter }

Register a handler after `customer.deleted`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnCustomerDeletedAfter(CustomerHookHandler handler)
```

</div>

**Parameters**

- `handler`: [CustomerHookHandler](#CustomerHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerDeletedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionCreatedBefore { #onsubscriptioncreatedbefore }

Register a handler before `subscription.created`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionCreatedBefore(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionCreatedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionCreatedAfter { #onsubscriptioncreatedafter }

Register a handler after `subscription.created`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionCreatedAfter(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionCreatedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionUpdatedBefore { #onsubscriptionupdatedbefore }

Register a handler before `subscription.updated`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionUpdatedBefore(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionUpdatedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionUpdatedAfter { #onsubscriptionupdatedafter }

Register a handler after `subscription.updated`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionUpdatedAfter(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionUpdatedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionArchivedBefore { #onsubscriptionarchivedbefore }

Register a handler before `subscription.archived`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionArchivedBefore(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionArchivedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionArchivedAfter { #onsubscriptionarchivedafter }

Register a handler after `subscription.archived`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionArchivedAfter(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionArchivedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionUnarchivedBefore { #onsubscriptionunarchivedbefore }

Register a handler before `subscription.unarchived`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionUnarchivedBefore(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionUnarchivedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionUnarchivedAfter { #onsubscriptionunarchivedafter }

Register a handler after `subscription.unarchived`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionUnarchivedAfter(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionUnarchivedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionDeletedBefore { #onsubscriptiondeletedbefore }

Register a handler before `subscription.deleted`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionDeletedBefore(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionDeletedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionDeletedAfter { #onsubscriptiondeletedafter }

Register a handler after `subscription.deleted`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionDeletedAfter(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionDeletedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionFeatureOverrideAddedBefore { #onsubscriptionfeatureoverrideaddedbefore }

Register a handler before `subscription.featureOverrideAdded`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionFeatureOverrideAddedBefore(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionFeatureOverrideAddedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionFeatureOverrideAddedAfter { #onsubscriptionfeatureoverrideaddedafter }

Register a handler after `subscription.featureOverrideAdded`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionFeatureOverrideAddedAfter(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionFeatureOverrideAddedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionFeatureOverrideRemovedBefore { #onsubscriptionfeatureoverrideremovedbefore }

Register a handler before `subscription.featureOverrideRemoved`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionFeatureOverrideRemovedBefore(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionFeatureOverrideRemovedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionFeatureOverrideRemovedAfter { #onsubscriptionfeatureoverrideremovedafter }

Register a handler after `subscription.featureOverrideRemoved`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionFeatureOverrideRemovedAfter(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionFeatureOverrideRemovedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionTemporaryOverridesClearedBefore { #onsubscriptiontemporaryoverridesclearedbefore }

Register a handler before `subscription.temporaryOverridesCleared`. A thrown error prevents the pending mutation.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionTemporaryOverridesClearedBefore(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionTemporaryOverridesClearedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionTemporaryOverridesClearedAfter { #onsubscriptiontemporaryoverridesclearedafter }

Register a handler after `subscription.temporaryOverridesCleared`. A thrown error propagates after the change has been saved.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionTemporaryOverridesClearedAfter(SubscriptionHookHandler handler)
```

</div>

**Parameters**

- `handler`: [SubscriptionHookHandler](#SubscriptionHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionTemporaryOverridesClearedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnStripeReceivedBefore { #onstripereceivedbefore }

Register a handler before Stripe event processing. Throwing stops processing; changing the snapshot does not rewrite the incoming event.

<div class="signature" markdown="1">

```csharp
Action OnStripeReceivedBefore(StripeReceivedHookHandler handler)
```

</div>

**Parameters**

- `handler`: [StripeReceivedHookHandler](#StripeReceivedHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnStripeReceivedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnStripeReceivedAfter { #onstripereceivedafter }

Register a handler after Stripe event processing. The handler runs after successful processing, including ignored event types.

<div class="signature" markdown="1">

```csharp
Action OnStripeReceivedAfter(StripeReceivedHookHandler handler)
```

</div>

**Parameters**

- `handler`: [StripeReceivedHookHandler](#StripeReceivedHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnStripeReceivedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionAddonAttachedBefore { #onsubscriptionaddonattachedbefore }

Register a handler before `subscription.addonAttached`. A thrown error prevents the pending mutation. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionAddonAttachedBefore(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionAddonAttachedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionAddonAttachedAfter { #onsubscriptionaddonattachedafter }

Register a handler after `subscription.addonAttached`. A thrown error propagates after the change has been saved. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionAddonAttachedAfter(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionAddonAttachedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionAddonDetachedBefore { #onsubscriptionaddondetachedbefore }

Register a handler before `subscription.addonDetached`. A thrown error prevents the pending mutation. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionAddonDetachedBefore(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionAddonDetachedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnSubscriptionAddonDetachedAfter { #onsubscriptionaddondetachedafter }

Register a handler after `subscription.addonDetached`. A thrown error propagates after the change has been saved. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnSubscriptionAddonDetachedAfter(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnSubscriptionAddonDetachedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnUsageReportedBefore { #onusagereportedbefore }

Register a handler before `usage.reported`. A thrown error prevents the pending mutation. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnUsageReportedBefore(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnUsageReportedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnUsageReportedAfter { #onusagereportedafter }

Register a handler after `usage.reported`. A thrown error propagates after the change has been saved. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnUsageReportedAfter(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnUsageReportedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCreditConsumedBefore { #oncreditconsumedbefore }

Register a handler before `credit.consumed`. A thrown error prevents the pending mutation. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnCreditConsumedBefore(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCreditConsumedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCreditConsumedAfter { #oncreditconsumedafter }

Register a handler after `credit.consumed`. A thrown error propagates after the change has been saved. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnCreditConsumedAfter(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCreditConsumedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCreditGrantedBefore { #oncreditgrantedbefore }

Register a handler before `credit.granted`. A thrown error prevents the pending mutation. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnCreditGrantedBefore(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCreditGrantedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCreditGrantedAfter { #oncreditgrantedafter }

Register a handler after `credit.granted`. A thrown error propagates after the change has been saved. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnCreditGrantedAfter(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCreditGrantedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCreditAdjustedBefore { #oncreditadjustedbefore }

Register a handler before `credit.adjusted`. A thrown error prevents the pending mutation. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnCreditAdjustedBefore(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCreditAdjustedBefore((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### OnCreditAdjustedAfter { #oncreditadjustedafter }

Register a handler after `credit.adjusted`. A thrown error propagates after the change has been saved. See the [accounting payload](#AccountingMutationHookEvent) for allowed changes and commit-error handling.

<div class="signature" markdown="1">

```csharp
Action OnCreditAdjustedAfter(AccountingHookHandler handler)
```

</div>

**Parameters**

- `handler`: [AccountingHookHandler](#AccountingHookHandler) delegate. Registering twice adds two invocations.

**Returns** `Action`: Invoke it to remove this registration.

**Example**

```csharp
var unsubscribe = subscrio.Hooks.OnCreditAdjustedAfter((evt, cancellationToken) =>
{
    Console.WriteLine(evt.Type);
    return Task.CompletedTask;
});
unsubscribe();
```

</div>

</div>

<div class="method-entry" markdown="1">

### hasListeners { #haslisteners data-method-ts="hasListeners" data-method-net="HasListeners" }

Check whether an event has registered handlers. This diagnostic does not invoke them.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
hasListeners(event: HookEventName): boolean
```

</div>

**Parameters**

- `event`: [HookEventName](#HookEventName).

**Returns** `boolean`: Whether at least one handler is registered.

**Example**

```typescript
import { HookEvents } from 'subscrio';

console.log(subscrio.hooks.hasListeners(HookEvents.CustomerCreatedAfter));
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
bool HasListeners(string eventName)
```

</div>

**Parameters**

- `eventName`: Event string from [HookEvents](#HookEventName).

**Returns** `bool`: Whether at least one handler is registered.

**Example**

```csharp
Console.WriteLine(subscrio.Hooks.HasListeners(HookEvents.CustomerCreatedAfter));
```

</div>

</div>

<div class="language-content" data-lang="ts" markdown="1">

<div class="method-entry" markdown="1">

### emit { #emit }

Dispatch a payload to the registered handlers without saving an entity. This helper is for custom integrations; normal library methods emit their own events. Handler errors propagate.

<div class="signature" markdown="1">

```typescript
emit<E extends HookEventName>(event: E, payload: HookEventMap[E]): Promise<void>
```

</div>

**Parameters**

- `event`: [HookEventName](#HookEventName).
- `payload`: Corresponding [HookEventMap](#HookEventMap) payload.

**Returns** No returned value.

**Example**

```typescript
import { HookEvents } from 'subscrio';

await subscrio.hooks.emit(HookEvents.CustomerDeletedAfter, {
  type: HookEvents.CustomerDeletedAfter, phase: 'after', source: 'system',
  occurredAt: new Date().toISOString(), entityId: null, old: null, new: null
});
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### EmitCustomerBeforeAsync { #emitcustomerbeforeasync }

Dispatch a payload for a custom integration without saving a database record. Handler exceptions propagate. Ordinary library operations call the dispatcher themselves.

<div class="signature" markdown="1">

```csharp
Task<CustomerDto?> EmitCustomerBeforeAsync(string eventName, HookSource source, long? entityId, CustomerDto? oldDto, CustomerDto? newDto, CancellationToken cancellationToken)
```

</div>

**Parameters**

- `eventName`: Matching [event name](#HookEventName).
- `source`: [HookSource](#HookSource) identifying the initiator.
- `entityId`: Database entity ID, or null before creation.
- `oldDto`, `newDto`: Previous and proposed or saved [CustomerDto](customers.md#CustomerDto) snapshots. Null old means creation; null new means deletion.
- `cancellationToken`: Optional cancellation token; defaults to default.

**Returns** [CustomerDto](customers.md#CustomerDto)`?`: Proposed customer after handlers; unchanged when no listeners exist.

**Example**

```csharp
await subscrio.Hooks.EmitCustomerBeforeAsync(
    HookEvents.CustomerCreatedBefore, HookSource.System, null, null, new CustomerDto { Key = "example" });
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### EmitCustomerAfterAsync { #emitcustomerafterasync }

Dispatch a payload for a custom integration without saving a database record. Handler exceptions propagate. Ordinary library operations call the dispatcher themselves.

<div class="signature" markdown="1">

```csharp
Task EmitCustomerAfterAsync(string eventName, HookSource source, long? entityId, CustomerDto? oldDto, CustomerDto? newDto, CancellationToken cancellationToken)
```

</div>

**Parameters**

- `eventName`: Matching [event name](#HookEventName).
- `source`: [HookSource](#HookSource) identifying the initiator.
- `entityId`: Database entity ID, or null before creation.
- `oldDto`, `newDto`: Previous and proposed or saved [CustomerDto](customers.md#CustomerDto) snapshots. Null old means creation; null new means deletion.
- `cancellationToken`: Optional cancellation token; defaults to default.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Hooks.EmitCustomerAfterAsync(
    HookEvents.CustomerCreatedAfter, HookSource.System, null, null, new CustomerDto { Key = "example" });
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### EmitSubscriptionBeforeAsync { #emitsubscriptionbeforeasync }

Dispatch a payload for a custom integration without saving a database record. Handler exceptions propagate. Ordinary library operations call the dispatcher themselves.

<div class="signature" markdown="1">

```csharp
Task<SubscriptionMutationHookEvent?> EmitSubscriptionBeforeAsync(string eventName, HookSource source, long? entityId, long? customerId, SubscriptionDto? oldDto, SubscriptionDto? newDto, string? featureKey, string? value, string? overrideType, CancellationToken cancellationToken, DateTime? expiresAt)
```

</div>

**Parameters**

- `eventName`: Matching [event name](#HookEventName).
- `source`: [HookSource](#HookSource) identifying the initiator.
- `entityId`: Database entity ID, or null before creation.
- `customerId`: Database customer ID, or null when unavailable.
- `oldDto`, `newDto`: Previous and proposed or saved [SubscriptionDto](subscriptions.md#SubscriptionDto) snapshots. Null old means creation; null new means deletion.
- `featureKey`, `value`, `overrideType`: Optional override context; defaults to null.
- `expiresAt`: Optional timed-override expiry; defaults to null.
- `cancellationToken`: Optional cancellation token; defaults to default.

**Returns** [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent)`?`: Mutable payload, or null when no listeners exist.

**Example**

```csharp
await subscrio.Hooks.EmitSubscriptionBeforeAsync(
    HookEvents.SubscriptionCreatedBefore, HookSource.System, null, null, null, new SubscriptionDto { Key = "example" });
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### EmitSubscriptionAfterAsync { #emitsubscriptionafterasync }

Dispatch a payload for a custom integration without saving a database record. Handler exceptions propagate. Ordinary library operations call the dispatcher themselves.

<div class="signature" markdown="1">

```csharp
Task EmitSubscriptionAfterAsync(string eventName, HookSource source, long? entityId, long? customerId, SubscriptionDto? oldDto, SubscriptionDto? newDto, string? featureKey, string? value, string? overrideType, CancellationToken cancellationToken, DateTime? expiresAt)
```

</div>

**Parameters**

- `eventName`: Matching [event name](#HookEventName).
- `source`: [HookSource](#HookSource) identifying the initiator.
- `entityId`: Database entity ID, or null before creation.
- `customerId`: Database customer ID, or null when unavailable.
- `oldDto`, `newDto`: Previous and proposed or saved [SubscriptionDto](subscriptions.md#SubscriptionDto) snapshots. Null old means creation; null new means deletion.
- `featureKey`, `value`, `overrideType`: Optional override context; defaults to null.
- `expiresAt`: Optional timed-override expiry; defaults to null.
- `cancellationToken`: Optional cancellation token; defaults to default.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Hooks.EmitSubscriptionAfterAsync(
    HookEvents.SubscriptionCreatedAfter, HookSource.System, null, null, null, new SubscriptionDto { Key = "example" });
```

</div>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="method-entry" markdown="1">

### EmitStripeReceivedAsync { #emitstripereceivedasync }

Dispatch a payload for a custom integration without saving a database record. Handler exceptions propagate. Ordinary library operations call the dispatcher themselves.

<div class="signature" markdown="1">

```csharp
Task EmitStripeReceivedAsync(string eventName, HookPhase phase, Stripe.Event stripeEvent, CancellationToken cancellationToken)
```

</div>

**Parameters**

- `eventName`: Matching [event name](#HookEventName).
- `phase`: Before or After from [HookPhase](#HookPhase).
- `stripeEvent`: Parsed Stripe event to snapshot.
- `cancellationToken`: Optional cancellation token; defaults to default.

**Returns** No returned value.

**Example**

```csharp
var stripeEvent = new Stripe.Event { Id = "evt_example", Type = "customer.updated" };
await subscrio.Hooks.EmitStripeReceivedAsync(
    HookEvents.StripeReceivedBefore, HookPhase.Before, stripeEvent);
```

</div>

</div>

## Data types

Hook payloads are snapshots. Editing an after payload does not persist changes. Before handlers must use the fields supported by their event; relationship keys do not remap customer, plan, or billing-cycle relationships.

<div class="data-type" markdown="1">

### HooksConfig { #HooksConfig data-method-ts="HooksConfig" data-method-net="SubscrioHooksOptions" }

Optional construction-time registration. Each field defaults to no handler. Runtime registration is also supported.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| Each [event name](#HookEventName) | <code><a href="#HookHandler">HookHandler</a>&lt;E&gt; \| <a href="#HookHandler">HookHandler</a>&lt;E&gt;[]</code> | No | None | One handler or ordered list for that event. |

</div>
<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `OnCustomerCreatedBefore` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.created.before`. |
| `OnCustomerCreatedAfter` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.created.after`. |
| `OnCustomerUpdatedBefore` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.updated.before`. |
| `OnCustomerUpdatedAfter` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.updated.after`. |
| `OnCustomerArchivedBefore` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.archived.before`. |
| `OnCustomerArchivedAfter` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.archived.after`. |
| `OnCustomerUnarchivedBefore` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.unarchived.before`. |
| `OnCustomerUnarchivedAfter` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.unarchived.after`. |
| `OnCustomerDeletedBefore` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.deleted.before`. |
| `OnCustomerDeletedAfter` | <code><a href="#CustomerHookHandler">CustomerHookHandler</a>?</code> | No | null | Handler for `customer.deleted.after`. |
| `OnSubscriptionCreatedBefore` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.created.before`. |
| `OnSubscriptionCreatedAfter` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.created.after`. |
| `OnSubscriptionUpdatedBefore` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.updated.before`. |
| `OnSubscriptionUpdatedAfter` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.updated.after`. |
| `OnSubscriptionArchivedBefore` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.archived.before`. |
| `OnSubscriptionArchivedAfter` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.archived.after`. |
| `OnSubscriptionUnarchivedBefore` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.unarchived.before`. |
| `OnSubscriptionUnarchivedAfter` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.unarchived.after`. |
| `OnSubscriptionDeletedBefore` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.deleted.before`. |
| `OnSubscriptionDeletedAfter` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.deleted.after`. |
| `OnSubscriptionFeatureOverrideAddedBefore` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.featureOverrideAdded.before`. |
| `OnSubscriptionFeatureOverrideAddedAfter` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.featureOverrideAdded.after`. |
| `OnSubscriptionFeatureOverrideRemovedBefore` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.featureOverrideRemoved.before`. |
| `OnSubscriptionFeatureOverrideRemovedAfter` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.featureOverrideRemoved.after`. |
| `OnSubscriptionTemporaryOverridesClearedBefore` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.temporaryOverridesCleared.before`. |
| `OnSubscriptionTemporaryOverridesClearedAfter` | <code><a href="#SubscriptionHookHandler">SubscriptionHookHandler</a>?</code> | No | null | Handler for `subscription.temporaryOverridesCleared.after`. |
| `OnStripeReceivedBefore` | <code><a href="#StripeReceivedHookHandler">StripeReceivedHookHandler</a>?</code> | No | null | Handler for `stripe.received.before`. |
| `OnStripeReceivedAfter` | <code><a href="#StripeReceivedHookHandler">StripeReceivedHookHandler</a>?</code> | No | null | Handler for `stripe.received.after`. |
| `OnSubscriptionAddonAttachedBefore` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `subscription.addonAttached.before`. |
| `OnSubscriptionAddonAttachedAfter` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `subscription.addonAttached.after`. |
| `OnSubscriptionAddonDetachedBefore` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `subscription.addonDetached.before`. |
| `OnSubscriptionAddonDetachedAfter` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `subscription.addonDetached.after`. |
| `OnUsageReportedBefore` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `usage.reported.before`. |
| `OnUsageReportedAfter` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `usage.reported.after`. |
| `OnCreditConsumedBefore` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `credit.consumed.before`. |
| `OnCreditConsumedAfter` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `credit.consumed.after`. |
| `OnCreditGrantedBefore` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `credit.granted.before`. |
| `OnCreditGrantedAfter` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `credit.granted.after`. |
| `OnCreditAdjustedBefore` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `credit.adjusted.before`. |
| `OnCreditAdjustedAfter` | <code><a href="#AccountingHookHandler">AccountingHookHandler</a>?</code> | No | null | Handler for `credit.adjusted.after`. |

</div>
</div>

<div class="data-type" markdown="1">

### HookEventName { #HookEventName }

Supported event constants and payloads. TypeScript uses their string-value union; .NET uses the same strings through HookEvents.

<div class="language-content" data-lang="ts" markdown="1">

| Value | Meaning |
| --- | --- |
| `HookEvents.SubscriptionAddonAttachedBefore` | `subscription.addonAttached.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.SubscriptionAddonAttachedAfter` | `subscription.addonAttached.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.SubscriptionAddonDetachedBefore` | `subscription.addonDetached.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.SubscriptionAddonDetachedAfter` | `subscription.addonDetached.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.UsageReportedBefore` | `usage.reported.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.UsageReportedAfter` | `usage.reported.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditConsumedBefore` | `credit.consumed.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditConsumedAfter` | `credit.consumed.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditGrantedBefore` | `credit.granted.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditGrantedAfter` | `credit.granted.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditAdjustedBefore` | `credit.adjusted.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditAdjustedAfter` | `credit.adjusted.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CustomerCreatedBefore` | `customer.created.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerCreatedAfter` | `customer.created.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerUpdatedBefore` | `customer.updated.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerUpdatedAfter` | `customer.updated.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerArchivedBefore` | `customer.archived.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerArchivedAfter` | `customer.archived.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerUnarchivedBefore` | `customer.unarchived.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerUnarchivedAfter` | `customer.unarchived.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerDeletedBefore` | `customer.deleted.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerDeletedAfter` | `customer.deleted.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.SubscriptionCreatedBefore` | `subscription.created.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionCreatedAfter` | `subscription.created.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionUpdatedBefore` | `subscription.updated.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionUpdatedAfter` | `subscription.updated.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionArchivedBefore` | `subscription.archived.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionArchivedAfter` | `subscription.archived.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionUnarchivedBefore` | `subscription.unarchived.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionUnarchivedAfter` | `subscription.unarchived.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionDeletedBefore` | `subscription.deleted.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionDeletedAfter` | `subscription.deleted.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionFeatureOverrideAddedBefore` | `subscription.featureOverrideAdded.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionFeatureOverrideAddedAfter` | `subscription.featureOverrideAdded.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionFeatureOverrideRemovedBefore` | `subscription.featureOverrideRemoved.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionFeatureOverrideRemovedAfter` | `subscription.featureOverrideRemoved.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionTemporaryOverridesClearedBefore` | `subscription.temporaryOverridesCleared.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionTemporaryOverridesClearedAfter` | `subscription.temporaryOverridesCleared.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.StripeReceivedBefore` | `stripe.received.before`; [StripeReceivedHookEvent](#StripeReceivedHookEvent). |
| `HookEvents.StripeReceivedAfter` | `stripe.received.after`; [StripeReceivedHookEvent](#StripeReceivedHookEvent). |

</div>
<div class="language-content" data-lang="net" markdown="1">

| Value | Meaning |
| --- | --- |
| `HookEvents.SubscriptionAddonAttachedBefore` | `subscription.addonAttached.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.SubscriptionAddonAttachedAfter` | `subscription.addonAttached.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.SubscriptionAddonDetachedBefore` | `subscription.addonDetached.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.SubscriptionAddonDetachedAfter` | `subscription.addonDetached.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.UsageReportedBefore` | `usage.reported.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.UsageReportedAfter` | `usage.reported.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditConsumedBefore` | `credit.consumed.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditConsumedAfter` | `credit.consumed.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditGrantedBefore` | `credit.granted.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditGrantedAfter` | `credit.granted.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditAdjustedBefore` | `credit.adjusted.before`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CreditAdjustedAfter` | `credit.adjusted.after`; [AccountingMutationHookEvent](#AccountingMutationHookEvent). |
| `HookEvents.CustomerCreatedBefore` | `customer.created.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerCreatedAfter` | `customer.created.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerUpdatedBefore` | `customer.updated.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerUpdatedAfter` | `customer.updated.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerArchivedBefore` | `customer.archived.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerArchivedAfter` | `customer.archived.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerUnarchivedBefore` | `customer.unarchived.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerUnarchivedAfter` | `customer.unarchived.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerDeletedBefore` | `customer.deleted.before`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.CustomerDeletedAfter` | `customer.deleted.after`; [CustomerMutationHookEvent](#CustomerMutationHookEvent). |
| `HookEvents.SubscriptionCreatedBefore` | `subscription.created.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionCreatedAfter` | `subscription.created.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionUpdatedBefore` | `subscription.updated.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionUpdatedAfter` | `subscription.updated.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionArchivedBefore` | `subscription.archived.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionArchivedAfter` | `subscription.archived.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionUnarchivedBefore` | `subscription.unarchived.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionUnarchivedAfter` | `subscription.unarchived.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionDeletedBefore` | `subscription.deleted.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionDeletedAfter` | `subscription.deleted.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionFeatureOverrideAddedBefore` | `subscription.featureOverrideAdded.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionFeatureOverrideAddedAfter` | `subscription.featureOverrideAdded.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionFeatureOverrideRemovedBefore` | `subscription.featureOverrideRemoved.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionFeatureOverrideRemovedAfter` | `subscription.featureOverrideRemoved.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionTemporaryOverridesClearedBefore` | `subscription.temporaryOverridesCleared.before`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.SubscriptionTemporaryOverridesClearedAfter` | `subscription.temporaryOverridesCleared.after`; [SubscriptionMutationHookEvent](#SubscriptionMutationHookEvent). |
| `HookEvents.StripeReceivedBefore` | `stripe.received.before`; [StripeReceivedHookEvent](#StripeReceivedHookEvent). |
| `HookEvents.StripeReceivedAfter` | `stripe.received.after`; [StripeReceivedHookEvent](#StripeReceivedHookEvent). |

</div>
</div>

<div class="data-type" markdown="1">

### HookHandler { #HookHandler }

TypeScript handler: <code>(event: <a href="#HookEventMap">HookEventMap</a>[E]) =&gt; void | Promise&lt;void&gt;</code>. `E` extends [HookEventName](#HookEventName). The library awaits asynchronous handlers. .NET uses the named delegates below.

</div>

<div class="data-type" markdown="1">

### CustomerHookHandler { #CustomerHookHandler }

The .NET delegate receives <code><a href="#CustomerMutationHookEvent">CustomerMutationHookEvent</a></code> and `CancellationToken`, and returns `Task`. TypeScript uses [HookHandler](#HookHandler) with the corresponding event.

</div>

<div class="data-type" markdown="1">

### SubscriptionHookHandler { #SubscriptionHookHandler }

The .NET delegate receives <code><a href="#SubscriptionMutationHookEvent">SubscriptionMutationHookEvent</a></code> and `CancellationToken`, and returns `Task`. TypeScript uses [HookHandler](#HookHandler) with the corresponding event.

</div>

<div class="data-type" markdown="1">

### StripeReceivedHookHandler { #StripeReceivedHookHandler }

The .NET delegate receives <code><a href="#StripeReceivedHookEvent">StripeReceivedHookEvent</a></code> and `CancellationToken`, and returns `Task`. TypeScript uses [HookHandler](#HookHandler) with the corresponding event.

</div>

<div class="data-type" markdown="1">

### AccountingMutationHookEvent { #AccountingMutationHookEvent }

Payload for add-on attachments, usage, and credit changes.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `type` | <code><a href="#HookEventName">HookEventName</a></code> | Yes | Not applicable | Event name from HookEvents. |
| `phase` | <code><a href="#HookPhase">HookPhase</a></code> | Yes | Not applicable | before or after. |
| `source` | <code><a href="#HookSource">HookSource</a></code> | Yes | Not applicable | api, stripe, or system. |
| `occurredAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `input` | <code>Record&lt;string, unknown&gt;</code> | Yes | Not applicable | Operation input with camelCase keys in both libraries. |
| `result` | <code>unknown</code> | No | Not applicable | After-event result; absent before the operation. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Type` | <code>string</code> | Yes | Not applicable | Event name from HookEvents. |
| `Phase` | <code>string</code> | Yes | Not applicable | before or after. |
| `Source` | <code>string</code> | Yes | Not applicable | api, stripe, or system. |
| `OccurredAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `Input` | <code>JsonObject</code> | Yes | Not applicable | Operation input with camelCase keys in both libraries. |
| `Result` | <code>JsonElement?</code> | Yes | Not applicable | After-event result; absent before the operation. |

</div>

</div>

Allowed before-hook input changes are limited to the following fields; changing other fields raises a validation error.

| Event | Editable input fields |
| --- | --- |
| subscription.addonAttached | quantity |
| subscription.addonDetached | None |
| usage.reported | quantity, metadata |
| credit.granted | amount, priority, expiresAt, metadata; scheduled grants permit amount, priority, metadata |
| credit.consumed | units, metadata |
| credit.adjusted | amount, reason |

Accounting after-hook failure raises <code>CommittedOperationHookError</code> in TypeScript or <code>CommittedOperationHookException</code> in .NET. The operation already committed; its `result` / `Result` is available on the error. For idempotent operations, retry the identical request and key to recover the saved result.

<div class="data-type" markdown="1">

### AccountingHookHandler { #AccountingHookHandler }

The .NET delegate receives <code><a href="#AccountingMutationHookEvent">AccountingMutationHookEvent</a></code> and `CancellationToken`, and returns `Task`. TypeScript uses [HookHandler](#HookHandler) with the corresponding event.

</div>

<div class="data-type" markdown="1">

### HookEventMap { #HookEventMap }

TypeScript maps each event name to the payload shown in [HookEventName](#HookEventName). .NET registration delegates select the corresponding payload type.

</div>

<div class="data-type" markdown="1">

### HookSource { #HookSource }

Event origin.

<div class="language-content" data-lang="ts" markdown="1">

| Value | Meaning |
| --- | --- |
| `api` | A public API mutation; accounting hooks currently use this source for scheduled issuance too. |
| `stripe` | A Stripe-driven entity mutation. |
| `system` | A system lifecycle transition. |

</div>
<div class="language-content" data-lang="net" markdown="1">

| Value | Meaning |
| --- | --- |
| `HookSource.Api` | A public API mutation; accounting hooks currently use this source for scheduled issuance too. |
| `HookSource.Stripe` | A Stripe-driven entity mutation. |
| `HookSource.System` | A system lifecycle transition. |

</div>
</div>

<div class="data-type" markdown="1">

### SubscriptionMutationHookEvent { #SubscriptionMutationHookEvent }

Payload for subscription changes.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `type` | <code><a href="#HookEventName">HookEventName</a></code> | Yes | Not applicable | Event name from HookEvents. |
| `phase` | <code><a href="#HookPhase">HookPhase</a></code> | Yes | Not applicable | before or after. |
| `source` | <code><a href="#HookSource">HookSource</a></code> | Yes | Not applicable | api, stripe, or system. |
| `occurredAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `entityId` | <code>number \| null</code> | Yes | Not applicable | Numeric database ID: null before creation, known after creation and on existing records. |
| `customerId` | <code>number \| null \| undefined</code> | No | Not applicable | Owning customer database ID when available. |
| `old` | <code><a href="../subscriptions/#SubscriptionDto">SubscriptionDto</a> \| null</code> | Yes | Not applicable | Previous snapshot; null for creation. |
| `new` | <code><a href="../subscriptions/#SubscriptionDto">SubscriptionDto</a> \| null</code> | Yes | Not applicable | Proposed before snapshot or saved after snapshot; null for deletion. |
| `featureKey` | <code>string \| undefined</code> | No | Not applicable | Feature involved in an override event. |
| `value` | <code>string \| undefined</code> | No | Not applicable | Proposed override value. |
| `overrideType` | <code>string \| undefined</code> | No | Not applicable | permanent, temporary, or timed. |
| `expiresAt` | <code>string \| null \| undefined</code> | No | Not applicable | UTC expiry for a timed override. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Type` | <code>string</code> | Yes | Not applicable | Event name from HookEvents. |
| `Phase` | <code>string</code> | Yes | Not applicable | before or after. |
| `Source` | <code>string</code> | Yes | Not applicable | api, stripe, or system. |
| `OccurredAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `EntityId` | <code>long?</code> | Yes | Not applicable | Numeric database ID: null before creation, known after creation and on existing records. |
| `CustomerId` | <code>long?</code> | Yes | Not applicable | Owning customer database ID when available. |
| `Old` | <code><a href="../subscriptions/#SubscriptionDto">SubscriptionDto</a>?</code> | Yes | Not applicable | Previous snapshot; null for creation. |
| `New` | <code><a href="../subscriptions/#SubscriptionDto">SubscriptionDto</a>?</code> | Yes | Not applicable | Proposed before snapshot or saved after snapshot; null for deletion. |
| `FeatureKey` | <code>string?</code> | Yes | Not applicable | Feature involved in an override event. |
| `Value` | <code>string?</code> | Yes | Not applicable | Proposed override value. |
| `OverrideType` | <code>string?</code> | Yes | Not applicable | permanent, temporary, or timed. |
| `ExpiresAt` | <code>DateTime?</code> | Yes | Not applicable | UTC expiry for a timed override. |

</div>

</div>

<div class="language-content" data-lang="ts" markdown="1">

Before hooks may change `new.expirationDate`, `cancellationDate`, `trialEndDate`, `currentPeriodStart`, `currentPeriodEnd`, `stripeSubscriptionId`, and `metadata`. Creation also permits `key`. Override-add events permit `value`, `overrideType`, and `expiresAt`. Activation and archive flags are not copied from this payload.

</div>
<div class="language-content" data-lang="net" markdown="1">

Before hooks may change `New.ActivationDate`, `ExpirationDate`, `CancellationDate`, `TrialEndDate`, `CurrentPeriodStart`, `CurrentPeriodEnd`, `StripeSubscriptionId`, `Metadata`, and `IsArchived`; archive/unarchive operations enforce their own final archive flag. Creation also permits `Key`. Override-add events permit `Value`, `OverrideType`, and `ExpiresAt`.

</div>

<div class="data-type" markdown="1">

### HookPhase { #HookPhase }

Event phase.

<div class="language-content" data-lang="ts" markdown="1">

| Value | Meaning |
| --- | --- |
| `before` | Before the operation saves or processes data. |
| `after` | After the operation saves or finishes processing. |

</div>
<div class="language-content" data-lang="net" markdown="1">

| Value | Meaning |
| --- | --- |
| `HookPhase.Before` | Before the operation saves or processes data. |
| `HookPhase.After` | After the operation saves or finishes processing. |

</div>
</div>

<div class="data-type" markdown="1">

### CustomerMutationHookEvent { #CustomerMutationHookEvent }

Payload for customer changes.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `type` | <code><a href="#HookEventName">HookEventName</a></code> | Yes | Not applicable | Event name from HookEvents. |
| `phase` | <code><a href="#HookPhase">HookPhase</a></code> | Yes | Not applicable | before or after. |
| `source` | <code><a href="#HookSource">HookSource</a></code> | Yes | Not applicable | api, stripe, or system. |
| `occurredAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `entityId` | <code>number \| null</code> | Yes | Not applicable | Numeric database ID: null before creation, known after creation and on existing records. |
| `customerId` | <code>number \| null \| undefined</code> | No | Not applicable | Inherited optional field; customer events do not populate it. |
| `old` | <code><a href="../customers/#CustomerDto">CustomerDto</a> \| null</code> | Yes | Not applicable | Previous snapshot; null for creation. |
| `new` | <code><a href="../customers/#CustomerDto">CustomerDto</a> \| null</code> | Yes | Not applicable | Proposed before snapshot or saved after snapshot; null for deletion. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Type` | <code>string</code> | Yes | Not applicable | Event name from HookEvents. |
| `Phase` | <code>string</code> | Yes | Not applicable | before or after. |
| `Source` | <code>string</code> | Yes | Not applicable | api, stripe, or system. |
| `OccurredAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `EntityId` | <code>long?</code> | Yes | Not applicable | Numeric database ID: null before creation, known after creation and on existing records. |
| `Old` | <code><a href="../customers/#CustomerDto">CustomerDto</a>?</code> | Yes | Not applicable | Previous snapshot; null for creation. |
| `New` | <code><a href="../customers/#CustomerDto">CustomerDto</a>?</code> | Yes | Not applicable | Proposed before snapshot or saved after snapshot; null for deletion. |

</div>

</div>

<div class="language-content" data-lang="ts" markdown="1">

Before hooks may change `new.displayName`, `email`, `externalBillingId`, and `metadata`; `key` may change only during creation. Status changes are controlled by the operation.

</div>
<div class="language-content" data-lang="net" markdown="1">

Before hooks may change `New.DisplayName`, `Email`, `ExternalBillingId`, and `Metadata`; `Key` may change only during creation. Status changes are controlled by the operation.

</div>

<div class="data-type" markdown="1">

### StripeReceivedHookEvent { #StripeReceivedHookEvent }

Payload for Stripe intake.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `type` | <code><a href="#HookEventName">HookEventName</a></code> | Yes | Not applicable | Event name from HookEvents. |
| `phase` | <code><a href="#HookPhase">HookPhase</a></code> | Yes | Not applicable | before or after. |
| `occurredAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `data` | <code>Stripe.Event</code> | Yes | Not applicable | Snapshot of the parsed provider event. |
| `stripeCustomerId` | <code>string \| undefined</code> | No | Not applicable | Provider customer ID when extractable. |
| `stripeSubscriptionId` | <code>string \| undefined</code> | No | Not applicable | Provider subscription ID when extractable. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Type` | <code>string</code> | Yes | Not applicable | Event name from HookEvents. |
| `Phase` | <code>string</code> | Yes | Not applicable | before or after. |
| `OccurredAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `Data` | <code>Stripe.Event</code> | Yes | Not applicable | Snapshot of the parsed provider event. |
| `StripeCustomerId` | <code>string?</code> | Yes | Not applicable | Provider customer ID when extractable. |
| `StripeSubscriptionId` | <code>string?</code> | Yes | Not applicable | Provider subscription ID when extractable. |

</div>

</div>

## Related guides

- [Extending Subscrio](how-to-extend.md): integration and audit patterns.
- [Customers](customers.md): customer mutations.
- [Subscriptions](subscriptions.md): lifecycle and override mutations.
- [Stripe Integration](stripe-integration.md): provider event processing.
- [Credits](credits.md): transactional accounting and retries.
