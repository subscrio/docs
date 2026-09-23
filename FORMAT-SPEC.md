# Library reference page specification

This is the required format for every page grouped under Library Reference. Read [AGENTS.md](AGENTS.md) for navigation, placement, source verification, and completion rules. This specification replaces the previous method-section format entirely.

## Reference example

[Features](docs/reference/features.md) is the maintained verification example of this specification. AGENTS.md and this specification are the authoritative instructions; all approved layout, markup, and verbosity decisions must be written here rather than inferred from the example. Follow the templates below when converting another library object, then compare the rendered result in both languages with the approved example. Preserve that object's actual methods, types, and requirements, verified against its library code. Keep this specification, AGENTS.md, and Features in agreement after each approved format change; older standalone previews are not authoritative.

## Verbosity and detail

The Features page is the approved benchmark for verbosity in both languages. Match its explanation length, amount of detail, and balance between prose, signatures, examples, and property tables when writing other library references. Preserve that level when maintaining Features itself.

- Give simple methods a short, direct description. Use additional short paragraphs only for meaningful effects or restrictions, as in `updateFeature`.
- Keep parameter, return, error, and property descriptions brief but explicit. Explain the trigger and consequence of a rule in ordinary language; do not compress it into unexplained terminology.
- State each fact where it belongs. Link to shared setup, update conventions, and canonical types instead of repeating them.
- Keep one useful example visible. Put additional long scenarios in a disclosure or a linked guide.
- Match the detail to the method's complexity, not a fixed word count. Do not pad simple methods or omit important constraints to make complex methods equally short. Do not expand the page into a tutorial or shorten it into cryptic fragments.

## Page structure

Every reference page has YAML front matter, one H1 matching its navigation label, and the following six H2 sections, in this exact order. Keep these headings even when a section has a short explanation that no entries apply. Do not introduce additional H2 sections.

| Heading | Required content |
| --- | --- |
| Purpose | One short paragraph explaining the object's responsibility and when to use it.      |
| Access and initialization | The public access path; construction and shared setup belong on Subscrio. |
| Method catalog | A compact, linked inventory of every supported public method in both languages. |
| Method details | One consistent entry for every catalog operation. |
| Data types | Canonical definitions of input, output, option, configuration, and enum types used on the page. |
| Related guides | A short list of links to workflows and related objects. Nothing follows this section. |

Use H3 for each method and each data type. Keep methods visible in the right-hand contents panel, without making separate sidebar pages for them. Do not add an extra grouping level above methods. Do not recreate the previous pattern of multiple nested headings for Description, Input Properties, Return Properties, Expected Results, and Potential Errors.

Use one site-wide language selector in the header. It controls all language-specific content, including method names, signatures, parameters, returns, examples, errors, and data-type tables. Shared prose describes common behavior once. Name actual language differences only where they help the reader. Do not render local language tabs.

## Site-wide language selection

- The header has one selector, labeled TypeScript and .NET. It remains accessible on desktop and mobile. No section, method, example, or type has its own language control.
- Use a shared site preference, `subscrio.docs.language`, with values `ts` and `net`. Default to TypeScript when there is no valid saved choice. Persist changes across page navigation and reloads. Storage failure must not prevent switching.
- Update the entire page together, including object access paths, catalog names, method headings, table-of-contents labels, signatures, parameter/property names, defaults, returns, examples, error names, and type definitions. The catalog has Method and Purpose columns, showing the selected language only.
- Shared explanatory prose remains visible once. If a language lacks a capability, show an explicit availability statement in that language's view, with a supported alternative when one exists. Do not show the other language's code as a silent fallback.
- Keep stable, language-independent section IDs and preserve published anchors. Switching languages must not navigate away from the current method or type. Display labels may change without changing anchors.
- Apply the saved preference before displaying language-specific content to avoid flashing the wrong language. Reapply it when site navigation replaces page content. The source contains both variants; only the selected variant is visible and exposed to assistive technology.
- Use keyboard-accessible buttons with an exposed selected state, or an accessible select control. Without JavaScript, provide a readable TypeScript default and explain that switching requires JavaScript. If storage is unavailable, switching still works for the current page; only persistence is unavailable. Printing uses the currently selected language.
- Author variants using the HTML wrappers shown below. The existing `md_in_html` extension renders Markdown inside `markdown="1"` containers. Use `data-lang="ts"` and `data-lang="net"`; the site theme owns switching and visibility. Do not add `===` language-tab markup or tablist/tabpanel roles. These wrappers alone do not implement the selector; verify the theme behavior during the site rollout.

