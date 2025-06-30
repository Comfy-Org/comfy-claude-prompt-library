# Use Command Template

I need to create a new command using the standard template for: $ARGUMENTS

## Your Task

Create a new Claude Code command following our established patterns and templates.

## Execution Steps

1. **Determine Command Type**
   - Parse command purpose from $ARGUMENTS
   - Identify appropriate category (analysis/development/quality/etc)
   - Choose suitable command name (verb-noun format)

2. **Apply Template**
   - Start with base template from ~/.claude/templates/command-template.md
   - Customize sections for specific command purpose
   - Ensure all required sections are included
   - Add command-specific flags if needed

3. **Configure Integration**
   - Check ~/.claude/config/command-patterns.yml for workflow placement
   - Identify prerequisite commands
   - Define what context this command produces
   - Add to appropriate workflow chains

4. **Create Command File**
   - Determine correct folder based on category
   - Create .md file with command content
   - Verify @include references work correctly
   - Test with example usage

## Template Structure

The standard template includes:
- Purpose (single sentence)
- Task description with $ARGUMENTS
- Phased execution steps
- Context preservation rules
- Expected output format
- Integration guidance

## Best Practices

- Keep commands focused on a single responsibility
- Use clear verb-noun naming (analyze-dependencies, create-component)
- Include at least 3 example usages
- Define what gets cached for reuse
- Specify prerequisite and follow-up commands

## Example Usage

```bash
# Create a new analysis command
/development:use-command-template analyze API endpoints for rate limiting needs

# Create a new validation command  
/development:use-command-template validate database migrations for safety

# Create a new generation command
/development:use-command-template generate TypeScript types from API schema
```