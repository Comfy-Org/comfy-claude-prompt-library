# Optimization Tips

## Be specific in your instructions

Claude Code's success rate improves significantly with more specific instructions, especially on first attempts. Giving clear directions upfront reduces the need for course corrections later.

For example:

| Poor | Good |
| --- | --- |
| add tests for foo.py | write a new test case for foo.py, covering the edge case where the user is logged out. avoid mocks |
| why does ExecutionFactory have such a weird api? | look through ExecutionFactory's git history and summarize how its api came to be |
| add a calendar widget | look at how existing widgets are implemented on the home page to understand the patterns and specifically how code and interfaces are separated out. HotDogWidget.php is a good example to start with. then, follow the pattern to implement a new calendar widget that lets the user select a month and paginate forwards/backwards to pick a year. Build from scratch without libraries other than the ones already used in the rest of the codebase. |

Claude can infer intent, but it can't read minds. Specificity leads to better alignment with expectations.

## Give Claude images

Claude excels with images and diagrams through several methods:

- Paste screenshots (pro tip: hit cmd+ctrl+shift+4 in macOS to screenshot to clipboard and ctrl+v to paste. Note that this is not cmd+v like you would usually use to paste on mac and does not work remotely.)
- Drag and drop images directly into the prompt input
- Provide file paths for images

This is particularly useful when working with design mocks as reference points for UI development, and visual charts for analysis and debugging. If you are not adding visuals to context, it can still be helpful to be clear with Claude about how important it is for the result to be visually appealing.

## Mention files you want Claude to look at or work on

Use tab-completion to quickly reference files or folders anywhere in your repository, helping Claude find or update the right resources.

## Give Claude URLs

Paste specific URLs alongside your prompts for Claude to fetch and read. To avoid permission prompts for the same domains (e.g., docs.foo.com), use /allowed-tools to add domains to your allowlist.

## Course correct early and often

While auto-accept mode (shift+tab to toggle) lets Claude work autonomously, you'll typically get better results by being an active collaborator and guiding Claude's approach. You can get the best results by thoroughly explaining the task to Claude at the beginning, but you can also course correct Claude at any time.

These four tools help with course correction:

1. Ask Claude to make a plan before coding. Explicitly tell it not to code until you've confirmed its plan looks good.
2. Press Escape to interrupt Claude during any phase (thinking, tool calls, file edits), preserving context so you can redirect or expand instructions.
3. Double-tap Escape to jump back in history, edit a previous prompt, and explore a different direction. You can edit the prompt and repeat until you get the result you're looking for.
4. Ask Claude to undo changes, often in conjunction with option #2 to take a different approach.

Though Claude Code occasionally solves problems perfectly on the first attempt, using these correction tools generally produces better solutions faster.

## Use /clear to keep context focused

During long sessions, Claude's context window can fill with irrelevant conversation, file contents, and commands. This can reduce performance and sometimes distract Claude. Use the /clear command frequently between tasks to reset the context window.

## Use checklists and scratchpads for complex workflows

For large tasks with multiple steps or requiring exhaustive solutions—like code migrations, fixing numerous lint errors, or running complex build scripts—improve performance by having Claude use a Markdown file (or even a GitHub issue!) as a checklist and working scratchpad:

For example, to fix a large number of lint issues, you can do the following:

1. Tell Claude to run the lint command and write all resulting errors (with filenames and line numbers) to a Markdown checklist
2. Instruct Claude to address each issue one by one, fixing and verifying before checking it off and moving to the next

## Pass data into Claude

Several methods exist for providing data to Claude:

- Copy and paste directly into your prompt (most common approach)
- Pipe into Claude Code (e.g., cat foo.txt | claude), particularly useful for logs, CSVs, and large data
- Tell Claude to pull data via bash commands, MCP tools, or custom slash commands
- Ask Claude to read files or fetch URLs (works for images too)

Most sessions involve a combination of these approaches. For example, you can pipe in a log file, then tell Claude to use a tool to pull in additional context to debug the logs.

## Long Context Tips

Claude's extended context window (200K tokens for Claude 3 models) enables handling complex, data-rich tasks. This guide will help you leverage this power effectively.

### Essential tips for long context prompts

- **Put longform data at the top**: Place your long documents and inputs (~20K+ tokens) near the top of your prompt, above your query, instructions, and examples. This can significantly improve Claude's performance across all models.

  Queries at the end can improve response quality by up to 30% in tests, especially with complex, multi-document inputs.

- **Structure document content and metadata with XML tags**: When using multiple documents, wrap each document in `<document>` tags with `<document_content>` and `<source>` (and other metadata) subtags for clarity.

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

- **Ground responses in quotes**: For long document tasks, ask Claude to quote relevant parts of the documents first before carrying out its task. This helps Claude cut through the "noise" of the rest of the document's contents.

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
  </documents>

  Find quotes from the patient records that are relevant to diagnosing the patient's reported symptoms. Place these in <quotes> tags. Then, based on these quotes, list all information that would help the doctor diagnose the patient's symptoms. Place your diagnostic information in <info> tags.
  ```