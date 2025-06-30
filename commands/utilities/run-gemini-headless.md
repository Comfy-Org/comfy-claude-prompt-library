# Run Gemini Headlessly

<task>
Execute the following task using gemini in headless mode: $ARGUMENTS
</task>

## Execution Strategy

I'll run gemini with the appropriate flags to execute your task without requiring user interaction.

### Command Construction

Based on your request, I'll construct a gemini command using:
- `-p` flag with your task: `$ARGUMENTS` + binary file exclusion caveat
- `-y` flag for automatic acceptance (headless operation)
- Always run detached to avoid Claude Code's 2-minute Bash timeout
- Log output to file for review

**IMPORTANT**: Always append this caveat to the prompt to avoid binary file errors:
"IMPORTANT: Focus only on text-based source code files (JS, TS, Vue, JSON, MD, YAML, CSS, HTML, config files). Ignore and skip any binary files, images, fonts, or other non-text files that may cause API errors."

### Execution Pattern

For codebase analysis tasks, start with `--all_files` flag for comprehensive context:

```bash
nohup gemini -a -p "$ARGUMENTS IMPORTANT: Focus only on text-based source code files (JS, TS, Vue, JSON, MD, YAML, CSS, HTML, config files). Ignore and skip any binary files, images, fonts, or other non-text files that may cause API errors." -y > gemini_output.log 2>&1 &
echo "Gemini task started in background with full codebase context. It will run independently and save results to gemini_output.log when complete."
```

For other tasks:
```bash
nohup gemini -p "$ARGUMENTS IMPORTANT: Focus only on text-based source code files (JS, TS, Vue, JSON, MD, YAML, CSS, HTML, config files). Ignore and skip any binary files, images, fonts, or other non-text files that may cause API errors." -y > gemini_output.log 2>&1 &
echo "Gemini task started in background. It will run independently and save results to gemini_output.log when complete."
```

**IMPORTANT**: This is fire-and-forget. Do not monitor the process or check logs. Let gemini run to completion independently.

### Command Validation

Before executing, I'll show you the exact command that will be run:
```bash
# Example for codebase analysis:
nohup gemini -a -p "Create a comprehensive documentation..." -y > gemini_output.log 2>&1 &
```

### Error Handling

If gemini reports token limit exceeded (e.g., "The input token count exceeds the maximum"):
1. Try again WITHOUT the `--all_files` flag:
   ```bash
   nohup gemini -p "$ARGUMENTS" -y > gemini_output.log 2>&1 &
   ```
2. If still too large, consider breaking the task into smaller chunks or focusing on specific directories

### Troubleshooting

**Common Mistakes to Avoid:**
- ❌ `gemini -a "prompt"` - Missing `-p` flag and `-y` flag
- ❌ `gemini < prompt.txt` - Don't use stdin redirection
- ❌ `gemini -p "prompt"` - Missing `-y` flag for headless operation
- ✅ `gemini -p "prompt" -y` - Correct format

**For User Reference Only** (Claude Code should not run these):
```bash
# User can check if gemini is running
ps aux | grep gemini | grep -v grep

# User can check log file growth
wc -l gemini_output.log

# User can monitor output in real-time
tail -f gemini_output.log
```

**If No Output Appears:**
1. Check if process is actually running with `ps aux | grep gemini`
2. Check for error messages in the log file
3. Verify the command syntax is exactly as shown above
4. Ensure gemini is installed and accessible in PATH

**Common Gemini Errors:**
- **"Provided image is not valid"**: Gemini fails when encountering binary files (images, fonts, etc.)
  - Solution: Modify prompt to focus on source code files only
  - Avoid using `-a` flag if codebase contains many binary files
- **Authentication timeout**: May need to re-authenticate with `gemini auth login`
- **Token limit exceeded**: Even without `-a`, some tasks may be too large
- **If gemini fails completely**: Fall back to manual analysis focusing on key directories

### Enhanced Patterns (if applicable)

For complex tasks, I may use:
- **Sandbox mode** (`-s`) for risky operations
- **Checkpointing** (`-c`) for reversibility
- **Debug mode** (`-d`) if initial attempts fail
- **Specific model** (`--model`) if task requires it

## Quick Reference

### Key Flags for Headless Operation
- `-y, --yolo`: Auto-accept all actions (required for headless)
- `-p, --prompt`: Task description
- `-s, --sandbox`: Isolated execution
- `-c, --checkpointing`: Enable rollback
- `-d, --debug`: Verbose output
- `--help`: View all options

### Common Task Patterns

**File Operations:**
```bash
gemini -p "create a README with setup instructions" -y
gemini -p "add error handling to all API endpoints" -y
gemini -p "refactor callbacks to async/await" -y
```

**Code Generation:**
```bash
gemini -p "implement JWT authentication" -y
gemini -p "write unit tests for utils module" -y
gemini -p "generate API documentation" -y
```

**Analysis:**
```bash
gemini -p "find security vulnerabilities" -y
gemini -p "identify performance bottlenecks" -y
```

### Advanced Usage

**With stdin input:**
```bash
cat context.txt | gemini -p "analyze and refactor this code" -y
```

**Pipeline integration:**
```bash
git diff | gemini -p "review this code diff" -y
```

**Batch processing:**
```bash
for file in src/*.js; do
    gemini -p "add TypeScript types to $file" -y
done
```

## Error Handling

If the command fails, I'll:
1. Check exit code and error message
2. Try with debug flag: `gemini -p "$ARGUMENTS" -y -d`
3. Consider breaking into smaller tasks
4. Use sandbox mode if appropriate

## Safety Considerations

- Sensitive data will not be included in prompts
- Generated code will be reviewed before deployment
- Sandbox mode used for experimental operations
- Checkpointing enabled for major refactoring

Remember: Run `gemini --help` to explore all available options.