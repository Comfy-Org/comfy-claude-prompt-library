# Scan Vue 3.5 & Component Patterns

I need to check Vue 3.5 composition patterns and component communication for: $ARGUMENTS

## Your Task

Analyze Vue components for Vue 3.5 best practices, composition API usage, and proper component communication patterns.

## Execution Steps

1. **Vue 3.5 Composition API Compliance**
   - Props destructuring usage (Vue 3.5 style without `props` variable)
   - Options API vs Composition API detection
   - Proper `ref`, `reactive`, `computed`, `watch`, `watchEffect` usage
   - Missing setup function or `<script setup>` tags
   - Incorrect or mixed API patterns

2. **Lifecycle Hook Timing**
   - `onBeforeMounted` vs `onMounted` usage patterns
   - `onBeforeUnmount` vs `onUnmount` timing considerations
   - Missing lifecycle cleanup in `onBeforeUnmount`
   - Incorrect lifecycle hook placement
   - DOM-dependent operations in wrong lifecycle phase

3. **Component Communication Patterns**
   - Event-based patterns (`emit/@event-name`) for state changes/notifications
   - `defineExpose` with refs only for imperative operations (form.validate(), modal.open(), editor.focus())
   - Loose coupling through events vs tight coupling with exposed methods
   - Missing or incorrect emits typing with `defineEmits<{...}>()`
   - Prop drilling vs `provide/inject` usage

4. **Props & Emits Definitions**
   - Proper props destructuring without `props` variable
   - Missing `defineProps<{...}>()` type definitions
   - Better emit typing: `defineEmits<{ eventName: [payload: Type] }>()`
   - Missing prop validators or default values
   - Reactive props destructuring patterns

5. **Dependency Injection Patterns**
   - `provide/inject` for cross-component communication
   - Prop drilling detection (props passed through multiple levels)
   - Missing injection keys or type safety
   - Overuse of provide/inject for simple parent-child communication
   - Context vs props decision patterns

## Report Format

```
## Vue 3.5 Pattern Analysis

### Critical Pattern Violations
- [Issue]: [File:Line] - [Description]
  Fix: [Specific Vue 3.5 pattern to use]

### Composition API Issues
- [Component]: Using Options API instead of Composition API
  Fix: Migrate to <script setup> with defineProps/defineEmits

### Lifecycle Hook Problems
- [Component]: DOM operation in onMounted should be onBeforeMounted
  Fix: Move to appropriate lifecycle phase

### Communication Anti-patterns
- [Component]: Using expose for state changes
  Fix: Replace with emit event for loose coupling
  
- [Component]: Prop drilling detected (3+ levels deep)
  Fix: Use provide/inject for cross-component state

### Props/Emits Typing
- [Component]: Missing emit typing
  Fix: Use defineEmits<{ eventName: [payload: Type] }>()

### Quick Wins
- Convert X components to Composition API
- Add proper emit typing to Y components
- Replace Z prop drilling chains with provide/inject
```

## Important Notes

- Focus on Vue 3.5 destructuring patterns without `props` variable
- Emphasize loose coupling through events over tight coupling with expose
- Check for proper lifecycle timing, especially DOM-dependent operations
- Validate emit typing patterns for better type safety
- Consider component hierarchy when suggesting provide/inject vs props