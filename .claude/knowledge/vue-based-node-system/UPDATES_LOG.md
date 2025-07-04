# Vue-Based Node System Knowledge Updates Log

## 2025-07-03 - QuadTree Implementation and Critical Transform Fix

### Files Created:

1. **CRITICAL_VIEWPORT_CULLING_TRANSFORM.md**
   - Documents the critical coordinate transformation formula
   - CORRECT: `screen = (canvas + offset) * scale`
   - WRONG: `screen = canvas * scale + offset`
   - This error caused hours of debugging!

2. **implementation/VIEWPORT_CULLING_IMPLEMENTATION.md**
   - Complete viewport culling implementation details
   - Transform calculation, visibility checks, integration points
   - Common pitfalls to avoid

### Files Updated:

1. **implementation/PHASE_3_PLANNING.md**
   - Changed culling strategy from 'simple' to 'quadtree' (now implemented)
   - QuadTree is always used, no threshold-based switching

2. **patterns/PERFORMANCE_PATTERNS.md**
   - Added comment about critical coordinate transformation
   - Updated viewport culling section to mention QuadTree spatial indexing
   - Added warning comment: `// screen = (canvas + offset) * scale`

3. **components/WidgetComponents.md**
   - Added widget type mappings for MARKDOWN → TEXTAREA
   - Added widget type mappings for customtext → TEXTAREA
   - Added BUTTON widget type mapping

### Key Implementation Details:

- **QuadTree Integration**: Integrated directly into useGraphNodeManager
- **Always Enabled**: Removed threshold logic, QuadTree always used
- **Transform Fix**: Must add offset BEFORE scaling for screen coordinates
- **Performance**: O(log n) spatial queries vs O(n) linear search
- **Debug Metrics**: Added culledCount and nodesInViewport tracking

### Critical Lessons Learned:

1. **Coordinate Transformation Order Matters**: The biggest lesson is that canvas-to-screen transformation MUST add offset before scaling
2. **Use Existing Utilities**: Should have used useCanvasPositionConversion from the start
3. **Test at Different Zoom Levels**: The bug was most apparent when zoomed out
4. **Reference DOM Widgets**: They already had the correct implementation

## 2025-01-03 - Viewport Culling Fix Updates

### Files Updated:

1. **implementation/TransformPane.md**
   - Updated integration example to include new props: `:show-debug-overlay` and event handlers
   - Changed `LGraphNode` to `VueGraphNode` to match actual implementation
   - Added Debug Utilities section documenting the new viewport overlay feature

2. **patterns/PERFORMANCE_PATTERNS.md**
   - Updated viewport culling code example to match actual implementation
   - Added zoom-based adaptive margin calculation
   - Added size-based culling (4px threshold)
   - Included proper coordinate conversion using `canvasToScreen`

3. **implementation/PHASE_2_COMPLETE.md**
   - Added "Post-Phase 2 Updates" section
   - Documented the viewport culling implementation that was added after Phase 2
   - Listed key features: adaptive margins, size culling, debug overlay

### Key Changes Documented:

- **Viewport Debug Overlay**: Red border with 10px inset showing actual viewport bounds
- **Coordinate System**: Confirmed using `scale() translate()` order for CSS transforms
- **Performance**: Maintained transform-only approach to prevent layout thrashing
- **Culling Logic**: Properly accounts for zoom level and node size in screen space

### Not Updated (Still Accurate):

- **SYSTEM_ARCHITECTURE.md**: Transform Container Pattern description is correct
- **SAFE_DATA_EXTRACTION.md**: No changes needed
- **Other pattern files**: Still accurate as written