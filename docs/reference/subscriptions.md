---
title: Subscriptions
description: Create customer subscriptions, update lifecycle dates and metadata, and store feature overrides on top of plan values.
---

# Subscriptions Service Reference

## Service Overview
Subscriptions tie customers to plans and billing cycles, track lifecycle dates, and store feature overrides. This service manages creation, updates, status synchronization, feature overrides, and batch maintenance tasks.

- Subscription keys are caller-supplied and immutable.
- Billing cycles derive plan/product context; updating a subscription’s billing cycle also changes its plan.
- Status is computed on read. TypeScript uses `subscription_status_view`. .NET uses the same CASE order in `SubscriptionMapper.ComputeStatus`.

TypeScript throws `ValidationError`, `NotFoundError`, `ConflictError`, and `DomainError`. .NET throws the matching `ValidationException`, `NotFoundException`, `ConflictException`, and `DomainException`. Potential Errors tables use the TypeScript names.

## Accessing the Service

=== "TypeScript"
    ```typescript
    import { Subscrio } from 'subscrio';

    const subscrio = new Subscrio({ database: { connectionString: process.env.DATABASE_URL! } });
    const subscriptions = subscrio.subscriptions;
    ```

=== ".NET"
    ```csharp
    using Subscrio.Core;

    var subscrio = new Subscrio(config);
    var subscriptions = subscrio.Subscriptions;
    ```

## Method Catalog

=== "TypeScript"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `createSubscription` | Creates a subscription for a customer and billing cycle | `Promise<SubscriptionDto>` |
    | `updateSubscription` | Updates lifecycle fields, metadata, or billing cycle | `Promise<SubscriptionDto>` |
    | `getSubscription` | Retrieves a subscription by key | `Promise<SubscriptionDto \| null>` |
    | `listSubscriptions` | Lists subscriptions via simple filters | `Promise<SubscriptionDto[]>` |
    | `findSubscriptions` | Advanced filtering (date ranges, overrides, metadata) | `Promise<SubscriptionDto[]>` |
    | `getSubscriptionsByCustomer` | Lists subscriptions for a customer | `Promise<SubscriptionDto[]>` |
    | `archiveSubscription` | Flags a subscription as archived | `Promise<void>` |
    | `unarchiveSubscription` | Clears archived flag | `Promise<void>` |
    | `deleteSubscription` | Deletes a subscription | `Promise<void>` |
    | `addFeatureOverride` | Adds or updates a feature override | `Promise<void>` |
    | `removeFeatureOverride` | Removes a feature override | `Promise<void>` |
    | `clearTemporaryOverrides` | Removes temporary overrides | `Promise<void>` |
    | `transitionExpiredSubscriptions` | Processes expired subscriptions and transitions them to configured plans | `Promise<TransitionExpiredSubscriptionsReport>` |

=== ".NET"
    | Method | Description | Returns |
    | --- | --- | --- |
    | `CreateSubscriptionAsync` | Creates a subscription for a customer and billing cycle | `Task<SubscriptionDto>` |
    | `UpdateSubscriptionAsync` | Updates lifecycle fields, metadata, or billing cycle | `Task<SubscriptionDto>` |
    | `GetSubscriptionAsync` | Retrieves a subscription by key | `Task<SubscriptionDto?>` |
    | `ListSubscriptionsAsync` | Lists subscriptions via simple filters | `Task<List<SubscriptionDto>>` |
    | `FindSubscriptionsAsync` | Advanced filtering (date ranges, overrides, metadata) | `Task<List<SubscriptionDto>>` |
    | `GetSubscriptionsByCustomerAsync` | Lists subscriptions for a customer | `Task<List<SubscriptionDto>>` |
    | `ArchiveSubscriptionAsync` | Flags a subscription as archived | `Task` |
    | `UnarchiveSubscriptionAsync` | Clears archived flag | `Task` |
    | `DeleteSubscriptionAsync` | Deletes a subscription | `Task` |
    | `AddFeatureOverrideAsync` | Adds or updates a feature override | `Task` |
    | `RemoveFeatureOverrideAsync` | Removes a feature override | `Task` |
    | `ClearTemporaryOverridesAsync` | Removes temporary overrides | `Task` |
    | `TransitionExpiredSubscriptionsAsync` | Processes expired subscriptions and transitions them to configured plans | `Task<TransitionExpiredSubscriptionsReport>` |

## Method Reference

### createSubscription

#### Description
Creates a subscription linking a customer to a plan/billing cycle and initializes lifecycle dates and metadata.

