# Safe Data Extraction Pattern

## The Problem

Vue's reactivity system wraps objects in Proxy to track property access. LiteGraph widgets use private fields (e.g., `#value`) that cannot be accessed through a Proxy, resulting in errors:

```
TypeError: Cannot read private member #value from an object whose class did not declare it
```

## Why It Happens

1. **Vue Reactivity**: When you store a LiteGraph node in reactive state, Vue wraps it in a Proxy
2. **Private Fields**: LiteGraph widgets use private fields (`#value`, `#node`, etc.)
3. **Proxy Limitations**: JavaScript Proxies cannot intercept private field access
4. **The Collision**: `widget.value` getter tries to access `this.#value` through Vue's Proxy = 💥

## The Solution

Extract all needed data from LiteGraph objects BEFORE storing in reactive state:

```typescript
// ❌ BAD: Storing LiteGraph objects directly
const nodes = reactive(new Map())
nodes.set(id, litegraphNode) // Vue wraps in Proxy
// Later: node.widgets[0].value // ERROR!

// ✅ GOOD: Extract safe data first
const extractVueNodeData = (node: LGraphNode): VueNodeData => {
  const safeWidgets = node.widgets?.map(widget => {
    try {
      // Access private fields while object is non-reactive
      let value = widget.value
      
      // Handle defaults
      if (value === undefined && widget.type === 'combo' && 
          widget.options?.values?.length > 0) {
        value = widget.options.values[0]
      }
      
      return {
        name: widget.name,
        type: widget.type,
        value: value, // Extracted before Vue proxy!
        options: widget.options ? { ...widget.options } : undefined,
        callback: widget.callback
      }
    } catch (error) {
      // Graceful fallback
      return {
        name: widget.name || 'unknown',
        type: widget.type || 'text',
        value: undefined,
        options: undefined,
        callback: undefined
      }
    }
  })
  
  return {
    id: String(node.id),
    title: node.title || 'Untitled',
    type: node.type || 'Unknown',
    mode: node.mode || 0,
    selected: node.selected || false,
    executing: false,
    widgets: safeWidgets,
    inputs: node.inputs ? [...node.inputs] : undefined,
    outputs: node.outputs ? [...node.outputs] : undefined
  }
}
```

## Implementation Pattern

```typescript
// In useGraphNodeManager
export const useGraphNodeManager = (graph: LGraph) => {
  // Reactive storage for Vue data
  const vueNodeData = reactive(new Map<string, VueNodeData>())
  
  // Non-reactive storage for original nodes
  const nodeRefs = new Map<string, LGraphNode>()
  
  // Extract during lifecycle events
  graph.onNodeAdded = (node: LGraphNode) => {
    const id = String(node.id)
    
    // Store non-reactive reference
    nodeRefs.set(id, node)
    
    // Extract and store safe data for Vue
    vueNodeData.set(id, extractVueNodeData(node))
  }
  
  // Provide access to original node when needed
  const getNode = (id: string) => nodeRefs.get(id)
  
  return {
    vueNodeData: readonly(vueNodeData),
    getNode
  }
}
```

## Type Definitions

```typescript
export interface SafeWidgetData {
  name: string
  type: string
  value: unknown // Not any!
  options?: Record<string, unknown>
  callback?: ((value: unknown) => void) | undefined
}

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

## Benefits

1. **No Proxy Errors**: Private fields accessed before Vue wrapping
2. **Type Safety**: Explicit interfaces instead of `any`
3. **Performance**: Vue tracks only what it needs to
4. **Maintainability**: Clear separation of concerns
5. **Debugging**: Can inspect both Vue data and original nodes

## Common Pitfalls

### ❌ Accessing Original Node in Templates
```vue
<!-- BAD: This will be wrapped in proxy -->
{{ node.widgets[0].value }}
```

### ✅ Use Extracted Data
```vue
<!-- GOOD: Use safe extracted data -->
{{ nodeData.widgets[0].value }}
```

### ❌ Storing Callbacks in Reactive State
```typescript
// BAD: Functions in reactive state
const widget = reactive({
  callback: node.widget.callback
})
```

### ✅ Keep Callbacks Non-Reactive
```typescript
// GOOD: Store reference, don't make reactive
const widget = {
  callback: node.widget.callback // Just a reference
}
```

## Related Patterns

### Memory Management
- Use WeakMap for metadata that should GC with nodes
- Use regular Map for data that needs explicit cleanup
- Store non-reactive references separately

### Event-Driven Updates
- Extract data during onNodeAdded/Removed events
- Use RAF for position updates
- Batch updates for performance

### Error Boundaries
- Wrap extraction in try-catch
- Provide sensible defaults
- Log errors for debugging

## Testing the Pattern

```typescript
// Test that extraction works
const testNode = new LGraphNode()
testNode.addWidget("combo", "test", "default", ["a", "b", "c"])

const extracted = extractVueNodeData(testNode)
console.assert(extracted.widgets[0].value === "default")
console.assert(!isProxy(extracted.widgets[0])) // Not a Vue proxy!
```

## Summary

The safe data extraction pattern is THE critical architectural decision that makes Vue-based node rendering possible with LiteGraph. By extracting data during lifecycle events before Vue's reactivity system touches it, we avoid the fundamental incompatibility between Vue Proxies and JavaScript private fields.