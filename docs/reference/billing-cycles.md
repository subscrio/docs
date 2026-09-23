---
title: Billing Cycles
description: Manage plan billing cadence, external price mappings, and period calculations.
reference_format: true
---

# Billing Cycles

## Purpose

<span id="method-reference" class="compatibility-anchor"></span>

<span id="overview" class="compatibility-anchor"></span>

A billing cycle belongs to one plan and defines its duration, such as one month or forever. Subscriptions select a billing cycle; an optional external product ID maps it to a payment-provider price.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const billingCycles = subscrio.billingCycles;
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core.Application.DTOs;

var billingCycles = subscrio.BillingCycles;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`createBillingCycle`](#createbillingcycle) | Creates an active billing cycle. |
| [`updateBillingCycle`](#updatebillingcycle) | Updates cadence or display properties. |
| [`getBillingCycle`](#getbillingcycle) | Gets a billing cycle or null. |
| [`listBillingCycles`](#listbillingcycles) | Lists matching billing cycles. |
| [`getBillingCyclesByPlan`](#getbillingcyclesbyplan) | Lists every cycle for a plan. |
| [`archiveBillingCycle`](#archivebillingcycle) | Archives a billing cycle. |
| [`unarchiveBillingCycle`](#unarchivebillingcycle) | Restores a billing cycle. |
| [`deleteBillingCycle`](#deletebillingcycle) | Deletes an unused archived cycle. |
| [`calculateNextPeriodEnd`](#calculatenextperiodend) | Calculates a period-end date. |
| [`getBillingCyclesByDurationUnit`](#getbillingcyclesbydurationunit) | Finds cycles by duration unit. |
| [`getDefaultBillingCycles`](#getdefaultbillingcycles) | Looks up the conventional cycle keys. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`CreateBillingCycleAsync`](#createbillingcycle) | Creates an active billing cycle. |
| [`UpdateBillingCycleAsync`](#updatebillingcycle) | Updates cadence or display properties. |
| [`GetBillingCycleAsync`](#getbillingcycle) | Gets a billing cycle or null. |
| [`ListBillingCyclesAsync`](#listbillingcycles) | Lists matching billing cycles. |
| [`GetBillingCyclesByPlanAsync`](#getbillingcyclesbyplan) | Lists every cycle for a plan. |
| [`ArchiveBillingCycleAsync`](#archivebillingcycle) | Archives a billing cycle. |
| [`UnarchiveBillingCycleAsync`](#unarchivebillingcycle) | Restores a billing cycle. |
| [`DeleteBillingCycleAsync`](#deletebillingcycle) | Deletes an unused archived cycle. |
| [`CalculateNextPeriodEndAsync`](#calculatenextperiodend) | Calculates a period-end date. |
| [`GetBillingCyclesByDurationUnitAsync`](#getbillingcyclesbydurationunit) | Finds cycles by duration unit. |
| [`GetDefaultBillingCyclesAsync`](#getdefaultbillingcycles) | Looks up the conventional cycle keys. |

</div>

## Method details

<div class="method-entry" markdown="1">

### createBillingCycle { #createbillingcycle data-method-ts="createBillingCycle" data-method-net="CreateBillingCycleAsync" }

<span id="description" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="input-properties" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="return-properties" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>

Create an active billing cycle with a globally unique key. A finite duration requires a positive count; forever requires the count to be omitted.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createBillingCycle(dto: CreateBillingCycleDto): Promise<BillingCycleDto>
```

</div>

**Parameters**

- `dto`: [CreateBillingCycleDto](#CreateBillingCycleDto) with its plan, key, label, and duration.

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a></code>: Saved cycle details, including plan and product keys.

**Example**

```typescript
// pro exists.
await subscrio.billingCycles.createBillingCycle({
  planKey: 'pro', key: 'pro-monthly', displayName: 'Monthly',
  durationUnit: 'months', durationValue: 1
});
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationError`: The properties or duration combination are invalid.
- `NotFoundError`: The plan does not exist.
- `ConflictError`: The billing cycle key already exists.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<BillingCycleDto> CreateBillingCycleAsync(CreateBillingCycleDto dto)
```

</div>

**Parameters**

- `dto`: [CreateBillingCycleDto](#CreateBillingCycleDto) with its plan, key, label, and duration.

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a></code>: Saved cycle details, including plan and product keys.

**Example**

```csharp
// pro exists.
await subscrio.BillingCycles.CreateBillingCycleAsync(new CreateBillingCycleDto(
    PlanKey: "pro", Key: "pro-monthly", DisplayName: "Monthly",
    DurationUnit: "months", DurationValue: 1));
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationException`: The properties or duration combination are invalid.
- `NotFoundException`: The plan does not exist.
- `ConflictException`: The billing cycle key already exists.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### updateBillingCycle { #updatebillingcycle data-method-ts="updateBillingCycle" data-method-net="UpdateBillingCycleAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="input-properties_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="return-properties_1" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>

Update the cycle without changing its key or plan. Changing its duration affects future period calculations; this method does not rewrite dates already stored on subscriptions. When changing the unit, supply a count for finite durations and omit it for forever. A previous count may remain stored for forever but is ignored by period calculation.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
updateBillingCycle(key: string, dto: UpdateBillingCycleDto): Promise<BillingCycleDto>
```

</div>

**Parameters**

- `key`: Billing cycle to update.
- `dto`: [UpdateBillingCycleDto](#UpdateBillingCycleDto). Uses [partial updates](getting-started.md#partial-updates).

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a></code>: Saved cycle details, including plan and product keys.

**Example**

```typescript
await subscrio.billingCycles.updateBillingCycle('pro-monthly', {
  durationUnit: 'months', durationValue: 3
});
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationError`: The properties or duration combination are invalid.
- `NotFoundError`: The cycle or its related plan is missing.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<BillingCycleDto> UpdateBillingCycleAsync(string key, UpdateBillingCycleDto dto)
```

</div>

**Parameters**

- `key`: Billing cycle to update.
- `dto`: [UpdateBillingCycleDto](#UpdateBillingCycleDto). Uses [partial updates](getting-started.md#partial-updates).

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a></code>: Saved cycle details, including plan and product keys.

**Example**

```csharp
await subscrio.BillingCycles.UpdateBillingCycleAsync("pro-monthly",
    new UpdateBillingCycleDto(DurationUnit: "months", DurationValue: 3));
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationException`: The properties or duration combination are invalid.
- `NotFoundException`: The cycle or its related plan is missing.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getBillingCycle { #getbillingcycle data-method-ts="getBillingCycle" data-method-net="GetBillingCycleAsync" }

<span id="description_2" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="return-properties_2" class="compatibility-anchor"></span>
<span id="expected-results_2" class="compatibility-anchor"></span>
<span id="potential-errors_2" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>

Retrieve a billing cycle, including archived cycles.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getBillingCycle(key: string): Promise<BillingCycleDto | null>
```

</div>

**Parameters**

- `key`: Billing cycle key.

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a> | null</code>: Cycle details, or null when missing.

**Example**

```typescript
const cycle = await subscrio.billingCycles.getBillingCycle('pro-monthly');
console.log(cycle?.durationUnit);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: A cycle exists but its related plan or product cannot be resolved.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<BillingCycleDto?> GetBillingCycleAsync(string key)
```

</div>

**Parameters**

- `key`: Billing cycle key.

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a>?</code>: Cycle details, or null when missing.

**Example**

```csharp
var cycle = await subscrio.BillingCycles.GetBillingCycleAsync("pro-monthly");
Console.WriteLine(cycle?.DurationUnit);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: A cycle exists but its related plan or product cannot be resolved.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### listBillingCycles { #listbillingcycles data-method-ts="listBillingCycles" data-method-net="ListBillingCyclesAsync" }

<span id="description_4" class="compatibility-anchor"></span>
<span id="signature_4" class="compatibility-anchor"></span>
<span id="inputs_4" class="compatibility-anchor"></span>
<span id="input-properties_2" class="compatibility-anchor"></span>
<span id="returns_4" class="compatibility-anchor"></span>
<span id="return-properties_4" class="compatibility-anchor"></span>
<span id="expected-results_4" class="compatibility-anchor"></span>
<span id="potential-errors_4" class="compatibility-anchor"></span>
<span id="example_4" class="compatibility-anchor"></span>

List cycles with filtering, sorting, and pagination. Supplying a plan key instead returns all cycles for that plan; after validation, the other filters, sort options, and pagination are ignored. Without a plan key, results default to creation time ascending.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listBillingCycles(filters?: BillingCycleFilterDto): Promise<BillingCycleDto[]>
```

</div>

**Parameters**

- `filters`: Optional [BillingCycleFilterDto](#BillingCycleFilterDto). Defaults to 50 results at offset zero when not filtering by plan.

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a>[]</code>: Matching cycles, or an empty collection.

**Example**

```typescript
const cycles = await subscrio.billingCycles.listBillingCycles({
  status: 'active', limit: 20, offset: 0
});
console.log(cycles);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationError`: A filter or pagination value is invalid.
- `NotFoundError`: The specified plan does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<BillingCycleDto>> ListBillingCyclesAsync(BillingCycleFilterDto? filters)
```

</div>

**Parameters**

- `filters`: Optional [BillingCycleFilterDto](#BillingCycleFilterDto). Defaults to 50 results at offset zero when not filtering by plan.

**Returns** <code>List&lt;<a href="#BillingCycleDto">BillingCycleDto</a>&gt;</code>: Matching cycles, or an empty collection.

**Example**

```csharp
var cycles = await subscrio.BillingCycles.ListBillingCyclesAsync(
    new BillingCycleFilterDto(Status: "active", Limit: 20));
Console.WriteLine(cycles.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationException`: A filter or pagination value is invalid.
- `NotFoundException`: The specified plan does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getBillingCyclesByPlan { #getbillingcyclesbyplan data-method-ts="getBillingCyclesByPlan" data-method-net="GetBillingCyclesByPlanAsync" }

<span id="description_3" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="return-properties_3" class="compatibility-anchor"></span>
<span id="expected-results_3" class="compatibility-anchor"></span>
<span id="potential-errors_3" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>

List all cycles for a plan, including archived cycles, in creation-time order. This lookup does not paginate.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getBillingCyclesByPlan(planKey: string): Promise<BillingCycleDto[]>
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a>[]</code>: Plan cycles, or an empty collection.

**Example**

```typescript
const cycles = await subscrio.billingCycles.getBillingCyclesByPlan('pro');
console.log(cycles);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The plan does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<BillingCycleDto>> GetBillingCyclesByPlanAsync(string planKey)
```

</div>

**Parameters**

- `planKey`: Plan key.

**Returns** <code>List&lt;<a href="#BillingCycleDto">BillingCycleDto</a>&gt;</code>: Plan cycles, or an empty collection.

**Example**

```csharp
var cycles = await subscrio.BillingCycles.GetBillingCyclesByPlanAsync("pro");
Console.WriteLine(cycles.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The plan does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### archiveBillingCycle { #archivebillingcycle data-method-ts="archiveBillingCycle" data-method-net="ArchiveBillingCycleAsync" }

<span id="description_5" class="compatibility-anchor"></span>
<span id="signature_5" class="compatibility-anchor"></span>
<span id="inputs_5" class="compatibility-anchor"></span>
<span id="returns_5" class="compatibility-anchor"></span>
<span id="return-properties_5" class="compatibility-anchor"></span>
<span id="expected-results_5" class="compatibility-anchor"></span>
<span id="potential-errors_5" class="compatibility-anchor"></span>
<span id="example_5" class="compatibility-anchor"></span>

Mark the cycle as archived while retaining its definition and subscriptions. This does not cancel subscriptions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
archiveBillingCycle(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: Billing cycle key.

**Returns** No returned value.

**Example**

```typescript
// pro-monthly exists.
await subscrio.billingCycles.archiveBillingCycle('pro-monthly');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The billing cycle does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task ArchiveBillingCycleAsync(string key)
```

</div>

**Parameters**

- `key`: Billing cycle key.

**Returns** No returned value.

**Example**

```csharp
// pro-monthly exists.
await subscrio.BillingCycles.ArchiveBillingCycleAsync("pro-monthly");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The billing cycle does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### unarchiveBillingCycle { #unarchivebillingcycle data-method-ts="unarchiveBillingCycle" data-method-net="UnarchiveBillingCycleAsync" }

<span id="description_6" class="compatibility-anchor"></span>
<span id="signature_6" class="compatibility-anchor"></span>
<span id="inputs_6" class="compatibility-anchor"></span>
<span id="returns_6" class="compatibility-anchor"></span>
<span id="return-properties_6" class="compatibility-anchor"></span>
<span id="expected-results_6" class="compatibility-anchor"></span>
<span id="potential-errors_6" class="compatibility-anchor"></span>
<span id="example_6" class="compatibility-anchor"></span>

Restore the cycle to active status while retaining its saved definition.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
unarchiveBillingCycle(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: Billing cycle key.

**Returns** No returned value.

**Example**

```typescript
// pro-monthly exists.
await subscrio.billingCycles.unarchiveBillingCycle('pro-monthly');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The billing cycle does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task UnarchiveBillingCycleAsync(string key)
```

</div>

**Parameters**

- `key`: Billing cycle key.

**Returns** No returned value.

**Example**

```csharp
// pro-monthly exists.
await subscrio.BillingCycles.UnarchiveBillingCycleAsync("pro-monthly");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The billing cycle does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### deleteBillingCycle { #deletebillingcycle data-method-ts="deleteBillingCycle" data-method-net="DeleteBillingCycleAsync" }

<span id="description_7" class="compatibility-anchor"></span>
<span id="signature_7" class="compatibility-anchor"></span>
<span id="inputs_7" class="compatibility-anchor"></span>
<span id="returns_7" class="compatibility-anchor"></span>
<span id="return-properties_7" class="compatibility-anchor"></span>
<span id="expected-results_7" class="compatibility-anchor"></span>
<span id="potential-errors_7" class="compatibility-anchor"></span>
<span id="example_7" class="compatibility-anchor"></span>

Permanently delete an archived cycle. Any referencing subscription, including cancelled or expired subscriptions, blocks deletion. Clear plan expiration-transition references first as well.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
deleteBillingCycle(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: Billing cycle key.

**Returns** No returned value.

**Example**

```typescript
// pro-monthly is archived and has no references.
await subscrio.billingCycles.deleteBillingCycle('pro-monthly');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: The billing cycle does not exist.
- `DomainError`: The cycle is active or has references that block deletion.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DeleteBillingCycleAsync(string key)
```

</div>

**Parameters**

- `key`: Billing cycle key.

**Returns** No returned value.

**Example**

```csharp
// pro-monthly is archived and has no references.
await subscrio.BillingCycles.DeleteBillingCycleAsync("pro-monthly");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: The billing cycle does not exist.
- `DomainException`: The cycle is active or has references that block deletion.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### calculateNextPeriodEnd { #calculatenextperiodend data-method-ts="calculateNextPeriodEnd" data-method-net="CalculateNextPeriodEndAsync" }

<span id="description_8" class="compatibility-anchor"></span>
<span id="signature_8" class="compatibility-anchor"></span>
<span id="inputs_8" class="compatibility-anchor"></span>
<span id="returns_8" class="compatibility-anchor"></span>
<span id="return-properties_8" class="compatibility-anchor"></span>
<span id="expected-results_8" class="compatibility-anchor"></span>
<span id="potential-errors_8" class="compatibility-anchor"></span>
<span id="example_8" class="compatibility-anchor"></span>

Calculate a date without updating a subscription. Forever cycles return null. TypeScript uses JavaScript local-calendar date arithmetic, which can overflow into the following month; .NET uses DateTime arithmetic, which clamps a missing day to the end of the target month.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
calculateNextPeriodEnd(billingCycleKey: string, currentPeriodEnd: Date): Promise<Date | null>
```

</div>

**Parameters**

- `billingCycleKey`: Cycle defining the duration.
- `currentPeriodEnd`: Date from which to add one cycle duration.

**Returns** `Date | null`: Calculated date, or null for forever.

**Example**

```typescript
const next = await subscrio.billingCycles.calculateNextPeriodEnd(
  'pro-monthly', new Date('2026-01-15T00:00:00Z')
);
console.log(next);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The billing cycle does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<DateTime?> CalculateNextPeriodEndAsync(string billingCycleKey, DateTime currentPeriodEnd)
```

</div>

**Parameters**

- `billingCycleKey`: Cycle defining the duration.
- `currentPeriodEnd`: Date from which to add one cycle duration.

**Returns** `DateTime?`: Calculated date, or null for forever.

**Example**

```csharp
var next = await subscrio.BillingCycles.CalculateNextPeriodEndAsync(
    "pro-monthly", new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc));
Console.WriteLine(next);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The billing cycle does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getBillingCyclesByDurationUnit { #getbillingcyclesbydurationunit data-method-ts="getBillingCyclesByDurationUnit" data-method-net="GetBillingCyclesByDurationUnitAsync" }

<span id="description_9" class="compatibility-anchor"></span>
<span id="signature_9" class="compatibility-anchor"></span>
<span id="inputs_9" class="compatibility-anchor"></span>
<span id="returns_9" class="compatibility-anchor"></span>
<span id="return-properties_9" class="compatibility-anchor"></span>
<span id="expected-results_9" class="compatibility-anchor"></span>
<span id="example_9" class="compatibility-anchor"></span>

Find cycles by unit as a catalog helper. TypeScript checks all cycles and returns null plan/product keys in these snapshots. .NET filters its first 50 cycles before returning results and resolves their plan/product keys; use the normal list method for explicit pagination.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getBillingCyclesByDurationUnit(durationUnit: DurationUnit): Promise<BillingCycleDto[]>
```

</div>

**Parameters**

- `durationUnit`: [DurationUnit](#DurationUnit) to match.

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a>[]</code>: Matching cycles, or an empty collection.

**Example**

```typescript
import { DurationUnit } from 'subscrio';

const cycles = await subscrio.billingCycles.getBillingCyclesByDurationUnit(DurationUnit.Months);
console.log(cycles);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<BillingCycleDto>> GetBillingCyclesByDurationUnitAsync(DurationUnit durationUnit)
```

</div>

**Parameters**

- `durationUnit`: [DurationUnit](#DurationUnit) to match.

**Returns** <code>List&lt;<a href="#BillingCycleDto">BillingCycleDto</a>&gt;</code>: Matching cycles, or an empty collection.

**Example**

```csharp
var cycles = await subscrio.BillingCycles.GetBillingCyclesByDurationUnitAsync(
    Subscrio.Core.Domain.ValueObjects.DurationUnit.Months);
Console.WriteLine(cycles.Count);
```

</div>

</div>

<div class="method-entry" markdown="1">

### getDefaultBillingCycles { #getdefaultbillingcycles data-method-ts="getDefaultBillingCycles" data-method-net="GetDefaultBillingCyclesAsync" }

<span id="description_10" class="compatibility-anchor"></span>
<span id="signature_10" class="compatibility-anchor"></span>
<span id="returns_10" class="compatibility-anchor"></span>
<span id="return-properties_10" class="compatibility-anchor"></span>
<span id="expected-results_10" class="compatibility-anchor"></span>
<span id="potential-errors_9" class="compatibility-anchor"></span>
<span id="example_10" class="compatibility-anchor"></span>
<span id="related-workflows" class="compatibility-anchor"></span>
<span id="billing-periods-and-accounting" class="compatibility-anchor"></span>

Look up existing cycles with the exact keys monthly, quarterly, and yearly, in that order. This helper does not create defaults or verify that their durations match their names. TypeScript returns null plan/product keys for these snapshots; .NET resolves those keys.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getDefaultBillingCycles(): Promise<BillingCycleDto[]>
```

</div>

**Returns** <code><a href="#BillingCycleDto">BillingCycleDto</a>[]</code>: Existing conventional-key cycles, or an empty collection.

**Example**

```typescript
const cycles = await subscrio.billingCycles.getDefaultBillingCycles();
console.log(cycles);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<BillingCycleDto>> GetDefaultBillingCyclesAsync()
```

</div>

**Returns** <code>List&lt;<a href="#BillingCycleDto">BillingCycleDto</a>&gt;</code>: Existing conventional-key cycles, or an empty collection.

**Example**

```csharp
var cycles = await subscrio.BillingCycles.GetDefaultBillingCyclesAsync();
Console.WriteLine(cycles.Count);
```

</div>

</div>

## Data types

Required refers to supplied input fields or guaranteed returned properties. Conditional duration requirements apply in addition to nullable or optional types.

<div class="data-type" markdown="1">

### CreateBillingCycleDto { #CreateBillingCycleDto }

Properties for a billing cycle. The plan and key cannot be changed later.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `planKey` | <code>string</code> | Yes | None | Owning plan key; null in TypeScript helper results that do not resolve relationships. |
| `key` | <code>string</code> | Yes | None | Stable identifier. |
| `displayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `durationUnit` | <code>&quot;days&quot; \| &quot;weeks&quot; \| &quot;months&quot; \| &quot;years&quot; \| &quot;forever&quot;</code> | Yes | None | days, weeks, months, years, or forever. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `durationValue` | <code>number \| undefined</code> | No | None | Positive integer for finite durations. On creation, required unless the unit is forever; omit for forever. |
| `externalProductId` | <code>string \| undefined</code> | No | None | Optional payment-provider price identifier, at most 255 characters. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `PlanKey` | <code>string</code> | Yes | None | Owning plan key; null in TypeScript helper results that do not resolve relationships. |
| `Key` | <code>string</code> | Yes | None | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `DurationUnit` | <code>string</code> | Yes | None | days, weeks, months, years, or forever. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `DurationValue` | <code>int?</code> | No | null | Positive integer for finite durations. On creation, required unless the unit is forever; omit for forever. |
| `ExternalProductId` | <code>string?</code> | No | null | Optional payment-provider price identifier, at most 255 characters. |

</div>

</div>

<div class="data-type" markdown="1">

### BillingCycleDto { #BillingCycleDto }

Billing cycle details returned by catalog methods.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `productKey` | <code>string \| null</code> | Yes | Not applicable | Owning product key; null in TypeScript helper results that do not resolve relationships. |
| `planKey` | <code>string \| null</code> | Yes | Not applicable | Owning plan key; null in TypeScript helper results that do not resolve relationships. |
| `key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `displayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| null \| undefined</code> | No | Not applicable | Optional description, up to 1,000 characters. |
| `status` | <code>string</code> | Yes | Not applicable | Current record status. |
| `durationValue` | <code>number \| null \| undefined</code> | No | Not applicable | Stored duration count; ignored when the duration unit is forever. |
| `durationUnit` | <code>string</code> | Yes | Not applicable | days, weeks, months, years, or forever. |
| `externalProductId` | <code>string \| null \| undefined</code> | No | Not applicable | Optional payment-provider price identifier, at most 255 characters. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `ProductKey` | <code>string?</code> | Yes | Not applicable | Owning product key; null in TypeScript helper results that do not resolve relationships. |
| `PlanKey` | <code>string?</code> | Yes | Not applicable | Owning plan key; null in TypeScript helper results that do not resolve relationships. |
| `Key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | Yes | Not applicable | Optional description, up to 1,000 characters. |
| `Status` | <code>string</code> | Yes | Not applicable | Current record status. |
| `DurationValue` | <code>int?</code> | Yes | Not applicable | Stored duration count; ignored when the duration unit is forever. |
| `DurationUnit` | <code>string</code> | Yes | Not applicable | days, weeks, months, years, or forever. |
| `ExternalProductId` | <code>string?</code> | Yes | Not applicable | Optional payment-provider price identifier, at most 255 characters. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

</div>

<div class="data-type" markdown="1">

### UpdateBillingCycleDto { #UpdateBillingCycleDto }

Editable properties. Uses [partial updates](getting-started.md#partial-updates).

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `displayName` | <code>string \| undefined</code> | No | None | Human-readable label, 1 to 255 characters. |
| `description` | <code>string \| undefined</code> | No | None | Optional description, up to 1,000 characters. |
| `durationValue` | <code>number \| undefined</code> | No | None | Positive integer. Required when supplying a finite duration unit; omit when supplying forever. Otherwise omission keeps the current count. |
| `durationUnit` | <code>&quot;days&quot; \| &quot;weeks&quot; \| &quot;months&quot; \| &quot;years&quot; \| &quot;forever&quot; \| undefined</code> | No | None | days, weeks, months, years, or forever. |
| `externalProductId` | <code>string \| undefined</code> | No | None | Optional payment-provider price identifier, at most 255 characters. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `DisplayName` | <code>string?</code> | No | null | Human-readable label, 1 to 255 characters. |
| `Description` | <code>string?</code> | No | null | Optional description, up to 1,000 characters. |
| `DurationValue` | <code>int?</code> | No | null | Positive integer. Required when supplying a finite duration unit; omit when supplying forever. Otherwise omission keeps the current count. |
| `DurationUnit` | <code>string?</code> | No | null | days, weeks, months, years, or forever. |
| `ExternalProductId` | <code>string?</code> | No | null | Optional payment-provider price identifier, at most 255 characters. |

</div>

</div>

<div class="data-type" markdown="1">

### BillingCycleFilterDto { #BillingCycleFilterDto }

Catalog filters. TypeScript requires limit and offset when a filter object is supplied.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `limit` | <code>number</code> | Yes | 50 | Maximum page size, 1 to 100. |
| `offset` | <code>number</code> | Yes | 0 | Nonnegative number of rows to skip. |
| `durationUnit` | <code>&quot;days&quot; \| &quot;weeks&quot; \| &quot;months&quot; \| &quot;years&quot; \| &quot;forever&quot; \| undefined</code> | No | None | Restrict to days, weeks, months, years, or forever. |
| `search` | <code>string \| undefined</code> | No | None | Match display name or description. |
| `sortBy` | <code>&quot;displayName&quot; \| &quot;createdAt&quot; \| undefined</code> | No | None | displayName or createdAt; defaults to creation time. |
| `sortOrder` | <code>&quot;asc&quot; \| &quot;desc&quot; \| undefined</code> | No | None | asc or desc; defaults to asc. |
| `planKey` | <code>string \| undefined</code> | No | None | Selects all cycles for a plan and bypasses the remaining filters and pagination. |
| `status` | <code>&quot;active&quot; \| &quot;archived&quot; \| undefined</code> | No | None | active or archived. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `PlanKey` | <code>string?</code> | No | null | Selects all cycles for a plan and bypasses the remaining filters and pagination. |
| `Status` | <code>string?</code> | No | null | active or archived. |
| `Limit` | <code>int</code> | No | 50 | Maximum page size, 1 to 100. |
| `Offset` | <code>int</code> | No | 0 | Nonnegative number of rows to skip. |
| `DurationUnit` | <code>string?</code> | No | null | Restrict to days, weeks, months, years, or forever. |
| `Search` | <code>string?</code> | No | null | Match display name or description. |
| `SortBy` | <code>string?</code> | No | null | displayName or createdAt; defaults to creation time. |
| `SortOrder` | <code>string?</code> | No | null | asc or desc; defaults to asc. |

</div>

</div>

<div class="data-type" markdown="1">

### DurationUnit { #DurationUnit }

Duration enum accepted by the unit lookup helper. DTOs use the corresponding lowercase strings.

<div class="language-content" data-lang="ts" markdown="1">

| Value | Meaning |
| --- | --- |
| `DurationUnit.Days` | Calendar days. |
| `DurationUnit.Weeks` | Seven-day periods. |
| `DurationUnit.Months` | Calendar months. |
| `DurationUnit.Years` | Calendar years. |
| `DurationUnit.Forever` | No finite period end. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Value | Meaning |
| --- | --- |
| `DurationUnit.Days` | Calendar days. |
| `DurationUnit.Weeks` | Seven-day periods. |
| `DurationUnit.Months` | Calendar months. |
| `DurationUnit.Years` | Calendar years. |
| `DurationUnit.Forever` | No finite period end. |

</div>

</div>

## Related guides

- [Plans](plans.md): define offerings and expiration-transition targets.
- [Subscriptions](subscriptions.md): select a billing cycle and manage stored period dates.
- [Stripe Integration](stripe-integration.md): map external price IDs.
- [Subscription Lifecycle](subscription-lifecycle.md): expiration and renewal.
