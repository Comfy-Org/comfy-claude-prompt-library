# CRITICAL: Canvas to Screen Coordinate Transformation

## THE CORRECT FORMULA (ALWAYS USE THIS)

```typescript
// Transform canvas position to screen position
const screen_x = (node.pos[0] + ds.offset[0]) * ds.scale
const screen_y = (node.pos[1] + ds.offset[1]) * ds.scale
```

## WRONG FORMULA (NEVER USE THIS)

```typescript
// WRONG! This caused hours of debugging
const screen_x = node.pos[0] * ds.scale + ds.offset[0]  // ❌ WRONG ORDER
const screen_y = node.pos[1] * ds.scale + ds.offset[1]  // ❌ WRONG ORDER
```

## Key Learning

The offset MUST be added to the position BEFORE scaling. This is how LiteGraph's coordinate system works:

1. Add offset to canvas position (translation)
2. Then multiply by scale (zoom)
3. Optionally add canvas element position for client coordinates

## Reference Implementation

The correct implementation can always be found in:
- `/src/composables/element/useCanvasPositionConversion.ts`
- DOM widgets use this correctly via `canvasPosToClientPos`

## Why This Matters

Getting this wrong causes:
- Nodes appear visible when they're actually off-screen
- Viewport culling completely breaks
- Spatial indexing returns wrong results
- Hours of painful debugging

## Always Remember

When implementing viewport culling or any screen-space calculations:
1. Use the existing `useCanvasPositionConversion` composable if possible
2. If you must calculate manually, use: `(pos + offset) * scale`
3. Test with different zoom levels (especially zoom < 1.0)