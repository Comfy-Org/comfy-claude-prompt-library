# Scan Type Safety Issues

I need to check type safety for: $ARGUMENTS

## Your Task

Analyze TypeScript/type annotations for type safety issues, any types, and weak typing.

## Execution Steps

1. **Type Coverage Analysis**
   - Percentage of typed vs untyped code
   - Files missing type definitions
   - Functions without return types
   - Untyped function parameters
   - Missing interface definitions

2. **Dangerous Type Patterns**
   - Usage of 'any' type
   - Type assertions (as) without validation
   - @ts-ignore or @ts-nocheck comments
   - Implicit any from missing types
   - Unsafe type narrowing

3. **Type Inconsistencies**
   - Mismatched types across files
   - Inconsistent interface definitions
   - Optional vs required confusion
   - Union type misuse
   - Generic type issues

4. **Runtime Type Safety**
   - Missing runtime validation
   - Type guards not used
   - External data not validated
   - JSON parsing without validation
   - API responses not typed

5. **Common Type Bugs**
   - Null/undefined not handled
   - Array access without bounds check
   - Object property access on possibly null
   - Incorrect type in catch blocks
   - Event handler type mismatches

## Report Format

```
## Type Safety Analysis

### Type Coverage
- Overall: X% typed
- Files with no types: Y
- Functions missing types: Z

### Critical Type Issues
- [File:Line]: Using 'any' type
  Context: [Why this is risky]
  Fix: Use specific type or unknown

### Type Safety Violations
- [File:Line]: Unsafe type assertion
  Risk: Runtime error if wrong type
  Fix: Add type guard

### Missing Validations
- [API Call]: No runtime validation
  Risk: Crash on unexpected data
  Fix: Add zod/joi validation

### Recommendations
1. Enable strict mode in tsconfig
2. Replace 'any' with specific types
3. Add runtime validation for external data
```