=== "TypeScript"
    #### Signature
    ```typescript
    createSubscription(dto: CreateSubscriptionDto): Promise<SubscriptionDto>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `dto` | `CreateSubscriptionDto` | Yes | Subscription definition including customer/billing cycle keys. |

    #### Input Properties
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | `key` | `string` | Yes | Subscription identifier (1–255 chars, alphanumeric with hyphens/underscores). |
    | `customerKey` | `string` | Yes | Existing customer key. |
    | `billingCycleKey` | `string` | Yes | Existing billing cycle key (derives plan/product). |
    | `activationDate` | `string \| Date` | No | Defaults to current time. |
    | `expirationDate` | `string \| Date` | No | Optional termination date. |
    | `cancellationDate` | `string \| Date` | No | Optional cancellation timestamp. |
    | `trialEndDate` | `string \| Date` | No | Controls `trial` status. |
    | `currentPeriodStart` | `string \| Date` | No | Defaults to now. |
    | `currentPeriodEnd` | `string \| Date` | No | Calculated from billing cycle if omitted. |
    | `stripeSubscriptionId` | `string` | No | Optional Stripe linkage (must be unique). |
    | `metadata` | `Record<string, unknown>` | No | JSON-safe metadata. |

    #### Returns
    `Promise<SubscriptionDto>` – persisted subscription snapshot with derived customer/product/plan keys.

    #### Return Properties
    | Field | Type | Description |
    | --- | --- | --- |
    | `key` | `string` | Subscription key. |
    | `customerKey` | `string` | Customer key. |
    | `productKey` | `string` | Product key (derived). |
    | `planKey` | `string` | Plan key (derived). |
    | `billingCycleKey` | `string` | Billing cycle key. |
    | `status` | `string` | `active`, `trial`, `cancelled`, etc. |
    | `isArchived` | `boolean` | Whether archived. |
    | `activationDate` | `string \| null` | ISO timestamp. |
    | `expirationDate` | `string \| null` | ISO timestamp. |
    | `cancellationDate` | `string \| null` | ISO timestamp. |
    | `trialEndDate` | `string \| null` | ISO timestamp. |
    | `currentPeriodStart` | `string \| null` | ISO timestamp. |
    | `currentPeriodEnd` | `string \| null` | ISO timestamp. |
    | `stripeSubscriptionId` | `string \| null` | Stripe subscription ID. |
    | `metadata` | `Record<string, unknown> \| null` | Metadata blob. |
    | `customer` | `CustomerDto \| null` | `null` on create, get, and get-by-customer. Populated on list and find. |
    | `createdAt` | `string` | ISO timestamp. |
    | `updatedAt` | `string` | ISO timestamp. |

    #### Example
    ```typescript
    await subscriptions.createSubscription({
      key: 'sub_1001',
      customerKey: 'cust_123',
      billingCycleKey: 'annual-pro-12m',
      activationDate: new Date().toISOString(),
      metadata: { source: 'self-serve' }
    });
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<SubscriptionDto> CreateSubscriptionAsync(CreateSubscriptionDto dto)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `dto` | `CreateSubscriptionDto` | Yes | Subscription definition including customer/billing cycle keys. |

    #### Input Properties
    | Property | Type | Required | Description |
    | --- | --- | --- | --- |
    | `Key` | `string` | Yes | Subscription identifier (1–255 chars, alphanumeric with hyphens/underscores). |
    | `CustomerKey` | `string` | Yes | Existing customer key. |
    | `BillingCycleKey` | `string` | Yes | Existing billing cycle key (derives plan/product). |
    | `ActivationDate` | `DateTime?` | No | Defaults to current time. |
    | `ExpirationDate` | `DateTime?` | No | Optional termination date. |
    | `CancellationDate` | `DateTime?` | No | Optional cancellation timestamp. |
    | `TrialEndDate` | `DateTime?` | No | Controls `trial` status. |
    | `CurrentPeriodStart` | `DateTime?` | No | Defaults to now. |
    | `CurrentPeriodEnd` | `DateTime?` | No | Calculated from billing cycle if omitted. |
    | `StripeSubscriptionId` | `string?` | No | Optional Stripe linkage (must be unique). |
    | `Metadata` | `Dictionary<string, object?>?` | No | JSON-safe metadata. |

    #### Returns
    `Task<SubscriptionDto>` – persisted subscription snapshot with derived customer/product/plan keys.

    #### Return Properties
    | Property | Type | Description |
    | --- | --- | --- |
    | `Key` | `string` | Subscription key. |
    | `CustomerKey` | `string` | Customer key. |
    | `ProductKey` | `string` | Product key (derived). |
    | `PlanKey` | `string` | Plan key (derived). |
    | `BillingCycleKey` | `string` | Billing cycle key. |
    | `Status` | `string` | `active`, `trial`, `cancelled`, etc. |
    | `IsArchived` | `bool` | Whether archived. |
    | `ActivationDate` | `string?` | ISO timestamp. |
    | `ExpirationDate` | `string?` | ISO timestamp. |
    | `CancellationDate` | `string?` | ISO timestamp. |
    | `TrialEndDate` | `string?` | ISO timestamp. |
    | `CurrentPeriodStart` | `string?` | ISO timestamp. |
    | `CurrentPeriodEnd` | `string?` | ISO timestamp. |
    | `StripeSubscriptionId` | `string?` | Stripe subscription ID. |
    | `Metadata` | `Dictionary<string, object?>?` | Metadata blob. |
    | `Customer` | `CustomerDto?` | `null` on create, get, and get-by-customer. Populated on list and find. |
    | `CreatedAt` | `string` | ISO timestamp. |
    | `UpdatedAt` | `string` | ISO timestamp. |

    #### Example
    ```csharp
    await subscrio.Subscriptions.CreateSubscriptionAsync(new CreateSubscriptionDto(
        Key: "sub_1001",
        CustomerKey: "cust_123",
        BillingCycleKey: "annual-pro-12m",
        ActivationDate: DateTime.UtcNow,
        Metadata: new Dictionary<string, object?> { ["source"] = "self-serve" }
    ));
    ```

#### Expected Results
- Validates DTO and lifecycle dates.
- Ensures customer and billing cycle exist (deriving plan/product).
- Confirms subscription key and Stripe subscription ID are unique.
- Backfills `currentPeriodEnd` when omitted.
- Persists subscription; status is later read from the PostgreSQL view.

#### Potential Errors

| Error | When |
| --- | --- |
| `ValidationError` | DTO invalid or lifecycle math fails. |
| `NotFoundError` | Customer, billing cycle, plan, or product missing. |
| `ConflictError` | Duplicate subscription key or Stripe ID. |

### updateSubscription

#### Description
Applies partial updates to lifecycle dates, billing cycle, Stripe linkage, or metadata.

