# Documentation maintenance rules

## Required table of contents

Use this hierarchy and order in `mkdocs.yml`. These paths are relative to the MkDocs content directory, `docs/`. Keep existing paths when changing labels so published URLs continue to work.

```yaml
nav:
  - Welcome: index.md
  - Getting Started: reference/getting-started.md
  - Guides:
      - How Subscrio Works: reference/entitlements-guide.md
      - Subscription Lifecycle: reference/subscription-lifecycle.md
      - How Feature Values Are Calculated: reference/feature-resolution.md
      - Add-ons and Overrides: reference/addons-and-overrides.md
      - Metered Usage Workflows: reference/metered-usage-workflows.md
      - Credit Wallet Workflows: reference/credit-wallet-workflows.md
      - Managing Configuration: reference/managing-configuration.md
  - Library Reference:
      - Subscrio: reference/core-overview.md
      - Features: reference/features.md
      - Add-ons: reference/addons.md
      - Products: reference/products.md
      - Plans: reference/plans.md
      - Billing Cycles: reference/billing-cycles.md
      - Customers: reference/customers.md
      - Subscriptions: reference/subscriptions.md
      - Feature Checker: reference/feature-checker.md
      - Metered Usage: reference/metering.md
      - Credits: reference/credits.md
      - Hooks: reference/hooks.md
      - Configuration Sync: reference/config-sync.md
      - Stripe Integration: reference/stripe-integration.md
  - Extensions & Integrations:
      - Extending Subscrio: reference/how-to-extend.md
      - Stripe Setup: reference/how-to-integrate-with-stripe.md
  - Database:
      - Relationships: reference/relationships.md
      - Schema Upgrade: reference/upgrading-entitlements.md
```

All 14 library objects belong under Library Reference. Keep Subscrio first; Features and Add-ons precede Products. Metered Usage and Credits remain core capabilities, before Hooks, Configuration Sync, and Stripe Integration. Schema Upgrade stays last, immediately after Relationships.

The four groups must be collapsible, with the active page's group expanded. The left sidebar contains page titles. The right-hand contents panel contains the current page's sections and methods. Avoid theme settings that force all groups open or mix the page contents into the left navigation. Check desktop and mobile behavior after navigation changes.

This is the required target organization. Existing navigation and pages may still need conversion; their current inconsistencies are not precedents. Creating these rules does not itself change the published navigation.

## Where new pages and content belong

| Content | Location | Rule |
| --- | --- | --- |
| Installation and first working example | Getting Started | One sequential introduction with both languages. Link to deeper material. |
| Concepts, decisions, and workflows spanning objects | Guides | Explain when, why, and how the pieces work together. Link to object references for method details. |
| A supported object exposed by the library | Library Reference | One canonical page using the required template. Place it beside related objects according to the reader's workflow. |
| A method, overload, parameter, or DTO on an existing object | The existing object's page | Update its catalog, method details, and data types. Do not create a separate release-specific page or append content after Related guides. |
| External provider setup or a software extension package | Extensions & Integrations | Explain installation, configuration, and integration workflows. Keep object signatures in their canonical reference. |
| Entity relationships and schema migration | Database | Preserve the Relationships then Schema Upgrade order. |

- Each page has one canonical navigation entry. Cross-link related pages instead of duplicating them in several groups.
- Stripe Setup is a walkthrough; Stripe Integration documents the library object. Apply the same distinction to future integrations.
- Keep existing URLs under `docs/reference/`, even when the navigation group is Guides or Database. Grouping does not require moving files. New pages use descriptive lowercase, hyphenated filenames there unless a package already has an established directory.
- Use one page for TypeScript and .NET, controlled by a single site-wide language selector in the header. Remove per-example, per-method, and per-type language tabs. Do not create parallel language navigation trees.
- These docs cover the open-source libraries, subscription add-ons, and relevant extension packages. Admin/server application screens, private services, and ABP integration documentation do not belong here.
- Do not introduce a catch-all Entitlements section for new capabilities. Use Library Reference rather than calling every object an entity.
- Navigation label, front-matter title, and H1 must agree. Do not selectively append API or Service to titles.
- Do not expose unused scaffolding, such as a blog index, merely because a file exists. New categories need a concrete reader purpose.
- Update affected incoming links, `docs/llms.txt`, and `reference-inventory.md` when pages or APIs change. Preserve published anchors, or provide working compatibility anchors/redirects when they must change.

## Exact library reference layout

Read and follow [FORMAT-SPEC.md](FORMAT-SPEC.md) before editing a Library Reference page. It contains the mandatory whole-page, constructor, method, and data-type templates. It is part of these instructions, not an optional style suggestion.

