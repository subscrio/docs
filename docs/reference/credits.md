---
title: Credits
description: Manage credit currencies, grants, action costs, and customer balances.
reference_format: true
---

# Credits

## Purpose

Credits provide a shared customer wallet per currency across products and subscriptions. Define action costs, issue credits, and consume them atomically. Unlike metered usage, credits debit a wallet rather than a per-feature period counter.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const credits = subscrio.credits;
```

</div>
<div class="language-content" data-lang="net" markdown="1">

```csharp
var credits = subscrio.Credits;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`createCurrency`](#createcurrency) | Defines a currency. |
| [`updateCurrency`](#updatecurrency) | Updates currency display properties. |
| [`getCurrency`](#getcurrency) | Gets a currency or null. |
| [`listCurrencies`](#listcurrencies) | Lists currencies. |
| [`setPlanGrant`](#setplangrant) | Configures plan credit issuance. |
| [`getPlanGrant`](#getplangrant) | Gets one plan grant rule. |
| [`listPlanGrants`](#listplangrants) | Lists active plan grant rules. |
| [`removePlanGrant`](#removeplangrant) | Stops future issuance from a rule. |
| [`setConsumptionRule`](#setconsumptionrule) | Sets a feature action cost. |
| [`getConsumptionRule`](#getconsumptionrule) | Gets one currency cost. |
| [`listConsumptionRules`](#listconsumptionrules) | Lists action costs. |
| [`removeConsumptionRule`](#removeconsumptionrule) | Removes one action cost. |
| [`grant`](#grant) | Issues manual, promotional, or prepaid credits. |
| [`issueDuePlanGrants`](#issuedueplangrants) | Reconciles one subscription's scheduled grants. |
| [`processScheduledGrants`](#processscheduledgrants) | Reconciles customer credit schedules. |
| [`getBalance`](#getbalance) | Reconciles and reads one wallet. |
| [`listBalances`](#listbalances) | Reconciles and lists customer wallets. |
| [`canConsume`](#canconsume) | Checks affordability after reconciliation. |
| [`consume`](#consume) | Atomically debits all required currencies. |
| [`adjust`](#adjust) | Adds or removes credits with a reason. |
| [`listGrants`](#listgrants) | Lists grant history. |
| [`getOperation`](#getoperation) | Finds a saved operation by retry key. |
| [`listLedgerEntries`](#listledgerentries) | Lists accounting entries. |
| [`archiveCurrency`](#archivecurrency) | Disables currency issuance and spending. |
| [`unarchiveCurrency`](#unarchivecurrency) | Restores currency use. |
| [`deleteCurrency`](#deletecurrency) | Deletes an unused archived currency. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`CreateCurrencyAsync`](#createcurrency) | Defines a currency. |
| [`UpdateCurrencyAsync`](#updatecurrency) | Updates currency display properties. |
| [`GetCurrencyAsync`](#getcurrency) | Gets a currency or null. |
| [`ListCurrenciesAsync`](#listcurrencies) | Lists currencies. |
| [`SetPlanGrantAsync`](#setplangrant) | Configures plan credit issuance. |
| [`GetPlanGrantAsync`](#getplangrant) | Gets one plan grant rule. |
| [`ListPlanGrantsAsync`](#listplangrants) | Lists active plan grant rules. |
| [`RemovePlanGrantAsync`](#removeplangrant) | Stops future issuance from a rule. |
| [`SetConsumptionRuleAsync`](#setconsumptionrule) | Sets a feature action cost. |
| [`GetConsumptionRuleAsync`](#getconsumptionrule) | Gets one currency cost. |
| [`ListConsumptionRulesAsync`](#listconsumptionrules) | Lists action costs. |
| [`RemoveConsumptionRuleAsync`](#removeconsumptionrule) | Removes one action cost. |
| [`GrantAsync`](#grant) | Issues manual, promotional, or prepaid credits. |
| [`IssueDuePlanGrantsAsync`](#issuedueplangrants) | Reconciles one subscription's scheduled grants. |
| [`ProcessScheduledGrantsAsync`](#processscheduledgrants) | Reconciles customer credit schedules. |
| [`GetBalanceAsync`](#getbalance) | Reconciles and reads one wallet. |
| [`ListBalancesAsync`](#listbalances) | Reconciles and lists customer wallets. |
| [`CanConsumeAsync`](#canconsume) | Checks affordability after reconciliation. |
| [`ConsumeAsync`](#consume) | Atomically debits all required currencies. |
| [`AdjustAsync`](#adjust) | Adds or removes credits with a reason. |
| [`ListGrantsAsync`](#listgrants) | Lists grant history. |
| [`GetOperationAsync`](#getoperation) | Finds a saved operation by retry key. |
| [`ListLedgerEntriesAsync`](#listledgerentries) | Lists accounting entries. |
| [`ArchiveCurrencyAsync`](#archivecurrency) | Disables currency issuance and spending. |
| [`UnarchiveCurrencyAsync`](#unarchivecurrency) | Restores currency use. |
| [`DeleteCurrencyAsync`](#deletecurrency) | Deletes an unused archived currency. |

</div>

## Method details

<div class="method-entry" markdown="1">

### createCurrency { #createcurrency data-method-ts="createCurrency" data-method-net="CreateCurrencyAsync" }

<span id="description_3" class="compatibility-anchor"></span>
<span id="signature_6" class="compatibility-anchor"></span>
<span id="inputs_6" class="compatibility-anchor"></span>
<span id="input-properties_2" class="compatibility-anchor"></span>
<span id="returns_6" class="compatibility-anchor"></span>
<span id="return-properties_5" class="compatibility-anchor"></span>
<span id="example_6" class="compatibility-anchor"></span>
<span id="signature_7" class="compatibility-anchor"></span>
<span id="inputs_7" class="compatibility-anchor"></span>
<span id="input-properties_3" class="compatibility-anchor"></span>
<span id="returns_7" class="compatibility-anchor"></span>
<span id="return-properties_6" class="compatibility-anchor"></span>
<span id="example_7" class="compatibility-anchor"></span>
<span id="expected-results_3" class="compatibility-anchor"></span>
<span id="potential-errors_3" class="compatibility-anchor"></span>

Create an active currency with a globally unique key.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createCurrency(input: { key: string; displayName: string; metadata?: Record<string, unknown>; }): Promise<CreditCurrencyDto>
```

</div>

**Parameters**

- `input`: [Currency creation properties](#CreateCreditCurrencyDto).

**Returns** <code><a href="#CreditCurrencyDto">CreditCurrencyDto</a></code>: Saved currency.

**Example**

```typescript
await subscrio.credits.createCurrency({ key: 'ai-credits', displayName: 'AI credits' });
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationError`: An amount, policy, key, or schedule is invalid.
- `ConflictError`: The currency key already exists.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditCurrencyDto> CreateCurrencyAsync(CreateCreditCurrencyDto input)
```

</div>

**Parameters**

- `input`: [Currency creation properties](#CreateCreditCurrencyDto).

**Returns** <code><a href="#CreditCurrencyDto">CreditCurrencyDto</a></code>: Saved currency.

**Example**

```csharp
await subscrio.Credits.CreateCurrencyAsync(new CreateCreditCurrencyDto("ai-credits", "AI credits"));
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationException`: An amount, policy, key, or schedule is invalid.
- `ConflictException`: The currency key already exists.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### updateCurrency { #updatecurrency data-method-ts="updateCurrency" data-method-net="UpdateCurrencyAsync" }

<span id="description_6" class="compatibility-anchor"></span>
<span id="signature_12" class="compatibility-anchor"></span>
<span id="inputs_12" class="compatibility-anchor"></span>
<span id="input-properties_5" class="compatibility-anchor"></span>
<span id="returns_12" class="compatibility-anchor"></span>
<span id="return-properties_11" class="compatibility-anchor"></span>
<span id="example_12" class="compatibility-anchor"></span>
<span id="signature_13" class="compatibility-anchor"></span>
<span id="inputs_13" class="compatibility-anchor"></span>
<span id="returns_13" class="compatibility-anchor"></span>
<span id="return-properties_12" class="compatibility-anchor"></span>
<span id="example_13" class="compatibility-anchor"></span>
<span id="expected-results_6" class="compatibility-anchor"></span>
<span id="potential-errors_6" class="compatibility-anchor"></span>

Update the label and metadata without changing the key. Supplied metadata replaces the entire object; an empty object clears its entries.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
updateCurrency(k: string, input: { displayName?: string; metadata?: Record<string, unknown> }): Promise<CreditCurrencyDto>
```

</div>

**Parameters**

- `k`: Currency key.
- `input`: [Currency update properties](#UpdateCurrencyInput). Uses [partial updates](getting-started.md#partial-updates).

**Returns** <code><a href="#CreditCurrencyDto">CreditCurrencyDto</a></code>: Updated currency.

**Example**

```typescript
await subscrio.credits.updateCurrency('ai-credits', { displayName: 'AI tokens' });
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditCurrencyDto> UpdateCurrencyAsync(string key, string? displayName, Dictionary<string, object?>? metadata)
```

</div>

**Parameters**

- `key`: Currency key.
- `displayName`: Optional nonblank label; null retains the current label.
- `metadata`: Optional replacement metadata; null retains the current object.

**Returns** <code><a href="#CreditCurrencyDto">CreditCurrencyDto</a></code>: Updated currency.

**Example**

```csharp
await subscrio.Credits.UpdateCurrencyAsync("ai-credits", displayName: "AI tokens");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getCurrency { #getcurrency data-method-ts="getCurrency" data-method-net="GetCurrencyAsync" }

<span id="description_4" class="compatibility-anchor"></span>
<span id="signature_8" class="compatibility-anchor"></span>
<span id="inputs_8" class="compatibility-anchor"></span>
<span id="returns_8" class="compatibility-anchor"></span>
<span id="return-properties_7" class="compatibility-anchor"></span>
<span id="example_8" class="compatibility-anchor"></span>
<span id="signature_9" class="compatibility-anchor"></span>
<span id="inputs_9" class="compatibility-anchor"></span>
<span id="returns_9" class="compatibility-anchor"></span>
<span id="return-properties_8" class="compatibility-anchor"></span>
<span id="example_9" class="compatibility-anchor"></span>
<span id="expected-results_4" class="compatibility-anchor"></span>
<span id="potential-errors_4" class="compatibility-anchor"></span>

Read currency details, including archived currencies.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getCurrency(k: string): Promise<CreditCurrencyDto | null>
```

</div>

**Parameters**

- `k`: Currency key.

**Returns** <code><a href="#CreditCurrencyDto">CreditCurrencyDto</a> | null</code>: Currency details, or null when missing.

**Example**

```typescript
const currency = await subscrio.credits.getCurrency('ai-credits');
console.log(currency?.status);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditCurrencyDto?> GetCurrencyAsync(string key)
```

</div>

**Parameters**

- `key`: Currency key.

**Returns** <code><a href="#CreditCurrencyDto">CreditCurrencyDto</a>?</code>: Currency details, or null when missing.

**Example**

```csharp
var currency = await subscrio.Credits.GetCurrencyAsync("ai-credits");
Console.WriteLine(currency?.Status);
```

</div>

</div>

<div class="method-entry" markdown="1">

### listCurrencies { #listcurrencies data-method-ts="listCurrencies" data-method-net="ListCurrenciesAsync" }

<span id="description_5" class="compatibility-anchor"></span>
<span id="signature_10" class="compatibility-anchor"></span>
<span id="inputs_10" class="compatibility-anchor"></span>
<span id="input-properties_4" class="compatibility-anchor"></span>
<span id="returns_10" class="compatibility-anchor"></span>
<span id="return-properties_9" class="compatibility-anchor"></span>
<span id="example_10" class="compatibility-anchor"></span>
<span id="signature_11" class="compatibility-anchor"></span>
<span id="inputs_11" class="compatibility-anchor"></span>
<span id="returns_11" class="compatibility-anchor"></span>
<span id="return-properties_10" class="compatibility-anchor"></span>
<span id="example_11" class="compatibility-anchor"></span>
<span id="expected-results_5" class="compatibility-anchor"></span>
<span id="potential-errors_5" class="compatibility-anchor"></span>

List currencies in key order, optionally filtering by status.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listCurrencies(filter?: PageFilter): Promise<CreditCurrencyDto[]>
```

</div>

**Parameters**

- `filter`: Optional [PageFilter](addons.md#PageFilter); defaults to 50 rows at offset zero. Search is ignored.

**Returns** <code><a href="#CreditCurrencyDto">CreditCurrencyDto</a>[]</code>: Currencies, or an empty collection.

**Example**

```typescript
const currencies = await subscrio.credits.listCurrencies({ status: 'active' });
console.log(currencies);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<CreditCurrencyDto>> ListCurrenciesAsync(int limit, int offset, string? status)
```

</div>

**Parameters**

- `limit`: Optional page size, 1 to 500; defaults to 50.
- `offset`: Optional nonnegative rows to skip; defaults to 0.
- `status`: Optional active or archived filter; null includes both.

**Returns** <code>List&lt;<a href="#CreditCurrencyDto">CreditCurrencyDto</a>&gt;</code>: Currencies, or an empty collection.

**Example**

```csharp
var currencies = await subscrio.Credits.ListCurrenciesAsync(status: "active");
Console.WriteLine(currencies.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### setPlanGrant { #setplangrant data-method-ts="setPlanGrant" data-method-net="SetPlanGrantAsync" }

<span id="description_10" class="compatibility-anchor"></span>
<span id="signature_20" class="compatibility-anchor"></span>
<span id="inputs_20" class="compatibility-anchor"></span>
<span id="input-properties_6" class="compatibility-anchor"></span>
<span id="returns_20" class="compatibility-anchor"></span>
<span id="example_20" class="compatibility-anchor"></span>
<span id="signature_21" class="compatibility-anchor"></span>
<span id="inputs_21" class="compatibility-anchor"></span>
<span id="input-properties_7" class="compatibility-anchor"></span>
<span id="returns_21" class="compatibility-anchor"></span>
<span id="example_21" class="compatibility-anchor"></span>
<span id="expected-results_10" class="compatibility-anchor"></span>
<span id="potential-errors_10" class="compatibility-anchor"></span>

Create or replace the plan's grant rule for one active currency. Before changing the rule, reconcile existing customer schedules under the previous configuration. This does not immediately issue the new rule's grants.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
setPlanGrant(planKey: string, currencyKey: string, input: PlanCreditGrantInput): Promise<void>
```

</div>

**Parameters**

- `planKey`: Plan key.
- `currencyKey`: Active currency key.
- `input`: [PlanCreditGrantInput](#PlanCreditGrantInput) specifying amount and schedule.

**Returns** No returned value.

**Example**

```typescript
await subscrio.credits.setPlanGrant('pro', 'ai-credits', { amount: 1000, cadence: 'monthly' });
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task SetPlanGrantAsync(string planKey, string currencyKey, PlanCreditGrantInput input)
```

</div>

**Parameters**

- `planKey`: Plan key.
- `currencyKey`: Active currency key.
- `input`: [PlanCreditGrantInput](#PlanCreditGrantInput) specifying amount and schedule.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Credits.SetPlanGrantAsync("pro", "ai-credits", new PlanCreditGrantInput(1000, "monthly"));
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getPlanGrant { #getplangrant data-method-ts="getPlanGrant" data-method-net="GetPlanGrantAsync" }

<span id="description" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="return-properties" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>

Read active grant rule without issuing or consuming credits.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getPlanGrant(planKey: string, currencyKey: string): Promise<(PlanCreditGrantInput & { currencyKey: string; }) | null>
```

</div>

**Parameters**

- `planKey`: Plan key.
- `currencyKey`: Currency key.

**Returns** <code>(<a href="#PlanCreditGrantInput">PlanCreditGrantInput</a> &amp; { currencyKey: string }) | null</code>: Matching rule, or null when none exists. See the [returned properties](#PlanCreditGrantDto).

**Example**

```typescript
const result = await subscrio.credits.getPlanGrant('pro', 'ai-credits');
console.log(result);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<PlanCreditGrantDto?> GetPlanGrantAsync(string planKey, string currencyKey)
```

</div>

**Parameters**

- `planKey`: Plan key.
- `currencyKey`: Currency key.

**Returns** <code><a href="#PlanCreditGrantDto">PlanCreditGrantDto</a>?</code>: Matching rule, or null when none exists.

**Example**

```csharp
var result = await subscrio.Credits.GetPlanGrantAsync("pro", "ai-credits");
Console.WriteLine(result);
```

</div>

</div>

<div class="method-entry" markdown="1">

### listPlanGrants { #listplangrants data-method-ts="listPlanGrants" data-method-net="ListPlanGrantsAsync" }

<span id="description_12" class="compatibility-anchor"></span>
<span id="signature_24" class="compatibility-anchor"></span>
<span id="inputs_24" class="compatibility-anchor"></span>
<span id="returns_24" class="compatibility-anchor"></span>
<span id="return-properties_13" class="compatibility-anchor"></span>
<span id="example_24" class="compatibility-anchor"></span>
<span id="signature_25" class="compatibility-anchor"></span>
<span id="inputs_25" class="compatibility-anchor"></span>
<span id="returns_25" class="compatibility-anchor"></span>
<span id="return-properties_14" class="compatibility-anchor"></span>
<span id="example_25" class="compatibility-anchor"></span>
<span id="expected-results_12" class="compatibility-anchor"></span>
<span id="potential-errors_12" class="compatibility-anchor"></span>

Read active grant rules without issuing or consuming credits. Results are ordered by currency key.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listPlanGrants(p: string): Promise<(PlanCreditGrantInput & { currencyKey: string; })[]>
```

</div>

**Parameters**

- `p`: Plan key.

**Returns** <code>Array&lt;<a href="#PlanCreditGrantInput">PlanCreditGrantInput</a> &amp; { currencyKey: string }&gt;</code>: Matching rules, or an empty collection. See the [returned properties](#PlanCreditGrantDto).

**Example**

```typescript
const result = await subscrio.credits.listPlanGrants('pro');
console.log(result);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<PlanCreditGrantDto?> GetPlanGrantAsync(string planKey, string currencyKey) => (await ListPlanGrantsAsync(planKey)
```

</div>

**Parameters**

- `p`: Plan key.

**Returns** <code>List&lt;<a href="#PlanCreditGrantDto">PlanCreditGrantDto</a>&gt;</code>: Matching rules, or an empty collection.

**Example**

```csharp
var result = await subscrio.Credits.ListPlanGrantsAsync("pro");
Console.WriteLine(result);
```

</div>

</div>

<div class="method-entry" markdown="1">

### removePlanGrant { #removeplangrant data-method-ts="removePlanGrant" data-method-net="RemovePlanGrantAsync" }

<span id="description_11" class="compatibility-anchor"></span>
<span id="signature_22" class="compatibility-anchor"></span>
<span id="inputs_22" class="compatibility-anchor"></span>
<span id="returns_22" class="compatibility-anchor"></span>
<span id="example_22" class="compatibility-anchor"></span>
<span id="signature_23" class="compatibility-anchor"></span>
<span id="inputs_23" class="compatibility-anchor"></span>
<span id="returns_23" class="compatibility-anchor"></span>
<span id="example_23" class="compatibility-anchor"></span>
<span id="expected-results_11" class="compatibility-anchor"></span>
<span id="potential-errors_11" class="compatibility-anchor"></span>

Reconcile accrued grants, then deactivate the rule. Previously issued grants and history remain; removing an absent rule is harmless when the plan exists.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
removePlanGrant(p: string, c: string): Promise<void>
```

</div>

**Parameters**

- `p`: Plan key.
- `c`: Currency key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.credits.removePlanGrant('pro', 'ai-credits');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task RemovePlanGrantAsync(string p, string c)
```

</div>

**Parameters**

- `p`: Plan key.
- `c`: Currency key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Credits.RemovePlanGrantAsync("pro", "ai-credits");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### setConsumptionRule { #setconsumptionrule data-method-ts="setConsumptionRule" data-method-net="SetConsumptionRuleAsync" }

<span id="description_13" class="compatibility-anchor"></span>
<span id="signature_26" class="compatibility-anchor"></span>
<span id="inputs_26" class="compatibility-anchor"></span>
<span id="returns_26" class="compatibility-anchor"></span>
<span id="example_26" class="compatibility-anchor"></span>
<span id="signature_27" class="compatibility-anchor"></span>
<span id="inputs_27" class="compatibility-anchor"></span>
<span id="returns_27" class="compatibility-anchor"></span>
<span id="example_27" class="compatibility-anchor"></span>
<span id="expected-results_13" class="compatibility-anchor"></span>
<span id="potential-errors_13" class="compatibility-anchor"></span>

Set or replace the credits charged per action unit for a feature and currency. A feature can charge several currencies in one action. Metered features cannot have credit consumption rules.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
setConsumptionRule(featureKey: string, currencyKey: string, creditsPerUnit: number): Promise<void>
```

</div>

**Parameters**

- `featureKey`: Non-metered feature key.
- `currencyKey`: Active currency key.
- `creditsPerUnit`: Positive integer cost per action unit.

**Returns** No returned value.

**Example**

```typescript
await subscrio.credits.setConsumptionRule('render', 'ai-credits', 10);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task SetConsumptionRuleAsync(string f, string c, long creditsPerUnit)
```

</div>

**Parameters**

- `f`: Non-metered feature key.
- `c`: Active currency key.
- `creditsPerUnit`: Positive integer cost per action unit.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Credits.SetConsumptionRuleAsync("render", "ai-credits", 10);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getConsumptionRule { #getconsumptionrule data-method-ts="getConsumptionRule" data-method-net="GetConsumptionRuleAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="return-properties_1" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="return-properties_2" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>

Read cost rule without issuing or consuming credits.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getConsumptionRule(featureKey: string, currencyKey: string): Promise<{ currencyKey: string; creditsPerUnit: number; } | null>
```

</div>

**Parameters**

- `featureKey`: Feature key.
- `currencyKey`: Currency key.

**Returns** <code>{ currencyKey: string; creditsPerUnit: number } | null</code>: Matching rule, or null when none exists. See the [returned properties](#CreditConsumptionRuleDto).

**Example**

```typescript
const result = await subscrio.credits.getConsumptionRule('render', 'ai-credits');
console.log(result);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditConsumptionRuleDto?> GetConsumptionRuleAsync(string featureKey, string currencyKey)
```

</div>

**Parameters**

- `featureKey`: Feature key.
- `currencyKey`: Currency key.

**Returns** <code><a href="#CreditConsumptionRuleDto">CreditConsumptionRuleDto</a>?</code>: Matching rule, or null when none exists.

**Example**

```csharp
var result = await subscrio.Credits.GetConsumptionRuleAsync("render", "ai-credits");
Console.WriteLine(result);
```

</div>

</div>

<div class="method-entry" markdown="1">

### listConsumptionRules { #listconsumptionrules data-method-ts="listConsumptionRules" data-method-net="ListConsumptionRulesAsync" }

<span id="description_15" class="compatibility-anchor"></span>
<span id="signature_30" class="compatibility-anchor"></span>
<span id="inputs_30" class="compatibility-anchor"></span>
<span id="returns_30" class="compatibility-anchor"></span>
<span id="return-properties_15" class="compatibility-anchor"></span>
<span id="example_30" class="compatibility-anchor"></span>
<span id="signature_31" class="compatibility-anchor"></span>
<span id="inputs_31" class="compatibility-anchor"></span>
<span id="returns_31" class="compatibility-anchor"></span>
<span id="return-properties_16" class="compatibility-anchor"></span>
<span id="example_31" class="compatibility-anchor"></span>
<span id="expected-results_15" class="compatibility-anchor"></span>
<span id="potential-errors_15" class="compatibility-anchor"></span>

Read cost rules without issuing or consuming credits. Results are ordered by currency key.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listConsumptionRules(f: string): Promise<{ currencyKey: string; creditsPerUnit: number; }[]>
```

</div>

**Parameters**

- `f`: Feature key.

**Returns** <code>Array&lt;{ currencyKey: string; creditsPerUnit: number }&gt;</code>: Matching rules, or an empty collection. See the [returned properties](#CreditConsumptionRuleDto).

**Example**

```typescript
const result = await subscrio.credits.listConsumptionRules('render');
console.log(result);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditConsumptionRuleDto?> GetConsumptionRuleAsync(string featureKey, string currencyKey) => (await ListConsumptionRulesAsync(featureKey)
```

</div>

**Parameters**

- `f`: Feature key.

**Returns** <code>List&lt;<a href="#CreditConsumptionRuleDto">CreditConsumptionRuleDto</a>&gt;</code>: Matching rules, or an empty collection.

**Example**

```csharp
var result = await subscrio.Credits.ListConsumptionRulesAsync("render");
Console.WriteLine(result);
```

</div>

</div>

<div class="method-entry" markdown="1">

### removeConsumptionRule { #removeconsumptionrule data-method-ts="removeConsumptionRule" data-method-net="RemoveConsumptionRuleAsync" }

<span id="description_14" class="compatibility-anchor"></span>
<span id="signature_28" class="compatibility-anchor"></span>
<span id="inputs_28" class="compatibility-anchor"></span>
<span id="returns_28" class="compatibility-anchor"></span>
<span id="example_28" class="compatibility-anchor"></span>
<span id="signature_29" class="compatibility-anchor"></span>
<span id="inputs_29" class="compatibility-anchor"></span>
<span id="returns_29" class="compatibility-anchor"></span>
<span id="example_29" class="compatibility-anchor"></span>
<span id="expected-results_14" class="compatibility-anchor"></span>
<span id="potential-errors_14" class="compatibility-anchor"></span>

Remove one currency cost from a feature. Missing rules are ignored; existing ledger history is unchanged.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
removeConsumptionRule(f: string, c: string): Promise<void>
```

</div>

**Parameters**

- `f`: Feature key.
- `c`: Currency key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.credits.removeConsumptionRule('render', 'ai-credits');
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task RemoveConsumptionRuleAsync(string f, string c)
```

</div>

**Parameters**

- `f`: Feature key.
- `c`: Currency key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Credits.RemoveConsumptionRuleAsync("render", "ai-credits");
```

</div>

</div>

<div class="method-entry" markdown="1">

### grant { #grant data-method-ts="grant" data-method-net="GrantAsync" }

<span id="description_16" class="compatibility-anchor"></span>
<span id="signature_32" class="compatibility-anchor"></span>
<span id="inputs_32" class="compatibility-anchor"></span>
<span id="input-properties_8" class="compatibility-anchor"></span>
<span id="returns_32" class="compatibility-anchor"></span>
<span id="return-properties_17" class="compatibility-anchor"></span>
<span id="example_32" class="compatibility-anchor"></span>
<span id="signature_33" class="compatibility-anchor"></span>
<span id="inputs_33" class="compatibility-anchor"></span>
<span id="input-properties_9" class="compatibility-anchor"></span>
<span id="returns_33" class="compatibility-anchor"></span>
<span id="return-properties_18" class="compatibility-anchor"></span>
<span id="example_33" class="compatibility-anchor"></span>
<span id="expected-results_16" class="compatibility-anchor"></span>
<span id="potential-errors_16" class="compatibility-anchor"></span>
<span id="scheduling-helpers" class="compatibility-anchor"></span>

Issue credits as a manual, promotional, or prepaid grant in one transaction. The currency must be active, and an optional subscription must belong to the customer. Retrying an identical request with the same customer-scoped credit idempotency key returns the saved result without writing again. A changed request or another credit operation under that key fails. Before-hooks run inside the transaction; after-hooks run after commit and are not replayed.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
grant(input: CreditGrantInput): Promise<CreditGrantDto>
```

</div>

**Parameters**

- `input`: [CreditGrantInput](#CreditGrantInput) with a positive amount and stable retry key.

**Returns** <code><a href="#CreditGrantDto">CreditGrantDto</a></code>: Issued grant, or the original grant snapshot on retry.

**Example**

```typescript
await subscrio.credits.grant({
  customerKey: 'acme', currencyKey: 'ai-credits', amount: 500,
  grantType: 'prepaid', idempotencyKey: 'purchase-123'
});
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.
- `IdempotencyConflictError`: The customer-scoped retry key was used for a different credit operation or request.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditGrantDto> GrantAsync(CreditGrantInput input)
```

</div>

**Parameters**

- `input`: [CreditGrantInput](#CreditGrantInput) with a positive amount and stable retry key.

**Returns** <code><a href="#CreditGrantDto">CreditGrantDto</a></code>: Issued grant, or the original grant snapshot on retry.

**Example**

```csharp
await subscrio.Credits.GrantAsync(new CreditGrantInput(
    "acme", "ai-credits", 500, "prepaid", "purchase-123"));
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.
- `IdempotencyConflictException`: The customer-scoped retry key was used for a different credit operation or request.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### issueDuePlanGrants { #issuedueplangrants data-method-ts="issueDuePlanGrants" data-method-net="IssueDuePlanGrantsAsync" }

<span id="description_2" class="compatibility-anchor"></span>
<span id="signature_4" class="compatibility-anchor"></span>
<span id="inputs_4" class="compatibility-anchor"></span>
<span id="input-properties" class="compatibility-anchor"></span>
<span id="returns_4" class="compatibility-anchor"></span>
<span id="return-properties_3" class="compatibility-anchor"></span>
<span id="example_4" class="compatibility-anchor"></span>
<span id="signature_5" class="compatibility-anchor"></span>
<span id="inputs_5" class="compatibility-anchor"></span>
<span id="input-properties_1" class="compatibility-anchor"></span>
<span id="returns_5" class="compatibility-anchor"></span>
<span id="return-properties_4" class="compatibility-anchor"></span>
<span id="example_5" class="compatibility-anchor"></span>
<span id="expected-results_2" class="compatibility-anchor"></span>
<span id="potential-errors_2" class="compatibility-anchor"></span>

Reconcile scheduled grants for one subscription, catching up due periods and expiring applicable credits. Repeated calls do not issue the same scheduled grant twice. More than 240 catch-up periods in a rule fails the transaction.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
issueDuePlanGrants(options: { subscriptionKey: string }): Promise<{ issued: CreditGrantDto[]; nextDueAt: string | null; hasMore: boolean; }>
```

</div>

**Parameters**

- `options`: [Subscription selection](#IssueDuePlanGrantsInput).

**Returns** <code>{ issued: <a href="#CreditGrantDto">CreditGrantDto</a>[]; nextDueAt: string | null; hasMore: boolean }</code>: [Issued grants and schedule state](#DuePlanGrantsDto).

**Example**

```typescript
const result = await subscrio.credits.issueDuePlanGrants({ subscriptionKey: 'acme-pro' });
console.log(result.issued, result.nextDueAt);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<DuePlanGrantsDto> IssueDuePlanGrantsAsync(IssueDuePlanGrantsInput input)
```

</div>

**Parameters**

- `input`: [IssueDuePlanGrantsInput](#IssueDuePlanGrantsInput).

**Returns** <code><a href="#DuePlanGrantsDto">DuePlanGrantsDto</a></code>: [Issued grants and schedule state](#DuePlanGrantsDto).

**Example**

```csharp
var result = await subscrio.Credits.IssueDuePlanGrantsAsync(new IssueDuePlanGrantsInput("acme-pro"));
Console.WriteLine(result.NextDueAt);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### processScheduledGrants { #processscheduledgrants data-method-ts="processScheduledGrants" data-method-net="ProcessScheduledGrantsAsync" }

<span id="description_17" class="compatibility-anchor"></span>
<span id="signature_34" class="compatibility-anchor"></span>
<span id="inputs_34" class="compatibility-anchor"></span>
<span id="returns_34" class="compatibility-anchor"></span>
<span id="return-properties_19" class="compatibility-anchor"></span>
<span id="example_34" class="compatibility-anchor"></span>
<span id="signature_35" class="compatibility-anchor"></span>
<span id="inputs_35" class="compatibility-anchor"></span>
<span id="returns_35" class="compatibility-anchor"></span>
<span id="example_35" class="compatibility-anchor"></span>
<span id="expected-results_17" class="compatibility-anchor"></span>
<span id="potential-errors_17" class="compatibility-anchor"></span>

Reconcile due grants and expiration for one customer or every customer. Each customer runs in a separate transaction; if a later customer fails, earlier committed work remains. Schedule this helper when credits should be issued without waiting for wallet access.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
processScheduledGrants(customerKey?: string): Promise<{ issued: number; customers: number; }>
```

</div>

**Parameters**

- `customerKey`: Optional customer key; omit to process all customers.

**Returns** <code>{ issued: number; customers: number }</code>: [Processing counts](#ScheduledGrantResult).

**Example**

```typescript
const result = await subscrio.credits.processScheduledGrants('acme');
console.log(result);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<(int Issued, int Customers)> ProcessScheduledGrantsAsync(string? customerKey)
```

</div>

**Parameters**

- `customerKey`: Optional customer key; omit to process all customers.

**Returns** <code>(int Issued, int Customers)</code>: [Processing counts](#ScheduledGrantResult).

**Example**

```csharp
var result = await subscrio.Credits.ProcessScheduledGrantsAsync("acme");
Console.WriteLine(result);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getBalance { #getbalance data-method-ts="getBalance" data-method-net="GetBalanceAsync" }

<span id="description_18" class="compatibility-anchor"></span>
<span id="signature_36" class="compatibility-anchor"></span>
<span id="inputs_36" class="compatibility-anchor"></span>
<span id="returns_36" class="compatibility-anchor"></span>
<span id="return-properties_20" class="compatibility-anchor"></span>
<span id="example_36" class="compatibility-anchor"></span>
<span id="signature_37" class="compatibility-anchor"></span>
<span id="inputs_37" class="compatibility-anchor"></span>
<span id="returns_37" class="compatibility-anchor"></span>
<span id="return-properties_21" class="compatibility-anchor"></span>
<span id="example_37" class="compatibility-anchor"></span>
<span id="expected-results_18" class="compatibility-anchor"></span>
<span id="potential-errors_18" class="compatibility-anchor"></span>

Reconcile due plan grants and expirations, then read one wallet. This operation can write grants and ledger entries; it is not a pure read.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getBalance(customerKey: string, currencyKey: string): Promise<CreditBalanceDto>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `currencyKey`: Currency key, including archived currencies.

**Returns** <code><a href="#CreditBalanceDto">CreditBalanceDto</a></code>: Spendable balance and unexpired grants with remaining credit.

**Example**

```typescript
const result = await subscrio.credits.getBalance('acme', 'ai-credits');
console.log(result);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditBalanceDto> GetBalanceAsync(string customerKey, string currencyKey)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `currencyKey`: Currency key, including archived currencies.

**Returns** <code><a href="#CreditBalanceDto">CreditBalanceDto</a></code>: Spendable balance and unexpired grants with remaining credit.

**Example**

```csharp
var result = await subscrio.Credits.GetBalanceAsync("acme", "ai-credits");
Console.WriteLine(result);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### listBalances { #listbalances data-method-ts="listBalances" data-method-net="ListBalancesAsync" }

<span id="description_19" class="compatibility-anchor"></span>
<span id="signature_38" class="compatibility-anchor"></span>
<span id="inputs_38" class="compatibility-anchor"></span>
<span id="returns_38" class="compatibility-anchor"></span>
<span id="return-properties_22" class="compatibility-anchor"></span>
<span id="example_38" class="compatibility-anchor"></span>
<span id="signature_39" class="compatibility-anchor"></span>
<span id="inputs_39" class="compatibility-anchor"></span>
<span id="returns_39" class="compatibility-anchor"></span>
<span id="return-properties_23" class="compatibility-anchor"></span>
<span id="example_39" class="compatibility-anchor"></span>
<span id="expected-results_19" class="compatibility-anchor"></span>
<span id="potential-errors_19" class="compatibility-anchor"></span>

Reconcile due plan grants and expirations, then read all existing wallets in currency-key order. This operation can write grants and ledger entries; it is not a pure read.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listBalances(customerKey: string): Promise<CreditBalanceDto[]>
```

</div>

**Parameters**

- `customerKey`: Customer key.

**Returns** <code><a href="#CreditBalanceDto">CreditBalanceDto</a>[]</code>: Spendable balance and unexpired grants with remaining credit.

**Example**

```typescript
const result = await subscrio.credits.listBalances('acme');
console.log(result);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<CreditBalanceDto>> ListBalancesAsync(string customerKey)
```

</div>

**Parameters**

- `customerKey`: Customer key.

**Returns** <code>List&lt;<a href="#CreditBalanceDto">CreditBalanceDto</a>&gt;</code>: Spendable balance and unexpired grants with remaining credit.

**Example**

```csharp
var result = await subscrio.Credits.ListBalancesAsync("acme");
Console.WriteLine(result);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### canConsume { #canconsume data-method-ts="canConsume" data-method-net="CanConsumeAsync" }

<span id="description_20" class="compatibility-anchor"></span>
<span id="signature_40" class="compatibility-anchor"></span>
<span id="inputs_40" class="compatibility-anchor"></span>
<span id="input-properties_10" class="compatibility-anchor"></span>
<span id="returns_40" class="compatibility-anchor"></span>
<span id="return-properties_24" class="compatibility-anchor"></span>
<span id="example_40" class="compatibility-anchor"></span>
<span id="signature_41" class="compatibility-anchor"></span>
<span id="inputs_41" class="compatibility-anchor"></span>
<span id="input-properties_11" class="compatibility-anchor"></span>
<span id="returns_41" class="compatibility-anchor"></span>
<span id="return-properties_25" class="compatibility-anchor"></span>
<span id="example_41" class="compatibility-anchor"></span>
<span id="expected-results_20" class="compatibility-anchor"></span>
<span id="potential-errors_20" class="compatibility-anchor"></span>

Reconcile the customer's schedules, then check whether every configured currency cost is affordable. This can issue grants and expire credits, but does not debit the action. It checks credit affordability, not product feature access or subscription eligibility; enforce those separately when required.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
canConsume(action: CreditActionDto): Promise<CreditCheckDto>
```

</div>

**Parameters**

- `action`: [CreditActionDto](#CreditActionDto) with the feature and positive unit count.

**Returns** <code><a href="#CreditCheckDto">CreditCheckDto</a></code>: Affordability and per-currency costs; this does not reserve credits.

**Example**

```typescript
const check = await subscrio.credits.canConsume({ customerKey: 'acme', featureKey: 'render', units: 2 });
console.log(check.hasAccess, check.costs);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditCheckDto> CanConsumeAsync(CreditActionDto action)
```

</div>

**Parameters**

- `action`: [CreditActionDto](#CreditActionDto) with the feature and positive unit count.

**Returns** <code><a href="#CreditCheckDto">CreditCheckDto</a></code>: Affordability and per-currency costs; this does not reserve credits.

**Example**

```csharp
var check = await subscrio.Credits.CanConsumeAsync(new CreditActionDto("acme", "render", 2));
Console.WriteLine(check.HasAccess);
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### consume { #consume data-method-ts="consume" data-method-net="ConsumeAsync" }

<span id="description_21" class="compatibility-anchor"></span>
<span id="signature_42" class="compatibility-anchor"></span>
<span id="inputs_42" class="compatibility-anchor"></span>
<span id="input-properties_12" class="compatibility-anchor"></span>
<span id="returns_42" class="compatibility-anchor"></span>
<span id="return-properties_26" class="compatibility-anchor"></span>
<span id="example_42" class="compatibility-anchor"></span>
<span id="signature_43" class="compatibility-anchor"></span>
<span id="inputs_43" class="compatibility-anchor"></span>
<span id="input-properties_13" class="compatibility-anchor"></span>
<span id="returns_43" class="compatibility-anchor"></span>
<span id="return-properties_27" class="compatibility-anchor"></span>
<span id="example_43" class="compatibility-anchor"></span>
<span id="expected-results_21" class="compatibility-anchor"></span>
<span id="potential-errors_21" class="compatibility-anchor"></span>

Reconcile schedules and debit every configured currency atomically. If any currency is archived or insufficient, no action debit commits. Grants are spent by ascending priority, earliest expiry with non-expiring grants last, then grant ID. This checks credit affordability only. Retrying an identical request with the same customer-scoped credit idempotency key returns the saved result without writing again. A changed request or another credit operation under that key fails. Before-hooks run inside the transaction; after-hooks run after commit and are not replayed.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
consume(input: CreditConsumeInput): Promise<CreditConsumeDto>
```

</div>

**Parameters**

- `input`: [CreditConsumeInput](#CreditConsumeInput), including action units and retry key.

**Returns** <code><a href="#CreditConsumeDto">CreditConsumeDto</a></code>: Grant allocations and post-debit balances.

**Example**

```typescript
const result = await subscrio.credits.consume({
  customerKey: 'acme', featureKey: 'render', units: 2, idempotencyKey: 'render-123'
});
console.log(result.allocations);
```

<details class="method-errors" markdown="1">
<summary>Errors (4)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.
- `IdempotencyConflictError`: The customer-scoped retry key was used for a different credit operation or request.
- `InsufficientCreditsError`: A required currency is archived or lacks funds; the error includes per-currency costs.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditConsumeDto> ConsumeAsync(CreditConsumeInput input)
```

</div>

**Parameters**

- `input`: [CreditConsumeInput](#CreditConsumeInput), including action units and retry key.

**Returns** <code><a href="#CreditConsumeDto">CreditConsumeDto</a></code>: Grant allocations and post-debit balances.

**Example**

```csharp
var result = await subscrio.Credits.ConsumeAsync(new CreditConsumeInput("acme", "render", 2, "render-123"));
Console.WriteLine(result.Allocations.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (4)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.
- `IdempotencyConflictException`: The customer-scoped retry key was used for a different credit operation or request.
- `InsufficientCreditsException`: A required currency is archived or lacks funds; the error includes per-currency costs.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### adjust { #adjust data-method-ts="adjust" data-method-net="AdjustAsync" }

<span id="description_22" class="compatibility-anchor"></span>
<span id="signature_44" class="compatibility-anchor"></span>
<span id="inputs_44" class="compatibility-anchor"></span>
<span id="input-properties_14" class="compatibility-anchor"></span>
<span id="returns_44" class="compatibility-anchor"></span>
<span id="return-properties_28" class="compatibility-anchor"></span>
<span id="example_44" class="compatibility-anchor"></span>
<span id="signature_45" class="compatibility-anchor"></span>
<span id="inputs_45" class="compatibility-anchor"></span>
<span id="input-properties_15" class="compatibility-anchor"></span>
<span id="returns_45" class="compatibility-anchor"></span>
<span id="return-properties_29" class="compatibility-anchor"></span>
<span id="example_45" class="compatibility-anchor"></span>
<span id="expected-results_22" class="compatibility-anchor"></span>
<span id="potential-errors_22" class="compatibility-anchor"></span>

Correct a balance with a signed amount and a required reason. Positive amounts create a manual grant; negative amounts spend existing grants in the normal order. The active currency cannot be driven below zero. Retrying an identical request with the same customer-scoped credit idempotency key returns the saved result without writing again. A changed request or another credit operation under that key fails. Before-hooks run inside the transaction; after-hooks run after commit and are not replayed.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
adjust(input: CreditAdjustInput): Promise<{ operationId: string; idempotencyKey: string; balance: CreditBalanceDto; }>
```

</div>

**Parameters**

- `input`: [CreditAdjustInput](#CreditAdjustInput) with a nonzero signed amount.

**Returns** <code>{ operationId: string; idempotencyKey: string; balance: <a href="#CreditBalanceDto">CreditBalanceDto</a> }</code>: [Operation identity and adjusted balance](#CreditAdjustmentDto).

**Example**

```typescript
await subscrio.credits.adjust({
  customerKey: 'acme', currencyKey: 'ai-credits', amount: 25,
  reason: 'Service credit', idempotencyKey: 'correction-123'
});
```

<details class="method-errors" markdown="1">
<summary>Errors (4)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ValidationError`: An amount, policy, key, or schedule is invalid.
- `IdempotencyConflictError`: The customer-scoped retry key was used for a different credit operation or request.
- `InsufficientCreditsError`: A negative adjustment exceeds available credit.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditAdjustmentDto> AdjustAsync(CreditAdjustInput input)
```

</div>

**Parameters**

- `input`: [CreditAdjustInput](#CreditAdjustInput) with a nonzero signed amount.

**Returns** <code><a href="#CreditAdjustmentDto">CreditAdjustmentDto</a></code>: [Operation identity and adjusted balance](#CreditAdjustmentDto).

**Example**

```csharp
await subscrio.Credits.AdjustAsync(new CreditAdjustInput(
    "acme", "ai-credits", 25, "Service credit", "correction-123"));
```

<details class="method-errors" markdown="1">
<summary>Errors (4)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ValidationException`: An amount, policy, key, or schedule is invalid.
- `IdempotencyConflictException`: The customer-scoped retry key was used for a different credit operation or request.
- `InsufficientCreditsException`: A negative adjustment exceeds available credit.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### listGrants { #listgrants data-method-ts="listGrants" data-method-net="ListGrantsAsync" }

<span id="description_23" class="compatibility-anchor"></span>
<span id="signature_46" class="compatibility-anchor"></span>
<span id="inputs_46" class="compatibility-anchor"></span>
<span id="input-properties_16" class="compatibility-anchor"></span>
<span id="returns_46" class="compatibility-anchor"></span>
<span id="return-properties_30" class="compatibility-anchor"></span>
<span id="example_46" class="compatibility-anchor"></span>
<span id="signature_47" class="compatibility-anchor"></span>
<span id="inputs_47" class="compatibility-anchor"></span>
<span id="returns_47" class="compatibility-anchor"></span>
<span id="return-properties_31" class="compatibility-anchor"></span>
<span id="example_47" class="compatibility-anchor"></span>
<span id="expected-results_23" class="compatibility-anchor"></span>
<span id="potential-errors_23" class="compatibility-anchor"></span>

List all grants, including spent or expired grants, in descending grant-ID order. This does not reconcile schedules.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listGrants(customerKey: string, currencyKey: string, filter?: PageFilter): Promise<CreditGrantDto[]>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `currencyKey`: Currency key.
- `filter`: Optional [PageFilter](addons.md#PageFilter); defaults to 50 rows at offset zero. Search and status are ignored.

**Returns** <code><a href="#CreditGrantDto">CreditGrantDto</a>[]</code>: [Saved records](#CreditGrantDto), or an empty collection when none match.

**Example**

```typescript
const history = await subscrio.credits.listGrants('acme', 'ai-credits', { limit: 20 });
console.log(history);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<CreditGrantDto>> ListGrantsAsync(string customerKey, string currencyKey, int limit, int offset)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `currencyKey`: Currency key.
- `limit`: Optional page size, 1 to 500; defaults to 50.
- `offset`: Optional nonnegative rows to skip; defaults to 0.

**Returns** <code>List&lt;<a href="#CreditGrantDto">CreditGrantDto</a>&gt;</code>: [Saved records](#CreditGrantDto), or an empty collection when none match.

**Example**

```csharp
var history = await subscrio.Credits.ListGrantsAsync("acme", "ai-credits", limit: 20);
Console.WriteLine(history.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getOperation { #getoperation data-method-ts="getOperation" data-method-net="GetOperationAsync" }

<span id="description_24" class="compatibility-anchor"></span>
<span id="signature_48" class="compatibility-anchor"></span>
<span id="inputs_48" class="compatibility-anchor"></span>
<span id="returns_48" class="compatibility-anchor"></span>
<span id="return-properties_32" class="compatibility-anchor"></span>
<span id="example_48" class="compatibility-anchor"></span>
<span id="signature_49" class="compatibility-anchor"></span>
<span id="inputs_49" class="compatibility-anchor"></span>
<span id="returns_49" class="compatibility-anchor"></span>
<span id="return-properties_33" class="compatibility-anchor"></span>
<span id="example_49" class="compatibility-anchor"></span>
<span id="expected-results_24" class="compatibility-anchor"></span>
<span id="potential-errors_24" class="compatibility-anchor"></span>

Retrieve the saved result of a credit operation using its idempotency key. This diagnostic does not replay or execute the operation.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getOperation(customerKey: string, k: string): Promise<{ id: string; type: string; result: unknown; createdAt: string; } | null>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `k`: Credit operation idempotency key.

**Returns** <code>{ id: string; type: string; result: unknown; createdAt: string } | null</code>: [Operation snapshot](#CreditOperationDto), or null when missing.

**Example**

```typescript
const operation = await subscrio.credits.getOperation('acme', 'render-123');
console.log(operation?.result);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CreditOperationDto?> GetOperationAsync(string customerKey, string key)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `key`: Credit operation idempotency key.

**Returns** <code><a href="#CreditOperationDto">CreditOperationDto</a>?</code>: [Operation snapshot](#CreditOperationDto), or null when missing.

**Example**

```csharp
var operation = await subscrio.Credits.GetOperationAsync("acme", "render-123");
Console.WriteLine(operation?.Result);
```

</div>

</div>

<div class="method-entry" markdown="1">

### listLedgerEntries { #listledgerentries data-method-ts="listLedgerEntries" data-method-net="ListLedgerEntriesAsync" }

<span id="description_25" class="compatibility-anchor"></span>
<span id="signature_50" class="compatibility-anchor"></span>
<span id="inputs_50" class="compatibility-anchor"></span>
<span id="input-properties_17" class="compatibility-anchor"></span>
<span id="returns_50" class="compatibility-anchor"></span>
<span id="return-properties_34" class="compatibility-anchor"></span>
<span id="example_50" class="compatibility-anchor"></span>
<span id="signature_51" class="compatibility-anchor"></span>
<span id="inputs_51" class="compatibility-anchor"></span>
<span id="returns_51" class="compatibility-anchor"></span>
<span id="return-properties_35" class="compatibility-anchor"></span>
<span id="example_51" class="compatibility-anchor"></span>
<span id="expected-results_25" class="compatibility-anchor"></span>
<span id="potential-errors_25" class="compatibility-anchor"></span>

List accounting entries in descending creation-time and ID order without reconciling schedules.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listLedgerEntries(customerKey: string, currencyKey: string, filter?: PageFilter): Promise<{ id: string; operationId: string; grantId: string; amount: number; reason: string; createdAt: string; metadata: unknown; }[]>
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `currencyKey`: Currency key.
- `filter`: Optional [PageFilter](addons.md#PageFilter); defaults to 50 rows at offset zero. Search and status are ignored.

**Returns** <code>Array&lt;{ id: string; operationId: string; grantId: string; amount: number; reason: string; createdAt: string; metadata: unknown }&gt;</code>: [Saved records](#CreditLedgerEntryDto), or an empty collection when none match.

**Example**

```typescript
const history = await subscrio.credits.listLedgerEntries('acme', 'ai-credits', { limit: 20 });
console.log(history);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: An amount, policy, key, or schedule is invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<CreditLedgerEntryDto>> ListLedgerEntriesAsync(string customerKey, string currencyKey, int limit, int offset)
```

</div>

**Parameters**

- `customerKey`: Customer key.
- `currencyKey`: Currency key.
- `limit`: Optional page size, 1 to 500; defaults to 50.
- `offset`: Optional nonnegative rows to skip; defaults to 0.

**Returns** <code>List&lt;<a href="#CreditLedgerEntryDto">CreditLedgerEntryDto</a>&gt;</code>: [Saved records](#CreditLedgerEntryDto), or an empty collection when none match.

**Example**

```csharp
var history = await subscrio.Credits.ListLedgerEntriesAsync("acme", "ai-credits", limit: 20);
Console.WriteLine(history.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: An amount, policy, key, or schedule is invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### archiveCurrency { #archivecurrency data-method-ts="archiveCurrency" data-method-net="ArchiveCurrencyAsync" }

<span id="description_7" class="compatibility-anchor"></span>
<span id="signature_14" class="compatibility-anchor"></span>
<span id="inputs_14" class="compatibility-anchor"></span>
<span id="returns_14" class="compatibility-anchor"></span>
<span id="example_14" class="compatibility-anchor"></span>
<span id="signature_15" class="compatibility-anchor"></span>
<span id="inputs_15" class="compatibility-anchor"></span>
<span id="returns_15" class="compatibility-anchor"></span>
<span id="example_15" class="compatibility-anchor"></span>
<span id="expected-results_7" class="compatibility-anchor"></span>
<span id="potential-errors_7" class="compatibility-anchor"></span>

Archive the currency to block new grants and spending. Balances and history remain available.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
archiveCurrency(k: string): Promise<void>
```

</div>

**Parameters**

- `k`: Currency key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.credits.archiveCurrency('unused-credits');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task ArchiveCurrencyAsync(string key)
```

</div>

**Parameters**

- `key`: Currency key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Credits.ArchiveCurrencyAsync("unused-credits");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### unarchiveCurrency { #unarchivecurrency data-method-ts="unarchiveCurrency" data-method-net="UnarchiveCurrencyAsync" }

<span id="description_8" class="compatibility-anchor"></span>
<span id="signature_16" class="compatibility-anchor"></span>
<span id="inputs_16" class="compatibility-anchor"></span>
<span id="returns_16" class="compatibility-anchor"></span>
<span id="example_16" class="compatibility-anchor"></span>
<span id="signature_17" class="compatibility-anchor"></span>
<span id="inputs_17" class="compatibility-anchor"></span>
<span id="returns_17" class="compatibility-anchor"></span>
<span id="example_17" class="compatibility-anchor"></span>
<span id="expected-results_8" class="compatibility-anchor"></span>
<span id="potential-errors_8" class="compatibility-anchor"></span>

Restore the currency to active status, allowing issuance and spending again.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
unarchiveCurrency(k: string): Promise<void>
```

</div>

**Parameters**

- `k`: Currency key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.credits.unarchiveCurrency('unused-credits');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task UnarchiveCurrencyAsync(string key)
```

</div>

**Parameters**

- `key`: Currency key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Credits.UnarchiveCurrencyAsync("unused-credits");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### deleteCurrency { #deletecurrency data-method-ts="deleteCurrency" data-method-net="DeleteCurrencyAsync" }

<span id="description_9" class="compatibility-anchor"></span>
<span id="signature_18" class="compatibility-anchor"></span>
<span id="inputs_18" class="compatibility-anchor"></span>
<span id="returns_18" class="compatibility-anchor"></span>
<span id="example_18" class="compatibility-anchor"></span>
<span id="signature_19" class="compatibility-anchor"></span>
<span id="inputs_19" class="compatibility-anchor"></span>
<span id="returns_19" class="compatibility-anchor"></span>
<span id="example_19" class="compatibility-anchor"></span>
<span id="expected-results_9" class="compatibility-anchor"></span>
<span id="potential-errors_9" class="compatibility-anchor"></span>

Permanently delete an archived currency with no wallet, plan-grant, or consumption-rule references. Inactive plan-grant rules still count as references.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
deleteCurrency(k: string): Promise<void>
```

</div>

**Parameters**

- `k`: Currency key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.credits.deleteCurrency('unused-credits');
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundError`: A required customer, currency, plan, or subscription is missing.
- `ConflictError`: The currency is active or has references.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DeleteCurrencyAsync(string key)
```

</div>

**Parameters**

- `key`: Currency key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Credits.DeleteCurrencyAsync("unused-credits");
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `NotFoundException`: A required customer, currency, plan, or subscription is missing.
- `ConflictException`: The currency is active or has references.

</details>

</div>

</div>

## Data types

Amounts are safe integers with magnitude at most 9,007,199,254,740,991. IDs are opaque strings. Required means supplied input or a guaranteed returned property.

<div class="data-type" markdown="1">

### CreateCreditCurrencyDto { #CreateCreditCurrencyDto }

Currency creation input; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Unique 1-to-255-character key of letters, digits, underscores, or hyphens. |
| `displayName` | <code>string</code> | Yes | None | Nonblank label. |
| `metadata` | <code>Record&lt;string, unknown&gt;</code> | No | None | Optional JSON metadata. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | None | Human-readable label, 1 to 255 characters. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Optional JSON metadata. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditCurrencyDto { #CreditCurrencyDto }

Currency details.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `displayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1 to 255 characters. |
| `status` | <code>string</code> | Yes | Not applicable | Current record status. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| null \| undefined</code> | No | Not applicable | Optional JSON metadata. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `DisplayName` | <code>string</code> | Yes | Not applicable | Human-readable label, 1 to 255 characters. |
| `Status` | <code>string</code> | Yes | Not applicable | Current record status. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | Yes | Not applicable | Optional JSON metadata. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

</div>

<div class="data-type" markdown="1">

### UpdateCurrencyInput { #UpdateCurrencyInput }

TypeScript uses this inline object; .NET takes label and metadata as individual arguments.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `displayName` | `string` | No | None | Nonblank replacement label. |
| `metadata` | <code>Record&lt;string, unknown&gt;</code> | No | None | Replacement metadata object. |

</div>
<div class="language-content" data-lang="net" markdown="1">

See [UpdateCurrencyAsync](#updatecurrency) for individual parameters.

</div>
</div>

<div class="data-type" markdown="1">

### PlanCreditGrantInput { #PlanCreditGrantInput }

Plan grant configuration.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `amount` | <code>number</code> | Yes | None | Positive integer amount. |
| `cadence` | <code>&quot;monthly&quot; \| &quot;yearly&quot; \| &quot;billing_period&quot; \| &quot;once&quot;</code> | Yes | None | once, monthly, yearly, or billing_period. Monthly/yearly schedules anchor after any trial and clamp month-end dates. |
| `expiryPolicy` | <code>&quot;none&quot; \| &quot;grant_period_end&quot; \| undefined</code> | No | none | none retains credits; grant_period_end expires at the issued period end. The latter is invalid with once cadence. |
| `cancellationPolicy` | <code>&quot;retain&quot; \| &quot;expire&quot; \| undefined</code> | No | retain | retain keeps issued credit; expire removes its remaining credit when the subscription stops. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Amount` | <code>long</code> | Yes | None | Positive integer amount. |
| `Cadence` | <code>string</code> | Yes | None | once, monthly, yearly, or billing_period. Monthly/yearly schedules anchor after any trial and clamp month-end dates. |
| `ExpiryPolicy` | <code>string</code> | No | none | none retains credits; grant_period_end expires at the issued period end. The latter is invalid with once cadence. |
| `CancellationPolicy` | <code>string</code> | No | retain | retain keeps issued credit; expire removes its remaining credit when the subscription stops. |

</div>

</div>

<div class="data-type" markdown="1">

### PlanCreditGrantDto { #PlanCreditGrantDto }

Returned plan rule; TypeScript uses PlanCreditGrantInput with a currencyKey.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `currencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `amount` | <code>number</code> | Yes | Not applicable | Positive integer amount. |
| `cadence` | <code>&quot;once&quot; \| &quot;monthly&quot; \| &quot;yearly&quot; \| &quot;billing_period&quot;</code> | Yes | Not applicable | once, monthly, yearly, or billing_period. Monthly/yearly schedules anchor after any trial and clamp month-end dates. |
| `expiryPolicy` | <code>&quot;none&quot; \| &quot;grant_period_end&quot;</code> | Yes | Not applicable | none retains credits; grant_period_end expires at the issued period end. The latter is invalid with once cadence. |
| `cancellationPolicy` | <code>&quot;retain&quot; \| &quot;expire&quot;</code> | Yes | Not applicable | retain keeps issued credit; expire removes its remaining credit when the subscription stops. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CurrencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `Amount` | <code>long</code> | Yes | Not applicable | Positive integer amount. |
| `Cadence` | <code>string</code> | Yes | Not applicable | once, monthly, yearly, or billing_period. Monthly/yearly schedules anchor after any trial and clamp month-end dates. |
| `ExpiryPolicy` | <code>string</code> | Yes | Not applicable | none retains credits; grant_period_end expires at the issued period end. The latter is invalid with once cadence. |
| `CancellationPolicy` | <code>string</code> | Yes | Not applicable | retain keeps issued credit; expire removes its remaining credit when the subscription stops. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditConsumptionRuleDto { #CreditConsumptionRuleDto }

Returned action cost; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `currencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `creditsPerUnit` | <code>number</code> | Yes | Not applicable | Positive credit cost per action unit. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CurrencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `CreditsPerUnit` | <code>long</code> | Yes | Not applicable | Positive credit cost per action unit. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditGrantInput { #CreditGrantInput }

Manual credit issuance input.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `customerKey` | <code>string</code> | Yes | None | Customer owning the wallet. |
| `currencyKey` | <code>string</code> | Yes | None | Credit currency key. |
| `amount` | <code>number</code> | Yes | None | Positive integer amount. |
| `grantType` | <code>&quot;manual&quot; \| &quot;promotional&quot; \| &quot;prepaid&quot;</code> | Yes | None | manual, promotional, or prepaid. |
| `priority` | <code>number \| undefined</code> | No | 0 | Lower numbers are spent first. Signed integer with absolute value at most 2,147,483,647. |
| `expiresAt` | <code>string \| Date \| undefined</code> | No | None | Optional future UTC expiry. |
| `subscriptionKey` | <code>string \| undefined</code> | No | None | Optional subscription belonging to this customer. |
| `idempotencyKey` | <code>string</code> | Yes | None | Nonblank 1-to-255-character key shared across credit operation types for this customer. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Optional JSON metadata. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CustomerKey` | <code>string</code> | Yes | None | Customer owning the wallet. |
| `CurrencyKey` | <code>string</code> | Yes | None | Credit currency key. |
| `Amount` | <code>long</code> | Yes | None | Positive integer amount. |
| `GrantType` | <code>string</code> | Yes | None | manual, promotional, or prepaid. |
| `IdempotencyKey` | <code>string</code> | Yes | None | Nonblank 1-to-255-character key shared across credit operation types for this customer. |
| `Priority` | <code>int</code> | No | 0 | Lower numbers are spent first. Signed integer with absolute value at most 2,147,483,647. |
| `ExpiresAt` | <code>DateTime?</code> | No | null | Optional future UTC expiry. |
| `SubscriptionKey` | <code>string?</code> | No | null | Optional subscription belonging to this customer. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Optional JSON metadata. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditGrantDto { #CreditGrantDto }

Persisted grant properties.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `id` | <code>string</code> | Yes | Not applicable | Opaque record identifier. |
| `currencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `subscriptionKey` | <code>string \| null \| undefined</code> | No | Not applicable | Optional subscription belonging to this customer. |
| `grantType` | <code>string</code> | Yes | Not applicable | manual, promotional, prepaid, or plan. |
| `originalAmount` | <code>number</code> | Yes | Not applicable | Amount originally issued. |
| `remainingAmount` | <code>number</code> | Yes | Not applicable | Amount not yet spent or expired. |
| `priority` | <code>number</code> | Yes | Not applicable | Lower numbers are spent first. Signed integer with absolute value at most 2,147,483,647. |
| `expiresAt` | <code>string \| null</code> | Yes | Not applicable | UTC expiry, or null for no expiration. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Id` | <code>string</code> | Yes | Not applicable | Opaque record identifier. |
| `CurrencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `SubscriptionKey` | <code>string?</code> | Yes | Not applicable | Optional subscription belonging to this customer. |
| `GrantType` | <code>string</code> | Yes | Not applicable | manual, promotional, prepaid, or plan. |
| `OriginalAmount` | <code>long</code> | Yes | Not applicable | Amount originally issued. |
| `RemainingAmount` | <code>long</code> | Yes | Not applicable | Amount not yet spent or expired. |
| `Priority` | <code>int</code> | Yes | Not applicable | Lower numbers are spent first. Signed integer with absolute value at most 2,147,483,647. |
| `ExpiresAt` | <code>string?</code> | Yes | Not applicable | UTC expiry, or null for no expiration. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

</div>

<div class="data-type" markdown="1">

### IssueDuePlanGrantsInput { #IssueDuePlanGrantsInput }

Subscription selection; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `subscriptionKey` | <code>string</code> | Yes | None | Subscription to reconcile. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `SubscriptionKey` | <code>string</code> | Yes | None | Optional subscription belonging to this customer. |

</div>

</div>

<div class="data-type" markdown="1">

### DuePlanGrantsDto { #DuePlanGrantsDto }

Schedule result; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `issued` | <code><a href="#CreditGrantDto">CreditGrantDto</a>[]</code> | Yes | Not applicable | Grants issued during this call. |
| `nextDueAt` | <code>string \| null</code> | Yes | Not applicable | Earliest stored next due time, or null. |
| `hasMore` | <code>boolean</code> | Yes | Not applicable | Currently always false; excessive catch-up throws instead of returning another page. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Issued` | <code>List&lt;<a href="#CreditGrantDto">CreditGrantDto</a>&gt;</code> | Yes | Not applicable | Grants issued during this call. |
| `NextDueAt` | <code>string?</code> | Yes | Not applicable | Earliest stored next due time, or null. |
| `HasMore` | <code>bool</code> | Yes | Not applicable | Currently always false; excessive catch-up throws instead of returning another page. |

</div>

</div>

<div class="data-type" markdown="1">

### ScheduledGrantResult { #ScheduledGrantResult }

Processing counts; an inline object in TypeScript and a tuple in .NET.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `issued` | <code>number</code> | Yes | Not applicable | Grants issued during processing. |
| `customers` | <code>number</code> | Yes | Not applicable | Customers processed. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Issued` | <code>int</code> | Yes | Not applicable | Grants issued during processing. |
| `Customers` | <code>int</code> | Yes | Not applicable | Customers processed. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditBalanceDto { #CreditBalanceDto }

Spendable wallet balance.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `currencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `available` | <code>number</code> | Yes | Not applicable | Spendable credit remaining. |
| `grants` | <code><a href="#CreditGrantDto">CreditGrantDto</a>[]</code> | Yes | Not applicable | Unexpired grants with positive balances in spending order. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CurrencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `Available` | <code>long</code> | Yes | Not applicable | Spendable credit remaining. |
| `Grants` | <code>List&lt;<a href="#CreditGrantDto">CreditGrantDto</a>&gt;</code> | Yes | Not applicable | Unexpired grants with positive balances in spending order. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditActionDto { #CreditActionDto }

An action to price.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `customerKey` | <code>string</code> | Yes | None | Customer owning the wallet. |
| `featureKey` | <code>string</code> | Yes | None | Feature whose configured costs are charged. |
| `units` | <code>number</code> | Yes | None | Positive integer action quantity. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CustomerKey` | <code>string</code> | Yes | None | Customer owning the wallet. |
| `FeatureKey` | <code>string</code> | Yes | None | Feature whose configured costs are charged. |
| `Units` | <code>long</code> | Yes | None | Positive integer action quantity. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditCheckDto { #CreditCheckDto }

Affordability result.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `hasAccess` | <code>boolean</code> | Yes | Not applicable | True if all currency costs are affordable and currencies are active. |
| `costs` | <code><a href="#CreditCostDto">CreditCostDto</a>[]</code> | Yes | Not applicable | Per-currency costs and available balances. |
| `accessDeniedReason` | <code>&quot;insufficient_credits&quot; \| &quot;currency_inactive&quot; \| undefined</code> | No | Not applicable | currency_inactive takes precedence over insufficient_credits; absent or null when allowed. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `HasAccess` | <code>bool</code> | Yes | Not applicable | True if all currency costs are affordable and currencies are active. |
| `Costs` | <code>List&lt;<a href="#CreditCostDto">CreditCostDto</a>&gt;</code> | Yes | Not applicable | Per-currency costs and available balances. |
| `AccessDeniedReason` | <code>string?</code> | Yes | Not applicable | currency_inactive takes precedence over insufficient_credits; absent or null when allowed. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditConsumeInput { #CreditConsumeInput }

An action to charge.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `idempotencyKey` | <code>string</code> | Yes | None | Nonblank 1-to-255-character key shared across credit operation types for this customer. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Optional JSON metadata. |
| `customerKey` | <code>string</code> | Yes | None | Customer owning the wallet. |
| `featureKey` | <code>string</code> | Yes | None | Feature whose configured costs are charged. |
| `units` | <code>number</code> | Yes | None | Positive integer action quantity. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CustomerKey` | <code>string</code> | Yes | None | Customer owning the wallet. |
| `FeatureKey` | <code>string</code> | Yes | None | Feature whose configured costs are charged. |
| `Units` | <code>long</code> | Yes | None | Positive integer action quantity. |
| `IdempotencyKey` | <code>string</code> | Yes | None | Nonblank 1-to-255-character key shared across credit operation types for this customer. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Optional JSON metadata. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditConsumeDto { #CreditConsumeDto }

Persisted consumption result.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `operationId` | <code>string</code> | Yes | Not applicable | Saved operation identifier. |
| `idempotencyKey` | <code>string</code> | Yes | Not applicable | Nonblank 1-to-255-character key shared across credit operation types for this customer. |
| `allocations` | <code><a href="#CreditAllocationDto">CreditAllocationDto</a>[]</code> | Yes | Not applicable | Amounts deducted from individual grants. |
| `balances` | <code>{ currencyKey: string; available: number; }[]</code> | Yes | Not applicable | Post-debit available balance in each charged currency. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `OperationId` | <code>string</code> | Yes | Not applicable | Saved operation identifier. |
| `IdempotencyKey` | <code>string</code> | Yes | Not applicable | Nonblank 1-to-255-character key shared across credit operation types for this customer. |
| `Allocations` | <code>List&lt;<a href="#CreditAllocationDto">CreditAllocationDto</a>&gt;</code> | Yes | Not applicable | Amounts deducted from individual grants. |
| `Balances` | <code>List&lt;<a href="#CreditAvailableDto">CreditAvailableDto</a>&gt;</code> | Yes | Not applicable | Post-debit available balance in each charged currency. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditAdjustInput { #CreditAdjustInput }

Signed balance correction.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `customerKey` | <code>string</code> | Yes | None | Customer owning the wallet. |
| `currencyKey` | <code>string</code> | Yes | None | Credit currency key. |
| `amount` | <code>number</code> | Yes | None | Nonzero signed integer: positive adds credit; negative removes it. |
| `reason` | <code>string</code> | Yes | None | Required nonblank explanation for the correction. |
| `idempotencyKey` | <code>string</code> | Yes | None | Nonblank 1-to-255-character key shared across credit operation types for this customer. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CustomerKey` | <code>string</code> | Yes | None | Customer owning the wallet. |
| `CurrencyKey` | <code>string</code> | Yes | None | Credit currency key. |
| `Amount` | <code>long</code> | Yes | None | Nonzero signed integer: positive adds credit; negative removes it. |
| `Reason` | <code>string</code> | Yes | None | Required nonblank explanation for the correction. |
| `IdempotencyKey` | <code>string</code> | Yes | None | Nonblank 1-to-255-character key shared across credit operation types for this customer. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditAdjustmentDto { #CreditAdjustmentDto }

Correction result; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `operationId` | <code>string</code> | Yes | Not applicable | Saved operation identifier. |
| `idempotencyKey` | <code>string</code> | Yes | Not applicable | Nonblank 1-to-255-character key shared across credit operation types for this customer. |
| `balance` | <code><a href="#CreditBalanceDto">CreditBalanceDto</a></code> | Yes | Not applicable | Saved post-adjustment balance. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `OperationId` | <code>string</code> | Yes | Not applicable | Saved operation identifier. |
| `IdempotencyKey` | <code>string</code> | Yes | Not applicable | Nonblank 1-to-255-character key shared across credit operation types for this customer. |
| `Balance` | <code><a href="#CreditBalanceDto">CreditBalanceDto</a></code> | Yes | Not applicable | Saved post-adjustment balance. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditOperationDto { #CreditOperationDto }

Saved operation; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `id` | <code>string</code> | Yes | Not applicable | Opaque record identifier. |
| `type` | <code>string</code> | Yes | Not applicable | Operation type, such as grant, consume, adjust, or plan_grant. |
| `result` | <code>unknown</code> | Yes | Not applicable | Saved result: grant, consumption, or balance snapshot according to operation type. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Id` | <code>string</code> | Yes | Not applicable | Opaque record identifier. |
| `Type` | <code>string</code> | Yes | Not applicable | Operation type, such as grant, consume, adjust, or plan_grant. |
| `Result` | <code>System.Text.Json.JsonElement</code> | Yes | Not applicable | Saved result: grant, consumption, or balance snapshot according to operation type. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditLedgerEntryDto { #CreditLedgerEntryDto }

Immutable accounting entry; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `id` | <code>string</code> | Yes | Not applicable | Opaque record identifier. |
| `operationId` | <code>string</code> | Yes | Not applicable | Saved operation identifier. |
| `grantId` | <code>string</code> | Yes | Not applicable | Grant identifier. |
| `amount` | <code>number</code> | Yes | Not applicable | Signed change: positive issuance, negative consumption or expiry. |
| `reason` | <code>string</code> | Yes | Not applicable | Accounting reason, such as grant, consumption, adjustment, or expiry. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `metadata` | <code>unknown</code> | Yes | Not applicable | Optional stored context; may be null. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Id` | <code>string</code> | Yes | Not applicable | Opaque record identifier. |
| `OperationId` | <code>string</code> | Yes | Not applicable | Saved operation identifier. |
| `GrantId` | <code>string</code> | Yes | Not applicable | Grant identifier. |
| `Amount` | <code>long</code> | Yes | Not applicable | Positive integer amount. |
| `Reason` | <code>string</code> | Yes | Not applicable | Required nonblank explanation for the correction. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | Yes | Not applicable | Optional JSON metadata. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditCostDto { #CreditCostDto }

One currency cost.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `currencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `cost` | <code>number</code> | Yes | Not applicable | Total charge in this currency. |
| `available` | <code>number</code> | Yes | Not applicable | Spendable credit remaining. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CurrencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `Cost` | <code>long</code> | Yes | Not applicable | Total charge in this currency. |
| `Available` | <code>long</code> | Yes | Not applicable | Spendable credit remaining. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditAllocationDto { #CreditAllocationDto }

One deduction from a grant.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `currencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `grantId` | <code>string</code> | Yes | Not applicable | Grant identifier. |
| `amount` | <code>number</code> | Yes | Not applicable | Positive integer amount. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CurrencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `GrantId` | <code>string</code> | Yes | Not applicable | Grant identifier. |
| `Amount` | <code>long</code> | Yes | Not applicable | Positive integer amount. |

</div>

</div>

<div class="data-type" markdown="1">

### CreditAvailableDto { #CreditAvailableDto }

Post-consumption balance; an inline object in TypeScript.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `currencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `available` | <code>number</code> | Yes | Not applicable | Spendable credit remaining. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `CurrencyKey` | <code>string</code> | Yes | Not applicable | Credit currency key. |
| `Available` | <code>long</code> | Yes | Not applicable | Spendable credit remaining. |

</div>

</div>

## Related guides

- [How Subscrio Works](entitlements-guide.md#metered-usage-or-credits): metering versus credit wallets.
- [Plans](plans.md): the plans that supply scheduled grants.
- [Feature Checker](feature-checker.md): feature access checks separate from credit affordability.
- [Hooks](hooks.md): grant, consumption, and adjustment events.
