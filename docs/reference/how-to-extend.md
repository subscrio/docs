---
title: How to extend
description: Add behavior around Subscrio writes with inline hook handlers, first-party audit-log and payments packages, or your own extension.
---

# How to Extend Subscrio

Use [hooks](./hooks.md) to add behavior around customer and subscription mutations without forking Subscrio. This page covers inline handlers, the first-party audit-log and payments packages, and how to package your own extension.

## 1. What You Can Extend

You can subscribe to before/after pairs for:

- Customer lifecycle: `customer.created.*`, `customer.updated.*`, `customer.archived.*`, `customer.unarchived.*`, `customer.deleted.*`
- Subscription lifecycle: create/update/archive/unarchive/delete, feature override changes, temporary override clears
- Inbound Stripe: `stripe.received.before` (verified event, before Subscrio processes it) and `stripe.received.after` (after processing completes)

`*.before` runs before persistence and may mutate `new` or abort by throwing. `*.after` runs after a successful write; throwing does not roll back the row. `source` tells you whether the write came from the public API (`api`), Stripe sync (`stripe`), or an internal job such as expired transitions (`system`).

## 2. Inline Extension

Register handlers on a `Subscrio` instance for app-local behavior.

=== "TypeScript"
    ```typescript
    import { Subscrio, HookEvents } from 'subscrio';

    const subscrio = new Subscrio({
      database: { connectionString: process.env.DATABASE_URL! },
    });

    subscrio.hooks.on(HookEvents.CustomerCreatedBefore, async ({ new: customer, source }) => {
      console.log('customer creating', customer?.key, source);
    });

    subscrio.hooks.on(HookEvents.CustomerCreatedAfter, async ({ entityId, new: customer }) => {
      console.log('customer created', entityId, customer?.key);
    });
    ```

=== ".NET"
    ```csharp
    using Subscrio.Core;
    using Subscrio.Core.Application.Hooks;

    var subscrio = new Subscrio(config);

    subscrio.Hooks.OnCustomerCreatedBefore(async (evt, ct) =>
    {
        Console.WriteLine($"customer creating {evt.New?.Key} {evt.Source}");
    });

    subscrio.Hooks.OnCustomerCreatedAfter(async (evt, ct) =>
    {
        Console.WriteLine($"customer created {evt.EntityId} {evt.New?.Key}");
    });
    ```

Throw from a **before** handler to abort the mutation. Prefer fast, reliable handlers; do heavy work asynchronously only if you accept eventual consistency.

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

## 3. First-Party Audit Log Extension

Subscrio ships installable audit packages that register `*.after` hooks and store rows in Postgres (`subscrio.transaction_logs`). Schema is created only when you initialize the extension.

