# Viewport Culling Optimization Discussion

## Issue Title
[Discussion] Viewport culling strategies for large graphs - Virtual scrolling vs CSS containment?

## Issue Body

Hello Vue Flow team! 👋

I've been diving deep into Vue Flow's architecture while building a node editor that needs to handle 1000+ nodes. Your reactive store pattern with Map-based lookups is brilliant for performance at scale.

### The Discussion Topic

I noticed that Vue Flow currently renders all nodes regardless of viewport visibility. For massive graphs, I'm exploring viewport culling strategies and would love to discuss approaches that might align with Vue Flow's architecture.

### Current Observations

From studying your codebase:
- Nodes are positioned via `transform: translate(x,y)` (great for performance!)
- The transform container pattern means all nodes move together efficiently
- No current viewport intersection checking in `NodeWrapper.ts`

### Potential Approaches

#### 1. Virtual Scrolling with Spatial Indexing
```typescript
// Rough concept
interface SpatialIndex {
  queryVisibleNodes(viewport: Rect): Set<string>
}

// In NodeWrapper or container
const visibleNodeIds = computed(() => {
  const expanded = expandRect(viewport.value, 100) // Buffer zone
  return spatialIndex.queryVisibleNodes(expanded)
})
```

#### 2. CSS Containment + Intersection Observer
```css
.vue-flow__node {
  content-visibility: auto;
  contain-intrinsic-size: /* node dimensions */;
}
```

#### 3. React-style Windowing
- Render placeholder divs for off-screen nodes
- Swap in real components when entering viewport
- Similar to react-window but for 2D space

### Questions for Discussion

1. **Have you experimented with viewport culling?** I'd be curious if you found it unnecessary for typical use cases or if there were specific challenges.

2. **CSS containment compatibility** - With Vue Flow supporting custom node components, would CSS containment constraints be too limiting?

3. **Spatial indexing overhead** - For dynamic graphs where nodes move frequently, would maintaining a spatial index negate the rendering performance gains?

### My Use Case Context

I'm working on a visual programming interface where:
- Graphs can have 1000-5000 nodes
- Nodes have complex content (not just simple boxes)
- Performance needs to stay smooth during panning
- Using Vue 3.5's vapor mode for additional optimizations

### Potential Contribution

If there's interest, I'd be happy to explore this further and potentially contribute a viewport culling solution that:
- Maintains backward compatibility 
- Works as an optional feature flag
- Integrates cleanly with the existing transform system
- Preserves the excellent DX Vue Flow currently provides

Would love to hear your thoughts on:
- Whether this aligns with Vue Flow's vision
- Any experiments you've already done in this area
- Preferred approach if you were to implement this

Thanks for creating such a well-architected library! The composable pattern and TypeScript types have made it a joy to study and learn from.

## Why This Issue Works

1. **Shows Advanced Use Case**: Demonstrates you're working on something substantial
2. **Technical Depth**: Shows understanding of multiple optimization strategies
3. **Respectful of Their Time**: Asks specific questions rather than vague requests
4. **Offers to Contribute**: Shows you're willing to give back to the project
5. **Acknowledges Design Decisions**: Respects their architecture choices
6. **Practical Focus**: Grounded in real performance needs