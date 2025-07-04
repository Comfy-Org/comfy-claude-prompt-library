# Create Claude Code Command

<task>
I want to create a new Claude Code command for the following task: $ARGUMENTS.
</task>

## Command Creation Guide

### What You'll Create

Claude Code commands are stored prompt templates in Markdown files within the `.claude/commands` folder. Custom slash commands can include the special keyword `$ARGUMENTS` to pass parameters from command invocation.

**Example:** Putting content into `.claude/commands/fix-github-issue.md` makes it available as the `/project:fix-github-issue` command. You could then use `/project:fix-github-issue 1234` to have Claude fix issue #1234.

### Basic Command Structure

```md
Please analyze and fix the GitHub issue: $ARGUMENTS.

Follow these steps:

1. Use `gh issue view` to get the issue details
2. Understand the problem described in the issue
3. Search the codebase for relevant files
4. Implement the necessary changes to fix the issue
5. Write and run tests to verify the fix
6. Ensure code passes linting and type checking
7. Create a descriptive commit message
8. Push and create a PR

Remember to use the GitHub CLI (`gh`) for all GitHub-related tasks.
```

### Command Locations

You can add commands to:
- `.claude/commands/` folder for project-specific commands
- `~/.claude/commands` folder for personal commands available in all sessions

### Pattern Consistency Enforcement

Before creating any new command, ensure it maintains consistency with existing patterns:

1. **Search for Similar Commands First**
   - Look for existing commands that solve similar problems
   - Check both project-specific and global command directories
   - Analyze their structure, naming conventions, and approach

2. **Match Existing Patterns**
   - Follow the same formatting style as other commands
   - Use consistent variable naming (e.g., always use `$ARGUMENTS` for parameters)
   - Maintain similar section headers and organization

3. **Align with Project Conventions**
   - Check for any README files in the commands directories
   - Look for established patterns in command naming (kebab-case, prefixes, etc.)
   - Ensure your command fits logically within the existing command hierarchy

4. **Reuse Common Components**
   - If other commands use specific tools or workflows, adopt the same approach
   - Don't reinvent patterns that already exist in the command library
   - Reference and build upon existing command structures when appropriate

<resources>
When writing the prompt file, refer to these resources to determine the best way to format, structure, and word the prompt:

- [Prompt Library](https://docs.anthropic.com/en/resources/prompt-library/library)
- [Claude Code Tutorials](https://docs.anthropic.com/en/docs/claude-code/tutorials)
</resources>

## Essential Background Information

### Claude Code Overview

Claude Code is an agentic coding assistant that automatically pulls context into prompts. This context gathering consumes time and tokens, but you can optimize it through environment tuning.

#### Create CLAUDE.md files

CLAUDE.md is a special file that Claude automatically pulls into context when starting a conversation. This makes it an ideal place for documenting:

- Common bash commands
- Core files and utility functions
- Code style guidelines
- Testing instructions
- Repository etiquette (e.g., branch naming, merge vs. rebase, etc.)
- Developer environment setup (e.g., pyenv use, which compilers work)
- Any unexpected behaviors or warnings particular to the project
- Other information you want Claude to remember

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

You can place CLAUDE.md files in several locations:

- The root of your repo, or wherever you run claude from (the most common usage). Name it CLAUDE.md and check it into git so that you can share it across sessions and with your team (recommended), or name it CLAUDE.local.md and .gitignore it
- Any parent of the directory where you run claude. This is most useful for monorepos, where you might run claude from root/foo, and have CLAUDE.md files in both root/CLAUDE.md and root/foo/CLAUDE.md. Both of these will be pulled into context automatically
- Any child of the directory where you run claude. This is the inverse of the above, and in this case, Claude will pull in CLAUDE.md files on demand when you work with files in child directories
- Your home folder (~/.claude/CLAUDE.md), which applies it to all your claude sessions

When you run the /init command, Claude will automatically generate a CLAUDE.md for you.

#### Tune your CLAUDE.md files

Your CLAUDE.md files become part of Claude's prompts, so they should be refined like any frequently used prompt. A common mistake is adding extensive content without iterating on its effectiveness. Take time to experiment and determine what produces the best instruction following from the model.

You can add content to your CLAUDE.md manually or press the # key to give Claude an instruction that it will automatically incorporate into the relevant CLAUDE.md. Many engineers use # frequently to document commands, files, and style guidelines while coding, then include CLAUDE.md changes in commits so team members benefit as well.

At Anthropic, we occasionally run CLAUDE.md files through the prompt improver and often tune instructions (e.g. adding emphasis with "IMPORTANT" or "YOU MUST") to improve adherence.

## Advanced Prompting Reference

<note>
The following comprehensive prompting guide will help you create effective commands. Apply these principles when crafting your command prompt.
</note>

### 1. Be Direct

<Note>
  While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

When interacting with Claude, think of it as a brilliant but very new employee (with amnesia) who needs explicit instructions. Like any new employee, Claude does not have context on your norms, styles, guidelines, or preferred ways of working.
The more precisely you explain what you want, the better Claude's response will be.

<Tip>**The golden rule of clear prompting**<br />Show your prompt to a colleague, ideally someone who has minimal context on the task, and ask them to follow the instructions. If they're confused, Claude will likely be too.</Tip>

#### How to be clear, contextual, and specific

- **Give Claude contextual information:** Just like you might be able to better perform on a task if you knew more context, Claude will perform better if it has more contextual information. Some examples of contextual information:
  - What the task results will be used for
  - What audience the output is meant for
  - What workflow the task is a part of, and where this task belongs in that workflow
  - The end goal of the task, or what a successful task completion looks like
- **Be specific about what you want Claude to do:** For example, if you want Claude to output only code and nothing else, say so.
- **Provide instructions as sequential steps:** Use numbered lists or bullet points to better ensure that Claude carries out the task the exact way you want it to.

#### The "Manager" Approach: Hyper-Detailed Prompts

For complex agent systems, treat Claude like a new employee who needs comprehensive training. Leading AI startups like Parahelp use prompts that are 6+ pages long, meticulously outlining:

- **Detailed role definition:** Exactly who Claude is and what expertise it should demonstrate
- **Comprehensive task breakdown:** Every step, decision point, and contingency 
- **Explicit constraints and guidelines:** What Claude should and shouldn't do
- **Output format specifications:** Exact structure, formatting, and required elements
- **Error handling procedures:** How to respond when information is missing or unclear

This approach significantly improves reliability for complex agent workflows, though it requires more upfront investment in prompt development.

#### Implement an "Escape Hatch"

Always instruct Claude to explicitly state when it doesn't know something or lacks sufficient information, rather than hallucinating or making assumptions:

```
If you do not have enough information to make a determination, say "I don't know" and ask for clarification. Never guess or make up information.
```

This reduces incorrect outputs and improves trustworthiness in agent systems.

#### Examples

<AccordionGroup>
  <Accordion title="Example: Anonymizing customer feedback">
    Notice that Claude still makes mistakes in the unclear prompting example, such as leaving in a customer's name.

    | Role                          | Unclear Prompt                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Clear Prompt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | User                          | Please remove all personally identifiable information from these customer feedback messages: \{\{FEEDBACK\_DATA}}                                                                                                                                                                                                                                                                                                                                                     | Your task is to anonymize customer feedback for our quarterly review.<br /><br />Instructions:<br />1. Replace all customer names with "CUSTOMER\_\[ID]" (e.g., "Jane Doe" → "CUSTOMER\_001").<br />2. Replace email addresses with "EMAIL\_\[ID]@example.com".<br />3. Redact phone numbers as "PHONE\_\[ID]".<br />4. If a message mentions a specific product (e.g., "AcmeCloud"), leave it intact.<br />5. If no PII is found, copy the message verbatim.<br />6. Output only the processed messages, separated by "---".<br /><br />Data to process: \{\{FEEDBACK\_DATA}} |
    | Assistant (Claude's response) | Here are the anonymized customer feedback messages:<br />1. I've been using your software for years, and it's been great. But lately, AcmeCloud has been crashing a lot. Fix it!<br />2. XXX, your customer support rep, was incredibly helpful. He guided me through the whole process. My email is XXX if you want to send a survey.<br />3. I'm John Smith, and I'm not happy. I've been on hold for 2 hours trying to reach someone at XXX. This is unacceptable! | CUSTOMER\_001: I've been using your software for years, and it's been great. But lately, AcmeCloud has been crashing a lot. Fix it!<br />---<br />CUSTOMER\_002: CUSTOMER\_SERVICE\_001, your customer support rep, was incredibly helpful. He guided me through the whole process. My email is [EMAIL\_002@example.com](mailto:EMAIL_002@example.com) if you want to send a survey.<br />---<br />CUSTOMER\_003: I'm CUSTOMER\_003, and I'm not happy. I've been on hold for 2 hours trying to reach someone at PHONE\_001. This is unacceptable!                             |

  </Accordion>

  <Accordion title="Example: Crafting a marketing email campaign">
    Notice that Claude makes up details to fill in the gaps where it lacks context with the vague prompt.

    | Role                          | Vague Prompt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Specific Prompt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User                          | Write a marketing email for our new AcmeCloud features.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Your task is to craft a targeted marketing email for our Q3 AcmeCloud feature release.<br /><br />Instructions:<br />1. Write for this target audience: Mid-size tech companies (100-500 employees) upgrading from on-prem to cloud.<br />2. Highlight 3 key new features: advanced data encryption, cross-platform sync, and real-time collaboration.<br />3. Tone: Professional yet approachable. Emphasize security, efficiency, and teamwork.<br />4. Include a clear CTA: Free 30-day trial with priority onboarding.<br />5. Subject line: Under 50 chars, mention "security" and "collaboration".<br />6. Personalization: Use \{\{COMPANY\_NAME}} and \{\{CONTACT\_NAME}} variables.<br /><br />Structure:<br />1. Subject line<br />2. Email body (150-200 words)<br />3. CTA button text                                                                                                                                                                                                                                                                                                                                                        |
    | Assistant (Claude's response) | Here's a draft marketing email for our new features:<br /><br />Subject: Boost Your Business with AcmeCloud's Latest Features<br /><br />Dear Valued Customer,<br /><br />We're excited to introduce three powerful features to AcmeCloud that will revolutionize your workflow:<br /><br />1. Real-Time Collaboration: Work on documents simultaneously with your team. No more version control issues!<br />2. AI-Powered Insights: Make data-driven decisions with AI that analyzes trends and automates tasks.<br />3. Advanced Security Suite: End-to-end encryption, multi-factor auth, and threat detection keep your data safe.<br /><br />Limited Offer: Upgrade now for a 20% first-year discount. Plus, refer a friend for an extra 10% off!<br /><br />Best,<br />The AcmeCloud Team | Subject line: AcmeCloud: Enterprise security meets real-time teamwork<br /><br />Email body:<br />Dear \{\{CONTACT\_NAME}},<br /><br />At \{\{COMPANY\_NAME}}, you're scaling fast and eyeing the cloud. But with growth comes the challenge of keeping data secure while fostering collaboration. That's where AcmeCloud's Q3 release comes in, tailor-made for tech innovators like you.<br /><br />1. Fort Knox for Your Files: Military-grade encryption now safeguards your data, both in motion and at rest. Your intellectual property stays yours, period.<br />2. Sync Without Borders: Windows, Mac, or Linux—AcmeCloud speaks all languages. Unified version control means no more "final\_v2\_REALLY\_FINAL.doc".<br />3. Collaborate at Light Speed: Ditch the attachment ping-pong. Now your devs, designers, and data scientists co-create in real-time, slashing time-to-market.<br /><br />Don't just take our word for it. Experience the AcmeCloud difference with our 30-day trial. And because we know time is your most precious asset, we're throwing in priority onboarding.<br /><br />Elevate Your Team Now - Free 30-Day Trial |

  </Accordion>

  <Accordion title="Example: Incident response">
    Notice that Claude outputs superfluous text and different formatting with the vague prompt.

    | Role                          | Vague Prompt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Detailed Prompt                                                                                                                                                                                                                                                                                                         |
    | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User                          | Analyze this AcmeCloud outage report and summarize the key points.<br /><br />\{\{REPORT}}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Analyze this AcmeCloud outage report. Skip the preamble. Keep your response terse and write only the bare bones necessary information. List only:<br />1) Cause<br />2) Duration<br />3) Impacted services<br />4) Number of affected users<br />5) Estimated revenue loss. <br /><br />Here's the report: \{\{REPORT}} |
    | Assistant (Claude's response) | Here's a summary of the key points from the AcmeCloud outage report:<br /><br />On May 15th, a misconfigured load balancer update caused significant traffic routing issues, resulting in a service outage from 09:15 to 13:52 UTC. The 4-hour 37-minute disruption impacted our core file syncing service and admin dashboard, rendering them inaccessible. Additionally, the mobile app experienced partial functionality loss. Approximately 68% of our user base, totaling 1.3 million users, were affected. Based on our Service Level Agreements (SLAs) and average revenue per user, we estimate a financial impact of \$420,000 in service credits and potential customer churn. | 1) Cause: Misconfigured load balancer update<br />2) Duration: 4h 37m (09:15-13:52 UTC, May 15)<br />3) Impacted: Core sync, admin dashboard (down); mobile app (partial)<br />4) Affected users: 1.3M (68% of base)<br />5) Est. revenue loss: \$420,000                                                               |

  </Accordion>
