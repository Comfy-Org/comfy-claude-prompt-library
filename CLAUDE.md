## MANDATORY Pre-Task Checklist

CRITICAL: At the START of any new task (not during execution), you MUST go through this checklist:
- [ ] Does this task involve reading/analyzing more than 10 files/webpages? → Follow the process in `~/.claude/commands/utilities/estimate-context-window.md`
- [ ] Does the request mention "all", "every", "entire codebase", or "whole project"? → Follow the process in `~/.claude/commands/utilities/estimate-context-window.md`
- [ ] Could this task potentially read more than 250k tokens? → Follow the process in `~/.claude/commands/utilities/estimate-context-window.md`
- [ ] Will you need to use Agent tool more than 25 times? → Follow the process in `~/.claude/commands/utilities/estimate-context-window.md`

When estimating context, be EFFICIENT:
- Use ONE command to get file count: `find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.vue" -o -name "*.py" \) | wc -l`
- Use ONE command to get total lines: `find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.vue" -o -name "*.py" \) -exec wc -l {} + | tail -n1`
- Don't run multiple find commands for the same data

If context estimation shows >200k tokens:
- ASK THE USER: "This task appears to require analyzing [X] files/webpages and will use approximately [Y] tokens, which may exceed my context window. Would you like me to use gemini instead for this task? It has a much larger context window and can handle this more effectively."
- If user says YES → Execute using the `gemini` command following patterns in `~/.claude/commands/utilities/run-gemini-headless.md`
  - CRITICAL: Use EXACT command format from the utility file: `nohup gemini -p "prompt" -y > log 2>&1 &`
  - For codebase analysis: Start with `-a` flag PLUS `-p` and `-y`: `nohup gemini -a -p "prompt" -y > log 2>&1 &`
  - If token limit exceeded: Retry without `-a` flag but KEEP `-p` and `-y`
  - DO NOT use stdin redirection (< file.txt) - always use -p flag for the prompt
  - Always use nohup and background execution to avoid timeouts
  - This is FIRE-AND-FORGET: Start gemini and do not monitor or check on it
  - If gemini fails with API/auth errors: Fall back to focused manual analysis of key directories
- If user says NO → Warn them about potential issues and proceed carefully

This is a ONE-TIME check when you first understand the task scope. Don't repeat during task execution.

## Memory Integration (MANDATORY)

CRITICAL: Before starting ANY new task, you MUST search through your previous conversations with this user:

1. **Extract key terms** from the user's request (technologies, components, concepts)
2. **Run semantic search**: `~/$USER/agents/semantic-memory-system/search.sh "extracted key terms"`
3. **Review results** and identify relevant past work
4. **Present memory recap** to user showing what related work you've done before
5. **Ask user** if they want to build on previous approaches or start fresh

This is MANDATORY for all tasks, not optional. Users rely on this continuity.

When presenting found memories:
- Show a brief "memory recap" before beginning work:
  ```
  📚 I found relevant past work:
  1. [Title] - [Date]: We worked on [brief description]
     - Relevant because: [specific connection to current task]
  2. [Title] - [Date]: We implemented [solution]
     - Could apply here for: [specific aspect]
  ```
- Ask: "Would you like me to build on any of these previous approaches, or should we start fresh?"

## Memory Validation

When finding potentially related past sessions from conversation history:
- Read the full context of each memory match to verify genuine relevance
- Confirm tasks share actual similarity beyond surface-level keyword overlap
- Verify that past solutions/approaches actually apply to the current situation
- Only reference and build upon past work if it genuinely helps with the current task
- Present found memories with clear relevance indicators: "This is relevant because..."
- If uncertain about relevance, ask user: "I found this past work on [topic] - would it be helpful here?"

---

