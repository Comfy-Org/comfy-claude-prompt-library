# Custom Hybrid Implementation Patterns: LiteGraph Canvas + Vue DOM

## Why Transforms Are Critical for Performance

Transforms are more efficient than position/layout changes for several key reasons:

### 1. Skips Layout (Reflow)
```css
/* This triggers layout recalculation: */
.node {
  left: 100px;
  top: 100px;
}

/* This skips layout entirely: */
.node {
  transform: translate(100px, 100px);
}
```

### 2. GPU Acceleration
- Transforms can be handled entirely by the GPU
- The GPU excels at matrix multiplication operations
- Each transform is just a 4x4 matrix multiplication

### 3. Compositor-Only Operation
```
Normal position change:
JS → Style → Layout → Paint → Composite ❌ (expensive)

Transform change:
JS → Style → Composite ✅ (cheap)
```

### 4. Matrix Math on GPU
```javascript
// What the GPU actually does:
// [x']   [a c tx] [x]
// [y'] = [b d ty] [y]
// [1 ]   [0 0 1 ] [1]

// For translate(100px, 100px) scale(2):
// [x']   [2 0 100] [x]
// [y'] = [0 2 100] [y]
// [1 ]   [0 0 1  ] [1]
```

### 5. No Repaint Required
- The element's pixels are already rasterized
- Transform just moves/scales the existing bitmap
- Position changes might trigger repainting of overlapping elements

**Key Insight:** Transforms are essentially telling the GPU "take this already-painted layer and apply this matrix to it" rather than "recalculate where everything should be and repaint it all."

This is why all the libraries we analyzed use transforms exclusively for pan/zoom - it's the difference between 60fps smooth movement and janky 15fps reflows!

## Why Single Transform Container Pattern

The single transform container pattern (used by Vue Flow, React Flow) is superior to individual node transforms:

### 1. One Transform vs Hundreds
```javascript
// BAD: Transform each node individually
nodes.forEach(node => {
  node.style.transform = `translate(${x + node.x}px, ${y + node.y}px) scale(${zoom})`
})

// GOOD: Transform one container
container.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`
```

### 2. Performance Impact
- **Individual transforms**: O(n) DOM updates where n = number of nodes
- **Single container**: O(1) - just one DOM update regardless of node count
- Browser only recalculates one transform matrix instead of hundreds

### 3. Simpler Math
```javascript
// Individual transforms require complex calculations:
const nodeScreenX = (node.x + panX) * zoom
const nodeScreenY = (node.y + panY) * zoom

// Container transform - nodes just use their base position:
node.style.left = node.x + 'px'  // Simple!
node.style.top = node.y + 'px'   // Simple!
```

### 4. Better Batching
- GPU can optimize a single transform on a large layer
- Multiple transforms might create multiple GPU layers (memory overhead)
- One compositor operation vs many

### 5. Zoom Quality
- Single container scales everything uniformly
- Individual transforms might have rounding errors at different zoom levels
- Text and borders stay crisp with single transform

**This is why our hybrid approach mirrors LiteGraph's single transform to a single CSS transform container!**

## Overview
How to implement a hybrid approach using LiteGraph's canvas rendering with Vue components overlaid for nodes.

## The Transform Mirroring Approach

Since LiteGraph uses canvas context transforms, we need to mirror these to CSS transforms for the Vue overlay.

### Basic Transform Sync

```javascript
// LiteGraph typically uses:
ctx.save()
ctx.translate(this.offset[0], this.offset[1])
ctx.scale(this.scale, this.scale)
// ... draw operations
ctx.restore()

// Mirror to DOM:
const syncTransform = () => {
  const transform = `translate(${litegraph.offset[0]}px, ${litegraph.offset[1]}px) scale(${litegraph.scale})`
  vueContainer.style.transform = transform
  vueContainer.style.transformOrigin = '0 0'
}
```

### Complete Implementation Structure

```vue
<template>
  <div class="graph-container">
    <!-- LiteGraph Canvas -->
    <canvas ref="canvas" />
    
    <!-- Vue Overlay -->
    <div 
      class="vue-overlay"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: canvasTransform,
        transformOrigin: '0 0',
        pointerEvents: 'none', // Let canvas handle base events
        width: '100%',
        height: '100%'
      }"
    >
      <!-- Vue Nodes -->
      <div
        v-for="node in visibleNodes"
        :key="node.id"
        :style="{
          position: 'absolute',
          left: node.pos[0] + 'px',
          top: node.pos[1] + 'px',
          pointerEvents: 'auto' // Re-enable for nodes
        }"
      >
        <NodeComponent :node="node" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const canvas = ref(null)
const graph = ref(null)
const offset = ref([0, 0])
const scale = ref(1)

const canvasTransform = computed(() => 
  `translate(${offset.value[0]}px, ${offset.value[1]}px) scale(${scale.value})`
)

