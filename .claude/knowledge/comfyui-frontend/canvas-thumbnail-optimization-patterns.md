# Canvas Thumbnail Optimization Patterns

## Overview

This document captures patterns and insights for optimizing canvas thumbnail generation in ComfyUI_frontend, particularly for workflow tab previews and similar UI features.

## LiteGraph Viewport API

### Core Viewport Properties

```typescript
// Access current viewport coordinates
const [visX, visY, visW, visH] = app.canvas.ds.visible_area
const dpi = Math.max(window.devicePixelRatio ?? 1, 1)

// Viewport coordinates are in canvas space, multiply by DPI for pixel coordinates
const sourceX = visX * dpi
const sourceY = visY * dpi
const sourceWidth = visW
const sourceHeight = visH
```

### Coordinate System Understanding

- `canvas.ds.visible_area`: Returns `[x, y, width, height]` in canvas coordinates
- `canvas.ds.scale`: Current zoom level (1 = 100%, 2 = 200%, etc.)
- `canvas.ds.offset`: Pan offset as `[x, y]` array
- Always account for `devicePixelRatio` when converting to actual pixel coordinates

## Thumbnail Generation Architecture

### Current Implementation Pattern (PR #4290)

```typescript
// Eager generation on workflow switch
const beforeLoadNewGraph = () => {
  const activeWorkflow = workflowStore.activeWorkflow
  if (activeWorkflow) {
    // Capture thumbnail before switching away
    void workflowThumbnail.storeThumbnail(activeWorkflow)
  }
}

// Trigger events:
// - Tab switching
// - Workflow loading
// - File imports
```

### Viewport-Based Capture Implementation

```typescript
const captureCanvasThumbnail = async (
  width: number = 300,
  height: number = 200
): Promise<string | null> => {
  const graphCanvas = document.getElementById('graph-canvas') as HTMLCanvasElement
  const app = window['app']
  
  // Get viewport bounds
  const [visX, visY, visW, visH] = app.canvas.ds.visible_area
  const dpi = Math.max(window.devicePixelRatio ?? 1, 1)
  
  // Create thumbnail canvas
  const resizedCanvas = document.createElement('canvas')
  const resizedContext = resizedCanvas.getContext('2d')
  resizedCanvas.width = width
  resizedCanvas.height = height
  
  // Capture viewport only (not full canvas)
  resizedContext.drawImage(
    graphCanvas,
    visX * dpi,    // Source viewport coordinates
    visY * dpi,
    visW,
    visH,
    0, 0,          // Destination coordinates
    width,
    height
  )
  
  // Convert to blob URL
  return await new Promise(resolve => {
    resizedCanvas.toBlob(blob => {
      resolve(blob ? URL.createObjectURL(blob) : null)
    }, 'image/jpeg', 0.9)
  })
}
```

## Performance Characteristics

### Canvas-to-Blob Conversion Times

**Typical performance for 1920x1080 viewport:**
- `putImageData()`: 2-5ms
- `toBlob()` JPEG (0.9 quality): 15-40ms
- `toBlob()` PNG: 30-80ms
- `toBlob()` WebP: 20-50ms
- Full viewport capture + resize + blob: 20-30ms total

### Memory Usage Patterns

**Per-thumbnail storage:**
- Blob URL (JPEG): ~20KB
- Blob URL (PNG): ~100-300KB
- ImageData (viewport): ~2-8MB
- ImageData (full canvas): Up to 30MB+

**Typical usage (10-15 workflow tabs):**
- Current approach: 200KB-1MB total
- ImageData approach: 20-120MB total

## Decision Framework

### Eager vs Lazy Generation

**Eager Generation (Recommended):**
- ✅ Instant hover feedback (0ms delay)
- ✅ Minimal memory footprint (~20KB per thumbnail)
- ✅ Simple implementation and maintenance
- ❌ Captures thumbnails that may never be viewed

