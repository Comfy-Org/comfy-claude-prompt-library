# Quadtree Implementation in JavaScript

## Complete Region Quadtree Implementation

### Core Data Structures

```javascript
// Bounds utility class
class Bounds {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  contains(point) {
    return point.x >= this.x && 
           point.x < this.x + this.width &&
           point.y >= this.y && 
           point.y < this.y + this.height;
  }
  
  intersects(other) {
    return !(other.x >= this.x + this.width ||
             other.x + other.width <= this.x ||
             other.y >= this.y + this.height ||
             other.y + other.height <= this.y);
  }
  
  subdivide() {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    
    return [
      new Bounds(this.x, this.y, halfWidth, halfHeight), // NW
      new Bounds(this.x + halfWidth, this.y, halfWidth, halfHeight), // NE
      new Bounds(this.x, this.y + halfHeight, halfWidth, halfHeight), // SW
      new Bounds(this.x + halfWidth, this.y + halfHeight, halfWidth, halfHeight) // SE
    ];
  }
}

// Point utility class
class Point {
  constructor(x, y, data = null) {
    this.x = x;
    this.y = y;
    this.data = data;
  }
  
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}
```

### Main Quadtree Class

```javascript
class Quadtree {
  constructor(bounds, maxCapacity = 10, maxDepth = 10, depth = 0) {
    this.bounds = bounds;
    this.maxCapacity = maxCapacity;
    this.maxDepth = maxDepth;
    this.depth = depth;
    this.points = [];
    this.children = null;
    this.divided = false;
  }
  
  // Insert a point into the quadtree
  insert(point) {
    if (!this.bounds.contains(point)) {
      return false;
    }
    
    if (this.points.length < this.maxCapacity || this.depth >= this.maxDepth) {
      this.points.push(point);
      return true;
    }
    
    if (!this.divided) {
      this.subdivide();
    }
    
    // Try to insert into children
    return this.children.some(child => child.insert(point));
  }
  
  // Subdivide this node into four children
  subdivide() {
    const childBounds = this.bounds.subdivide();
    
    this.children = childBounds.map(bounds => 
      new Quadtree(bounds, this.maxCapacity, this.maxDepth, this.depth + 1)
    );
    
    // Redistribute existing points to children
    const pointsToRedistribute = [...this.points];
    this.points = [];
    
    pointsToRedistribute.forEach(point => {
      if (!this.children.some(child => child.insert(point))) {
        // If no child can contain the point, keep it at this level
        this.points.push(point);
      }
    });
    
    this.divided = true;
  }
  
  // Query points within a range
  queryRange(range, found = []) {
    if (!this.bounds.intersects(range)) {
      return found;
    }
    
    // Check points at this level
    this.points.forEach(point => {
      if (range.contains(point)) {
        found.push(point);
      }
    });
    
    // Recursively check children
    if (this.divided) {
      this.children.forEach(child => {
        child.queryRange(range, found);
      });
    }
    
    return found;
  }
  
  // Find nearest neighbor
  findNearest(queryPoint, maxDistance = Infinity) {
    let closest = null;
    let closestDistance = maxDistance;
    
    const checkPoints = (points) => {
      points.forEach(point => {
        const dx = point.x - queryPoint.x;
        const dy = point.y - queryPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
          closest = point;
          closestDistance = distance;
        }
      });
    };
    
    const searchNode = (node) => {
      if (!node) return;
      
      // Calculate minimum distance to this node's bounds
      const dx = Math.max(0, 
        Math.max(node.bounds.x - queryPoint.x, 
                 queryPoint.x - (node.bounds.x + node.bounds.width)));
      const dy = Math.max(0, 
        Math.max(node.bounds.y - queryPoint.y, 
                 queryPoint.y - (node.bounds.y + node.bounds.height)));
      const minDistance = Math.sqrt(dx * dx + dy * dy);
      
      // Skip if this node can't contain a closer point
      if (minDistance >= closestDistance) return;
      
      // Check points in this node
      checkPoints(node.points);
      
      // Search children if subdivided
      if (node.divided) {
        // Sort children by distance to query point for better pruning
        const childDistances = node.children.map((child, index) => ({
          index,
          distance: this.distanceToNodeCenter(queryPoint, child)
        }));
        
        childDistances.sort((a, b) => a.distance - b.distance);
        
        childDistances.forEach(({ index }) => {
          searchNode(node.children[index]);
        });
      }
    };
    
    searchNode(this);
    return closest;
  }
  
  // Helper method for nearest neighbor search
  distanceToNodeCenter(point, node) {
    const centerX = node.bounds.x + node.bounds.width / 2;
    const centerY = node.bounds.y + node.bounds.height / 2;
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // Remove a point from the quadtree
  remove(point) {
    if (!this.bounds.contains(point)) {
      return false;
    }
    
    const index = this.points.findIndex(p => p.equals(point));
    if (index !== -1) {
      this.points.splice(index, 1);
      return true;
    }
    
    if (this.divided) {
      return this.children.some(child => child.remove(point));
    }
    
    return false;
  }
  
  // Clear all points from the quadtree
  clear() {
    this.points = [];
    this.children = null;
    this.divided = false;
  }
  
  // Get total number of points
  size() {
    let total = this.points.length;
    if (this.divided) {
      total += this.children.reduce((sum, child) => sum + child.size(), 0);
    }
    return total;
  }
  
  // Get all points in the quadtree
  getAllPoints() {
    let allPoints = [...this.points];
    if (this.divided) {
      this.children.forEach(child => {
        allPoints = allPoints.concat(child.getAllPoints());
      });
    }
    return allPoints;
  }
}
```

