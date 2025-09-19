# Solve Sentry Issue with Test-Driven Development

Can you get full context and info on this Sentry issue $ARGUMENTS

## Context

This command combines comprehensive Sentry issue investigation with test-driven development to create robust, well-tested solutions. You will perform best when you have a clear target to iterate against—in this case, test cases that define expected behavior based on the Sentry error analysis.

## Instructions

Follow these steps in sequence. **Do not skip steps or work ahead.**

### Step 1: Sentry Issue Deep Dive
<sentry_analysis>
1. **Extract issue details from the Sentry URL**: Use Sentry MCP tools to get comprehensive issue information
2. **Understand the error context**:
   - Error message and stack trace
   - Frequency and affected users
   - Environment and release information
   - User actions leading to the error
   - Device/browser information if available
3. **Analyze error patterns**:
   - When does this error occur most frequently?
   - Are there common user paths or inputs?
   - Has this increased recently with any releases?
4. **Get related context**:
   - Search for similar issues in Sentry
   - Check if this is related to recent code changes
   - Look for any existing GitHub issues referencing this error
5. **Download attachments** if available (screenshots, logs, etc.)
6. **Identify root cause indicators** from the stack trace and context
7. **Do not write any code yet** - this is analysis only
</sentry_analysis>

### Step 2: Codebase Investigation
<codebase_analysis>
1. **Locate the problematic code** using the stack trace information
2. **Search the codebase** for relevant files and existing patterns:
   - Use file paths from the stack trace
   - Search for error messages or related functionality
   - Look for similar error handling patterns
3. **Analyze the surrounding code**:
   - Understand the business logic context
   - Identify data flows and dependencies
   - Check for existing tests in the area
4. **Research the git history**:
   - Look for recent commits affecting the problematic code
   - Check if this error coincides with specific releases
   - Review commit messages for related changes
5. **Document your findings** about the likely root cause
6. **Do not write any implementation code** - continue with analysis
</codebase_analysis>

### Step 3: Test Design (TDD Phase 1)
<test_design>
1. **Based on the Sentry error analysis**, write comprehensive tests that would catch this bug
2. **Create tests for the error scenario**:
   - Reproduce the exact conditions from the Sentry error
   - Test the specific user inputs or data that trigger the issue
   - Include edge cases identified from the error patterns
3. **Add preventive tests**:
   - Test boundary conditions around the error
   - Test error handling paths that should exist
   - Test the happy path to ensure it continues working
4. **Be explicit about doing test-driven development** - avoid creating mock implementations
5. **Write tests that will fail initially** since the bug currently exists
6. **Include integration tests** if the error spans multiple components
7. **Do not write any implementation code** - only tests
</test_design>

### Step 4: Test Verification
<test_verification>
1. **Run the tests you just created**
2. **Confirm they fail** as expected (this proves the bug exists)
3. **Verify the test failures match the Sentry error** patterns
4. **If tests pass unexpectedly**, investigate why:
   - The bug may be environment-specific
   - Additional conditions may be needed to reproduce
   - The error may be intermittent
5. **Adjust tests** if needed to properly reproduce the Sentry issue
</test_verification>

### Step 5: Commit Tests
<commit_tests>
1. **Review the tests** to ensure they properly capture the Sentry issue
2. **When satisfied with test coverage**, commit the tests with a descriptive message
3. **Use format**: `[test] Add tests for Sentry issue [ISSUE-ID] - [brief description]`
4. **Reference the Sentry URL** in the commit message for traceability
</commit_tests>

### Step 6: Implementation (TDD Phase 2)
<implementation>
1. **Now write code that makes the tests pass**
2. **Address the root cause** identified in your Sentry analysis
3. **Do not modify the tests** - they define the contract
4. **Implement robust error handling**:
   - Add proper input validation
   - Include meaningful error messages
   - Handle edge cases identified from Sentry patterns
5. **Run tests frequently** and iterate on the implementation
6. **Keep going until all tests pass** - this may take multiple iterations
7. **Focus on making tests pass first**, optimize later if needed
</implementation>

### Step 7: Sentry Integration & Monitoring
<sentry_integration>
1. **Add proper error tracking** for the fixed code:
   - Include contextual information in any new error scenarios
   - Add breadcrumbs for debugging if appropriate
   - Ensure error messages are helpful for future debugging
2. **Test error reporting**:
   - Verify that remaining error cases are properly reported to Sentry
   - Ensure error context includes sufficient debugging information
3. **Update error handling** to be more defensive where appropriate
</sentry_integration>

### Step 8: Verification & Validation
<verification>
1. **Ensure all tests pass consistently**
2. **Run existing test suites** to verify no regressions
3. **Manually test the error scenario** if possible:
   - Try to reproduce the original Sentry error conditions
   - Verify the fix resolves the issue
   - Test related functionality
4. **Use independent verification**: Create a subagent to review the implementation
5. **Check that the solution addresses the Sentry error** root cause
6. **Test in conditions similar to production** if possible
</verification>

### Step 9: Final Commit & Sentry Follow-up
<final_commit>
1. **When satisfied with the implementation**, commit the code changes
2. **Use format**: `[fix] Resolve Sentry issue [ISSUE-ID] - [brief description]`
3. **Include the Sentry URL** in the commit message
4. **Update Sentry issue status** if possible (resolve, add comments)
5. **Run any required linting or formatting tools**
6. **Consider if documentation updates** are needed for the fix
</final_commit>

## Important Notes

- **Follow TDD workflow strictly** - tests first, then implementation
- **Use Sentry context heavily** - the error patterns guide your test design
- **Tests define the contract** - don't modify them during implementation
- **Focus on root cause** identified from Sentry analysis, not just symptoms
- **Include proper error handling** and monitoring in your solution
- **Verify the fix addresses the actual Sentry issue** patterns

## Sentry-Specific Considerations

- **Error frequency patterns** can indicate if this is a regression or edge case
- **User context** from Sentry can help design more targeted tests
- **Release correlation** can point to specific code changes that introduced the bug
- **Similar errors** in Sentry can indicate if this is part of a larger pattern
- **Environment data** helps ensure your fix works across different conditions

## Success Criteria

✅ Sentry issue thoroughly analyzed and root cause identified  
✅ Comprehensive tests written based on error patterns  
✅ Tests initially fail, proving the bug exists  
✅ Tests committed before implementation  
✅ Implementation addresses root cause from Sentry analysis  
✅ All tests pass after implementation  
✅ No regressions in existing functionality  
✅ Proper error handling and monitoring added  
✅ Independent verification confirms solution quality  
✅ Final implementation committed with Sentry reference  
✅ Sentry issue status updated appropriately  

Begin with Step 1 and work through each phase methodically, using the Sentry error data to drive your test design and implementation approach.