**Lazy Generation:**
- ✅ Only generates when needed
- ✅ Slightly lower memory for unused thumbnails
- ❌ 20-30ms hover delay (noticeable to users)
- ❌ Complex lifecycle management
- ❌ Requires storing intermediate state

### Viewport vs Full Canvas Capture

**Viewport Capture (Recommended):**
- ✅ Faster processing (fewer pixels)
- ✅ Relevant preview (shows user's current view)
- ✅ Smaller file sizes
- ✅ Better performance for large workflows

**Full Canvas Capture:**
- ✅ Complete workflow overview
- ❌ Slower processing for large canvases
- ❌ May show irrelevant/empty areas
- ❌ Larger file sizes

## Implementation Best Practices

### Memory Management

```typescript
// Proper cleanup of blob URLs
const clearThumbnail = (workflowKey: string) => {
  const thumbnail = workflowThumbnails.value.get(workflowKey)
  if (thumbnail) {
    URL.revokeObjectURL(thumbnail)  // Critical: prevent memory leaks
  }
  workflowThumbnails.value.delete(workflowKey)
}
```

### Error Handling

```typescript
const captureCanvasThumbnail = async (): Promise<string | null> => {
  try {
    const graphCanvas = document.getElementById('graph-canvas') as HTMLCanvasElement
    if (!graphCanvas) return null
    
    // ... capture logic
    
  } catch (error) {
    console.error('Failed to capture canvas thumbnail:', error)
    return null  // Graceful degradation
  }
}
```

### Performance Optimization

```typescript
// Debounce rapid thumbnail captures
const debouncedStoreThumbnail = debounce(storeThumbnail, 200)

// Skip capture if canvas hasn't changed
if (app.canvas.needs_redraw === false) {
  return existingThumbnail
}

// Use requestAnimationFrame for smooth captures
requestAnimationFrame(() => {
  storeThumbnail(activeWorkflow)
})
```

## Integration Patterns

### Workflow Tab Integration

```typescript
// In WorkflowTab.vue
const workflowThumbnail = useWorkflowThumbnail()
const thumbnail = computed(() => 
  workflowThumbnail.getThumbnail(workflow.key)
)

// In WorkflowTabPopover.vue
<template>
  <div class="thumbnail-preview">
    <img 
      v-if="thumbnail" 
      :src="thumbnail" 
      alt="Workflow preview"
      class="w-full h-full object-cover"
    />
  </div>
</template>
```

### Service Integration

```typescript
// In workflowService.ts
import { useWorkflowThumbnail } from '@/composables/useWorkflowThumbnail'

const workflowThumbnail = useWorkflowThumbnail()

// Hook into workflow lifecycle
const beforeLoadNewGraph = () => {
  const activeWorkflow = workflowStore.activeWorkflow
  if (activeWorkflow) {
    activeWorkflow.changeTracker.store()
    void workflowThumbnail.storeThumbnail(activeWorkflow)
  }
}
```

## Lessons Learned

### Key Insights from PR #4290

1. **User Experience Priority**: 20-30ms hover delay is noticeable and degrades UX
2. **Memory Efficiency**: Blob URLs (~20KB) are more efficient than ImageData (~2-8MB) for typical usage
3. **Viewport Relevance**: Users want to see what they were actually working on, not the full canvas
4. **Simple Solutions**: Hybrid approaches add complexity without significant benefit

### Common Pitfalls

1. **Forgetting DPI scaling**: Always multiply viewport coordinates by `devicePixelRatio`
2. **Memory leaks**: Must call `URL.revokeObjectURL()` when cleaning up thumbnails
3. **Canvas timing**: Ensure canvas is ready before capture attempts
4. **Error handling**: Canvas operations can fail; provide graceful fallbacks

### Decision Rationale

The eager viewport-based blob URL approach was chosen because:
- Instant UI feedback is critical for user experience
- Memory usage is negligible for typical workflow counts (5-15 tabs)
- Implementation complexity is minimized
- Performance is optimal for the common use case

This pattern can be applied to other canvas-based preview systems in ComfyUI_frontend.