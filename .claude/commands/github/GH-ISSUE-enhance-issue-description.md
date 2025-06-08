# Enhance GitHub Issue Documentation

Your task is to research and analyze GitHub issue $ARGUMENTS, then suggest comprehensive improvements to make it more verbose, helpful, and well-documented according to best practices.

## Research Phase

First, thoroughly research the issue using ALL of the following methods:

### 1. Read the Issue and Comments
Use `gh issue view $ARGUMENTS --comments` to get the full issue details and all comments. Pay attention to:
- The original problem description
- Any clarifications in comments
- Attempted solutions or workarounds mentioned
- Related issues or PRs referenced

### 2. Search Local Repositories
Check these local Comfy-Org repositories if the issue is related to Comfy:
- ~/projects/comfy-testing-environment/
- ~/projects/comfyui-frontend-testing/

Look for:
- Related code that might be affected
- Existing patterns or implementations
- README files in relevant directories
- Test files that might provide context

### 3. Review Documentation
- For Comfy-related issues, thoroughly review the docs at ~/projects/comfyui-frontend-testing/docs
- Pay special attention to:
  - Overview and architecture documentation
  - API references
  - Extension/mod development guides
  - Any existing documentation about the feature/area in question

### 4. Analyze Git History
Research the commit history for relevant files:
- Use `git log --grep` to find commits mentioning related keywords
- Look at `git blame` for files mentioned in the issue
- Check `git log --follow` for file history if files were renamed
- Search for commits by the issue reporter to understand their context

### 5. Find Related Issues and PRs
- Use `gh issue list` and `gh pr list` with relevant search terms
- Look for:
  - Similar issues (open and closed)
  - PRs that might have introduced the issue
  - PRs attempting to fix similar problems
  - Linked issues in the issue body or comments

### 6. Web Research
If needed, search for:
- External documentation (PrimeVue, Electron, Vitest, Playwright, etc.)
- Stack Overflow discussions about similar problems
- Blog posts or tutorials covering the topic
- Best practices for the specific technology/pattern

### 7. Code Analysis
- Search the codebase for usage patterns
- Identify all files that might be affected
- Look for existing tests that cover this area
- Check for similar implementations elsewhere in the codebase

## Enhancement Suggestions

After completing your research, provide a comprehensive enhancement suggestion that includes:

### 1. Enhanced Issue Title
Suggest a more descriptive title that clearly indicates:
- The component/area affected
- The specific problem
- The impact (if applicable)

### 2. Structured Issue Description
Create a well-organized issue description with these sections:

#### Background/Context
- Explain the broader context
- Why this issue matters
- How it fits into the overall system

#### Problem Statement
- Clear, detailed description of the issue
- Current behavior vs expected behavior
- Impact on users/developers

#### Steps to Reproduce
- Detailed, numbered steps
- Include code snippets where relevant
- Specify environment details

#### Root Cause Analysis (if discovered)
- Technical explanation of why this happens
- Reference specific code locations
- Link to relevant commits if applicable

#### Proposed Solution(s)
- Multiple approaches if applicable
- Pros and cons of each approach
- Recommended approach with justification

#### Testing Considerations
- How to verify the fix
- What tests should be added
- Edge cases to consider

### 3. Supporting Materials
Suggest adding:

#### Code Examples
- Before/after code snippets
- Example implementations
- Common patterns that could be followed

#### Visual Aids
- Diagrams explaining the architecture
- Screenshots showing the issue
- Flowcharts for complex processes

#### References and Links
- Links to related issues/PRs
- Documentation references
- External resources
- Specific file paths and line numbers

#### Implementation Checklist
- Break down the fix into subtasks
- Include both code changes and documentation updates
- Testing requirements
- Review considerations

## Example Format

Present your enhancement suggestion in a clear format that the user can easily copy and use to update the GitHub issue. Use markdown formatting and make it ready to paste.

Remember: The goal is to transform a potentially vague or incomplete issue into a comprehensive, actionable document that serves as a complete reference for anyone working on the problem. Include all context discovered during research, making the issue self-contained and educational.