=== "TypeScript"
    #### Signature
    ```typescript
    updateSubscription(subscriptionKey: string, dto: UpdateSubscriptionDto): Promise<SubscriptionDto>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key to update. |
    | `dto` | `UpdateSubscriptionDto` | Yes | Partial payload of mutable fields. |

    #### Input Properties
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | `billingCycleKey` | `string` | No | Moves subscription to a new plan/billing cycle. |
    | `expirationDate` | `string \| Date` | No | Updates expiration. |
    | `cancellationDate` | `string \| Date` | No | Updates cancellation timestamp. |
    | `trialEndDate` | `string \| Date` | No | Replaces the trial end. `null` and an empty string are normalized to omission and do not clear the stored value. |
    | `clearTrialEndDate` | `boolean` | No | Set to `true` to clear the stored trial end. This takes precedence over `trialEndDate`. |
    | `currentPeriodStart` | `string \| Date` | No | Adjusts current period. |
    | `currentPeriodEnd` | `string \| Date` | No | Overrides calculated end. |
    | `stripeSubscriptionId` | `string` | No | Replaces Stripe linkage. The update DTO has no explicit clear operation. `null` is invalid and an empty string is treated as omission. |
    | `metadata` | `Record<string, unknown>` | No | Replaces metadata blob. |

    #### Returns
    `Promise<SubscriptionDto>` – updated subscription snapshot.

    #### Return Properties
    Same as `createSubscription` (see SubscriptionDto).

    #### Example
    ```typescript
    await subscriptions.updateSubscription('sub_1001', {
      billingCycleKey: 'monthly-pro',
      currentPeriodEnd: new Date().toISOString()
    });
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<SubscriptionDto> UpdateSubscriptionAsync(string subscriptionKey, UpdateSubscriptionDto dto)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key to update. |
    | `dto` | `UpdateSubscriptionDto` | Yes | Partial payload of mutable fields. |

    #### Input Properties
    | Property | Type | Required | Description |
    | --- | --- | --- | --- |
    | `BillingCycleKey` | `string?` | No | Moves subscription to a new plan/billing cycle. |
    | `ExpirationDate` | `DateTime?` | No | Updates expiration. |
    | `CancellationDate` | `DateTime?` | No | Updates cancellation timestamp. |
    | `TrialEndDate` | `DateTime?` | No | Replaces the trial end. `null` means the field is omitted. |
    | `ClearTrialEndDate` | `bool` | No | Set to `true` to clear the stored trial end. This takes precedence over `TrialEndDate`. Defaults to `false`. |
    | `CurrentPeriodStart` | `DateTime?` | No | Adjusts current period. |
    | `CurrentPeriodEnd` | `DateTime?` | No | Overrides calculated end. |
    | `StripeSubscriptionId` | `string?` | No | Replaces Stripe linkage when non-null. The update DTO has no explicit clear operation. |
    | `Metadata` | `Dictionary<string, object?>?` | No | Replaces metadata blob. |

    #### Returns
    `Task<SubscriptionDto>` – updated subscription snapshot.

    #### Return Properties
    Same as `CreateSubscriptionAsync` (see SubscriptionDto).

    #### Example
    ```csharp
    await subscrio.Subscriptions.UpdateSubscriptionAsync("sub_1001", new UpdateSubscriptionDto(
        BillingCycleKey: "monthly-pro",
        CurrentPeriodEnd: DateTime.UtcNow
    ));
    ```

#### Expected Results
- Validates DTO and detects explicitly cleared fields.
- Loads subscription; rejects if archived.
- Applies lifecycle and billing cycle changes (updating plan ID when billing cycle changes).
- Leaves `trialEndDate` and `TrialEndDate` unchanged when omitted. Use the explicit clear flag to remove the value.
- Updates Stripe linkage only when a non-null ID is supplied. Neither update DTO currently clears it.
- Persists entity; status continues to be resolved by the database view.

#### Potential Errors

| Error | When |
| --- | --- |
| `ValidationError` | DTO invalid. |
| `NotFoundError` | Subscription or referenced billing cycle missing. |
| `DomainError` | Subscription archived (must unarchive first). |

### getSubscription

#### Description
Retrieves a subscription by key, returning `null` when it does not exist.

=== "TypeScript"
    #### Signature
    ```typescript
    getSubscription(subscriptionKey: string): Promise<SubscriptionDto | null>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key to fetch. |

    #### Returns
    `Promise<SubscriptionDto | null>` – subscription snapshot when found, `null` when missing.

    #### Return Properties
    When found: `SubscriptionDto` (see createSubscription). When missing: `null`.

    #### Example
    ```typescript
    const subscription = await subscriptions.getSubscription('sub_1001');
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<SubscriptionDto?> GetSubscriptionAsync(string subscriptionKey)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key to fetch. |

    #### Returns
    `Task<SubscriptionDto?>` – subscription snapshot when found, `null` when missing.

    #### Return Properties
    When found: `SubscriptionDto` (see CreateSubscriptionAsync). When missing: `null`.

    #### Example
    ```csharp
    var subscription = await subscrio.Subscriptions.GetSubscriptionAsync("sub_1001");
    ```

#### Expected Results
- Loads subscription via repository and maps to DTO.

#### Potential Errors

| Error | When |
| --- | --- |
| _None_ | Missing subscriptions return `null`. |

### listSubscriptions

#### Description
Lists subscriptions using simple filters. Both libraries resolve customer, product, and plan keys and apply the resolved IDs in the database query. An unknown key returns an empty list instead of accidentally running an unfiltered query. TypeScript defaults to 50 rows and implements the documented sort fields except `updatedAt`, which currently sorts by `createdAt`. .NET has no default limit and always orders by `CreatedAt` descending, regardless of `SortBy` or `SortOrder`.

