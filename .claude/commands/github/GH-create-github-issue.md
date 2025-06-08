# Create GitHub Issue with Research

For this task: $ARGUMENTS

## Research Phase

1. **Read Issue Templates**
   - Check if repo exists locally first, otherwise fetch it
   - Read templates in .github/ISSUE_TEMPLATE/ or .github/ folder
   - Note required fields, formatting guidelines, and labels

2. **Read Core Documentation:**
   - https://deepwiki.com/comfyanonymous/ComfyUI (core ComfyUI)
   - https://deepwiki.com/Comfy-Org/ComfyUI_frontend (frontend architecture)
   - https://deepwiki.com/Comfy-Org/ComfyUI-Manager (custom node manager)
   - https://deepwiki.com/Comfy-Org/litegraph.js (graph canvas system)
   - ~/projects/comfy-testing-environment/
   - ~/projects/comfyui-frontend-testing/
   - ~/projects/comfyui-frontend-testing/docs/

3. **Read Repository Documentation**
   - Look for deepwikis, CONTRIBUTING.md, or other relevant docs
   - Understand the project's issue reporting standards

4. **Analyze Existing Issues**
   - Use `gh issue list` and `gh api` to query similar issues
   - Study formatting, etiquette, and common patterns
   - Check for duplicates or related discussions

5. **Review Commit History**
   - Search commits related to the feature/bug area
   - Understand recent changes that might be relevant

## Visual Documentation (if needed)

If screenshots would help illustrate the issue:
- Tell me to start ComfyUI in a separate process
- Once I confirm it's running, navigate to localhost:8188
- Take relevant screenshots of the issue/feature request

For design specifications or visual details:
- Visit Figma: https://www.figma.com/files/team/1359619007376639842/recents-and-sharing?fuid=1462318000816924530
- Capture any relevant design elements

## Create the Issue

Using all gathered information:
1. Draft issue following the template and standards discovered
2. Include relevant context, screenshots, and references
3. Apply appropriate labels and metadata
4. Use `gh issue create` to submit

Remember to:
- Be concise but thorough
- Follow the project's contribution guidelines
- Reference related issues/PRs where applicable
- Use clear, descriptive title
- Include reproduction steps for bugs
- Specify expected vs actual behavior