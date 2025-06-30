# Estimate Context Window Requirements

<task>
Calculate the total context window size needed for the given task: $ARGUMENTS
</task>

## Quick Checks (Short-Circuit Early)

1. **Immediate Disqualifiers** (if any are true, return "EXCEEDS_LIMIT"):
   - Task mentions "entire codebase" or "all files" → Likely >200k tokens
   - More than 50 files to read → Likely >100k tokens
   - Any single file >25k tokens → Will require multiple reads (Claude Code limit)
   - Task requires >10 Agent tool invocations → Likely >100k tokens

2. **File Size Pre-Check**
   ```
   If file_tokens > 25000:
     reads_needed = ceil(file_tokens / 25000)
     actual_tokens = file_tokens + (reads_needed × 75)  # Tool overhead per read
   ```

## Token Calculation Formula

### Base Context (Always Present)
```
BASE_TOKENS = 5000  # System prompt + tool definitions + task description
```

### File Operations
```
FILE_TOKENS = Σ(file_lines × TOKENS_PER_LINE × 1.15)
where:
  TOKENS_PER_LINE = {
    code: 2.5,      # .py, .js, .ts, etc.
    json: 3.0,      # .json, .yaml
    markdown: 2.0,  # .md, .txt
    minified: 4.0   # .min.js, compressed
  }

IMPORTANT: Files >25k tokens require chunked reading:
- Each chunk costs full Read tool overhead (75 tokens)
- Overlapping context may be needed between chunks
- Consider using Grep/Search for large files instead
```

### Tool Usage Multipliers
```
TOOL_OVERHEAD = {
  Read: 75,
  Bash: 50 + (output_chars / 3.5),
  WebFetch: 4000,
  Agent: 10000,
  Search: 150 × matches,
  Edit: 300,
  MultiEdit: 200 + (100 × edit_count)
}
```

### Cache Optimization
- First file read: Full tokens
- Subsequent reads of same file: 10% of original
- Track files in a Set to identify cache hits
- NOTE: Chunked reads don't benefit from caching between chunks

### Conversation Growth
```
TURN_TOKENS = conversation_turns × 550
ERROR_TOKENS = expected_errors × 750
RETRY_TOKENS = large_file_retries × 2000  # When hitting 25k limit
```

## Calculation Steps

1. **Parse Task Requirements**
   - Count files to read/edit
   - Check file sizes (use `wc -l` or file stats)
   - Flag files >10k lines as potential chunk candidates
   - Identify if Agent tools required

2. **Calculate File Tokens** (batch similar files)
   ```python
   total_file_tokens = 0
   cached_files = set()
   chunked_reads = 0
   
   for file in files_to_process:
     estimated_tokens = estimate_file_tokens(file)
     
     if estimated_tokens > 25000:
       # File exceeds Claude Code read limit
       chunks_needed = ceil(estimated_tokens / 25000)
       chunked_reads += chunks_needed
       tokens = estimated_tokens + (chunks_needed × 75)
     elif file in cached_files:
       tokens = estimated_tokens * 0.1
     else:
       tokens = estimated_tokens
       cached_files.add(file)
     
     total_file_tokens += tokens
   ```

3. **Estimate Tool Usage**
   - Add chunked read overhead
   - Multiply file count by average tools per file (usually 2-3)
   - Add special tool costs (Agent, WebFetch)

4. **Apply Growth Factor**
   ```
   TOTAL = (BASE + FILES + TOOLS + CONVERSATION) × 1.3
   ```

## Output Format

Return a structured estimate:

```
Context Window Estimate:
- Base context: 5,000 tokens
- File operations: X,XXX tokens (N files, M requiring chunks)
- Tool usage: X,XXX tokens
- Conversation overhead: X,XXX tokens
- Safety margin (30%): X,XXX tokens

TOTAL ESTIMATE: XX,XXX tokens
CONFIDENCE: [HIGH/MEDIUM/LOW]
FITS IN CONTEXT: [YES/NO/MAYBE]

⚠️ WARNINGS:
- X files exceed 25k token limit and require chunked reading
- Consider using Grep/Search instead for files >25k tokens
```

## Optimization Tips

- For files >25k tokens, use Grep first to locate relevant sections
- Process largest files first to fail fast
- Batch similar operations together
- Use cache-aware sequencing
- Suggest breaking into subtasks if >150k tokens

Remember: This is an ESTIMATE. Actual usage may vary based on:
- Output verbosity
- Error recovery needs
- Unexpected tool outputs
- Model's response patterns
- File reading retry attempts when hitting limits