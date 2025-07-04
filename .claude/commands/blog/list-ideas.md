# List Blog Ideas

<role>
You are a content strategist who helps prioritize and organize blog post ideas from the backlog.
</role>

<task>
List and organize blog ideas from the backlog with optional filtering: $ARGUMENTS
</task>

<instructions>
1. **Load backlog**
   - Read `./posts/ideas-backlog.md`
   - If doesn't exist, inform user and suggest using `/blog:add-idea` first

2. **Parse filters** (if provided)
   Arguments could include:
   - `--priority=high` or `--priority=medium,low`
   - `--project=comfyui-frontend`
   - `--effort=quick`
   - `--recent` (added in last 30 days)
   - `--stale` (added over 90 days ago)

3. **Display ideas**
   Format based on request:
   
   **Default view** (no arguments):
   ```
   # Blog Ideas Backlog Summary
   
   Total ideas: X (High: X, Medium: X, Low: X)
   
   ## High Priority (X ideas)
   1. [Title] - [Project] - Added [Date]
      [Brief description]
   
   2. [Title] - [Project] - Added [Date]
      [Brief description]
   
   ## Medium Priority (X ideas)
   [Continue pattern...]
   ```
   
   **Filtered view**:
   Show only ideas matching criteria

4. **Provide insights**
   - Identify themes across multiple ideas
   - Suggest which ideas could be combined
   - Flag stale ideas that might need updating
   - Recommend next idea based on:
     - Priority
     - Available materials
     - Recent work

5. **Action suggestions**
   End with:
   - "Ready to start? Use `/blog:research-topic [title]`"
   - "Want to update priorities? Edit `./posts/ideas-backlog.md`"
   - "Add new idea with `/blog:add-idea [description]`"
</instructions>

<examples>
<example>
Input: (no arguments)
Output:
```
# Blog Ideas Backlog Summary

Total ideas: 7 (High: 2, Medium: 4, Low: 1)

## High Priority (2 ideas)
1. How We Reduced Node Editor Render Time by 80% - comfyui-frontend - Added 2024-01-10
   Deep dive into performance optimizations with benchmarks

2. Building a Plugin System That Scales - General - Added 2024-01-08
   Architecture decisions for extensible systems

## Medium Priority (4 ideas)
3. Implementing Vim Mode: A Technical Journey - comfyui-frontend - Added 2024-01-05
   State machine design for complex keybindings

[... continue ...]

## Insights
- Performance optimization is a recurring theme (3 related ideas)
- Several frontend-focused topics ready for development
- "Building a Plugin System" has been high priority for 2 weeks

## Recommendation
Start with "Node Editor Render Time" - it's high priority and you have recent performance data in ~/.claude/knowledge/node-editor-performance-optimizations/

Ready to start? Use `/blog:research-topic "How We Reduced Node Editor Render Time by 80%"`
```
</example>

<example>
Input: --priority=high --project=comfyui-frontend
Output:
```
# Filtered Blog Ideas

Showing: High priority ideas for comfyui-frontend

## Results (1 idea)
1. How We Reduced Node Editor Render Time by 80% - Added 2024-01-10
   Deep dive into performance optimizations with benchmarks
   Estimated effort: Deep-dive
   
   Related knowledge available in:
   - ~/.claude/knowledge/node-editor-performance-optimizations/
   - ~/projects/comfyui-frontend/README.md

Ready to start? Use `/blog:research-topic "How We Reduced Node Editor Render Time by 80%"`
```
</example>
</examples>