# Validate Code Quality

I need to analyze code quality metrics for: $ARGUMENTS

## Your Task

Perform a comprehensive code quality analysis focusing on maintainability, complexity, and best practices.

## Execution Steps

1. **Identify Target Files**
   - Parse $ARGUMENTS to determine which files/directories to analyze
   - If no specific files provided, analyze the current working directory
   - Focus on source code files (exclude node_modules, vendor, etc.)

2. **Analyze Code Complexity**
   - Check cyclomatic complexity (should be < 10 per function)
   - Measure nesting depth (should be < 4 levels)
   - Count function/method length (should be < 50 lines)
   - Identify long parameter lists (> 5 parameters)

3. **Check for Code Smells**
   - Duplicate code blocks
   - Dead code or unused variables
   - Large classes or God objects
   - Feature envy (methods using other class data excessively)
   - Long method chains

4. **Performance Patterns**
   - Look for O(n²) or worse algorithms
   - Identify N+1 query patterns
   - Check for inefficient loops or iterations
   - Memory leak potentials

5. **Generate Report**
   - Summarize findings by severity
   - Provide specific line numbers and examples
   - Suggest refactoring approaches
   - Prioritize issues by impact

## Report Format

```
## Code Quality Analysis

### Critical Issues
- [Issue]: [File:Line] - [Description]

### High Priority
- [Issue]: [File:Line] - [Description]

### Medium Priority
- [Issue]: [File:Line] - [Description]

### Metrics Summary
- Total Complexity Score: X
- Average Function Length: Y lines
- Duplication Percentage: Z%
```

## Important Notes

- Focus on actionable issues, not style preferences
- Consider the project's existing patterns before suggesting changes
- Provide concrete examples of how to fix issues
- If analyzing a large codebase, sample representative files