## Performance Optimizations

### 1. Object Pooling

```javascript
class QuadtreePool {
  constructor() {
    this.nodePool = [];
    this.boundsPool = [];
    this.pointPool = [];
  }
  
  getNode(bounds, maxCapacity, maxDepth, depth) {
    let node = this.nodePool.pop();
    if (!node) {
      node = new Quadtree(bounds, maxCapacity, maxDepth, depth);
    } else {
      // Reset existing node
      node.bounds = bounds;
      node.maxCapacity = maxCapacity;
      node.maxDepth = maxDepth;
      node.depth = depth;
      node.clear();
    }
    return node;
  }
  
  releaseNode(node) {
    if (node.divided) {
      node.children.forEach(child => this.releaseNode(child));
    }
    node.clear();
    this.nodePool.push(node);
  }
  
  getBounds(x, y, width, height) {
    let bounds = this.boundsPool.pop();
    if (!bounds) {
      bounds = new Bounds(x, y, width, height);
    } else {
      bounds.x = x;
      bounds.y = y;
      bounds.width = width;
      bounds.height = height;
    }
    return bounds;
  }
  
  releaseBounds(bounds) {
    this.boundsPool.push(bounds);
  }
}

// Global pool instance
const qtPool = new QuadtreePool();
```

### 2. Spatial Hashing for Dense Data

```javascript
class SpatialHashQuadtree extends Quadtree {
  constructor(bounds, maxCapacity = 10, maxDepth = 10, cellSize = 100) {
    super(bounds, maxCapacity, maxDepth);
    this.cellSize = cellSize;
    this.hashMap = new Map();
  }
  
  hash(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }
  
  insert(point) {
    const success = super.insert(point);
    if (success) {
      const key = this.hash(point.x, point.y);
      if (!this.hashMap.has(key)) {
        this.hashMap.set(key, []);
      }
      this.hashMap.get(key).push(point);
    }
    return success;
  }
  
  queryRange(range, found = []) {
    // First, use spatial hash for quick filtering
    const minCellX = Math.floor(range.x / this.cellSize);
    const minCellY = Math.floor(range.y / this.cellSize);
    const maxCellX = Math.floor((range.x + range.width) / this.cellSize);
    const maxCellY = Math.floor((range.y + range.height) / this.cellSize);
    
    const candidates = new Set();
    
    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        const key = `${cellX},${cellY}`;
        const points = this.hashMap.get(key);
        if (points) {
          points.forEach(point => {
            if (range.contains(point)) {
              candidates.add(point);
            }
          });
        }
      }
    }
    
    return Array.from(candidates);
  }
}
```

### 3. Batch Operations

