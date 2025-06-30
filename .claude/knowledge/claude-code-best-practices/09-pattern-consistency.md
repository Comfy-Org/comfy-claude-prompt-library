# Pattern Consistency Enforcement

Before creating any new command, ensure it maintains consistency with existing patterns:

## 1. Search for Similar Commands First
- Look for existing commands that solve similar problems
- Check both project-specific and global command directories
- Analyze their structure, naming conventions, and approach

## 2. Match Existing Patterns
- Follow the same formatting style as other commands
- Use consistent variable naming (e.g., always use `$ARGUMENTS` for parameters)
- Maintain similar section headers and organization

## 3. Align with Project Conventions
- Check for any README files in the commands directories
- Look for established patterns in command naming (kebab-case, prefixes, etc.)
- Ensure your command fits logically within the existing command hierarchy

## 4. Reuse Common Components
- If other commands use specific tools or workflows, adopt the same approach
- Don't reinvent patterns that already exist in the command library
- Reference and build upon existing command structures when appropriate

## Command Naming Conventions

Follow these patterns for consistency:

### Project Commands
- Use descriptive kebab-case names: `fix-github-issue`, `run-test-suite`
- Group related commands with prefixes: `db-migrate`, `db-backup`, `db-restore`
- Keep names concise but clear about the command's purpose

### Global Commands
- Prefix with domain if applicable: `aws-deploy`, `docker-build`
- Use verbs that clearly indicate action: `generate-`, `analyze-`, `create-`
- Avoid overly generic names that could conflict

## Structure Patterns

### Standard Command Template
```md
# [Command Title]

[Brief description of what the command does]

<task>
[Task description with $ARGUMENTS placeholder]
</task>

## Steps

1. [First step]
2. [Second step]
3. [Continue numbered steps...]

## Important Notes

- [Any warnings or important considerations]
- [Dependencies or prerequisites]

## Expected Output

[Description of what the command will produce]
```

### Complex Command Template
```md
# [Command Title]

<role>
You are [specific role/expertise].
</role>

<context>
[Any necessary background or context]
</context>

<task>
[Detailed task description with $ARGUMENTS]
</task>

<instructions>
1. [Detailed step]
2. [Another step]
   - [Sub-step if needed]
   - [Another sub-step]
</instructions>

<constraints>
- [Limitation or requirement]
- [Another constraint]
</constraints>

<examples>
<example>
Input: [Example input]
Output: [Expected output]
</example>
</examples>

<output_format>
[Specific formatting requirements]
</output_format>
```

## Integration Patterns

### Tool Usage
- If commands in the directory use `gh` for GitHub operations, your command should too
- Match the error handling approaches used in similar commands
- Follow established patterns for file operations, API calls, etc.

### Documentation References
- Link to the same documentation sources used by related commands
- Maintain consistent citation and reference styles
- Use the same format for external links and resources

## Quality Checklist

Before finalizing a new command:

- [ ] Checked for similar existing commands
- [ ] Followed naming conventions from the command directory
- [ ] Used consistent structure and formatting
- [ ] Adopted established tool usage patterns
- [ ] Aligned with project-specific conventions in CLAUDE.md
- [ ] Tested the command with various inputs
- [ ] Documented any new patterns introduced
- [ ] Ensured backward compatibility with related commands