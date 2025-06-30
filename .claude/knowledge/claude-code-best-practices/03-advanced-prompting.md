# Advanced Prompting Techniques

## 1. Let Claude Think (Chain of Thought Prompting)

When tackling complex problems, allow Claude to work through them step by step. This approach, known as chain of thought prompting, often leads to more accurate and thoughtful responses. The model can break down complex tasks, reason through different approaches, and arrive at better solutions.

## 2. Give Claude a Role with a System Prompt

When using Claude, you can dramatically improve its performance by using the `system` parameter to give it a role. This technique, known as role prompting, is the most powerful way to use system prompts with Claude.

The right role can turn Claude from a general assistant into your virtual domain expert!

**System prompt tips**: Use the `system` parameter to set Claude's role. Put everything else, like task-specific instructions, in the `user` turn instead.

### Why use role prompting?

- **Enhanced accuracy:** In complex scenarios like legal analysis or financial modeling, role prompting can significantly boost Claude's performance.
- **Tailored tone:** Whether you need a CFO's brevity or a copywriter's flair, role prompting adjusts Claude's communication style.
- **Improved focus:** By setting the role context, Claude stays more within the bounds of your task's specific requirements.

### How to give Claude a role

Use the `system` parameter in the Messages API to set Claude's role:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=2048,
    system="You are a seasoned data scientist at a Fortune 500 company.", # <-- role prompt
    messages=[
        {"role": "user", "content": "Analyze this dataset for anomalies: <dataset>{{DATASET}}</dataset>"}
    ]
)

print(response.content)
```

**Role prompting tip**: Experiment with roles! A `data scientist` might see different insights than a `marketing strategist` for the same data. A `data scientist specializing in customer insight analysis for Fortune 500 companies` might yield different results still!

## 3. Chain Complex Prompts for Stronger Performance

When working with complex tasks, Claude can sometimes drop the ball if you try to handle everything in a single prompt. Chain of thought (CoT) prompting is great, but what if your task has multiple distinct steps that each require in-depth thought?

Enter prompt chaining: breaking down complex tasks into smaller, manageable subtasks.

### Why chain prompts?

1. **Accuracy**: Each subtask gets Claude's full attention, reducing errors.
2. **Clarity**: Simpler subtasks mean clearer instructions and outputs.
3. **Traceability**: Easily pinpoint and fix issues in your prompt chain.

### When to chain prompts

Use prompt chaining for multi-step tasks like research synthesis, document analysis, or iterative content creation. When a task involves multiple transformations, citations, or instructions, chaining prevents Claude from dropping or mishandling steps.

**Remember:** Each link in the chain gets Claude's full attention!

**Debugging tip**: If Claude misses a step or performs poorly, isolate that step in its own prompt. This lets you fine-tune problematic steps without redoing the entire task.

### How to chain prompts

1. **Identify subtasks**: Break your task into distinct, sequential steps.
2. **Structure with XML for clear handoffs**: Use XML tags to pass outputs between prompts.
3. **Have a single-task goal**: Each subtask should have a single, clear objective.
4. **Iterate**: Refine subtasks based on Claude's performance.

### Example chained workflows:

- **Multi-step analysis**: See the legal and business examples below.
- **Content creation pipelines**: Research → Outline → Draft → Edit → Format.
- **Data processing**: Extract → Transform → Analyze → Visualize.
- **Decision-making**: Gather info → List options → Analyze each → Recommend.
- **Verification loops**: Generate content → Review → Refine → Re-review.

**Optimization tip**: For tasks with independent subtasks (like analyzing multiple docs), create separate prompts and run them in parallel for speed.

### Prompt Folding & Dynamic Generation

Design prompts that can dynamically generate more specialized sub-prompts based on context or previous outputs in multi-stage workflows. This creates adaptive agentic systems that tailor their approach based on what they discover.

**Example Pattern:**
1. **Classifier prompt** that analyzes the input and determines the best approach
2. **Dynamic sub-prompt generation** based on the classification
3. **Specialized execution** using the generated sub-prompt

```
Step 1: Analyze this customer query and determine the best response approach.
If it's a technical issue → generate a detailed troubleshooting prompt
If it's a billing question → generate a billing-specific prompt  
If it's a feature request → generate a product feedback prompt

Step 2: Use the generated prompt to handle the specific case
```

This technique allows for more sophisticated and context-aware agent behaviors.

### Advanced: Self-correction chains

You can chain prompts to have Claude review its own work! This catches errors and refines outputs, especially for high-stakes tasks.

## 4. Meta-Prompting: Let Claude Improve Your Prompts

One of the most powerful techniques is using Claude itself to help refine and improve your prompts. Claude understands its own capabilities and limitations, making it an excellent prompt engineering assistant.

### How to Use Meta-Prompting

1. **Show Claude your current prompt** along with examples of good and bad outputs
2. **Ask Claude to critique the prompt** and identify areas for improvement  
3. **Request specific improvements** like "make this prompt more specific" or "add better examples"
4. **Iterate on the suggestions** to create increasingly effective prompts

### Example Meta-Prompting Session

```
Current prompt: "Analyze the customer feedback and tell me what to improve."

Claude, please critique this prompt and make it better. Here are some examples of outputs I received:
- [Include actual outputs showing problems]

Make the prompt more specific, add structure, and include examples that would lead to more actionable insights.
```

Claude can suggest improvements like:
- Adding role context ("You are a product manager...")
- Structuring output requirements (using XML tags, bullet points)
- Including specific examples of good analysis
- Adding constraints and edge case handling

### Benefits of Meta-Prompting

- **Leverages Claude's self-knowledge** about what works best
- **Saves time** compared to manual trial-and-error iteration
- **Reveals blind spots** you might not have considered
- **Creates prompt templates** that can be reused across similar tasks