```javascript
class BatchQuadtree extends Quadtree {
  constructor(bounds, maxCapacity = 10, maxDepth = 10) {
    super(bounds, maxCapacity, maxDepth);
    this.pendingInserts = [];
    this.pendingRemoves = [];
  }
  
  batchInsert(points) {
    this.pendingInserts.push(...points);
  }
  
  batchRemove(points) {
    this.pendingRemoves.push(...points);
  }
  
  flush() {
    // Process removes first
    this.pendingRemoves.forEach(point => super.remove(point));
    
    // Then process inserts
    this.pendingInserts.forEach(point => super.insert(point));
    
    // Clear pending operations
    this.pendingInserts = [];
    this.pendingRemoves = [];
  }
  
  // Override query to ensure pending operations are processed
  queryRange(range, found = []) {
    this.flush();
    return super.queryRange(range, found);
  }
}
```

## Browser Integration Patterns

### 1. Canvas Viewport Culling

```javascript
class CanvasQuadtree {
  constructor(canvas, bounds) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.quadtree = new Quadtree(bounds);
    this.camera = { x: 0, y: 0, scale: 1 };
  }
  
  addObject(x, y, renderFn) {
    const point = new Point(x, y, { render: renderFn });
    this.quadtree.insert(point);
  }
  
  setCamera(x, y, scale) {
    this.camera.x = x;
    this.camera.y = y;
    this.camera.scale = scale;
  }
  
  render() {
    const viewport = this.getViewportBounds();
    const visibleObjects = this.quadtree.queryRange(viewport);
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    
    // Apply camera transform
    this.ctx.scale(this.camera.scale, this.camera.scale);
    this.ctx.translate(-this.camera.x, -this.camera.y);
    
    // Render only visible objects
    visibleObjects.forEach(point => {
      point.data.render(this.ctx, point.x, point.y);
    });
    
    this.ctx.restore();
  }
  
  getViewportBounds() {
    const x = this.camera.x;
    const y = this.camera.y;
    const width = this.canvas.width / this.camera.scale;
    const height = this.canvas.height / this.camera.scale;
    
    return new Bounds(x, y, width, height);
  }
}
```

### 2. DOM Element Management

```javascript
class DOMQuadtree {
  constructor(container, bounds) {
    this.container = container;
    this.quadtree = new Quadtree(bounds);
    this.elementMap = new Map(); // point → DOM element
  }
  
  addElement(x, y, element) {
    const point = new Point(x, y, element.id);
    this.quadtree.insert(point);
    this.elementMap.set(point, element);
    
    // Position element
    element.style.position = 'absolute';
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    
    this.container.appendChild(element);
  }
  
  updateViewport() {
    const containerRect = this.container.getBoundingClientRect();
    const viewport = new Bounds(
      this.container.scrollLeft,
      this.container.scrollTop,
      containerRect.width,
      containerRect.height
    );
    
    const visiblePoints = this.quadtree.queryRange(viewport);
    const visibleElements = new Set();
    
    visiblePoints.forEach(point => {
      const element = this.elementMap.get(point);
      if (element) {
        element.style.display = 'block';
        visibleElements.add(element);
      }
    });
    
    // Hide elements outside viewport
    this.elementMap.forEach((element, point) => {
      if (!visibleElements.has(element)) {
        element.style.display = 'none';
      }
    });
  }
}
```

### 3. WebWorker Integration

```javascript
// Main thread
class WorkerQuadtree {
  constructor(bounds) {
    this.worker = new Worker('quadtree-worker.js');
    this.worker.postMessage({ 
      type: 'init', 
      bounds: bounds 
    });
    
    this.callbacks = new Map();
    this.callbackId = 0;
    
    this.worker.onmessage = (e) => {
      const { id, result } = e.data;
      const callback = this.callbacks.get(id);
      if (callback) {
        callback(result);
        this.callbacks.delete(id);
      }
    };
  }
  
  queryRange(range, callback) {
    const id = this.callbackId++;
    this.callbacks.set(id, callback);
    
    this.worker.postMessage({
      type: 'queryRange',
      id: id,
      range: range
    });
  }
  
  insert(point) {
    this.worker.postMessage({
      type: 'insert',
      point: point
    });
  }
}

// quadtree-worker.js
let quadtree;

self.onmessage = (e) => {
  const { type, id, bounds, range, point } = e.data;
  
  switch (type) {
    case 'init':
      quadtree = new Quadtree(bounds);
      break;
      
    case 'queryRange':
      const result = quadtree.queryRange(range);
      self.postMessage({ id, result });
      break;
      
    case 'insert':
      quadtree.insert(point);
      break;
  }
};
```

## Memory Management Best Practices

