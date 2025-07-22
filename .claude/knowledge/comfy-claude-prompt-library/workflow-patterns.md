# Workflow Patterns

## Overview

Workflow patterns define how commands chain together, share context, and create automated development workflows. These patterns are defined in `.claude/config/command-patterns.yml` and implemented throughout the command library.

## Command Workflow Chains

### Feature Development Workflow
```yaml
Feature_Development:
  steps:
    - create-feature-task      # Initial planning and requirements
    - study-current-repo       # Understand codebase context
    - implement-feature        # Core development work
    - create-test-plan         # Testing strategy
    - comprehensive-test-review # Quality validation
    - gh-create-pr            # Submit for review
```

**Context Flow**:
- Requirements from `create-feature-task` → `implement-feature`
- Architecture understanding from `study-current-repo` → `implement-feature`
- Test results from `comprehensive-test-review` → `gh-create-pr`

### Bug Fix Workflow
```yaml
Bug_Fix:
  steps:
    - gh-issue-enhance        # Clarify issue description
    - analyze-issue           # Root cause analysis
    - fix-bug                # Implementation
    - test-fix               # Validation
    - gh-pr-submit           # Submit solution
```

**Context Flow**:
- Issue analysis → Bug fix implementation
- Root cause findings → Test strategy
- Fix validation → PR confidence level

### Code Review Workflow
```yaml
Code_Review:
  steps:
    - scan-code-quality       # Quality metrics
    - scan-performance        # Performance analysis
    - scan-test-coverage      # Coverage validation
    - generate-review-report  # Consolidated findings
```

**Context Flow**:
- All scan results → Comprehensive review report
- Priority issues → Action items
- Quality metrics → Review recommendations

## Context Sharing Patterns

### Analysis → Implementation
```yaml
analyze_to_implement:
  from: analyze-*, study-*
  to: implement-*, fix-*, create-*
  shares: [findings, patterns, architecture, constraints]
```

**Examples**:
- `ANALYZE-repo-for-claude` findings → Feature implementation
- `STUDY-current-repo` patterns → Code consistency
- Architecture insights → Design decisions

### Scanning → Fixing
```yaml
scan_to_fix:
  from: scan-*, validate-*
  to: fix-*, improve-*, refactor-*
  shares: [issues, priorities, locations, severity]
```

**Examples**:
- `scan-performance` bottlenecks → Performance optimization
- `validate-dependencies` vulnerabilities → Security fixes
- `scan-dead-code` findings → Cleanup tasks

### Testing → Deployment
```yaml
test_to_deploy:
  from: test-*, scan-test-coverage
  to: deploy, gh-pr-*, merge-*
  shares: [results, coverage, confidence, risks]
```

**Examples**:
- Test coverage metrics → Deployment confidence
- Test results → PR approval criteria
- Risk assessment → Deployment strategy

## Workflow Execution Patterns

### Sequential Execution
Commands execute in defined order with context passing:
```markdown
<workflow>
1. Execute prerequisite command
2. Capture output and context
3. Pass context to next command
4. Validate context transfer
5. Continue chain execution
</workflow>
```

### Conditional Branching
Workflows adapt based on conditions:
```markdown
<workflow>
1. Analyze current state
2. **If condition A met:**
   - Execute path A commands
   - Apply path A context patterns
3. **If condition B met:**
   - Execute path B commands
   - Apply path B context patterns
4. Converge on common final steps
</workflow>
```

### Parallel Execution
Multiple commands execute simultaneously:
```markdown
<workflow>
1. Initiate parallel analysis commands
   - scan-performance (background)
   - scan-security (background)  
   - scan-dependencies (background)
2. Collect all results
3. Merge findings into comprehensive report
</workflow>
```

## Cache and Performance Patterns

### Cache Configuration
```yaml
Analysis_Commands:
  ttl: 3600  # 1 hour cache
  invalidate_on: [file_changes, branch_switch]

Scan_Commands:
  ttl: 1800  # 30 minutes cache
  invalidate_on: [file_changes]

Build_Commands:
  ttl: 300   # 5 minutes cache
  invalidate_on: [any_change]
```

### Performance Optimization
- **Context Reuse**: Avoid redundant analysis within workflows
- **Cached Results**: Reuse expensive computations when possible
- **Batch Operations**: Group similar operations for efficiency
- **Lazy Loading**: Execute commands only when context is needed

## Risk Assessment Integration

### Risk-Based Workflow Modification
```yaml
High_Risk_Commands:
  - deploy, migrate, cleanup-*, delete-*
  triggers: [confirmation, backup, dry_run]

Medium_Risk_Commands:
  - refactor-*, update-dependencies, merge-*
  triggers: [plan_first, test_after]

Low_Risk_Commands:
  - analyze-*, scan-*, study-*
  triggers: []
```

### Risk Mitigation Patterns
- **High Risk**: Require explicit confirmation + backup creation
- **Medium Risk**: Mandate planning phase + post-execution validation
- **Low Risk**: Execute directly with standard logging

## Advanced Workflow Patterns

### Recursive Workflows
Commands that can invoke themselves or related commands:
```markdown
# Example: AGENT-improve-command
1. Analyze current command structure
2. Identify improvement opportunities
3. **If major structural changes needed:**
   - Invoke AGENT-create-command with enhanced requirements
4. **If minor improvements needed:**
   - Apply incremental enhancements
5. Validate improved command functionality
```

### Adaptive Workflows  
Workflows that learn and adapt based on outcomes:
```markdown
# Example: Repository analysis workflow
1. Estimate repository size and complexity
2. **If size > context window threshold:**
   - Switch to Gemini CLI execution
   - Use chunked analysis approach
3. **If standard size:**
   - Use Claude direct analysis
   - Apply standard patterns
4. Store approach decision for future reference
```

### Cross-Repository Workflows
Workflows spanning multiple repositories:
```markdown
# Example: Multi-repo dependency update
1. Analyze dependency usage across all repos
2. Plan coordinated update strategy  
3. Execute updates in dependency order
4. Validate integration across ecosystem
5. Submit coordinated PRs with cross-references
```

## Workflow Monitoring and Debugging

### Execution Tracking
- **Step Completion**: Track progress through workflow chains
- **Context Transfer**: Validate successful context passing
- **Error Propagation**: Handle failures gracefully
- **Performance Metrics**: Monitor workflow execution time

### Debug Patterns
```markdown
# Workflow debugging template
1. Capture initial state and context
2. Log each step execution and outputs
3. Validate context transfer between steps
4. **If step fails:**
   - Log failure details and context
   - Attempt recovery or alternative path
   - Update user with current status
5. **If workflow completes:**
   - Validate final outcomes
   - Store successful pattern for reuse
```

### Quality Assurance
- **Workflow Validation**: Ensure command chains are logical
- **Context Integrity**: Verify information flows correctly
- **Error Handling**: Test failure scenarios and recovery
- **Performance Testing**: Monitor workflow efficiency

These workflow patterns enable sophisticated automation that adapts to context, manages complexity, and maintains quality while executing complex development tasks through coordinated command chains.