# Architectural Patterns Deep Dive

## Hybrid Rendering Architecture

### Core Concept
The hybrid architecture achieves coexistence between Vue and LiteGraph by treating each system as a specialized rendering layer with clear responsibilities.

### Layer Separation

```
┌─────────────────────────────────────────────────────────┐
│                    GraphContainer                        │
│  ┌─────────────────┬──────────────────────────────┐    │
│  │  LiteGraph      │     TransformPane             │    │
│  │   Canvas        │  ┌────────────────────────┐   │    │
│  │                 │  │  Vue Node Components   │   │    │
│  │  - Grid        │  │  - Position sync       │   │    │
│  │  - Connections │  │  - Widget rendering    │   │    │
│  │  - Interaction │  │  - Visual updates      │   │    │
│  │                 │  └────────────────────────┘   │    │
│  └─────────────────┴──────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Responsibility Allocation

**LiteGraph Layer**:
- Graph Logic: Node creation, deletion, connection validation
- Canvas Rendering: Grid, connections, selection rectangles
- User Interactions: Pan, zoom, node dragging, connection creation
- Data Model: Node state, widget values, graph serialization
- Performance: Optimized canvas drawing, hit testing

**Vue Layer**:
- Node Content: Widgets, custom UI elements, rich content
- Modern UI: PrimeVue components, responsive design, accessibility
- State Management: Reactive updates, computed properties
- Type Safety: TypeScript interfaces, compile-time validation

### Key Design Principles

#### 1. Single Source of Truth
LiteGraph maintains authoritative state; Vue components are pure rendering layers.

```typescript
// LiteGraph owns the data
const node = new LGraphNode()
node.title = "New Title"
node.widgets[0].value = 42

// Vue renders the data (read-only)
const vueNodeData = extractVueNodeData(node) // Safe extraction
```

#### 2. Event-Driven Synchronization
All state changes flow through LiteGraph events.

```typescript
graph.onNodeAdded = (node: LGraphNode) => {
  vueNodeData.set(String(node.id), extractVueNodeData(node))
}

widget.callback = (value) => {
  widget.value = value // Update LiteGraph first
  updateVueState(nodeId, widgetName, value) // Then sync Vue
}
```

#### 3. Coordinate System Unification
CSS transforms mirror LiteGraph's transform matrix exactly.

```typescript
const updateTransform = () => {
  const offset = canvas.ds.offset || [0, 0]
  const scale = canvas.ds.scale || 1
  
  container.style.setProperty('--zoom', scale)
  container.style.setProperty('--pan-x', `${offset[0]}px`)
  container.style.setProperty('--pan-y', `${offset[1]}px`)
}
```

### Integration Patterns

#### Safe Data Extraction
Extract LiteGraph data before Vue reactivity to avoid proxy conflicts.

```typescript
const extractVueNodeData = (node: LGraphNode): VueNodeData => {
  const safeWidgets = node.widgets?.map(widget => {
    const value = widget.value // Access before Vue proxy
    return {
      name: widget.name,
      type: widget.type,
      value: value,
      options: widget.options ? { ...widget.options } : undefined,
      callback: widget.callback
    }
  })
  
  return { id: String(node.id), widgets: safeWidgets, /* ... */ }
}
```

#### Widget Interaction Flow
Immediate UI feedback with authoritative LiteGraph updates.

```typescript
const onChange = (newValue) => {
  localValue.value = newValue              // 1. Immediate UI update
  emit('update:modelValue', newValue)      // 2. Emit to parent
  props.widget.callback?.(newValue)        // 3. Update LiteGraph
}
```

### Performance Characteristics

- **Viewport Culling**: Adaptive margins based on zoom level
- **Memory Management**: WeakMap for auto-GC, Map with explicit cleanup
- **Event Batching**: RAF-based updates for smooth performance

## Transform Container Pattern

### Core Concept
Reduce O(n) DOM updates to O(1) by transforming a single container instead of individual nodes.

### Mathematical Foundation

```
Final Position = ContainerTransform × NodePosition

Where:
ContainerTransform = translate(panX, panY) × scale(zoom)
NodePosition = translate(nodeX, nodeY)
```

### Implementation

```css
.transform-pane {
  /* ONE transform for ALL nodes */
  transform: scale(var(--zoom)) translate(var(--pan-x), var(--pan-y));
  transform-origin: 0 0;
  will-change: transform;
  contain: layout style paint;
}

.lg-node {
  /* Simple absolute positioning */
  position: absolute;
  left: var(--node-x);
  top: var(--node-y);
}
```

### Performance Benefits

#### Complexity Analysis
| Operation | Traditional | Container Pattern |
|-----------|-------------|------------------|
| Pan/Zoom | O(n) DOM updates | O(1) CSS variables |
| Add Node | Position calc + transform | Set CSS variables |
| Memory | n × style objects | 3 CSS properties |

#### Browser Optimization
- **GPU Acceleration**: `will-change: transform` promotes to GPU layer
- **CSS Containment**: Isolates rendering context
- **Paint Isolation**: Repaints are contained

### Coordinate Conversion

```typescript
const canvasToScreen = (canvasX: number, canvasY: number) => {
  const transform = computeTransform()
  return {
    x: canvasX * transform.scale + transform.x,
    y: canvasY * transform.scale + transform.y
  }
}

const screenToCanvas = (screenX: number, screenY: number) => {
  const transform = computeTransform()
  return {
    x: (screenX - transform.x) / transform.scale,
    y: (screenY - transform.y) / transform.scale
  }
}
```

### Advanced Features

#### Viewport Culling
```typescript
const isNodeInViewport = (nodePos, nodeSize, viewport, margin = 0.2) => {
  const screenPos = canvasToScreen(nodePos[0], nodePos[1])
  const screenSize = {
    width: nodeSize[0] * transform.scale,
    height: nodeSize[1] * transform.scale
  }
  
  const buffer = Math.max(viewport.width, viewport.height) * margin
  
  return !(
    screenPos.x + screenSize.width < -buffer ||
    screenPos.y + screenSize.height < -buffer ||
    screenPos.x > viewport.width + buffer ||
    screenPos.y > viewport.height + buffer
  )
}
```

#### Level of Detail
```css
/* Zoom-based quality */
.lg-node--lod-high .lg-widget { display: block; }
.lg-node--lod-medium .lg-widget-label { display: none; }
.lg-node--lod-low .lg-widget { display: none; }
```

### Real-World Performance

| Nodes | Traditional FPS | Container Pattern FPS |
|-------|----------------|---------------------|
| 100 | ~30 | 60 |
| 500 | ~10 | 30+ |
| 1000 | ~5 | 20+ |

## Summary

Both patterns solve fundamental challenges:

1. **Hybrid Rendering**: Enables modern UI frameworks in canvas-based systems
2. **Transform Container**: Achieves O(1) performance for viewport transforms

Together they create a scalable, performant foundation for node editor interfaces.