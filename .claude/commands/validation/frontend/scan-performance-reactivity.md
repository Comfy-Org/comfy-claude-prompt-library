# Scan Performance & Reactivity

I need to analyze performance and reactivity patterns for: $ARGUMENTS

## Your Task

Check for performance optimization, memory leaks, and proper reactivity patterns in Vue components.

## Execution Steps

1. **Memoization and Reactivity Patterns**
   - Missing `computed()` for derived state
   - Unnecessary `ref()` vs `reactive()` usage
   - Missing memoization in expensive calculations
   - Reactive data that should be readonly
   - Over-reactive patterns causing unnecessary updates

2. **Flush Timing and DOM Interactions**
   - Missing `flush: 'post'` when reacting to DOM changes
   - Watchers accessing DOM elements before they're rendered
   - DOM-dependent reactions in wrong timing phase
   - `nextTick()` usage vs proper flush timing
   - Component interactions dependent on rendered elements

3. **Memory Leak Prevention**
   - Event listeners not cleaned up in `onBeforeUnmount`
   - Timers and intervals without cleanup
   - Async operations without cancellation
   - Missing debounce/throttle cleanup
   - WebSocket or EventSource connections not closed
   - Observer patterns without unsubscription

4. **VueUse Functions Utilization**
   - Manual implementations that could use VueUse
   - Common patterns available in VueUse library
   - Performance-enhancing composables not utilized
   - Missing reactive utilities for common operations
   - Reinventing functionality available in VueUse

5. **Unnecessary Re-renders**
   - Missing `shallowRef()` for large objects
   - Reactive objects when primitive refs suffice
   - Missing `readonly()` for immutable data
   - Function recreations in templates
   - Prop mutations causing parent re-renders

## Report Format

```
## Performance & Reactivity Analysis

### Critical Memory Leaks
- [Component]: Event listener not cleaned up
  Fix: Add removeEventListener in onBeforeUnmount
  
- [Component]: Timer without cleanup
  Fix: Clear interval/timeout in onBeforeUnmount

### Flush Timing Issues  
- [Watcher]: Accessing DOM before render
  Fix: Add { flush: 'post' } to watch options

### VueUse Opportunities
- [Component]: Manual implementation of [pattern]
  Fix: Use [VueUse function] from @vueuse/core
  
Available VueUse functions for common patterns:
• DOM: useElementSize, useElementVisibility, useIntersectionObserver
• Events: useEventListener, useKeyModifier, useMagicKeys
• State: useLocalStorage, useSessionStorage, useToggle
• Async: useAsyncState, useFetch, useTimeoutFn
• Performance: useDebounceFn, useThrottleFn, useMemoize
• Media: useMediaQuery, useBreakpoints, useDevicePixelRatio
• Sensors: useMouse, usePointer, useSwipe, useGeolocation
• Animation: useTransition, useSpring, useMotion
• Utilities: useClipboard, useShare, useColorMode, useDark

### Reactivity Anti-patterns
- [Component]: Using reactive() for primitive value
  Fix: Use ref() for single values
  
- [Component]: Missing computed() for derived data
  Fix: Replace function with computed property

### Performance Optimizations
- Use shallowRef for large objects: X locations
- Add readonly() for immutable data: Y locations  
- Implement debounce/throttle: Z user interactions
```

## Important Notes

- Emphasize VueUse functions heavily - check against comprehensive list
- Focus on flush timing for DOM-dependent watchers
- Memory leak prevention is critical for long-running applications
- Consider component lifecycle when suggesting optimizations
- Balance performance with code readability and maintainability