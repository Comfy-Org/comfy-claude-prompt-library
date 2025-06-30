# Claude Code Fundamentals

## Overview

Claude Code is an agentic coding assistant that automatically pulls context into prompts. This context gathering consumes time and tokens, but you can optimize it through environment tuning.

## CLAUDE.md Files

CLAUDE.md is a special file that Claude automatically pulls into context when starting a conversation. This makes it an ideal place for documenting:

- Common bash commands
- Core files and utility functions
- Code style guidelines
- Testing instructions
- Repository etiquette (e.g., branch naming, merge vs. rebase, etc.)
- Developer environment setup (e.g., pyenv use, which compilers work)
- Any unexpected behaviors or warnings particular to the project
- Other information you want Claude to remember

### File Format

There's no required format for CLAUDE.md files. We recommend keeping them concise and human-readable. For example:

```
# Bash commands
- npm run build: Build the project
- npm run typecheck: Run the typechecker

# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow
- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
```

### File Locations

You can place CLAUDE.md files in several locations:

- The root of your repo, or wherever you run claude from (the most common usage). Name it CLAUDE.md and check it into git so that you can share it across sessions and with your team (recommended), or name it CLAUDE.local.md and .gitignore it
- Any parent of the directory where you run claude. This is most useful for monorepos, where you might run claude from root/foo, and have CLAUDE.md files in both root/CLAUDE.md and root/foo/CLAUDE.md. Both of these will be pulled into context automatically
- Any child of the directory where you run claude. This is the inverse of the above, and in this case, Claude will pull in CLAUDE.md files on demand when you work with files in child directories
- Your home folder (~/.claude/CLAUDE.md), which applies it to all your claude sessions

When you run the /init command, Claude will automatically generate a CLAUDE.md for you.

## Tuning Your CLAUDE.md Files

Your CLAUDE.md files become part of Claude's prompts, so they should be refined like any frequently used prompt. A common mistake is adding extensive content without iterating on its effectiveness. Take time to experiment and determine what produces the best instruction following from the model.

You can add content to your CLAUDE.md manually or press the # key to give Claude an instruction that it will automatically incorporate into the relevant CLAUDE.md. Many engineers use # frequently to document commands, files, and style guidelines while coding, then include CLAUDE.md changes in commits so team members benefit as well.

At Anthropic, we occasionally run CLAUDE.md files through the prompt improver and often tune instructions (e.g. adding emphasis with "IMPORTANT" or "YOU MUST") to improve adherence.