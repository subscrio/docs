---
title: Customers
description: Manage customer identities, billing contacts, and status.
reference_format: true
---

# Customers

## Purpose

<span id="method-reference" class="compatibility-anchor"></span>

<span id="overview" class="compatibility-anchor"></span>

Customers identify the people or accounts that hold subscriptions. Their stable keys also identify usage and credit wallets; external billing IDs connect them to a payment provider.

## Access and initialization

### Access

<div class="language-content" data-lang="ts" markdown="1">

```typescript
const customers = subscrio.customers;
```

</div>
<div class="language-content" data-lang="net" markdown="1">

```csharp
var customers = subscrio.Customers;
```

</div>

## Method catalog

Database and connection failures may propagate from any operation. Method-specific errors are listed with each method.

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`createCustomer`](#createcustomer) | Creates an active customer. |
| [`updateCustomer`](#updatecustomer) | Updates contact and billing properties. |
| [`getCustomer`](#getcustomer) | Gets a customer or null. |
| [`listCustomers`](#listcustomers) | Lists matching customers. |
| [`archiveCustomer`](#archivecustomer) | Archives a customer. |
| [`unarchiveCustomer`](#unarchivecustomer) | Restores active status. |
| [`deleteCustomer`](#deletecustomer) | Permanently deletes an archived customer. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`CreateCustomerAsync`](#createcustomer) | Creates an active customer. |
| [`UpdateCustomerAsync`](#updatecustomer) | Updates contact and billing properties. |
| [`GetCustomerAsync`](#getcustomer) | Gets a customer or null. |
| [`ListCustomersAsync`](#listcustomers) | Lists matching customers. |
| [`ArchiveCustomerAsync`](#archivecustomer) | Archives a customer. |
| [`UnarchiveCustomerAsync`](#unarchivecustomer) | Restores active status. |
| [`DeleteCustomerAsync`](#deletecustomer) | Permanently deletes an archived customer. |

</div>

## Method details

<div class="method-entry" markdown="1">

### createCustomer { #createcustomer data-method-ts="createCustomer" data-method-net="CreateCustomerAsync" }

<span id="description" class="compatibility-anchor"></span>
<span id="signature" class="compatibility-anchor"></span>
<span id="inputs" class="compatibility-anchor"></span>
<span id="input-properties" class="compatibility-anchor"></span>
<span id="returns" class="compatibility-anchor"></span>
<span id="return-properties" class="compatibility-anchor"></span>
<span id="expected-results" class="compatibility-anchor"></span>
<span id="potential-errors" class="compatibility-anchor"></span>
<span id="example" class="compatibility-anchor"></span>

Create an active customer with a unique key and, when supplied, a unique external billing ID. Customer mutations emit before and after [hooks](hooks.md).

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
createCustomer(dto: CreateCustomerDto): Promise<CustomerDto>
```

</div>

**Parameters**

- `dto`: [CreateCustomerDto](#CreateCustomerDto) with a key and optional contact details.

**Returns** <code><a href="#CustomerDto">CustomerDto</a></code>: Saved customer properties.

**Example**

```typescript
await subscrio.customers.createCustomer({
  key: 'acme', displayName: 'Acme', email: 'billing@acme.test'
});
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationError`: The customer properties are invalid.
- `ConflictError`: The key or external billing ID is already used.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto)
```

</div>

**Parameters**

- `dto`: [CreateCustomerDto](#CreateCustomerDto) with a key and optional contact details.

**Returns** <code><a href="#CustomerDto">CustomerDto</a></code>: Saved customer properties.

**Example**

```csharp
await subscrio.Customers.CreateCustomerAsync(new CreateCustomerDto(
    Key: "acme", DisplayName: "Acme", Email: "billing@acme.test"));
```

<details class="method-errors" markdown="1">
<summary>Errors (2)</summary>

- `ValidationException`: The customer properties are invalid.
- `ConflictException`: The key or external billing ID is already used.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### updateCustomer { #updatecustomer data-method-ts="updateCustomer" data-method-net="UpdateCustomerAsync" }

<span id="description_1" class="compatibility-anchor"></span>
<span id="signature_1" class="compatibility-anchor"></span>
<span id="inputs_1" class="compatibility-anchor"></span>
<span id="input-properties_1" class="compatibility-anchor"></span>
<span id="returns_1" class="compatibility-anchor"></span>
<span id="expected-results_1" class="compatibility-anchor"></span>
<span id="potential-errors_1" class="compatibility-anchor"></span>
<span id="example_1" class="compatibility-anchor"></span>

Update contact and billing details without changing the customer key. Supplied metadata replaces the saved object; an empty object removes all metadata entries.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
updateCustomer(key: string, dto: UpdateCustomerDto): Promise<CustomerDto>
```

</div>

**Parameters**

- `key`: Customer key.
- `dto`: [UpdateCustomerDto](#UpdateCustomerDto). Uses [partial updates](getting-started.md#partial-updates); explicit null is rejected.

**Returns** <code><a href="#CustomerDto">CustomerDto</a></code>: Saved customer properties.

**Example**

```typescript
await subscrio.customers.updateCustomer('acme', {
  displayName: 'Acme Corporation', metadata: { segment: 'enterprise' }
});
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationError`: The updated properties are invalid.
- `NotFoundError`: The customer does not exist.
- `ConflictError`: Another customer uses the external billing ID.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CustomerDto> UpdateCustomerAsync(string key, UpdateCustomerDto dto)
```

</div>

**Parameters**

- `key`: Customer key.
- `dto`: [UpdateCustomerDto](#UpdateCustomerDto). Uses [partial updates](getting-started.md#partial-updates).

**Returns** <code><a href="#CustomerDto">CustomerDto</a></code>: Saved customer properties.

**Example**

```csharp
await subscrio.Customers.UpdateCustomerAsync("acme", new UpdateCustomerDto(
    DisplayName: "Acme Corporation",
    Metadata: new Dictionary<string, object?> { ["segment"] = "enterprise" }));
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `ValidationException`: The updated properties are invalid.
- `NotFoundException`: The customer does not exist.
- `ConflictException`: Another customer uses the external billing ID.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### getCustomer { #getcustomer data-method-ts="getCustomer" data-method-net="GetCustomerAsync" }

<span id="description_2" class="compatibility-anchor"></span>
<span id="signature_2" class="compatibility-anchor"></span>
<span id="inputs_2" class="compatibility-anchor"></span>
<span id="returns_2" class="compatibility-anchor"></span>
<span id="return-properties_1" class="compatibility-anchor"></span>
<span id="expected-results_2" class="compatibility-anchor"></span>
<span id="potential-errors_2" class="compatibility-anchor"></span>
<span id="example_2" class="compatibility-anchor"></span>

Retrieve customer details, including archived customers.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
getCustomer(key: string): Promise<CustomerDto | null>
```

</div>

**Parameters**

- `key`: Customer key.

**Returns** <code><a href="#CustomerDto">CustomerDto</a> | null</code>: Customer details, or null when missing.

**Example**

```typescript
const customer = await subscrio.customers.getCustomer('acme');
console.log(customer?.displayName);
```

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<CustomerDto?> GetCustomerAsync(string key)
```

</div>

**Parameters**

- `key`: Customer key.

**Returns** <code><a href="#CustomerDto">CustomerDto</a>?</code>: Customer details, or null when missing.

**Example**

```csharp
var customer = await subscrio.Customers.GetCustomerAsync("acme");
Console.WriteLine(customer?.DisplayName);
```

</div>

</div>

<div class="method-entry" markdown="1">

### listCustomers { #listcustomers data-method-ts="listCustomers" data-method-net="ListCustomersAsync" }

<span id="description_3" class="compatibility-anchor"></span>
<span id="signature_3" class="compatibility-anchor"></span>
<span id="inputs_3" class="compatibility-anchor"></span>
<span id="input-properties_2" class="compatibility-anchor"></span>
<span id="returns_3" class="compatibility-anchor"></span>
<span id="return-properties_2" class="compatibility-anchor"></span>
<span id="expected-results_3" class="compatibility-anchor"></span>
<span id="potential-errors_3" class="compatibility-anchor"></span>
<span id="example_3" class="compatibility-anchor"></span>

List customers with filtering, sorting, and pagination. Results default to newest-created first.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
listCustomers(filters?: CustomerFilterDto): Promise<CustomerDto[]>
```

</div>

**Parameters**

- `filters`: Optional [CustomerFilterDto](#CustomerFilterDto). Defaults to 50 results at offset zero.

**Returns** <code><a href="#CustomerDto">CustomerDto</a>[]</code>: Matching customers, or an empty collection.

**Example**

```typescript
const customers = await subscrio.customers.listCustomers({
  status: 'active', search: 'acme', limit: 25, offset: 0
});
console.log(customers);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationError`: The filters or pagination values are invalid.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task<List<CustomerDto>> ListCustomersAsync(CustomerFilterDto? filters)
```

</div>

**Parameters**

- `filters`: Optional [CustomerFilterDto](#CustomerFilterDto). Defaults to 50 results at offset zero.

**Returns** <code>List&lt;<a href="#CustomerDto">CustomerDto</a>&gt;</code>: Matching customers, or an empty collection.

**Example**

```csharp
var customers = await subscrio.Customers.ListCustomersAsync(
    new CustomerFilterDto(Status: "active", Search: "acme", Limit: 25));
Console.WriteLine(customers.Count);
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `ValidationException`: The filters or pagination values are invalid.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### archiveCustomer { #archivecustomer data-method-ts="archiveCustomer" data-method-net="ArchiveCustomerAsync" }

<span id="description_4" class="compatibility-anchor"></span>
<span id="signature_4" class="compatibility-anchor"></span>
<span id="inputs_4" class="compatibility-anchor"></span>
<span id="returns_4" class="compatibility-anchor"></span>
<span id="expected-results_4" class="compatibility-anchor"></span>
<span id="potential-errors_4" class="compatibility-anchor"></span>
<span id="example_4" class="compatibility-anchor"></span>

Mark the customer as archived while retaining their subscriptions and history. Archiving does not cancel subscriptions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
archiveCustomer(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: Customer key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.customers.archiveCustomer('acme');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The customer does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task ArchiveCustomerAsync(string key)
```

</div>

**Parameters**

- `key`: Customer key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Customers.ArchiveCustomerAsync("acme");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The customer does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### unarchiveCustomer { #unarchivecustomer data-method-ts="unarchiveCustomer" data-method-net="UnarchiveCustomerAsync" }

<span id="description_5" class="compatibility-anchor"></span>
<span id="signature_5" class="compatibility-anchor"></span>
<span id="inputs_5" class="compatibility-anchor"></span>
<span id="returns_5" class="compatibility-anchor"></span>
<span id="expected-results_5" class="compatibility-anchor"></span>
<span id="potential-errors_5" class="compatibility-anchor"></span>
<span id="example_5" class="compatibility-anchor"></span>

Restore the customer to active status without changing their subscriptions.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
unarchiveCustomer(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: Customer key.

**Returns** No returned value.

**Example**

```typescript
await subscrio.customers.unarchiveCustomer('acme');
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundError`: The customer does not exist.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task UnarchiveCustomerAsync(string key)
```

</div>

**Parameters**

- `key`: Customer key.

**Returns** No returned value.

**Example**

```csharp
await subscrio.Customers.UnarchiveCustomerAsync("acme");
```

<details class="method-errors" markdown="1">
<summary>Errors (1)</summary>

- `NotFoundException`: The customer does not exist.

</details>

</div>

</div>

<div class="method-entry" markdown="1">

### deleteCustomer { #deletecustomer data-method-ts="deleteCustomer" data-method-net="DeleteCustomerAsync" }

<span id="description_6" class="compatibility-anchor"></span>
<span id="signature_6" class="compatibility-anchor"></span>
<span id="inputs_6" class="compatibility-anchor"></span>
<span id="returns_6" class="compatibility-anchor"></span>
<span id="expected-results_6" class="compatibility-anchor"></span>
<span id="potential-errors_6" class="compatibility-anchor"></span>
<span id="example_6" class="compatibility-anchor"></span>
<span id="related-workflows" class="compatibility-anchor"></span>
<span id="customer-accounting-history" class="compatibility-anchor"></span>

Permanently delete an archived customer. Database cascades also delete dependent subscriptions and their overrides. Retained usage, credit, or related accounting history can block deletion; archive customers whose history must remain.

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
deleteCustomer(key: string): Promise<void>
```

</div>

**Parameters**

- `key`: Customer key.

**Returns** No returned value.

**Example**

```typescript
// acme is archived and has no retained accounting history.
await subscrio.customers.deleteCustomer('acme');
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `NotFoundError`: The customer does not exist.
- `ValidationError`: The customer is not archived.
- `ConflictError`: Retained accounting or related history prevents deletion.

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
Task DeleteCustomerAsync(string key)
```

</div>

**Parameters**

- `key`: Customer key.

**Returns** No returned value.

**Example**

```csharp
// acme is archived and has no retained accounting history.
await subscrio.Customers.DeleteCustomerAsync("acme");
```

<details class="method-errors" markdown="1">
<summary>Errors (3)</summary>

- `NotFoundException`: The customer does not exist.
- `DomainException`: The customer is not archived.
- `ConflictException`: Retained accounting or related history prevents deletion.

</details>

</div>

</div>

## Data types

Required means an input must be supplied, or an output property is guaranteed present.

<div class="data-type" markdown="1">

### CreateCustomerDto { #CreateCustomerDto }

Customer creation properties.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | None | Stable identifier. |
| `displayName` | <code>string \| undefined</code> | No | None | Optional label, at most 255 characters. |
| `email` | <code>string \| undefined</code> | No | None | Valid contact email address. |
| `externalBillingId` | <code>string \| undefined</code> | No | None | Unique payment-provider customer ID, at most 255 characters. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application metadata; updates replace the entire object. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | None | Stable identifier. |
| `DisplayName` | <code>string?</code> | No | null | Optional label, at most 255 characters. |
| `Email` | <code>string?</code> | No | null | Valid contact email address. |
| `ExternalBillingId` | <code>string?</code> | No | null | Unique payment-provider customer ID, at most 255 characters. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application metadata; updates replace the entire object. |

</div>

</div>

<div class="data-type" markdown="1">

### CustomerDto { #CustomerDto }

Customer details returned by queries and mutations.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `displayName` | <code>string \| null \| undefined</code> | No | Not applicable | Optional label, at most 255 characters. |
| `email` | <code>string \| null \| undefined</code> | No | Not applicable | Valid contact email address. |
| `externalBillingId` | <code>string \| null \| undefined</code> | No | Not applicable | Unique payment-provider customer ID, at most 255 characters. |
| `status` | <code>string</code> | Yes | Not applicable | Stored status. These methods write active or archived. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| null \| undefined</code> | No | Not applicable | Application metadata; updates replace the entire object. |
| `createdAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `updatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Key` | <code>string</code> | Yes | Not applicable | Stable identifier. |
| `DisplayName` | <code>string?</code> | Yes | Not applicable | Optional label, at most 255 characters. |
| `Email` | <code>string?</code> | Yes | Not applicable | Valid contact email address. |
| `ExternalBillingId` | <code>string?</code> | Yes | Not applicable | Unique payment-provider customer ID, at most 255 characters. |
| `Status` | <code>string</code> | Yes | Not applicable | Stored status. These methods write active or archived. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | Yes | Not applicable | Application metadata; updates replace the entire object. |
| `CreatedAt` | <code>string</code> | Yes | Not applicable | Creation time in UTC. |
| `UpdatedAt` | <code>string</code> | Yes | Not applicable | Last update time in UTC. |

</div>

</div>

<div class="data-type" markdown="1">

### UpdateCustomerDto { #UpdateCustomerDto }

Customer update properties.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `displayName` | <code>string \| undefined</code> | No | None | Optional label, at most 255 characters. |
| `email` | <code>string \| undefined</code> | No | None | Valid contact email address. |
| `externalBillingId` | <code>string \| undefined</code> | No | None | Unique payment-provider customer ID, at most 255 characters. |
| `metadata` | <code>Record&lt;string, unknown&gt; \| undefined</code> | No | None | Application metadata; updates replace the entire object. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `DisplayName` | <code>string?</code> | No | null | Optional label, at most 255 characters. |
| `Email` | <code>string?</code> | No | null | Valid contact email address. |
| `ExternalBillingId` | <code>string?</code> | No | null | Unique payment-provider customer ID, at most 255 characters. |
| `Metadata` | <code>Dictionary&lt;string, object?&gt;?</code> | No | null | Application metadata; updates replace the entire object. |

</div>

</div>

<div class="data-type" markdown="1">

### CustomerFilterDto { #CustomerFilterDto }

Customer search options. TypeScript requires limit and offset when supplying a filter object.

<div class="language-content" data-lang="ts" markdown="1">

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `limit` | <code>number</code> | Yes | 50 | Maximum page size, 1 to 100. |
| `offset` | <code>number</code> | Yes | 0 | Nonnegative number of rows to skip. |
| `status` | <code>&quot;active&quot; \| &quot;archived&quot; \| &quot;suspended&quot; \| &quot;deleted&quot; \| undefined</code> | No | None | active, archived, suspended, or deleted. |
| `search` | <code>string \| undefined</code> | No | None | Match the key, display name, or email. |
| `sortBy` | <code>&quot;key&quot; \| &quot;displayName&quot; \| &quot;createdAt&quot; \| undefined</code> | No | None | displayName, key, or createdAt; defaults to createdAt. |
| `sortOrder` | <code>&quot;asc&quot; \| &quot;desc&quot; \| undefined</code> | No | None | asc or desc; defaults to desc. |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Status` | <code>string?</code> | No | null | active, archived, suspended, or deleted. |
| `Search` | <code>string?</code> | No | null | Match the key, display name, or email. |
| `SortBy` | <code>string?</code> | No | null | displayName, key, or createdAt; defaults to createdAt. |
| `SortOrder` | <code>string?</code> | No | null | asc or desc; defaults to desc. |
| `Limit` | <code>int</code> | No | 50 | Maximum page size, 1 to 100. |
| `Offset` | <code>int</code> | No | 0 | Nonnegative number of rows to skip. |

</div>

</div>

## Related guides

- [Subscriptions](subscriptions.md): create subscriptions for a customer.
- [Credits](credits.md): customer wallets and retained accounting history.
- [Hooks](hooks.md): react to customer changes.
- [Stripe Integration](stripe-integration.md): match external billing IDs.
