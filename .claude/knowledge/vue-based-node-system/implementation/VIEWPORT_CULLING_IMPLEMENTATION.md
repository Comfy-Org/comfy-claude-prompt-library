# Viewport Culling Implementation

## ⚠️ CRITICAL: Coordinate Transformation

**THE MOST IMPORTANT THING TO KNOW:**
```typescript
// CORRECT: Add offset BEFORE scaling
screen_pos = (canvas_pos + offset) * scale  ✅

// WRONG: This will break everything
screen_pos = canvas_pos * scale + offset    ❌
```

## Implementation Details

### 1. Transform Calculation
Always use this exact formula for canvas to screen transformation:
```typescript
const screen_x = (node.pos[0] + ds.offset[0]) * ds.scale
const screen_y = (node.pos[1] + ds.offset[1]) * ds.scale
const screen_width = node.size[0] * ds.scale
const screen_height = node.size[1] * ds.scale
```

### 2. Visibility Check
```typescript
const isVisible = !(
  screen_x + screen_width < -margin_x ||
  screen_x > viewport_width + margin_x ||
  screen_y + screen_height < -margin_y ||
  screen_y > viewport_height + margin_y
)
```

### 3. Integration Points
- GraphCanvas.vue: nodesToRender computed property
- Use canvasStore.canvas for accessing LiteGraph canvas
- Sync transform state when needed

### 4. Common Pitfalls
- Wrong coordinate transformation order (see above)
- Not syncing transform state before visibility checks
- Using window dimensions instead of canvas element dimensions
- Forgetting to account for margin in canvas space vs screen space