# Development Standards

## Overview

Development standards for the Comfy Claude Prompt Library ensure consistency, quality, and maintainability across all commands. These standards are enforced through automated validation and peer review.

## Command Structure Standards

### Required Elements

#### H1 Title (Line 1)
```markdown
# Descriptive Command Name
```
- **MUST** be first line of file
- Use title case with clear, specific purpose
- Avoid generic terms like "Helper" or "Utility"
- Match filename without extension and prefixes

#### Context Section
```markdown
Brief explanation of when and why to use this command.
Includes scope, prerequisites, and expected outcomes.
```
- 1-3 sentences maximum
- Answer: "When would I use this?"
- Set clear expectations

#### Workflow Instructions
```markdown
## Instructions

<workflow>
Structured step-by-step process using workflow tags
</workflow>
```
- **MUST** use `<workflow>` tags for structured processes
- Number complex steps for clarity
- Include decision points and conditionals
- Reference specific files, commands, and tools

#### Parameter Handling
```markdown
Use $ARGUMENTS for user input: $ARGUMENTS
```
- Use `$ARGUMENTS` placeholder for user input
- Document expected parameter format
- Validate parameters when possible
- Provide usage examples

## Naming Conventions

### File Naming
- **Format**: `PREFIX-descriptive-name.md`
- **Case**: kebab-case for multi-word names
- **Specificity**: Be specific about command purpose
- **Length**: Keep reasonable (under 50 characters)

### Prefix System
| Prefix | Category | Examples |
|--------|----------|----------|
| `AGENT-` | Meta-commands | `AGENT-create-command` |
| `GH-` | GitHub operations | `GH-create-issue` |
| `PR-` | Pull request workflows | `PR-submit-local-as-new-pr` |
| `STUDY-` | Learning/analysis | `STUDY-current-repo` |
| `SCAN-` | Validation/scanning | `SCAN-performance` |
| `NOTION-` | Notion integration | `NOTION-convert-to-bounty-task` |
| `TEAM-` | Collaboration | `TEAM-standup-analysis` |
| `ANALYZE-` | Deep analysis | `ANALYZE-repo-for-claude` |

### Directory Organization
```
.claude/commands/
├── agents/          # AGENT-* commands
├── github/          # GH-*, PR-* commands  
├── analysis/        # ANALYZE-* commands
├── validation/      # SCAN-*, validate-* commands
├── research/        # STUDY-* commands
├── team/           # TEAM-* commands
├── notion/         # NOTION-* commands
└── [category]/     # Other logical groupings
```

## Code Quality Standards

### Complexity Limits
- **Cyclomatic complexity**: < 10 per workflow section
- **Nesting depth**: < 4 levels in conditional logic
- **Step count**: < 20 steps per workflow
- **File length**: < 500 lines per command

### Performance Standards
- **Context estimation**: Required for large operations
- **Token efficiency**: Minimize redundant tool calls
- **Caching**: Reuse expensive computations
- **Batch operations**: Group similar tasks

### Security Requirements
- **No secrets**: Never hardcode credentials or API keys
- **Path validation**: Validate all file paths and inputs
- **Permission checks**: Verify required access before operations
- **Audit trails**: Log important operations and decisions

## Content Standards

### Language Requirements
- **Clarity**: Use clear, actionable language
- **Precision**: Avoid vague terms without evidence
- **Consistency**: Use consistent terminology across commands
- **Accessibility**: Write for various skill levels

### Forbidden Patterns
```markdown
# FORBIDDEN - Meta-commentary comments
# This replaces the old implementation
# Fixed the bug mentioned above
# Updated to use new API

# ACCEPTABLE - Functional comments  
# Validates user permissions before access
# Workaround for Safari bug #12345
# Performance optimization: cache results for 5 minutes
```

### Evidence-Based Implementation
- **Source Documentation**: Always cite official documentation
- **Confidence Levels**: Include confidence ratings (0-100%)
- **Alternative Approaches**: Explain why chosen approach is preferred
- **Verification Steps**: Include ways to verify solutions work

## Git and PR Standards

### Commit Message Format
```bash
# CORRECT
[feat] add performance scanning command
[docs] update command architecture documentation  
[fix] resolve parameter validation in GH commands

# INCORRECT  
feat: add performance scanning command
docs: update command architecture documentation
fix: resolve parameter validation in GH commands
```

### Branch Naming
```bash
# Feature branches
feat/add-validation-commands
feat/improve-meta-command-system

# Bug fixes  
fix/parameter-validation-issue
fix/workflow-tag-parsing

# Documentation
docs/update-architecture-guide
docs/add-development-standards
```

### PR Requirements
- **Documentation**: Update README.md for new commands
- **Validation**: All commands must pass CI validation
- **Review**: Require team review before merging
- **Testing**: Verify commands work with intended parameters

## Validation and CI Standards

### Automated Checks
```yaml
# Command validation pipeline
1. Structure validation (H1 title, workflow tags)
2. Naming convention compliance  
3. Parameter usage validation
4. Markdown syntax verification
5. Documentation sync check
```

### Quality Gates
- **No empty files**: Commands must have meaningful content
- **Proper structure**: Required sections must be present
- **Documentation sync**: New commands must be in README.md
- **No broken references**: All internal links must be valid

### Manual Review Checklist
- [ ] Command serves clear, specific purpose
- [ ] Workflow is logical and complete
- [ ] Parameters are properly documented
- [ ] Error handling is included
- [ ] Integration with existing patterns
- [ ] Security considerations addressed

## Integration Standards

### Tool Dependencies
- **GitHub CLI**: Use `gh` for all GitHub operations
- **Git**: Standard git commands for repository operations
- **External tools**: Document all external dependencies
- **Version requirements**: Specify minimum versions when relevant

### Memory Integration (MANDATORY)
```markdown
# Required pattern for all commands
1. Extract key terms from user request
2. Run semantic search: `~/claude-code-vector-memory/search.sh "terms"`  
3. Present memory recap to user
4. Ask user preference for building on previous work
```

### Context Window Management
```markdown
# Required for large operations
1. Estimate token usage before starting
2. If >200k tokens: Offer Gemini CLI alternative
3. Use efficient file counting commands
4. Implement chunked processing when needed
```

## Documentation Standards

### README Integration
New commands require README.md updates:
```markdown
- [`/user:command-name`](.claude/commands/category/command-name.md) - Brief description
```

### Internal Documentation
- **Purpose**: Why does this command exist?
- **Usage**: When and how to use it?
- **Examples**: Concrete usage scenarios  
- **Integration**: How does it connect to other commands?

### Knowledge Base Updates
- Update relevant knowledge files when patterns change
- Maintain consistency across documentation
- Include command in appropriate workflow patterns
- Update configuration files when needed

## Error Handling Standards

### Validation Patterns
```markdown
<workflow>
1. Check prerequisites (dependencies, permissions, state)
2. Validate inputs and paths (no ../, absolute paths)
3. Assess risk level (data loss, scope, reversibility)  
4. Create checkpoint if HIGH risk
5. Provide clear rollback instructions
</workflow>
```

### Error Classification
- **HIGH**: Blocks work or causes failures → Stop and fix immediately
- **MEDIUM**: Impacts quality or performance → Address during refactoring
- **LOW**: Minor improvements → Track for future cleanup

### Recovery Procedures
- Clear error messages with specific remediation steps
- Rollback instructions for destructive operations
- Links to troubleshooting documentation
- Escalation paths for complex issues

These development standards ensure the command library maintains high quality, consistency, and reliability while enabling sophisticated automation of development workflows.