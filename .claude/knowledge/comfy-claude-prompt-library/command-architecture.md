# Command Architecture

## Overview

Claude Code commands in this repository are Markdown-based prompt templates that automate complex development workflows through standardized structures and patterns.

## Core Command Structure

### Basic Template
```markdown
# Command Title

Brief context explaining when to use this command.

## Instructions

<workflow>
Step-by-step instructions using workflow tags for structured execution
</workflow>

Use $ARGUMENTS for user input parameters.

## Examples
Provide usage examples when helpful.
```

### Required Elements

#### 1. H1 Title
- Must be the first line
- Clear, descriptive name of the command's purpose
- Example: `# Submit Local Changes as New PR`

#### 2. Context Section
- Brief explanation of when to use the command
- Sets expectations for the command's scope and purpose
- Should answer: "Why would I use this command?"

#### 3. Instructions with Workflow Tags
- Use `<workflow>` tags for structured step-by-step processes
- Break complex tasks into numbered steps
- Include decision points and conditional logic
- Reference specific files, commands, and tools

#### 4. Parameter System
- Use `$ARGUMENTS` placeholder for user input
- Document expected parameter format in context
- Examples: URLs, file paths, issue numbers, descriptions

### Advanced Patterns

#### Conditional Workflows
```markdown
<workflow>
### 1. State Assessment
Check current git state and determine next steps:
- If on main/master branch → create new feature branch
- If on feature branch → verify branch name is descriptive
- If uncommitted changes → handle stashing/committing

### 2. Branch Management
**If creating new branch:**
- Checkout main/master and update
- Create descriptive feature branch
- Apply changes

**If on existing branch:**
- Verify branch is appropriate
- Check for conflicts with main
</workflow>
```

#### Error Handling
```markdown
### Error Recovery
If command fails:
1. Check prerequisites (dependencies, permissions)
2. Validate inputs and paths  
3. Provide clear rollback instructions
4. Reference troubleshooting documentation
```

## Command Categories and Prefixes

### Meta Commands (`AGENT-`)
- Self-improving commands that create/enhance other commands
- Examples: `AGENT-create-command`, `AGENT-improve-command`
- Special capability: Can modify the command library itself

### GitHub Operations (`GH-`, `PR-`)
- GitHub CLI integration for PR and issue management
- Examples: `PR-submit-local-as-new-pr`, `GH-create-github-issue`
- Heavy use of `gh` command-line tool

### Analysis Commands (`ANALYZE-`, `STUDY-`)
- Repository analysis and knowledge absorption
- Examples: `ANALYZE-repo-for-claude`, `STUDY-current-repo`
- Generate structured documentation and context

### Validation Commands (`scan-`, `validate-`)
- Code quality, security, and performance analysis
- Examples: `scan-performance`, `validate-dependencies`
- Systematic checks with severity classification

### Team Operations (`TEAM-`, `NOTION-`)
- Collaboration tools and workspace management
- Examples: `TEAM-team-standup-analysis`, `NOTION-convert-to-bounty-task`
- Integration with external team tools

## Parameter Handling

### $ARGUMENTS Usage
```markdown
# Example Command with Parameters
Analyze the GitHub issue: $ARGUMENTS

## Instructions
1. Use `gh issue view $ARGUMENTS` to fetch issue details
2. Parse issue description and requirements
3. Search codebase for relevant files
```

### Parameter Validation
Commands should validate parameters:
- Check for required arguments
- Validate format (URLs, numbers, paths)
- Provide helpful error messages
- Suggest correct usage patterns

## Integration Patterns

### Tool Integration
- **GitHub CLI**: Use `gh` for all GitHub operations
- **Git**: Standard git commands for repository management  
- **External Tools**: Gemini CLI for large context tasks
- **System Tools**: Shell commands for file operations

### Context Passing
Commands can share context through:
- File outputs (temporary or permanent)
- Environment variables
- Structured data formats (JSON, YAML)
- Chain execution patterns

### Memory Integration
All commands must integrate with semantic memory:
- Search previous conversations before starting
- Present relevant past work to user
- Ask user preference for building on previous approaches
- Store important findings for future reference

## Quality Standards

### Command Validation
- H1 title required on first line
- Proper markdown structure
- No meta-commentary comments
- Evidence-based implementation approaches
- Clear, actionable instructions

### Performance Considerations
- Estimate context window usage
- Use efficient search patterns
- Cache expensive operations
- Minimize redundant tool calls

### Error Resistance
- Validate prerequisites before execution
- Handle common failure modes
- Provide recovery instructions
- Test with various input scenarios

## File Organization

### Directory Structure
```
.claude/commands/
├── agents/          # Meta-commands and self-improvement
├── github/          # Git and GitHub operations
├── analysis/        # Repository and code analysis  
├── validation/      # Quality and security scanning
├── research/        # Knowledge absorption
├── team/            # Collaboration tools
├── development/     # Feature creation templates
├── testing/         # Test planning and review
├── utilities/       # Context management, external tools
└── [category]/      # Logical groupings
```

### Naming Conventions
- Use kebab-case for multi-word commands
- Include descriptive prefixes for categorization
- Be specific about command purpose
- Avoid generic names like "helper" or "util"

This architecture enables sophisticated automation while maintaining clarity, reliability, and extensibility across the entire command library.