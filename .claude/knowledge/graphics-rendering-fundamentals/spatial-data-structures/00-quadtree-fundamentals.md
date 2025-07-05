# Quadtree Fundamentals

## Definition and Purpose

A **quadtree** is a tree data structure where each internal node has exactly four children, used to partition two-dimensional space by recursively subdividing it into four quadrants. In browser contexts, quadtrees solve spatial query problems that would otherwise require expensive DOM traversals or linear searches.

## Core Concept

### Spatial Partitioning
```
┌─────────┬─────────┐
│   NW    │   NE    │
│    A    │    B    │
├─────────┼─────────┤
│   SW    │   SE    │
│    C    │    D    │
└─────────┴─────────┘
```

Each node divides space into four quadrants:
- **NW** (Northwest): Top-left
- **NE** (Northeast): Top-right  
- **SW** (Southwest): Bottom-left
- **SE** (Southeast): Bottom-right

### Recursive Subdivision
Quadrants subdivide further when they contain "interesting data" above a threshold:

```
Initial space → First subdivision → Further subdivision
┌─────────┐     ┌─────┬─────┐     ┌─────┬──┬──┐
│         │     │     │     │     │     │  │  │
│    •    │ →   │  •  │     │ →   │  •  │  │  │
│         │     ├─────┼─────┤     ├─────┼──┼──┤
│         │     │     │     │     │     │  │  │
└─────────┘     └─────┴─────┘     └─────┴──┴──┘
```

## Types of Quadtrees (Browser Context)

### 1. Point Quadtree
**Use Case**: Hit testing, mouse interactions, collision detection

**Structure**: Each node contains one point, subdivides space around that point
```javascript
class PointQuadtreeNode {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.data = data;
    this.nw = this.ne = this.sw = this.se = null;
  }
}
```

**Browser Applications**:
- Click/hover detection in canvas applications
- Spatial hashing for game objects
- Efficient nearest-neighbor queries

### 2. Region Quadtree (Most Common)
**Use Case**: Viewport culling, level-of-detail, area queries

**Structure**: Nodes represent regions containing multiple points/objects
```javascript
class RegionQuadtreeNode {
  constructor(bounds, maxCapacity = 10) {
    this.bounds = bounds;      // {x, y, width, height}
    this.points = [];          // Objects in this region
    this.maxCapacity = maxCapacity;
    this.children = null;      // [nw, ne, sw, se] when subdivided
  }
}
```

**Browser Applications**:
- Culling objects outside viewport
- Level-of-detail rendering
- Spatial clustering for performance

### 3. Compressed Quadtree
**Use Case**: Sparse data, memory optimization

**Structure**: Removes empty nodes and linear chains
```javascript
// Stores only "interesting" nodes with data
// Uses Z-order curve for efficient representation
class CompressedQuadtree {
  constructor() {
    this.nodes = new Map(); // Z-order → data mapping
  }
}
```

**Browser Applications**:
- Large sparse datasets (maps, point clouds)
- Memory-constrained environments
- Fast serialization/deserialization

## Core Operations and Complexity

### Insertion: O(log n) average, O(n) worst
```javascript
insert(point) {
  if (!this.bounds.contains(point)) return false;
  
  if (this.points.length < this.maxCapacity) {
    this.points.push(point);
    return true;
  }
  
  if (!this.children) this.subdivide();
  
  return this.children.some(child => child.insert(point));
}
```

### Query: O(log n) average
```javascript
queryRange(range) {
  const found = [];
  
  if (!this.bounds.intersects(range)) return found;
  
  // Check points in this node
  this.points.forEach(point => {
    if (range.contains(point)) found.push(point);
  });
  
  // Recursively check children
  if (this.children) {
    this.children.forEach(child => {
      found.push(...child.queryRange(range));
    });
  }
  
  return found;
}
```

### Deletion: O(log n) average
```javascript
delete(point) {
  if (!this.bounds.contains(point)) return false;
  
  const index = this.points.findIndex(p => p.equals(point));
  if (index !== -1) {
    this.points.splice(index, 1);
    return true;
  }
  
  if (this.children) {
    return this.children.some(child => child.delete(point));
  }
  
  return false;
}
```

## Performance Characteristics

