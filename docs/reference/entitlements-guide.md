---
title: How Subscrio Works
description: Understand the catalog, subscriptions, and the difference between feature values, metering, and credits.
---

# How Subscrio Works

An entitlement describes what a customer can use: analytics, 20 seats, or 10,000 API calls in a month. Subscrio stores those agreements and resolves them for your application.

<span id="define-what-the-product-includes"></span>
<span id="assign-a-subscription-and-maintain-its-lifecycle"></span>
<span id="check-access-where-the-work-happens"></span>
<span id="make-customer-specific-exceptions"></span>
<span id="what-subscription-add-ons-mean"></span>
<span id="choose-who-shares-metered-usage"></span>
<span id="check-reserve-then-do-the-work"></span>
<span id="how-credit-grants-work"></span>
<span id="existing-access-behavior"></span>
<span id="run-the-examples"></span>
<span id="library-reference-and-operations"></span>

## Build the catalog

| Object | What it defines |
| --- | --- |
| Feature | A reusable toggle, numeric, text, or metered value with a default. |
| Add-on | A reusable package of feature values belonging to one product. |
| Product | The features and plans offered together. A feature can belong to several products. |
| Plan | Values for features associated with its product. |
| Billing cycle | A plan's cadence and optional external billing identifier. |
| Customer | The account identified by your application's stable customer key. |
| Subscription | A customer's plan, billing cycle, lifecycle dates, overrides, and attached add-ons. |

A product-feature association holds the rules for combining values. Plans supply values; they do not own that association. Define an add-on's feature values in the add-on catalog, then attach it to subscriptions with a quantity.

## Resolve access

For one subscription, resolution starts with its plan value or the feature default. Add-ons contribute according to the product-feature rules. An active override then replaces the complete result for that feature. A customer-level check resolves across eligible subscriptions.

Use [Feature Checker](feature-checker.md) for ordinary feature values and toggle checks. Use its diagnostic explanation methods when you need to understand which sources contributed. No separate composition object is needed: settings live on the [product-feature association](feature-resolution.md).

Your application still authenticates users, selects the customer they may act for, checks permissions, and performs the requested work. A subscription-specific getter resolves that subscription's values even when it is inactive, so it is not by itself an access-eligibility check.

## Choose how to change or consume an entitlement

| Requirement | Use |
| --- | --- |
| Every Starter subscriber should receive 20 projects. | Change the plan feature value. |
| One subscription has a negotiated limit of 50 projects. | Set a subscription override. |
| Customers buy repeatable extra-project packs. | Define and attach an add-on. |
| Each customer can make 10,000 API calls per month. | Configure a metered feature and report each accepted use. |
| Image generation and summarization spend one balance. | Configure a credit currency, grants, and feature consumption rules. |

## Overrides or subscription add-ons? { #overrides-or-subscription-add-ons }

An override sets an individual subscription's final value. An add-on describes a reusable package. With a 20-seat plan, an override of 50 remains 50 if the plan later increases. Three additive 10-seat packs give 50 now and 60 if the plan increases to 30.

An active override wins over the complete plan/add-on result. Add-ons are not added on top of it. See [Add-ons and Overrides](addons-and-overrides.md) for quantities, expiration, and removal.

## Metered usage or credits? { #metered-usage-or-credits }

| Question | Metered usage | Credits |
| --- | --- | --- |
| What is consumed? | A feature's own allowance for a period. | A customer's shared balance in a currency. |
| Example | API calls and image generations have separate counters. | Images cost 50 AI credits; summaries cost 5 from the same wallet. |
| What happens next month? | A new period starts at zero; previous events remain. | A scheduled grant adds credits; older grants expire or remain under their own policy. |
| What enforces the decision? | The atomic usage-report operation. | The atomic credit-consumption operation. |
| What does a larger plan change? | The current limit, without erasing recorded use. | Grant configuration; it does not rewrite already-issued grants. |

A metered feature cannot also have a credit consumption rule. Both models can coexist for different features. The library does not provide one transaction that both records metered use and debits a credit wallet.

## Follow a complete workflow

- [How Feature Values Are Calculated](feature-resolution.md): multiple subscriptions, replacement packages, and diagnostics.
- [Metered Usage Workflows](metered-usage-workflows.md): shared counters, billing periods, hard/soft limits, and retries.
- [Credit Wallet Workflows](credit-wallet-workflows.md): prepaid balances, recurring grants, expiration, and corrections.
- [Subscription Lifecycle](subscription-lifecycle.md): dates, trials, archive behavior, and access eligibility.
- [Managing Configuration](managing-configuration.md): import, export, and the limits of synchronization.

Subscription add-ons are catalog offerings. Software extensions are installable packages, covered under [Extending Subscrio](how-to-extend.md).
