# Dual-Purpose Issue Scanning Patterns

Patterns for efficiently identifying issues suitable for bounty program vs new hire onboarding.

## Core Philosophy

**Bounties**: External contributors, payment on merge, need simple/isolated tasks
**New Hires**: Internal team members, learning opportunities, bugs prioritized, more complexity tolerance

## Scanning Priorities

### 1. New Hire Candidates (Higher Priority)
**Search Order**:
1. `label:"good first issue"` - Pre-vetted for beginners
2. `label:"verified bug"` - Bugs provide better learning than features
3. Recent bugs with clear reproduction steps

**Assessment Criteria**:
- Safe to make mistakes on
- Good mentoring opportunities  
- Clear expected behavior
- Isolated enough to not break core functionality

### 2. Bounty Candidates (Secondary)
**Search Order**:
1. Simple enhancements with clear scope
2. CSS/styling fixes
3. Documentation improvements
4. Isolated bug fixes

**Assessment Criteria**:
- Can be completed independently
- No architectural decisions required
- Clear acceptance criteria
- Single component/file scope preferred

## Label-Based Filtering

### Prioritize for New Hires
```bash
# High value for learning
label:"good first issue"
label:"verified bug" 
label:"area:settings"     # Safe, contained system
label:"area:ui"           # Visual feedback, easy to verify
```

### Prioritize for Bounties  
```bash
# Well-defined scope
label:"enhancement" + simple description
label:"documentation"     # Clear deliverables  
label:"area:css"         # Usually isolated
```

### Skip Both
```bash
label:"area:subgraph"    # Too complex system
label:"area:workflow"    # Core functionality 
label:"Feature"          # Usually too broad
```

## Dual Assessment Framework

### Step 1: Basic Suitability
- Read issue title and description
- Check label patterns
- Verify not already assigned

### Step 2: New Hire Assessment
```
✓ Labeled "good first issue"?
✓ Is it a bug (more learning value)?
✓ Clear reproduction steps?
✓ Safe to experiment on?
✓ Good mentoring potential?
```

### Step 3: Bounty Assessment  
```
✓ Can be completed independently?
✓ Clear acceptance criteria?
✓ Single component scope?
✓ No design decisions required?
✓ Suitable for external contributor?
```

### Step 4: Classification
- **New Hire Only**: Complex enough to need mentoring, good learning
- **Bounty Only**: Simple enough for external contributor
- **Either**: Simple bug that works for both
- **Neither**: Too complex or too simple

## Examples from Practice

### Perfect New Hire Candidates
- **#4140**: Export menu visibility - settings system, safe to experiment
- **#4121**: Search Enter key - event handling, clear expected behavior  
- **#4122**: Settings toggle - architecture learning opportunity

### Perfect Bounty Candidates  
- **#4447**: Language switching CSS - isolated styling issue
- **#4438**: Model sidebar 404s - HTTP error handling, clear scope
- **#4300**: Documentation flag - simple boolean addition

### Rejected Examples
- **#4405**: TypeScript generics - too architectural for bounty
- **#4466**: Regex escaping - good but already assigned
- **#4166**: Subgraph expansion - too complex for either

## Search Strategy

### GitHub CLI Approach
```bash
# Get comprehensive data
gh issue list --repo REPO --limit 200 --json number,title,labels,comments,createdAt,body,url

# Filter by categories
jq '[.[] | select(.labels | map(.name) | contains(["good first issue"]))]'
jq '[.[] | select(.labels | map(.name) | contains(["verified bug"]))]'
```

### Progressive Refinement
1. **Broad search** - All open issues without bounty label
2. **Label filtering** - Focus on high-value labels  
3. **Manual review** - Deep assessment of candidates
4. **Comment checking** - Verify not assigned/discussed

## Success Metrics

### New Hire Success Indicators
- Issue provides learning about system architecture
- Mistakes don't cause major problems
- Clear feedback possible from mentors
- Builds confidence and familiarity

### Bounty Success Indicators  
- External contributor can complete independently
- Clear definition of "done"
- Payment justifiable for scope
- Doesn't require extensive code review

## Anti-Patterns

### For New Hires
- ❌ Too simple (no learning value)
- ❌ Too isolated (no system understanding gained)
- ❌ Critical path components

### For Bounties
- ❌ Requires extensive discussion
- ❌ Multiple valid approaches exist
- ❌ Depends on unreleased features
- ❌ Needs deep codebase knowledge