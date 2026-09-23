# Subscrio reference inventory

Public operations documented from the adjacent TypeScript and .NET checkouts. All 14 pages follow AGENTS.md and FORMAT-SPEC.md, with the site-wide language selector, linked property definitions, and language-specific signatures. A dash means that language exposes a different API; see the page for supported alternatives.

## Subscrio

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `new Subscrio` | `new Subscrio` | [Constructor](docs/reference/core-overview.md#constructor) |
| `installSchema` | `InstallSchemaAsync` | [Subscrio](docs/reference/core-overview.md#installschema) |
| `migrate` | `MigrateAsync` | [Subscrio](docs/reference/core-overview.md#migrate) |
| `verifySchema` | `VerifySchemaAsync` | [Subscrio](docs/reference/core-overview.md#verifyschema) |
| `runInitialConfigSync` | `RunInitialConfigSyncAsync` | [Subscrio](docs/reference/core-overview.md#runinitialconfigsync) |
| `dropSchema` | `DropSchemaAsync` | [Subscrio](docs/reference/core-overview.md#dropschema) |
| `close` | `Dispose` | [Subscrio](docs/reference/core-overview.md#close) |

## Features

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `createFeature` | `CreateFeatureAsync` | [Features](docs/reference/features.md#createfeature) |
| `updateFeature` | `UpdateFeatureAsync` | [Features](docs/reference/features.md#updatefeature) |
| `getFeature` | `GetFeatureAsync` | [Features](docs/reference/features.md#getfeature) |
| `listFeatures` | `ListFeaturesAsync` | [Features](docs/reference/features.md#listfeatures) |
| `getFeaturesByProduct` | `GetFeaturesByProductAsync` | [Features](docs/reference/features.md#getfeaturesbyproduct) |
| `archiveFeature` | `ArchiveFeatureAsync` | [Features](docs/reference/features.md#archivefeature) |
| `unarchiveFeature` | `UnarchiveFeatureAsync` | [Features](docs/reference/features.md#unarchivefeature) |
| `deleteFeature` | `DeleteFeatureAsync` | [Features](docs/reference/features.md#deletefeature) |

## Add-ons

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `createAddon` | `CreateAddonAsync` | [Add-ons](docs/reference/addons.md#createaddon) |
| `updateAddon` | `UpdateAddonAsync` | [Add-ons](docs/reference/addons.md#updateaddon) |
| `getAddon` | `GetAddonAsync` | [Add-ons](docs/reference/addons.md#getaddon) |
| `listAddons` | `ListAddonsAsync` | [Add-ons](docs/reference/addons.md#listaddons) |
| `archiveAddon` | `ArchiveAddonAsync` | [Add-ons](docs/reference/addons.md#archiveaddon) |
| `unarchiveAddon` | `UnarchiveAddonAsync` | [Add-ons](docs/reference/addons.md#unarchiveaddon) |
| `deleteAddon` | `DeleteAddonAsync` | [Add-ons](docs/reference/addons.md#deleteaddon) |

## Products

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `createProduct` | `CreateProductAsync` | [Products](docs/reference/products.md#createproduct) |
| `updateProduct` | `UpdateProductAsync` | [Products](docs/reference/products.md#updateproduct) |
| `getProduct` | `GetProductAsync` | [Products](docs/reference/products.md#getproduct) |
| `listProducts` | `ListProductsAsync` | [Products](docs/reference/products.md#listproducts) |
| `associateFeature` | `AssociateFeatureAsync` | [Products](docs/reference/products.md#associatefeature) |
| `dissociateFeature` | `DissociateFeatureAsync` | [Products](docs/reference/products.md#dissociatefeature) |
| `archiveProduct` | `ArchiveProductAsync` | [Products](docs/reference/products.md#archiveproduct) |
| `unarchiveProduct` | `UnarchiveProductAsync` | [Products](docs/reference/products.md#unarchiveproduct) |
| `deleteProduct` | `DeleteProductAsync` | [Products](docs/reference/products.md#deleteproduct) |

## Plans

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `createPlan` | `CreatePlanAsync` | [Plans](docs/reference/plans.md#createplan) |
| `updatePlan` | `UpdatePlanAsync` | [Plans](docs/reference/plans.md#updateplan) |
| `getPlan` | `GetPlanAsync` | [Plans](docs/reference/plans.md#getplan) |
| `listPlans` | `ListPlansAsync` | [Plans](docs/reference/plans.md#listplans) |
| `getPlansByProduct` | `GetPlansByProductAsync` | [Plans](docs/reference/plans.md#getplansbyproduct) |
| `setFeatureValue` | `SetFeatureValueAsync` | [Plans](docs/reference/plans.md#setfeaturevalue) |
| `removeFeatureValue` | `RemoveFeatureValueAsync` | [Plans](docs/reference/plans.md#removefeaturevalue) |
| `getFeatureValue` | `GetFeatureValueAsync` | [Plans](docs/reference/plans.md#getfeaturevalue) |
| `getPlanFeatures` | `GetPlanFeaturesAsync` | [Plans](docs/reference/plans.md#getplanfeatures) |
| `archivePlan` | `ArchivePlanAsync` | [Plans](docs/reference/plans.md#archiveplan) |
| `unarchivePlan` | `UnarchivePlanAsync` | [Plans](docs/reference/plans.md#unarchiveplan) |
| `deletePlan` | `DeletePlanAsync` | [Plans](docs/reference/plans.md#deleteplan) |

## Billing Cycles

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `createBillingCycle` | `CreateBillingCycleAsync` | [Billing Cycles](docs/reference/billing-cycles.md#createbillingcycle) |
| `updateBillingCycle` | `UpdateBillingCycleAsync` | [Billing Cycles](docs/reference/billing-cycles.md#updatebillingcycle) |
| `getBillingCycle` | `GetBillingCycleAsync` | [Billing Cycles](docs/reference/billing-cycles.md#getbillingcycle) |
| `listBillingCycles` | `ListBillingCyclesAsync` | [Billing Cycles](docs/reference/billing-cycles.md#listbillingcycles) |
| `getBillingCyclesByPlan` | `GetBillingCyclesByPlanAsync` | [Billing Cycles](docs/reference/billing-cycles.md#getbillingcyclesbyplan) |
| `archiveBillingCycle` | `ArchiveBillingCycleAsync` | [Billing Cycles](docs/reference/billing-cycles.md#archivebillingcycle) |
| `unarchiveBillingCycle` | `UnarchiveBillingCycleAsync` | [Billing Cycles](docs/reference/billing-cycles.md#unarchivebillingcycle) |
| `deleteBillingCycle` | `DeleteBillingCycleAsync` | [Billing Cycles](docs/reference/billing-cycles.md#deletebillingcycle) |
| `calculateNextPeriodEnd` | `CalculateNextPeriodEndAsync` | [Billing Cycles](docs/reference/billing-cycles.md#calculatenextperiodend) |
| `getBillingCyclesByDurationUnit` | `GetBillingCyclesByDurationUnitAsync` | [Billing Cycles](docs/reference/billing-cycles.md#getbillingcyclesbydurationunit) |
| `getDefaultBillingCycles` | `GetDefaultBillingCyclesAsync` | [Billing Cycles](docs/reference/billing-cycles.md#getdefaultbillingcycles) |

## Customers

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `createCustomer` | `CreateCustomerAsync` | [Customers](docs/reference/customers.md#createcustomer) |
| `updateCustomer` | `UpdateCustomerAsync` | [Customers](docs/reference/customers.md#updatecustomer) |
| `getCustomer` | `GetCustomerAsync` | [Customers](docs/reference/customers.md#getcustomer) |
| `listCustomers` | `ListCustomersAsync` | [Customers](docs/reference/customers.md#listcustomers) |
| `archiveCustomer` | `ArchiveCustomerAsync` | [Customers](docs/reference/customers.md#archivecustomer) |
| `unarchiveCustomer` | `UnarchiveCustomerAsync` | [Customers](docs/reference/customers.md#unarchivecustomer) |
| `deleteCustomer` | `DeleteCustomerAsync` | [Customers](docs/reference/customers.md#deletecustomer) |

## Subscriptions

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `createSubscription` | `CreateSubscriptionAsync` | [Subscriptions](docs/reference/subscriptions.md#createsubscription) |
| `updateSubscription` | `UpdateSubscriptionAsync` | [Subscriptions](docs/reference/subscriptions.md#updatesubscription) |
| `getSubscription` | `GetSubscriptionAsync` | [Subscriptions](docs/reference/subscriptions.md#getsubscription) |
| `listSubscriptions` | `ListSubscriptionsAsync` | [Subscriptions](docs/reference/subscriptions.md#listsubscriptions) |
| `findSubscriptions` | `FindSubscriptionsAsync` | [Subscriptions](docs/reference/subscriptions.md#findsubscriptions) |
| `getSubscriptionsByCustomer` | `GetSubscriptionsByCustomerAsync` | [Subscriptions](docs/reference/subscriptions.md#getsubscriptionsbycustomer) |
| `attachAddon` | `AttachAddonAsync` | [Subscriptions](docs/reference/subscriptions.md#attachaddon) |
| `detachAddon` | `DetachAddonAsync` | [Subscriptions](docs/reference/subscriptions.md#detachaddon) |
| `getAddons` | `GetAddonsAsync` | [Subscriptions](docs/reference/subscriptions.md#getaddons) |
| `addFeatureOverride` | `AddFeatureOverrideAsync` | [Subscriptions](docs/reference/subscriptions.md#addfeatureoverride) |
| `removeFeatureOverride` | `RemoveFeatureOverrideAsync` | [Subscriptions](docs/reference/subscriptions.md#removefeatureoverride) |
| `clearTemporaryOverrides` | `ClearTemporaryOverridesAsync` | [Subscriptions](docs/reference/subscriptions.md#cleartemporaryoverrides) |
| `archiveSubscription` | `ArchiveSubscriptionAsync` | [Subscriptions](docs/reference/subscriptions.md#archivesubscription) |
| `unarchiveSubscription` | `UnarchiveSubscriptionAsync` | [Subscriptions](docs/reference/subscriptions.md#unarchivesubscription) |
| `deleteSubscription` | `DeleteSubscriptionAsync` | [Subscriptions](docs/reference/subscriptions.md#deletesubscription) |
| `transitionExpiredSubscriptions` | `TransitionExpiredSubscriptionsAsync` | [Subscriptions](docs/reference/subscriptions.md#transitionexpiredsubscriptions) |

## Feature Checker

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `getValueForCustomer` | `GetValueForCustomerAsync` | [Feature Checker](docs/reference/feature-checker.md#getvalueforcustomer) |
| `isEnabledForCustomer` | `IsEnabledForCustomerAsync` | [Feature Checker](docs/reference/feature-checker.md#isenabledforcustomer) |
| `getAllFeaturesForCustomer` | `GetAllFeaturesForCustomerAsync` | [Feature Checker](docs/reference/feature-checker.md#getallfeaturesforcustomer) |
| `getValueForSubscription` | `GetValueForSubscriptionAsync` | [Feature Checker](docs/reference/feature-checker.md#getvalueforsubscription) |
| `isEnabledForSubscription` | `IsEnabledForSubscriptionAsync` | [Feature Checker](docs/reference/feature-checker.md#isenabledforsubscription) |
| `getAllFeaturesForSubscription` | `GetAllFeaturesForSubscriptionAsync` | [Feature Checker](docs/reference/feature-checker.md#getallfeaturesforsubscription) |
| `hasPlanAccess` | `HasPlanAccessAsync` | [Feature Checker](docs/reference/feature-checker.md#hasplanaccess) |
| `getActivePlans` | `GetActivePlansAsync` | [Feature Checker](docs/reference/feature-checker.md#getactiveplans) |
| `getFeatureUsageSummary` | `GetFeatureUsageSummaryAsync` | [Feature Checker](docs/reference/feature-checker.md#getfeatureusagesummary) |
| `explainForCustomer` | `ExplainForCustomerAsync` | [Feature Checker](docs/reference/feature-checker.md#explainforcustomer) |
| `explainForSubscription` | `ExplainForSubscriptionAsync` | [Feature Checker](docs/reference/feature-checker.md#explainforsubscription) |

## Metered Usage

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `getUsage` | `GetUsageAsync` | [Metered Usage](docs/reference/metering.md#getusage) |
| `reportUsage` | `ReportUsageAsync` | [Metered Usage](docs/reference/metering.md#reportusage) |
| `listUsageEvents` | `ListUsageEventsAsync` | [Metered Usage](docs/reference/metering.md#listusageevents) |

## Credits

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `createCurrency` | `CreateCurrencyAsync` | [Credits](docs/reference/credits.md#createcurrency) |
| `updateCurrency` | `UpdateCurrencyAsync` | [Credits](docs/reference/credits.md#updatecurrency) |
| `getCurrency` | `GetCurrencyAsync` | [Credits](docs/reference/credits.md#getcurrency) |
| `listCurrencies` | `ListCurrenciesAsync` | [Credits](docs/reference/credits.md#listcurrencies) |
| `setPlanGrant` | `SetPlanGrantAsync` | [Credits](docs/reference/credits.md#setplangrant) |
| `getPlanGrant` | `GetPlanGrantAsync` | [Credits](docs/reference/credits.md#getplangrant) |
| `listPlanGrants` | `ListPlanGrantsAsync` | [Credits](docs/reference/credits.md#listplangrants) |
| `removePlanGrant` | `RemovePlanGrantAsync` | [Credits](docs/reference/credits.md#removeplangrant) |
| `setConsumptionRule` | `SetConsumptionRuleAsync` | [Credits](docs/reference/credits.md#setconsumptionrule) |
| `getConsumptionRule` | `GetConsumptionRuleAsync` | [Credits](docs/reference/credits.md#getconsumptionrule) |
| `listConsumptionRules` | `ListConsumptionRulesAsync` | [Credits](docs/reference/credits.md#listconsumptionrules) |
| `removeConsumptionRule` | `RemoveConsumptionRuleAsync` | [Credits](docs/reference/credits.md#removeconsumptionrule) |
| `grant` | `GrantAsync` | [Credits](docs/reference/credits.md#grant) |
| `issueDuePlanGrants` | `IssueDuePlanGrantsAsync` | [Credits](docs/reference/credits.md#issuedueplangrants) |
| `processScheduledGrants` | `ProcessScheduledGrantsAsync` | [Credits](docs/reference/credits.md#processscheduledgrants) |
| `getBalance` | `GetBalanceAsync` | [Credits](docs/reference/credits.md#getbalance) |
| `listBalances` | `ListBalancesAsync` | [Credits](docs/reference/credits.md#listbalances) |
| `canConsume` | `CanConsumeAsync` | [Credits](docs/reference/credits.md#canconsume) |
| `consume` | `ConsumeAsync` | [Credits](docs/reference/credits.md#consume) |
| `adjust` | `AdjustAsync` | [Credits](docs/reference/credits.md#adjust) |
| `listGrants` | `ListGrantsAsync` | [Credits](docs/reference/credits.md#listgrants) |
| `getOperation` | `GetOperationAsync` | [Credits](docs/reference/credits.md#getoperation) |
| `listLedgerEntries` | `ListLedgerEntriesAsync` | [Credits](docs/reference/credits.md#listledgerentries) |
| `archiveCurrency` | `ArchiveCurrencyAsync` | [Credits](docs/reference/credits.md#archivecurrency) |
| `unarchiveCurrency` | `UnarchiveCurrencyAsync` | [Credits](docs/reference/credits.md#unarchivecurrency) |
| `deleteCurrency` | `DeleteCurrencyAsync` | [Credits](docs/reference/credits.md#deletecurrency) |

## Hooks

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `on` | — | [Hooks](docs/reference/hooks.md#on) |
| `off` | — | [Hooks](docs/reference/hooks.md#off) |
| `hasListeners` | `HasListeners` | [Hooks](docs/reference/hooks.md#haslisteners) |
| `emit` | — | [Hooks](docs/reference/hooks.md#emit) |
| — | `OnCustomerCreatedBefore` | [Hooks](docs/reference/hooks.md#oncustomercreatedbefore) |
| — | `OnCustomerCreatedAfter` | [Hooks](docs/reference/hooks.md#oncustomercreatedafter) |
| — | `OnCustomerUpdatedBefore` | [Hooks](docs/reference/hooks.md#oncustomerupdatedbefore) |
| — | `OnCustomerUpdatedAfter` | [Hooks](docs/reference/hooks.md#oncustomerupdatedafter) |
| — | `OnCustomerArchivedBefore` | [Hooks](docs/reference/hooks.md#oncustomerarchivedbefore) |
| — | `OnCustomerArchivedAfter` | [Hooks](docs/reference/hooks.md#oncustomerarchivedafter) |
| — | `OnCustomerUnarchivedBefore` | [Hooks](docs/reference/hooks.md#oncustomerunarchivedbefore) |
| — | `OnCustomerUnarchivedAfter` | [Hooks](docs/reference/hooks.md#oncustomerunarchivedafter) |
| — | `OnCustomerDeletedBefore` | [Hooks](docs/reference/hooks.md#oncustomerdeletedbefore) |
| — | `OnCustomerDeletedAfter` | [Hooks](docs/reference/hooks.md#oncustomerdeletedafter) |
| — | `OnSubscriptionCreatedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptioncreatedbefore) |
| — | `OnSubscriptionCreatedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptioncreatedafter) |
| — | `OnSubscriptionUpdatedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptionupdatedbefore) |
| — | `OnSubscriptionUpdatedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptionupdatedafter) |
| — | `OnSubscriptionArchivedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptionarchivedbefore) |
| — | `OnSubscriptionArchivedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptionarchivedafter) |
| — | `OnSubscriptionUnarchivedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptionunarchivedbefore) |
| — | `OnSubscriptionUnarchivedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptionunarchivedafter) |
| — | `OnSubscriptionDeletedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptiondeletedbefore) |
| — | `OnSubscriptionDeletedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptiondeletedafter) |
| — | `OnSubscriptionFeatureOverrideAddedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptionfeatureoverrideaddedbefore) |
| — | `OnSubscriptionFeatureOverrideAddedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptionfeatureoverrideaddedafter) |
| — | `OnSubscriptionFeatureOverrideRemovedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptionfeatureoverrideremovedbefore) |
| — | `OnSubscriptionFeatureOverrideRemovedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptionfeatureoverrideremovedafter) |
| — | `OnSubscriptionTemporaryOverridesClearedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptiontemporaryoverridesclearedbefore) |
| — | `OnSubscriptionTemporaryOverridesClearedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptiontemporaryoverridesclearedafter) |
| — | `OnStripeReceivedBefore` | [Hooks](docs/reference/hooks.md#onstripereceivedbefore) |
| — | `OnStripeReceivedAfter` | [Hooks](docs/reference/hooks.md#onstripereceivedafter) |
| — | `OnSubscriptionAddonAttachedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptionaddonattachedbefore) |
| — | `OnSubscriptionAddonAttachedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptionaddonattachedafter) |
| — | `OnSubscriptionAddonDetachedBefore` | [Hooks](docs/reference/hooks.md#onsubscriptionaddondetachedbefore) |
| — | `OnSubscriptionAddonDetachedAfter` | [Hooks](docs/reference/hooks.md#onsubscriptionaddondetachedafter) |
| — | `OnUsageReportedBefore` | [Hooks](docs/reference/hooks.md#onusagereportedbefore) |
| — | `OnUsageReportedAfter` | [Hooks](docs/reference/hooks.md#onusagereportedafter) |
| — | `OnCreditConsumedBefore` | [Hooks](docs/reference/hooks.md#oncreditconsumedbefore) |
| — | `OnCreditConsumedAfter` | [Hooks](docs/reference/hooks.md#oncreditconsumedafter) |
| — | `OnCreditGrantedBefore` | [Hooks](docs/reference/hooks.md#oncreditgrantedbefore) |
| — | `OnCreditGrantedAfter` | [Hooks](docs/reference/hooks.md#oncreditgrantedafter) |
| — | `OnCreditAdjustedBefore` | [Hooks](docs/reference/hooks.md#oncreditadjustedbefore) |
| — | `OnCreditAdjustedAfter` | [Hooks](docs/reference/hooks.md#oncreditadjustedafter) |
| — | `EmitCustomerBeforeAsync` | [Hooks](docs/reference/hooks.md#emitcustomerbeforeasync) |
| — | `EmitCustomerAfterAsync` | [Hooks](docs/reference/hooks.md#emitcustomerafterasync) |
| — | `EmitSubscriptionBeforeAsync` | [Hooks](docs/reference/hooks.md#emitsubscriptionbeforeasync) |
| — | `EmitSubscriptionAfterAsync` | [Hooks](docs/reference/hooks.md#emitsubscriptionafterasync) |
| — | `EmitStripeReceivedAsync` | [Hooks](docs/reference/hooks.md#emitstripereceivedasync) |

## Configuration Sync

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `syncFromFile` | `SyncFromFileAsync` | [Configuration Sync](docs/reference/config-sync.md#syncfromfile) |
| `syncFromJson` | `SyncFromJsonAsync` | [Configuration Sync](docs/reference/config-sync.md#syncfromjson) |
| `exportConfig` | `ExportConfigAsync` | [Configuration Sync](docs/reference/config-sync.md#exportconfig) |

## Stripe Integration

| TypeScript | .NET | Reference |
| --- | --- | --- |
| `createCheckoutSession` | `CreateCheckoutSessionAsync` | [Stripe Integration](docs/reference/stripe-integration.md#createcheckoutsession) |
| `constructStripeEvent` | — | [Stripe Integration](docs/reference/stripe-integration.md#constructstripeevent) |
| `processStripeEvent` | `ProcessStripeEventAsync` | [Stripe Integration](docs/reference/stripe-integration.md#processstripeevent) |
| `createStripeSubscription` | `CreateStripeSubscriptionAsync` | [Stripe Integration](docs/reference/stripe-integration.md#createstripesubscription) |

## Workflow guides

Welcome and Getting Started introduce the library. Guides cover the model, lifecycle, how feature values are calculated, add-ons and overrides, metered usage, credit wallets, and configuration management. Extensions and Stripe Setup cover integration workflows; Relationships and Schema Upgrade cover database structure and operation. Shared update conventions live in Getting Started.
