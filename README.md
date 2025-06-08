# Claude Code Prompt/Command Library

A collection of reusable Claude Code commands for the Comfy-Org team to streamline development workflows.

> **💡 Looking for more commands?** Check out [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code) - a community collection of general-purpose Claude Code commands!

## Quick Start

Commands are stored in `.claude/commands/` and can be invoked using `/project:command-name` or `/user:command-name`.

## Command Categories

### Meta Commands

#### create-command
[AGENT-create-command.md](.claude/commands/agents/AGENT-create-command.md)

Command to create a command. Put the task description as the argument and a command file will be created with an optimal prompt to accomplish the task.

**Usage**
```
/user:AGENT-create-command "Fetch the most recent issue from ComfyUI_frontend repo and solve it using test-driven development"
```

#### improve-command
[AGENT-improve-command.md](.claude/commands/agents/AGENT-improve-command.md)

Command to improve an existing command. Put the path to the command file as the argument and the command prompt will be improved by referencing materials from claude/anthropic documentations.

**Usage**
```
/user:AGENT-improve-command "~/.claude/commands/PR-submit-local-as-new-pr.md"
```

#### playbook-to-agent-workflow
[AGENT-playbook-to-automated-agent-workflow.md](.claude/commands/agents/AGENT-playbook-to-automated-agent-workflow.md)

Take a playbook/workflow and convert to automated workflow specifically designed to be executed by an agent using local files/logs/databases + our integrations and MCP tools.

**Usage**
```
/user:AGENT-playbook-to-automated-agent-workflow "twitter-research/workflows/instagram-scheduling-playbook.md"
```

### GitHub/Git Commands

#### make-pr
[PR-submit-local-as-new-pr.md](.claude/commands/github/PR-submit-local-as-new-pr.md)

Make a PR based on local changes, whether you've committed, made a branch, etc. or not.

**Usage**
```
/user:PR-submit-local-as-new-pr
```

#### implement-review-comments
[GH-PR-implement-review-comments.md](.claude/commands/github/GH-PR-implement-review-comments.md)

Fetch the PR associated with local branch, read reviews and comments, implement the requested changes with one commit for each change.

**Usage**
```
/user:GH-PR-implement-review-comments
```

#### solve-issue-tdd
[SOLVEBUG-solve-issue-tdd.md](.claude/commands/github/SOLVEBUG-solve-issue-tdd.md)

Fetch an issue at the provided link. Solve the bug using test-driven development (write tests first, verify they fail, keep trying to fix until tests pass).

**Usage**
```
/user:SOLVEBUG-solve-issue-tdd "https://github.com/Comfy-Org/ComfyUI_frontend/issues/3996"
```

#### make-issue-or-feature-request
[GH-create-github-issue.md](.claude/commands/github/GH-create-github-issue.md)

Create a GitHub issue or feature request. Reference the repo name at least once in the argument.

**Usage**
```
/user:GH-create-github-issue "describe issue or feature req, referencing repo name at least once"
```

#### enhance-issue-description
[GH-ISSUE-enhance-issue-description.md](.claude/commands/github/GH-ISSUE-enhance-issue-description.md)

Enhance GitHub issue descriptions with better formatting and clarity.

**Usage**
```
/user:GH-ISSUE-enhance-issue-description "https://github.com/Comfy-Org/ComfyUI_frontend/issues/123"
```

#### add-review-comments-to-pr
[GH-PR-add-review-comments-to-pr.md](.claude/commands/github/GH-PR-add-review-comments-to-pr.md)

Add review comments to a pull request.

**Usage**
```
/user:GH-PR-add-review-comments-to-pr "https://github.com/Comfy-Org/ComfyUI_frontend/pull/456"
```

#### analyze-pr-status
[GH-PR-analyze-status.md](.claude/commands/github/GH-PR-analyze-status.md)

Analyze the status of a pull request including checks, reviews, and conflicts.

**Usage**
```
/user:GH-PR-analyze-status
```

#### summarize-recent-prs
[GH-summarize-my-recent-prs.md](.claude/commands/github/GH-summarize-my-recent-prs.md)

Summarize your recent pull requests across repositories.

**Usage**
```
/user:GH-summarize-my-recent-prs
```

### Research Commands

#### study-comfy-api-architecture
[STUDY-comfy-api-architecture.md](.claude/commands/research/STUDY-comfy-api-architecture.md)

Read a pre-generated architecture overview for Comfy-Org/comfy-api in order to preload necessary context for making system design decisions.

**Usage**
```
/user:STUDY-comfy-api-architecture
```

#### study-current-repo
[STUDY-current-repo.md](.claude/commands/research/STUDY-current-repo.md)

Study and analyze the current repository structure and architecture.

**Usage**
```
/user:STUDY-current-repo
```

### Analysis Commands

#### analyze-repo-for-claude
[ANALYZE-repo-for-claude.md](.claude/commands/analysis/ANALYZE-repo-for-claude.md)

Analyze a repository to provide Claude with necessary context and understanding.

**Usage**
```
/user:ANALYZE-repo-for-claude
```

### Notion Commands

#### audit-task-view
[NOTION-TASKS-audit-task-view.md](.claude/commands/notion/NOTION-TASKS-audit-task-view.md)

Audit and update team task views in Notion.

**Usage**
```
/user:NOTION-TASKS-audit-task-view
```

#### convert-to-bounty-task
[NOTION-convert-to-bounty-task.md](.claude/commands/notion/NOTION-convert-to-bounty-task.md)

Convert Notion tasks to bounty format for external contributors.

**Usage**
```
/user:NOTION-convert-to-bounty-task "https://notion.so/task-url"
```

### Team Commands

#### team-standup-analysis
[TEAM-team-standup-analysis.md](.claude/commands/team/TEAM-team-standup-analysis.md)

Analyze team standup notes and provide insights.

**Usage**
```
/user:TEAM-team-standup-analysis
```

## Installation

1. Clone this repository
2. Commands are automatically available in your Claude Code session when working in this project
3. To make commands globally available, copy desired command files to `~/.claude/commands/`

## Creating New Commands

Use the `/user:AGENT-create-command` command to generate new commands based on your requirements.

## Resources

- [Claude Documentation - Prompt Library](https://docs.anthropic.com/en/resources/prompt-library/library)
- [Claude Code Tutorials](https://docs.anthropic.com/en/docs/claude-code/tutorials)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

## Development

### Validation
Command validation runs automatically via GitHub Actions when:
- Pushing changes to command files
- Creating pull requests with command changes
- Manually triggering the workflow

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new commands.

## Tips

- Commands can include the `$ARGUMENTS` placeholder to accept parameters
- Use descriptive filenames with prefixes (e.g., `GH-`, `NOTION-`, `AGENT-`) for better organization
- Test commands thoroughly before sharing with the team