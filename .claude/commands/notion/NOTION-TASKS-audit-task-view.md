# Audit and Update Notion Task View

You are a productivity analyst helping to ensure task tracking accuracy. Your goal is to audit a Notion task view page by cross-referencing it with actual recent work activity across multiple platforms.

## Task Overview

<task_description>
Audit the Notion task view page to verify it accurately reflects current and recent work. Cross-reference with actual activity from GitHub PRs/issues, Slack messages, and standup updates from the past 5 days to identify discrepancies and suggest improvements.
</task_description>

## Step-by-Step Instructions

### 1. Planning Phase
Use the TodoWrite tool to create a comprehensive task plan with the following items:
- Fetch current Notion task view page content
- Retrieve recent GitHub activity (PRs and issues from past 5 days)
- Collect recent Slack messages from develop, frontend, and general channels
- Get recent standup updates from the Team Standup page
- Cross-reference all data sources for consistency
- Analyze discrepancies and outdated information
- Generate actionable recommendations for task view improvements

### 2. Data Collection Phase

<data_sources>
**Primary Sources:**
- Notion Task View: https://www.notion.so/drip-art/Christian-Task-View-19b6d73d365080708a8ffd326c0f9651
- Team Standup: https://www.notion.so/drip-art/Team-Standup-1419af591e2b47a4b88af01997f5e0fa

**Activity Sources:**
- GitHub: Recent PRs and issues (past 5 days)
- Slack: Messages in #develop, #frontend, #general channels (past 5 days)
</data_sources>

Execute the following data collection steps:

1. **Notion Data Collection:**
   - Use the Notion API to retrieve the current task view page content (read-only)
   - Use the Notion API to retrieve recent standup updates (read-only)
   - Extract current tasks, their status, priorities, and last update dates

2. **GitHub Activity Collection:**
   - Use `gh` commands to get recent PRs where you were involved (created, reviewed, commented)
   - Use `gh` commands to get recent issues where you participated
   - Focus on activity from the past 5 days
   - Extract PR/issue titles, status, and your involvement level

3. **Slack Activity Collection:**
   - Use Slack API to retrieve your recent messages from #develop, #frontend, #general
   - Focus on messages from the past 5 days
   - Extract key topics, projects mentioned, and work context

### 3. Cross-Reference Analysis

<analysis_framework>
Compare and analyze the collected data using these criteria:

**Completeness Check:**
- Are all active GitHub PRs/issues reflected in the task view?
- Are current work topics from Slack represented?
- Are standup commitments tracked as tasks?

**Accuracy Check:**
- Do task statuses match actual PR/issue states?
- Are task priorities aligned with recent activity levels?
- Are completed tasks properly marked as done?

**Currency Check:**
- Are there outdated tasks that should be archived?
- Are there new tasks that emerged from recent work?
- Are task descriptions current and relevant?
</analysis_framework>

### 4. Generate Recommendations

Provide specific, actionable recommendations in the following format:

<recommendations_structure>
**Tasks to Add:**
- List new tasks that should be created based on recent activity
- Include suggested priority levels and due dates

**Tasks to Update:**
- List existing tasks that need status or description updates
- Specify what changes should be made

**Tasks to Archive/Remove:**
- List outdated or completed tasks that should be cleaned up
- Explain why they're no longer relevant

**Process Improvements:**
- Suggest workflow improvements for keeping the task view current
- Recommend automation or reminder strategies
</recommendations_structure>

### 5. Output and Implementation Guidance

Since we have read-only access to Notion, provide recommendations in one of these formats:

**Option A: Markdown Report**
- Create a detailed markdown file with all findings and recommendations
- Include specific copy-paste instructions for Notion updates
- Format recommendations as actionable checklists

**Option B: Console Summary**
- Present findings directly in the console with clear sections
- Use formatting that's easy to reference while updating Notion manually

For each recommendation, provide:
- Specific text/content for Notion page updates
- Priority level (High/Medium/Low) for implementation
- Estimated time to complete the manual update
- Step-by-step instructions for making changes in Notion

## Success Criteria

A successful audit should result in:
- ✅ Complete inventory of current task view vs. actual activity
- ✅ Identification of all discrepancies and gaps
- ✅ Specific, actionable recommendations for improvements
- ✅ Clear implementation guidance with priorities
- ✅ Suggestions for maintaining accuracy going forward

## Important Notes

- Focus on the past 5 days for activity analysis
- Be thorough in cross-referencing - don't miss any platforms
- **We have read-only access to Notion** - provide recommendations as copy-paste instructions
- Prioritize recommendations based on impact on productivity
- Consider both immediate fixes and longer-term process improvements
- If any data source is inaccessible, clearly note this and work with available data
- Format output for easy manual implementation in Notion

Begin by using the TodoWrite tool to create your task plan, then proceed with systematic data collection and analysis.