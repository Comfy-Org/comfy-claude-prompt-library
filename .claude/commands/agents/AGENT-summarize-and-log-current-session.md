Your task is to create an ultra-compact summary of our entire conversation with structured metadata AND intelligently update knowledge folders when warranted. Follow these requirements exactly:

## Summary Requirements

1. **Metadata Header (YAML Frontmatter)**:
   ```yaml
   ---
   title: "Brief descriptive title (5-10 words)"
   tags: [keyword1, keyword2, keyword3, ...]  # 5-10 most relevant keywords
   project: "project-name"  # Extract from file paths if possible
   complexity: low|medium|high  # Based on scope and technical depth
   outcome: success|partial|blocked  # Task completion status
   duration: "Xh Ym"  # Estimate based on conversation length
   technologies: [tech1, tech2, ...]  # Languages, frameworks, tools used
   key_files: 
     - /path/to/important/file1
     - /path/to/important/file2
   decisions:
     - "Key technical decision made"
     - "Important approach chosen"
   ---
   ```

2. **Maximum Information Density**: Every sentence must convey multiple ideas. Eliminate all filler words, redundant phrases, and unnecessary transitions. Think of this as creating a reference card, not prose.

3. **Include All Critical Elements**:
   - Core topics/problems discussed
   - Exact absolute file paths mentioned or worked with
   - URLs/links referenced
   - Key decisions made
   - Solutions implemented
   - Commands executed
   - Errors encountered and resolutions

4. **Structure**:
   - Start with a one-line executive summary immediately after metadata
   - Group related items under ultra-brief headers
   - Use bullet points with extreme brevity
   - Include timestamp markers for chronological context if relevant

5. **File Handling**:
   - Save to: `~/.claude/compacted-summaries/`
   - Filename format: `summary-YYYY-MM-DD-HHMMSS-semantic-description.md`
     - Use current timestamp for YYYY-MM-DD-HHMMSS
     - Add a kebab-case semantic description of the main topics (3-7 words)
     - Example: `summary-2025-06-29-181658-comfyui-vue-widget-interfaces.md`
   - CRITICAL: First check if a file with the same name exists
   - If it exists, append `-v2`, `-v3`, etc. until you find an available filename
   - This is essential as multiple people may be writing to this folder simultaneously

## Knowledge Update Requirements

After creating the summary, evaluate if this conversation warrants updates to knowledge folders:

1. **Criteria for Knowledge Updates**:
   - New technical patterns or solutions discovered
   - Reusable code architectures or implementations
   - Important system behaviors or quirks documented
   - Best practices or anti-patterns identified
   - Complex problem-solving approaches that could help future tasks

2. **Knowledge Organization**:
   - Check existing knowledge folders in `~/.claude/knowledge/`
   - Create new topic folders if needed (kebab-case naming)
   - Update or create markdown files with clear, reusable documentation
   - Focus on generalizable patterns, not project-specific details

3. **Knowledge File Format**:
   ```markdown
   # [Clear Topic Title]

   ## Context
   Brief explanation of when/why this applies

   ## Solution/Pattern
   The actual reusable content

   ## Examples
   Concrete examples if helpful

   ## Related
   Links to other relevant knowledge files
   ```

## Examples of Extreme Brevity

**Good**: "Implemented Vue3 widget system: created BaseWidget.vue, integrated PrimeVue DataTable, fixed TypeScript prop validation errors, 47 files modified"

**Bad**: "We worked on implementing a widget system using Vue 3. Created a base widget component and integrated it with PrimeVue's DataTable component. Also fixed some TypeScript errors related to prop validation. Modified many files in the process."

## Execution

This should be run as an Agent when requested to summarize a conversation. Include both the summary creation AND knowledge updates if warranted.