# Performance Patterns

## Overview

Performance patterns and optimizations used throughout the Vue node system to maintain 60 FPS with hundreds of nodes.

## Core Performance Principles

### 1. Transform-Only Updates
Use CSS transforms instead of position/layout changes:

```css
/* BAD - Triggers layout */
.node {
  left: 100px;
  top: 100px;
}

/* GOOD - Compositor only */
.node {
  transform: translate(100px, 100px);
}
```

### 2. Single Container Transform
Transform one container instead of individual nodes:

```typescript
// BAD - O(n) DOM updates
nodes.forEach(node => {
  node.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`
})

// GOOD - O(1) DOM update
container.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`
```

### 3. RAF Batching
Batch all updates in requestAnimationFrame:

```typescript
let rafId: number | null = null
const pendingUpdates = new Set<() => void>()

const scheduleUpdate = (update: () => void) => {
  pendingUpdates.add(update)
  
  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      pendingUpdates.forEach(fn => fn())
      pendingUpdates.clear()
      rafId = null
    })
  }
}
```

## CSS Optimizations

### CSS Containment
Isolate node rendering:

```css
.lg-node {
  /* Isolate layout, style, and paint */
  contain: layout style paint;
  
  /* Isolate stacking context */
  isolation: isolate;
}
```

### GPU Acceleration
Enable hardware acceleration:

```css
.transform-pane {
  /* Promote to GPU layer */
  will-change: transform;
  
  /* Force GPU layer (fallback) */
  transform: translateZ(0);
}

/* Only during interaction */
.lg-node--dragging {
  will-change: transform;
}
```

### Efficient Selectors
Avoid expensive selectors:

```css
/* BAD - Deep descendant selector */
.graph .nodes .node .widget input { }

/* GOOD - Direct class */
.lg-widget-input { }
```

## JavaScript Optimizations

### 1. Viewport Culling
Only render visible nodes (now using QuadTree spatial indexing):

```typescript
// In useTransformState composable
const isNodeInViewport = (
  nodePos: ArrayLike<number>,
  nodeSize: ArrayLike<number>,
  viewport: { width: number; height: number },
  margin: number = 0.2 // 20% margin by default
): boolean => {
  // CRITICAL: Use correct coordinate transformation!
  // screen = (canvas + offset) * scale
  const screenPos = canvasToScreen({ x: nodePos[0], y: nodePos[1] })
  
  // Adjust margin based on zoom level
  let adjustedMargin = margin
  if (camera.z < 0.1) {
    adjustedMargin = Math.min(margin * 5, 2.0) // More aggressive at low zoom
  } else if (camera.z > 3.0) {
    adjustedMargin = Math.max(margin * 0.5, 0.05) // Tighter at high zoom
  }
  
  // Skip nodes too small to be visible
  const nodeScreenSize = Math.max(nodeSize[0], nodeSize[1]) * camera.z
  if (nodeScreenSize < 4) {
    return false
  }
  
  // Calculate expanded viewport bounds with margin
  const marginX = viewport.width * adjustedMargin
  const marginY = viewport.height * adjustedMargin
  
  const nodeRight = screenPos.x + nodeSize[0] * camera.z
  const nodeBottom = screenPos.y + nodeSize[1] * camera.z
  
  // Check if node is outside expanded viewport
  return !(
    nodeRight < -marginX ||
    screenPos.x > viewport.width + marginX ||
    nodeBottom < -marginY ||
    screenPos.y > viewport.height + marginY
  )
}
```

### 2. Dirty Checking
Only update changed nodes:

```typescript
const dirtyNodes = new Set<string>()

const markDirty = (nodeId: string) => {
  dirtyNodes.add(nodeId)
  scheduleUpdate(processDirtyNodes)
}

const processDirtyNodes = () => {
  for (const nodeId of dirtyNodes) {
    const node = nodeRefs.get(nodeId)
    if (node) {
      vueNodeData.set(nodeId, extractVueNodeData(node))
    }
  }
  dirtyNodes.clear()
}
```

### 3. Debouncing
Reduce update frequency:

```typescript
import { debounce } from 'lodash'

// Debounce expensive operations
const updateLayout = debounce(() => {
  recalculateNodePositions()
}, 100)

// Throttle high-frequency events
const handleMouseMove = throttle((event) => {
  updateCursor(event)
}, 16) // ~60fps
```

### 4. Memoization
Cache expensive computations:

```typescript
const memoizedGetBounds = memoize((node: VueNodeData) => {
  return calculateNodeBounds(node)
}, {
  max: 100, // Cache last 100 results
  maxAge: 1000 * 60 // 1 minute TTL
})
```

## Rendering Optimizations

### 1. v-memo for Lists
Optimize list rendering:

```vue
<LGraphNode
  v-for="node in visibleNodes"
  :key="node.id"
  v-memo="[
    node.title,
    node.selected,
    node.executing,
    nodePositions.get(node.id),
    nodeSizes.get(node.id)
  ]"
  :node-data="node"
/>
```