| Language | Package | Location |
| --- | --- | --- |
| TypeScript | `subscrio-audit-log` | [`subscrio-extensions-audit-log`](https://github.com/subscrio/subscrio-extensions-audit-log/blob/main/typescript/README.md) |
| .NET | `Subscrio.AuditLog` | [`subscrio-extensions-audit-log`](https://github.com/subscrio/subscrio-extensions-audit-log/blob/main/dotnet/README.md) |

=== "TypeScript"
    ```bash
    npm install subscrio-audit-log
    ```

    ```typescript
    import { Subscrio } from 'subscrio';
    import { createAuditLog } from 'subscrio-audit-log';

    const subscrio = new Subscrio({ database: { connectionString } });
    await subscrio.installSchema();

    const audit = createAuditLog(subscrio, { database: { connectionString } });
    await audit.installSchema();

    const { data, total } = await audit.list({ customerKey: 'acme', limit: 50 });
    await audit.dispose();
    ```

=== ".NET"
    ```bash
    dotnet add package Subscrio.AuditLog
    ```

    ```csharp
    using Subscrio.AuditLog;
    using Subscrio.AuditLog.DTOs;

    await using var audit = subscrio.UseAuditLog(new AuditLogOptions
    {
        ConnectionString = connectionString,
    });
    await audit.InstallSchemaAsync();

    var page = await audit.ListAsync(new TransactionLogFilters { CustomerKey = "acme", Limit = 50 });
    ```

See each package README for schema columns, filters, nullable FKs, and after-hook failure semantics.

## 3.1 First-Party Payments Extension

Subscrio ships installable payments packages that register `stripe.received.after` and store a row in Postgres (`subscrio.payments`) for each `invoice.payment_succeeded` event. Schema is created only when you initialize the extension.

| Language | Package | Location |
| --- | --- | --- |
| TypeScript | `subscrio-payments` | [`subscrio-extensions-payments`](https://github.com/subscrio/subscrio-extensions-payments/blob/main/typescript/README.md) |
| .NET | `Subscrio.Payments` | [`subscrio-extensions-payments`](https://github.com/subscrio/subscrio-extensions-payments/blob/main/dotnet/README.md) |

=== "TypeScript"
    ```bash
    npm install subscrio-payments
    ```

    ```typescript
    import { Subscrio } from 'subscrio';
    import { createPaymentTracker } from 'subscrio-payments';

    const subscrio = new Subscrio({ database: { connectionString } });
    await subscrio.installSchema();

    const payments = createPaymentTracker(subscrio, { database: { connectionString } });
    await payments.installSchema();

    const { data, total } = await payments.list({ customerId: 1, limit: 50 });
    await payments.dispose();
    ```

=== ".NET"
    ```bash
    dotnet add package Subscrio.Payments
    ```

    ```csharp
    using Subscrio.Payments;
    using Subscrio.Payments.DTOs;

    await using var payments = subscrio.UsePayments(new PaymentTrackerOptions
    {
        ConnectionString = connectionString,
    });
    await payments.InstallSchemaAsync();

    var page = await payments.ListAsync(new PaymentFilters { CustomerId = 1, Limit = 50 });
    ```

See each package README for columns (`amount_paid`, billing-cycle duration, Stripe invoice id), idempotency, and after-hook failure semantics.

## 4. Distributable Extension Pattern

Ship your own reusable package that only registers hooks. Do not replace Subscrio services or fork the library. For Postgres audit storage, prefer the first-party packages in section 3.

### Package Setup

=== "TypeScript"
    1. Create an npm package (e.g. `@acme/subscrio-my-extension`).
    2. Peer-depend on `subscrio`.
    3. Export a register function that calls `subscrio.hooks.on(...)`.

=== ".NET"
    1. Create a NuGet class library (e.g. `Acme.Subscrio.MyExtension`).
    2. Depend on `Subscrio.Core`.
    3. Export an extension method that calls `subscrio.Hooks.On*(...)`.

### Register Function

=== "TypeScript"
    ```typescript
    import type { Subscrio } from 'subscrio';
    import { HookEvents } from 'subscrio';

    export interface AuditLogOptions {
      sink: AuditLogSink;
    }

    export function registerAuditLog(subscrio: Subscrio, options: AuditLogOptions): () => void {
      const unsubs = [
        subscrio.hooks.on(HookEvents.CustomerCreatedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.CustomerUpdatedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.CustomerArchivedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.CustomerUnarchivedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.CustomerDeletedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.SubscriptionCreatedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.SubscriptionUpdatedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.SubscriptionArchivedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.SubscriptionUnarchivedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.SubscriptionDeletedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.SubscriptionFeatureOverrideAddedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.SubscriptionFeatureOverrideRemovedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.SubscriptionTemporaryOverridesClearedAfter, (e) => options.sink.write(e)),
        subscrio.hooks.on(HookEvents.StripeReceivedAfter, (e) => options.sink.writeStripe(e)),
      ];
      return () => unsubs.forEach((off) => off());
    }
    ```

=== ".NET"
    ```csharp
    using Subscrio.Core;
    using Subscrio.Core.Application.Hooks;

    public static class AuditLogExtensions
    {
        public static IDisposable UseCustomAuditLog(this Subscrio subscrio, AuditLogOptions options)
        {
            var offs = new List<Action>
            {
                subscrio.Hooks.OnCustomerCreatedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnCustomerUpdatedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnCustomerArchivedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnCustomerUnarchivedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnCustomerDeletedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnSubscriptionCreatedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnSubscriptionUpdatedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnSubscriptionArchivedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnSubscriptionUnarchivedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnSubscriptionDeletedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnSubscriptionFeatureOverrideAddedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnSubscriptionFeatureOverrideRemovedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnSubscriptionTemporaryOverridesClearedAfter((e, ct) => options.Sink.WriteAsync(e, ct)),
                subscrio.Hooks.OnStripeReceivedAfter((e, ct) => options.Sink.WriteStripeAsync(e, ct)),
            };
            return new DelegateDisposable(() => offs.ForEach(off => off()));
        }
    }
    ```

### Consumer Install and Usage

=== "TypeScript"
    ```bash
    npm install @acme/subscrio-my-extension
    ```

    ```typescript
    import { Subscrio } from 'subscrio';
    import { registerAuditLog } from '@acme/subscrio-my-extension';

    const subscrio = new Subscrio({ database: { connectionString } });
    registerAuditLog(subscrio, { sink: mySink });
    ```

=== ".NET"
    ```bash
    dotnet add package Acme.Subscrio.MyExtension
    ```

    ```csharp
    using Acme.Subscrio.MyExtension;

    using var audit = subscrio.UseCustomAuditLog(new AuditLogOptions { Sink = mySink });
    ```

### Conventions

- Register hooks only; do not replace repositories or services.
- Accept options for storage/sink configuration.
- Prefer `*.after` for audit so rows reflect committed state (including `entityId`).
- If you register `*.before` and fail-fast, document that a sink outage blocks mutations.
- If the extension owns storage, manage schema like core (`installSchema` / `verifySchema` / `migrate`) and only when the consumer initializes the extension.

## 5. Custom Sink Example

Goal: append one record per committed mutation (and one per processed Stripe event) with `type`, `source`, `occurredAt`, `entityId` when present, and full `old` / `new` JSON. For the first-party Postgres implementation, use section 3.

### Sink Interface

=== "TypeScript"
    ```typescript
    export interface AuditLogRecord {
      type: string;
      source?: string;
      occurredAt: string;
      entityId?: number | null;
      old: unknown | null;
      new: unknown | null;
      stripeEvent?: unknown;
    }

    export interface AuditLogSink {
      write(event: {
        type: string;
        source: string;
        occurredAt: string;
        entityId: number | null;
        old: unknown | null;
        new: unknown | null;
      }): Promise<void>;
      writeStripe(event: {
        type: string;
        occurredAt: string;
        data: unknown;
      }): Promise<void>;
    }
    ```

=== ".NET"
    ```csharp
    public sealed record AuditLogRecord(
        string Type,
        string? Source,
        string OccurredAt,
        long? EntityId,
        object? Old,
        object? New,
        object? StripeEvent = null
    );

    public interface IAuditLogSink
    {
        Task WriteAsync(CustomerMutationHookEvent evt, CancellationToken cancellationToken = default);
        Task WriteAsync(SubscriptionMutationHookEvent evt, CancellationToken cancellationToken = default);
        Task WriteStripeAsync(StripeReceivedHookEvent evt, CancellationToken cancellationToken = default);
    }
    ```

### In-Memory Sink (Tests / Demos)

=== "TypeScript"
    ```typescript
    export class MemoryAuditSink implements AuditLogSink {
      readonly records: AuditLogRecord[] = [];

      async write(event) {
        this.records.push({ ...event });
      }

      async writeStripe(event) {
        this.records.push({
          type: event.type,
          occurredAt: event.occurredAt,
          old: null,
          new: null,
          stripeEvent: event.data,
        });
      }
    }
    ```

=== ".NET"
    ```csharp
    public sealed class MemoryAuditSink : IAuditLogSink
    {
        public List<AuditLogRecord> Records { get; } = new();

        public Task WriteAsync(CustomerMutationHookEvent evt, CancellationToken cancellationToken = default)
        {
            Records.Add(new AuditLogRecord(evt.Type, evt.Source, evt.OccurredAt, evt.EntityId, evt.Old, evt.New));
            return Task.CompletedTask;
        }

        public Task WriteAsync(SubscriptionMutationHookEvent evt, CancellationToken cancellationToken = default)
        {
            Records.Add(new AuditLogRecord(evt.Type, evt.Source, evt.OccurredAt, evt.EntityId, evt.Old, evt.New));
            return Task.CompletedTask;
        }

        public Task WriteStripeAsync(StripeReceivedHookEvent evt, CancellationToken cancellationToken = default)
        {
            Records.Add(new AuditLogRecord(evt.Type, null, evt.OccurredAt, null, null, null, evt.Data));
            return Task.CompletedTask;
        }
    }
    ```

### Inline App Usage

=== "TypeScript"
    ```typescript
    const sink = new MemoryAuditSink(); // or Postgres/file/queue sink

    subscrio.hooks.on(HookEvents.CustomerUpdatedAfter, async (e) => {
      await sink.write(e);
    });

    subscrio.hooks.on(HookEvents.StripeReceivedAfter, async (e) => {
      await sink.writeStripe(e);
    });
    ```

=== ".NET"
    ```csharp
    var sink = new MemoryAuditSink(); // or Postgres/file/queue sink

    subscrio.Hooks.OnCustomerUpdatedAfter(async (e, ct) =>
    {
        await sink.WriteAsync(e, ct);
    });

    subscrio.Hooks.OnStripeReceivedAfter(async (e, ct) =>
    {
        await sink.WriteStripeAsync(e, ct);
    });
    ```

### Packaged Usage

=== "TypeScript"
    ```typescript
    // Custom sink-based extension
    registerAuditLog(subscrio, { sink });

    // Or first-party Postgres package (section 3)
    // const audit = createAuditLog(subscrio, { database: { connectionString } });
    ```

=== ".NET"
    ```csharp
    // Custom sink-based extension
    subscrio.UseCustomAuditLog(new AuditLogOptions { Sink = sink });

    // Or first-party Postgres package (section 3)
    // await using var audit = subscrio.UseAuditLog(new AuditLogOptions { ConnectionString = cs });
    ```

### Phase Trade-Offs

- **`*.after` (recommended for audit):** Record reflects committed data and includes `entityId`. If the after-handler throws, the row remains; the API call still fails.
- **`*.before`:** Useful for validation and enrichment. An audit row can be written even if the later database write fails. Compensating strategies:
  - Use the same DB transaction only if your sink shares the Subscrio connection (advanced; not provided by Subscrio).
  - Treat audit as best-effort and reconcile from `old`/`new` plus application logs.
  - Prefer fail-fast handlers so a sink outage blocks mutations until audit is healthy.

## Related

- [Hooks API reference](./hooks.md)
- TypeScript audit package: [`subscrio-extensions-audit-log`](https://github.com/subscrio/subscrio-extensions-audit-log/blob/main/typescript/README.md)
- .NET audit package: [`subscrio-extensions-audit-log`](https://github.com/subscrio/subscrio-extensions-audit-log/blob/main/dotnet/README.md)
- TypeScript payments package: [`subscrio-extensions-payments`](https://github.com/subscrio/subscrio-extensions-payments/blob/main/typescript/README.md)
- .NET payments package: [`subscrio-extensions-payments`](https://github.com/subscrio/subscrio-extensions-payments/blob/main/dotnet/README.md)
- [Customers](./customers.md)
- [Subscriptions](./subscriptions.md)
- [Stripe Integration](./stripe-integration.md)
