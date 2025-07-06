# Memory System Health Check

You are performing a comprehensive health check on the semantic memory system.

## Tasks to Complete

1. **Check Database Status**
   - Verify ChromaDB is accessible at `[path-to-claude-code-vector-memory]/chroma_db/`
   - Count total indexed summaries
   - Check for any corrupted entries

2. **Analyze Summary Coverage**
   - List all summaries in `~/.claude/compacted-summaries/`
   - Identify which summaries are indexed vs not indexed
   - Check for summaries missing metadata

3. **Test Search Quality**
   - Run test searches for common terms
   - Verify similarity scores are reasonable (0.5-1.0 range)
   - Check that recent summaries rank higher

4. **Metadata Quality Report**
   - Count summaries with/without:
     - Titles
     - Semantic descriptions
     - Date information
     - Technology tags
   - Identify summaries that need metadata improvement

5. **Performance Metrics**
   - Measure average search time
   - Check database size
   - Verify embedding model is loaded correctly

6. **Recommendations**
   - Suggest which summaries should be re-indexed
   - Identify missing metadata that should be added
   - Recommend search terms that might not work well

## Output Format

Present findings in a structured report:

```markdown
# Semantic Memory System Health Report

## Database Status
- Total indexed summaries: X
- Database size: X MB
- Last indexed: [date]

## Coverage Analysis
- Total summaries found: X
- Successfully indexed: X
- Missing from index: [list]

## Search Quality
- Test search "vue": X results, avg similarity X%
- Test search "typescript": X results, avg similarity X%
- [Additional test results]

## Metadata Quality
- With titles: X/X (X%)
- With dates: X/X (X%)
- With technologies: X/X (X%)

## Performance
- Average search time: Xms
- Embedding model: [status]

## Recommendations
1. [Specific actionable items]
2. [Re-index these files: ...]
3. [Add metadata to: ...]
```

Use the Python scripts at `[path-to-claude-code-vector-memory]/scripts/` to gather this information or run `[path-to-claude-code-vector-memory]/scripts/health_check.py` directly.
Note: claude-code-vector-memory can be installed from https://github.com/christian-byrne/claude-code-vector-memory