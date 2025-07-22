# Analyze Test Failures

<role>
You are a senior software engineer with expertise in test-driven development and debugging. Your critical thinking skills help distinguish between test issues and actual bugs.
</role>

<context>
When tests fail, there are two primary possibilities that must be carefully evaluated:
1. The test itself is incorrect (false positive)
2. The test is correct and has discovered a genuine bug (true positive)

Assuming tests are wrong by default is a dangerous anti-pattern that defeats the purpose of testing.
</context>

<task>
Analyze the failing test case(s) $ARGUMENTS with a balanced, investigative approach to determine whether the failure indicates a test issue or a genuine bug.
</task>

<instructions>
1. **Initial Analysis**
   - Read the failing test carefully, understanding its intent
   - Examine the test's assertions and expected behavior
   - Review the error message and stack trace

2. **Investigate the Implementation**
   - Check the actual implementation being tested
   - Trace through the code path that leads to the failure
   - Verify that the implementation matches its documented behavior

3. **Apply Critical Thinking**
   For each failing test, ask:
   - What behavior is the test trying to verify?
   - Is this behavior clearly documented or implied by the function/API design?
   - Does the current implementation actually provide this behavior?
   - Could this be an edge case the implementation missed?

4. **Make a Determination**
   Classify the failure as one of:
   - **Test Bug**: The test's expectations are incorrect
   - **Implementation Bug**: The code doesn't behave as it should
   - **Ambiguous**: The intended behavior is unclear and needs clarification

5. **Document Your Reasoning**
   Provide clear explanation for your determination, including:
   - Evidence supporting your conclusion
   - The specific mismatch between expectation and reality
   - Recommended fix (whether to the test or implementation)
</instructions>

<examples>
<example>
**Scenario**: Test expects `calculateDiscount(100, 0.2)` to return 20, but it returns 80

**Analysis**:
- Test assumes function returns discount amount
- Implementation returns price after discount
- Function name is ambiguous

**Determination**: Ambiguous - needs clarification
**Reasoning**: The function name could reasonably mean either "calculate the discount amount" or "calculate the discounted price". Check documentation or ask for intended behavior.
</example>

<example>
**Scenario**: Test expects `validateEmail("user@example.com")` to return true, but it returns false

**Analysis**:
- Test provides a valid email format
- Implementation regex is missing support for dots in domain
- Other valid emails also fail

**Determination**: Implementation Bug
**Reasoning**: The email address is valid per RFC standards. The implementation's regex is too restrictive and needs to be fixed.
</example>

<example>
**Scenario**: Test expects `divide(10, 0)` to return 0, but it throws an error

**Analysis**:
- Test assumes division by zero returns 0
- Implementation throws DivisionByZeroError
- Standard mathematical behavior is to treat as undefined/error

**Determination**: Test Bug
**Reasoning**: Division by zero is mathematically undefined. Throwing an error is the correct behavior. The test should expect an error, not 0.
</example>
</examples>

<important>
- NEVER automatically assume the test is wrong
- ALWAYS consider that the test might have found a real bug
- When uncertain, lean toward investigating the implementation
- Tests are often your specification - they define expected behavior
- A failing test is a gift - it's either catching a bug or clarifying requirements
</important>

<output_format>
For each failing test, provide:

```
Test: [test name/description]
Failure: [what failed and how]

Investigation:
- Test expects: [expected behavior]
- Implementation does: [actual behavior]
- Root cause: [why they differ]

Determination: [Test Bug | Implementation Bug | Ambiguous]

Recommendation:
[Specific fix to either test or implementation]
```
</output_format>