### Time Complexity
| Operation | Average | Worst Case | Best Case |
|-----------|---------|------------|-----------|
| Insert    | O(log n)| O(n)       | O(1)      |
| Delete    | O(log n)| O(n)       | O(1)      |
| Search    | O(log n)| O(n)       | O(1)      |
| Range Query| O(log n + k)| O(n)   | O(k)      |

*k = number of results returned*

### Space Complexity
- **Best**: O(n) for balanced tree
- **Worst**: O(n²) for degenerate tree (all points on diagonal)
- **Practical**: O(n log n) for typical real-world data

### Compared to Naive Approaches

**Linear Search**:
```javascript
// O(n) for every query
const findInRange = (points, range) => {
  return points.filter(point => range.contains(point));
};
```

**Grid-Based**:
```javascript
// O(1) access but memory intensive, poor for sparse data
const grid = new Array(gridWidth * gridHeight);
```

**Quadtree Advantage**:
- Adaptive subdivision matches data density
- Efficient for both dense and sparse regions
- Good cache locality for spatial queries

## When to Use Quadtrees in Browsers

### ✅ Good Use Cases
1. **Canvas/WebGL Applications**
   - Thousands of objects needing spatial queries
   - Pan/zoom interfaces requiring viewport culling
   - Real-time collision detection

2. **Large DOM Collections**
   - Virtualized lists with 2D positioning
   - Interactive maps with many markers
   - Drag-and-drop with spatial constraints

3. **Data Visualization**
   - Scatter plots with millions of points
   - Interactive dashboards with filtering
   - Geographic data rendering

### ❌ Poor Use Cases
1. **Small Datasets** (< 100 objects)
   - Linear search often faster
   - Overhead not justified

2. **Highly Dynamic Data**
   - Constant insertions/deletions
   - Better suited for other structures

3. **1D Problems**
   - Use binary search or B-trees instead
   - Quadtree overhead unnecessary

## Browser-Specific Considerations

### Memory Management
```javascript
// Use object pools to reduce GC pressure
class QuadtreePool {
  constructor() {
    this.nodePool = [];
  }
  
  getNode(bounds) {
    return this.nodePool.pop() || new QuadtreeNode(bounds);
  }
  
  releaseNode(node) {
    node.clear();
    this.nodePool.push(node);
  }
}
```

### Integration with Browser APIs
```javascript
// Intersection Observer for viewport culling
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const bounds = entry.boundingClientRect;
    const visibleObjects = quadtree.queryRange(bounds);
    updateVisibleElements(visibleObjects);
  });
});
```

### WebWorker Compatibility
```javascript
// Quadtree operations can run in background
self.onmessage = (e) => {
  const { points, query } = e.data;
  const quadtree = new Quadtree(bounds);
  points.forEach(p => quadtree.insert(p));
  const results = quadtree.queryRange(query);
  self.postMessage(results);
};
```

## Common Pitfalls

### 1. Unbalanced Trees
**Problem**: All points cluster in one region
```javascript
// All points in same quadrant creates linear chain
points = [{x: 1, y: 1}, {x: 1.1, y: 1.1}, {x: 1.2, y: 1.2}];
```

**Solution**: 
- Consider point distribution when choosing bounds
- Use compressed quadtrees for sparse data
- Implement rebalancing for dynamic datasets

### 2. Excessive Subdivision
**Problem**: Too many tiny nodes with few points
```javascript
// maxCapacity = 1 creates deep tree
const quadtree = new Quadtree(bounds, 1); // ❌ Too granular
```

**Solution**:
- Choose appropriate maxCapacity (typically 10-50)
- Set maximum depth limits
- Monitor memory usage and performance

### 3. Boundary Precision Issues
**Problem**: Floating-point precision affects queries
```javascript
// Point exactly on boundary might be missed
const point = {x: 50.0000000001, y: 50.0};
```

**Solution**:
- Use epsilon tolerance for boundary checks
- Implement robust geometric predicates
- Consider integer-based coordinates when possible

## Next Topics

1. **[Implementation](01-quadtree-implementation.md)**: JavaScript implementation patterns and optimizations
2. **[Use Cases](02-quadtree-use-cases.md)**: Specific browser applications and examples