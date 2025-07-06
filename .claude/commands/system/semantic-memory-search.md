# Semantic Memory Search

You are accessing your shared memory with this user for the task: $ARGUMENTS

## Process

1. **Extract Key Concepts**
   Parse the user's request to identify:
   - Main objectives and actions (create, fix, implement, etc.)
   - Technologies and frameworks mentioned
   - File types or components referenced
   - Domain areas (UI, backend, testing, etc.)

2. **Search Semantic Memory**
   ```bash
   [path-to-claude-code-vector-memory]/search.sh "your extracted search terms"
   ```

3. **Review Results**
   For each returned summary (typically top 3):
   - Read the preview carefully
   - Note the similarity score and relevance
   - Check the file path for the full summary if needed
   - Identify specific solutions, patterns, or decisions that apply

4. **Present Memory Recap**
   Show the user what relevant past work you found:
   
   ```
   📚 **Relevant Past Work Found:**
   
   **1. [Session Title] - [Date]**
   - Similarity: X%
   - Key work: [Brief description of what was done]
   - Relevant files: [List any key files that might help]
   - Useful context: [What specifically applies to current task]
   
   **2. [Session Title] - [Date]**
   - Similarity: X%
   - Key work: [Brief description]
   - Relevant approach: [Specific technique or pattern used]
   
   **3. [Session Title] - [Date]**
   - Similarity: X%
   - Previous solution: [What was implemented]
   - Could apply here for: [Specific aspect]
   ```

5. **Ask for Direction**
   "Would you like me to build on any of these previous approaches, or should we start fresh?"

## Validation Criteria

- Only present memories with >60% semantic similarity
- Read enough context to verify genuine relevance
- Explain WHY each memory is relevant with specific connections
- If results seem tangentially related, acknowledge this: "I found some past work that might be relevant, though the connection isn't strong"

## If No Relevant Memories Found

If search returns no good matches or all have low similarity:
- Simply state: "I didn't find any highly relevant past work on this specific topic."
- Proceed with the task without dwelling on the lack of memories

## Example Search Queries

Based on user requests, here are example search terms to use:

- "implement vue component" → Search: "vue component implementation widget"
- "fix typescript errors" → Search: "typescript type error fix"
- "add tests" → Search: "test vitest playwright testing"
- "update API" → Search: "api endpoint backend"
- "style with tailwind" → Search: "tailwind css styling"

## Important Notes

- The semantic search understands conceptual similarity, not just keywords
- Recent sessions are weighted higher in the results
- Complex sessions (high file count) get a slight boost
- Always verify relevance before presenting to user