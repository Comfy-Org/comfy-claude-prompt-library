# Scan Performance Issues

I need to analyze performance characteristics of: $ARGUMENTS

## Your Task

Profile code for performance bottlenecks, inefficient algorithms, and resource usage issues.

## Execution Steps

1. **Algorithm Complexity Analysis**
   - Identify O(n²) or worse algorithms
   - Nested loops with large datasets
   - Recursive functions without memoization
   - Inefficient sorting/searching

2. **Database Performance**
   - N+1 query patterns
   - Missing database indexes
   - Unnecessary data fetching
   - Inefficient joins or subqueries
   - No query result caching

3. **Memory Usage Patterns**
   - Memory leaks (event listeners, closures)
   - Large object allocations
   - Unnecessary data copying
   - Missing cleanup in useEffect/componentWillUnmount

4. **Rendering Performance (Frontend)**
   - Unnecessary re-renders
   - Missing React.memo/useMemo/useCallback
   - Large component trees
   - Expensive computations in render
   - Missing virtualization for long lists

5. **Network Performance**
   - Waterfall loading instead of parallel
   - Missing compression
   - No caching headers
   - Large payload sizes
   - Chatty APIs (too many requests)

## Report Format

```
## Performance Analysis

### Critical Performance Issues
- [Issue]: [File:Line] - Impact: [Time/Memory]
  Fix: [Optimization approach]

### Algorithm Complexity
- [Function]: O(n²) complexity detected
  Suggestion: [Better algorithm]

### Database Optimization
- [Query Location]: N+1 pattern found
  Fix: Use eager loading/joins

### Memory Concerns
- [Component/Function]: Potential memory leak
  Fix: [Cleanup approach]

### Quick Wins
- Enable compression: ~70% reduction
- Add caching: ~50ms saved per request
```