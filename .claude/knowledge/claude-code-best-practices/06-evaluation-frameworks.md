# Evaluation: Your Crown Jewels

While prompts are important, your evaluation suite (the set of test cases to measure prompt quality and performance) is often your most valuable intellectual property. Leading AI startups consider evals their secret weapon.

## Why Evaluations Matter

- **Objective measurement:** Know definitively whether a prompt change improves or degrades performance  
- **Iterative improvement:** Essential for knowing why a prompt works and for iterating effectively
- **Quality assurance:** Prevent regressions when updating prompts or switching models
- **Benchmarking:** Compare performance across different models or prompt variations

## Building Effective Evaluation Suites

1. **Diverse test cases:** Cover edge cases, typical scenarios, and failure modes
2. **Clear success criteria:** Define what "good" output looks like for each test case
3. **Automated scoring:** Where possible, use automated metrics (accuracy, format compliance, etc.)
4. **Human evaluation:** Include human judgment for nuanced tasks like tone, creativity, or ethical reasoning
5. **Representative data:** Use real-world data that matches your production use cases

## Evaluation-Driven Development

```
1. Define success metrics for your task
2. Create comprehensive test cases  
3. Baseline current prompt performance
4. Iterate on prompts using meta-prompting and other techniques
5. Run evaluations to measure improvement
6. Deploy only changes that improve eval scores
```

**Pro tip:** Start building your evaluation suite early, even before perfecting your prompts. The insights from systematic evaluation often reveal prompt improvement opportunities you wouldn't have discovered otherwise.

## Best Practices for Command Evaluation

When creating new Claude Code commands, build an evaluation framework:

### 1. Test Case Structure

```md
# Test Cases for [Command Name]

## Test Case 1: Basic Usage
**Input:** $ARGUMENTS = "simple task"
**Expected Output:** [Describe expected behavior]
**Success Criteria:** 
- [ ] Completes task correctly
- [ ] Follows all specified steps
- [ ] Produces expected output format

## Test Case 2: Edge Case
**Input:** $ARGUMENTS = "complex edge case"
**Expected Output:** [Describe handling]
**Success Criteria:**
- [ ] Handles edge case gracefully
- [ ] Provides appropriate error messages
- [ ] Maintains consistency
```

### 2. Performance Metrics

Track these metrics across test runs:
- **Success rate:** Percentage of test cases passed
- **Token efficiency:** Average tokens used per task
- **Time to completion:** How long tasks take
- **Error recovery:** How well the command handles failures
- **User intervention needed:** How often manual correction is required

### 3. Iterative Refinement

1. Run initial tests with your draft command
2. Identify failure patterns
3. Use meta-prompting to improve weak areas
4. Re-test and compare metrics
5. Document what changes improved performance

### 4. Version Control

Keep versions of your commands with their evaluation scores:

```md
# Command Version History

## v1.0 - Initial Release
- Success rate: 75%
- Common failures: Missed edge cases

## v1.1 - Improved Error Handling
- Success rate: 85%
- Added: Better error messages
- Fixed: Edge case handling

## v2.0 - Performance Optimization
- Success rate: 92%
- Token usage: -30%
- Added: Parallel processing
```

This systematic approach ensures your commands improve over time and maintain quality as requirements evolve.