=== "TypeScript"
    #### Signature
    ```typescript
    listSubscriptions(filters?: SubscriptionFilterDto): Promise<SubscriptionDto[]>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `filters` | `SubscriptionFilterDto` | No | Optional filter object (defaults limit 50, offset 0). |

    #### Input Properties
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | No | Filter by customer key. |
    | `productKey` | `string` | No | Filter by product key. |
    | `planKey` | `string` | No | Filter by plan key. |
    | `status` | `string` | No | Filter by status. |
    | `isArchived` | `boolean` | No | Filter by archived state. |
    | `sortBy` | `string` | No | Sort field. `updatedAt` is accepted but currently sorts by `createdAt`. |
    | `sortOrder` | `'asc' \| 'desc'` | No | Sort direction. |
    | `limit` | `number` | No | Page size (default 50). |
    | `offset` | `number` | No | Skip count (default 0). |

    #### Returns
    `Promise<SubscriptionDto[]>` – array of subscriptions matching filters.

    #### Return Properties
    Each element is `SubscriptionDto` (see createSubscription).

    #### Example
    ```typescript
    const activeSubs = await subscriptions.listSubscriptions({
      productKey: 'pro-suite',
      status: 'active',
      isArchived: false
    });
    activeSubs.forEach(sub => console.log(sub.customer?.displayName));
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<List<SubscriptionDto>> ListSubscriptionsAsync(SubscriptionFilterDto? filters = null)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `filters` | `SubscriptionFilterDto?` | No | Optional filter object. Omitted `Limit` means no limit; omitted `Offset` means zero. |

    #### Input Properties
    | Property | Type | Required | Description |
    | --- | --- | --- | --- |
    | `CustomerKey` | `string?` | No | Filter by customer key. |
    | `ProductKey` | `string?` | No | Filter by product key. |
    | `PlanKey` | `string?` | No | Filter by plan key. |
    | `Status` | `string?` | No | Filter by status. |
    | `IsArchived` | `bool?` | No | Filter by archived state. |
    | `SortBy` | `string?` | No | Accepted and validated. The current repository ignores it and orders by `CreatedAt` descending. |
    | `SortOrder` | `string?` | No | Accepted and validated. The current repository ignores it. |
    | `Limit` | `int?` | No | Page size. No limit when omitted. |
    | `Offset` | `int?` | No | Skip count. |

    #### Returns
    `Task<List<SubscriptionDto>>` – array of subscriptions matching filters.

    #### Return Properties
    Each element is `SubscriptionDto` (see CreateSubscriptionAsync).

    #### Example
    ```csharp
    var activeSubs = await subscrio.Subscriptions.ListSubscriptionsAsync(new SubscriptionFilterDto(
        ProductKey: "pro-suite",
        Status: "active",
        IsArchived: false
    ));
    foreach (var sub in activeSubs) Console.WriteLine(sub.Customer?.DisplayName);
    ```

#### Expected Results
- Validates filters.
- Resolves external keys to IDs; returns empty array if lookups fail.
- Queries the status view so status filters reflect real time.
- Each result includes the full `customer` object (CustomerDto) populated from the customers table join.
- TypeScript returns at most 50 rows when the caller omits `limit`. .NET is unbounded when `Limit` is `null`.

#### Potential Errors

| Error | When |
| --- | --- |
| `ValidationError` | Filters invalid. |

### findSubscriptions

#### Description
Performs advanced filtering. Both libraries apply customer, product, plan, billing-cycle, status, archive, date-range, Stripe-ID, trial, paging, and feature-override-presence filters. TypeScript and .NET accept but do not apply `featureKey` / `FeatureKey` or the metadata filters. TypeScript applies `hasFeatureOverrides` after loading overrides. .NET applies `HasFeatureOverrides` after the database query. Sorting has the same runtime limitations described for `listSubscriptions`.

=== "TypeScript"
    #### Signature
    ```typescript
    findSubscriptions(filters: DetailedSubscriptionFilterDto): Promise<SubscriptionDto[]>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `filters` | `DetailedSubscriptionFilterDto` | Yes | Rich filter object (dates, metadata, overrides, booleans). |

    #### Input Properties
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | No | Filter by customer key. |
    | `productKey` | `string` | No | Filter by product key. |
    | `planKey` | `string` | No | Filter by plan key. |
    | `billingCycleKey` | `string` | No | Filter by billing cycle key. |
    | `status` | `string` | No | Filter by status. |
    | `isArchived` | `boolean` | No | Filter by archived state. |
    | `activationDateFrom` | `Date` | No | Start of activation date range. |
    | `activationDateTo` | `Date` | No | End of activation date range. |
    | `expirationDateFrom` | `Date` | No | Start of expiration date range. |
    | `expirationDateTo` | `Date` | No | End of expiration date range. |
    | `trialEndDateFrom` | `Date` | No | Start of trial end date range. |
    | `trialEndDateTo` | `Date` | No | End of trial end date range. |
    | `currentPeriodStartFrom` | `Date` | No | Start of period start range. |
    | `currentPeriodStartTo` | `Date` | No | End of period start range. |
    | `currentPeriodEndFrom` | `Date` | No | Start of period end range. |
    | `currentPeriodEndTo` | `Date` | No | End of period end range. |
    | `hasStripeId` | `boolean` | No | Filter by presence of Stripe ID. |
    | `hasTrial` | `boolean` | No | Filter by trial status. |
    | `hasFeatureOverrides` | `boolean` | No | Filter by presence of feature overrides. |
    | `featureKey` | `string` | No | Accepted but not applied. |
    | `metadataKey` | `string` | No | Accepted but not applied. |
    | `metadataValue` | `unknown` | No | Accepted but not applied. |
    | `sortBy` | `string` | No | Sort field. `updatedAt` currently sorts by `createdAt`. |
    | `sortOrder` | `'asc' \| 'desc'` | No | Sort direction. |
    | `limit` | `number` | No | Page size (default 50). |
    | `offset` | `number` | No | Skip count (default 0). |

    #### Returns
    `Promise<SubscriptionDto[]>` – array of subscriptions matching filters.

    #### Return Properties
    Each element is `SubscriptionDto` (see createSubscription).

    #### Example
    ```typescript
    const subs = await subscriptions.findSubscriptions({
      expirationDateFrom: new Date('2025-01-01'),
      expirationDateTo: new Date('2025-12-31'),
      hasFeatureOverrides: true
    });
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<List<SubscriptionDto>> FindSubscriptionsAsync(DetailedSubscriptionFilterDto filters)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `filters` | `DetailedSubscriptionFilterDto` | Yes | Rich filter object (dates, metadata, overrides, booleans). |

    #### Input Properties
    Same as TypeScript with PascalCase (e.g. `ActivationDateFrom`, `ExpirationDateTo`, `HasFeatureOverrides`).

    #### Returns
    `Task<List<SubscriptionDto>>` – array of subscriptions matching filters.

    #### Return Properties
    Each element is `SubscriptionDto` (see CreateSubscriptionAsync).

    #### Example
    ```csharp
    var subs = await subscrio.Subscriptions.FindSubscriptionsAsync(
        new DetailedSubscriptionFilterDto(
            ExpirationDateFrom: new DateTime(2025, 1, 1),
            ExpirationDateTo: new DateTime(2025, 12, 31),
            HasFeatureOverrides: true
        )
    );
    ```