onMounted(() => {
  // Initialize LiteGraph
  graph.value = new LiteGraph.LGraph()
  const graphCanvas = new LiteGraph.LGraphCanvas(canvas.value, graph.value)
  
  // Hook into LiteGraph's draw cycle
  const originalDrawNode = graphCanvas.drawNode.bind(graphCanvas)
  graphCanvas.drawNode = function(node, ctx) {
    // Let LiteGraph draw edges/background
    if (!node.vue_component) {
      originalDrawNode(node, ctx)
    }
    // Skip drawing nodes that have Vue components
  }
  
  // Sync transform on every frame
  const originalDraw = graphCanvas.draw.bind(graphCanvas)
  graphCanvas.draw = function() {
    // Update our transform state
    offset.value = [...this.offset]
    scale.value = this.scale
    
    // Call original draw
    originalDraw()
  }
})
</script>
```

## Key Implementation Details

### 1. Event Coordination
```javascript
// Forward Vue node events to LiteGraph
const handleNodePointerDown = (e, node) => {
  // Convert DOM event to LiteGraph coordinates
  const canvasPos = domToCanvasCoordinates(e.clientX, e.clientY)
  
  // Trigger LiteGraph's node selection
  graphCanvas.processNodeSelected(node, e)
  
  // Start drag operation
  if (e.target.closest('.node-header')) {
    graphCanvas.node_dragged = node
  }
}
```

### 2. Coordinate Conversion
```javascript
const domToCanvasCoordinates = (clientX, clientY) => {
  const rect = canvas.value.getBoundingClientRect()
  const x = (clientX - rect.left - offset.value[0]) / scale.value
  const y = (clientY - rect.top - offset.value[1]) / scale.value
  return [x, y]
}

const canvasToDomCoordinates = (x, y) => {
  return [
    x * scale.value + offset.value[0],
    y * scale.value + offset.value[1]
  ]
}
```

### 3. Visibility Culling
```javascript
const visibleNodes = computed(() => {
  const viewport = {
    left: -offset.value[0] / scale.value,
    top: -offset.value[1] / scale.value,
    right: (canvas.value.width - offset.value[0]) / scale.value,
    bottom: (canvas.value.height - offset.value[1]) / scale.value
  }
  
  return nodes.value.filter(node => {
    return node.pos[0] + node.size[0] > viewport.left &&
           node.pos[0] < viewport.right &&
           node.pos[1] + node.size[1] > viewport.top &&
           node.pos[1] < viewport.bottom
  })
})
```

## Why This Works

1. **Simple Transform Mirror**: LiteGraph's offset/scale directly maps to CSS translate/scale
2. **Single Source of Truth**: LiteGraph remains in control of pan/zoom state
3. **Efficient Updates**: Only sync transform on draw calls, not every mouse move
4. **Clean Separation**: Canvas renders edges/connections, DOM renders nodes

## Potential Gotchas

1. **Draw Order**: Need to ensure Vue nodes appear above canvas content
2. **Event Bubbling**: Must carefully manage which layer handles which events
3. **Performance**: Need RequestAnimationFrame batching for smooth updates
4. **Touch Events**: Must forward touch events appropriately between layers

## Performance Optimizations

1. **Use CSS contain on nodes**: `contain: layout style paint`
2. **Implement node pooling**: Reuse Vue component instances
3. **Debounce transform updates**: For smoother zoom operations
4. **Add will-change hint**: `will-change: transform` on the overlay

## RAF Batching for Synchronized Compositing

By batching canvas and CSS transforms in the same RequestAnimationFrame, both updates can be applied in the same browser composite stage:

### Browser Rendering Pipeline
1. **JavaScript** (your RAF callback)
2. **Style Calculation** (CSS transform)
3. **Layout** (skipped for transforms!)
4. **Paint** (canvas drawing)
5. **Composite** (GPU combines layers)

### Optimal RAF Implementation
```javascript
let rafId = null;

const updateFrame = () => {
  // Update both in same RAF tick
  
  // 1. Canvas transform
  ctx.save();
  ctx.translate(offset[0], offset[1]);
  ctx.scale(scale, scale);
  // ... draw edges
  ctx.restore();
  
  // 2. CSS transform (same values)
  vueOverlay.style.transform = 
    `translate(${offset[0]}px, ${offset[1]}px) scale(${scale})`;
  
  rafId = null;
};

const scheduleUpdate = () => {
  if (!rafId) {
    rafId = requestAnimationFrame(updateFrame);
  }
};
```

### Why This Works Well
- Both transforms use the GPU compositor
- No layout recalculation (transforms don't affect layout)
- Single composite pass combines both layers
- Prevents visual tearing between canvas and DOM

### GPU Layer Optimization
```css
.vue-overlay {
  will-change: transform;
  contain: layout style paint;
}
```

This ensures the overlay stays on its own GPU layer, making the composite even more efficient. With proper RAF batching, both the canvas and DOM transforms composite together in a single GPU pass!

## Conclusion

You're right - mirroring transforms is straightforward! The main complexity is in event coordination and maintaining performance with many nodes. But the basic transform sync is just reading LiteGraph's offset/scale and applying it as a CSS transform.