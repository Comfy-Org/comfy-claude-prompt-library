# Core Prompting Techniques

## 1. Be Direct

When interacting with Claude, think of it as a brilliant but very new employee (with amnesia) who needs explicit instructions. Like any new employee, Claude does not have context on your norms, styles, guidelines, or preferred ways of working. The more precisely you explain what you want, the better Claude's response will be.

**The golden rule of clear prompting**: Show your prompt to a colleague, ideally someone who has minimal context on the task, and ask them to follow the instructions. If they're confused, Claude will likely be too.

### How to be clear, contextual, and specific

- **Give Claude contextual information:** Just like you might be able to better perform on a task if you knew more context, Claude will perform better if it has more contextual information. Some examples:
  - What the task results will be used for
  - What audience the output is meant for
  - What workflow the task is a part of, and where this task belongs in that workflow
  - The end goal of the task, or what a successful task completion looks like
- **Be specific about what you want Claude to do:** For example, if you want Claude to output only code and nothing else, say so.
- **Provide instructions as sequential steps:** Use numbered lists or bullet points to better ensure that Claude carries out the task the exact way you want it to.

### The "Manager" Approach: Hyper-Detailed Prompts

For complex agent systems, treat Claude like a new employee who needs comprehensive training. Leading AI startups like Parahelp use prompts that are 6+ pages long, meticulously outlining:

- **Detailed role definition:** Exactly who Claude is and what expertise it should demonstrate
- **Comprehensive task breakdown:** Every step, decision point, and contingency 
- **Explicit constraints and guidelines:** What Claude should and shouldn't do
- **Output format specifications:** Exact structure, formatting, and required elements
- **Error handling procedures:** How to respond when information is missing or unclear

This approach significantly improves reliability for complex agent workflows, though it requires more upfront investment in prompt development.

### Implement an "Escape Hatch"

Always instruct Claude to explicitly state when it doesn't know something or lacks sufficient information, rather than hallucinating or making assumptions:

```
If you do not have enough information to make a determination, say "I don't know" and ask for clarification. Never guess or make up information.
```

This reduces incorrect outputs and improves trustworthiness in agent systems.

## 2. Use Examples (Multishot Prompting)

Examples are your secret weapon shortcut for getting Claude to generate exactly what you need. By providing a few well-crafted examples in your prompt, you can dramatically improve the accuracy, consistency, and quality of Claude's outputs. This technique, known as few-shot or multishot prompting, is particularly effective for tasks that require structured outputs or adherence to specific formats.

**Power up your prompts**: Include 3-5 diverse, relevant examples to show Claude exactly what you want. More examples = better performance, especially for complex tasks.

### Why use examples?

- **Accuracy**: Examples reduce misinterpretation of instructions.
- **Consistency**: Examples enforce uniform structure and style.
- **Performance**: Well-chosen examples boost Claude's ability to handle complex tasks.

### Crafting effective examples

For maximum effectiveness, make sure that your examples are:

- **Relevant**: Your examples mirror your actual use case.
- **Diverse**: Your examples cover edge cases and potential challenges, and vary enough that Claude doesn't inadvertently pick up on unintended patterns.
- **Clear**: Your examples are wrapped in `<example>` tags (if multiple, nested within `<examples>` tags) for structure.

**Tip**: Ask Claude to evaluate your examples for relevance, diversity, or clarity. Or have Claude generate more examples based on your initial set.

## 3. Use XML Tags to Structure Your Prompts

When your prompts involve multiple components like context, instructions, and examples, XML tags can be a game-changer. They help Claude parse your prompts more accurately, leading to higher-quality outputs.

**XML tip**: Use tags like `<instructions>`, `<example>`, and `<formatting>` to clearly separate different parts of your prompt. This prevents Claude from mixing up instructions with examples or context.

### Why use XML tags?

- **Clarity:** Clearly separate different parts of your prompt and ensure your prompt is well structured.
- **Accuracy:** Reduce errors caused by Claude misinterpreting parts of your prompt.
- **Flexibility:** Easily find, add, remove, or modify parts of your prompt without rewriting everything.
- **Parseability:** Having Claude use XML tags in its output makes it easier to extract specific parts of its response by post-processing.

There are no canonical "best" XML tags that Claude has been trained with in particular, although we recommend that your tag names make sense with the information they surround.

### Tagging best practices

1. **Be consistent**: Use the same tag names throughout your prompts, and refer to those tag names when talking about the content (e.g, `Using the contract in <contract> tags...`).
2. **Nest tags**: You should nest tags `<outer><inner></inner></outer>` for hierarchical content.

**Power user tip**: Combine XML tags with other techniques like multishot prompting (`<examples>`) or chain of thought (`<thinking>`, `<answer>`). This creates super-structured, high-performance prompts.