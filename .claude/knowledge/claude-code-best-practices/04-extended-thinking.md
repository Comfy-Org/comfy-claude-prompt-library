# Extended Thinking Tips

This guide provides advanced strategies and techniques for getting the most out of Claude's extended thinking features. Extended thinking allows Claude to work through complex problems step-by-step, improving performance on difficult tasks.

## Before diving in

This guide presumes that you have already decided to use extended thinking mode and have reviewed basic steps on how to get started with extended thinking as well as extended thinking implementation guide.

## Technical considerations for extended thinking

- Thinking tokens have a minimum budget of 1024 tokens. We recommend that you start with the minimum thinking budget and incrementally increase to adjust based on your needs and task complexity.
- For workloads where the optimal thinking budget is above 32K, we recommend that you use batch processing to avoid networking issues. Requests pushing the model to think above 32K tokens causes long running requests that might run up against system timeouts and open connection limits.
- Extended thinking performs best in English, though final outputs can be in any language Claude supports.
- If you need thinking below the minimum budget, we recommend using standard mode, with thinking turned off, with traditional chain-of-thought prompting with XML tags (like `<thinking>`).

## Prompting techniques for extended thinking

### Use general instructions first, then troubleshoot with more step-by-step instructions

Claude often performs better with high level instructions to just think deeply about a task rather than step-by-step prescriptive guidance. The model's creativity in approaching problems may exceed a human's ability to prescribe the optimal thinking process.

For example, instead of:
```text
Think through this math problem step by step: 
1. First, identify the variables
2. Then, set up the equation
3. Next, solve for x
...
```

Consider:
```text
Please think about this math problem thoroughly and in great detail. 
Consider multiple approaches and show your complete reasoning.
Try different methods if your first approach doesn't work.
```

That said, Claude can still effectively follow complex structured execution steps when needed. The model can handle even longer lists with more complex instructions than previous versions. We recommend that you start with more generalized instructions, then read Claude's thinking output and iterate to provide more specific instructions to steer its thinking from there.

### Multishot prompting with extended thinking

Multishot prompting works well with extended thinking. When you provide Claude examples of how to think through problems, it will follow similar reasoning patterns within its extended thinking blocks.

You can include few-shot examples in your prompt in extended thinking scenarios by using XML tags like `<thinking>` or `<scratchpad>` to indicate canonical patterns of extended thinking in those examples.

Claude will generalize the pattern to the formal extended thinking process. However, it's possible you'll get better results by giving Claude free rein to think in the way it deems best.

### Maximizing instruction following with extended thinking

Claude shows significantly improved instruction following when extended thinking is enabled. The model typically:

1. Reasons about instructions inside the extended thinking block
2. Executes those instructions in the response

To maximize instruction following:

* Be clear and specific about what you want
* For complex instructions, consider breaking them into numbered steps that Claude should work through methodically
* Allow Claude enough budget to process the instructions fully in its extended thinking

### Using extended thinking to debug and steer Claude's behavior

You can use Claude's thinking output to debug Claude's logic, although this method is not always perfectly reliable.

To make the best use of this methodology, we recommend the following tips:

* We don't recommend passing Claude's extended thinking back in the user text block, as this doesn't improve performance and may actually degrade results.
* Prefilling extended thinking is explicitly not allowed, and manually changing the model's output text that follows its thinking block is likely going to degrade results due to model confusion.

When extended thinking is turned off, standard `assistant` response text prefill is still allowed.

**Note**: Sometimes Claude may repeat its extended thinking in the assistant output text. If you want a clean response, instruct Claude not to repeat its extended thinking and to only output the answer.

### Making the best of long outputs and longform thinking

For dataset generation use cases, try prompts such as "Please create an extremely detailed table of..." for generating comprehensive datasets.

For use cases such as detailed content generation where you may want to generate longer extended thinking blocks and more detailed responses, try these tips:

* Increase both the maximum extended thinking length AND explicitly ask for longer outputs
* For very long outputs (20,000+ words), request a detailed outline with word counts down to the paragraph level. Then ask Claude to index its paragraphs to the outline and maintain the specified word counts

**Warning**: We do not recommend that you push Claude to output more tokens for outputting tokens' sake. Rather, we encourage you to start with a small thinking budget and increase as needed to find the optimal settings for your use case.

### Have Claude reflect on and check its work for improved consistency and error handling

You can use simple natural language prompting to improve consistency and reduce errors:

1. Ask Claude to verify its work with a simple test before declaring a task complete
2. Instruct the model to analyze whether its previous step achieved the expected result
3. For coding tasks, ask Claude to run through test cases in its extended thinking

Example:
```text
Write a function to calculate the factorial of a number.
Before you finish, please verify your solution with test cases for:
- n=0
- n=1
- n=5
- n=10
And fix any issues you find.
```

## Thinking Trigger Words

In Claude Code workflows, specific phrases are mapped directly to increasing levels of thinking budget in the system:
- "think" < "think hard" < "think harder" < "ultrathink"

Each level allocates progressively more thinking budget for Claude to use.