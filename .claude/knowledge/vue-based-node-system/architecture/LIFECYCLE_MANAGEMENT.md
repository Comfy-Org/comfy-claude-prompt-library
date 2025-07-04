# Lifecycle Management Architecture

## Overview

The Vue node system uses an event-driven lifecycle management approach that responds to LiteGraph events rather than polling for changes. This ensures optimal performance and maintains synchronization between canvas and DOM rendering.

## Core Lifecycle Phases

### 1. Initialization Phase
```typescript
const initializeNodeManager = (graph: LGraph, canvas: LGraphCanvas) => {
  // Store references
  graphRef.value = graph
  canvasRef.value = canvas
  
  // Set up event listeners
  setupGraphEventListeners(graph)
  
  // Start RAF-based change detection
  startChangeDetection()
  
  // Process existing nodes
  if (graph._nodes) {
    graph._nodes.forEach(node => {
      nodeManager.onNodeAdded(node)
    })
  }
}
```

### 2. Node Addition
When a node is added to the graph:
```typescript
graph.onNodeAdded = (node: LGraphNode) => {
  const id = String(node.id)
  
  // Phase 1: Store non-reactive reference
  nodeRefs.set(id, node)
  
  // Phase 2: Set up widget callbacks (CRITICAL ORDER!)
  setupNodeWidgetCallbacks(node)
  
  // Phase 3: Extract safe data (now with proper callbacks)
  const nodeData = extractVueNodeData(node)
  vueNodeData.set(id, nodeData)
  
  // Phase 4: Initialize reactive state
  nodeState.set(id, {
    visible: true,
    dirty: false,
    lastUpdate: performance.now(),
    culled: false
  })
  
  // Phase 5: Initialize position/size
  nodePositions.set(id, { x: node.pos[0], y: node.pos[1] })
  nodeSizes.set(id, { width: node.size[0], height: node.size[1] })
}
```

**Critical**: Widget callbacks MUST be set up before data extraction to ensure:
1. Extracted callback references are the wrapped versions
2. Widget values will be properly updated when callbacks fire
3. Vue state stays synchronized with LiteGraph state

### 3. Node Updates
Continuous monitoring for changes via RAF:
```typescript
const detectChangesInRAF = () => {
  if (!graph?._nodes) return
  
  for (const node of graph._nodes) {
    const id = String(node.id)
    
    // Check position changes
    updateNodePosition(id, node)
    
    // Check size changes
    updateNodeSize(id, node)
    
    // Check selection state
    updateNodeSelection(id, node)
    
    // Mark dirty if widgets changed
    if (hasWidgetChanges(id, node)) {
      markNodeDirty(id)
    }
  }
  
  // Process dirty nodes
  processDirtyNodes()
}
```

### 4. Node Removal
Complete cleanup when nodes are removed:
```typescript
graph.onNodeRemoved = (node: LGraphNode) => {
  const id = String(node.id)
  
  // Remove from all tracking maps
  nodeRefs.delete(id)
  vueNodeData.delete(id)
  nodeState.delete(id)
  nodePositions.delete(id)
  nodeSizes.delete(id)
  
  // Clear any pending updates
  dirtyNodes.delete(id)
}
```

### 5. Cleanup Phase
```typescript
const cleanup = () => {
  // Stop RAF loop
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  // Remove event listeners
  if (graphRef.value) {
    graphRef.value.onNodeAdded = null
    graphRef.value.onNodeRemoved = null
    graphRef.value.onNodeSelected = null
    graphRef.value.onNodeDeselected = null
  }
  
  // Clear all maps
  nodeRefs.clear()
  vueNodeData.clear()
  nodeState.clear()
  nodePositions.clear()
  nodeSizes.clear()
}
```

## Event System

### LiteGraph Events
The system listens to these core LiteGraph events:

| Event | Purpose | Handler |
|-------|---------|---------|
| `onNodeAdded` | Node created | Add to Vue state |
| `onNodeRemoved` | Node deleted | Clean up references |
| `onNodeSelected` | Selection change | Update selection state |
| `onNodeDeselected` | Selection cleared | Update selection state |
| `onExecutionStart` | Node executing | Update execution state |
| `onExecutionEnd` | Execution complete | Clear execution state |

### Custom Events
Additional events for Vue-specific needs:
```typescript
// Viewport culling events
nodeManager.on('node-culled', (nodeId) => {
  nodeState.get(nodeId).culled = true
})

nodeManager.on('node-visible', (nodeId) => {
  nodeState.get(nodeId).culled = false
})
```

