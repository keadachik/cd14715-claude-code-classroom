---
name: typescript-patterns
description: Analyzes TypeScript code for type safety, patterns, and common issues. Use when reviewing TypeScript files (.ts, .tsx), checking type safety, identifying type errors, or recommending advanced TypeScript patterns for modern codebases.
---

# TypeScript Patterns Skill

## Expertise

TypeScript code review with focus on type safety, advanced patterns, and common type issues. Provides expert-level analysis for modern TypeScript codebases with ES6+ features.

## Capabilities

- Detecting type safety issues and anti-patterns
- Identifying common TypeScript type errors
- Recommending advanced TypeScript patterns (generics, utility types, conditional types)
- Analyzing code for proper type annotations
- Reviewing type narrowing and type guards
- Checking for proper use of TypeScript-specific features

## Analysis Criteria

### Type Safety Issues

**Using `any` Type**
- Problem: Using `any` defeats TypeScript's type safety
- Impact: Loss of type checking, runtime errors
- Fix: Use specific types, `unknown`, or generics

**Missing Type Annotations**
- Problem: Function parameters or return types not annotated
- Impact: Reduced type safety, harder to maintain
- Fix: Add explicit type annotations

**Type Assertions Abuse**
- Problem: Excessive use of `as` type assertions
- Impact: Bypasses type checking, potential runtime errors
- Fix: Use proper type guards or fix underlying type issues

### Advanced TypeScript Patterns

**Generics**
- When to use: Functions or classes that work with multiple types
- Best Practices: Use descriptive generic names, add constraints when needed

**Utility Types**
- Common types: `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`
- When to use: Transform existing types without redefining

**Conditional Types**
- Use case: Type transformations based on conditions
- Example: `T extends string ? ... : ...`

### Common Type Issues

**Null/Undefined Handling**
- Problem: Accessing properties without null checks
- Impact: Runtime errors
- Fix: Use optional chaining `?.` or nullish coalescing `??`

**Type Narrowing**
- Problem: TypeScript can't narrow types properly
- Fix: Use type guards, `typeof`, `instanceof`, or discriminated unions

## Examples

### Example 1: Type Safety Issues

**Input:**
```typescript
function processData(data: any) {
  return data.value.toString();
}
```

**Analysis:**
- Problem: Using `any` type removes type safety
- Impact: No type checking on `data.value`, potential runtime errors
- Fix: Use `unknown` with type guards or define a specific type

**Fixed:**
```typescript
interface Data {
  value: string | number;
}

function processData(data: Data) {
  return data.value.toString();
}
```

## Output Format

Return JSON with:
```json
{
  "issues": [
    {
      "line": 10,
      "severity": "error" | "warning" | "info",
      "category": "type-safety" | "pattern" | "best-practice",
      "rule": "no-any",
      "message": "Description of the issue",
      "suggestion": "How to fix it",
      "codeExample": "Example fix"
    }
  ],
  "summary": {
    "errors": 2,
    "warnings": 3,
    "info": 1
  },
  "qualityScore": 75
}
```