# Claude Code Workflows

## Give Claude more tools

Claude has access to your shell environment, where you can build up sets of convenience scripts and functions for it just like you would for yourself. It can also leverage more complex tools through MCP and REST APIs.

### Use Claude with bash tools

Claude Code inherits your bash environment, giving it access to all your tools. While Claude knows common utilities like unix tools and gh, it won't know about your custom bash tools without instructions:

- Tell Claude the tool name with usage examples
- Tell Claude to run --help to see tool documentation
- Document frequently used tools in CLAUDE.md

## Recommended Workflows

### Research, Plan, Implement

1. Ask Claude to read relevant files, images, or URLs, providing either general pointers ("read the file that handles logging") or specific filenames ("read logging.py"), but explicitly tell it not to write any code just yet.
2. This is the part of the workflow where you should consider strong use of subagents, especially for complex problems. Telling Claude to use subagents to verify details or investigate particular questions it might have, especially early on in a conversation or task, tends to preserve context availability without much downside in terms of lost efficiency.
3. Ask Claude to make a plan for how to approach a specific problem. We recommend using the word "think" to trigger extended thinking mode, which gives Claude additional computation time to evaluate alternatives more thoroughly. These specific phrases are mapped directly to increasing levels of thinking budget in the system: "think" < "think hard" < "think harder" < "ultrathink." Each level allocates progressively more thinking budget for Claude to use.
4. If the results of this step seem reasonable, you can have Claude create a document or a GitHub issue with its plan so that you can reset to this spot if the implementation (step 3) isn't what you want.
5. Ask Claude to implement its solution in code. This is also a good place to ask it to explicitly verify the reasonableness of its solution as it implements pieces of the solution.
6. Ask Claude to commit the result and create a pull request. If relevant, this is also a good time to have Claude update any READMEs or changelogs with an explanation of what it just did.

Steps #1-#2 are crucial—without them, Claude tends to jump straight to coding a solution. While sometimes that's what you want, asking Claude to research and plan first significantly improves performance for problems requiring deeper thinking upfront.

### Write tests, commit; code, iterate, commit

This is an Anthropic-favorite workflow for changes that are easily verifiable with unit, integration, or end-to-end tests. Test-driven development (TDD) becomes even more powerful with agentic coding:

1. Ask Claude to write tests based on expected input/output pairs. Be explicit about the fact that you're doing test-driven development so that it avoids creating mock implementations, even for functionality that doesn't exist yet in the codebase.
2. Tell Claude to run the tests and confirm they fail. Explicitly telling it not to write any implementation code at this stage is often helpful.
3. Ask Claude to commit the tests when you're satisfied with them.
4. Ask Claude to write code that passes the tests, instructing it not to modify the tests. Tell Claude to keep going until all tests pass. It will usually take a few iterations for Claude to write code, run the tests, adjust the code, and run the tests again.
5. At this stage, it can help to ask it to verify with independent subagents that the implementation isn't overfitting to the tests
6. Ask Claude to commit the code once you're satisfied with the changes.

Claude performs best when it has a clear target to iterate against—a visual mock, a test case, or another kind of output. By providing expected outputs like tests, Claude can make changes, evaluate results, and incrementally improve until it succeeds.

### Write code, screenshot result, iterate

Similar to the testing workflow, you can provide Claude with visual targets:

1. Give Claude a way to take browser screenshots (e.g., with the Puppeteer MCP server, an iOS simulator MCP server, or manually copy / paste screenshots into Claude).
2. Give Claude a visual mock by copying / pasting or drag-dropping an image, or giving Claude the image file path.
3. Ask Claude to implement the design in code, take screenshots of the result, and iterate until its result matches the mock.
4. Ask Claude to commit when you're satisfied.

Like humans, Claude's outputs tend to improve significantly with iteration. While the first version might be good, after 2-3 iterations it will typically look much better. Give Claude the tools to see its outputs for best results.

### Use Claude to interact with git

Claude can effectively handle many git operations. Many Anthropic engineers use Claude for 90%+ of our git interactions:

- Searching git history to answer questions like "What changes made it into v1.2.3?", "Who owns this particular feature?", or "Why was this API designed this way?" It helps to explicitly prompt Claude to look through git history to answer queries like these.
- Writing commit messages. Claude will look at your changes and recent history automatically to compose a message taking all the relevant context into account
- Handling complex git operations like reverting files, resolving rebase conflicts, and comparing and grafting patches

### Use Claude to interact with GitHub

Claude Code can manage many GitHub interactions:

- Creating pull requests: Claude understands the shorthand "pr" and will generate appropriate commit messages based on the diff and surrounding context.
- Implementing one-shot resolutions for simple code review comments: just tell it to fix comments on your PR (optionally, give it more specific instructions) and push back to the PR branch when it's done.
- Fixing failing builds or linter warnings
- Categorizing and triaging open issues by asking Claude to loop over open GitHub issues

This eliminates the need to remember gh command line syntax while automating routine tasks.

### Use Claude to work with Jupyter notebooks

Researchers and data scientists at Anthropic use Claude Code to read and write Jupyter notebooks. Claude can interpret outputs, including images, providing a fast way to explore and interact with data. There are no required prompts or workflows, but a workflow we recommend is to have Claude Code and a .ipynb file open side-by-side in VS Code.

You can also ask Claude to clean up or make aesthetic improvements to your Jupyter notebook before you show it to colleagues. Specifically telling it to make the notebook or its data visualizations "aesthetically pleasing" tends to help remind it that it's optimizing for a human viewing experience.