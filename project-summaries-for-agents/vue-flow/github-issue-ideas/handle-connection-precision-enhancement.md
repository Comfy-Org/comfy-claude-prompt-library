# Handle Connection Precision Enhancement

## Issue Title
[Feature Discussion] Sub-pixel precision for handle connections during zoom

## Issue Body

Hi Vue Flow team!

I've been working with Vue Flow on a project that requires precise handle connections, and I noticed something interesting about handle position calculations at different zoom levels that I'd love to discuss.

### Current Behavior

Looking at the handle bounds calculation in `Handle.vue`:

```typescript
const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform)
const x = handle.offsetLeft + (handle.offsetWidth * scaleFactor) / 2
const y = handle.offsetTop + (handle.offsetHeight * scaleFactor) / 2
```

This works well, but I'm curious about potential precision improvements for scenarios requiring pixel-perfect connections.

### The Observation

At non-integer zoom levels (e.g., 0.67x, 1.33x), handle positions can have sub-pixel values that get rounded differently across browsers. This occasionally causes:
- Slight visual misalignment of edges to handles
- Connection lines that appear to "snap" during zoom animations
- Differences between Chrome's and Firefox's sub-pixel rendering

### Potential Enhancement

I've been experimenting with using `getBoundingClientRect()` for sub-pixel precision:

```typescript
// Alternative approach with sub-pixel accuracy
const getHandleBounds = (handle: HTMLElement, viewport: HTMLElement) => {
  const handleRect = handle.getBoundingClientRect()
  const viewportRect = viewport.getBoundingClientRect()
  
  // These values maintain sub-pixel precision
  const relativeX = handleRect.left - viewportRect.left + handleRect.width / 2
  const relativeY = handleRect.top - viewportRect.top + handleRect.height / 2
  
  // Transform back to graph coordinates
  return transformToGraphSpace(relativeX, relativeY, transform)
}
```

### Questions

1. **Was the offset-based approach chosen for performance reasons?** I imagine `getBoundingClientRect()` might be slower for graphs with many handles.

2. **Browser compatibility considerations?** The current approach is certainly more predictable across browsers.

3. **Would sub-pixel precision be valuable for Vue Flow?** Or is this level of precision outside the typical use cases?

### Use Case Context

In my application:
- Users design precision diagrams (circuit boards, architectural plans)
- Zoom levels vary widely (10% to 500%)
- Handle connections need to appear perfectly aligned
- We're using Vue Flow's excellent snap-to-grid features

### Performance Considerations

I've tested the `getBoundingClientRect()` approach with ~200 handles and haven't noticed performance issues, but I'm curious about your experience with larger graphs.

Would you be interested in:
- A performance comparison between approaches?
- An optional "high precision" mode for handles?
- Or is this optimization better left to userland?

Thanks for the fantastic library! The handle connection system is already quite robust - I'm just exploring edge cases (pun intended 😄) for specialized use cases.

P.S. The recent DOM attributes feature is perfect for adding test selectors to handles - great addition!

## Why This Issue Works

1. **Specific Technical Detail**: Shows deep understanding of the handle system
2. **Real Use Case**: Precision diagrams are a legitimate need
3. **Respectful of Design**: Acknowledges there might be good reasons for current approach
4. **Offers Testing**: Willing to do performance comparisons
5. **Light Humor**: The "edge cases" pun shows personality
6. **References Recent Work**: Shows you're following the project actively