# Custom Hybrid Implementation Patterns

## Overview

- Single Transform Container Pattern
  - One div with `transform: translate(x,y) scale(zoom)`
  - Transform-origin: 0 0
  - Vue nodes as children inherit this transform
- RAF Batching
  - Batch all position updates in a single RAF
  - Sync canvas and DOM updates in the same frame
- Viewport/Distance Culling & LOD
  - Only render nodes in view
  - Use LOD/culling for nodes that are far away
- Event Delegation
  - Single listener on container
  - Use pointer events
- `touch-action: none` on the container
- `contain: layout style paint` on nodes

## The Optimal Hybrid Structure

```
Container (pointer-events: auto)
├── Canvas (pointer-events: none)
│   └── Renders edges, background, grid
└── Transform Pane (transform: translate/scale, transform-origin: 0 0, event delegation, touch-action: none)
    └── Vue Nodes (position: absolute, RAF batching, viewport culling, LOD)
```

## Key Insight

**Don't try to manually sync positions - use the same transform container pattern!** 

The canvas and DOM nodes would share the same parent transform, keeping them automatically in sync. This is much simpler than calculating separate positions for each system.

## Implementation Example

```javascript
// Structure
<div class="graph-container" @pointerdown="handlePointer">
  <canvas ref="canvas" style="pointer-events: none" />
  <div 
    class="transform-pane" 
    :style="{
      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
      transformOrigin: '0 0'
    }"
  >
    <NodeComponent 
      v-for="node in visibleNodes" 
      :key="node.id"
      :style="{
        position: 'absolute',
        left: node.x + 'px',
        top: node.y + 'px'
      }"
    />
  </div>
</div>
```

## Performance Optimizations to Include

1. **Lazy Event Listeners** - Only attach move/up on pointerdown
2. **Viewport Culling** - Only render nodes in view
3. **Node Pooling** - Reuse Vue component instances
4. **Debounced Updates** - For non-critical position changes
5. **CSS Containment** - Use `contain: layout style paint` on nodes

## What This Solves

- Canvas and DOM automatically stay in sync via shared transform
- Single source of truth for pan/zoom state
- Leverages browser's optimized transform handling
- Avoids complex coordinate conversion math
- Same patterns proven in production libraries