- When referencing PrimeVue, you can get all the docs here without asking for permission: https://primevue.org/autocomplete/
- When making sweeping changes like using search and replace, make sure to make a backup file first. you can name the backup the same filename and path and simply add .bak to the end. Then when it's time to push or finalize the changes, remind to delete the backup.
- When writing PR descriptions, be AS CONCISE AS POSSIBLE -- try your absolute hardest to explain everything in 1-3 sentences, unless you absolutely must describe a complex or multi-step systematic change or addition (and in those cases, use bullet points, images, or links to further reading). DO NOT use titles or sections in PR descriptions unless absolutely necessary -- if they description is short and brief then no titles or formatting should be necessary.
- When making PR names and commit messages, if you are going to add a prefix like "docs:", "feat:", "bugfix:", use square brackets around the prefix term and do not use a colon (e.g., should be "[docs]" rather than "docs:").
- When operating inside a repo, check for README files at key locations in the repo detailing info about the contents of that folder. E.g., top-level key folders like tests-ui, browser_tests, composables, extensions/core, stores, services often have their own README.md files. When writing code, make sure to frequently reference these README files to understand the overall architecture and design of the project. Pay close attention to the snippets to learn particular patterns that seem to be there for a reason, as you should emulate those.
- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
- If using a lesser known or complex CLI tool, run the --help to see the documentation before deciding what to run, even if just for double-checking or verifying things.
- IMPORTANT: the most important goal when writing code is to create clean, best-practices, sustainable, and scalable public APIs and interfaces. Our app is used by thousands of users and we have thousands of mods/extensions that are constantly changing and updating; and we are also always updating. That's why it is IMPORTANT that we design systems and write code that follows practices of domain-driven design, object-oriented design, and design patterns (such that you can gaurentee stability while allowing for all components around you to change and evolve). We ABSOLUTELY prioritize clean APIs and public interfaces that clearly define and restrict how/what the mods/extensions can access.
- If any of these technologies are referenced, you can proactively read their docs at these locations: https://primevue.org/theming, https://primevue.org/forms/, https://www.electronjs.org/docs/latest/api/browser-window, https://vitest.dev/guide/browser/, https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets/, https://playwright.dev/docs/api/class-test, https://playwright.dev/docs/api/class-electron, https://www.algolia.com/doc/api-reference/rest-api/, https://pyav.org/docs/develop/cookbook/basics.html
- When solving an issue we know the link/number for, we should add "Fixes #n" (where n is the issue number) to the PR description.
- When running python, you must use `python3` to use the system installation of python. However, if you want to use packages that are unlikely to be installed on the system path or that you need specific versions for, first create a venv with python3 -m venv venv then activate it.

## Code Quality Standards

- IMPORTANT: After making code changes, run these automated quality checks:
  - Cyclomatic complexity should be < 10 per function
  - Nesting depth should be < 4 levels
  - Function length should be < 50 lines
  - Check for O(n²) algorithms and N+1 query patterns
  - Ensure no hardcoded secrets or credentials

## Evidence-Based Implementation

- Before using any external library:
  1. Check if it's already in package.json/requirements.txt
  2. Use Context7 MCP to get official documentation when available
  3. Find the recommended patterns and best practices
  4. Add source comments like: `// Source: React hooks documentation`
- Never implement based on assumptions - always verify with official sources
- Include confidence level when unsure: "Based on [source], but recommend verifying..."
- IMPORTANT: When providing solutions, always include:
  - What documentation/source supports this approach
  - Confidence level (0-100%)
  - Alternative approaches considered and why this was chosen
  - Specific evidence for any claims made

## Test-Driven Development

- When implementing new features:
  1. Write failing tests first
  2. Implement minimal code to pass tests
  3. Refactor while keeping tests green
  4. Ensure existing tests still pass
- Focus on behavior testing over implementation details
- Write tests that serve as documentation

## Git Safety Practices

- IMPORTANT: Before any commit:
  1. Run `git status` to verify intended files
  2. Run `git diff --staged` to review all changes
  3. Check for secrets/credentials in the diff
  4. Run existing test suite if available
  5. Ensure only intended files are staged

## Root Cause Analysis

- When debugging issues, use the Five Whys technique:
  1. Identify the problem symptom
  2. Ask "why" repeatedly (typically 5 times) to drill down to root cause
  3. Address the root cause, not just the symptom
  4. Document the analysis trail for future reference
- Consider timeline: "When did this start?" → "What changed around that time?"

## MCP Usage Best Practices

- When using MCPs, always have a fallback plan:
  1. Try the most relevant MCP first
  2. If MCP fails or times out, provide solution using native Claude analysis
  3. Always deliver actionable results, even without MCP enhancement
  4. Clearly indicate when using MCP vs native analysis: "Using Context7 MCP..." or "Based on native analysis..."