#### Expected Results
- Validates filters.
- Resolves external keys before querying. Unknown keys return an empty list.
- Applies key, status, archive, date-range, Stripe-ID, and trial filters against the status view.
- Applies feature-override presence after the base query. The feature-key and metadata fields remain unused.
- Each result includes the full `customer` object (CustomerDto) populated from the customers table join.

#### Potential Errors

| Error | When |
| --- | --- |
| `ValidationError` | Filters invalid. |

### getSubscriptionsByCustomer

#### Description
Returns all subscriptions for a specific customer key.

=== "TypeScript"
    #### Signature
    ```typescript
    getSubscriptionsByCustomer(customerKey: string): Promise<SubscriptionDto[]>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |

    #### Returns
    `Promise<SubscriptionDto[]>` – array of subscriptions for the customer.

    #### Return Properties
    Each element is `SubscriptionDto` (see createSubscription).

    #### Example
    ```typescript
    const customerSubs = await subscriptions.getSubscriptionsByCustomer('cust_123');
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<List<SubscriptionDto>> GetSubscriptionsByCustomerAsync(string customerKey)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | Yes | Customer identifier. |

    #### Returns
    `Task<List<SubscriptionDto>>` – array of subscriptions for the customer.

    #### Return Properties
    Each element is `SubscriptionDto` (see CreateSubscriptionAsync).

    #### Example
    ```csharp
    var customerSubs = await subscrio.Subscriptions.GetSubscriptionsByCustomerAsync("cust_123");
    ```

#### Expected Results
- Ensures customer exists, then queries the status view for their subscriptions.

#### Potential Errors

| Error | When |
| --- | --- |
| `NotFoundError` | Customer key missing. |

### archiveSubscription

#### Description
Marks a subscription as archived (preventing further updates until unarchived).

=== "TypeScript"
    #### Signature
    ```typescript
    archiveSubscription(subscriptionKey: string): Promise<void>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key to archive. |

    #### Returns
    `Promise<void>` – resolves when archived.

    #### Example
    ```typescript
    await subscriptions.archiveSubscription('sub_legacy');
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task ArchiveSubscriptionAsync(string subscriptionKey)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key to archive. |

    #### Returns
    `Task` – completes when archived.

    #### Example
    ```csharp
    await subscrio.Subscriptions.ArchiveSubscriptionAsync("sub_legacy");
    ```

#### Expected Results
- Loads subscription, calls entity `archive()`, persists. Status automatically reflects change via the view.

#### Potential Errors

| Error | When |
| --- | --- |
| `NotFoundError` | Subscription missing. |

### unarchiveSubscription

#### Description
Clears the archived flag, allowing updates again.

=== "TypeScript"
    #### Signature
    ```typescript
    unarchiveSubscription(subscriptionKey: string): Promise<void>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key to unarchive. |

    #### Returns
    `Promise<void>` – resolves when unarchived.

    #### Example
    ```typescript
    await subscriptions.unarchiveSubscription('sub_legacy');
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task UnarchiveSubscriptionAsync(string subscriptionKey)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key to unarchive. |

    #### Returns
    `Task` – completes when unarchived.

    #### Example
    ```csharp
    await subscrio.Subscriptions.UnarchiveSubscriptionAsync("sub_legacy");
    ```

#### Expected Results
- Loads subscription, calls `unarchive()`, persists.

#### Potential Errors

| Error | When |
| --- | --- |
| `NotFoundError` | Subscription missing. |

### deleteSubscription

#### Description
Deletes a subscription record irrespective of status.

=== "TypeScript"
    #### Signature
    ```typescript
    deleteSubscription(subscriptionKey: string): Promise<void>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key targeted for deletion. |

    #### Returns
    `Promise<void>` – resolves when deleted.

    #### Example
    ```typescript
    await subscriptions.deleteSubscription('sub_deprecated');
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task DeleteSubscriptionAsync(string subscriptionKey)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key targeted for deletion. |

    #### Returns
    `Task` – completes when deleted.

    #### Example
    ```csharp
    await subscrio.Subscriptions.DeleteSubscriptionAsync("sub_deprecated");
    ```

#### Expected Results
- Loads subscription, ensures it exists, deletes record.

#### Potential Errors

| Error | When |
| --- | --- |
| `NotFoundError` | Subscription missing. |

### addFeatureOverride

#### Description
Adds or updates a subscription-level feature override with optional override type (permanent or temporary).

=== "TypeScript"
    #### Signature
    ```typescript
    addFeatureOverride(
      subscriptionKey: string,
      featureKey: string,
      value: string,
      overrideType?: OverrideType
    ): Promise<void>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Target subscription key. |
    | `featureKey` | `string` | Yes | Feature to override. |
    | `value` | `string` | Yes | String value validated against feature type. |
    | `overrideType` | `OverrideType` | No | `OverrideType.Permanent` or `OverrideType.Temporary`; defaults to Permanent. |

    #### Returns
    `Promise<void>` – resolves when override is added.

    #### Example
    ```typescript
    await subscriptions.addFeatureOverride('sub_1001', 'max-projects', '200', OverrideType.Temporary);
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task AddFeatureOverrideAsync(
        string subscriptionKey,
        string featureKey,
        string value,
        OverrideType overrideType = OverrideType.Permanent
    )
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Target subscription key. |
    | `featureKey` | `string` | Yes | Feature to override. |
    | `value` | `string` | Yes | String value validated against feature type. |
    | `overrideType` | `OverrideType` | No | `OverrideType.Permanent` or `OverrideType.Temporary`; defaults to Permanent. |

    #### Returns
    `Task` – completes when override is added.

    #### Example
    ```csharp
    await subscrio.Subscriptions.AddFeatureOverrideAsync(
        "sub_1001",
        "max-projects",
        "200",
        OverrideType.Temporary
    );
    ```

