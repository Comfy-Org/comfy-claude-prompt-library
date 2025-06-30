# Resources and References

## Documentation

When writing prompt files, refer to these resources to determine the best way to format, structure, and word the prompt:

- [Prompt Library](https://docs.anthropic.com/en/resources/prompt-library/library) - Get inspired by a curated selection of prompts for various tasks and use cases
- [Claude Code Tutorials](https://docs.anthropic.com/en/docs/claude-code/tutorials) - Official tutorials for Claude Code
- [GitHub Prompting Tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) - An example-filled tutorial that covers the prompt engineering concepts
- [Google Sheets Prompting Tutorial](https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8) - A lighter weight version of the prompt engineering tutorial via an interactive spreadsheet

## Extended Thinking Resources

- [Extended Thinking Cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking) - Explore practical examples of extended thinking
- [Extended Thinking Guide](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking) - Complete technical documentation for implementing extended thinking
- [Extended Thinking Models](https://docs.anthropic.com/en/docs/about-claude/models/extended-thinking-models) - Guidance on deciding when to use extended thinking

## API Documentation

- [Messages API](https://docs.anthropic.com/en/api/messages) - Core API for interacting with Claude
- [Batch Processing](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing) - For workloads with thinking budgets above 32K
- [Multilingual Support](https://docs.anthropic.com/en/docs/build-with-claude/multilingual-support) - Language capabilities and best practices

## Best Practices

- [Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) - Comprehensive guide to prompt engineering
- [Chain of Thought Prompting](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought) - Traditional CoT techniques
- [Prefill Claude's Response](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prefill-claudes-response) - How to prefill responses (note: not allowed for extended thinking)

## Community Resources

- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook) - Collection of examples and patterns
- [Claude Code Issues](https://github.com/anthropics/claude-code/issues) - Report issues and give feedback

## Quick Reference Links

### For Prompting
1. Start with the [Prompt Library](https://docs.anthropic.com/en/resources/prompt-library/library) for inspiration
2. Use the [GitHub Tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) for hands-on learning
3. Apply techniques from this guide systematically

### For Extended Thinking
1. Review [When to Use Extended Thinking](https://docs.anthropic.com/en/docs/about-claude/models/extended-thinking-models)
2. Start with minimum thinking budget (1024 tokens)
3. Use trigger words: "think" < "think hard" < "think harder" < "ultrathink"

### For Claude 4
1. Be explicit with instructions
2. Add context to improve performance
3. Request specific features when needed
4. Use modifiers to encourage detail

### For Evaluation
1. Build test suites early
2. Track metrics systematically
3. Use version control for commands
4. Document what improves performance