AGENTS.md and FORMAT-SPEC.md are the authoritative instructions for all 14 Library Reference pages. Follow their explicit templates and rules when converting a page. [Features](docs/reference/features.md) demonstrates the approved result and is a verification example, not a separate source of unwritten rules. If an approved detail appears only in Features, document it in these instructions before applying it elsewhere. If they disagree, reconcile the instructions and example. Keep all three files consistent after an approved format change; older standalone HTML previews are not authoritative.

Features is also the approved verbosity benchmark. Match its concise but complete descriptions, parameter and return explanations, examples, and property definitions in both languages. Preserve that balance when editing Features or converting other pages. Follow the Verbosity and detail section in FORMAT-SPEC.md; neither add repetitive explanation nor shorten important rules into unexplained fragments.

Every Library Reference page has front matter, one H1 matching the navigation label, and exactly these H2 sections in this order:

1. Purpose
2. Access and initialization
3. Method catalog
4. Method details
5. Data types
6. Related guides

Use the new specification as the authority. Do not copy the previous format from an existing page, bring back separate Description/Input Properties/Return Properties panels for every method, or add feature-specific appendices after Related guides. Put new behavior into its owning method or type. Preserve useful content when converting a page.

For Subscrio, construction is the entry point. Include a Constructor section only when direct construction is supported public usage. For objects obtained through Subscrio, show access once and omit constructor placeholders and internal wiring disclosures. Keep method entries compact: a concise description of the outcome and meaningful behavior, public calling signature, brief input and return descriptions, an expanded example, and collapsible error details. Signatures retain actual names and types but omit default-value initializers; document optionality and defaults in the input descriptions, following FORMAT-SPEC.md.

- The method catalog has exactly two columns: Method and Purpose. Do not add Kind or another classification column.
- Label input descriptions Parameters. Do not create Behavior, Update rules, or equivalent sections. Integrate meaningful effects and operational restrictions into the method description, input requirements into parameter or DTO descriptions, returned-data details into Returns, and failure conditions into Errors. An ordinary existence check such as "The product must exist" belongs under its not-found error. Apply this rule to both queries and state-changing methods. Explain what triggers each restriction and what the caller can or cannot do in plain sentences; preserve consequential details without repeating them in multiple sections.
- Returns must name the resolved value type and link structured types to their complete property documentation, preserving collection shape and nullability. Keep the Promise/Task wrapper in the signature; a description alone is insufficient.
- Document partial updates once under Updating existing records in Getting Started, at `reference/getting-started.md#partial-updates`. Link verified methods to that convention from the update parameter description. This does not apply automatically to every data parameter or update operation. Keep method-specific null handling, map/object replacement, empty-value behavior, and restrictions beside the method or relevant DTO. Follow FORMAT-SPEC.md for language differences. Do not place this shared convention in an object reference.
- Keep the main example visible. Additional long examples and error details may be collapsed, but required inputs, destructive effects, and important restrictions remain visible. Shorter documentation must retain factual coverage and readable text.
- Explain initialization and schema setup once on the Subscrio page. Other objects show their access expression without repeating generic setup assumptions. Put specific prerequisites, such as an existing product or an archived feature, beside the example that needs them.

## Guides and other non-reference pages

These pages use task-focused headings, not the six-section Library Reference template. Use the same concise, explicit prose: state prerequisites, explain meaningful decisions and limitations, and keep code and property details accurate without repeating the reference. Introductions should explain the whole model before advanced scenarios. Give complex workflows their own guides, with links from the introductory pages.

Keep TypeScript and .NET examples under the site-wide selector. Declare whether snippets form a sequence or are independent, reuse a consistent sample catalog, and validate every code block against the current implementation and relevant extensions. Execute examples when claiming their output. Identify external-provider examples that were only compiled, and never use browser-side code for database or secret-key operations. Preserve important operational details such as retries, transaction boundaries, eligibility, replacement semantics, and retained history.

## Code and sample accuracy

