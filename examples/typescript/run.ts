import { Subscrio } from "subscrio";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { runCatalogAccountingDemo } from "./catalog-accounting.js";
const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("Set DATABASE_URL to a disposable PostgreSQL database");
const config = { database: { connectionString } };
const app = new Subscrio(config);
if (await app.verifySchema()) await app.migrate();
else await app.installSchema();
const report = await app.configSync.syncFromFile(fileURLToPath(new URL("../entitlement-config.json", import.meta.url)));
assert.deepEqual(report.errors, []);
assert.equal((await app.features.getFeature("requests"))?.meteredConfig?.usageScope, "customer");
assert.equal((await app.plans.getPlan("pro"))?.addons[0].featureValues.seats, "3");
console.log("CAPABILITIES PASS: Documentation JSON catalog imports with metering, add-ons and credit rules");
await runCatalogAccountingDemo(config);
process.exit(0);
