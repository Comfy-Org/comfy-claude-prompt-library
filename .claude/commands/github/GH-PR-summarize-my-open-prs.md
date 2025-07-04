# PR Status Analysis Command

You are an expert GitHub workflow analyst. Your task is to analyze all open pull requests by the current github username of my terminal session that are less than 3 months old and provide actionable completion summaries.

## Instructions

Follow these steps systematically:

### 1. Data Collection Phase

First, gather comprehensive PR data:

```bash
# Get all open PRs by the current user from the last 3 months
gh search prs --author=@me --state=open --created=">=`date -d '3 months ago' '+%Y-%m-%d'`" --json url,title,repository,number,createdAt,updatedAt,headRefName,baseRefName,mergeable,reviewDecision,assignees,labels,milestone --limit 100
```

For each PR found:

1. **Get detailed PR information:**
   ```bash
   gh pr view <PR_URL> --json url,title,number,state,createdAt,updatedAt,headRefName,baseRefName,mergeable,reviewDecision,reviewRequests,assignees,labels,milestone,body,commits,files,additions,deletions
   ```

2. **Get PR comments and reviews:**
   ```bash
   gh pr view <PR_URL> --comments --json comments
   gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews
   ```

3. **Get linked issues:**
   ```bash
   gh api repos/{owner}/{repo}/pulls/{pr_number}/timeline | jq '.[] | select(.event == "cross-referenced") | .source.issue'
   ```

4. **Check local branch status:**
   ```bash
   # For each repository, check if we have local branches
   git branch -a | grep <head_ref_name>
   git status # if on the branch
   git log --oneline origin/<base_branch>..<head_ref_name> # unpushed commits
   ```

### 2. Slack Integration (Optional)

If Slack MCP is available, search for recent discussions about each PR:

```bash
# Search Slack for PR mentions
mcp__slack__conversations_history --channel_id <relevant_channels> --limit "7d" | grep -i "<PR_title_keywords>"
```

### 3. Analysis and Synthesis

For each PR, analyze:

**Status Indicators:**
- [ ] Review status (approved, changes requested, pending)
- [ ] CI/CD status 
- [ ] Merge conflicts
- [ ] Linked issue completion status
- [ ] Outstanding review comments
- [ ] Branch sync status with base

**Completion Blockers:**
- [ ] Unresolved review feedback
- [ ] Failing tests/CI
- [ ] Missing documentation
- [ ] Merge conflicts
- [ ] Dependent issues/PRs
- [ ] Required approvals

### 4. Output Format

Structure your response as follows:

## PR Status Analysis Report

### Summary
*Brief overview of total PRs, repositories involved, and general status*

### PR Analysis by Repository

#### Repository: `[repo-name]`

##### PR #[number]: [title]
**Created:** [date] | **Last Updated:** [date] | **Branch:** [head] → [base]

**Current Status:**
- Review Decision: [approved/changes_requested/pending]
- Mergeable: [yes/no/conflicts] 
- CI Status: [passing/failing/pending]
- Linked Issues: [list with status]

**Outstanding Items:**
- [ ] [Specific action item 1]
- [ ] [Specific action item 2]
- [ ] [Specific action item 3]

**Completion Summary:**
[3-5 sentence summary of what needs to be done to get this PR merged, including specific actions, estimated effort, and any dependencies]

**Local Branch Status:**
[Status of local branch if exists - ahead/behind/in-sync]

---

### Priority & Parallel Work Recommendations

#### High Priority (Complete First)
1. **[PR Title]** - [Brief reason why priority]
2. **[PR Title]** - [Brief reason why priority]

#### Medium Priority (Parallel Candidates)
1. **[PR Title]** - [Can work on while waiting for reviews/CI]
2. **[PR Title]** - [Independent work, no blockers]

#### Blocked/Waiting
1. **[PR Title]** - [What it's waiting for]

#### Suggested Parallel Work Groupings
- **Group A (Documentation/Tests):** [List of PRs that can be worked on together]
- **Group B (Independent Features):** [List of PRs with no dependencies]
- **Group C (Review Response):** [PRs waiting for you to respond to feedback]

### Action Plan Summary
**Immediate Actions (Next 1-2 days):**
- [ ] [Specific immediate action]
- [ ] [Specific immediate action]

**This Week:**
- [ ] [Weekly goal]
- [ ] [Weekly goal]

**Waiting On Others:**
- [ ] [What you're waiting for from others]

## Error Handling

If you encounter any errors:
1. **GitHub API rate limits:** Use `gh auth status` to check authentication and wait if needed
2. **Repository access issues:** Note which repos you cannot access and continue with available ones
3. **Local repository missing:** Note and skip local branch analysis for that repo
4. **Slack access issues:** Continue without Slack data and note the limitation

## Additional Context

Consider these factors in your analysis:
- **Repository importance** (core vs. experimental)
- **PR complexity** (lines changed, files affected)
- **Review feedback patterns** (quick fixes vs. architectural changes)
- **Team dependencies** (waiting on specific reviewers)
- **Release timeline pressures** (upcoming deadlines)

Remember: The goal is actionable intelligence - what specific actions will move each PR toward completion, and what can be done in parallel to maximize efficiency.