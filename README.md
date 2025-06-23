# Claude Code Prompt/Command Library

A collection of reusable Claude Code commands for the Comfy-Org team to streamline development workflows.

> **💡 Looking for more commands?** Check out [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code) - a community collection of general-purpose Claude Code commands!

## Quick Start

Commands are stored in `.claude/commands/` and can be invoked using `/project:command-name` or `/user:command-name`.

## Commands

### Meta Commands

- [`/user:AGENT-create-command`](.claude/commands/agents/AGENT-create-command.md) - Create a command by providing a task description and automatically generate an optimal prompt file
- [`/user:AGENT-improve-command`](.claude/commands/agents/AGENT-improve-command.md) - Improve an existing command by referencing Claude/Anthropic documentation materials
- [`/user:AGENT-playbook-to-automated-agent-workflow`](.claude/commands/agents/AGENT-playbook-to-automated-agent-workflow.md) - Convert playbooks/workflows to automated agent workflows using local files and MCP tools

### GitHub/Git Commands

- [`/user:PR-submit-local-as-new-pr`](.claude/commands/github/PR-submit-local-as-new-pr.md) - Make a PR based on local changes, whether you've committed, made a branch, etc. or not
- [`/user:GH-PR-implement-review-comments`](.claude/commands/github/GH-PR-implement-review-comments.md) - Fetch the PR associated with local branch, read reviews and comments, implement the requested changes with one commit for each change
- [`/user:SOLVEBUG-solve-issue-tdd`](.claude/commands/github/SOLVEBUG-solve-issue-tdd.md) - Fetch an issue at the provided link. Solve the bug using test-driven development (write tests first, verify they fail, keep trying to fix until tests pass)
- [`/user:GH-create-github-issue`](.claude/commands/github/GH-create-github-issue.md) - Create a GitHub issue or feature request. Reference the repo name at least once in the argument
- [`/user:GH-ISSUE-enhance-issue-description`](.claude/commands/github/GH-ISSUE-enhance-issue-description.md) - Enhance GitHub issue descriptions with better formatting and clarity
- [`/user:GH-PR-add-review-comments-to-pr`](.claude/commands/github/GH-PR-add-review-comments-to-pr.md) - Add review comments to a pull request
- [`/user:GH-PR-summarize-my-open-prs`](.claude/commands/github/GH-PR-summarize-my-open-prs.md) - Summarize the status of all open pull requests for the current user
- [`/user:GH-summarize-my-recent-prs`](.claude/commands/github/GH-summarize-my-recent-prs.md) - Summarize your recent pull requests across repositories
- [`/user:GH-daily-report`](.claude/commands/github/GH-daily-report.md) - Create a daily summary of GitHub issues and PRs for comfy-org repos
- [`/user:GH-rebase-onto`](.claude/commands/github/GH-rebase-onto.md) - Rebase the current branch onto the target branch, handling conflicts safely human-in-the-loop style

### Research Commands

- [`/user:STUDY-comfy-api-architecture`](.claude/commands/research/STUDY-comfy-api-architecture.md) - Load pre-generated architecture overview for Comfy-Org/comfy-api
- [`/user:STUDY-comfyui-custom-nodes-ecosystem`](.claude/commands/research/STUDY-comfyui-custom-nodes-ecosystem.md) - Analyze ComfyUI custom nodes ecosystem patterns and trends using comprehensive dataset
- [`/user:STUDY-current-repo`](.claude/commands/research/STUDY-current-repo.md) - Study and analyze current repository structure and architecture

### Analysis Commands

- [`/user:ANALYZE-repo-for-claude`](.claude/commands/analysis/ANALYZE-repo-for-claude.md) - Analyze repository to provide Claude with necessary context and understanding

### Notion Commands

- [`/user:NOTION-TASKS-audit-task-view`](.claude/commands/notion/NOTION-TASKS-audit-task-view.md) - Audit and update team task views in Notion
- [`/user:NOTION-convert-to-bounty-task`](.claude/commands/notion/NOTION-convert-to-bounty-task.md) - Convert Notion tasks to bounty format for external contributors

### Team Commands

- [`/user:TEAM-team-standup-analysis`](.claude/commands/team/TEAM-team-standup-analysis.md) - Analyze team standup notes and provide insights

### ComfyUI Frontend Commands

- [`/user:frontend/FE-generate-primevue-reference`](.claude/commands/frontend/FE-generate-primevue-reference.md) - Generate a list of all available PrimeVue components and their properties, for help with building frontend UIs

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

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new commands.

### Tips

- Commands can include the `$ARGUMENTS` placeholder to accept parameters
- Use descriptive filenames with prefixes (e.g., `GH-`, `NOTION-`, `AGENT-`) for better organization
- Test commands thoroughly before sharing with the team
