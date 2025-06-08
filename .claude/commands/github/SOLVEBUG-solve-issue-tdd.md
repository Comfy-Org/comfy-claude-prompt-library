# Solve GitHub Issue with Test-Driven Development

Your task is to fetch and solve the GitHub issue: **$ARGUMENTS** using test-driven development (TDD).

## Context

Test-driven development becomes extremely powerful with agentic coding. You will perform best when you have a clear target to iterate against—in this case, test cases that define expected behavior. This workflow ensures robust, well-tested solutions.

## Instructions

Follow these steps in sequence. **Do not skip steps or work ahead.**

### Step 1: Issue Analysis
<issue_analysis>
1. Use `gh issue view $ARGUMENTS` to fetch the complete issue details
2. Understand the problem, requirements, and expected behavior described
3. Identify the scope of changes needed
4. Search the codebase for relevant files and existing patterns
5. **Do not write any code yet** - this is analysis only
</issue_analysis>

### Step 2: Test Design (TDD Phase 1)
<test_design>
1. Based on the issue requirements, write comprehensive tests that define the expected behavior
2. Focus on **expected input/output pairs** from the issue description
3. **Be explicit about doing test-driven development** - avoid creating mock implementations for functionality that doesn't exist yet
4. Write tests that will **fail initially** since the functionality isn't implemented
5. Include edge cases and error conditions mentioned in the issue
6. **Do not write any implementation code** - only tests
</test_design>

### Step 3: Test Verification
<test_verification>
1. Run the tests you just created
2. **Confirm they fail** as expected (this proves the functionality doesn't exist yet)
3. Verify the test failures are for the right reasons (missing functionality, not syntax errors)
4. If tests pass unexpectedly, the functionality may already exist - investigate further
</test_verification>

### Step 4: Commit Tests
<commit_tests>
1. Review the tests to ensure they properly capture the issue requirements
2. When satisfied with test coverage and quality, commit the tests with a descriptive message
3. Use format: `[test] Add tests for issue #X - [brief description]`
</commit_tests>

### Step 5: Implementation (TDD Phase 2)
<implementation>
1. Now write code that makes the tests pass
2. **Do not modify the tests** - they define the contract
3. Implement the minimum functionality needed to pass each test
4. Run tests frequently and iterate on the implementation
5. **Keep going until all tests pass** - this may take multiple iterations
6. Focus on making tests pass first, optimize later if needed
</implementation>

### Step 6: Verification & Validation
<verification>
1. Ensure all tests pass consistently
2. Run any existing test suites to verify no regressions
3. **Use independent verification**: Create a subagent to review the implementation and ensure it's not overfitting to the tests
4. Check that the solution actually addresses the original issue requirements
5. Test edge cases manually if needed
</verification>

### Step 7: Final Commit & Cleanup
<final_commit>
1. When satisfied with the implementation, commit the code changes
2. Use format: `[feat] Implement solution for issue #X - [brief description]`
3. Ensure the solution is complete and ready for review
4. Run any required linting or formatting tools
</final_commit>

## Important Notes

- **Do not jump ahead** - follow the TDD workflow strictly
- **Tests define the contract** - don't modify them during implementation
- **Iterate until success** - expect multiple rounds of code → test → adjust
- **Use subagents for verification** to catch overfitting or missed requirements
- **Focus on the issue requirements** - don't add unnecessary features

## Success Criteria

✅ Issue requirements fully understood  
✅ Comprehensive tests written and initially failing  
✅ Tests committed before implementation  
✅ Implementation makes all tests pass  
✅ No regressions in existing functionality  
✅ Independent verification confirms solution quality  
✅ Final implementation committed  

Begin with Step 1 and work through each phase methodically.