## Whole-page template

Replace all angle-bracket placeholders before publishing. The fenced templates in this file are instructions for authors, not text to copy into published examples unchanged.

````markdown
---
title: <Exact navigation label>
description: <One factual sentence identifying the object and the scope of this reference.>
reference_format: true
---

# <Exact navigation label>

## Purpose

<What this object owns and when an application uses it.>

## Access and initialization

### Access

<For Subscrio, document initialization and schema setup. Other objects show only their access expression; mention example-specific prerequisites beside the relevant example.>

<div class="language-content" data-lang="ts" markdown="1">


```typescript
<Actual public access expression or root initialization.>
```

</div>

<div class="language-content" data-lang="net" markdown="1">


```csharp
<Equivalent actual public access expression or root initialization.>
```

</div>

<Include ### Constructor only when direct construction is supported public usage; otherwise omit it.>

## Method catalog

<div class="language-content" data-lang="ts" markdown="1">

| Method | Purpose |
| --- | --- |
| [`<actual TypeScript method name>`](#<stable-method-anchor>) | <One short sentence.> |

</div>

<div class="language-content" data-lang="net" markdown="1">

| Method | Purpose |
| --- | --- |
| [`<actual .NET method name>`](#<stable-method-anchor>) | <One short sentence.> |

</div>

## Method details

<Repeat the method-entry template for every catalog operation, in catalog order.>

## Data types

<Repeat the data-type template for each type defined here. Link to canonical definitions elsewhere for shared types.>

## Related guides

- [<Guide or related object title>](<relative-path.md>)
````

## Access and constructors

Use ### Access to show the supported public access path. Initialization and schema prerequisites belong once on the Subscrio page. Do not repeat statements such as "These examples assume an initialized instance and installed schema" on every object page, or recreate Subscrio inside each object's access example. Add ### Constructor only when direct construction is part of supported public usage, such as creating Subscrio. Public visibility of an implementation class alone is not a reason to document its constructor.

For objects obtained through Subscrio, show that access once and omit the Constructor heading, empty placeholders, and implementation-wiring disclosures. Do not document repositories and validators as ordinary application setup.

The Subscrio page introduces construction as the starting point and links to its exposed objects. Include supported .NET dependency-injection setup where applicable. Explain cleanup responsibilities and link to the relevant method. Put the full configuration type under Data types.

For a supported constructor, use the compact method-entry layout below: a description of initialization and its effects, public calling signature, brief input descriptions, a working example, and an Errors disclosure when useful. Apply the signature rules below, including moving default values into input descriptions. Omit Returns. Include both language variants; if construction is supported in only one language, explain the supported access path in the other. Never invent construction for an interface or DTO.

## Method catalog and order

Use only the two columns in the whole-page template: Method and Purpose. Do not add Kind or another classification column. Render the selected language's method names; keep both variants in the source. Every operation links to its detailed entry. Keep catalog and detail order identical.

Order methods by the reader's workflow: creation/definition, update/configuration, retrieval/listing, operational actions, archive/unarchive/delete, diagnostics, and helpers. Keep related pairs together, such as attach/detach or set/remove. Do not simply copy source-file order.

Explain diagnostic or helper use in the Purpose column and method description when relevant; do not add a classification column. For deprecated methods, explain their status, actual behavior, and replacement in the details.

Map actual methods between languages. If one language lacks an operation, show `Not available in this language` in that language's catalog view and explain the limitation in its detail view. Do not invent matching names. Put all supported overloads in the same operation entry, with separate signature blocks and examples when their use differs.

## Shared partial-update convention

Document the shared convention once in Getting Started, under `## Updating existing records` with the anchor `partial-updates`. It is not a method or initialization concern on the Subscrio object. This is a convention for methods explicitly documented as supporting partial updates, not a promise about every DTO, every update method, or every data parameter. Verify each method before linking it to the convention.

The shared explanation must cover:

- A partial update changes supplied properties while retaining omitted properties. Use a concrete example: changing a feature's default value leaves its name and description unchanged. Method-specific automatic side effects are documented beside the method.
- In TypeScript, verified methods using `undefined` to represent omission retain a property's value when it is omitted or `undefined`. Explicit `null` is different; the method/type documentation must say whether it is accepted, rejected, or clears the value.
- In .NET, verified methods using nullable update properties to represent omission retain the saved value when the property is left at its default `null`. That `null` does not clear the property. Do not extend this rule to methods using another update representation.
- Partial updates do not imply recursive merging. Each method/type documents whether supplied maps, objects, and arrays are replaced or merged, whether a complete nested configuration is required, and what empty values do.

At the method, put a short link beside the update parameter: `Uses [partial updates](getting-started.md#partial-updates).` Do not repeat the shared omission explanation in every method's description or DTO introduction. Retain specific restrictions and exceptions at the point of use, such as rejected nulls, replacing metadata, required nested settings, or changes prohibited after usage has been recorded.

Apply the header language selector to the shared explanation. Keep the shared anchor stable. Do not create a separate sidebar page or add this convention as a section of any Library Reference page. Standalone previews must follow this organization as well. Never link published pages to a convention that has not yet been added.

## Method-entry template

Keep each entry compact. Use this order: H3 method name, a concise description covering its outcome and meaningful behavior, signature, input descriptions, return meaning, example, and an optional Errors disclosure. Everything except the name and shared description belongs in the selected language variant. Do not repeat shared conceptual explanations.

Use the selected language's actual method name as the H3. Preserve a stable operation anchor across languages and all published anchors.

````markdown
<div class="method-entry" markdown="1">

### <actualTypeScriptMethodName> { #<stable-method-anchor> data-method-ts="<actualTypeScriptMethodName>" data-method-net="<actualDotNetMethodName>" }

<Concise description of the outcome and meaningful effects or restrictions. Add short paragraphs only when needed; identify diagnostic/helper use or deprecation when applicable.>

<div class="language-content" data-lang="ts" markdown="1">

<div class="signature" markdown="1">

```typescript
<Public calling signature with actual names, parameter types, optional markers, nullability, and return type; no default-value initializers.>
```

</div>

**Parameters**

- `<parameter>`: <Purpose; link structured inputs to their canonical DTO. State optionality, defaults, and conditional requirements where applicable. For verified partial-update methods, link to the shared convention and state exceptions.>

**Returns** <Resolved value type, linking named DTOs to their property definitions>: <Meaning, including null or empty results.>

**Example**

```typescript
<Working example using the public access path and declared prerequisites.>
```

<details class="method-errors" markdown="1">
<summary>Errors (<count>)</summary>

- `<actual error type>`: <Verified failure condition.>

</details>

</div>

<div class="language-content" data-lang="net" markdown="1">

<div class="signature" markdown="1">

```csharp
<Public calling signature with actual C# names, parameter types, nullability, and return type; no default-value initializers. Describe optional arguments below.>
```

</div>

**Parameters**

- `<parameter>`: <Purpose; link structured inputs to their canonical DTO. State optionality, defaults, and conditional requirements where applicable. For verified partial-update methods, link to the shared convention and state exceptions.>

**Returns** <Resolved value type, linking named DTOs to their property definitions>: <Meaning, including null or empty results.>

**Example**

```csharp
<Working example using the public access path and declared prerequisites.>
```

<details class="method-errors" markdown="1">
<summary>Errors (<count>)</summary>

- `<actual error type>`: <Verified failure condition.>

</details>

</div>

</div>
````

Method-entry requirements:

- Show the public calling signature without a Signature label. Preserve actual method names, parameter order, types, generic constraints, nullability, and return types. Omit default-value initializers such as `= { limit: 50, offset: 0 }`, `= null`, and `= 50`; put those defaults in the parameter descriptions. Signatures describe the calling contract, not the implementation body or an example invocation.
- In TypeScript, use `?` for an argument that callers may omit, including arguments with implementation defaults. Do not mark required arguments optional or change DTO field requirements. In C#, retain actual nullable types and describe optional arguments in their input bullets; do not invent TypeScript-style optional markers. These compact C# signatures omit default initializers for display and are not declarations to paste into an implementation.
- Use compact input bullets, not a five-column parameter table. The signature supplies types; the bullets explain purpose, optionality, default behavior, and conditional runtime requirements. State each default once in the entry, normally in the input bullet. Distinguish an omitted argument from fields omitted inside a supplied DTO. Do not repeat Yes/None/default cells or DTO field lists. Omit inputs entirely for parameterless methods.
- Returns must name the resolved value type and link every named DTO to its canonical property definition, followed by a brief description. For example, `FeatureDto` links to its fields; collections display `FeatureDto[]` or `List<FeatureDto>` with the element type linked. Preserve nullability such as `FeatureDto | null` or `FeatureDto?`. Keep the full Promise/Task wrapper in the signature only. A vague description such as "The updated feature snapshot" without the type link is insufficient. For void/non-generic Task methods, say there is no returned value. The linked Data types entry must document all public returned properties, their types, presence/nullability, and meanings; do not repeat that property table beneath every method.
- Label input descriptions Parameters. Do not add separate Behavior, Update rules, or equivalent sections for either queries or state-changing methods. Put meaningful effects and operational restrictions in the method description, input requirements beside the parameter or canonical DTO property, returned-data details in Returns, and failure conditions under Errors. Ordinary existence checks such as "The product must exist" belong under the relevant not-found error, not in a separate explanatory section. Do not repeat facts already explained elsewhere in the entry.
- Explain consequential behavior in the description using complete, plain-language sentences: state the trigger, what the caller can or cannot do, and the practical effect. Preserve side effects, restrictions, precedence, idempotency, expiration, and transaction boundaries where applicable. Read methods need no extra prose unless their selection or resolution rules need explaining. For state changes such as archive, explain meaningful consequences verified against the code, rather than merely restating the method name. Keep destructive effects and important operational restrictions visible in the description; removing a section must not remove that information.
- Show only the selected language's property names and method-specific omission/null exceptions. Link to the shared partial-update convention for the general rule. Put method-specific requirements in both source variants if needed to keep the visible entry coherent.
- Keep a useful example expanded. Put additional long scenarios in a clearly named disclosure or linked guide, preserving their coverage. Examples must use actual types, valid inputs, and declared prerequisites. No undeclared variables, executable ellipses, or invented runtime output.
- Put verified error names and conditions in a collapsed native details element labeled Errors with a count. Use compact bullets rather than another table. Omit this disclosure when no method-specific errors apply; describe general infrastructure failures once at page level. Ensure disclosure content is keyboard accessible, searchable, and available in print.
- Define DTO fields once under Data types. Link to them from inputs and returns rather than reproducing field tables in each method.
- If an operation is unavailable in one language, show a precise availability statement with a supported alternative. Do not fill the space with fake signatures or examples.
- Reduce repetition and spacing, not legibility. Keep code readable and allow long signatures to wrap. Preserve all supported methods, overloads, defaults, conditional validation, and error conditions.

For example, the TypeScript reference signature is:

```typescript
listFeatures(filters?: FeatureFilterDto): Promise<FeatureDto[]>
```

Its input description states: `filters`: Optional filter options. When omitted, returns up to 50 records starting at offset 0. Link `FeatureFilterDto` to its canonical definition for requirements when supplying a filters object. Keep concrete filter values in the Example block, not the signature.

## Data-type template

Each type has an H3 naming its actual type, a one-sentence purpose, and paired language variants controlled by the header selector. If names differ, use the selected language's actual name as the visible heading and preserve one stable type anchor. For .NET-only types use the .NET name.

Define types once and link to the canonical definition from other pages. Keep create, update, and output shapes separate when their fields or requirements differ. Order definitions by first appearance on the page. Use named entries and links for nested shapes instead of deeply nested tables.

````markdown
<div class="data-type" markdown="1">

### <ActualTypeName> { #<stable-type-anchor> }

<What the type represents and whether it is an input, output, or shared type.>

<div class="language-content" data-lang="ts" markdown="1">


| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `<fieldName>` | `<exact type>` | Yes / No / Conditional | `<value>` or None | <Meaning and constraints.> |

</div>

<div class="language-content" data-lang="net" markdown="1">


| Property | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `<PropertyName>` | `<exact type>` | Yes / No / Conditional | `<value>` or None | <Meaning and constraints.> |

</div>

<Explain cross-field requirements and relevant differences between the languages. Omit this paragraph if none apply.>

</div>
````

For inputs, Required means the caller must supply the field. For outputs, it means the field is guaranteed present; show nullability separately in Type. State which meaning applies for each type. Output fields without an input default use `Not applicable` in Default. Do not confuse language defaults with database defaults.

For enums, replace field tables with `Value | Meaning` tables in each language variant. For dictionaries, state what the keys and values mean. For updates, explain omission, null, empty-map/array, and merge/replacement behavior where they differ. Document nested add-on snapshots and other returned relationships where the code exposes them. Never describe a field that only exists internally as public DTO data.

If there are no structured types to define, retain Data types and state that all values are primitives or link to the shared types used.

## Markup and rendering

- Set `reference_format: true` in front matter to enable the reference layout. The theme supplies the outer `.reference-page` container.
- Wrap each method in `<div class="method-entry" markdown="1">`, each signature in `<div class="signature" markdown="1">`, and each type definition in `<div class="data-type" markdown="1">`, as shown in the templates and Features source.
- Keep one shared method heading with a stable ID and `data-method-ts` / `data-method-net` attributes containing the actual names. The site script updates the heading and contents label together. Use the same mechanism for type headings whose names differ between languages. Do not use guessed names or alter published IDs to match capitalization.
- Keep Method catalog tables and all language-specific content inside the appropriate `data-lang` wrapper. Keep common method descriptions outside those wrappers; use paired wrappers within the description only when the behavior differs by language.
- Use the parameter, return, and error punctuation shown in Features. Link structured types to their property definitions. Omit redundant type-name lines immediately below a type heading.
- Preserve existing compatibility anchors when converting published pages. Copy the wrapper pattern from Features, but create only anchors appropriate to the page being converted.
- Keep the main example expanded. Use `class="additional-example"` on an optional disclosure for an additional long example, and `class="method-errors"` on the Errors disclosure.
- Align disclosure labels with the method content's left edge in both collapsed and expanded states. Reset the theme's negative summary margins in the shared reference stylesheet.

## Final page rules

- Use exactly one H1 and the six required H2 headings. H3 headings are Access, Constructor where supported public construction applies, methods, and data types. Shared update conventions belong in Getting Started and are linked from relevant parameters.
- Title, navigation label, and H1 agree. Titles do not gain ad hoc Service or API suffixes.
- Keep TypeScript then .NET variants in source, controlled solely by the header selector. Use `typescript` and `csharp` fenced code blocks.
- Keep Related guides last. New capabilities belong in their owning method/type entries, never appended below it.
- Existing useful information must survive reorganization. Move conceptual material to an appropriate guide if it would overwhelm the reference, and retain working links.
- Follow AGENTS.md verification steps before declaring a page complete. Source accuracy, language sample correctness, and rendered usability are all required.
- Check the rendered page against the current spec after each review change. Confirm the preview also implements agreed rules: no default initializers in signatures, working return-type/property links, a clear Parameters label, meaningful behavior integrated into descriptions without separate Behavior/Update rules sections, and a working shared-convention link with method-specific exceptions. Updating this spec alone does not fix a stale preview.
