# Scan for Memory Leaks

I need to identify potential memory leaks in: $ARGUMENTS

## Your Task

Detect patterns that commonly cause memory leaks in JavaScript/TypeScript applications.

## Execution Steps

1. **Event Listener Leaks**
   - addEventListener without removeEventListener
   - Global event handlers
   - Window/document listeners in components
   - WebSocket listeners not cleaned
   - Observer patterns without unsubscribe

2. **React/Vue Memory Leaks**
   - Missing cleanup in useEffect
   - Timers not cleared
   - Subscriptions not unsubscribed
   - Refs holding large objects
   - Closures capturing components

3. **DOM Reference Leaks**
   - Detached DOM nodes kept in memory
   - Large data in data attributes
   - Global references to DOM elements
   - jQuery handlers not removed
   - Cached query selectors

4. **Data Structure Leaks**
   - Unbounded caches/maps
   - Circular references
   - Large arrays never cleared
   - Global state accumulation
   - Console.log keeping references

5. **Async Operation Leaks**
   - Promises never settling
   - Uncancelled requests
   - Long polling without cleanup
   - Worker threads not terminated
   - Open connections not closed

## Report Format

```
## Memory Leak Analysis

### High Risk Patterns
- [Component]: Timer not cleared in cleanup
  Location: [File:Line]
  Fix: Clear timer in cleanup function

### Event Listener Leaks
- [File:Line]: Global listener never removed
  Fix: Store reference and remove on cleanup

### React-Specific Issues
- [Component]: Missing useEffect cleanup
  Impact: Subscription leak on unmount
  Fix: Return cleanup function

### Data Structure Issues
- [Cache]: Unbounded growth detected
  Fix: Implement LRU eviction

### Quick Fixes
1. Add cleanup to X components
2. Implement WeakMap for Y cache
3. Clear intervals in Z locations
```