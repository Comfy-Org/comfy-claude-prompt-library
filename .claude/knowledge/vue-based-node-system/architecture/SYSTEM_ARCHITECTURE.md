# Vue-Based Node System Architecture

## Overview

The Vue-based node system implements a hybrid rendering approach where LiteGraph handles the canvas rendering (connections, grid, interaction) while Vue components render the node contents (widgets, UI elements).

## Core Architecture

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

## Component Hierarchy

### 1. GraphCanvas.vue
- Hosts both LiteGraph canvas and TransformPane
- Manages node lifecycle via useGraphNodeManager
- Handles feature flags and debug tools

### 2. useGraphNodeManager
- Central lifecycle management
- Safe data extraction from LiteGraph
- Event-driven updates
- Memory management with WeakMaps

### 3. TransformPane.vue
- Synchronizes canvas transforms to DOM
- Container for all Vue nodes
- Performance optimized with CSS transforms
- Viewport culling support

### 4. Node Components
- **LGraphNode.vue**: Main node container
- **NodeHeader.vue**: Title, controls, styling
- **NodeWidgets.vue**: Widget container and loader
- **NodeSlots.vue**: Input/output connections
- **NodeContent.vue**: Custom content area

### 5. Widget Components
- Individual Vue components per widget type
- Mapped via widget registry
- Two-way data binding with callbacks

## Data Flow

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

## Key Architectural Decisions

### 1. Transform Container Pattern
Instead of updating each node's position individually, we use a single container with CSS transforms:
```css
.transform-pane {
  transform: scale(var(--zoom)) translate(var(--pan-x), var(--pan-y));
}
.node {
  transform: translate(var(--node-x), var(--node-y));
}
```

### 2. Safe Data Extraction
Extract widget values during node lifecycle events to avoid Vue proxy + private field conflicts:
```typescript
const extractVueNodeData = (node: LGraphNode): VueNodeData => {
  // Access private fields before Vue proxy wrapping
  const value = widget.value // Safe!
  return { ...safeData }
}
```

### 3. Event-Driven Updates
Use LiteGraph's event system instead of polling:
- `onNodeAdded` → Add to Vue state
- `onNodeRemoved` → Clean up Vue state
- `onNodeSelected` → Update selection state

### 4. Memory Management
- **WeakMap** for metadata (auto-GC)
- **Map** for reactive state (explicit cleanup)
- **Non-reactive refs** for original nodes

## Integration Points

### With LiteGraph
- Canvas renders base layer (grid, connections)
- Vue renders overlay layer (nodes)
- Events flow: Canvas → Node Manager → Vue
- Selection state syncs bidirectionally

### With Existing UI
- Feature flags for gradual rollout
- Debug panel for development
- Preserves all existing functionality
- Extensions can opt-in to Vue rendering

### Performance Optimizations
- **CSS Containment**: Prevents layout thrashing
- **RAF Batching**: One update per frame
- **Viewport Culling**: Render only visible nodes
- **Will-change**: GPU acceleration for transforms

## Current Implementation Status

### ✅ Completed
- Basic transform synchronization
- Node lifecycle management
- Safe widget data extraction
- Widget component system
- Debug tools and metrics
- Feature flag system

### 🚧 In Progress
- Viewport culling optimization
- Spatial indexing for large graphs
- Level-of-detail (LOD) rendering

### 📋 Planned
- Virtual scrolling for 1000+ nodes
- Web Worker offloading
- Production error boundaries
- Migration guides for extensions

## Extension Points

### Adding New Widget Types
1. Create Vue component in `/vueWidgets`
2. Add to widget registry
3. Map LiteGraph type to component

### Custom Node Rendering
1. Extend LGraphNode.vue
2. Override via node type mapping
3. Use slots for custom content

### Performance Monitoring
1. Use performance metrics API
2. Add custom metrics to debug panel
3. Track specific operations

## Design Principles

1. **LiteGraph is Source of Truth**: Vue only renders, never owns state
2. **Performance First**: Every feature must maintain 60 FPS
3. **Gradual Migration**: Feature flags enable incremental adoption
4. **Type Safety**: No `any` types, proper interfaces throughout
5. **Debugging Support**: Built-in tools for development