#### Expected Results
- Loads subscription; rejects if archived.
- Loads feature and validates value via `FeatureValueValidator`.
- Adds override (replacing existing entry) and saves.

#### Potential Errors

| Error | When |
| --- | --- |
| `NotFoundError` | Subscription or feature missing. |
| `DomainError` | Subscription archived. |
| `ValidationError` | Value incompatible with feature type. |

### removeFeatureOverride

#### Description
Removes a specific feature override from a subscription.

=== "TypeScript"
    #### Signature
    ```typescript
    removeFeatureOverride(subscriptionKey: string, featureKey: string): Promise<void>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key. |
    | `featureKey` | `string` | Yes | Feature key to remove. |

    #### Returns
    `Promise<void>` – resolves when override is removed.

    #### Example
    ```typescript
    await subscriptions.removeFeatureOverride('sub_1001', 'max-projects');
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task RemoveFeatureOverrideAsync(string subscriptionKey, string featureKey)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key. |
    | `featureKey` | `string` | Yes | Feature key to remove. |

    #### Returns
    `Task` – completes when override is removed.

    #### Example
    ```csharp
    await subscrio.Subscriptions.RemoveFeatureOverrideAsync("sub_1001", "max-projects");
    ```

#### Expected Results
- Ensures subscription exists and is not archived.
- Removes override if present and persists.

#### Potential Errors

| Error | When |
| --- | --- |
| `NotFoundError` | Subscription missing. |
| `DomainError` | Subscription archived. |

### clearTemporaryOverrides

#### Description
Deletes only temporary overrides for a subscription; permanent overrides are retained.

=== "TypeScript"
    #### Signature
    ```typescript
    clearTemporaryOverrides(subscriptionKey: string): Promise<void>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key. |

    #### Returns
    `Promise<void>` – resolves when temporary overrides are cleared.

    #### Example
    ```typescript
    await subscriptions.clearTemporaryOverrides('sub_1001');
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task ClearTemporaryOverridesAsync(string subscriptionKey)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `subscriptionKey` | `string` | Yes | Subscription key. |

    #### Returns
    `Task` – completes when temporary overrides are cleared.

    #### Example
    ```csharp
    await subscrio.Subscriptions.ClearTemporaryOverridesAsync("sub_1001");
    ```

#### Expected Results
- Ensures subscription exists and is active.
- Removes overrides flagged as temporary and saves.

#### Potential Errors

| Error | When |
| --- | --- |
| `NotFoundError` | Subscription missing. |
| `DomainError` | Subscription archived. |

### transitionExpiredSubscriptions

#### Description
Processes expired subscriptions and automatically transitions them to configured plans. The method finds expired subscriptions whose plans have an `onExpireTransitionToBillingCycleKey`, creates each replacement subscription first, and archives the old subscription only after replacement creation succeeds.

=== "TypeScript"
    #### Signature
    ```typescript
    transitionExpiredSubscriptions(): Promise<TransitionExpiredSubscriptionsReport>
    ```

    #### Inputs
    None – automatically finds expired subscriptions with transition plans.

    #### Returns
    `Promise<TransitionExpiredSubscriptionsReport>` – report with counts and errors.

    #### Return Properties
    | Field | Type | Description |
    | --- | --- | --- |
    | `processed` | `number` | Total subscriptions processed. |
    | `transitioned` | `number` | Subscriptions successfully transitioned. |
    | `archived` | `number` | Subscriptions archived. |
    | `errors` | `Array<{subscriptionKey: string, error: string}>` | Errors encountered during processing. |

    #### Example
    ```typescript
    const report = await subscriptions.transitionExpiredSubscriptions();
    console.log(`Processed: ${report.processed}, Transitioned: ${report.transitioned}`);
    report.errors.forEach(err => console.error(`${err.subscriptionKey}: ${err.error}`));
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<TransitionExpiredSubscriptionsReport> TransitionExpiredSubscriptionsAsync()
    ```

    #### Inputs
    None – automatically finds expired subscriptions with transition plans.

    #### Returns
    `Task<TransitionExpiredSubscriptionsReport>` – report with counts and errors.

    #### Return Properties
    | Property | Type | Description |
    | --- | --- | --- |
    | `Processed` | `int` | Total subscriptions processed. |
    | `Transitioned` | `int` | Subscriptions successfully transitioned. |
    | `Archived` | `int` | Subscriptions archived. |
    | `Errors` | `List<TransitionError>` | Errors encountered (`SubscriptionKey`, `Error`). |

    #### Example
    ```csharp
    var report = await subscrio.Subscriptions.TransitionExpiredSubscriptionsAsync();
    Console.WriteLine($"Processed: {report.Processed}, Transitioned: {report.Transitioned}");
    foreach (var err in report.Errors) Console.WriteLine($"{err.SubscriptionKey}: {err.Error}");
    ```

#### Expected Results
- Queries expired subscriptions (status='expired', not archived) with transition-enabled plans using an optimized database join.
- For each expired subscription:
  - Creates and persists the replacement subscription for the transition billing cycle
  - Marks the old subscription as transitioned only after replacement creation succeeds, setting `isArchived = true` and the transition timestamp
  - Generates versioned subscription key: `original-key` → `original-key-v1` (or increments if already versioned)
  - Preserves metadata from old subscription
  - Does not carry over feature overrides or Stripe subscription IDs
