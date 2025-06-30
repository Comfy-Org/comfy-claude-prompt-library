# Scan Circular Dependencies

I need to detect circular dependencies in: $ARGUMENTS

## Your Task

Identify circular dependency chains that could cause runtime errors or build issues.

## Execution Steps

1. **Import Cycle Detection**
   - Direct circular imports (A→B→A)
   - Indirect cycles (A→B→C→A)
   - Barrel export cycles
   - Dynamic import cycles
   - Type-only import cycles

2. **Module Boundary Analysis**
   - Cross-feature dependencies
   - Layer violations (UI→Data→UI)
   - Service interdependencies
   - Store/state circular refs
   - Component circular deps

3. **Impact Assessment**
   - Runtime initialization errors
   - Undefined exports at runtime
   - Build tool warnings
   - Hot reload broken
   - Test isolation issues

4. **Architectural Violations**
   - Domain boundaries crossed
   - Abstraction inversions
   - Framework fighting patterns
   - Coupling metrics exceeded
   - Cohesion problems

5. **Resolution Strategies**
   - Identify cycle breaking points
   - Suggest refactoring approach
   - Interface extraction needs
   - Dependency injection points
   - Module reorganization

## Report Format

```
## Circular Dependency Analysis

### Critical Cycles Found
- Cycle: A → B → C → A
  Files: [List of files in cycle]
  Break point: Extract interface at B

### Module Violations
- [Feature X] ← → [Feature Y]
  Suggestion: Extract shared types

### Architecture Issues
- UI layer importing from Data layer
  Fix: Use dependency injection

### Impact Summary
- X cycles affecting Y files
- Z% of modules involved
- Build time impact: +N seconds

### Resolution Priority
1. Break cycle in [critical path]
2. Extract [shared interface]
3. Reorganize [module structure]
```