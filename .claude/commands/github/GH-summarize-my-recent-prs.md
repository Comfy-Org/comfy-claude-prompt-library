Get all pull requests created by the current user in the past $ARGUMENTS hours (whether opened or closed) and provide a nicely formatted list with links and summaries.

Follow these steps:

1. Use `gh pr list` with appropriate filters to get both open and closed PRs from all repositories you have access to
2. Filter the results to show only PRs created by the current user in the past $ARGUMENTS hours (if not specified, use 26 hours)
3. For each PR, gather:
   - PR title and number
   - Repository name
   - Status (open/closed/merged)
   - Creation date/time
   - Direct link to the PR
   - Brief summary of what the PR does (from the description or title)

4. Format the output as:
   - A clear header with the time range
   - Each PR as a bullet point with all the gathered information
   - Use markdown formatting for better readability
   - Include clickable links

5. If no PRs are found in the time range, clearly state that

Commands to use:
- `gh pr list --author=@me --state=all --limit=50` (to get both open and closed)
- `gh pr view <PR_NUMBER> --repo <REPO>` to get additional details if needed
- Use date filtering to ensure only PRs from the past $ARGUMENTS hours are included

Remember to handle cases where:
- No PRs exist in the timeframe
- PRs might be from different repositories
- Some PRs might have minimal descriptions