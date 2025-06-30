# Scan Error Handling

I need to analyze error handling patterns in: $ARGUMENTS

## Your Task

Evaluate error handling completeness, consistency, and recovery strategies.

## Execution Steps

1. **Missing Error Handling**
   - Unhandled promise rejections
   - Missing try-catch blocks
   - Uncaught async errors
   - Network calls without error handling
   - File operations without checks

2. **Poor Error Patterns**
   - Catching and ignoring errors
   - Generic catch blocks
   - No error logging
   - Missing error context
   - Swallowing specific errors

3. **User Experience**
   - Generic error messages
   - No fallback UI/components
   - Missing loading states
   - No retry mechanisms
   - Poor error boundaries (React)

4. **Error Recovery**
   - No graceful degradation
   - Missing rollback logic
   - No circuit breakers
   - Cascading failures
   - Resource cleanup missing

5. **Monitoring Gaps**
   - Errors not reported
   - Missing error metadata
   - No error categorization
   - Performance impact not tracked
   - No alerting configuration

## Report Format

```
## Error Handling Analysis

### Critical Gaps
- [File:Line]: Async operation with no error handling
  Risk: App crash on network failure
  Fix: Add try-catch with user feedback

### Poor Patterns
- [File:Line]: catch(e) {} - Error swallowed
  Fix: Log error and handle appropriately

### User Experience Issues
- [Component]: No error boundary
  Impact: Entire app crashes on error
  Fix: Add ErrorBoundary component

### Missing Recovery
- [Operation]: No retry logic
  Fix: Add exponential backoff retry

### Monitoring Gaps
- X% of errors not logged
- No error reporting service configured

### Recommendations
1. Implement global error handler
2. Add error boundaries to key components
3. Standardize error messages
```