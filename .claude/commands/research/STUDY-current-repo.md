# ABSORB File Command

Your task is to read and deeply absorb the repository analysis guide for the current working directory. This information will be used consistently throughout our upcoming tasks, so thorough understanding is critical.

## Repository Analysis Integration

This command integrates with the ANALYZE-repo-for-claude storage system:

1. **Check for existing analysis**: Look for the repository analysis in a folder called `project-summaries-for-agents/` (try to find in cwd, home dir, then using fs search)
   - If you cannot find the project-summaries-for-agents folder, inform the user they need to make the folder, update this command file, and run the ANALYZE-repo-for-claude command first
   - Read `filepath-mapping.json` to find the summary folder for the current working directory
   - If a mapping value exists that matches the current working directory, but the filepath doesn't exist, inform the user if they want to update the existing mapping or create a new one
   - If no mapping exists, inform the user they need to run the ANALYZE-repo-for-claude command first

2. **Load repository guide**: Once the analysis folder is identified, read the comprehensive repository guide

## Instructions

1. **Locate repository analysis**: 
   - Check if the current working directory has an existing analysis
   - Use the filepath mapping system to find the correct summary folder
   - If not found, stop and inform the user to run ANALYZE-repo-for-claude first

2. **Read the repository guide thoroughly**: Access the analysis file and understand:
   - The repository's purpose and context
   - Technology stack and architecture patterns
   - Development workflow and critical guidelines
   - Directory structure and key files
   - Common development tasks and procedures

3. **Absorb the information**: Process and internalize the content so you can:
   - Reference specific development patterns when needed
   - Apply the repository's conventions to related tasks
   - Make connections between different project components
   - Maintain consistency with the established architectural patterns
   - Follow the documented development guidelines

4. **Confirm understanding**: Provide a brief summary showing you've absorbed the key repository information, but keep it concise - the goal is absorption, not extensive explanation.

## Expected Behavior

- Verify repository analysis exists before proceeding
- Read the comprehensive repository guide completely and carefully
- Think deeply about the architectural patterns and development conventions
- Store the information for consistent use in subsequent tasks
- Acknowledge completion with a focused summary of key development guidelines

## Error Handling

If no repository analysis is found:
- Inform the user that no analysis exists for the current repository
- Suggest running the ANALYZE-repo-for-claude command first
- Do not proceed with file absorption until the analysis is available

This command is designed for building comprehensive repository context that will inform all future development work in the session.