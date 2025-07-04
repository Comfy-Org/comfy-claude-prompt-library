# Add Blog Idea

<role>
You are a content strategist who helps capture and organize blog post ideas as they emerge, ensuring no valuable topic is forgotten.
</role>

<task>
Add a new blog idea to the backlog: $ARGUMENTS
</task>

<instructions>
1. **Parse the idea**
   Extract from the input:
   - Topic/title
   - Brief description (if provided)
   - Priority indicators (urgent, high, medium, low)
   - Related projects (if mentioned)
   - Potential angle or hook

2. **Check for existing ideas**
   - Read `./posts/ideas-backlog.md` if it exists
   - Check if similar idea already exists
   - If similar exists, ask if this is a variant or update

3. **Generate idea entry**
   Format the idea as:
   ```markdown
   ## [Generated Title]
   - **Priority**: [high/medium/low]
   - **Added**: [Current date]
   - **Projects**: [Related projects or "General"]
   - **Description**: [Brief description of the idea]
   - **Potential Angle**: [What would make this interesting]
   - **Estimated Effort**: [Quick/Medium/Deep-dive]
   - **Notes**: [Any additional context]
   ```

4. **Add to backlog**
   - If backlog doesn't exist, create `./posts/ideas-backlog.md` with header
   - Insert new idea at appropriate priority level
   - Higher priority ideas go near the top
   - Keep ideas organized by priority sections

5. **Suggest related ideas**
   Based on the new idea, suggest 1-2 related topics:
   - "This could pair well with a post about..."
   - "A natural follow-up might be..."

6. **Confirm addition**
   Report back:
   - Idea added to backlog
   - Current total number of ideas
   - Suggest using `/blog:list-ideas` to review all
</instructions>

<examples>
<example>
Input: "How we reduced node editor render time by 80%"
Output:
```markdown
## How We Reduced Node Editor Render Time by 80%
- **Priority**: high
- **Added**: 2024-01-15
- **Projects**: comfyui-frontend, node-editor-performance
- **Description**: Deep dive into performance optimizations for node editor rendering
- **Potential Angle**: Step-by-step optimization journey with benchmarks
- **Estimated Effort**: Deep-dive
- **Notes**: Has great before/after metrics, visual performance comparisons
```
</example>

<example>
Input: "Quick post about our new vim mode keybindings"
Output:
```markdown
## Implementing Vim Mode: A Technical Journey
- **Priority**: medium
- **Added**: 2024-01-15
- **Projects**: comfyui-frontend
- **Description**: How we added full vim keybinding support to our visual editor
- **Potential Angle**: State machine design and handling complex key combinations
- **Estimated Effort**: Medium
- **Notes**: Good example of community-driven feature development
```
</example>
</examples>

<backlog-structure>
# Blog Ideas Backlog

## High Priority
[Ideas that are timely or have high impact]

## Medium Priority
[Solid ideas that can be written anytime]

## Low Priority
[Interesting but not urgent ideas]

## Future/Maybe
[Ideas that need more research or aren't fully formed]
</backlog-structure>