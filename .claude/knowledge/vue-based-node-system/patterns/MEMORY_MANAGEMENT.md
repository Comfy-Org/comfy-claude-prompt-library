# Memory Management Patterns

## Overview

Proper memory management is critical for the Vue node system to prevent memory leaks and ensure smooth performance with hundreds of nodes.

## Memory Strategies

### 1. WeakMap for Metadata
Use WeakMap for temporary data that should be garbage collected with nodes:

```typescript
// Automatically cleaned up when node is removed
const nodeMetadata = new WeakMap<LGraphNode, {
  lastChecksum: string
  lastWidgetCount: number
  renderCount: number
}>()

// Usage
const metadata = nodeMetadata.get(node) || {
  lastChecksum: '',
  lastWidgetCount: 0,
  renderCount: 0
}
nodeMetadata.set(node, metadata)
```

**Benefits:**
- No manual cleanup needed
- Prevents memory leaks
- Perfect for caching computed values

### 2. Map for Reactive State
Use Map with explicit cleanup for reactive Vue state:

```typescript
// Reactive state that needs manual cleanup
const vueNodeData = reactive(new Map<string, VueNodeData>())
const nodePositions = reactive(new Map<string, Position>())
const nodeSizes = reactive(new Map<string, Size>())

// Cleanup function
const cleanupNode = (nodeId: string) => {
  vueNodeData.delete(nodeId)
  nodePositions.delete(nodeId)
  nodeSizes.delete(nodeId)
}

// In node removal handler
graph.onNodeRemoved = (node: LGraphNode) => {
  cleanupNode(String(node.id))
}
```

### 3. Non-Reactive References
Store LiteGraph references without Vue reactivity:

```typescript
// Use shallowRef to prevent deep reactivity
const graphRef = shallowRef<LGraph | null>(null)
const canvasRef = shallowRef<LGraphCanvas | null>(null)

// Regular Map for node references
const nodeRefs = new Map<string, LGraphNode>()
```

## Common Memory Leaks and Solutions

### 1. Event Listener Leaks
**Problem:** Forgetting to remove event listeners

**Solution:** Always clean up in onUnmounted
```typescript
onMounted(() => {
  window.addEventListener('resize', handleResize)
  graph.onNodeAdded = handleNodeAdded
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (graph) {
    graph.onNodeAdded = null
  }
})
```

### 2. RAF Loop Leaks
**Problem:** Animation frames continuing after component unmount

**Solution:** Cancel RAF on cleanup
```typescript
let rafId: number | null = null

const startLoop = () => {
  const frame = () => {
    // Do work
    rafId = requestAnimationFrame(frame)
  }
  rafId = requestAnimationFrame(frame)
}

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})
```

### 3. Circular References
**Problem:** Vue components holding references to LiteGraph nodes

**Solution:** Extract data instead of storing references
```typescript
// BAD - Creates circular reference
const nodes = ref<LGraphNode[]>([])

// GOOD - Extract safe data
const nodeData = ref<VueNodeData[]>([])
```

### 4. Closure Leaks
**Problem:** Closures capturing large objects

**Solution:** Be explicit about captured variables
```typescript
// BAD - Captures entire graph object
const callback = () => {
  console.log(graph._nodes.length)
}

// GOOD - Capture only needed value
const nodeCount = graph._nodes.length
const callback = () => {
  console.log(nodeCount)
}
```

## Cleanup Patterns

### Component Cleanup
Standard cleanup in Vue components:

```typescript
export default defineComponent({
  setup() {
    // Resources that need cleanup
    const resources = {
      timers: new Set<number>(),
      listeners: new Map<string, Function>(),
      subscriptions: new Set<() => void>()
    }
    
    // Cleanup function
    const cleanup = () => {
      // Clear timers
      resources.timers.forEach(id => clearTimeout(id))
      resources.timers.clear()
      
      // Remove listeners
      resources.listeners.forEach((handler, event) => {
        window.removeEventListener(event, handler)
      })
      resources.listeners.clear()
      
      // Unsubscribe
      resources.subscriptions.forEach(unsub => unsub())
      resources.subscriptions.clear()
    }
    
    // Auto cleanup on unmount
    onUnmounted(cleanup)
    
    return { cleanup }
  }
})
```

### Composable Cleanup
Pattern for composables:

```typescript
export function useNodeManager() {
  // State
  const state = {
    nodes: new Map(),
    metadata: new WeakMap(),
    rafId: null as number | null
  }
  
  // Cleanup function
  const cleanup = () => {
    // Stop RAF
    if (state.rafId) {
      cancelAnimationFrame(state.rafId)
    }
    
    // Clear maps
    state.nodes.clear()
    
    // Remove event listeners
    if (graphRef.value) {
      graphRef.value.onNodeAdded = null
      graphRef.value.onNodeRemoved = null
    }
  }
  
  // Auto cleanup if used in component
  if (getCurrentInstance()) {
    onUnmounted(cleanup)
  }
  
  return {
    ...methods,
    cleanup
  }
}
```

## Memory Monitoring

### Debug Utilities
Tools for monitoring memory usage:

```typescript
const memoryStats = reactive({
  nodeCount: 0,
  widgetCount: 0,
  mapSizes: {} as Record<string, number>,
  heapUsed: 0
})

const updateMemoryStats = () => {
  memoryStats.nodeCount = vueNodeData.size
  memoryStats.widgetCount = Array.from(vueNodeData.values())
    .reduce((sum, node) => sum + (node.widgets?.length || 0), 0)
  
  memoryStats.mapSizes = {
    vueNodeData: vueNodeData.size,
    nodePositions: nodePositions.size,
    nodeSizes: nodeSizes.size,
    nodeRefs: nodeRefs.size
  }
  
  if (performance.memory) {
    memoryStats.heapUsed = performance.memory.usedJSHeapSize
  }
}
```

### Memory Leak Detection
Pattern for detecting leaks in development:

```typescript
if (import.meta.env.DEV) {
  // Track object counts
  const objectCounts = new Map<string, number>()
  
  const trackObject = (type: string, delta: number) => {
    const current = objectCounts.get(type) || 0
    objectCounts.set(type, current + delta)
  }
  
  // Monitor for leaks
  setInterval(() => {
    console.log('Object counts:', Object.fromEntries(objectCounts))
    
    // Warn if counts keep growing
    for (const [type, count] of objectCounts) {
      if (count > 1000) {
        console.warn(`Possible memory leak: ${type} count = ${count}`)
      }
    }
  }, 10000)
}
```

## Best Practices

### 1. Prefer WeakMap for Caching
```typescript
// Good for caching computed values
const computedCache = new WeakMap<LGraphNode, {
  bounds: DOMRect
  checksum: string
}>()
```

### 2. Explicit Cleanup
```typescript
// Always provide cleanup methods
export function createNodeRenderer() {
  const state = { /* ... */ }
  
  const cleanup = () => {
    // Explicit cleanup logic
  }
  
  return { render, cleanup }
}
```

### 3. Avoid Global State
```typescript
// BAD - Global state is hard to clean up
const globalNodes = new Map()

// GOOD - Scoped to composable instance
export function useNodes() {
  const nodes = new Map()
  return { nodes }
}
```

### 4. Use Object Pools
For frequently created/destroyed objects:

```typescript
class NodePool {
  private pool: VueNodeData[] = []
  
  acquire(): VueNodeData {
    return this.pool.pop() || this.createNew()
  }
  
  release(node: VueNodeData) {
    this.reset(node)
    this.pool.push(node)
  }
  
  private reset(node: VueNodeData) {
    node.widgets = undefined
    node.selected = false
    node.executing = false
  }
}
```

### 5. Monitor in Production
Add memory monitoring for production:

```typescript
// Periodic memory check
setInterval(() => {
  if (performance.memory) {
    const mb = performance.memory.usedJSHeapSize / 1024 / 1024
    if (mb > 500) {
      console.warn(`High memory usage: ${mb.toFixed(2)}MB`)
      // Could trigger cleanup or notify monitoring service
    }
  }
}, 60000) // Every minute
```

## Memory Optimization Strategies

### 1. Lazy Loading
Only load what's needed:
```typescript
const visibleNodes = computed(() => {
  return nodes.value.filter(node => isInViewport(node))
})
```

### 2. Data Virtualization
For large lists:
```typescript
const virtualizedWidgets = computed(() => {
  const start = scrollIndex.value
  const end = start + visibleCount.value
  return allWidgets.value.slice(start, end)
})
```

### 3. Debounced Updates
Reduce memory churn:
```typescript
const debouncedUpdate = debounce(() => {
  updateNodeData()
}, 100)
```

### 4. Structural Sharing
Reuse unchanged objects:
```typescript
const updateNode = (id: string, changes: Partial<VueNodeData>) => {
  const current = vueNodeData.get(id)
  if (current) {
    // Only create new object if something changed
    const updated = { ...current, ...changes }
    vueNodeData.set(id, updated)
  }
}
```