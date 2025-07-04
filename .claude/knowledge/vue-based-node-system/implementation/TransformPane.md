# TransformPane Implementation

## Overview
TransformPane is the performance-optimized viewport container that bridges LiteGraph canvas transforms with Vue DOM nodes.

## Core Concept

The TransformPane synchronizes canvas transforms to DOM using CSS transforms, allowing Vue nodes to appear perfectly aligned with the canvas while maintaining 60 FPS performance.

```typescript
// Transform synchronization
const updateTransform = () => {
  const transform = computeTransform()
  container.style.setProperty('--zoom', transform.scale)
  container.style.setProperty('--pan-x', `${transform.x}px`)
  container.style.setProperty('--pan-y', `${transform.y}px`)
}
```

## Architecture

```
LiteGraph Canvas
    ↓ (transform events)
useTransformState (shared state)
    ↓ (reactive updates)
TransformPane
    ↓ (CSS transforms)
Vue Nodes (positioned via transform)
```

## Implementation Details

### Transform Computation
```typescript
const computeTransform = (): Transform => {
  if (!canvas) return { scale: 1, x: 0, y: 0 }
  
  const offset = canvas.ds.offset || [0, 0]
  const scale = canvas.ds.scale || 1
  
  return {
    scale,
    x: offset[0],
    y: offset[1]
  }
}
```

### CSS Strategy
```css
.transform-pane {
  /* Single transform for all nodes */
  transform: scale(var(--zoom)) translate(var(--pan-x), var(--pan-y));
  transform-origin: 0 0;
  will-change: transform;
  
  /* Performance optimizations */
  contain: layout style paint;
  pointer-events: none;
}

.transform-pane > * {
  pointer-events: auto;
}
```

### Coordinate Conversion
```typescript
// Canvas space to screen space
const canvasToScreen = (canvasX: number, canvasY: number) => {
  const transform = computeTransform()
  return {
    x: canvasX * transform.scale + transform.x,
    y: canvasY * transform.scale + transform.y
  }
}

// Screen space to canvas space  
const screenToCanvas = (screenX: number, screenY: number) => {
  const transform = computeTransform()
  return {
    x: (screenX - transform.x) / transform.scale,
    y: (screenY - transform.y) / transform.scale
  }
}
```

## Performance Optimizations

### 1. RAF Batching
Only update transforms once per frame:
```typescript
let rafId: number | null = null

const scheduleUpdate = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    updateTransform()
    rafId = null
  })
}
```

### 2. CSS Containment
Prevent layout thrashing:
```css
.transform-pane {
  contain: layout style paint;
}
```

### 3. Will-change
Enable GPU acceleration:
```css
.transform-pane {
  will-change: transform;
}
```

### 4. Pointer Events
Optimize hit testing:
```css
.transform-pane {
  pointer-events: none;
}
.transform-pane > * {
  pointer-events: auto;
}
```

## Integration with GraphCanvas

```vue
<TransformPane
  v-if="transformPaneEnabled"
  :canvas="canvasStore.canvas"
  :viewport="{ width: canvasWidth, height: canvasHeight }"
  :show-debug-overlay="showPerformanceOverlay"
  @raf-status-change="rafActive = $event"
  @transform-update="handleTransformUpdate"
>
  <VueGraphNode
    v-for="nodeData in nodesToRender"
    :key="nodeData.id"
    :node-data="nodeData"
    :position="nodePositions.get(nodeData.id)"
    :size="nodeSizes.get(nodeData.id)"
  />
</TransformPane>
```

## Viewport Culling

Optional optimization to render only visible nodes:

```typescript
const isNodeInViewport = (
  pos: ArrayLike<number>,
  size: ArrayLike<number>,
  viewport: DOMRect,
  transform: Transform,
  margin = 0.2
): boolean => {
  const screenPos = canvasToScreen(pos[0], pos[1])
  const screenSize = {
    width: size[0] * transform.scale,
    height: size[1] * transform.scale
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

## Events

### Emitted Events
- `nodes-rendered`: After nodes are positioned
- `transform-updated`: When transform changes
- `viewport-changed`: When viewport size changes

### Transform Sync
Transform updates flow unidirectionally from canvas to DOM:
1. User pans/zooms canvas
2. Canvas fires transform event
3. TransformPane updates CSS variables
4. Nodes reposition via CSS transform

## Debug Utilities

The TransformPane includes debug overlays:
- Transform values (scale, offset)
- Node count and culling stats
- Performance metrics
- Viewport boundaries visualization

### Viewport Debug Overlay
When `showDebugOverlay` prop is enabled, displays:
- Red border showing actual viewport bounds (10px inset for visibility)
- Viewport dimensions (width x height)
- Device pixel ratio (DPR)

```vue
<TransformPane :show-debug-overlay="true">
  <!-- Shows red border overlay with viewport info -->
</TransformPane>
```

## Future Optimizations

1. **Adaptive Quality**: Reduce visual fidelity during interaction
2. **Level of Detail**: Simpler rendering at low zoom levels
3. **Spatial Indexing**: QuadTree for efficient culling
4. **Transform Interpolation**: Smooth transitions