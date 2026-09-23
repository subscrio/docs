# Entitlement examples

These TypeScript and C# examples demonstrate subscription add-ons, feature resolution, metered usage, credit wallets and timed overrides. Each run imports entitlement-config.json, then creates sample records and checks the resulting values and balances. The `reference-calls` files contain additional method examples that are compiled but not executed by the demos.

The examples use published `subscrio` 0.5.0 and `Subscrio.Core` 0.5.1 packages. Set DATABASE_URL to a disposable PostgreSQL database (a PostgreSQL URL for TypeScript; an Npgsql connection string for .NET).

TypeScript: run `npm install`, `npm run typecheck`, and `npm run demo` in `examples/typescript`. Node 20.19 or newer is required.

.NET: run `dotnet run --project examples/dotnet`. The example project requires the .NET 10 SDK and restores core from NuGet. The library supports .NET 8, 9 and 10.

The demos use unique record keys so they can be run repeatedly. They retain the records they create. Use a disposable database.
