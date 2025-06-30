# Scan for Dead Code

I need to identify unused code in: $ARGUMENTS

## Your Task

Find unused functions, variables, imports, and files that can be safely removed.

## Execution Steps

1. **Unused Imports**
   - Imported but never used
   - Entire modules imported for one function
   - Duplicate imports
   - Circular imports
   - Dev dependencies in production code

2. **Unused Functions/Methods**
   - Private methods never called
   - Public methods with no references
   - Utility functions not exported/used
   - Event handlers not attached
   - Lifecycle methods with no logic

3. **Unused Variables/Constants**
   - Declared but never read
   - Written but never read
   - Function parameters unused
   - Destructured properties unused
   - Global variables unreferenced

4. **Unused Components/Modules**
   - React components not imported
   - Entire files unreferenced
   - Styles/CSS not applied
   - Assets not used
   - Config files orphaned

5. **Feature Flag Cleanup**
   - Flags always true/false
   - Old experiment code
   - Commented code blocks
   - Debug/test code in production
   - Deprecated API versions

## Report Format

```
## Dead Code Analysis

### Unused Imports (Safe to Remove)
- [File]: import { X } - never used
- [File]: import Y - available in global

### Unused Functions
- [Function]: No references found
  Location: [File:Line]
  Size: X lines

### Unused Files
- [FilePath]: No imports found
  Size: X KB
  Last modified: [Date]

### Commented Code
- [File:Line]: Large commented block
  Suggestion: Remove or document why kept

### Savings Summary
- Files: X files (Y KB)
- Functions: A functions (B lines)
- Imports: C imports

### Recommendations
1. Run tree-shaking build
2. Remove unused files
3. Clean up old feature flags
```