</AccordionGroup>

---

<CardGroup cols={3}>
  <Card title="Prompt library" icon="link" href="/en/prompt-library/library">
    Get inspired by a curated selection of prompts for various tasks and use cases.
  </Card>

  <Card title="GitHub prompting tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    An example-filled tutorial that covers the prompt engineering concepts found in our docs.
  </Card>

  <Card title="Google Sheets prompting tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    A lighter weight version of our prompt engineering tutorial via an interactive spreadsheet.
  </Card>
</CardGroup>

### 2. Use Examples (Multishot Prompting)

<Note>
  While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Examples are your secret weapon shortcut for getting Claude to generate exactly what you need. By providing a few well-crafted examples in your prompt, you can dramatically improve the accuracy, consistency, and quality of Claude's outputs.
This technique, known as few-shot or multishot prompting, is particularly effective for tasks that require structured outputs or adherence to specific formats.

<Tip>**Power up your prompts**: Include 3-5 diverse, relevant examples to show Claude exactly what you want. More examples = better performance, especially for complex tasks.</Tip>

#### Why use examples?

- **Accuracy**: Examples reduce misinterpretation of instructions.
- **Consistency**: Examples enforce uniform structure and style.
- **Performance**: Well-chosen examples boost Claude's ability to handle complex tasks.

#### Crafting effective examples

For maximum effectiveness, make sure that your examples are:

- **Relevant**: Your examples mirror your actual use case.
- **Diverse**: Your examples cover edge cases and potential challenges, and vary enough that Claude doesn't inadvertently pick up on unintended patterns.
- **Clear**: Your examples are wrapped in `<example>` tags (if multiple, nested within `<examples>` tags) for structure.

<Tip>Ask Claude to evaluate your examples for relevance, diversity, or clarity. Or have Claude generate more examples based on your initial set.</Tip>

<Accordion title="Example: Analyzing customer feedback">
  Notice that in the "no examples" version, Claude does not list multiple options for each category, despite its written analysis indicating that there are multiple categories for certain feedback. It also includes a long explanation when we may not want it to.

