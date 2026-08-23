# Canonical Method Documentation Format

Every method section in the reference docs MUST follow this structure. Use for verification when rewriting documentation.

## Section Order

| Section | Location | Content |
|---------|----------|---------|
| Method name | H3 heading | `### methodName` |
| Description | Shared | 1–2 sentences |
| **TypeScript tab** | `=== "TypeScript"` | Signature, Inputs, Input Properties, Returns, Return Properties (if DTO), Example |
| **.NET tab** | `=== ".NET"` | Same structure with PascalCase / C# types |
| Expected Results | Shared, after tabs | Bullet list of behaviors |
| Potential Errors | Shared, after tabs | Error \| When table |

## Content Under Each Tab (order)

1. **Signature** – Code block with exact method signature from the library
2. **Inputs** – Table: Name, Type, Required, Description
3. **Input Properties** – Table for DTO fields (Field/Property, Type, Required, Description); omit if no DTO
4. **Returns** – Return type and one-line description
5. **Return Properties** – Table when return type is a DTO; omit otherwise
6. **Example** – Code block

## Rules

- **TypeScript**: camelCase for field names; use `Field` column header
- **.NET**: PascalCase for property names; use `Property` column header
- **Expected Results** and **Potential Errors** are shared (not duplicated in tabs)
- Verify all signatures, parameters, and DTO properties against `../core/typescript/` and `../core/dotnet/` before marking complete

## Template (Markdown)

```markdown
### methodName

#### Description
One or two sentences describing what the method does.

=== "TypeScript"
    #### Signature
    ```typescript
    methodName(params): Promise<ReturnType>
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `param` | `ParamType` | Yes/No | ... |

    #### Input Properties
    (If input is a DTO)
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | `fieldName` | `string` | Yes/No | ... |

    #### Returns
    `Promise<ReturnType>` – brief description.

    #### Return Properties
    (If return type is a DTO)
    | Field | Type | Description |
    | --- | --- | --- |
    | `fieldName` | `string` | ... |

    #### Example
    ```typescript
    await service.methodName({ ... });
    ```

=== ".NET"
    #### Signature
    ```csharp
    Task<ReturnType> MethodNameAsync(ParamType param)
    ```

    #### Inputs
    | Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | `param` | `ParamType` | Yes/No | ... |

    #### Input Properties
    | Property | Type | Required | Description |
    | --- | --- | --- | --- |
    | `PropertyName` | `string` | Yes/No | ... |

    #### Returns
    `Task<ReturnType>` – brief description.

    #### Return Properties
    | Property | Type | Description |
    | --- | --- | --- |
    | `PropertyName` | `string` | ... |

    #### Example
    ```csharp
    await subscrio.Service.MethodNameAsync(...);
    ```

#### Expected Results
- Bullet list of behaviors.

#### Potential Errors
| Error | When |
| --- | --- |
| `ValidationError` | ... |
| `NotFoundError` | ... |
```
