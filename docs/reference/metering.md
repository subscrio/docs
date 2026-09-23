---
title: Metered Usage
description: Read metered allowance, report usage, and inspect accepted events.
reference_format: true
---

# Metered Usage

## Purpose

<span id="configure-a-metered-feature" class="compatibility-anchor"></span>

Metered Usage tracks consumption of metered features. Configure reset periods, enforcement, aggregation, and whether usage is shared by a customer or tracked per subscription on the [feature](features.md#MeteredFeatureConfigDto).

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const metering = subscrio.metering;
```

</div>
<div class="language-content" data-lang="net" markdown="1">

```csharp
var metering = subscrio.Metering;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`getUsage`](#getusage) | Reads allowance and checks a proposed amount. |
| [`reportUsage`](#reportusage) | Atomically records accepted usage. |
| [`listUsageEvents`](#listusageevents) | Lists accepted usage-event snapshots. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`GetUsageAsync`](#getusage) | Reads allowance and checks a proposed amount. |
| [`ReportUsageAsync`](#reportusage) | Atomically records accepted usage. |
| [`ListUsageEventsAsync`](#listusageevents) | Lists accepted usage-event snapshots. |

</div>

## Method details

<div class="method-entry" markdown="1">

### getUsage { #getusage data-method-ts="getUsage" data-method-net="GetUsageAsync" }

<span id="description" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="input-properties" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="return-properties" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="input-properties_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="return-properties_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>

Read the current period's allowance and consumption, and check a proposed amount without recording it. The result can change before a later write; reporting usage performs the authoritative limit check.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getUsage(customerKey: string, productKey: string, featureKey: string, options?: UsageOptions): Promise<UsageDto>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Associated metered feature key.
- `options`: Optional [UsageOptions](#UsageOptions); checks one unit by default.

**Returns** <code><a href="#UsageDto">UsageDto</a></code>: Current balance, projected consumption, and access decision.

**Example**

```typescript
// api-calls is customer-scoped and associated with saas.
const usage = await subscrio.metering.getUsage('acme', 'saas', 'api-calls', {
  requestedUsage: 5
});
console.log(usage.hasAccess, usage.remaining);
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `NotFoundError`: The customer, associated metered feature, or matching subscription is missing.
- `ValidationError`: The amount, usage scope, or resolved limit is invalid.
- `MeteringPeriodError`: A billing-period reset has missing or stale subscription period dates.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<UsageDto> GetUsageAsync(string customerKey, string productKey, string featureKey, UsageOptions? options)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Associated metered feature key.
- `options`: Optional [UsageOptions](#UsageOptions); checks one unit by default.

**Returns** <code><a href="#UsageDto">UsageDto</a></code>: Current balance, projected consumption, and access decision.

**Example**

```csharp
// api-calls is customer-scoped and associated with saas.
var usage = await subscrio.Metering.GetUsageAsync("acme", "saas", "api-calls",
    new UsageOptions(RequestedUsage: 5));
Console.WriteLine($"Allowed: {usage.HasAccess}, remaining: {usage.Remaining}");
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `NotFoundException`: The customer, associated metered feature, or matching subscription is missing.
- `ValidationException`: The amount, usage scope, or resolved limit is invalid.
- `MeteringPeriodException`: A billing-period reset has missing or stale subscription period dates.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### reportUsage { #reportusage data-method-ts="reportUsage" data-method-net="ReportUsageAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="input-properties_2" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="return-properties_2" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="input-properties_3" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="return-properties_3" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>

Record consumption and an event in one transaction. Hard enforcement rejects amounts above the limit; soft enforcement records the overage. Both require an eligible, unarchived subscription. Count aggregation accepts exactly one unit per report.

Retry the same customer-scoped idempotency key with the identical request to receive the original snapshot without charging again, even in a later period. Changing the request under that key fails. Denied attempts create no usage event. Before-hooks run within the transaction; after-hooks run after commit and are not replayed.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
reportUsage(customerKey: string, productKey: string, featureKey: string, quantity: number, options: UsageReportOptions): Promise<UsageReportDto>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Associated metered feature key.
- `quantity`: Positive integer, at most 9,007,199,254,740,991. Count aggregation requires 1.
- `options`: [UsageReportOptions](#UsageReportOptions), including a stable idempotency key.

**Returns** <code><a href="#UsageReportDto">UsageReportDto</a></code>: Accepted event and post-write usage snapshot; a retry returns the original result.

**Example**

```typescript
// acme has an eligible subscription; api-calls uses customer scope and count aggregation.
const report = await subscrio.metering.reportUsage('acme', 'saas', 'api-calls', 1, {
  idempotencyKey: 'request-123'
});
console.log(report.usage.consumed);
```

<details class="method-errors" markdown="1">
<summary>Errors (5)</summary>

- `NotFoundError`: The customer, associated metered feature, or matching subscription is missing.
- `ValidationError`: The amount, usage scope, or resolved limit is invalid.
- `MeteringPeriodError`: A billing-period reset has missing or stale subscription period dates.
- `IdempotencyConflictError`: The key was used for a different request.
- `UsageLimitExceededError`: The hard limit would be exceeded or no eligible subscription exists; the error includes the usage decision.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<UsageReportDto> ReportUsageAsync(string customerKey, string productKey, string featureKey, long quantity, UsageReportOptions options)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Associated metered feature key.
- `quantity`: Positive integer, at most 9,007,199,254,740,991. Count aggregation requires 1.
- `options`: [UsageReportOptions](#UsageReportOptions), including a stable idempotency key.

**Returns** <code><a href="#UsageReportDto">UsageReportDto</a></code>: Accepted event and post-write usage snapshot; a retry returns the original result.

**Example**

```csharp
// acme has an eligible subscription; api-calls uses customer scope and count aggregation.
var report = await subscrio.Metering.ReportUsageAsync("acme", "saas", "api-calls", 1,
    new UsageReportOptions(IdempotencyKey: "request-123"));
Console.WriteLine(report.Usage.Consumed);
```

<details class="method-errors" markdown="1">
<summary>Errors (5)</summary>

- `NotFoundException`: The customer, associated metered feature, or matching subscription is missing.
- `ValidationException`: The amount, usage scope, or resolved limit is invalid.
- `MeteringPeriodException`: A billing-period reset has missing or stale subscription period dates.
- `IdempotencyConflictException`: The key was used for a different request.
- `UsageLimitExceededException`: The hard limit would be exceeded or no eligible subscription exists; the error includes the usage decision.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### listUsageEvents { #listusageevents data-method-ts="listUsageEvents" data-method-net="ListUsageEventsAsync" }

<span id="description_2" class="compatibility-anchor"></span>
<span id="signature_4" class="compatibility-anchor"></span>
<span id="inputs_4" class="compatibility-anchor"></span>
<span id="input-properties_4" class="compatibility-anchor"></span>
<span id="returns_4" class="compatibility-anchor"></span>
<span id="return-properties_4" class="compatibility-anchor"></span>
<span id="example_4" class="compatibility-anchor"></span>
<span id="signature_5" class="compatibility-anchor"></span>
<span id="inputs_5" class="compatibility-anchor"></span>
<span id="returns_5" class="compatibility-anchor"></span>
<span id="return-properties_5" class="compatibility-anchor"></span>
<span id="example_5" class="compatibility-anchor"></span>
<span id="expected-results_2" class="compatibility-anchor"></span>
<span id="potential-errors_2" class="compatibility-anchor"></span>

List accepted event snapshots, newest first with event ID as a tie-breaker. These are the saved post-write results, not recalculated current balances. Date filters include the lower bound and exclude the upper bound.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listUsageEvents(customerKey: string, productKey: string, featureKey: string, filter?: UsageHistoryFilter): Promise<UsageReportDto[]>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Associated metered feature key.
- `filter`: Optional [UsageHistoryFilter](#UsageHistoryFilter). Defaults to 50 events at offset zero.

**Returns** <code><a href="#UsageReportDto">UsageReportDto</a>[]</code>: Saved event snapshots, or an empty collection when none match.

**Example**

```typescript
const events = await subscrio.metering.listUsageEvents('acme', 'saas', 'api-calls', {
  limit: 20, offset: 0
});
console.log(events);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: Pagination is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<UsageReportDto>> ListUsageEventsAsync(string customerKey, string productKey, string featureKey, int limit, int offset, string? subscriptionKey, DateTime? from, DateTime? to)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `productKey`: Product key.
- `featureKey`: Associated metered feature key.
- `limit`: Optional page size, 1 to 500; defaults to 50.
- `offset`: Optional nonnegative rows to skip; defaults to 0.
- `subscriptionKey`: Optional subscription filter; null includes all subscriptions and customer-scoped events.
- `from`, `to`: Optional UTC event-time bounds; default null.

**Returns** <code>List&lt;<a href="#UsageReportDto">UsageReportDto</a>&gt;</code>: Saved event snapshots, or an empty collection when none match.

**Example**

```csharp
var events = await subscrio.Metering.ListUsageEventsAsync(
    "acme", "saas", "api-calls", limit: 20);
Console.WriteLine(events.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: Pagination is invalid.

</details>

</div>

</div>

## Data types

All amounts are integers within the shared safe range, 0 to 9,007,199,254,740,991, unless a parameter requires a positive amount. Required means supplied input or a guaranteed output property. Metering configuration is documented on [Features](features.md#MeteredFeatureConfigDto).

<div class="data-type" markdown="1">

### UsageOptions { #UsageOptions }

Options for a read-only allowance check.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `subscriptionKey` | <code>string \| undefined</code> | No | None | Required for subscription-scoped usage; omit for customer-scoped usage. |
| `requestedUsage` | <code>number \| undefined</code> | No | 1 | Nonnegative proposed amount; zero reads the balance without projecting additional usage. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `SubscriptionKey` | <code>string?</code> | No | null | Required for subscription-scoped usage; omit for customer-scoped usage. |
| `RequestedUsage` | <code>long</code> | No | 1 | Nonnegative proposed amount; zero reads the balance without projecting additional usage. |

</div>

</div>

<div class="data-type" markdown="1">

### UsageDto { #UsageDto }

Current or saved period balance and access decision.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `hasAccess` | <code>boolean</code> | Yes | Not applicable | True when an eligible subscription exists and enforcement permits the requested amount. |
| `limit` | <code>number</code> | Yes | Not applicable | Resolved feature allowance for this period. |
| `consumed` | <code>number</code> | Yes | Not applicable | Amount already recorded. |
| `remaining` | <code>number</code> | Yes | Not applicable | Allowance minus consumption, clamped to zero. |
| `requestedUsage` | <code>number</code> | Yes | Not applicable | Amount checked; zero in a report result. |
| `projectedConsumed` | <code>number</code> | Yes | Not applicable | Consumption plus requested usage. |
| `isOverage` | <code>boolean</code> | Yes | Not applicable | True when projected consumption exceeds the limit. |
| `enforcement` | <code>&quot;hard&quot; \| &quot;soft&quot;</code> | Yes | Not applicable | hard rejects overage; soft permits it. |
| `usageScope` | <code>&quot;customer&quot; \| &quot;subscription&quot;</code> | Yes | Not applicable | customer shares a balance across the product; subscription tracks each subscription separately. |
| `subscriptionKey` | <code>string \| undefined</code> | No | Not applicable | Subscription key for subscription-scoped usage; omitted or null otherwise. |
| `periodStart` | <code>string</code> | Yes | Not applicable | Inclusive UTC start of the usage period. |
| `periodEnd` | <code>string</code> | Yes | Not applicable | Exclusive UTC end of the usage period. |
| `accessDeniedReason` | <code>&quot;limit_exceeded&quot; \| &quot;no_active_subscription&quot; \| undefined</code> | No | Not applicable | limit_exceeded or no_active_subscription when access is denied; otherwise absent or null. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `HasAccess` | <code>bool</code> | Yes | Not applicable | True when an eligible subscription exists and enforcement permits the requested amount. |
| `Limit` | <code>long</code> | Yes | Not applicable | Resolved feature allowance for this period. |
| `Consumed` | <code>long</code> | Yes | Not applicable | Amount already recorded. |
| `Remaining` | <code>long</code> | Yes | Not applicable | Allowance minus consumption, clamped to zero. |
| `RequestedUsage` | <code>long</code> | Yes | Not applicable | Amount checked; zero in a report result. |
| `ProjectedConsumed` | <code>long</code> | Yes | Not applicable | Consumption plus requested usage. |
| `IsOverage` | <code>bool</code> | Yes | Not applicable | True when projected consumption exceeds the limit. |
| `Enforcement` | <code>string</code> | Yes | Not applicable | hard rejects overage; soft permits it. |
| `UsageScope` | <code>string</code> | Yes | Not applicable | customer shares a balance across the product; subscription tracks each subscription separately. |
| `SubscriptionKey` | <code>string?</code> | Yes | Not applicable | Subscription key for subscription-scoped usage; omitted or null otherwise. |
| `PeriodStart` | <code>string</code> | Yes | Not applicable | Inclusive UTC start of the usage period. |
| `PeriodEnd` | <code>string</code> | Yes | Not applicable | Exclusive UTC end of the usage period. |
| `AccessDeniedReason` | <code>string?</code> | Yes | Not applicable | limit_exceeded or no_active_subscription when access is denied; otherwise absent or null. |

</div>

</div>

<div class="data-type" markdown="1">

### UsageReportOptions { #UsageReportOptions }

Identity and context for a usage write.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `idempotencyKey` | <code>string</code> | Yes | None | Nonblank retry key, 1 to 255 characters, unique across usage reports for this customer. |
| `subscriptionKey` | <code>string \| undefined</code> | No | None | Required for subscription-scoped usage; omit for customer-scoped usage. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Optional JSON metadata included in request identity; not returned in the event DTO. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `IdempotencyKey` | <code>string</code> | Yes | None | Nonblank retry key, 1 to 255 characters, unique across usage reports for this customer. |
| `SubscriptionKey` | <code>string?</code> | No | null | Required for subscription-scoped usage; omit for customer-scoped usage. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Optional JSON metadata included in request identity; not returned in the event DTO. |

</div>

</div>

<div class="data-type" markdown="1">

### UsageReportDto { #UsageReportDto }

Persisted result of an accepted usage report.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `eventId` | <code>string</code> | Yes | Not applicable | Opaque event identifier represented as a string. |
| `idempotencyKey` | <code>string</code> | Yes | Not applicable | Original retry key. |
| `quantity` | <code>number</code> | Yes | Not applicable | Accepted quantity after before-hook adjustments. |
| `recordedAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `usage` | <code><a href="#UsageDto">UsageDto</a></code> | Yes | Not applicable | Post-write [usage snapshot](#UsageDto). |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `EventId` | <code>string</code> | Yes | Not applicable | Opaque event identifier represented as a string. |
| `IdempotencyKey` | <code>string</code> | Yes | Not applicable | Original retry key. |
| `Quantity` | <code>long</code> | Yes | Not applicable | Accepted quantity after before-hook adjustments. |
| `RecordedAt` | <code>string</code> | Yes | Not applicable | UTC event timestamp. |
| `Usage` | <code><a href="#UsageDto">UsageDto</a></code> | Yes | Not applicable | Post-write [usage snapshot](#UsageDto). |

</div>

</div>

<div class="data-type" markdown="1">

### UsageHistoryFilter { #UsageHistoryFilter }

TypeScript event-history filters. .NET accepts these values as individual method arguments.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `subscriptionKey` | <code>string \| undefined</code> | No | None | Filter one subscription; omit to include all scopes. |
| `from` | <code>string \| undefined</code> | No | None | Inclusive UTC start, as an ISO timestamp. |
| `to` | <code>string \| undefined</code> | No | None | Exclusive UTC end, as an ISO timestamp. |
| `limit` | <code>number \| undefined</code> | No | 50 | Page size, 1 to 500. |
| `offset` | <code>number \| undefined</code> | No | 0 | Nonnegative rows to skip. |
| `search` | <code>string \| undefined</code> | No | None | Inherited from PageFilter but ignored by this method. |
| `status` | <code>string \| undefined</code> | No | None | Inherited from PageFilter but ignored by this method. |

</div>
<div class="language-content" data-lang="net" markdown="1">

No separate .NET DTO. See [ListUsageEventsAsync](#listusageevents).

</div>
</div>

## Related guides

- [Features](features.md): configure metering.
- [How Feature Values Are Calculated](feature-resolution.md): derive allowance from plans, add-ons, and overrides.
- [Subscriptions](subscriptions.md): maintain billing-period dates.
- [Credits](credits.md): charge prepaid credits for actions.