| Role                          | No Examples                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | With Examples                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User                          | Analyze this customer feedback and categorize the issues. Use these categories: UI/UX, Performance, Feature Request, Integration, Pricing, and Other. Also rate the sentiment (Positive/Neutral/Negative) and priority (High/Medium/Low).<br /><br />Here is the feedback: \{\{FEEDBACK}}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Our CS team is overwhelmed with unstructured feedback. Your task is to analyze feedback and categorize issues for our product and engineering teams. Use these categories: UI/UX, Performance, Feature Request, Integration, Pricing, and Other. Also rate the sentiment (Positive/Neutral/Negative) and priority (High/Medium/Low). Here is an example:<br /><br />\<example><br />Input: The new dashboard is a mess! It takes forever to load, and I can't find the export button. Fix this ASAP!<br />Category: UI/UX, Performance<br />Sentiment: Negative<br />Priority: High\</example><br /><br />Now, analyze this feedback: \{\{FEEDBACK}}                                                                                                                                                                                                                                                                                                                                                                                               |
| Assistant (Claude's response) | Here's the analysis of the customer feedback:<br /><br />Issue: UI/UX<br />Sentiment: Negative<br />Priority: High<br />The customer is frustrated with the new dashboard design, which they find cluttered and slow to load. They specifically call out the missing "export" button, which is likely a critical feature. This issue needs to be addressed as a high priority.<br /><br />Issue: Integration<br />Sentiment: Positive<br />Priority: Medium<br />The customer is pleased with the existing Salesforce integration but would like to see support for Hubspot as well. This is a feature request that could be considered for a future product update.<br /><br />Issue: Pricing<br />Sentiment: Negative<br />Priority: High<br />The customer finds the pricing to be unreasonable, especially for the basic features. They are threatening to switch to a competitor, so this is a high-priority issue that needs to be reviewed.<br /><br />Issue: Performance<br />Sentiment Negative<br />Priority: High<br />The customer is experiencing critical issues with the mobile app, where large file uploads consistently result in crashes. This is a significant problem that impacts the customer's ability to use the product effectively and should be addressed as a high priority.<br /><br />Issue: UI/UX<br />Sentiment: Positive<br />Priority: Low<br />The customer is overall satisfied with the product, specifically calling out the intuitive UI and excellent customer support. This is a positive piece of feedback that does not require any immediate action. | Here's the analysis of the customer feedback:<br /><br />1. The new dashboard is a mess! It takes forever to load, and I can't find the export button. Fix this ASAP!<br />Category: UI/UX, Performance<br />Sentiment: Negative<br />Priority: High<br /><br />2. Love the Salesforce integration! But it'd be great if you could add Hubspot too.<br />Category: Integration, Feature Request<br />Sentiment: Positive<br />Priority: Medium<br /><br />3. Your pricing is ridiculous! \$99/mo for basic features? I'm switching to Competitor X.<br />Category: Pricing<br />Sentiment: Negative<br />Priority: High<br /><br />4. The mobile app keeps crashing when I try to upload large files (>50MB). This is critical for our field agents.<br />Category: Performance<br />Sentiment: Negative<br />Priority: High<br /><br />5. Overall, I'm happy with the product. The UI is intuitive, and the customer support is top-notch. Keep it up!<br />Category: UI/UX, Other (Customer Support)<br />Sentiment: Positive<br />Priority: Low |

</Accordion>

---

<CardGroup cols={3}>
  <Card title="Prompt library" icon="link" href="/en/prompt-library/library">
    Get inspired by a curated selection of prompts for various tasks and use cases.
  </Card>

  <Card title="GitHub prompting tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    An example-filled tutorial that covers the prompt engineering concepts found in our docs.
  </Card>

  <Card title="Google Sheets prompting tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    A lighter weight version of our prompt engineering tutorial via an interactive spreadsheet.
  </Card>
</CardGroup>

### 3. Let Claude Think (Chain of Thought Prompting)

When tackling complex problems, allow Claude to work through them step by step. This approach, known as chain of thought prompting, often leads to more accurate and thoughtful responses. The model can break down complex tasks, reason through different approaches, and arrive at better solutions.

### 4. Use XML Tags to Structure Your Prompts

<Note>
  While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

When your prompts involve multiple components like context, instructions, and examples, XML tags can be a game-changer. They help Claude parse your prompts more accurately, leading to higher-quality outputs.

<Tip>**XML tip**: Use tags like `<instructions>`, `<example>`, and `<formatting>` to clearly separate different parts of your prompt. This prevents Claude from mixing up instructions with examples or context.</Tip>

#### Why use XML tags?

- **Clarity:** Clearly separate different parts of your prompt and ensure your prompt is well structured.
- **Accuracy:** Reduce errors caused by Claude misinterpreting parts of your prompt.
- **Flexibility:** Easily find, add, remove, or modify parts of your prompt without rewriting everything.
- **Parseability:** Having Claude use XML tags in its output makes it easier to extract specific parts of its response by post-processing.

<Note>There are no canonical "best" XML tags that Claude has been trained with in particular, although we recommend that your tag names make sense with the information they surround.</Note>

#### Tagging best practices

1. **Be consistent**: Use the same tag names throughout your prompts, and refer to those tag names when talking about the content (e.g, `Using the contract in <contract> tags...`).
2. **Nest tags**: You should nest tags `<outer><inner></inner></outer>` for hierarchical content.

<Tip>**Power user tip**: Combine XML tags with other techniques like multishot prompting (`<examples>`) or chain of thought (`<thinking>`, `<answer>`). This creates super-structured, high-performance prompts.</Tip>

#### Examples

<AccordionGroup>
  <Accordion title="Example: Generating financial reports">
    Without XML tags, Claude misunderstands the task and generates a report that doesn't match the required structure or tone. After substitution, there is also a chance that Claude misunderstands where one section (like the Q1 report example) stops and another begins.

    | Role      | No XML Tags                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | With XML Tags                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User      | You're a financial analyst at AcmeCorp. Generate a Q2 financial report for our investors. Include sections on Revenue Growth, Profit Margins, and Cash Flow, like with this example from last year: \{\{Q1\_REPORT}}. Use data points from this spreadsheet: \{\{SPREADSHEET\_DATA}}. The report should be extremely concise, to the point, professional, and in list format. It should and highlight both strengths and areas for improvement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | You're a financial analyst at AcmeCorp. Generate a Q2 financial report for our investors.<br /><br />AcmeCorp is a B2B SaaS company. Our investors value transparency and actionable insights.<br /><br />Use this data for your report:\<data>\{\{SPREADSHEET\_DATA}}\</data><br /><br />\<instructions><br />1. Include sections: Revenue Growth, Profit Margins, Cash Flow.<br />2. Highlight strengths and areas for improvement.<br />\</instructions><br /><br />Make your tone concise and professional. Follow this structure:<br />\<formatting\_example>\{\{Q1\_REPORT}}\</formatting\_example>                                                                                                                                                                                                                  |
    | Assistant | Q2 Financial Report for AcmeCorp Investors<br /><br />Dear Valued Investors,<br /><br />I am pleased to present our Q2 financial report, showcasing AcmeCorp's continued growth and resilience in the B2B SaaS market.<br /><br />1. Revenue Growth:<br />Our Q2 revenue reached \$15.2M, a 22% YoY increase. This growth is primarily driven by a 30% expansion in our enterprise client base. However, our SMB segment saw a slight decline of 5%, which we aim to address through targeted marketing initiatives in Q3.<br /><br />2. Profit Margins:<br />Gross margin improved to 72% (up 3% from Q1) due to infrastructure optimizations. EBITDA margin, however, dipped to 18% (down 2%) as we invested heavily in R\&D for our upcoming AI-driven features.<br /><br />3. Cash Flow:<br />Operating cash flow remains strong at \$4.1M. Our cash reserves stand at \$28M, providing a 15-month runway at current burn rate. We did see a 20% increase in customer acquisition costs, which we're addressing through more efficient sales strategies.<br /><br />In summary, AcmeCorp's core financials remain robust. We're balancing growth investments with prudent cash management. Our focus for Q3 will be revitalizing SMB growth and optimizing sales efficiency.<br /><br />Thank you for your continued trust.<br /><br />Sincerely,<br />CFO, AcmeCorp | Q2 Financial Report for AcmeCorp Investors\</output><br /><br />Revenue Growth:<br />- Q2 revenue: \$15.2M (22% YoY ↑)<br />- Enterprise clients: 30% ↑<br />- SMB segment: 5% ↓<br />  Action: Targeted Q3 marketing<br /><br />Profit Margins:<br />- Gross margin: 72% (3% ↑ from Q1)<br />  Reason: Infrastructure optimizations<br />- EBITDA margin: 18% (2% ↓)<br />  Reason: R\&D investment in AI features<br /><br />Cash Flow:<br />- Operating cash flow: \$4.1M (strong)<br />- Cash reserves: \$28M (15-month runway)<br />- Customer acquisition cost: 20% ↑<br />  Action: Optimize sales strategies<br /><br />Outlook:<br />- Core financials: Robust<br />- Q3 focus: Revitalize SMB, optimize sales<br /><br />Management remains committed to balancing growth investments with financial discipline. |

  </Accordion>

  <Accordion title="Example: Legal contract analysis">
    Without XML tags, Claude's analysis is disorganized and misses key points. With tags, it provides a structured, thorough analysis that a legal team can act on.

    | Role      | No XML Tags                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | With XML Tags                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | User      | Analyze this software licensing agreement for potential risks and liabilities: \{\{CONTRACT}}. Focus on indemnification, limitation of liability, and IP ownership clauses. Also, note any unusual or concerning terms. Here's our standard contract for reference: \{\{STANDARD\_CONTRACT}}. Give a summary of findings and recommendations for our legal team.                                                                                                                                                                                                                                                                                                                    | Analyze this software licensing agreement for legal risks and liabilities.<br /><br />We're a multinational enterprise considering this agreement for our core data infrastructure.<br /><br />\<agreement><br />\{\{CONTRACT}}\</agreement><br /><br />This is our standard contract for reference:<br />\<standard\_contract>\{\{STANDARD\_CONTRACT}}\</standard\_contract><br /><br />\<instructions><br />1. Analyze these clauses:<br />   - Indemnification<br />   - Limitation of liability<br />   - IP ownership<br /><br />2. Note unusual or concerning terms.<br /><br />3. Compare to our standard contract.<br /><br />4. Summarize findings in \<findings> tags.<br /><br />5. List actionable recommendations in \<recommendations> tags.\</instructions>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | Assistant | The provided software licensing agreement presents several concerning aspects. The indemnification clause is overly broad, potentially exposing us to significant liabilities. The limitation of liability section caps damages at a mere \$500, which is inadequate for our enterprise-level usage. Regarding IP, the agreement grants the vendor joint ownership of any modifications or integrations we create.<br /><br />In summary, this agreement is not in our best interest. It exposes us to undue risk, limits our recourse in case of failures, and compromises our intellectual property rights. I recommend renegotiating these terms or seeking alternative vendors. | \<findings><br />1. Indemnification (Clause 8):<br />   - Issue: Overly broad. We indemnify vendor against "any and all claims" arising from our use.<br />   - Risk: Could hold us liable even for vendor's negligence or product defects.<br />   - Deviation: Our standard limits indemnity to claims arising from our violation of agreement.<br /><br />2. Limitation of Liability (Clause 9):<br />   - Issue: Caps all damages at \$500, including direct damages.<br />   - Risk: Grossly inadequate for enterprise use. A critical failure could cost millions.<br />   - Deviation: Our standard allows for direct damages up to 12 months of fees paid.<br /><br />3. IP Ownership (Clause 12):<br />   - Issue: Grants vendor joint ownership of our modifications/integrations.<br />   - Risk: Vendor could use or sell our proprietary algorithms or data insights.<br />   - Deviation: Our standard retains full ownership of our work.<br /><br />4. Unusual Terms:<br />   - Clause 5.3: Vendor can use our usage data for "any purpose."<br />   - Clause 7.2: Vendor can terminate for "convenience" with only 7 days' notice.<br />   - Clause 11: No warranties of any kind, even for basic merchantability.<br />\</findings><br /><br />\<recommendations><br />1. Reject this agreement. Risks far outweigh benefits for an enterprise.<br />2. Counter-propose:<br />   - Indemnification: Limit to claims arising from our violation of agreement.<br />   - Liability: Cap at 12 months' fees for direct damages; negotiate for indirect.<br />   - IP: Full ownership of our modifications/integrations.<br />   - Data Use: Restrict to service improvement only.<br />   - Termination: Minimum 90 days' notice; only for cause.<br />   - Warranties: Demand basic merchantability and fitness for purpose.<br />3. If vendor refuses, explore alternative providers or in-house solutions.<br />4. Engage legal counsel for contract negotiation given high stakes.<br />\</recommendations> |

  </Accordion>
</AccordionGroup>

---

<CardGroup cols={3}>
  <Card title="Prompt library" icon="link" href="/en/prompt-library/library">
    Get inspired by a curated selection of prompts for various tasks and use cases.
  </Card>

  <Card title="GitHub prompting tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    An example-filled tutorial that covers the prompt engineering concepts found in our docs.
  </Card>

  <Card title="Google Sheets prompting tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    A lighter weight version of our prompt engineering tutorial via an interactive spreadsheet.
  </Card>
</CardGroup>

### 5. Give Claude a Role with a System Prompt

<Note>
  While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

When using Claude, you can dramatically improve its performance by using the `system` parameter to give it a role. This technique, known as role prompting, is the most powerful way to use system prompts with Claude.

The right role can turn Claude from a general assistant into your virtual domain expert!

<Tip>**System prompt tips**: Use the `system` parameter to set Claude's role. Put everything else, like task-specific instructions, in the `user` turn instead.</Tip>

#### Why use role prompting?

- **Enhanced accuracy:** In complex scenarios like legal analysis or financial modeling, role prompting can significantly boost Claude's performance.
- **Tailored tone:** Whether you need a CFO's brevity or a copywriter's flair, role prompting adjusts Claude's communication style.
- **Improved focus:** By setting the role context, Claude stays more within the bounds of your task's specific requirements.

#### How to give Claude a role

Use the `system` parameter in the [Messages API](/en/api/messages) to set Claude's role:

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

<Tip>**Role prompting tip**: Experiment with roles! A `data scientist` might see different insights than a `marketing strategist` for the same data. A `data scientist specializing in customer insight analysis for Fortune 500 companies` might yield different results still!</Tip>

#### Examples

##### Example 1: Legal contract analysis

Without a role, Claude might miss critical issues:

<Accordion title="Legal contract analysis without role prompting">
  | Role      | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
  | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | User      | Analyze this software licensing agreement for potential risks:<br />\<contract><br />\{\{CONTRACT}}<br />\</contract><br /><br />Focus on indemnification, liability, and IP ownership.                                                                                                                                                                                                                                                                                                                              |
  | Assistant | Here's a summary of the key points in the software licensing agreement:<br /><br />1. Indemnification (Section 8):<br />   - We indemnify the vendor against claims arising from our use.<br /><br />2. Limitation of Liability (Section 9):<br />   - Damages capped at \$500.<br /><br />3. IP Ownership (Section 12):<br />   - We retain ownership of our modifications.<br /><br />Overall, the agreement seems standard. The indemnification and liability clauses are typical, and we maintain our IP rights. |
</Accordion>

With a role, Claude catches critical issues that could cost millions:

<Accordion title="Legal contract analysis with role prompting">
  | Role      | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
  | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | User      | You are the General Counsel of a Fortune 500 tech company. We're considering this software licensing agreement for our core data infrastructure:<br />\<contract><br />\{\{CONTRACT}}<br />\</contract><br /><br />Analyze it for potential risks, focusing on indemnification, liability, and IP ownership. Give your professional opinion.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
  | Assistant | I've reviewed the software licensing agreement, and I have serious concerns that could expose our company to significant risks:<br /><br />1. Indemnification (Section 8):<br />   - Critical Issue: We indemnify the vendor against "any and all claims" arising from our use.<br />   - Risk: This could hold us liable even for the vendor's negligence or product defects.<br />   - Recommendation: Reject. Limit our indemnity to claims arising from our violation of the agreement.<br /><br />2. Limitation of Liability (Section 9):<br />   - Critical Issue: Damages capped at \$500, including direct damages.<br />   - Risk: Grossly inadequate. A critical failure in our data infrastructure could cost us millions in lost revenue and reputational damage.<br />   - Recommendation: Reject. Negotiate for cap at 12 months of fees for direct damages, and carve-outs for data breaches.<br /><br />3. IP Ownership (Section 12):<br />   - Critical Issue: Vendor gains joint ownership of our modifications and integrations.<br />   - Risk: They could use or sell our proprietary algorithms or data insights to competitors.<br />   - Recommendation: Reject. We must retain full ownership of our work.<br /><br />Professional Opinion: Do not sign this agreement. It is grossly unfavorable and exposes us to unacceptable levels of risk. If the vendor refuses to renegotiate these terms, I strongly advise exploring alternative providers or accelerating our in-house solution. The potential costs of proceeding with this agreement far outweigh any short-term gains. |
</Accordion>

##### Example 2: Financial analysis

Without a role, Claude's analysis lacks depth:

<Accordion title="Financial analysis without role prompting">
  | Role      | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
  | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | User      | Analyze this dataset of our Q2 financials:<br />\<data><br />\{\{FINANCIALS}}<br />\</data><br /><br />Highlight key trends and recommend actions.                                                                                                                                                                                                                                                                                                                               |
  | Assistant | Here's a summary of your Q2 financials:<br /><br />1. Revenue: \$15.2M, up 22% YoY. Enterprise client base grew 30%.<br />2. Gross Margin: 72%, up 3% from Q1.<br />3. EBITDA Margin: 18%, down 2% due to R\&D investments.<br />4. Cash Flow: \$4.1M operating, \$28M in reserves.<br /><br />Overall, financials look strong with revenue growth and healthy margins. Increased R\&D spending is impacting profitability but could pay off long-term. Maintain current course. |
</Accordion>

With a role, Claude delivers actionable insights:

<Accordion title="Financial analysis with role prompting">
  | Role      | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
  | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | User      | You are the CFO of a high-growth B2B SaaS company. We're in a board meeting discussing our Q2 financials:<br />\<data><br />\{\{FINANCIALS}}<br />\</data><br /><br />Analyze key trends, flag concerns, and recommend strategic actions. Our investors want aggressive growth but are wary of our burn rate.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
  | Assistant | Board members, here's my analysis of our Q2 financials:<br /><br />1. Revenue (\$15.2M, +22% YoY):<br />   - Insight: Enterprise growth (+30%) is outpacing overall growth.<br />   - Flag: SMB segment declined 5%.<br />   - Action: Reallocate 20% of SMB marketing budget to enterprise sales. Task product to simplify SMB onboarding.<br /><br />2. Margins (Gross: 72%, +3% QoQ; EBITDA: 18%, -2% QoQ):<br />   - Insight: Infrastructure optimizations boosted gross margins.<br />   - Flag: R\&D spend on AI features dented EBITDA.<br />   - Action: No change. Our AI roadmap is critical for enterprise stickiness.<br /><br />3. Cash (\$4.1M OCF, \$28M reserves):<br />   - Insight: 15-month runway at current burn.<br />   - Flag: CAC up 20%, eroding LTV/CAC.<br />   - Action: Freeze non-essential hires. Implement sales funnel analytics to cut CAC by 15% in Q3.<br /><br />Strategic Stance: We're threading the needle between growth and burn. Enterprise focus is our growth engine—invest there. But watch SMB churn; it could bleed into enterprise. Our AI bet is sound, but we must convert it to ARR by Q4, or we cut R\&D by 30%.<br /><br />In sum: Double down on enterprise, streamline SMB, optimize sales, and monetize AI. Questions? |
</Accordion>

---

<CardGroup cols={3}>
  <Card title="Prompt library" icon="link" href="/en/prompt-library/library">
    Get inspired by a curated selection of prompts for various tasks and use cases.
  </Card>

  <Card title="GitHub prompting tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    An example-filled tutorial that covers the prompt engineering concepts found in our docs.
  </Card>

  <Card title="Google Sheets prompting tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    A lighter weight version of our prompt engineering tutorial via an interactive spreadsheet.
  </Card>
</CardGroup>

### 6. Chain Complex Prompts for Stronger Performance

<Note>
  While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

When working with complex tasks, Claude can sometimes drop the ball if you try to handle everything in a single prompt. Chain of thought (CoT) prompting is great, but what if your task has multiple distinct steps that each require in-depth thought?

Enter prompt chaining: breaking down complex tasks into smaller, manageable subtasks.

#### Why chain prompts?

1. **Accuracy**: Each subtask gets Claude's full attention, reducing errors.
2. **Clarity**: Simpler subtasks mean clearer instructions and outputs.
3. **Traceability**: Easily pinpoint and fix issues in your prompt chain.

#### When to chain prompts

Use prompt chaining for multi-step tasks like research synthesis, document analysis, or iterative content creation. When a task involves multiple transformations, citations, or instructions, chaining prevents Claude from dropping or mishandling steps.

**Remember:** Each link in the chain gets Claude's full attention!

<Tip>**Debugging tip**: If Claude misses a step or performs poorly, isolate that step in its own prompt. This lets you fine-tune problematic steps without redoing the entire task.</Tip>

#### How to chain prompts

1. **Identify subtasks**: Break your task into distinct, sequential steps.
2. **Structure with XML for clear handoffs**: Use XML tags to pass outputs between prompts.
3. **Have a single-task goal**: Each subtask should have a single, clear objective.
4. **Iterate**: Refine subtasks based on Claude's performance.

##### Example chained workflows:

- **Multi-step analysis**: See the legal and business examples below.
- **Content creation pipelines**: Research → Outline → Draft → Edit → Format.
- **Data processing**: Extract → Transform → Analyze → Visualize.
- **Decision-making**: Gather info → List options → Analyze each → Recommend.
- **Verification loops**: Generate content → Review → Refine → Re-review.

<Tip>**Optimization tip**: For tasks with independent subtasks (like analyzing multiple docs), create separate prompts and run them in parallel for speed.</Tip>

##### Prompt Folding & Dynamic Generation

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

##### Advanced: Self-correction chains

You can chain prompts to have Claude review its own work! This catches errors and refines outputs, especially for high-stakes tasks.

<AccordionGroup>
  <Accordion title="Example: Self-correcting research summary">
    #### Prompt 1

    | Role                         | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
    | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | User                         | Summarize this medical research paper.<br /><br />\<paper>\{\{RESEARCH\_PAPER}}\</paper><br /><br />Focus on methodology, findings, and clinical implications.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | Assistant<br />\{\{SUMMARY}} | Methodology: Double-blind RCT with 500 Type 2 diabetes patients. Group A (n=250) received novel GLP-1/GIP dual agonist; Group B (n=250) received standard GLP-1 agonist. 24-week trial, primary endpoint: HbA1c reduction.<br /><br />Findings:<br />- Group A: 1.8% mean HbA1c reduction<br />- Group B: 1.1% mean HbA1c reduction<br />- 68% of Group A vs. 52% of Group B achieved HbA1c \<7%<br />- Group A: 5.2kg mean weight loss<br />- Group B: 3.1kg mean weight loss<br /><br />Safety: Similar adverse event profiles, no serious events attributed to treatment.<br /><br />Clinical Implications: Dual agonist shows superior glycemic control and weight loss compared to standard therapy. Could be a game-changer, especially for obese diabetics. |

    #### Prompt 2

    | Role                          | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User                          | Your task is to provide feedback on a research paper summary. Here is a summary of a medical research paper:<br />\<summary><br />\{\{SUMMARY}}<br />\</summary><br /><br />Here is the research paper:<br />\<paper><br />\{\{RESEARCH\_PAPER}}<br />\</paper><br /><br />Review this summary for accuracy, clarity, and completeness on a graded A-F scale.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | Assistant<br />\{\{FEEDBACK}} | 1. Accuracy: A<br />   - Correctly reported key stats: HbA1c reductions, weight loss.<br />   - Accurately noted safety profile and lack of serious adverse events.<br />   - Assertion of "game-changer" is justified by significantly better outcomes.<br /><br />2. Clarity: A-<br />   - Concise and well-structured with clear sections.<br />   - Good use of comparative language (e.g., "up 3% from Q1") for context.<br />   - Minor issue: Acronyms like "RCT," "GLP-1," and "GIP" not defined. Consider spelling out first use.<br /><br />3. Completeness: B+<br />   - Covers all requested areas: methodology, findings, clinical implications.<br />   - Missing: Baseline characteristics of groups (were they well-matched?).<br />   - Missing: Any secondary endpoints (e.g., blood pressure, lipids).<br />   - Consider: Long-term implications or need for further research.<br /><br />Overall, the summary is accurate and clear, providing key insights for a quick grasp of the study. To elevate to A+, define acronyms, mention group baseline stats, note any secondary outcomes, and briefly touch on the need for long-term studies. |

    #### Prompt 3

    | Role      | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User      | Your task is to improve a paper summary given feedback. Here is the first draft of a medical research paper:<br />\<summary><br />\{\{SUMMARY}}<br />\</summary><br /><br />Here is the research paper:<br />\<paper><br />\{\{RESEARCH\_PAPER}}<br />\</paper><br /><br />Here is the feedback:<br />\<feedback><br />\{\{FEEDBACK}}<br />\</feedback><br /><br />Update the summary based on the feedback.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | Assistant | Methodology: Double-blind randomized controlled trial (RCT) with 500 Type 2 diabetes patients. Group A (n=250) received a novel glucagon-like peptide-1/glucose-dependent insulinotropic polypeptide (GLP-1/GIP) dual agonist; Group B (n=250) received a standard GLP-1 agonist. The 24-week trial's primary endpoint was HbA1c reduction. Groups were well-matched for age, BMI, and baseline HbA1c.<br /><br />Findings:<br />- Group A: 1.8% mean HbA1c reduction<br />- Group B: 1.1% mean HbA1c reduction<br />- 68% of Group A vs. 52% of Group B achieved HbA1c \<7%<br />- Group A: 5.2kg mean weight loss<br />- Group B: 3.1kg mean weight loss<br /><br />Secondary endpoints showed improvements in blood pressure and lipid profiles for both groups, with Group A showing slightly better results.<br /><br />Safety: Similar adverse event profiles, with no serious events attributed to either treatment.<br /><br />Clinical Implications: The dual GLP-1/GIP agonist demonstrates superior glycemic control and weight loss compared to standard GLP-1 therapy. These results suggest it could be a significant advancement, particularly for obese diabetics. However, longer-term studies are needed to confirm sustained efficacy and safety, as well as to investigate potential benefits on cardiovascular outcomes. |

  </Accordion>
</AccordionGroup>

#### Examples

<AccordionGroup>
  <Accordion title="Example: Analyzing a legal contract (without chaining)">
    Note that Claude misses the instruction to provide proposed changes in its email draft.

    | Role      | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User      | You're our Chief Legal Officer. Review this SaaS contract for risks, focusing on data privacy, SLAs, and liability caps.<br /><br />\<contract><br />\{\{CONTRACT}}<br />\</contract><br /><br />Then draft an email to the vendor with your concerns and proposed changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
    | Assistant | After reviewing the SaaS contract, I've identified several concerns:<br /><br />1. Data Privacy (Section 7):<br />   - Issue: Vendor has broad rights to use client data for "service improvement."<br />   - Risk: Could lead to unauthorized data sharing or monetization.<br /><br />2. SLAs (Section 5):<br />   - Issue: 99.5% uptime guarantee is below industry standard.<br />   - Risk: Excessive downtime could impact our operations.<br /><br />3. Liability (Section 9):<br />   - Issue: Cap set at 3 months of fees.<br />   - Risk: Inadequate for potential data breaches or service failures.<br /><br />Draft email:<br /><br />Dear \{\{VENDOR}},<br /><br />After reviewing the SaaS agreement, we have concerns:<br /><br />1. Data Privacy: We require that our data only be used for direct service provision, not broad "service improvement." Please amend Section 7.<br /><br />2. SLAs: 99.5% uptime is insufficient. We need 99.99% with clearly defined penalties. Please revise Section 5.<br /><br />3. Liability: The current cap of 3 months' fees is inadequate. We propose a cap of 12 months' fees, with no cap for data breaches or willful misconduct.<br /><br />We value our potential partnership and believe these changes will set us up for success. Please send a revised agreement.<br /><br />Best regards,<br />\{\{CLO\_NAME}} |

  </Accordion>

  <Accordion title="Example: Analyzing a legal contract (with chaining)">
    #### Prompt 1

    | Role                          | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User                          | You're our Chief Legal Officer. Review this SaaS contract for risks, focusing on data privacy, SLAs, and liability caps.<br /><br />\<contract><br />\{\{CONTRACT}}<br />\</contract><br /><br />Output your findings in \<risks> tags.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | Assistant<br />\{\{CONCERNS}} | 1. Data Privacy (Section 7):<br />   - Issue: Vendor has broad rights to use client data for "service improvement."<br />   - Risk: Could lead to unauthorized data sharing or monetization of client data.<br />   - Impact: Potential breach of client trust, regulatory fines (GDPR, CCPA).<br /><br />2. SLAs (Section 5):<br />   - Issue: 99.5% uptime guarantee is below industry standard (typically 99.99%).<br />   - Risk: Up to 43.8 hours of downtime per year vs. 52.6 minutes at 99.99%.<br />   - Impact: Operational disruptions, revenue loss, client dissatisfaction.<br /><br />3. Liability (Section 9):<br />   - Issue: Liability cap set at 3 months of fees.<br />   - Risk: Inadequate for potential data breaches, IP theft, or prolonged service failures.<br />   - Impact: Insufficient compensation for damages that could far exceed the cap, like class-action lawsuits or regulatory fines. |

    #### Prompt 2

    | Role                       | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User                       | Draft an email to a SaaS product vendor outlining the following concerns and proposing changes. Here are the concerns:<br />\<concerns><br />\{\{CONCERNS}}<br />\</concerns><br /><br />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | Assistant<br />\{\{EMAIL}} | Dear \{\{VENDOR}},<br /><br />After a thorough review of the proposed SaaS agreement, our legal team has identified several high-priority concerns that must be addressed before we can proceed:<br /><br />1. Data Privacy (Section 7):<br />   - Current: Broad rights to use client data for "service improvement."<br />   - Concern: Potential unauthorized data sharing or monetization.<br />   - Proposed Change: Limit data use to direct service provision. Any use for improvement, analytics, or marketing must be opt-in, revocable, and anonymized.<br /><br />2. SLAs (Section 5):<br />   - Current: 99.5% uptime guarantee.<br />   - Concern: Up to 43.8 hours of downtime per year, risking operational disruptions.<br />   - Proposed Change: 99.99% uptime with tiered service credits. E.g., 10% credit for \<99.99%, 25% for \<99.9%, 50% for \<99.5%.<br /><br />3. Liability (Section 9):<br />   - Current: Cap at 3 months of fees.<br />   - Concern: Grossly inadequate for data breaches, IP theft, or prolonged outages.<br />   - Proposed Change: 12 months' fees for general liability. Uncapped for data breaches, willful misconduct, IP infringement.<br /><br />These changes are non-negotiable for us. They align with industry standards and our commitment to data security, operational excellence, and fiduciary responsibility. We value the potential of our partnership, and addressing these will set a strong foundation.<br /><br />Please have your legal team review and incorporate these changes. We're happy to discuss further to ensure mutual understanding and agreement.<br /><br />Best regards,<br />\{\{CLO\_NAME}} |

    #### Prompt 3

    | Role      | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | User      | Your task is to review an email and provide feedback. Here is the email:<br />\<email><br />\{\{EMAIL}}<br />\</email><br /><br />Give feedback on tone, clarity, and professionalism.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | Assistant | 1. Tone:<br />   - Professional and assertive without being confrontational.<br />   - Use of "non-negotiable" is strong but justified given the criticality of the issues.<br />   - Collaborative language ("we value," "happy to discuss") balances the firmness, maintaining a constructive tone.<br /><br />2. Clarity:<br />   - Excellent structuring: Current state, concern, and proposed change for each issue.<br />   - Technical terms (e.g., "EBITDA," "tiered service credits") are appropriate for a B2B SaaS context.<br />   - Action items are clear: vendor's legal team to review and incorporate changes.<br /><br />3. Professionalism:<br />   - Focuses on mutual benefit and industry standards, not just our demands.<br />   - Mentions broader responsibilities (data security, operational excellence, fiduciary duty), elevating the discussion.<br />   - Offers further discussion, showing commitment to understanding and resolving issues.<br /><br />Overall, the email strikes the right balance of assertiveness and collaboration. It clearly articulates our concerns, proposes specific solutions, and maintains a professional, partnership-oriented tone. No revisions needed; proceed with sending. |

  </Accordion>

  <Accordion title="Example: Multitenancy strategy review">
    #### Prompt 1

    | Role                          | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User                          | As a senior solutions architect, review and analyze this multitenancy strategy for our new enterprise SaaS product.<br /><br />\<strategy><br />\{\{STRATEGY}}<br />\</strategy><br /><br />Focus on scalability, security, and cost-effectiveness.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | Assistant<br />\{\{ANALYSIS}} | 1. Scalability:<br />   + Database sharding by tenant reduces contention, supports high growth.<br />   + Microservices allow independent scaling of components.<br />   - Shared app servers could bottleneck under extreme load.<br />   - No mention of auto-scaling or load balancing for app tier.<br /><br />2. Security:<br />   + Tenant data isolation via sharding mitigates data leaks.<br />   + JWT with short expiry and refresh tokens is industry best practice.<br />   - No mention of encryption (at rest, in transit) or key management.<br />   - IAM strategy lacks detail on roles, permissions, or RBAC.<br /><br />3. Cost-effectiveness:<br />   + Shared app servers reduce idle resource costs.<br />   + Serverless functions for infrequent tasks optimize costs.<br />   - Per-tenant DB could increase costs at scale vs. optimized multi-tenant DB.<br />   - No discussion of reserved instances or spot instances for cost saving. |

    #### Prompt 2

    | Role                               | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
    | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | User                               | Draft a strategy review document for engineering leadership based on this analysis of a multitenancy strategy.<br /><br />\<strategy><br />\{\{STRATEGY}}<br />\</strategy><br /><br />\<analysis><br />\{\{ANALYSIS}}<br />\</analysis><br /><br />Include an executive summary, detailed analysis, and recommendations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
    | Assistant<br />\{\{STRATEGY\_DOC}} | # Multitenancy Strategy Review: SaaS Enterprise Product<br /><br />## Executive Summary<br />The proposed strategy demonstrates a solid foundation in scalability and security principles but has gaps in implementation details. It excels in data isolation and component-level scaling but lacks robust app-tier scaling and advanced security measures. Cost optimizations are present but may falter at high scale. With targeted enhancements, this strategy can effectively support our enterprise SaaS ambitions.<br /><br />## Detailed Analysis<br /><br />### 1. Scalability: B+<br /><br />Strengths:<br />- Database sharding by tenant is excellent. It minimizes query latency, supports high data growth, and facilitates seamless per-tenant scaling.<br />- Microservices architecture allows scaling individual components based on demand, crucial for handling diverse enterprise workloads.<br /><br />Weaknesses:<br />- Shared application servers risk becoming a bottleneck. As tenant count and traffic grow, these could degrade performance across all tenants.<br />- Absence of auto-scaling and load balancing for the app tier is a critical oversight. These are essential for handling traffic spikes without over-provisioning.<br /><br />### 2. Security: B-<br /><br />Strengths:<br />- Sharded databases provide strong tenant data isolation, mitigating risks of data leaks or unauthorized access between tenants.<br />- JWT with short expiry and refresh tokens align with OWASP best practices, reducing token vulnerability windows.<br /><br />Weaknesses:<br />- No mention of data encryption at rest or in transit (TLS 1.3). This is non-negotiable for enterprise data.<br />- Key management strategy is missing. How are encryption keys, JWT secrets, and DB credentials managed and rotated?<br />- IAM lacks depth. We need RBAC with well-defined roles, attribute-based access control (ABAC) for fine-grained permissions, and integration with enterprise identity providers (SAML, OIDC).<br /><br />### 3. Cost-effectiveness: B<br /><br />Strengths:<br />- Shared app servers reduce idle capacity costs, good for steady-state traffic.<br />- Serverless for infrequent tasks (e.g., reporting) is smart; pay only when these resources are used.<br /><br />Weaknesses:<br />- Per-tenant databases may not be cost-effective at scale compared to a well-designed multi-tenant database with robust data partitioning.<br />- No mention of cost-saving measures like reserved instances for predictable workloads or spot instances for fault-tolerant tasks.<br />- Lack of app-tier auto-scaling could lead to over-provisioning, increasing costs.<br /><br />## Recommendations<br /><br />1. **App Tier Resilience**: Implement auto-scaling with Kubernetes or cloud-native services (EKS, GKE). Deploy across availability zones with a CDN for static assets.<br /><br />2. **Security Hardening**:<br />   a. Encrypt data at rest (AES-256) and in transit (TLS 1.3).<br />   b. Use a managed KMS (AWS KMS, GCP KMS) for key management.<br />   c. Enhance IAM with RBAC, ABAC, and SAML/OIDC for enterprise SSO.<br /><br />3. **Cost Optimization**:<br />   a. Evaluate columnar multi-tenant DB (e.g., Snowflake) vs. sharding at scale.<br />   b. Use reserved instances for app servers, spot instances for non-critical workloads.<br />   c. Implement proactive monitoring and right-sizing to avoid overprovisioning.<br /><br />4. **Proof of Concept (PoC)**: Before full implementation, conduct a PoC with a high-scale simulation:<br />   a. Test sharded DB vs. optimized multi-tenant DB for cost and performance.<br />   b. Stress-test app tier with simulated enterprise-level traffic spikes.<br />   c. Conduct third-party security audit, focusing on data isolation and access controls.<br /><br />With these enhancements, our multi-tenancy strategy will be enterprise-grade: scalable, secure, and cost-effective. The PoC will validate our design choices and instill confidence in our enterprise clients. |

    #### Prompt 3

    | Role      | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User      | Grade this strategy review document for clarity, actionability, and alignment with enterprise priorities. <br /><br />\<priorities><br />\{\{PRIORITIES}}<br />\</priorities><br /><br />\<strategy\_doc><br />\{\{STRATEGY\_DOC}}<br />\</strategy\_doc>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | Assistant | 1. Clarity: A<br />   + Clear structure with Executive Summary, Detailed Analysis, and Recommendations.<br />   + Analysis uses a grading system (B+, B-) for quick grasp of strengths/weaknesses.<br />   + Technical terms (RBAC, ABAC, TLS) are explained or contextualized, aiding non-technical leadership.<br />   + Visual aids (bullet points, indentation) enhance readability.<br /><br />2. Actionability: A-<br />   + Recommendations are specific and technical (e.g., "Implement auto-scaling with Kubernetes").<br />   + PoC plan with clear objectives provides a roadmap.<br />   + Missing: Timelines, resource requirements, or team assignments for each recommendation.<br />   + Consider: Add a "Next Steps" section with immediate actions, roles, and a high-level timeline.<br /><br />3. Enterprise Alignment: A+<br />   + Directly addresses enterprise priorities:<br />     - Scalability: Discusses handling enterprise-level traffic spikes.<br />     - Security: Focuses on data isolation, encryption, and enterprise IAM.<br />     - Cost: Strategies align with enterprise FinOps (reserved instances, right-sizing).<br />   + PoC with "high-scale simulation" and security audit shows commitment to enterprise-grade quality.<br />   + Language resonates with enterprise concerns: "unacceptable risk," "enterprise-grade," "instill confidence."<br /><br />Overall, the document excels in clarity and enterprise alignment. The actionability is strong but could be elevated to A+ with a "Next Steps" section. The technical depth, coupled with clear explanations, makes this highly effective for both technical and non-technical leadership. Great work! |

  </Accordion>
</AccordionGroup>

---

<CardGroup cols={3}>
  <Card title="Prompt library" icon="link" href="/en/prompt-library/library">
    Get inspired by a curated selection of prompts for various tasks and use cases.
  </Card>

  <Card title="GitHub prompting tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    An example-filled tutorial that covers the prompt engineering concepts found in our docs.
  </Card>

  <Card title="Google Sheets prompting tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    A lighter weight version of our prompt engineering tutorial via an interactive spreadsheet.
  </Card>
</CardGroup>

### 7. Meta-Prompting: Let Claude Improve Your Prompts

One of the most powerful techniques is using Claude itself to help refine and improve your prompts. Claude understands its own capabilities and limitations, making it an excellent prompt engineering assistant.

#### How to Use Meta-Prompting

1. **Show Claude your current prompt** along with examples of good and bad outputs
2. **Ask Claude to critique the prompt** and identify areas for improvement  
3. **Request specific improvements** like "make this prompt more specific" or "add better examples"
4. **Iterate on the suggestions** to create increasingly effective prompts

#### Example Meta-Prompting Session

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

#### Benefits of Meta-Prompting

- **Leverages Claude's self-knowledge** about what works best
- **Saves time** compared to manual trial-and-error iteration
- **Reveals blind spots** you might not have considered
- **Creates prompt templates** that can be reused across similar tasks

### 8. Long Context Tips

<Note>
  While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Claude's extended context window (200K tokens for Claude 3 models) enables handling complex, data-rich tasks. This guide will help you leverage this power effectively.

#### Essential tips for long context prompts

- **Put longform data at the top**: Place your long documents and inputs (\~20K+ tokens) near the top of your prompt, above your query, instructions, and examples. This can significantly improve Claude's performance across all models.

  <Note>Queries at the end can improve response quality by up to 30% in tests, especially with complex, multi-document inputs.</Note>

- **Structure document content and metadata with XML tags**: When using multiple documents, wrap each document in `<document>` tags with `<document_content>` and `<source>` (and other metadata) subtags for clarity.

  <Accordion title="Example multi-document structure">
    ```xml
    <documents>
      <document index="1">
        <source>annual_report_2023.pdf</source>
        <document_content>
          {{ANNUAL_REPORT}}
        </document_content>
      </document>
      <document index="2">
        <source>competitor_analysis_q2.xlsx</source>
        <document_content>
          {{COMPETITOR_ANALYSIS}}
        </document_content>
      </document>
    </documents>

  Analyze the annual report and competitor analysis. Identify strategic advantages and recommend Q3 focus areas.

  ```
  </Accordion>

  ```

- **Ground responses in quotes**: For long document tasks, ask Claude to quote relevant parts of the documents first before carrying out its task. This helps Claude cut through the "noise" of the rest of the document's contents.

  <Accordion title="Example quote extraction">
    ```xml
    You are an AI physician's assistant. Your task is to help doctors diagnose possible patient illnesses.

    <documents>
      <document index="1">
        <source>patient_symptoms.txt</source>
        <document_content>
          {{PATIENT_SYMPTOMS}}
        </document_content>
      </document>
      <document index="2">
        <source>patient_records.txt</source>
        <document_content>
          {{PATIENT_RECORDS}}
        </document_content>
      </document>
      <document index="3">
        <source>patient01_appt_history.txt</source>
        <document_content>
          {{PATIENT01_APPOINTMENT_HISTORY}}
        </document_content>
      </document>
    </documents>

  Find quotes from the patient records and appointment history that are relevant to diagnosing the patient's reported symptoms. Place these in <quotes> tags. Then, based on these quotes, list all information that would help the doctor diagnose the patient's symptoms. Place your diagnostic information in <info> tags.

  ```
  </Accordion>
  ```

---

<CardGroup cols={3}>
  <Card title="Prompt library" icon="link" href="/en/prompt-library/library">
    Get inspired by a curated selection of prompts for various tasks and use cases.
  </Card>

  <Card title="GitHub prompting tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    An example-filled tutorial that covers the prompt engineering concepts found in our docs.
  </Card>

  <Card title="Google Sheets prompting tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    A lighter weight version of our prompt engineering tutorial via an interactive spreadsheet.
  </Card>
</CardGroup>

### 8. Extended Thinking Tips

export const TryInConsoleButton = ({userPrompt, systemPrompt, maxTokens, thinkingBudgetTokens, buttonVariant = "primary", children}) => {
const url = new URL("https://console.anthropic.com/workbench/new");
if (userPrompt) {
url.searchParams.set("user", userPrompt);
}
if (systemPrompt) {
url.searchParams.set("system", systemPrompt);
}
if (maxTokens) {
url.searchParams.set("max_tokens", maxTokens);
}
if (thinkingBudgetTokens) {
url.searchParams.set("thinking.budget_tokens", thinkingBudgetTokens);
}
return <a href={url.href} className={`btn size-xs ${buttonVariant}`} style={{
    margin: "-0.25rem -0.5rem"
  }}>
{children || "Try in Console"}{" "}
<Icon icon="arrow-right" color="currentColor" size={14} />
</a>;
};

This guide provides advanced strategies and techniques for getting the most out of Claude's extended thinking features. Extended thinking allows Claude to work through complex problems step-by-step, improving performance on difficult tasks.

See [Extended thinking models](/en/docs/about-claude/models/extended-thinking-models) for guidance on deciding when to use extended thinking.

#### Before diving in

This guide presumes that you have already decided to use extended thinking mode and have reviewed our basic steps on [how to get started with extended thinking](/en/docs/about-claude/models/extended-thinking-models#getting-started-with-extended-thinking-models) as well as our [extended thinking implementation guide](/en/docs/build-with-claude/extended-thinking).

##### Technical considerations for extended thinking

- Thinking tokens have a minimum budget of 1024 tokens. We recommend that you start with the minimum thinking budget and incrementally increase to adjust based on your needs and task complexity.
- For workloads where the optimal thinking budget is above 32K, we recommend that you use [batch processing](/en/docs/build-with-claude/batch-processing) to avoid networking issues. Requests pushing the model to think above 32K tokens causes long running requests that might run up against system timeouts and open connection limits.
- Extended thinking performs best in English, though final outputs can be in [any language Claude supports](/en/docs/build-with-claude/multilingual-support).
- If you need thinking below the minimum budget, we recommend using standard mode, with thinking turned off, with traditional chain-of-thought prompting with XML tags (like `<thinking>`). See [chain of thought prompting](/en/docs/build-with-claude/prompt-engineering/chain-of-thought).

#### Prompting techniques for extended thinking

##### Use general instructions first, then troubleshoot with more step-by-step instructions

Claude often performs better with high level instructions to just think deeply about a task rather than step-by-step prescriptive guidance. The model's creativity in approaching problems may exceed a human's ability to prescribe the optimal thinking process.

For example, instead of:

<CodeGroup>
  ```text User
  Think through this math problem step by step: 
  1. First, identify the variables
  2. Then, set up the equation
  3. Next, solve for x
  ...
  ```
</CodeGroup>

Consider:

<CodeGroup>
  ```text User
  Please think about this math problem thoroughly and in great detail. 
  Consider multiple approaches and show your complete reasoning.
  Try different methods if your first approach doesn't work.
  ```

<CodeBlock
filename={
<TryInConsoleButton
userPrompt={
`Please think about this math problem thoroughly and in great detail. 
Consider multiple approaches and show your complete reasoning.
Try different methods if your first approach doesn't work.`
}
thinkingBudgetTokens={16000}

>

    Try in Console

  </TryInConsoleButton>
}
  />
</CodeGroup>

That said, Claude can still effectively follow complex structured execution steps when needed. The model can handle even longer lists with more complex instructions than previous versions. We recommend that you start with more generalized instructions, then read Claude's thinking output and iterate to provide more specific instructions to steer its thinking from there.

##### Multishot prompting with extended thinking

[Multishot prompting](/en/docs/build-with-claude/prompt-engineering/multishot-prompting) works well with extended thinking. When you provide Claude examples of how to think through problems, it will follow similar reasoning patterns within its extended thinking blocks.

You can include few-shot examples in your prompt in extended thinking scenarios by using XML tags like `<thinking>` or `<scratchpad>` to indicate canonical patterns of extended thinking in those examples.

Claude will generalize the pattern to the formal extended thinking process. However, it's possible you'll get better results by giving Claude free rein to think in the way it deems best.

Example:

<CodeGroup>
  ```text User
  I'm going to show you how to solve a math problem, then I want you to solve a similar one.

Problem 1: What is 15% of 80?

  <thinking>
  To find 15% of 80:
  1. Convert 15% to a decimal: 15% = 0.15
  2. Multiply: 0.15 × 80 = 12
  </thinking>

The answer is 12.

Now solve this one:
Problem 2: What is 35% of 240?

````

<CodeBlock
  filename={
<TryInConsoleButton
  userPrompt={
    `I'm going to show you how to solve a math problem, then I want you to solve a similar one.

Problem 1: What is 15% of 80?

<thinking>
To find 15% of 80:
1. Convert 15% to a decimal: 15% = 0.15
2. Multiply: 0.15 × 80 = 12
</thinking>

The answer is 12.

Now solve this one:
Problem 2: What is 35% of 240?`
  }
  thinkingBudgetTokens={16000}
>
  Try in Console
</TryInConsoleButton>
}
/>
</CodeGroup>

##### Maximizing instruction following with extended thinking

Claude shows significantly improved instruction following when extended thinking is enabled. The model typically:

1. Reasons about instructions inside the extended thinking block
2. Executes those instructions in the response

To maximize instruction following:

* Be clear and specific about what you want
* For complex instructions, consider breaking them into numbered steps that Claude should work through methodically
* Allow Claude enough budget to process the instructions fully in its extended thinking

##### Using extended thinking to debug and steer Claude's behavior

You can use Claude's thinking output to debug Claude's logic, although this method is not always perfectly reliable.

To make the best use of this methodology, we recommend the following tips:

* We don't recommend passing Claude's extended thinking back in the user text block, as this doesn't improve performance and may actually degrade results.
* Prefilling extended thinking is explicitly not allowed, and manually changing the model's output text that follows its thinking block is likely going to degrade results due to model confusion.

When extended thinking is turned off, standard `assistant` response text [prefill](/en/docs/build-with-claude/prompt-engineering/prefill-claudes-response) is still allowed.

<Note>
Sometimes Claude may repeat its extended thinking in the assistant output text. If you want a clean response, instruct Claude not to repeat its extended thinking and to only output the answer.
</Note>

##### Making the best of long outputs and longform thinking

For dataset generation use cases, try prompts such as "Please create an extremely detailed table of..." for generating comprehensive datasets.

For use cases such as detailed content generation where you may want to generate longer extended thinking blocks and more detailed responses, try these tips:

* Increase both the maximum extended thinking length AND explicitly ask for longer outputs
* For very long outputs (20,000+ words), request a detailed outline with word counts down to the paragraph level. Then ask Claude to index its paragraphs to the outline and maintain the specified word counts

<Warning>
We do not recommend that you push Claude to output more tokens for outputting tokens' sake. Rather, we encourage you to start with a small thinking budget and increase as needed to find the optimal settings for your use case.
</Warning>

Here are example use cases where Claude excels due to longer extended thinking:

<AccordionGroup>
<Accordion title="Complex STEM problems">
  Complex STEM problems require Claude to build mental models, apply specialized knowledge, and work through sequential logical steps—processes that benefit from longer reasoning time.

  <Tabs>
    <Tab title="Standard prompt">
      <CodeGroup>
        ```text User
        Write a python script for a bouncing yellow ball within a square,
        make sure to handle collision detection properly.
        Make the square slowly rotate.
        ```

        <CodeBlock
          filename={
        <TryInConsoleButton
          userPrompt={
            `Write a python script for a bouncing yellow ball within a square,
make sure to handle collision detection properly.
Make the square slowly rotate.`
          }
          thinkingBudgetTokens={16000}
        >
          Try in Console
        </TryInConsoleButton>
      }
        />
      </CodeGroup>

      <Note>
        This simpler task typically results in only about a few seconds of thinking time.
      </Note>
    </Tab>

    <Tab title="Enhanced prompt">
      <CodeGroup>
        ```text User
        Write a Python script for a bouncing yellow ball within a tesseract,
        making sure to handle collision detection properly.
        Make the tesseract slowly rotate.
        Make sure the ball stays within the tesseract.
        ```

        <CodeBlock
          filename={
        <TryInConsoleButton
          userPrompt={
            `Write a Python script for a bouncing yellow ball within a tesseract,
making sure to handle collision detection properly.
Make the tesseract slowly rotate.
Make sure the ball stays within the tesseract.`
          }
          thinkingBudgetTokens={16000}
        >
          Try in Console
        </TryInConsoleButton>
      }
        />
      </CodeGroup>

      <Note>
        This complex 4D visualization challenge makes the best use of long extended thinking time as Claude works through the mathematical and programming complexity.
      </Note>
    </Tab>
  </Tabs>
</Accordion>

<Accordion title="Constraint optimization problems">
  Constraint optimization challenges Claude to satisfy multiple competing requirements simultaneously, which is best accomplished when allowing for long extended thinking time so that the model can methodically address each constraint.

  <Tabs>
    <Tab title="Standard prompt">
      <CodeGroup>
        ```text User
        Plan a week-long vacation to Japan.
        ```

        <CodeBlock
          filename={
        <TryInConsoleButton
          userPrompt="Plan a week-long vacation to Japan."
          thinkingBudgetTokens={16000}
        >
          Try in Console
        </TryInConsoleButton>
      }
        />
      </CodeGroup>

      <Note>
        This open-ended request typically results in only about a few seconds of thinking time.
      </Note>
    </Tab>

    <Tab title="Enhanced prompt">
      <CodeGroup>
        ```text User
        Plan a 7-day trip to Japan with the following constraints:
        - Budget of $2,500
        - Must include Tokyo and Kyoto
        - Need to accommodate a vegetarian diet
        - Preference for cultural experiences over shopping
        - Must include one day of hiking
        - No more than 2 hours of travel between locations per day
        - Need free time each afternoon for calls back home
        - Must avoid crowds where possible
        ```

        <CodeBlock
          filename={
        <TryInConsoleButton
          userPrompt={
            `Plan a 7-day trip to Japan with the following constraints:
- Budget of $2,500
- Must include Tokyo and Kyoto
- Need to accommodate a vegetarian diet
- Preference for cultural experiences over shopping
- Must include one day of hiking
- No more than 2 hours of travel between locations per day
- Need free time each afternoon for calls back home
- Must avoid crowds where possible`
          }
          thinkingBudgetTokens={16000}
        >
          Try in Console
        </TryInConsoleButton>
      }
        />
      </CodeGroup>

      <Note>
        With multiple constraints to balance, Claude will naturally perform best when given more space to think through how to satisfy all requirements optimally.
      </Note>
    </Tab>
  </Tabs>
</Accordion>

<Accordion title="Thinking frameworks">
  Structured thinking frameworks give Claude an explicit methodology to follow, which may work best when Claude is given long extended thinking space to follow each step.

  <Tabs>
    <Tab title="Standard prompt">
      <CodeGroup>
        ```text User
        Develop a comprehensive strategy for Microsoft
        entering the personalized medicine market by 2027.
        ```

        <CodeBlock
          filename={
        <TryInConsoleButton
          userPrompt={
            `Develop a comprehensive strategy for Microsoft
entering the personalized medicine market by 2027.`
          }
          thinkingBudgetTokens={16000}
        >
          Try in Console
        </TryInConsoleButton>
      }
        />
      </CodeGroup>

      <Note>
        This broad strategic question typically results in only about a few seconds of thinking time.
      </Note>
    </Tab>

    <Tab title="Enhanced prompt">
      <CodeGroup>
        ```text User
        Develop a comprehensive strategy for Microsoft entering
        the personalized medicine market by 2027.

        Begin with:
        1. A Blue Ocean Strategy canvas
        2. Apply Porter's Five Forces to identify competitive pressures

        Next, conduct a scenario planning exercise with four
        distinct futures based on regulatory and technological variables.

        For each scenario:
        - Develop strategic responses using the Ansoff Matrix

        Finally, apply the Three Horizons framework to:
        - Map the transition pathway
        - Identify potential disruptive innovations at each stage
        ```

        <CodeBlock
          filename={
        <TryInConsoleButton
          userPrompt={
            `Develop a comprehensive strategy for Microsoft entering
the personalized medicine market by 2027.

Begin with:
1. A Blue Ocean Strategy canvas
2. Apply Porter's Five Forces to identify competitive pressures

Next, conduct a scenario planning exercise with four
distinct futures based on regulatory and technological variables.

For each scenario:
- Develop strategic responses using the Ansoff Matrix

Finally, apply the Three Horizons framework to:
- Map the transition pathway
- Identify potential disruptive innovations at each stage`
          }
          thinkingBudgetTokens={16000}
        >
          Try in Console
        </TryInConsoleButton>
      }
        />
      </CodeGroup>

      <Note>
        By specifying multiple analytical frameworks that must be applied sequentially, thinking time naturally increases as Claude works through each framework methodically.
      </Note>
    </Tab>
  </Tabs>
</Accordion>
</AccordionGroup>

##### Have Claude reflect on and check its work for improved consistency and error handling

You can use simple natural language prompting to improve consistency and reduce errors:

1. Ask Claude to verify its work with a simple test before declaring a task complete
2. Instruct the model to analyze whether its previous step achieved the expected result
3. For coding tasks, ask Claude to run through test cases in its extended thinking

Example:

<CodeGroup>
```text User
Write a function to calculate the factorial of a number.
Before you finish, please verify your solution with test cases for:
- n=0
- n=1
- n=5
- n=10
And fix any issues you find.
````

<CodeBlock
filename={
<TryInConsoleButton
userPrompt={
`Write a function to calculate the factorial of a number.
Before you finish, please verify your solution with test cases for:

- n=0
- n=1
- n=5
- n=10
  And fix any issues you find.`
  }
  thinkingBudgetTokens={16000}
  >
      Try in Console
    </TryInConsoleButton>
  }
    />
  </CodeGroup>

#### Next steps

<CardGroup>
  <Card title="Extended thinking cookbook" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Explore practical examples of extended thinking in our cookbook.
  </Card>

  <Card title="Extended thinking guide" icon="code" href="/en/docs/build-with-claude/extended-thinking">
    See complete technical documentation for implementing extended thinking.
  </Card>
</CardGroup>

### Claude 4 Best Practices

Claude 4 models (Opus 4 and Sonnet 4) have been trained for more precise instruction following than previous generations.

### General Principles

#### Be explicit with your instructions

Claude 4 models respond well to clear, explicit instructions. Being specific about your desired output can help enhance results. Customers who desire the "above and beyond" behavior from previous Claude models might need to more explicitly request these behaviors with Claude 4.

<Accordion title="Example: Creating an analytics dashboard">
  **Less effective:**

```text
Create an analytics dashboard
```

**More effective:**

```text
Create an analytics dashboard. Include as many relevant features and interactions as possible. Go beyond the basics to create a fully-featured implementation.
```

</Accordion>

#### Add context to improve performance

Providing context or motivation behind your instructions, such as explaining to Claude why such behavior is important, can help Claude 4 better understand your goals and deliver more targeted responses.

<Accordion title="Example: Formatting preferences">
  **Less effective:**

```text
NEVER use ellipses
```

**More effective:**

```text
Your response will be read aloud by a text-to-speech engine, so never use ellipses since the text-to-speech engine will not know how to pronounce them.
```

</Accordion>

Claude is smart enough to generalize from the explanation.

#### Be vigilant with examples & details

Claude 4 models pay attention to details and examples as part of instruction following. Ensure that your examples align with the behaviors you want to encourage and minimize behaviors you want to avoid.

### Guidance for Specific Situations

#### Control the format of responses

There are a few ways that we have found to be particularly effective in steering output formatting in Claude 4 models:

1. **Tell Claude what to do instead of what not to do**

   - Instead of: "Do not use markdown in your response"
   - Try: "Your response should be composed of smoothly flowing prose paragraphs."

2. **Use XML format indicators**

   - Try: "Write the prose sections of your response in \<smoothly_flowing_prose_paragraphs> tags."

3. **Match your prompt style to the desired output**

   The formatting style used in your prompt may influence Claude's response style. If you are still experiencing steerability issues with output formatting, we recommend as best as you can matching your prompt style to your desired output style. For example, removing markdown from your prompt can reduce the volume of markdown in the output.

#### Leverage thinking & interleaved thinking capabilities

Claude 4 offers thinking capabilities that can be especially helpful for tasks involving reflection after tool use or complex multi-step reasoning. You can guide its initial or interleaved thinking for better results.

```text Example prompt
After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
```

<Info>
  For more information on thinking capabilities, see [Extended thinking](/en/docs/build-with-claude/extended-thinking).
</Info>

#### Optimize parallel tool calling

Claude 4 models excel at parallel tool execution. They have a high success rate in using parallel tool calling without any prompting to do so, but some minor prompting can boost this behavior to \~100% parallel tool use success rate. We have found this prompt to be most effective:

```text Sample prompt for agents
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

#### Reduce file creation in agentic coding

Claude 4 models may sometimes create new files for testing and iteration purposes, particularly when working with code. This approach allows Claude to use files, especially python scripts, as a 'temporary scratchpad' before saving its final output. Using temporary files can improve outcomes particularly for agentic coding use cases.

If you'd prefer to minimize net new file creation, you can instruct Claude to clean up after itself:

```text Sample prompt
If you create any temporary new files, scripts, or helper files for iteration, clean up these files by removing them at the end of the task.
```

#### Enhance visual and frontend code generation

For frontend code generation, you can steer Claude 4 models to create complex, detailed, and interactive designs by providing explicit encouragement:

```text Sample prompt
Don't hold back. Give it your all.
```

You can also improve Claude's frontend performance in specific areas by providing additional modifiers and details on what to focus on:

- "Include as many relevant features and interactions as possible"
- "Add thoughtful details like hover states, transitions, and micro-interactions"
- "Create an impressive demonstration showcasing web development capabilities"
- "Apply design principles: hierarchy, contrast, balance, and movement"

### Migration Considerations

When migrating from Sonnet 3.7 to Claude 4:

1. **Be specific about desired behavior**: Consider describing exactly what you'd like to see in the output.

2. **Frame your instructions with modifiers**: Adding modifiers that encourage Claude to increase the quality and detail of its output can help better shape Claude's performance. For example, instead of "Create an analytics dashboard", use "Create an analytics dashboard. Include as many relevant features and interactions as possible. Go beyond the basics to create a fully-featured implementation."

3. **Request specific features explicitly**: Animations and interactive elements should be requested explicitly when desired.

#### Model Personalities & Distillation Strategy

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

## Evaluation: Your Crown Jewels

While prompts are important, your evaluation suite (the set of test cases to measure prompt quality and performance) is often your most valuable intellectual property. Leading AI startups consider evals their secret weapon.

### Why Evaluations Matter

- **Objective measurement:** Know definitively whether a prompt change improves or degrades performance  
- **Iterative improvement:** Essential for knowing why a prompt works and for iterating effectively
- **Quality assurance:** Prevent regressions when updating prompts or switching models
- **Benchmarking:** Compare performance across different models or prompt variations

### Building Effective Evaluation Suites

1. **Diverse test cases:** Cover edge cases, typical scenarios, and failure modes
2. **Clear success criteria:** Define what "good" output looks like for each test case
3. **Automated scoring:** Where possible, use automated metrics (accuracy, format compliance, etc.)
4. **Human evaluation:** Include human judgment for nuanced tasks like tone, creativity, or ethical reasoning
5. **Representative data:** Use real-world data that matches your production use cases

### Evaluation-Driven Development

```
1. Define success metrics for your task
2. Create comprehensive test cases  
3. Baseline current prompt performance
4. Iterate on prompts using meta-prompting and other techniques
5. Run evaluations to measure improvement
6. Deploy only changes that improve eval scores
```

**Pro tip:** Start building your evaluation suite early, even before perfecting your prompts. The insights from systematic evaluation often reveal prompt improvement opportunities you wouldn't have discovered otherwise.

### Claude Code Workflows

#### Give Claude more tools

Claude has access to your shell environment, where you can build up sets of convenience scripts and functions for it just like you would for yourself. It can also leverage more complex tools through MCP and REST APIs.

#### a. Use Claude with bash tools

Claude Code inherits your bash environment, giving it access to all your tools. While Claude knows common utilities like unix tools and gh, it won't know about your custom bash tools without instructions:

- Tell Claude the tool name with usage examples
- Tell Claude to run --help to see tool documentation
- Document frequently used tools in CLAUDE.md

### Recommended Workflows

#### Recommended Workflows

**Research, Plan, Implement**

1. Ask Claude to read relevant files, images, or URLs, providing either general pointers ("read the file that handles logging") or specific filenames ("read logging.py"), but explicitly tell it not to write any code just yet.
2. This is the part of the workflow where you should consider strong use of subagents, especially for complex problems. Telling Claude to use subagents to verify details or investigate particular questions it might have, especially early on in a conversation or task, tends to preserve context availability without much downside in terms of lost efficiency.
3. Ask Claude to make a plan for how to approach a specific problem. We recommend using the word "think" to trigger extended thinking mode, which gives Claude additional computation time to evaluate alternatives more thoroughly. These specific phrases are mapped directly to increasing levels of thinking budget in the system: "think" < "think hard" < "think harder" < "ultrathink." Each level allocates progressively more thinking budget for Claude to use.
4. If the results of this step seem reasonable, you can have Claude create a document or a GitHub issue with its plan so that you can reset to this spot if the implementation (step 3) isn't what you want.
5. Ask Claude to implement its solution in code. This is also a good place to ask it to explicitly verify the reasonableness of its solution as it implements pieces of the solution.
6. Ask Claude to commit the result and create a pull request. If relevant, this is also a good time to have Claude update any READMEs or changelogs with an explanation of what it just did.

Steps #1-#2 are crucial—without them, Claude tends to jump straight to coding a solution. While sometimes that's what you want, asking Claude to research and plan first significantly improves performance for problems requiring deeper thinking upfront.

**Write tests, commit; code, iterate, commit**

This is an Anthropic-favorite workflow for changes that are easily verifiable with unit, integration, or end-to-end tests. Test-driven development (TDD) becomes even more powerful with agentic coding:

1. Ask Claude to write tests based on expected input/output pairs. Be explicit about the fact that you're doing test-driven development so that it avoids creating mock implementations, even for functionality that doesn't exist yet in the codebase.
2. Tell Claude to run the tests and confirm they fail. Explicitly telling it not to write any implementation code at this stage is often helpful.
3. Ask Claude to commit the tests when you're satisfied with them.
4. Ask Claude to write code that passes the tests, instructing it not to modify the tests. Tell Claude to keep going until all tests pass. It will usually take a few iterations for Claude to write code, run the tests, adjust the code, and run the tests again.
5. At this stage, it can help to ask it to verify with independent subagents that the implementation isn't overfitting to the tests
6. Ask Claude to commit the code once you're satisfied with the changes.

Claude performs best when it has a clear target to iterate against—a visual mock, a test case, or another kind of output. By providing expected outputs like tests, Claude can make changes, evaluate results, and incrementally improve until it succeeds.

**Write code, screenshot result, iterate**

Similar to the testing workflow, you can provide Claude with visual targets:

1. Give Claude a way to take browser screenshots (e.g., with the Puppeteer MCP server, an iOS simulator MCP server, or manually copy / paste screenshots into Claude).
2. Give Claude a visual mock by copying / pasting or drag-dropping an image, or giving Claude the image file path.
3. Ask Claude to implement the design in code, take screenshots of the result, and iterate until its result matches the mock.
4. Ask Claude to commit when you're satisfied.

Like humans, Claude's outputs tend to improve significantly with iteration. While the first version might be good, after 2-3 iterations it will typically look much better. Give Claude the tools to see its outputs for best results.

**Use Claude to interact with git**

Claude can effectively handle many git operations. Many Anthropic engineers use Claude for 90%+ of our git interactions:

- Searching git history to answer questions like "What changes made it into v1.2.3?", "Who owns this particular feature?", or "Why was this API designed this way?" It helps to explicitly prompt Claude to look through git history to answer queries like these.
- Writing commit messages. Claude will look at your changes and recent history automatically to compose a message taking all the relevant context into account
- Handling complex git operations like reverting files, resolving rebase conflicts, and comparing and grafting patches

**Use Claude to interact with GitHub**

Claude Code can manage many GitHub interactions:

- Creating pull requests: Claude understands the shorthand "pr" and will generate appropriate commit messages based on the diff and surrounding context.
- Implementing one-shot resolutions for simple code review comments: just tell it to fix comments on your PR (optionally, give it more specific instructions) and push back to the PR branch when it's done.
- Fixing failing builds or linter warnings
- Categorizing and triaging open issues by asking Claude to loop over open GitHub issues

This eliminates the need to remember gh command line syntax while automating routine tasks.

**Use Claude to work with Jupyter notebooks**

Researchers and data scientists at Anthropic use Claude Code to read and write Jupyter notebooks. Claude can interpret outputs, including images, providing a fast way to explore and interact with data. There are no required prompts or workflows, but a workflow we recommend is to have Claude Code and a .ipynb file open side-by-side in VS Code.

You can also ask Claude to clean up or make aesthetic improvements to your Jupyter notebook before you show it to colleagues. Specifically telling it to make the notebook or its data visualizations "aesthetically pleasing" tends to help remind it that it's optimizing for a human viewing experience.

#### Optimize Your Workflow

The suggestions below apply across all workflows:

**Be specific in your instructions**

Claude Code's success rate improves significantly with more specific instructions, especially on first attempts. Giving clear directions upfront reduces the need for course corrections later.

For example:

| Poor                                             | Good                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| add tests for foo.py                             | write a new test case for foo.py, covering the edge case where the user is logged out. avoid mocks                                                                                                                                                                                                                                                                                                                                                      |
| why does ExecutionFactory have such a weird api? | look through ExecutionFactory's git history and summarize how its api came to be                                                                                                                                                                                                                                                                                                                                                                        |
| add a calendar widget                            | look at how existing widgets are implemented on the home page to understand the patterns and specifically how code and interfaces are separated out. HotDogWidget.php is a good example to start with. then, follow the pattern to implement a new calendar widget that lets the user select a month and paginate forwards/backwards to pick a year. Build from scratch without libraries other than the ones already used in the rest of the codebase. |

Claude can infer intent, but it can't read minds. Specificity leads to better alignment with expectations.

**Give Claude images**

Claude excels with images and diagrams through several methods:

- Paste screenshots (pro tip: hit cmd+ctrl+shift+4 in macOS to screenshot to clipboard and ctrl+v to paste. Note that this is not cmd+v like you would usually use to paste on mac and does not work remotely.)
- Drag and drop images directly into the prompt input
- Provide file paths for images

This is particularly useful when working with design mocks as reference points for UI development, and visual charts for analysis and debugging. If you are not adding visuals to context, it can still be helpful to be clear with Claude about how important it is for the result to be visually appealing.

**Mention files you want Claude to look at or work on**

Use tab-completion to quickly reference files or folders anywhere in your repository, helping Claude find or update the right resources.

**Give Claude URLs**

Paste specific URLs alongside your prompts for Claude to fetch and read. To avoid permission prompts for the same domains (e.g., docs.foo.com), use /allowed-tools to add domains to your allowlist.

**Course correct early and often**

While auto-accept mode (shift+tab to toggle) lets Claude work autonomously, you'll typically get better results by being an active collaborator and guiding Claude's approach. You can get the best results by thoroughly explaining the task to Claude at the beginning, but you can also course correct Claude at any time.

These four tools help with course correction:

1. Ask Claude to make a plan before coding. Explicitly tell it not to code until you've confirmed its plan looks good.
2. Press Escape to interrupt Claude during any phase (thinking, tool calls, file edits), preserving context so you can redirect or expand instructions.
3. Double-tap Escape to jump back in history, edit a previous prompt, and explore a different direction. You can edit the prompt and repeat until you get the result you're looking for.
4. Ask Claude to undo changes, often in conjunction with option #2 to take a different approach.

Though Claude Code occasionally solves problems perfectly on the first attempt, using these correction tools generally produces better solutions faster.

**Use /clear to keep context focused**

During long sessions, Claude's context window can fill with irrelevant conversation, file contents, and commands. This can reduce performance and sometimes distract Claude. Use the /clear command frequently between tasks to reset the context window.

**Use checklists and scratchpads for complex workflows**

For large tasks with multiple steps or requiring exhaustive solutions—like code migrations, fixing numerous lint errors, or running complex build scripts—improve performance by having Claude use a Markdown file (or even a GitHub issue!) as a checklist and working scratchpad:

For example, to fix a large number of lint issues, you can do the following:

1. Tell Claude to run the lint command and write all resulting errors (with filenames and line numbers) to a Markdown checklist
2. Instruct Claude to address each issue one by one, fixing and verifying before checking it off and moving to the next

**Pass data into Claude**

Several methods exist for providing data to Claude:

- Copy and paste directly into your prompt (most common approach)
- Pipe into Claude Code (e.g., cat foo.txt | claude), particularly useful for logs, CSVs, and large data
- Tell Claude to pull data via bash commands, MCP tools, or custom slash commands
- Ask Claude to read files or fetch URLs (works for images too)

Most sessions involve a combination of these approaches. For example, you can pipe in a log file, then tell Claude to use a tool to pull in additional context to debug the logs.
