---
title: Getting Started
description: Install Subscrio and run a complete plan-based feature check in TypeScript or .NET.
---

# Getting Started

Create a feature, give it a value on a plan, and assign that plan to a customer. The example below returns a project limit of 10.

<span id="getting-started-with-subscrio"></span>
<span id="prerequisites"></span>
<span id="step-1-initialize-subscrio"></span>
<span id="running-migrations"></span>
<span id="step-2-define-features"></span>
<span id="step-3-create-product-plan-and-billing-cycle"></span>
<span id="step-4-onboard-a-customer"></span>
<span id="step-5-issue-a-subscription"></span>
<span id="step-6-verify-feature-access"></span>
<span id="where-to-go-next"></span>
<span id="understand-and-extend-the-entitlement-model"></span>

## Install and connect

Use a development database with no conflicting example keys. Schema installation creates Subscrio's tables, but does not create the database itself. Catalog creation is not an upsert: running this example again against the same records raises duplicate-key errors.

<div class="language-content" data-lang="ts" markdown="1">

Use Node.js 20.19 or newer and PostgreSQL. Install the library and a TypeScript runner:

```bash
npm install subscrio
npm install --save-dev typescript tsx
```

Set `DATABASE_URL` to your private PostgreSQL connection URI. Save the example as `getting-started.ts` in an ESM project and run `npx tsx getting-started.ts`.

</div>

<div class="language-content" data-lang="net" markdown="1">

Use a .NET 8, 9, or 10 console application with PostgreSQL or SQL Server:

```bash
dotnet add package Subscrio.Core
```

For this example, set `DATABASE_URL` to an Npgsql connection string, put the code in `Program.cs`, and run `dotnet run`. For SQL Server, use its connection string and set `DatabaseType = "sqlserver"` on `DatabaseConfig`.

</div>

Keep database credentials on the server. Review [Schema Upgrade](upgrading-entitlements.md) before running migration against an existing deployment.

## Create a catalog and check a limit

<div class="language-content" data-lang="ts" markdown="1">

```typescript
import { Subscrio } from 'subscrio';

const subscrio = new Subscrio({
  database: { connectionString: process.env.DATABASE_URL! }
});
try {
  if (await subscrio.verifySchema() === null) await subscrio.installSchema();
  else await subscrio.migrate();

  await subscrio.features.createFeature({
    key: 'max-projects', displayName: 'Projects', valueType: 'numeric', defaultValue: '0'
  });
  await subscrio.products.createProduct({ key: 'projecthub', displayName: 'ProjectHub' });
  await subscrio.products.associateFeature('projecthub', 'max-projects');
  await subscrio.plans.createPlan({
    key: 'starter', productKey: 'projecthub', displayName: 'Starter'
  });
  await subscrio.plans.setFeatureValue('starter', 'max-projects', '10');
  await subscrio.billingCycles.createBillingCycle({
    key: 'starter-monthly', planKey: 'starter', displayName: 'Monthly',
    durationUnit: 'months', durationValue: 1
  });
  await subscrio.customers.createCustomer({ key: 'acme', displayName: 'Acme' });
  await subscrio.subscriptions.createSubscription({
    key: 'acme-starter', customerKey: 'acme', billingCycleKey: 'starter-monthly'
  });
  const limit = await subscrio.featureChecker.getValueForCustomer(
    'acme', 'projecthub', 'max-projects', 0
  );
  console.log(limit); // 10
} finally {
  await subscrio.close();
}
```

</div>

<div class="language-content" data-lang="net" markdown="1">

