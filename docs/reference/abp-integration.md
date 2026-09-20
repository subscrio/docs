---
title: ABP integration
description: Connect ABP feature checks to Subscrio plans, subscriptions, and customer overrides with the Subscrio.Abp package.
---

# ABP integration

`Subscrio.Abp` connects ABP's `IFeatureChecker` to Subscrio. ABP remains the place where your application defines and checks features. Subscrio supplies the value for the current tenant or user from its subscription, plan, and overrides.

The package supports .NET 8, .NET 9, and .NET 10. Keep `Subscrio.Abp` and `Subscrio.Core` on the same version.

## Install

```powershell
dotnet add package Subscrio.Abp
```

## Choose the customer identity

Use one integration module:

- `SubscrioAbpTenantModule` maps `ICurrentTenant.Id` to the Subscrio customer key.
- `SubscrioAbpUserModule` maps `ICurrentUser.Id` when each signed-in user is a customer.
- `SubscrioAbpModule` lets an application provide its own `ISubscrioCustomerKeyResolver`.

Do not register both the tenant and user modules in one application.

### Tenant example

```csharp
[DependsOn(typeof(SubscrioAbpTenantModule))]
public sealed class AcmeModule : AbpModule
{
    public override void ConfigureServices(
        ServiceConfigurationContext context)
    {
        Configure<SubscrioAbpOptions>(options =>
        {
            options.ProductKey = "acme";
            options.IsManagedFeature = feature =>
                feature.Name.StartsWith(
                    "acme-",
                    StringComparison.Ordinal);
        });

        Configure<SubscrioAbpTenantOptions>(options =>
        {
            options.CustomerKeyFactory =
                tenantId => $"tenant-{tenantId:N}";
        });
    }
}
```

Register `Subscrio.Core` through `AddSubscrio` in the same module. Use a scoped lifetime for a web application.

## Define and synchronize features

Define features through ABP as usual. `AbpSubscrioFeatureCatalog` converts managed ABP definitions into Subscrio configuration. Add the products, plans, billing cycles, and plan values for your business, then pass the complete catalog to [configuration sync](config-sync.md).

ABP feature definitions remain the source of truth for feature names, value types, and defaults. `SubscrioAbpOptions.IsManagedFeature` limits which definitions the integration exports. `FeatureKeyMapper` can translate an ABP feature name when it is not already the Subscrio feature key.

## Check values

Application code continues to use ABP:

```csharp
var reports = await featureChecker.IsEnabledAsync(
    "acme-reports");

var maxProjects = await featureChecker.GetAsync<int>(
    "acme-max-projects");
```

For a managed feature, the provider resolves the current Subscrio customer and product. A subscription override wins over the plan value, and the feature default is the fallback. When there is no current tenant or user, the provider lets ABP's remaining providers handle the request.

## Next steps

- [Open the complete module and sample](https://github.com/subscrio/subscrio-abp)
- [Review feature resolution](feature-checker.md)
- [Configure the entitlement catalog](config-sync.md)
- [Read ABP's feature documentation](https://abp.io/docs/latest/framework/infrastructure/features)
