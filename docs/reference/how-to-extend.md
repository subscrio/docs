---
title: Extending Subscrio
description: Use hooks and the audit-log and payments extensions around library operations.
---

# Extending Subscrio

Hooks let application code validate proposed changes and react after an operation. Software extensions package those handlers and, when needed, their own storage. They are separate from subscription add-ons.

<span id="1-what-you-can-extend"></span>
<span id="2-inline-extension"></span>
<span id="3-first-party-audit-log-extension"></span>
<span id="31-first-party-payments-extension"></span>
<span id="4-distributable-extension-pattern"></span>
<span id="package-setup"></span>
<span id="register-function"></span>
<span id="consumer-install-and-usage"></span>
<span id="conventions"></span>
<span id="5-custom-sink-example"></span>
<span id="sink-interface"></span>
<span id="in-memory-sink-tests-demos"></span>
<span id="inline-app-usage"></span>
<span id="packaged-usage"></span>
<span id="phase-trade-offs"></span>
<span id="related"></span>
<span id="accounting-extension-boundary"></span>

## Choose a hook

| Event family | Available operations |
| --- | --- |
| Customer | Create, update, archive, restore, delete. |
| Subscription | Create, update, archive, restore, delete, overrides, temporary-override clearing. |
| Add-on attachment | Attach or detach a subscription package. |
| Accounting | Report usage, grant credits, consume credits, adjust credits. |
| Stripe intake | Before and after processing a parsed event. |

Each has before and after events. There are no general catalog-mutation hooks for creating products, plans, or features. See [Hooks](hooks.md) for the complete names and payloads.

Handlers run in registration order. A thrown error stops later handlers. Before handlers can reject an operation and may change only the fields supported by that event. Editing an after snapshot does not save it. Accounting payloads use input/result fields; customer and subscription payloads use old/new snapshots.

## Register application behavior

This handler rejects a customer update using a blocked email domain. It uses the initialized instance from [Getting Started](getting-started.md).

<div class="language-content" data-lang="ts" markdown="1">

```typescript
import { HookEvents } from 'subscrio';

const unsubscribe = subscrio.hooks.on(HookEvents.CustomerUpdatedBefore, event => {
  if (event.new?.email?.endsWith('@blocked.test')) {
    throw new Error('Customer email domain is not allowed');
  }
});
// Keep the handler registered while processing application requests.
// Call this during shutdown or when removing the extension:
unsubscribe();
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
var unsubscribe = subscrio.Hooks.OnCustomerUpdatedBefore((evt, cancellationToken) =>
{
    if (evt.New?.Email?.EndsWith("@blocked.test") == true)
        throw new InvalidOperationException("Customer email domain is not allowed");
    return Task.CompletedTask;
});
// Keep the handler registered while processing application requests.
// Call this during shutdown or when removing the extension:
unsubscribe();
```

</div>

Register handlers once for each instance that processes operations. TypeScript returns an unsubscribe function from `on`; .NET returns an `Action` from its named registration methods. Unsubscribe when an extension is disposed. Avoid calling the same mutation recursively from its own handler.

## Understand failure after commit

An after-handler failure propagates to the caller after the underlying change has saved. It does not undo that change. Accounting operations report this with `CommittedOperationHookError` / `CommittedOperationHookException`, including the committed result. Repeating an idempotent request recovers the receipt but does not replay its after hooks.

External notifications and extension inserts are not part of the core transaction. If delivery must be reliable, give your application a durable retry and reconciliation workflow. An audit sink outage must not be mistaken for proof that the subscription or debit failed.

## Store audit records

The audit extension records after events in `subscrio.transaction_logs`, including usage, credits, add-on attachments, and the existing customer/subscription events. It stores accounting input/result information separately from the core ledger.

| Language | Package |
| --- | --- |
| TypeScript | `subscrio-audit-log` |
| .NET | `Subscrio.AuditLog` |

Both implementations use PostgreSQL. Use the same PostgreSQL database as core; these extensions do not add SQL Server support. Install the core schema before the extension schema, and finish extension setup before accepting mutations.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
import { createAuditLog } from 'subscrio-audit-log';

const audit = createAuditLog(subscrio, {
  database: { connectionString: process.env.DATABASE_URL! }
});
try {
  await audit.installSchema();
  await subscrio.customers.updateCustomer('acme', { displayName: 'Acme Ltd' });
  const page = await audit.list({ customerKey: 'acme', limit: 20 });
  console.log(page.total);
} finally {
  await audit.dispose();
}
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.AuditLog;
using Subscrio.AuditLog.DTOs;

await using var audit = subscrio.UseAuditLog(new AuditLogOptions
{
    ConnectionString = Environment.GetEnvironmentVariable("DATABASE_URL")!
});
await audit.InstallSchemaAsync();
await subscrio.Customers.UpdateCustomerAsync("acme", new UpdateCustomerDto(DisplayName: "Acme Ltd"));
var page = await audit.ListAsync(new TransactionLogFilters { CustomerKey = "acme", Limit = 20 });
Console.WriteLine(page.Total);
```

</div>

Keep the audit object alive for the application lifetime that should be observed. The example disposes it after one operation. Install with `npm install subscrio-audit-log` or `dotnet add package Subscrio.AuditLog`.

## Track successful Stripe invoices

The payments extension records `invoice.payment_succeeded` after Stripe processing. It requires a mapped local subscription; unrelated events and invoices that cannot be mapped are skipped. A unique invoice ID prevents duplicate payment rows. It records the provider's paid amount and currency; it does not collect payments, attach packages, or grant credits.

<div class="language-content" data-lang="ts" markdown="1">

```typescript
import { createPaymentTracker } from 'subscrio-payments';

const payments = createPaymentTracker(subscrio, {
  database: { connectionString: process.env.DATABASE_URL! }
});
try {
  await payments.installSchema();
  // In a server, keep this tracker alive while handling verified Stripe events.
  const page = await payments.list({ limit: 20 });
  console.log(page.total);
} finally {
  await payments.dispose();
}
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Payments;
using Subscrio.Payments.DTOs;

await using var payments = subscrio.UsePayments(new PaymentTrackerOptions
{
    ConnectionString = Environment.GetEnvironmentVariable("DATABASE_URL")!
});
await payments.InstallSchemaAsync();
// In a server, keep this tracker alive while handling verified Stripe events.
var page = await payments.ListAsync(new PaymentFilters { Limit = 20 });
Console.WriteLine(page.Total);
```

</div>

Install with `npm install subscrio-payments` or `dotnet add package Subscrio.Payments`. Like the audit extension, both implementations use PostgreSQL and expose separate schema installation, verification, migration, listing, and disposal methods. Construction registers handlers; it does not install tables.

## Package your own extension

Accept a Subscrio instance and explicit options. Register supported hooks, retain their unsubscribe callbacks, and release owned resources on disposal. Declare the compatible core package as a dependency, expose any storage setup explicitly, and document whether a failure can block a mutation or occur after commit.

Use [Stripe Setup](how-to-integrate-with-stripe.md) for signature verification and event delivery. Consult the extension source and package documentation for query filters and stored columns.
