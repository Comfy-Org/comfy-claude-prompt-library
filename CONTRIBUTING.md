# Contributing to Claude Code Prompt Library

## Guidelines for Adding New Commands

### Command Naming Convention
- Use descriptive prefixes: `GH-`, `NOTION-`, `AGENT-`, `STUDY-`, `TEAM-`
- Use kebab-case for multi-word commands
- Be specific about the command's purpose

### Command Structure
1. **Title**: Clear H1 heading describing the command
2. **Context**: Brief explanation of when to use this command
3. **Instructions**: Step-by-step workflow using `<workflow>` or similar tags
4. **Parameters**: Use `$ARGUMENTS` for user input
5. **Examples**: Include usage examples when helpful

### File Organization
Commands should be placed in appropriate subdirectories:
- `github/` - Git and GitHub-related commands
- `notion/` - Notion workspace commands  
- `agents/` - Meta commands for creating/improving commands
- `analysis/` - Repository and code analysis commands
- `research/` - Study and learning commands
- `team/` - Team collaboration and standup commands

### Testing New Commands
Before submitting a new command:
1. Test the command in your local environment
2. Verify the `$ARGUMENTS` placeholder works correctly
3. Ensure the command follows existing patterns
4. Check that instructions are clear and actionable

### Code Review Process
1. Create a new branch for your command
2. Add the command file(s) 
3. Update the README.md if adding a new category
4. Submit a pull request with a clear description
5. Wait for team review before merging

### Best Practices
- Keep commands focused on a single responsibility
- Use clear, actionable language
- Include error handling guidance where appropriate
- Reference the [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### Command Dependencies
If your command relies on other commands or tools:
- Document dependencies clearly
- Test that required tools are available
- Provide fallback instructions when possible