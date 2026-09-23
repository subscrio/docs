---
title: Welcome
description: Learn how to define plans, check feature access, track usage, and manage credits with Subscrio.
---

# Welcome

Subscrio is an open-source library for deciding what a customer can use in your product. Your application stores the catalog and customer agreements in its own database, then calls the TypeScript or .NET library to check access and record consumption.

<span id="subscrio-documentation"></span>
<span id="start-with-your-implementation"></span>
<span id="the-entitlement-model"></span>
<span id="define-the-catalog-once"></span>
<span id="keep-neighboring-responsibilities-separate"></span>
<span id="stripe-events"></span>
<span id="reference"></span>
<span id="beyond-static-plan-values"></span>

## Start here

[Getting Started](reference/getting-started.md) walks through installation, a small catalog, a customer subscription, and a feature check. TypeScript uses PostgreSQL and requires Node.js 20.19 or newer. .NET targets .NET 8, 9, and 10 and supports PostgreSQL or SQL Server.

Use the language selector in the header to switch examples throughout the site.

## Choose what your application needs

| Requirement | Where to start |
| --- | --- |
| Enable features or set limits by plan | [How Subscrio Works](reference/entitlements-guide.md) |
| Offer extra seats or make a customer-specific exception | [Add-ons and Overrides](reference/addons-and-overrides.md) |
| Combine allowances from several subscriptions | [How Feature Values Are Calculated](reference/feature-resolution.md) |
| Enforce a recurring quota | [Metered Usage Workflows](reference/metered-usage-workflows.md) |
| Let several actions spend a shared balance | [Credit Wallet Workflows](reference/credit-wallet-workflows.md) |
| Manage trials, cancellation, or expiration | [Subscription Lifecycle](reference/subscription-lifecycle.md) |
| Keep catalog configuration consistent across environments | [Managing Configuration](reference/managing-configuration.md) |

## Where Subscrio fits

Features define the values your application understands. Products group features and plans. A subscription gives a customer a plan through a billing cycle. Add-ons contribute additional values; overrides express individual exceptions. Metering counts use against an allowance, while credits account for a spendable balance.

Subscrio does not collect payments, authenticate requests, decide which user owns a customer account, or perform your application's work. Your application combines its access checks with those responsibilities. A numeric seat limit, for example, tells you the allowed number; your application counts the seats already assigned.

## Integrate and operate

Use [Stripe Setup](reference/how-to-integrate-with-stripe.md) to map billing events to subscriptions, or [Extending Subscrio](reference/how-to-extend.md) for hooks, audit records, and payment tracking. The [Relationships](reference/relationships.md) page explains the stored model; [Schema Upgrade](reference/upgrading-entitlements.md) covers existing installations.

The [Library Reference](reference/core-overview.md) documents each public object, its methods, and its data types.