- Verify names, signatures, exports, constructors, DTOs, defaults, and behavior against `../core/typescript/` and `../core/dotnet/`. Read relevant tests for constraints and edge cases. Existing prose, generated review artifacts, and the method inventory are not substitutes for code.
- Do not invent .NET names by capitalizing TypeScript names or appending Async. Document actual language differences explicitly.
- Every applicable example has TypeScript and .NET variants, with only the selected language visible. The header selector is labeled `TypeScript` and `.NET`, in that order, and remembers the choice across pages and reloads. Use supported public access paths, declare prerequisites, and give meaningful results. If a capability exists in only one language, say so rather than inventing parity.
- Distinguish optional fields from nullable fields, and compile-time requirements from conditional runtime requirements. For updates, explain omitted values, nulls, empty collections, and replacement/patch behavior where relevant.
- Explain diagnostic and helper use in method descriptions, without adding a classification column. Diagnostic explanations should not appear to be required for routine feature checks.
- Explain subscription add-ons as catalog offerings and software extensions as separate packages. The conceptual guides must explain when to use a subscription override versus an add-on, and when explicit feature-resolution rules are needed. Link to those explanations where relevant without repeating them on every object page or presenting resolution configuration as mandatory setup. Keep resolution, metering, credits, and overrides consistent with the code and with their owning objects.
- Use current public vocabulary. Do not invent a special Entitlements object, unexplained composition terminology, or a legacy mode. Explain technical terms that are actually part of the implementation.
- Keep release comparisons and migration instructions in appropriately scoped material. Do not put conversational history or reassurance such as "Nobody needs to construct a composer to adopt this release" in permanent reference prose.
- Write short factual descriptions. Never embed real credentials, machine-specific paths, or localhost links in published pages.

## Verification before completion

For changes to documentation pages or navigation:

1. Check the full navigation against the required hierarchy. Confirm each intended page has one home and a consistent title. Check group collapse/expansion, active-page highlighting, the right-hand contents panel, and mobile navigation.
2. Check each changed reference page against all templates in FORMAT-SPEC.md. Include existing and new methods, overloads, supported public constructors, data types, diagnostics, helpers, and relevant errors. Verify compact signatures, linked return types, plain-language behavior integrated into descriptions without separate Behavior/Update rules sections, and shared-convention links with local exceptions. Do not lose existing API coverage while adding new features. When refining a review preview, update and recheck the preview as well as the rules; do not report a spec-only edit as a visible fix.
3. Recheck signatures and documented behavior against both implementations. Verify conditional validation, default values, return shapes, ordering, quantities, idempotency, expiration, and side effects where applicable.
4. Compile/type-check changed samples against the corresponding libraries. Run examples when their output or runtime behavior is claimed, using isolated development databases for writes. If the task includes console demos, run both language demos and compare actual output with the documentation. Report what ran and what did not.
5. Run `python -m mkdocs build --strict` from this repository using its configured Python environment and dependencies from `requirements.txt`. Resolve warnings introduced by the change. Report unrelated blockers without disabling validation to get a passing result.
6. Inspect rendered changed pages for working site-wide language selection, persistence across navigation and reloads, absence of local language tabs, readable tables, valid code blocks, anchors, relative links, narrow-screen layout, and complete examples. Check for placeholders and misplaced appended sections. Update related inventories and links.
7. Review the diff for unrelated changes and accidental files. Report changes, verification results, and remaining limitations accurately.

For maintenance-rule changes alone, review the rules for consistency and validate referenced paths. A site build or library test run is not required solely because these instruction files changed.

## Site implementation

The header selector is in `overrides/partials/header.html`. `overrides/main.html` loads the saved language before rendering and includes `docs/assets/javascripts/docs-language.js`; `docs/assets/stylesheets/reference.css` controls language visibility and the compact reference layout. Use `reference_format: true` in converted page front matter. Keep styling for converted reference pages scoped to `.reference-page` so it does not reformat unconverted pages.

`overrides/hooks/language.py` converts existing TypeScript/.NET tab markup at build time so untouched pages follow the same header preference. It preserves their examples and supplementary labels. New and converted pages use the explicit language wrappers in FORMAT-SPEC.md. Test the hook with `python -m unittest discover -s tests -v` when changing it, and verify header behavior across both converted and unconverted pages. Do not rewrite other class pages as a side effect of a single-page conversion.

## Scope and repository hygiene

These instructions apply to this documentation repository and its descendants. When starting Codex in this repository, root `AGENTS.md` is the project instruction entry point. When starting in the parent multi-repository workspace, explicitly read this file before docs work rather than assuming nested instructions were discovered. See [Codex instruction discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

AGENTS.md owns navigation and maintenance rules. FORMAT-SPEC.md owns the exact page templates. Keep them consistent and do not create competing copies. Neither file belongs in the published MkDocs navigation.

Store temporary plans, logs, workbooks, and review artifacts outside public repositories. These explicitly requested contributor rules and normal product documentation are intentional repository files. Do not edit generated `site/` output as source.

Preserve unrelated working-tree changes. Do not commit, push, merge, or deploy unless the user explicitly requests that action. A documentation edit or build request does not authorize publication.
