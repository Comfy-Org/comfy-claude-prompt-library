# Transform Performance Monitoring

## Issue Title
[Feature Request] Built-in performance monitoring for transform operations

## Issue Body

Hello! First, I want to say that Vue Flow's performance is impressive - the single transform container pattern is genuinely brilliant.

While building performance-critical applications with Vue Flow, I've found myself wanting deeper insights into transform performance. I'd love to discuss the possibility of built-in performance monitoring.

### The Idea

A lightweight, opt-in performance monitoring system that tracks:
- Transform update frequency
- Frame timing during pan/zoom operations  
- Node render counts
- Reflow/repaint triggers

### Potential Implementation

```typescript
interface PerformanceMetrics {
  transformUpdates: number
  averageFrameTime: number
  nodeRenderCount: number
  edgeRenderCount: number
  lastFrameTime: number
}

// In useVueFlow composable
const { enablePerformanceMonitoring } = useVueFlow()
const metrics = enablePerformanceMonitoring() // Returns ref<PerformanceMetrics>

// Usage in userland
watch(metrics, (newMetrics) => {
  if (newMetrics.averageFrameTime > 16.67) {
    console.warn('Frame drops detected during transform')
  }
})
```

### Use Cases

1. **Development optimization** - Identify performance bottlenecks during development
2. **Production monitoring** - Track real-world performance across different devices
3. **Regression testing** - Ensure performance doesn't degrade with updates
4. **Dynamic optimization** - Adjust quality settings based on device performance

### Current Workaround

I'm currently wrapping the Transform component to add monitoring:

```vue
<template>
  <Transform v-bind="$attrs" @vue:updated="onTransformUpdate" />
</template>

<script setup>
const frameTimings = []
const onTransformUpdate = () => {
  const now = performance.now()
  frameTimings.push(now)
  // Calculate metrics...
}
</script>
```

But built-in support would be cleaner and could access internal timings.

### Questions

1. **Is performance monitoring something you've considered?** I saw the excellent TypeScript types for viewport transforms but no performance APIs.

2. **Would this fit Vue Flow's philosophy?** I know you value a clean API surface.

3. **Alternative approaches?** Perhaps a plugin system where performance monitoring could be one example?

### Why Built-in Makes Sense

- Vue Flow already has the perfect observation points in the transform system
- Could leverage Vue's built-in scheduler APIs
- Minimal overhead when disabled
- Would help users optimize their node/edge implementations

### I'd Be Happy To

- Create a proof-of-concept implementation
- Research performance API best practices from other libraries
- Document performance optimization patterns I've discovered

Thanks for considering this! Even if it's not a fit for core, I'd love to hear your thoughts on performance monitoring in node-based UIs.

P.S. The recent shallowRef optimizations were great - noticed the improvement in our large graphs!

## Why This Issue Works

1. **Adds Value**: Performance monitoring is universally useful
2. **Shows Expertise**: Demonstrates understanding of performance concerns
3. **Concrete Proposal**: Not just "make it faster" but specific implementation ideas
4. **Flexible Approach**: Open to alternatives like plugin system
5. **Offers to Help**: Shows commitment to contributing
6. **Acknowledges Recent Work**: Shows you're paying attention to their optimization efforts