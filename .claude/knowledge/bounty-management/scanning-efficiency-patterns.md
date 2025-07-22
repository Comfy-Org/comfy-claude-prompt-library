# Scanning Efficiency Patterns

Memory systems and tracking patterns to avoid re-scanning previously analyzed issues.

## Core Problem

Scanning 400+ issues across repositories every time is inefficient and doesn't leverage previous analysis work. Need intelligent tracking to focus on new/changed issues only.

## CSV-Based Memory System

### Tracking Structure
```csv
repo,number,title,type,labels,bounty_suitability,new_hire_suitability,comments_count,created_date,url,notes,last_checked
```

### Implementation Pattern
```bash
# 1. Load existing analysis
if [[ -f comprehensive_issue_analysis.csv ]]; then
  echo "Loading previous analysis..."
  # Extract previously analyzed issue numbers
fi

# 2. Get current issues
gh issue list --repo REPO --limit 200 --json number,title,labels,comments,createdAt,url

# 3. Compare and identify new/changed
jq --slurpfile prev comprehensive_issue_analysis.csv '
  [.[] | select(.number as $num | 
    ($prev | map(.number) | contains([$num]) | not) or
    ($prev | map(select(.number == $num)) | .[0].comments_count < .comments)
  )]'
```

## Smart Re-Checking Criteria

### Mandatory Re-Check
- **New issues**: Not in existing CSV
- **Comment increase**: `comments_count` higher than stored value
- **Label changes**: Especially bounty/good-first-issue additions/removals
- **Stale assignments**: Issues marked "in progress" >30 days ago

### Skip Criteria  
- **Stable analysis**: In CSV, no changes, recent check
- **Recently assigned**: Comments indicate active work <30 days
- **Closed/resolved**: Status changed since last check

## File-Based Tracking

### Issue Status Files
```bash
# Track assignment status separately
echo "4466,assigned,jenix-yt,2025-07-20" >> assigned_issues.csv
echo "4140,available,none,2025-07-20" >> available_issues.csv
```

### GitHub API Optimization
```bash
# Only fetch detailed info for changed issues
for issue_num in $changed_issues; do
  gh api repos/OWNER/REPO/issues/$issue_num > "cache/issue_${issue_num}.json"
done
```

## Incremental Analysis Workflow

### Phase 1: Quick Scan
```bash
# Get high-level issue list
gh issue list --limit 200 --json number,title,labels,updatedAt

# Compare with previous scan timestamp
last_scan=$(cat .last_scan_timestamp 2>/dev/null || echo "2025-01-01")
new_issues=$(jq --arg since "$last_scan" '[.[] | select(.updatedAt > $since)]')
```

### Phase 2: Deep Analysis (New/Changed Only)
```bash
# Detailed analysis only for changed issues
for issue in $new_issues; do
  # Fetch full details including comments
  # Apply assessment framework
  # Update CSV with new analysis
done
```

### Phase 3: Status Updates
```bash
# Update timestamp
date -u +"%Y-%m-%dT%H:%M:%SZ" > .last_scan_timestamp

# Archive old analysis (keep history)
cp comprehensive_issue_analysis.csv "archive/analysis_$(date +%Y%m%d_%H%M%S).csv"
```

## Memory Integration Patterns

### Command Integration
```markdown
**FIRST: Load Previous Analysis**
- Read `comprehensive_issue_analysis.csv` to get previously analyzed issues
- Compare current issues against this list to identify:
  - NEW issues not in CSV
  - Issues with increased comment counts  
  - Issues with changed labels
```

### Smart Skipping Logic
```bash
# Skip if already analyzed and stable
if [[ "$issue_in_csv" == "true" ]] && [[ "$comments_unchanged" == "true" ]] && [[ "$labels_unchanged" == "true" ]]; then
  echo "Skipping #$issue_num - no changes since last analysis"
  continue
fi
```

## Performance Optimizations

### GitHub API Rate Limiting
- Use `gh issue list` for bulk operations (fewer API calls)
- Cache individual issue details locally
- Batch API calls where possible

### Data Processing
```bash
# Pre-filter with jq to reduce processing
jq '[.[] | select(.labels | map(.name) | contains(["bounty"]) | not)]' raw_issues.json > filtered_issues.json
```

### Parallel Processing
```bash
# Process multiple repos simultaneously  
{
  analyze_repo "Comfy-Org/ComfyUI_frontend" &
  analyze_repo "comfyanonymous/ComfyUI" &
  wait
}
```

## Historical Tracking Benefits

### Trend Analysis
```bash
# Track label addition patterns
grep "good first issue" analysis_archive/*.csv | wc -l

# Monitor bounty pipeline
grep "bounty_suitability,YES" analysis_archive/*.csv | sort
```

### Decision Learning
```bash
# Review past complexity assessments
grep "NEEDS_ANALYSIS" comprehensive_issue_analysis.csv | 
  while read line; do
    # Check if issue was eventually picked up
    issue_num=$(echo $line | cut -d, -f2)
    echo "Checking resolution of issue #$issue_num"
  done
```

### Automation Training Data
- CSV provides training data for future LLM-based classification
- Pattern recognition for label prediction
- Complexity assessment model training

## Example Implementation

### Directory Structure
```
bounty-processing/
├── comprehensive_issue_analysis.csv
├── .last_scan_timestamp  
├── assigned_issues.csv
├── cache/
│   ├── issue_4140.json
│   └── issue_4466.json
└── archive/
    ├── analysis_20250720_164500.csv
    └── analysis_20250719_091200.csv
```

### Scan Execution
```bash
#!/bin/bash
# Smart issue scanner with memory

echo "=== Smart Issue Scan Starting ==="

# Load previous state
load_previous_analysis
get_last_scan_timestamp

# Fetch only changed issues
fetch_changed_issues_since_last_scan

# Analyze new/changed issues only
for issue in $changed_issues; do
  analyze_issue_for_bounty_and_new_hire $issue
done

# Update tracking files
update_comprehensive_csv
update_scan_timestamp
archive_previous_analysis

echo "=== Scan Complete: $new_analyzed issues analyzed ==="
```

This approach transforms scanning from "analyze everything every time" to "intelligently focus on what changed", dramatically improving efficiency while building institutional memory.