# GitHub Issue Labeling Patterns

This document captures patterns and processes learned from implementing a human-in-the-loop issue labeling system for ComfyUI_frontend.

## Human-in-the-Loop Labeling Process

### CSV Decision Logging Approach

When implementing area labels across a large number of existing issues, use a CSV log to track decisions and build a knowledge base:

```csv
issue_number,title,url,suggested_labels,applied_labels,reasoning,notes,timestamp
```

This creates a valuable dataset for:
- Learning labeling patterns over time
- Analyzing label distribution
- Training future automation
- Documenting decision rationale

### Standard Operating Procedure

1. **Fetch all open issues**:
   ```bash
   gh issue list --repo Comfy-Org/ComfyUI_frontend --state open --limit 100 --json number,title,url,labels
   ```

2. **For each issue**:
   - Present issue details and analysis
   - Suggest appropriate area label(s)
   - Human reviews and decides
   - Log decision with reasoning
   - Apply label if new

3. **Create new area labels as needed**:
   - Discuss with human reviewer
   - Create in GitHub
   - Document in decision log

## Area Label Philosophy

### Primary Area Rule

**Core principle**: Use only one `area:*` label per issue unless the issue "truly affects both categories in major ways"

Examples:
- ✅ `area:3d` for "Style issues when switching languages in 3D viewer" (triggered by i18n but core issue is 3D)
- ✅ `area:subgraph` for "Widget behavior in subgraphs" (involves widgets but subgraph is primary context)
- ✅ `area:testing` + `documentation` for test documentation (genuinely both)
- ❌ Don't add `area:i18n` just because language switching triggers a bug

### Special Labeling Rules

1. **Custom Node Issues**:
   - Use `Custom Node` label only
   - No area labels
   - Example: "WD14Tagger event loop error"

2. **Questions**:
   - Use `question` label only
   - No area labels
   - Example: "Frontend on a different server?"

3. **Too Broad Issues**:
   - Skip area labeling entirely
   - Example: "Optional full height sidebar for everything"

4. **Infrastructure Issues**:
   - Use appropriate area labels
   - Examples: `CI/CD`, `area:testing`

## Area Labels Created During Implementation

Based on gap analysis of existing labels:

1. **`area:comms`** - Client-server communication, WebSocket issues, API calls
2. **`area:models`** - Model-related UI issues, model sidebar functionality
3. **`area:testing`** - Test infrastructure, flaky tests, test documentation

## Issue Template Integration

### Dropdown Implementation

Add area selection to issue templates for automatic labeling:

```yaml
- type: dropdown
  id: area
  attributes:
    label: Which area does this bug affect?
    description: Select the primary area of the codebase this bug affects
    options:
      - area:nodes
      - area:workflows
      - area:queue
      # ... other areas
      - Other/Unknown
  validations:
    required: true
```

### Automatic Label Application

Use GitHub Actions to extract and apply the selected area:

```yaml
# .github/workflows/issue-area-labeler.yml
- name: Extract and apply area label
  uses: actions/github-script@v7
  with:
    script: |
      const issueBody = context.payload.issue.body || '';
      const areaMatch = issueBody.match(/### Which area.*?\n\s*(.+?)(?:\n|$)/);
      
      if (areaMatch && areaMatch[1].startsWith('area:')) {
        await github.rest.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number,
          labels: [areaMatch[1].trim()]
        });
      }
```

## File-Based PR Labeling

Configure automatic PR labeling based on changed files:

```yaml
# .github/labeler.yml
area:nodes:
  - changed-files:
    - any-glob-to-any-file:
      - 'src/scripts/app.ts'
      - 'src/components/graph/**'
      - 'src/stores/nodeDefStore.ts'

area:workflows:
  - changed-files:
    - any-glob-to-any-file:
      - 'src/stores/workflowStore.ts'
      - 'src/services/workflowService.ts'
```

## Analysis Commands

Useful commands for working with the decision log:

```bash
# Count label frequency
cut -d, -f5 issue-labeling-log.csv | sort | uniq -c | sort -nr

# Find decisions for specific area
grep "area:nodes" issue-labeling-log.csv

# View recent decisions
tail -10 issue-labeling-log.csv
```

## Key Insights

1. **Cost-conscious automation**: Human-in-loop preferred over LLM API calls for active projects
2. **Primary area discipline**: Resist adding multiple area labels; maintains clarity
3. **Custom node isolation**: Keep custom node issues separate from core functionality
4. **Progressive enhancement**: Start with manual process, automate based on learned patterns
5. **Decision documentation**: CSV log valuable for future automation and consistency