- Returns a report of processed, transitioned, and archived subscriptions.

#### Potential Errors
Errors are captured in the report's `errors` array rather than thrown. Common errors include:
- Plan not found
- Customer not found
- Billing cycle not found
- Generated subscription key already exists

#### Usage Notes
- **When to call**: Typically run as a scheduled job (cron, background worker) to process expired subscriptions periodically.
- **Idempotent**: Safe to run multiple times; only processes subscriptions that haven't been transitioned yet.
- **Stripe integration**: Original Stripe subscription ID remains on the archived subscription. The new subscription does not have a Stripe ID (you may need to create a new Stripe subscription if using Stripe).
- **Query optimization**: Uses an optimized database query with joins to only fetch expired subscriptions whose plans have transition requirements.

> Need the full explanation of how each status works? See [`subscription-lifecycle.md`](./subscription-lifecycle.md) for detailed rules, diagrams, and practical guidance.

## DTO Reference

### CreateSubscriptionDto

=== "TypeScript"
    | Field | Type | Required | Notes |
    | --- | --- | --- | --- |
    | `key` | `string` | Yes | 1–255 chars, alphanumeric with `-`/`_`. |
    | `customerKey` | `string` | Yes | Existing customer key. |
    | `billingCycleKey` | `string` | Yes | Existing billing cycle key (derives plan/product). |
    | `activationDate` | `string \| Date` | No | Defaults to current time. |
    | `expirationDate` | `string \| Date` | No | Optional. |
    | `cancellationDate` | `string \| Date` | No | Optional. |
    | `trialEndDate` | `string \| Date` | No | Optional; influences `trial` status. |
    | `currentPeriodStart` | `string \| Date` | No | Defaults to now. |
    | `currentPeriodEnd` | `string \| Date` | No | Calculated from billing cycle if omitted. |
    | `stripeSubscriptionId` | `string` | No | Optional Stripe linkage; must be unique. |
    | `metadata` | `Record<string, unknown>` | No | Free-form. |

=== ".NET"
    | Property | Type | Required | Notes |
    | --- | --- | --- | --- |
    | `Key` | `string` | Yes | 1–255 chars, alphanumeric with `-`/`_`. |
    | `CustomerKey` | `string` | Yes | Existing customer key. |
    | `BillingCycleKey` | `string` | Yes | Existing billing cycle key (derives plan/product). |
    | `ActivationDate` | `DateTime?` | No | Defaults to current time. |
    | `ExpirationDate` | `DateTime?` | No | Optional. |
    | `CancellationDate` | `DateTime?` | No | Optional. |
    | `TrialEndDate` | `DateTime?` | No | Optional; influences `trial` status. |
    | `CurrentPeriodStart` | `DateTime?` | No | Defaults to now. |
    | `CurrentPeriodEnd` | `DateTime?` | No | Calculated from billing cycle if omitted. |
    | `StripeSubscriptionId` | `string` | No | Optional Stripe linkage; must be unique. |
    | `Metadata` | `Dictionary<string, object?>` | No | Free-form. |

### UpdateSubscriptionDto

=== "TypeScript"
    Fields optional: `billingCycleKey`, `expirationDate`, `cancellationDate`, `trialEndDate`, `clearTrialEndDate`, `currentPeriodStart`, `currentPeriodEnd`, `stripeSubscriptionId`, `metadata`. Activation date and customer key are immutable. Omission leaves the trial end unchanged. Set `clearTrialEndDate: true` to remove it. The Stripe subscription ID can be replaced but not explicitly cleared.

=== ".NET"
    Properties optional: `BillingCycleKey`, `ExpirationDate`, `CancellationDate`, `TrialEndDate`, `ClearTrialEndDate`, `CurrentPeriodStart`, `CurrentPeriodEnd`, `StripeSubscriptionId`, `Metadata`. Activation date and customer key are immutable in the normal service API. Omission leaves the trial end unchanged. Set `ClearTrialEndDate: true` to remove it. A non-null Stripe subscription ID is written, but the DTO has no explicit clear operation.

### SubscriptionDto

=== "TypeScript"
    | Field | Type | Required | Notes |
    | --- | --- | --- | --- |
    | `key` | `string` | Yes | Subscription identifier. |
    | `customerKey` | `string` | Yes | Derived from customer. |
    | `productKey` | `string` | Yes | Derived from plan. |
    | `planKey` | `string` | Yes | Derived from billing cycle. |
    | `billingCycleKey` | `string` | Yes | |
    | `status` | `string` | Yes | `'pending'`, `'active'`, `'trial'`, `'cancelled'`, `'cancellation_pending'`, or `'expired'`. |
    | `isArchived` | `boolean` | Yes | Archive flag. |
    | `activationDate` | `string \| null` | No | |
    | `expirationDate` | `string \| null` | No | |
    | `cancellationDate` | `string \| null` | No | |
    | `trialEndDate` | `string \| null` | No | |
    | `currentPeriodStart` | `string \| null` | No | |
    | `currentPeriodEnd` | `string \| null` | No | `null` when billing cycle duration is `forever`. |
    | `stripeSubscriptionId` | `string \| null` | No | |
    | `metadata` | `Record<string, unknown> \| null` | No | |
    | `customer` | `CustomerDto \| null` | No | Full customer object from join (`listSubscriptions`, `findSubscriptions`). |
    | `featureOverrides` | `FeatureOverrideDto[]` | No | Loaded overrides. An empty array means the subscription has no overrides. This field is currently TypeScript-only. |
    | `createdAt` | `string` | Yes | ISO timestamp. |
    | `updatedAt` | `string` | Yes | ISO timestamp. |

