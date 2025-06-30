# Claude Code Command Creation Overview

## Purpose

This guide helps you create effective Claude Code commands - stored prompt templates in Markdown files within the `.claude/commands` folder. Custom slash commands can include the special keyword `$ARGUMENTS` to pass parameters from command invocation.

## Basic Example

**Example:** Putting content into `.claude/commands/fix-github-issue.md` makes it available as the `/project:fix-github-issue` command. You could then use `/project:fix-github-issue 1234` to have Claude fix issue #1234.

### Basic Command Structure

```md
Please analyze and fix the GitHub issue: $ARGUMENTS.

Follow these steps:

1. Use `gh issue view` to get the issue details
2. Understand the problem described in the issue
3. Search the codebase for relevant files
4. Implement the necessary changes to fix the issue
5. Write and run tests to verify the fix
6. Ensure code passes linting and type checking
7. Create a descriptive commit message
8. Push and create a PR

Remember to use the GitHub CLI (`gh`) for all GitHub-related tasks.
```

## Command Locations

You can add commands to:
- `.claude/commands/` folder for project-specific commands
- `~/.claude/commands` folder for personal commands available in all sessions

## Task Structure

When given a task to create a new Claude Code command, follow this process:

```xml
<task>
I want to create a new Claude Code command for the following task: $ARGUMENTS.
</task>
```

## Key Principles

1. **Be Direct** - Think of Claude as a brilliant but very new employee who needs explicit instructions
2. **Use Examples** - Provide 3-5 diverse, relevant examples to show Claude exactly what you want
3. **Structure with XML** - Use tags like `<instructions>`, `<example>`, and `<formatting>` to organize prompts
4. **Enable Thinking** - Allow Claude to work through complex problems step by step
5. **Give Claude a Role** - Use system prompts to set context and expertise level
6. **Chain for Complexity** - Break complex tasks into smaller, manageable subtasks
7. **Evaluate and Iterate** - Build test suites to measure and improve prompt performance