using Subscrio.Core.Config;
var connection=Environment.GetEnvironmentVariable("DATABASE_URL")??throw new InvalidOperationException("Set DATABASE_URL to a disposable PostgreSQL connection string");
var config=new SubscrioConfig{Database=new(){ConnectionString=connection}};
using var app=new Subscrio.Core.Subscrio(config);
if(await app.VerifySchemaAsync()==null)await app.InstallSchemaAsync();else await app.MigrateAsync();
var report = await app.ConfigSync.SyncFromFileAsync(Path.Combine(AppContext.BaseDirectory, "entitlement-config.json"));
if (report.Errors.Count != 0 || (await app.Features.GetFeatureAsync("requests"))?.MeteredConfig?.UsageScope != "customer"
    || (await app.Plans.GetPlanAsync("pro"))?.Addons.Single().FeatureValues["seats"] != "3")
    throw new InvalidOperationException("Documentation JSON catalog did not import correctly");
Console.WriteLine("CAPABILITIES PASS: Documentation JSON catalog imports with metering, add-ons and credit rules");
await Subscrio.Sample.CatalogAccountingDemo.Run(config);
