Your task is to create an ultra-compact summary of our entire conversation with structured metadata. Follow these requirements exactly:

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

6. **Style Guidelines**:
   - Prefer lists over paragraphs
   - Use abbreviations where unambiguous
   - Combine related points into single lines
   - Include exact values/numbers/versions
   - Preserve technical accuracy while maximizing brevity

## Metadata Extraction Guidelines

When determining metadata values:

- **title**: Capture the main achievement or focus in 5-10 words
- **tags**: Extract key concepts, technologies, and domains (vue, typescript, testing, api, etc.)
- **project**: Look for project paths like `/projects/NAME/` or repository names
- **complexity**: 
  - low: Simple fixes, documentation, minor changes (<5 files, <1hr)
  - medium: Feature implementation, multi-file changes, integration work (5-15 files, 1-3hrs)
  - high: Architecture changes, complex debugging, system design (>15 files, >3hrs)
- **outcome**:
  - success: All tasks completed successfully
  - partial: Some tasks completed, some remaining
  - blocked: Hit significant obstacles preventing completion
- **duration**: Estimate based on conversation depth and complexity
- **technologies**: Include all languages, frameworks, tools, and libraries mentioned
- **key_files**: List the most important files created/modified (max 10)
- **decisions**: Capture architectural choices, approach decisions, trade-offs made

### Enhanced Metadata Fields

Also extract these additional fields for richer semantic matching:

- **problem_domain**: UI, backend, testing, database, infrastructure, documentation
- **patterns_used**: Design patterns or architectural patterns applied
  - Examples: "singleton", "observer", "mvc", "composables", "factory"
- **pain_points**: Challenges encountered during the session
  - Examples: "type conflicts", "circular dependencies", "performance issues"
- **user_preferences**: Observed preferences from user feedback
  - Examples: "prefers composition API", "likes detailed comments", "values type safety"
- **success_metrics**: What was achieved or improved
  - Examples: "reduced complexity", "improved performance", "added type safety"
- **follow_up_needed**: Any outstanding tasks or improvements identified
  - Examples: "add unit tests", "optimize performance", "update documentation"

### Example Enhanced Metadata

```yaml
---
title: "Implement Semantic Memory Search for Claude Code"
tags: [semantic-search, python, chromadb, memory-system, cli-tool]
project: "semantic-memory-system"
complexity: high
outcome: success
duration: "4h"
technologies: [python, chromadb, sentence-transformers, sqlite]
key_files:
  - scripts/memory_search.py
  - scripts/index_summaries.py
  - scripts/health_check.py
problem_domain: infrastructure
patterns_used: [singleton, factory, command-pattern]
pain_points:
  - "Initial ChromaDB setup complexity"
  - "Embedding model size"
user_preferences:
  - "Wants automatic memory search"
  - "Prefers shell script interfaces"
  - "Values comprehensive testing"
success_metrics:
  - "Semantic search with 70%+ accuracy"
  - "Sub-second search performance"
  - "100% test coverage"
follow_up_needed:
  - "Monitor search relevance over time"
  - "Consider vector DB alternatives"
decisions:
  - "Chose ChromaDB over SQLite-VSS for better docs"
  - "Used all-MiniLM-L6-v2 for balance of speed/quality"
  - "Implemented hybrid scoring algorithm"
---
```

## Execution Steps

1. Extract metadata from the conversation first
2. Ensure the target directory exists
3. Generate the timestamp (YYYY-MM-DD-HHMMSS format)
4. Determine the semantic description based on main conversation topics (3-7 words, kebab-case)
5. Combine into filename: `summary-[timestamp]-[semantic-description].md`
6. Check if the file already exists
7. If it exists, append `-v2`, `-v3`, etc. until finding an available name
8. Write the metadata header followed by the compact summary
9. Confirm successful creation with the final filepath

Remember: Your primary goal is information density WITH rich metadata for semantic search. The metadata enables better discovery while the summary provides quick reference.

$ARGUMENTS