### 2. Lazy Component Loading
Load components on demand:

```typescript
const NodeComponent = defineAsyncComponent(() => 
  import('./LGraphNode.vue')
)
```

### 3. Slot Optimization
Avoid unnecessary slot rendering:

```vue
<template>
  <!-- Only render slot if content exists -->
  <div v-if="$slots.default" class="content">
    <slot />
  </div>
</template>
```

## Memory Optimizations

### 1. Object Pooling
Reuse objects to reduce GC pressure:

```typescript
class Vec2Pool {
  private pool: Array<{ x: number, y: number }> = []
  
  acquire(x = 0, y = 0) {
    const vec = this.pool.pop() || { x: 0, y: 0 }
    vec.x = x
    vec.y = y
    return vec
  }
  
  release(vec: { x: number, y: number }) {
    vec.x = 0
    vec.y = 0
    this.pool.push(vec)
  }
}

const vec2Pool = new Vec2Pool()
```

### 2. Structural Sharing
Minimize object creation:

```typescript
const updateNodeData = (id: string, updates: Partial<VueNodeData>) => {
  const current = vueNodeData.get(id)
  if (!current) return
  
  // Only create new object if values changed
  let hasChanges = false
  for (const key in updates) {
    if (current[key] !== updates[key]) {
      hasChanges = true
      break
    }
  }
  
  if (hasChanges) {
    vueNodeData.set(id, { ...current, ...updates })
  }
}
```

## Batch Operations

### 1. Bulk Updates
Process multiple changes together:

```typescript
const batchNodeUpdates = (updates: Map<string, Partial<VueNodeData>>) => {
  // Suspend reactivity
  const oldNodeData = new Map(vueNodeData)
  
  // Apply all updates
  for (const [id, changes] of updates) {
    const current = oldNodeData.get(id)
    if (current) {
      vueNodeData.set(id, { ...current, ...changes })
    }
  }
  
  // Single reactive flush
  nextTick(() => {
    // Vue updates DOM once
  })
}
```

### 2. Transaction Pattern
Group related operations:

```typescript
class NodeTransaction {
  private operations: Array<() => void> = []
  
  addNode(data: VueNodeData) {
    this.operations.push(() => {
      vueNodeData.set(data.id, data)
    })
    return this
  }
  
  updateNode(id: string, changes: Partial<VueNodeData>) {
    this.operations.push(() => {
      updateNodeData(id, changes)
    })
    return this
  }
  
  commit() {
    // Execute all operations at once
    this.operations.forEach(op => op())
    this.operations = []
  }
}
```

## Profiling and Monitoring

### Performance Metrics
Track key metrics:

```typescript
const metrics = reactive({
  fps: 0,
  frameTime: 0,
  nodeCount: 0,
  visibleNodeCount: 0,
  updateTime: 0
})

// FPS counter
let lastTime = performance.now()
let frames = 0

const updateMetrics = () => {
  frames++
  const now = performance.now()
  const elapsed = now - lastTime
  
  if (elapsed >= 1000) {
    metrics.fps = Math.round((frames * 1000) / elapsed)
    metrics.frameTime = elapsed / frames
    frames = 0
    lastTime = now
  }
}
```

### Performance Markers
Use User Timing API:

```typescript
const measureUpdate = (name: string, fn: () => void) => {
  performance.mark(`${name}-start`)
  fn()
  performance.mark(`${name}-end`)
  performance.measure(name, `${name}-start`, `${name}-end`)
  
  const measure = performance.getEntriesByName(name)[0]
  console.log(`${name}: ${measure.duration.toFixed(2)}ms`)
}

// Usage
measureUpdate('node-update', () => {
  updateAllNodes()
})
```

## Level of Detail (LOD)

### Dynamic Quality Based on Zoom
Adjust rendering detail by zoom level:

```typescript
const getLOD = (zoom: number): 'high' | 'medium' | 'low' => {
  if (zoom > 0.8) return 'high'
  if (zoom > 0.4) return 'medium'
  return 'low'
}

const nodeClass = computed(() => {
  const lod = getLOD(transform.scale)
  return `lg-node lg-node--lod-${lod}`
})
```

```css
/* Full detail */
.lg-node--lod-high .lg-widget { display: block; }

/* Reduced detail */
.lg-node--lod-medium .lg-widget-label { display: none; }

/* Minimal detail */
.lg-node--lod-low .lg-widget { display: none; }
.lg-node--lod-low .lg-node-body { display: none; }
```

## Best Practices

1. **Profile First** - Measure before optimizing
2. **Batch Updates** - Group DOM changes
3. **Use CSS Transforms** - Avoid layout thrashing
4. **Implement Culling** - Don't render off-screen content
5. **Debounce Events** - Reduce update frequency
6. **Cache Computations** - Memoize expensive operations
7. **Monitor Performance** - Track metrics in production
8. **Progressive Enhancement** - Start simple, optimize as needed