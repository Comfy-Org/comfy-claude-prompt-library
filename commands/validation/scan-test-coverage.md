# Scan Test Coverage

I need to analyze test coverage and quality for: $ARGUMENTS

## Your Task

Evaluate test coverage, identify untested code paths, and assess test quality.

## Execution Steps

1. **Coverage Metrics**
   - Line coverage percentage
   - Branch coverage percentage
   - Function coverage percentage
   - Statement coverage percentage
   - Identify coverage config files

2. **Untested Code Detection**
   - Critical paths without tests
   - Error handling branches
   - Edge cases not covered
   - New code without tests
   - Complex functions with low coverage

3. **Test Quality Assessment**
   - Tests that only check happy path
   - Missing negative test cases
   - No edge case testing
   - Weak assertions (only checking defined)
   - Tests with no assertions

4. **Test Patterns**
   - Integration vs unit test balance
   - Test isolation issues
   - Excessive mocking
   - Flaky tests patterns
   - Slow test identification

5. **Critical Gap Analysis**
   - Authentication/authorization logic
   - Payment/financial calculations
   - Data validation functions
   - Security-critical code
   - User input handling

## Report Format

```
## Test Coverage Analysis

### Coverage Summary
- Line Coverage: X%
- Branch Coverage: Y%
- Uncovered Files: Z

### Critical Untested Code
- [Function/Component]: 0% coverage - HIGH RISK
  Purpose: [What this code does]
  
### Test Quality Issues
- [Test File]: Only tests happy path
- [Test File]: No error case testing
- [Test File]: Weak assertions

### Missing Test Categories
- Error boundary testing
- Edge case validation
- Performance regression tests

### Recommendations
1. Add tests for [critical function]
2. Improve branch coverage in [file]
3. Add negative test cases
```