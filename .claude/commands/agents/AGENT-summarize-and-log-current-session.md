Your task is to create an ultra-compact summary of our entire conversation. Follow these requirements exactly:

## Summary Requirements

1. **Maximum Information Density**: Every sentence must convey multiple ideas. Eliminate all filler words, redundant phrases, and unnecessary transitions. Think of this as creating a reference card, not prose.

2. **Include All Critical Elements**:
   - Core topics/problems discussed
   - Exact absolute file paths mentioned or worked with
   - URLs/links referenced
   - Key decisions made
   - Solutions implemented
   - Commands executed
   - Errors encountered and resolutions

3. **Structure**:
   - Start with a one-line executive summary
   - Group related items under ultra-brief headers
   - Use bullet points with extreme brevity
   - Include timestamp markers for chronological context if relevant

4. **File Handling**:
   - Save to: `~/.claude/compacted-summaries/`
   - Filename format: `summary-YYYY-MM-DD-HHMMSS-semantic-description.md`
     - Use current timestamp for YYYY-MM-DD-HHMMSS
     - Add a kebab-case semantic description of the main topics (3-7 words)
     - Example: `summary-2025-06-29-181658-comfyui-vue-widget-interfaces.md`
   - CRITICAL: First check if a file with the same name exists
   - If it exists, append `-v2`, `-v3`, etc. until you find an available filename
   - This is essential as multiple people may be writing to this folder simultaneously

5. **Style Guidelines**:
   - Prefer lists over paragraphs
   - Use abbreviations where unambiguous
   - Combine related points into single lines
   - Include exact values/numbers/versions
   - Preserve technical accuracy while maximizing brevity

## Execution Steps

1. First, ensure the target directory exists
2. Generate the timestamp (YYYY-MM-DD-HHMMSS format)
3. Determine the semantic description based on main conversation topics (3-7 words, kebab-case)
4. Combine into filename: `summary-[timestamp]-[semantic-description].md`
5. Check if the file already exists
6. If it exists, append `-v2`, `-v3`, etc. until finding an available name
7. Write the compact summary to the file
8. Confirm successful creation with the final filepath

Remember: Your primary goal is information density. If you can convey the same information in fewer words without losing meaning, do so. Think of this as creating a highly compressed archive of our conversation that can be quickly scanned for reference.

$ARGUMENTS