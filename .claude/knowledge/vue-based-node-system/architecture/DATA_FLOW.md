# Data Flow Architecture

## Overview

The Vue-based node system implements a unidirectional data flow where LiteGraph remains the source of truth, and Vue components are pure rendering layers.

## Core Data Flow Pattern

```
LiteGraph Node (Source of Truth)
    ↓ [onNodeAdded event]
useGraphNodeManager
    ↓ [extractVueNodeData()]
VueNodeData (Safe extracted data)
    ↓ [Reactive state]
Vue Components (Render only)
    ↓ [User interaction]
Widget Callbacks
    ↓ [Update LiteGraph]
LiteGraph Node (Updated)
```

## Key Principles

### 1. LiteGraph as Single Source of Truth
- All node state lives in LiteGraph
- Vue never owns or mutates node state directly
- Changes flow through LiteGraph's API

### 2. Safe Data Extraction
- Extract data during LiteGraph events
- Create serializable VueNodeData objects
- Avoid Vue proxy wrapping of LiteGraph nodes

### 3. Event-Driven Updates
- Listen to LiteGraph lifecycle events
- Update Vue state in response to events
- No polling or continuous synchronization

## Data Structures

### VueNodeData Interface
```typescript
export interface VueNodeData {
  id: string
  title: string
  type: string
  mode: number
  selected: boolean
  executing: boolean
  widgets?: SafeWidgetData[]
  inputs?: unknown[]
  outputs?: unknown[]
}
```

### SafeWidgetData Interface
```typescript
export interface SafeWidgetData {
  name: string
  type: string
  value: unknown
  options?: Record<string, unknown>
  callback?: ((value: unknown) => void) | undefined
}
```

## Lifecycle Events

### Node Addition
```typescript
graph.onNodeAdded = (node: LGraphNode) => {
  const id = String(node.id)
  
  // Store non-reactive reference
  nodeRefs.set(id, node)
  
  // Extract safe data for Vue
  vueNodeData.set(id, extractVueNodeData(node))
  
  // Initialize reactive state
  nodeState.set(id, {
    visible: true,
    dirty: false,
    lastUpdate: performance.now(),
    culled: false
  })
}
```

### Node Removal
```typescript
graph.onNodeRemoved = (node: LGraphNode) => {
  const id = String(node.id)
  
  // Clean up all references
  nodeRefs.delete(id)
  vueNodeData.delete(id)
  nodeState.delete(id)
  nodePositions.delete(id)
  nodeSizes.delete(id)
}
```

### Position Updates
```typescript
// RAF-based position sync
const detectChangesInRAF = () => {
  for (const node of graph._nodes) {
    const id = String(node.id)
    const currentPos = nodePositions.get(id)
    
    if (!currentPos || 
        currentPos.x !== node.pos[0] || 
        currentPos.y !== node.pos[1]) {
      nodePositions.set(id, { 
        x: node.pos[0], 
        y: node.pos[1] 
      })
    }
  }
}
```

## Widget Data Flow

### 1. Widget Value Extraction
During node events, widget values are extracted safely:
```typescript
const safeWidgets = node.widgets?.map(widget => {
  let value = widget.value
  
  // Handle undefined combo values
  if (value === undefined && 
      widget.type === 'combo' && 
      widget.options?.values?.length > 0) {
    value = widget.options.values[0]
  }
  
  return {
    name: widget.name,
    type: widget.type,
    value: value,
    options: widget.options ? { ...widget.options } : undefined,
    callback: widget.callback
  }
})
```

### 2. Widget User Interactions
Vue components handle user input with immediate UI feedback and LiteGraph callbacks:
```vue
<!-- In WidgetComponent.vue -->
<template>
  <Select 
    v-model="localValue"
    @update:model-value="onChange"
  />
</template>

<script setup>
// Local state for immediate UI updates
const localValue = ref(props.modelValue)

const onChange = (newValue) => {
  // 1. Update local state (immediate UI feedback)
  localValue.value = newValue
  
  // 2. Emit to parent
  emit('update:modelValue', newValue)
  
  // 3. Call LiteGraph callback (authoritative update)
  if (props.widget.callback) {
    props.widget.callback(newValue)
  }
}

// Watch for external updates
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})
</script>
```

### 3. State Synchronization
The system uses a custom callback approach that ensures widget values are properly updated:

```typescript
// In useGraphNodeManager - setupNodeWidgetCallbacks
widget.callback = (value: unknown, ...args: unknown[]) => {
  // 1. Update the widget value in LiteGraph (CRITICAL!)
  widget.value = value
  
  // 2. Call the original callback if it exists
  if (originalCallback) {
    originalCallback(value, ...args)
  }
  
  // 3. Update Vue state
  const updatedWidgets = currentData.widgets.map(w => 
    w.name === widget.name 
      ? { ...w, value: value }
      : w
  )
  vueNodeData.set(nodeId, { ...currentData, widgets: updatedWidgets })
}
```

**Critical Discovery**: Many LiteGraph widgets are created with empty callbacks (`() => {}`) that don't update the widget value. We must explicitly set `widget.value = value` in our callback wrapper.

This ensures:
1. Widget value is updated in LiteGraph (authoritative source)
2. Original callback runs if provided
3. Vue state is immediately synchronized
4. No RAF detection needed for Vue-initiated changes
5. RAF only detects external changes (canvas interactions, programmatic updates)

## Memory Management

### WeakMap for Metadata
```typescript
// Auto-garbage collected when nodes are removed
const nodeMetadata = new WeakMap<LGraphNode, NodeMetadata>()
```

### Map for Reactive State
```typescript
// Explicit cleanup required
const vueNodeData = new Map<string, VueNodeData>()
const nodeState = new Map<string, NodeState>()

// Cleanup on removal
graph.onNodeRemoved = (node) => {
  const id = String(node.id)
  vueNodeData.delete(id)
  nodeState.delete(id)
  // ... other cleanup
}
```

### Non-Reactive References
```typescript
// Store LiteGraph nodes without Vue reactivity
const nodeRefs = new Map<string, LGraphNode>()
// Use shallowRef to prevent deep reactivity
const graphRef = shallowRef<LGraph | null>(null)
```

## Performance Considerations

### 1. Batch Updates
All position/size updates happen in a single RAF:
```typescript
let rafId: number | null = null

const scheduleUpdate = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    detectChangesInRAF()
    updateTransforms()
    rafId = null
  })
}
```

### 2. Selective Updates
Only update Vue state when values actually change:
```typescript
if (currentPos.x !== node.pos[0] || 
    currentPos.y !== node.pos[1]) {
  // Update only if changed
  nodePositions.set(id, newPos)
}
```

### 3. Viewport Culling
Only process visible nodes:
```typescript
const visibleNodes = computed(() => {
  return Array.from(vueNodeData.values())
    .filter(node => !nodeState.get(node.id)?.culled)
})
```

## Error Handling

### Widget Extraction Errors
```typescript
try {
  return extractWidgetData(widget)
} catch (error) {
  console.warn('Widget extraction failed:', error)
  return {
    name: widget.name || 'unknown',
    type: widget.type || 'text',
    value: undefined,
    options: undefined,
    callback: undefined
  }
}
```

### Event Handler Safety
All event handlers include error boundaries to prevent cascade failures.

## Best Practices

1. **Never store LiteGraph nodes in reactive Vue state**
2. **Extract all needed data during events**
3. **Use callbacks for user interactions**
4. **Clean up all references on node removal**
5. **Batch updates in requestAnimationFrame**
6. **Handle edge cases in data extraction**