## State Management

### State Hierarchy
```
┌─────────────────────────────────────┐
│         LiteGraph State             │
│  (Position, Size, Properties)       │
└────────────┬────────────────────────┘
             │ Events
┌────────────▼────────────────────────┐
│      Node Manager State             │
│  (Refs, Metadata, Tracking)         │
└────────────┬────────────────────────┘
             │ Reactive Updates
┌────────────▼────────────────────────┐
│        Vue Component State          │
│    (Rendered Nodes, Widgets)        │
└─────────────────────────────────────┘
```

### State Types

#### Non-Reactive State
```typescript
// Direct node references (not wrapped by Vue)
const nodeRefs = new Map<string, LGraphNode>()

// Metadata that doesn't trigger renders
const nodeMetadata = new WeakMap<LGraphNode, {
  lastWidgetCount: number
  lastChecksum: string
}>()
```

#### Reactive State
```typescript
// Vue-reactive data for rendering
const vueNodeData = reactive(new Map<string, VueNodeData>())

// Reactive positions for smooth updates
const nodePositions = reactive(new Map<string, Position>())

// Reactive sizes for layout
const nodeSizes = reactive(new Map<string, Size>())
```

## Performance Optimizations

### 1. RAF Batching
All updates batched in single animation frame:
```typescript
let animationFrameId: number | null = null

const startChangeDetection = () => {
  const frame = () => {
    detectChangesInRAF()
    animationFrameId = requestAnimationFrame(frame)
  }
  animationFrameId = requestAnimationFrame(frame)
}
```

### 2. Dirty Checking
Only re-extract data when needed:
```typescript
const hasWidgetChanges = (id: string, node: LGraphNode) => {
  const metadata = nodeMetadata.get(node)
  const currentCount = node.widgets?.length || 0
  
  if (metadata?.lastWidgetCount !== currentCount) {
    return true
  }
  
  // Deep check only if count matches
  return hasDeepWidgetChanges(node, metadata)
}
```

### 3. Viewport Culling
Skip processing for off-screen nodes:
```typescript
const updateVisibility = (nodeId: string, node: LGraphNode) => {
  const inViewport = isNodeInViewport(node)
  const state = nodeState.get(nodeId)
  
  if (state.visible !== inViewport) {
    state.visible = inViewport
    if (!inViewport) {
      // Skip further updates for culled nodes
      return false
    }
  }
  return true
}
```

## Memory Management

### Preventing Leaks
1. **WeakMap for temporary data** - Auto garbage collection
2. **Explicit cleanup** - Remove from Maps on node removal
3. **Event listener cleanup** - Null out handlers on destroy
4. **RAF cancellation** - Stop animation frames on unmount

### Reference Management
```typescript
// Safe reference storage pattern
const storeNodeReference = (node: LGraphNode) => {
  const id = String(node.id)
  
  // Non-reactive storage
  nodeRefs.set(id, node)
  
  // Extract data immediately
  const data = extractVueNodeData(node)
  vueNodeData.set(id, data)
  
  // Never store node in reactive state!
}
```

## Error Boundaries

### Node Processing Errors
```typescript
const safeProcessNode = (node: LGraphNode) => {
  try {
    return extractVueNodeData(node)
  } catch (error) {
    console.error(`Failed to process node ${node.id}:`, error)
    return createFallbackNodeData(node)
  }
}
```

### Event Handler Protection
```typescript
const wrapEventHandler = (handler: Function) => {
  return (...args: any[]) => {
    try {
      handler(...args)
    } catch (error) {
      console.error('Event handler error:', error)
      // Continue processing other nodes
    }
  }
}
```

## Debugging Support

### Lifecycle Metrics
```typescript
const metrics = {
  nodesAdded: 0,
  nodesRemoved: 0,
  nodesUpdated: 0,
  rafCycles: 0,
  averageUpdateTime: 0
}
```

### Debug Events
```typescript
// Enable detailed logging
if (DEBUG_MODE) {
  nodeManager.on('node-added', (node) => {
    console.log('[Lifecycle] Node added:', node.id)
  })
  
  nodeManager.on('node-dirty', (nodeId) => {
    console.log('[Lifecycle] Node marked dirty:', nodeId)
  })
}
```

## Best Practices

1. **Always extract data during events** - Don't access nodes during render
2. **Use RAF for continuous updates** - Batch all changes
3. **Clean up thoroughly** - Prevent memory leaks
4. **Handle errors gracefully** - Don't break the entire graph
5. **Optimize for common case** - Most frames have no changes