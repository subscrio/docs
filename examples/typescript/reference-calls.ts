import { Subscrio } from "subscrio";
// Compile-only inventory. Run the walkthrough for behavioral assertions.
export async function referenceCalls(subscrio: Subscrio) {
  await subscrio.addons.createAddon({
    key: "seat-pack",
    productKey: "studio",
    displayName: "Extra seats",
  });
  await subscrio.addons.updateAddon("seat-pack", {
    displayName: "Extra seats",
  });
  await subscrio.addons.getAddon("seat-pack");
  await subscrio.addons.listAddons("studio", { limit: 50, offset: 0 });
  await subscrio.addons.archiveAddon("seat-pack");
  await subscrio.addons.unarchiveAddon("seat-pack");
  await subscrio.addons.deleteAddon("seat-pack");
  await subscrio.subscriptions.attachAddon("acme-pro", "seat-pack", 2);
  await subscrio.subscriptions.detachAddon("acme-pro", "seat-pack");
  await subscrio.subscriptions.getAddons("acme-pro");
  await subscrio.features.updateFeature("requests", {meteredConfig: {
    resetPeriod: "monthly",
    enforcement: "hard",
    aggregation: "sum",
    usageScope: "customer",
  }});
  await subscrio.features.getFeature("requests");
  await subscrio.metering.getUsage("acme", "studio", "requests", {
    requestedUsage: 2,
  });
  await subscrio.metering.reportUsage("acme", "studio", "requests", 2, {
    idempotencyKey: "request-123",
  });
  await subscrio.metering.listUsageEvents("acme", "studio", "requests", {
    limit: 50,
  });
  await subscrio.credits.getPlanGrant("pro", "ai-credits");
  await subscrio.credits.getConsumptionRule("render", "ai-credits");
  await subscrio.credits.issueDuePlanGrants({ subscriptionKey: "acme-pro" });
  await subscrio.credits.createCurrency({
    key: "ai-credits",
    displayName: "AI credits",
  });
  await subscrio.credits.getCurrency("ai-credits");
  await subscrio.credits.listCurrencies({ limit: 50, offset: 0 });
  await subscrio.credits.updateCurrency("ai-credits", {
    displayName: "AI credits",
  });
  await subscrio.credits.archiveCurrency("ai-credits");
  await subscrio.credits.unarchiveCurrency("ai-credits");
  await subscrio.credits.deleteCurrency("ai-credits");
  await subscrio.credits.setPlanGrant("pro", "ai-credits", {
    amount: 100,
    cadence: "monthly",
    expiryPolicy: "grant_period_end",
    cancellationPolicy: "retain",
  });
  await subscrio.credits.removePlanGrant("pro", "ai-credits");
  await subscrio.credits.listPlanGrants("pro");
  await subscrio.credits.setConsumptionRule("render", "ai-credits", 3);
  await subscrio.credits.removeConsumptionRule("render", "ai-credits");
  await subscrio.credits.listConsumptionRules("render");
  await subscrio.credits.grant({
    customerKey: "acme",
    currencyKey: "ai-credits",
    amount: 100,
    grantType: "prepaid",
    idempotencyKey: "purchase-123",
  });
  await subscrio.credits.processScheduledGrants("acme");
  await subscrio.credits.getBalance("acme", "ai-credits");
  await subscrio.credits.listBalances("acme");
  await subscrio.credits.canConsume({
    customerKey: "acme",
    featureKey: "render",
    units: 2,
  });
  await subscrio.credits.consume({
    customerKey: "acme",
    featureKey: "render",
    units: 2,
    idempotencyKey: "render-123",
  });
  await subscrio.credits.adjust({
    customerKey: "acme",
    currencyKey: "ai-credits",
    amount: -2,
    reason: "correction",
    idempotencyKey: "adjust-123",
  });
  await subscrio.credits.listGrants("acme", "ai-credits");
  await subscrio.credits.getOperation("acme", "render-123");
  await subscrio.credits.listLedgerEntries("acme", "ai-credits");
}
