---
title: Feature entitlements for .NET and TypeScript
description: API reference and guides for Subscrio. Install the library, define products and plans, assign subscriptions, and resolve feature access in .NET or TypeScript.
---

# Subscrio documentation

Subscrio is an open-source entitlement engine for .NET and TypeScript. It turns plans, packages, purchases, and customer agreements into feature access that your application resolves from its own database.

Use these docs to install the library, define products and plans, assign customer subscriptions, resolve feature values, and integrate billing events.

## Start with your implementation

=== "TypeScript"

    Install the `subscrio` npm package and connect it to PostgreSQL.

    ```bash
    npm install subscrio
    ```

    [Follow the TypeScript and .NET getting-started guide](reference/getting-started.md)

=== ".NET"

    Install `Subscrio.Core` and connect it to PostgreSQL or SQL Server.

    ```bash
    dotnet add package Subscrio.Core
    ```

    [Follow the TypeScript and .NET getting-started guide](reference/getting-started.md)

## The entitlement model

Subscrio connects a small set of records:

- A **product** groups a feature catalog.
- A **feature** defines a toggle, numeric limit, or text value with a default.
- A **plan** assigns values to features in its product.
- A **billing cycle** supplies the timing used by a subscription.
- A **customer** receives a plan through a **subscription**.
- A **subscription override** changes one feature value for a specific customer agreement.

Feature resolution checks a valid subscription override first, then the plan value, then the feature default.

[Read the core overview](reference/core-overview.md) or [open the feature checker reference](reference/feature-checker.md).

## Define the catalog once

Create catalog records through the public services, keep them in a version-controlled JSON file, or build a typed `ConfigSyncDto` in code. Configuration sync gives each environment the same products, features, plans, billing cycles, and plan values.

[Configure and sync the entitlement catalog](reference/config-sync.md).

## Keep neighboring responsibilities separate

Subscrio does not process payments, run feature rollouts, replace RBAC, or activate device licenses.

- A billing provider or internal system can update Subscrio subscriptions.
- A feature flag can control rollout after the customer entitlement passes.
- Authorization can decide which users inside an entitled account may perform an action.
- Installation and device licensing remain separate from account-level feature access.

## Stripe events

The Stripe integration accepts supported, verified events and maintains the matching customer subscription data. If your application receives the webhook, verify its signature before passing it to Subscrio. The optional [Subscrio Web Admin](https://subscrio.com/admin/) can act as the Stripe webhook endpoint instead.

[Integrate Stripe events](reference/how-to-integrate-with-stripe.md).

## Reference

- [Products](reference/products.md)
- [Features](reference/features.md)
- [Plans](reference/plans.md)
- [Billing cycles](reference/billing-cycles.md)
- [Customers](reference/customers.md)
- [Subscriptions](reference/subscriptions.md)
- [Subscription lifecycle](reference/subscription-lifecycle.md)
- [Feature checker](reference/feature-checker.md)
- [Hooks](reference/hooks.md)
- [How to extend Subscrio](reference/how-to-extend.md)
- [Configuration sync](reference/config-sync.md)
- [How to integrate with Stripe](reference/how-to-integrate-with-stripe.md)
- [Relationships](reference/relationships.md)