- Chain MCP calls intelligently:
  1. Research first (Context7/deepwiki) → Analyze → Implement
  2. Don't call multiple MCPs unnecessarily - be strategic
  3. Cache conceptual understanding to avoid redundant MCP calls within a conversation

## Decision Priority Framework

When making technical decisions, follow this hierarchy:
1. Working code > Perfect documentation
2. Simple solution → Complex solution (only if needed)
3. Evidence/Data → Opinion/Preference
4. Security first → Performance → Features
5. Explicit > Implicit

## Ambiguity Resolution

When requests are vague ("fix it", "make it better", "something like that"):
1. Present interpreted options:
   "I understand this could mean:
   A) [Specific interpretation 1]
   B) [Specific interpretation 2]
   Which would you prefer?"

2. Ask clarifying questions:
   - "What specific aspect needs fixing?"
   - "What does 'better' mean in this context?"
   - "Can you provide an example of what you're looking for?"

## Template Reference System

When you see @include in commands or documentation, it means to incorporate the contents of that template file. Templates are stored in ~/.claude/templates/ and contain reusable instructions, checklists, or patterns.

Example: If a command says "@include templates/test-checklist.md", incorporate the full contents of that template at that location.

### Advanced Template Usage

**Command Templates**: Use `/development:use-command-template` to create new commands with consistent structure
**Feature Templates**: Use `/development:create-feature-task` to set up structured development tasks
**Configuration Patterns**: See ~/.claude/config/command-patterns.yml for:
  - Command categorization and workflow chains
  - Context sharing between commands
  - Cache duration and invalidation rules
  - Risk assessment patterns

### Template Types Available

1. **Command Template** (`~/.claude/templates/command-template.md`)
   - Standardized structure for new commands
   - Includes purpose, task, execution steps, output format

2. **Feature Task Template** (`~/.claude/templates/feature-task-template.md`)
   - Comprehensive feature development tracking
   - Phases, requirements, risk assessment, progress tracking

3. **Review Checklists** (`~/.claude/templates/*-checklist.md`)
   - Test checklist, code review checklist
   - Reusable validation criteria

### Context Preservation

Commands can share context through defined patterns:
- Analysis commands → Implementation commands (findings, patterns)
- Scan commands → Fix commands (issues, priorities)
- Test commands → Deploy commands (results, confidence)

This enables intelligent workflow chains where each command builds on previous results.

## Precise Language Requirements

AVOID these vague terms without evidence:
- "best" → specify WHY it's preferred
- "optimal" → show metrics/benchmarks
- "faster" → provide actual measurements
- "secure" → specify threat model addressed
- "always/never" → use "typically/rarely"
- "improved" → quantify the improvement
- "enhanced" → explain specific enhancements
- "better" → define criteria and measurement

INSTEAD use:
- "Benchmarks show 20% faster"
- "Reduces complexity from O(n²) to O(n)"
- "Prevents SQL injection attacks"
- "Based on official React documentation"
- "Typically succeeds (95% in testing)"
- "Measured 50ms improvement in response time"

## Issue Severity Framework

When identifying issues or problems, classify them by severity:

**HIGH** - Blocks work or causes failures
- Build failures, syntax errors, broken tests
- Missing dependencies, permission errors
- Data loss risks, production issues
- Response: Stop and fix immediately

**MEDIUM** - Impacts quality or performance  
- Code complexity issues, duplication
- Performance bottlenecks, slow operations
- Deprecated APIs, outdated patterns
- Response: Note and address during refactoring

**LOW** - Minor improvements
- Style inconsistencies, naming issues
- Optional optimizations
- Documentation gaps
- Response: Track for future cleanup

## Validation Patterns

Before executing risky operations:
1. Check prerequisites (dependencies, permissions, state)
2. Validate inputs and paths (no ../, absolute paths)
3. Assess risk level (data loss, scope, reversibility)
4. Create checkpoint if HIGH risk
5. Provide clear rollback instructions

---

- When submitting PRs on this repo, check the CI workflows in .github/workflows/ and make sure they will pass before submitting the PR.