=== ".NET"
    | Property | Type | Required | Notes |
    | --- | --- | --- | --- |
    | `Key` | `string` | Yes | Subscription identifier. |
    | `CustomerKey` | `string` | Yes | Derived from customer. |
    | `ProductKey` | `string` | Yes | Derived from plan. |
    | `PlanKey` | `string` | Yes | Derived from billing cycle. |
    | `BillingCycleKey` | `string` | Yes | |
    | `Status` | `string` | Yes | `'pending'`, `'active'`, `'trial'`, `'cancelled'`, `'cancellation_pending'`, or `'expired'`. |
    | `IsArchived` | `bool` | Yes | Archive flag. |
    | `ActivationDate` | `string?` | No | ISO timestamp. |
    | `ExpirationDate` | `string?` | No | ISO timestamp. |
    | `CancellationDate` | `string?` | No | ISO timestamp. |
    | `TrialEndDate` | `string?` | No | ISO timestamp. |
    | `CurrentPeriodStart` | `string?` | No | ISO timestamp. |
    | `CurrentPeriodEnd` | `string?` | No | `null` when billing cycle duration is `forever`. |
    | `StripeSubscriptionId` | `string?` | No | |
    | `Metadata` | `Dictionary<string, object?>?` | No | |
    | `Customer` | `CustomerDto?` | No | Full customer object from join (`ListSubscriptionsAsync`, `FindSubscriptionsAsync`). |
    | `CreatedAt` | `string` | Yes | ISO timestamp. |
    | `UpdatedAt` | `string` | Yes | ISO timestamp. |

.NET loads feature overrides while constructing its domain subscription, but the current .NET `SubscriptionDto` does not expose them. Use the feature-checker and override-management methods when consuming the .NET application API.

### FeatureOverrideDto

=== "TypeScript"
    | Field | Type | Notes |
    | --- | --- | --- |
    | `featureKey` | `string` | Public feature key. |
    | `value` | `string` | Stored override value. |
    | `type` | `string` | Override type, such as `permanent` or `temporary`. |
    | `createdAt` | `string` | ISO timestamp. |

=== ".NET"
    .NET declares a lower-level `FeatureOverrideDto` with `FeatureId`, `Value`, `Type`, and `CreatedAt`, but it is not attached to the application `SubscriptionDto` response.

### SubscriptionFilterDto

=== "TypeScript"
    | Field | Type | Required | Notes |
    | --- | --- | --- | --- |
    | `customerKey` | `string` | No | |
    | `productKey` | `string` | No | |
    | `planKey` | `string` | No | |
    | `status` | Subscription status string | No | Filters by computed status. |
    | `isArchived` | `boolean` | No | `true` archived, `false` non-archived, `undefined` all. |
    | `sortBy` | `'activationDate' \| 'expirationDate' \| 'createdAt' \| 'updatedAt' \| 'currentPeriodStart' \| 'currentPeriodEnd'` | No | `updatedAt` is accepted but currently orders by `createdAt`. |
    | `sortOrder` | `'asc' \| 'desc'` | No | |
    | `limit` | `number` | No | Schema default 50. The parsed default is passed to both list methods, so omission returns at most 50 rows. |
    | `offset` | `number` | No | ≥0 (default 0 in the schema). |

=== ".NET"
    | Property | Type | Required | Notes |
    | --- | --- | --- | --- |
    | `CustomerKey` | `string` | No | |
    | `ProductKey` | `string` | No | |
    | `PlanKey` | `string` | No | |
    | `Status` | `string` | No | Filters by computed status. |
    | `IsArchived` | `bool?` | No | `true` archived, `false` non-archived, `null` all. |
    | `SortBy` | `string?` | No | Accepted; .NET repository currently ignores sort and orders by `CreatedAt` descending. |
    | `SortOrder` | `string?` | No | Accepted; .NET repository currently ignores sort. |
    | `Limit` | `int?` | No | No limit when omitted. |
    | `Offset` | `int?` | No | ≥0. |

### DetailedSubscriptionFilterDto

=== "TypeScript"
    Extends `SubscriptionFilterDto` with:
    - `billingCycleKey`
    - `isArchived` – `true` archived, `false` non-archived, `undefined` all
    - Date ranges: `activationDateFrom/To`, `expirationDateFrom/To`, `trialEndDateFrom/To`, `currentPeriodStartFrom/To`, `currentPeriodEndFrom/To`
    - Booleans: `hasStripeId`, `hasTrial`, `hasFeatureOverrides`
    - `featureKey`, `metadataKey`, `metadataValue` — accepted and unused
    - Pagination/sorting same as above.

=== ".NET"
    Extends `SubscriptionFilterDto` with:
    - `BillingCycleKey`
    - `IsArchived` – `true` archived, `false` non-archived, `null` all
    - Date ranges: `ActivationDateFrom/To`, `ExpirationDateFrom/To`, `TrialEndDateFrom/To`, `CurrentPeriodStartFrom/To`, `CurrentPeriodEndFrom/To`, all applied by the repository
    - Booleans: `HasStripeId` and `HasTrial`, applied by the repository; `HasFeatureOverrides`, applied after the base query
    - `FeatureKey`, `MetadataKey`, `MetadataValue` — accepted and unused
    - Pagination and sorting are the same as above. Requested sorting is ignored and results are ordered by `CreatedAt` descending.

## Related Workflows
- `FeatureCheckerService` relies on subscription data for resolving feature access; keep overrides up to date.
- `StripeIntegrationService` uses subscription CRUD for webhook synchronization.
- When deleting or transitioning plans/billing cycles, ensure subscriptions point to valid entities; run your own data migrations when changing plan relationships.
- **Subscription Transitions**: Use `transitionExpiredSubscriptions()` to automatically migrate expired subscriptions to new plans. Typically run as a scheduled job (cron, background worker) to process expired subscriptions periodically. See [`subscription-lifecycle.md`](./subscription-lifecycle.md) for details on transition behavior.
- Subscription mutations and transitions emit before/after [hooks](./hooks.md). See [How to Extend](./how-to-extend.md) for packaging audit-log and payments extensions.