### 1. Cleanup Strategies

```javascript
class ManagedQuadtree extends Quadtree {
  constructor(bounds, maxCapacity = 10, maxDepth = 10) {
    super(bounds, maxCapacity, maxDepth);
    this.cleanupThreshold = 1000; // Clean up after 1000 operations
    this.operationCount = 0;
  }
  
  insert(point) {
    const result = super.insert(point);
    this.operationCount++;
    
    if (this.operationCount >= this.cleanupThreshold) {
      this.cleanup();
      this.operationCount = 0;
    }
    
    return result;
  }
  
  cleanup() {
    // Remove empty nodes
    this.pruneEmptyNodes();
    
    // Rebalance if tree is too deep
    if (this.getMaxDepth() > this.maxDepth * 1.5) {
      this.rebalance();
    }
  }
  
  pruneEmptyNodes() {
    if (this.divided) {
      let hasChildren = false;
      
      this.children.forEach(child => {
        child.pruneEmptyNodes();
        if (child.size() > 0 || child.divided) {
          hasChildren = true;
        }
      });
      
      if (!hasChildren && this.points.length === 0) {
        this.children = null;
        this.divided = false;
      }
    }
  }
  
  rebalance() {
    const allPoints = this.getAllPoints();
    this.clear();
    allPoints.forEach(point => this.insert(point));
  }
  
  getMaxDepth() {
    if (!this.divided) return this.depth;
    return Math.max(...this.children.map(child => child.getMaxDepth()));
  }
}
```

## Testing and Validation

```javascript
// Unit tests for quadtree operations
class QuadtreeTests {
  static runAll() {
    console.log('Running Quadtree Tests...');
    
    this.testBasicOperations();
    this.testRangeQuery();
    this.testNearestNeighbor();
    this.testPerformance();
    
    console.log('All tests completed!');
  }
  
  static testBasicOperations() {
    const qt = new Quadtree(new Bounds(0, 0, 100, 100));
    
    // Test insertion
    const point1 = new Point(25, 25);
    const point2 = new Point(75, 75);
    
    console.assert(qt.insert(point1), 'Should insert point1');
    console.assert(qt.insert(point2), 'Should insert point2');
    console.assert(qt.size() === 2, 'Should have 2 points');
    
    // Test removal
    console.assert(qt.remove(point1), 'Should remove point1');
    console.assert(qt.size() === 1, 'Should have 1 point');
    
    console.log('✓ Basic operations test passed');
  }
  
  static testRangeQuery() {
    const qt = new Quadtree(new Bounds(0, 0, 100, 100));
    
    // Insert test points
    for (let i = 0; i < 100; i++) {
      qt.insert(new Point(Math.random() * 100, Math.random() * 100));
    }
    
    // Query small range
    const range = new Bounds(25, 25, 50, 50);
    const results = qt.queryRange(range);
    
    // Verify all results are within range
    results.forEach(point => {
      console.assert(range.contains(point), 'Result should be in range');
    });
    
    console.log(`✓ Range query test passed (${results.length} results)`);
  }
  
  static testNearestNeighbor() {
    const qt = new Quadtree(new Bounds(0, 0, 100, 100));
    
    const points = [
      new Point(10, 10),
      new Point(50, 50),
      new Point(90, 90)
    ];
    
    points.forEach(p => qt.insert(p));
    
    const nearest = qt.findNearest(new Point(15, 15));
    console.assert(nearest === points[0], 'Should find nearest point');
    
    console.log('✓ Nearest neighbor test passed');
  }
  
  static testPerformance() {
    const start = performance.now();
    const qt = new Quadtree(new Bounds(0, 0, 1000, 1000));
    
    // Insert 10000 random points
    for (let i = 0; i < 10000; i++) {
      qt.insert(new Point(Math.random() * 1000, Math.random() * 1000));
    }
    
    // Perform 1000 range queries
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 900;
      const y = Math.random() * 900;
      qt.queryRange(new Bounds(x, y, 100, 100));
    }
    
    const end = performance.now();
    console.log(`✓ Performance test: ${end - start}ms for 10k inserts + 1k queries`);
  }
}

// Run tests
// QuadtreeTests.runAll();
```

## Next: Use Cases and Applications

With this implementation foundation, you can now explore specific [use cases and applications](02-quadtree-use-cases.md) for quadtrees in browser environments.