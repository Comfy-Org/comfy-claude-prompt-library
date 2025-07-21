# Claude Code GitHub Actions Integration

## Overview

Claude Code GitHub Actions brings AI-powered automation to your GitHub workflow. With a simple `@claude` mention in any PR or issue, Claude can analyze code, create pull requests, implement features, and fix bugs while following your project's standards.

## Key Components

### 1. Claude Code Action
- **Repository**: `anthropics/claude-code-action@v1`
- **Purpose**: Run Claude Code within GitHub Actions workflows
- **Use Case**: Build custom workflows on top of Claude Code

### 2. Claude Code Base Action
- **Repository**: `anthropics/claude-code-base-action`
- **Purpose**: Foundation for building custom GitHub workflows
- **Use Case**: Extensible framework with full access to Claude's capabilities

## Setup Methods

### Quick Setup (Recommended)
```bash
# In your terminal with Claude Code
claude
/install-github-app
```

This command:
- Guides through GitHub app installation
- Sets up required secrets automatically
- Only available for direct Anthropic API users

### Manual Setup
1. Install Claude GitHub app: https://github.com/apps/claude
2. Add `ANTHROPIC_API_KEY` to repository secrets
3. Copy workflow file from examples

## Correct Action Syntax

### Basic Workflow Configuration
```yaml
name: Claude PR Action

permissions:
  contents: write
  pull-requests: write
  issues: write

on:
  issue_comment:
    types: [created]

jobs:
  claude-pr:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: "Your prompt here"
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          max_turns: 1
          timeout_minutes: 30
```

### Key Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| `prompt` | Direct prompt to Claude | Yes* |
| `prompt_file` | Path to file containing prompt | Yes* |
| `anthropic_api_key` | API key | Yes** |
| `max_turns` | Maximum conversation turns | No |
| `timeout_minutes` | Execution timeout | No |
| `arguments` | Arguments to pass to command | No |

*Either `prompt` or `prompt_file` required
**Required for direct API, not for Bedrock/Vertex

## Common Implementation Patterns

### 1. Automated PR Reviews
```yaml
name: Claude PR Review

on:
  pull_request:
    types: [opened]
    paths:
      - 'src/**/*.vue'
      - 'src/**/*.ts'
      - '!**/*.test.ts'

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: anthropics/claude-code-action@v1
        with:
          prompt_file: .claude/commands/automated-pr-review.md
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          arguments: ${{ github.event.pull_request.number }}
        env:
          PR_NUMBER: ${{ github.event.pull_request.number }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          REPOSITORY: ${{ github.repository }}
```

### 2. Issue to PR Conversion
```yaml
on:
  issue_comment:
    types: [created]

jobs:
  implement:
    if: |
      github.event.issue.pull_request == null && 
      contains(github.event.comment.body, '@claude implement')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: "Implement the feature described in issue #${{ github.event.issue.number }}"
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Command File Best Practices

### Argument Handling
```bash
# Accept arguments with fallback to env vars
PR_NUMBER=${1:-$PR_NUMBER}
if [ -z "$PR_NUMBER" ]; then
    echo "Error: No PR number provided"
    exit 1
fi
```

### Environment Validation
```bash
# Check required environment
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN is not set"
    exit 1
fi

# Check API rate limits
RATE_LIMIT=$(gh api rate_limit --jq '.resources.core.remaining')
if [ "$RATE_LIMIT" -lt 50 ]; then
    echo "Warning: Low GitHub API rate limit ($RATE_LIMIT remaining)"
fi
```

### Error Handling
```bash
# Add error handling to API calls
gh api -X POST /repos/$REPOSITORY/pulls/$PR_NUMBER/comments \
  -f path="$FILE_PATH" \
  -f line=$LINE_NUMBER \
  -f body="Comment text" \
  -f commit_id="$COMMIT_SHA" \
  -f side='RIGHT' || echo "Warning: Failed to post comment"
```

### Dynamic Repository References
```bash
# Use environment variables instead of hardcoded values
gh api -X POST /repos/$REPOSITORY/pulls/$PR_NUMBER/comments
# NOT: /repos/Comfy-Org/ComfyUI_frontend/pulls/...
```

## Common Pitfalls and Solutions

### 1. Incorrect Action Reference
❌ **Wrong**: `uses: anthropics/claude-code-action@main`
✅ **Correct**: `uses: anthropics/claude-code-action@v1`

### 2. Missing Arguments
❌ **Wrong**: Expecting `$PR_NUMBER` without passing it
✅ **Correct**: Use `arguments: ${{ github.event.pull_request.number }}`

### 3. Hardcoded Repository Names
❌ **Wrong**: `/repos/MyOrg/MyRepo/pulls/...`
✅ **Correct**: `/repos/${{ github.repository }}/pulls/...`

### 4. No Error Handling
❌ **Wrong**: `gh api ... -f body="comment"`
✅ **Correct**: `gh api ... -f body="comment" || echo "Failed to comment"`

### 5. Missing Path Filtering
❌ **Wrong**: Running on all file changes
✅ **Correct**: Filter paths to relevant files only

## Enterprise Setup (Bedrock/Vertex)

### AWS Bedrock Configuration
```yaml
steps:
  - name: Configure AWS Credentials
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
      aws-region: us-west-2
  
  - uses: anthropics/claude-code-action@v1
    with:
      use_bedrock: "true"
      model: "us.anthropic.claude-3-5-sonnet-20241022-v2:0"
```

### Google Vertex AI Configuration
```yaml
steps:
  - name: Authenticate to Google Cloud
    uses: google-github-actions/auth@v2
    with:
      workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
      service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}
  
  - uses: anthropics/claude-code-action@v1
    with:
      use_vertex: "true"
      model: "claude-3-5-sonnet@20241022"
```

## CLAUDE.md Integration

Create a `CLAUDE.md` file in your repository root to:
- Define coding standards
- Set review criteria  
- Specify project rules
- Guide Claude's behavior

Claude automatically reads and follows these guidelines.

## Cost Optimization

### GitHub Actions Costs
- Runs on GitHub-hosted runners
- Consumes GitHub Actions minutes
- Consider concurrency limits

### API Token Usage
- Each interaction consumes tokens
- Usage varies by task complexity
- Set appropriate `max_turns` limits
- Configure reasonable `timeout_minutes`

### Optimization Tips
- Use specific triggers (not all PR events)
- Filter by file paths
- Limit parallel runs
- Cache dependencies where possible

## Security Best Practices

1. **Never commit API keys** - Always use GitHub Secrets
2. **Use least privilege** - Only grant necessary permissions
3. **Review Claude's changes** - Don't auto-merge
4. **Limit scope** - Use path filters and specific triggers
5. **Monitor usage** - Track API costs and rate limits

## Troubleshooting

### Claude Not Responding
- Verify GitHub App installation
- Check workflow triggers
- Confirm API key in secrets
- Use `@claude` not `/claude`

### Authentication Errors
- Validate API key permissions
- Check secret names match
- Verify cloud provider setup

### Rate Limiting
- Monitor GitHub API limits
- Use error handling
- Implement backoff strategies
- Batch operations where possible

## Example Use Cases

1. **Turn issues into PRs**: `@claude implement this feature`
2. **Get implementation help**: `@claude how should I implement X?`
3. **Fix bugs quickly**: `@claude fix the TypeError in component Y`
4. **Automated reviews**: Trigger on PR open with validation rules
5. **Custom workflows**: Build any automation using Claude's capabilities

Remember: Claude Code GitHub Actions augments but doesn't replace human code review for complex decisions.