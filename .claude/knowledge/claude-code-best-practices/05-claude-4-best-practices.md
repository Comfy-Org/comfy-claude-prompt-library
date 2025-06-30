# Claude 4 Best Practices

Claude 4 models (Opus 4 and Sonnet 4) have been trained for more precise instruction following than previous generations.

## General Principles

### Be explicit with your instructions

Claude 4 models respond well to clear, explicit instructions. Being specific about your desired output can help enhance results. Customers who desire the "above and beyond" behavior from previous Claude models might need to more explicitly request these behaviors with Claude 4.

**Less effective:**
```text
Create an analytics dashboard
```

**More effective:**
```text
Create an analytics dashboard. Include as many relevant features and interactions as possible. Go beyond the basics to create a fully-featured implementation.
```

### Add context to improve performance

Providing context or motivation behind your instructions, such as explaining to Claude why such behavior is important, can help Claude 4 better understand your goals and deliver more targeted responses.

**Less effective:**
```text
NEVER use ellipses
```

**More effective:**
```text
Your response will be read aloud by a text-to-speech engine, so never use ellipses since the text-to-speech engine will not know how to pronounce them.
```

Claude is smart enough to generalize from the explanation.

### Be vigilant with examples & details

Claude 4 models pay attention to details and examples as part of instruction following. Ensure that your examples align with the behaviors you want to encourage and minimize behaviors you want to avoid.

## Guidance for Specific Situations

### Control the format of responses

There are a few ways that we have found to be particularly effective in steering output formatting in Claude 4 models:

1. **Tell Claude what to do instead of what not to do**
   - Instead of: "Do not use markdown in your response"
   - Try: "Your response should be composed of smoothly flowing prose paragraphs."

2. **Use XML format indicators**
   - Try: "Write the prose sections of your response in <smoothly_flowing_prose_paragraphs> tags."

3. **Match your prompt style to the desired output**
   The formatting style used in your prompt may influence Claude's response style. If you are still experiencing steerability issues with output formatting, we recommend as best as you can matching your prompt style to your desired output style. For example, removing markdown from your prompt can reduce the volume of markdown in the output.

### Leverage thinking & interleaved thinking capabilities

Claude 4 offers thinking capabilities that can be especially helpful for tasks involving reflection after tool use or complex multi-step reasoning. You can guide its initial or interleaved thinking for better results.

```text
After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
```

### Optimize parallel tool calling

Claude 4 models excel at parallel tool execution. They have a high success rate in using parallel tool calling without any prompting to do so, but some minor prompting can boost this behavior to ~100% parallel tool use success rate. We have found this prompt to be most effective:

```text
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

### Reduce file creation in agentic coding

Claude 4 models may sometimes create new files for testing and iteration purposes, particularly when working with code. This approach allows Claude to use files, especially python scripts, as a 'temporary scratchpad' before saving its final output. Using temporary files can improve outcomes particularly for agentic coding use cases.

If you'd prefer to minimize net new file creation, you can instruct Claude to clean up after itself:

```text
If you create any temporary new files, scripts, or helper files for iteration, clean up these files by removing them at the end of the task.
```

### Enhance visual and frontend code generation

For frontend code generation, you can steer Claude 4 models to create complex, detailed, and interactive designs by providing explicit encouragement:

```text
Don't hold back. Give it your all.
```

You can also improve Claude's frontend performance in specific areas by providing additional modifiers and details on what to focus on:

- "Include as many relevant features and interactions as possible"
- "Add thoughtful details like hover states, transitions, and micro-interactions"
- "Create an impressive demonstration showcasing web development capabilities"
- "Apply design principles: hierarchy, contrast, balance, and movement"

## Migration Considerations

When migrating from Sonnet 3.7 to Claude 4:

1. **Be specific about desired behavior**: Consider describing exactly what you'd like to see in the output.

2. **Frame your instructions with modifiers**: Adding modifiers that encourage Claude to increase the quality and detail of its output can help better shape Claude's performance. For example, instead of "Create an analytics dashboard", use "Create an analytics dashboard. Include as many relevant features and interactions as possible. Go beyond the basics to create a fully-featured implementation."

3. **Request specific features explicitly**: Animations and interactive elements should be requested explicitly when desired.

## Model Personalities & Distillation Strategy

Different LLMs have distinct "personalities" and capabilities. Understanding these can help you optimize your prompts:

**Claude Characteristics:**
- More conversational and human-like in responses
- Strong at following complex instructions and reasoning
- Excels at ethical reasoning and nuanced analysis
- Generally requires less explicit steering than other models

**Cross-Model Considerations:**
- **Llama models** might need more explicit steering and structure
- **GPT models** may have different formatting preferences
- **Smaller models** often benefit from more specific instructions

**Distillation Strategy:**
1. **Develop with larger models:** Use Claude 4 or other capable models for complex meta-prompting and refinement
2. **Test across models:** Validate prompts work across your target model types
3. **Distill for production:** Adapt optimized prompts for smaller, faster, or cheaper models
4. **Maintain quality:** Use evaluation suites to ensure performance doesn't degrade

This approach optimizes for both quality (from larger models) and cost/latency (with smaller models).