```csharp
using Subscrio.Core;
using Subscrio.Core.Config;
using Subscrio.Core.Application.DTOs;

using var subscrio = new Subscrio.Core.Subscrio(new SubscrioConfig
{
    Database = new DatabaseConfig
    {
        ConnectionString = Environment.GetEnvironmentVariable("DATABASE_URL")!
    }
});
if (await subscrio.VerifySchemaAsync() is null) await subscrio.InstallSchemaAsync();
else await subscrio.MigrateAsync();

await subscrio.Features.CreateFeatureAsync(new CreateFeatureDto(
    Key: "max-projects", DisplayName: "Projects", ValueType: "numeric", DefaultValue: "0"));
await subscrio.Products.CreateProductAsync(new CreateProductDto("projecthub", "ProjectHub"));
await subscrio.Products.AssociateFeatureAsync("projecthub", "max-projects");
await subscrio.Plans.CreatePlanAsync(new CreatePlanDto("projecthub", "starter", "Starter"));
await subscrio.Plans.SetFeatureValueAsync("starter", "max-projects", "10");
await subscrio.BillingCycles.CreateBillingCycleAsync(new CreateBillingCycleDto(
    PlanKey: "starter", Key: "starter-monthly", DisplayName: "Monthly",
    DurationValue: 1, DurationUnit: "months"));
await subscrio.Customers.CreateCustomerAsync(new CreateCustomerDto("acme", "Acme"));
await subscrio.Subscriptions.CreateSubscriptionAsync(new CreateSubscriptionDto(
    CustomerKey: "acme", BillingCycleKey: "starter-monthly", Key: "acme-starter"));
var limit = await subscrio.FeatureChecker.GetValueForCustomerAsync<int>(
    "acme", "projecthub", "max-projects", 0);
Console.WriteLine(limit); // 10
```

</div>

## Understand the result

The feature default is zero. The Starter plan replaces it with 10, and Acme's subscription selects that plan through its monthly billing cycle. The numeric getter returns 10. It does not count existing projects or prevent your application from creating another one.

In TypeScript, passing the numeric fallback `0` selects numeric conversion; a generic type argument alone does not change runtime conversion. In .NET, the generic target type selects the conversion. See [Feature Checker](feature-checker.md) for missing-record behavior and other conversions.

Billing-cycle dates describe a subscription period. Subscrio does not charge the customer or automatically advance those dates. Your billing integration maintains them.

## Updating existing records { #partial-updates }

Methods that link to this convention change supplied properties while retaining omitted properties. For example, changing a feature's default value leaves its name and description unchanged. This applies only to methods that explicitly reference the convention.

<div class="language-content" data-lang="ts" markdown="1">

Leave a property out or pass `undefined` to keep its current value. Explicit `null` may be rejected or may clear a value, depending on the method and field.

</div>

<div class="language-content" data-lang="net" markdown="1">

For update DTOs that use nullable properties to represent omission, leaving a property at its default `null` keeps the saved value. That `null` does not clear the value. Some methods provide explicit flags for clearing a field.

</div>

Partial updates do not imply that nested objects are merged. The owning method documents replacement or patch behavior, empty collections, and restrictions after usage or credit activity. Configuration sync has its own [replacement rules](managing-configuration.md#understand-what-sync-replaces).

## Use dependency injection in .NET

<div class="language-content" data-lang="ts" markdown="1">

TypeScript applications manage the instance directly as shown above. The following container registration is specific to .NET.

</div>

<div class="language-content" data-lang="net" markdown="1">

Register a scoped instance in an ASP.NET application's service collection. This complete container example uses the database initialized above; registration itself does not install the schema or apply configuration.

```csharp
using Microsoft.Extensions.DependencyInjection;
using Subscrio.Core.DependencyInjection;

var services = new ServiceCollection();
services.AddSubscrio(new SubscrioConfig
{
    Database = new DatabaseConfig
    {
        ConnectionString = Environment.GetEnvironmentVariable("DATABASE_URL")!
    }
}, ServiceLifetime.Scoped);
using var provider = services.BuildServiceProvider();
using var scope = provider.CreateScope();
var scopedSubscrio = scope.ServiceProvider.GetRequiredService<Subscrio.Core.Subscrio>();
Console.WriteLine(await scopedSubscrio.VerifySchemaAsync());
```

In an ASP.NET application, register on `builder.Services`; the request scope handles disposal. See [Subscrio](core-overview.md) for configuration properties.

</div>

## Continue with your application

Keep an instance alive for the application work that needs it, and close or dispose it when finished. For the full configuration and object list, see [Subscrio](core-overview.md).

- [How Subscrio Works](entitlements-guide.md) explains the model and how to choose between quotas and credits.
- [Add-ons and Overrides](addons-and-overrides.md) extends this example with reusable packages and individual exceptions.
- [Subscription Lifecycle](subscription-lifecycle.md) covers trials, cancellation, and plan transitions.
- [Managing Configuration](managing-configuration.md) replaces repeated catalog-creation scripts with an explicit synchronization workflow.
