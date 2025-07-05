# Performance Patterns for Browser Graphics

## Core Performance Principles

### 1. Minimize Pipeline Triggers
Different CSS properties trigger different parts of the rendering pipeline. Optimize by choosing properties that skip expensive operations.

```javascript
// ❌ Triggers Layout → Paint → Composite
element.style.width = '200px';
element.style.marginLeft = '50px';

// ⚠️ Triggers Paint → Composite  
element.style.backgroundColor = 'red';
element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

// ✅ Composite-only (GPU accelerated)
element.style.transform = 'translateX(50px) scale(1.2)';
element.style.opacity = '0.8';
```

### 2. Batch DOM Operations
Avoid layout thrashing by batching reads and writes separately.

```javascript
// ❌ Causes multiple reflows
for (let i = 0; i < elements.length; i++) {
  elements[i].style.left = elements[i].offsetLeft + 10 + 'px';
}

// ✅ Batch reads, then writes
const positions = elements.map(el => el.offsetLeft);
elements.forEach((el, i) => {
  el.style.left = positions[i] + 10 + 'px';
});

// ✅ Even better: Use transforms
elements.forEach(el => {
  el.style.transform = 'translateX(10px)';
});
```

### 3. Use DocumentFragment for Multiple Insertions
```javascript
// ❌ Triggers layout for each insertion
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  container.appendChild(div);
}

// ✅ Single layout trigger
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}
container.appendChild(fragment);
```

## Canvas Optimization Patterns

### 1. Layer Management
```javascript
class LayeredCanvas {
  constructor(container, width, height) {
    this.container = container;
    this.layers = [];
    this.width = width;
    this.height = height;
    
    this.createLayers(['background', 'game', 'ui', 'effects']);
  }
  
  createLayers(layerNames) {
    layerNames.forEach((name, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      canvas.style.position = 'absolute';
      canvas.style.zIndex = index;
      canvas.style.pointerEvents = name === 'ui' ? 'auto' : 'none';
      
      this.container.appendChild(canvas);
      this.layers[name] = {
        canvas: canvas,
        ctx: canvas.getContext('2d'),
        dirty: true
      };
    });
  }
  
  getLayer(name) {
    return this.layers[name];
  }
  
  render() {
    // Only redraw dirty layers
    Object.entries(this.layers).forEach(([name, layer]) => {
      if (layer.dirty) {
        this.renderLayer(name);
        layer.dirty = false;
      }
    });
  }
  
  markDirty(layerName) {
    if (this.layers[layerName]) {
      this.layers[layerName].dirty = true;
    }
  }
}
```

### 2. Dirty Rectangle Optimization
```javascript
class DirtyCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dirtyRegions = [];
    this.objects = [];
  }
  
  addDirtyRegion(x, y, width, height) {
    this.dirtyRegions.push({ x, y, width, height });
  }
  
  render() {
    if (this.dirtyRegions.length === 0) return;
    
    // Merge overlapping dirty regions
    const mergedRegions = this.mergeDirtyRegions();
    
    mergedRegions.forEach(region => {
      // Clear only dirty region
      this.ctx.clearRect(region.x, region.y, region.width, region.height);
      
      // Clip to dirty region for performance
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(region.x, region.y, region.width, region.height);
      this.ctx.clip();
      
      // Render only objects that intersect dirty region
      this.objects.forEach(obj => {
        if (this.intersects(obj.bounds, region)) {
          obj.render(this.ctx);
        }
      });
      
      this.ctx.restore();
    });
    
    this.dirtyRegions = [];
  }
  
  mergeDirtyRegions() {
    // Simple merge algorithm - can be optimized further
    const merged = [];
    const sorted = this.dirtyRegions.sort((a, b) => a.x - b.x);
    
    sorted.forEach(region => {
      if (merged.length === 0) {
        merged.push(region);
        return;
      }
      
      const last = merged[merged.length - 1];
      if (this.canMerge(last, region)) {
        last.width = Math.max(last.x + last.width, region.x + region.width) - last.x;
        last.height = Math.max(last.y + last.height, region.y + region.height) - last.y;
      } else {
        merged.push(region);
      }
    });
    
    return merged;
  }
  
  canMerge(rect1, rect2) {
    return !(rect1.x + rect1.width < rect2.x ||
             rect2.x + rect2.width < rect1.x ||
             rect1.y + rect1.height < rect2.y ||
             rect2.y + rect2.height < rect1.y);
  }
}
```

### 3. OffscreenCanvas for Background Threads
```javascript
// Main thread
class WorkerCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Transfer control to worker
    const offscreen = canvas.transferControlToOffscreen();
    this.worker = new Worker('canvas-worker.js');
    this.worker.postMessage({ canvas: offscreen }, [offscreen]);
    
    this.setupMessageHandling();
  }
  
  setupMessageHandling() {
    this.worker.onmessage = (e) => {
      const { type, data } = e.data;
      
      switch (type) {
        case 'frameRendered':
          this.onFrameRendered(data);
          break;
        case 'error':
          console.error('Worker error:', data);
          break;
      }
    };
  }
  
  updateData(gameState) {
    this.worker.postMessage({
      type: 'updateGameState',
      data: gameState
    });
  }
  
  onFrameRendered(frameData) {
    // Frame has been rendered in worker
    // Main thread can do other work
  }
}

// canvas-worker.js
let canvas, ctx;
let gameState = {};
let animationId;

self.onmessage = (e) => {
  const { type, data } = e.data;
  
  switch (type) {
    case 'canvas':
      canvas = data.canvas;
      ctx = canvas.getContext('2d');
      startRenderLoop();
      break;
      
    case 'updateGameState':
      gameState = data;
      break;
  }
};

function startRenderLoop() {
  function render() {
    if (gameState.objects) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      gameState.objects.forEach(obj => {
        renderObject(ctx, obj);
      });
      
      self.postMessage({
        type: 'frameRendered',
        data: { timestamp: performance.now() }
      });
    }
    
    animationId = requestAnimationFrame(render);
  }
  
  render();
}
```

## Memory Management Patterns

### 1. Object Pooling for Frequent Allocations
```javascript
class ParticlePool {
  constructor(maxSize = 1000) {
    this.pool = [];
    this.active = [];
    this.maxSize = maxSize;
    
    // Pre-allocate pool
    for (let i = 0; i < maxSize; i++) {
      this.pool.push(this.createParticle());
    }
  }
  
  createParticle() {
    return {
      x: 0, y: 0,
      vx: 0, vy: 0,
      life: 0,
      maxLife: 1,
      size: 1,
      color: 'white',
      active: false
    };
  }
  
  spawn(x, y, vx, vy, life) {
    let particle = this.pool.pop();
    
    if (!particle) {
      if (this.active.length < this.maxSize) {
        particle = this.createParticle();
      } else {
        // Reuse oldest active particle
        particle = this.active[0];
        this.active.splice(0, 1);
      }
    }
    
    // Initialize particle
    particle.x = x;
    particle.y = y;
    particle.vx = vx;
    particle.vy = vy;
    particle.life = life;
    particle.maxLife = life;
    particle.active = true;
    
    this.active.push(particle);
    return particle;
  }
  
  update(deltaTime) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const particle = this.active[i];
      
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.life -= deltaTime;
      
      if (particle.life <= 0) {
        this.despawn(i);
      }
    }
  }
  
  despawn(index) {
    const particle = this.active.splice(index, 1)[0];
    particle.active = false;
    this.pool.push(particle);
  }
  
  clear() {
    this.pool.push(...this.active);
    this.active = [];
  }
}
```

### 2. Viewport-Based Memory Management
```javascript
class MemoryManagedRenderer {
  constructor(viewport) {
    this.viewport = viewport;
    this.loadedTiles = new Map();
    this.tileSize = 256;
    this.maxLoadedTiles = 100;
    this.tileLoadQueue = [];
  }
  
  updateViewport(x, y, width, height) {
    this.viewport = { x, y, width, height };
    
    // Determine which tiles should be visible
    const visibleTiles = this.getVisibleTiles();
    
    // Unload tiles outside viewport + buffer
    this.unloadDistantTiles(visibleTiles);
    
    // Load new tiles
    this.loadRequiredTiles(visibleTiles);
  }
  
  getVisibleTiles() {
    const buffer = this.tileSize; // 1 tile buffer around viewport
    const startX = Math.floor((this.viewport.x - buffer) / this.tileSize);
    const startY = Math.floor((this.viewport.y - buffer) / this.tileSize);
    const endX = Math.ceil((this.viewport.x + this.viewport.width + buffer) / this.tileSize);
    const endY = Math.ceil((this.viewport.y + this.viewport.height + buffer) / this.tileSize);
    
    const tiles = [];
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        tiles.push(`${x},${y}`);
      }
    }
    
    return tiles;
  }
  
  unloadDistantTiles(visibleTiles) {
    const visibleSet = new Set(visibleTiles);
    
    this.loadedTiles.forEach((tile, key) => {
      if (!visibleSet.has(key)) {
        this.unloadTile(key);
      }
    });
  }
  
  loadRequiredTiles(visibleTiles) {
    visibleTiles.forEach(tileKey => {
      if (!this.loadedTiles.has(tileKey)) {
        this.queueTileLoad(tileKey);
      }
    });
    
    this.processTileLoadQueue();
  }
  
  queueTileLoad(tileKey) {
    if (!this.tileLoadQueue.includes(tileKey)) {
      this.tileLoadQueue.push(tileKey);
    }
  }
  
  processTileLoadQueue() {
    // Load tiles with priority (closest to viewport center first)
    this.tileLoadQueue.sort((a, b) => {
      const distA = this.getTileDistanceToViewportCenter(a);
      const distB = this.getTileDistanceToViewportCenter(b);
      return distA - distB;
    });
    
    // Load a few tiles per frame to avoid frame drops
    const tilesToLoad = this.tileLoadQueue.splice(0, 3);
    tilesToLoad.forEach(tileKey => {
      this.loadTile(tileKey);
    });
  }
  
  loadTile(tileKey) {
    if (this.loadedTiles.size >= this.maxLoadedTiles) {
      // Remove least recently used tile
      const lru = this.findLRUTile();
      this.unloadTile(lru);
    }
    
    const [x, y] = tileKey.split(',').map(Number);
    const tile = this.createTile(x, y);
    
    this.loadedTiles.set(tileKey, {
      tile: tile,
      lastAccessed: performance.now()
    });
  }
  
  unloadTile(tileKey) {
    const tileData = this.loadedTiles.get(tileKey);
    if (tileData) {
      // Clean up resources
      if (tileData.tile.texture) {
        tileData.tile.texture = null;
      }
      this.loadedTiles.delete(tileKey);
    }
  }
  
  findLRUTile() {
    let lruKey = null;
    let oldestTime = Infinity;
    
    this.loadedTiles.forEach((data, key) => {
      if (data.lastAccessed < oldestTime) {
        oldestTime = data.lastAccessed;
        lruKey = key;
      }
    });
    
    return lruKey;
  }
}
```

## Level of Detail (LOD) Patterns

### 1. Distance-Based LOD
```javascript
class LODRenderer {
  constructor(camera) {
    this.camera = camera;
    this.lodLevels = [
      { distance: 100, detail: 'high' },
      { distance: 500, detail: 'medium' },
      { distance: 1000, detail: 'low' },
      { distance: Infinity, detail: 'culled' }
    ];
  }
  
  renderObjects(objects) {
    objects.forEach(obj => {
      const distance = this.getDistanceToCamera(obj);
      const lod = this.getLODLevel(distance);
      
      switch (lod) {
        case 'high':
          this.renderHighDetail(obj);
          break;
        case 'medium':
          this.renderMediumDetail(obj);
          break;
        case 'low':
          this.renderLowDetail(obj);
          break;
        case 'culled':
          // Don't render
          break;
      }
    });
  }
  
  getLODLevel(distance) {
    for (const level of this.lodLevels) {
      if (distance < level.distance) {
        return level.detail;
      }
    }
    return 'culled';
  }
  
  renderHighDetail(obj) {
    // Full geometry, all textures, shadows
    obj.renderWithShadows();
  }
  
  renderMediumDetail(obj) {
    // Reduced geometry, main textures only
    obj.renderSimplified();
  }
  
  renderLowDetail(obj) {
    // Basic shapes, solid colors
    obj.renderAsIcon();
  }
}
```

### 2. Screen Space LOD
```javascript
class ScreenSpaceLOD {
  constructor(canvas) {
    this.canvas = canvas;
    this.pixelThresholds = [
      { pixels: 100, detail: 'high' },
      { pixels: 20, detail: 'medium' },
      { pixels: 5, detail: 'low' },
      { pixels: 0, detail: 'culled' }
    ];
  }
  
  getScreenSpaceSize(obj, camera) {
    // Project object bounds to screen space
    const screenBounds = this.projectToScreen(obj.bounds, camera);
    return Math.max(screenBounds.width, screenBounds.height);
  }
  
  renderWithScreenSpaceLOD(objects, camera) {
    objects.forEach(obj => {
      const screenSize = this.getScreenSpaceSize(obj, camera);
      const lod = this.getScreenSpaceLOD(screenSize);
      
      obj.render(lod);
    });
  }
  
  getScreenSpaceLOD(screenPixels) {
    for (const threshold of this.pixelThresholds) {
      if (screenPixels >= threshold.pixels) {
        return threshold.detail;
      }
    }
    return 'culled';
  }
}
```

## Animation Performance Patterns

### 1. Timeline-Based Animation System
```javascript
class Timeline {
  constructor() {
    this.animations = [];
    this.currentTime = 0;
    this.running = false;
  }
  
  addAnimation(target, property, from, to, duration, easing = 'linear') {
    const animation = {
      target,
      property,
      from,
      to,
      duration,
      startTime: this.currentTime,
      easing: this.getEasingFunction(easing)
    };
    
    this.animations.push(animation);
    return animation;
  }
  
  update(deltaTime) {
    if (!this.running) return;
    
    this.currentTime += deltaTime;
    
    for (let i = this.animations.length - 1; i >= 0; i--) {
      const anim = this.animations[i];
      const elapsed = this.currentTime - anim.startTime;
      const progress = Math.min(elapsed / anim.duration, 1);
      
      if (progress >= 1) {
        // Animation complete
        anim.target[anim.property] = anim.to;
        this.animations.splice(i, 1);
      } else {
        // Interpolate value
        const easedProgress = anim.easing(progress);
        const value = anim.from + (anim.to - anim.from) * easedProgress;
        anim.target[anim.property] = value;
      }
    }
  }
  
  getEasingFunction(type) {
    const easings = {
      linear: t => t,
      easeIn: t => t * t,
      easeOut: t => 1 - (1 - t) * (1 - t),
      easeInOut: t => t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)
    };
    
    return easings[type] || easings.linear;
  }
}
```

### 2. Composite-Layer Animation
```javascript
class CompositeAnimation {
  constructor(element) {
    this.element = element;
    this.willChange = false;
  }
  
  startAnimation() {
    // Promote to composite layer
    this.promoteToCompositeLayer();
    
    // Use transform/opacity for GPU acceleration
    this.element.style.transform = 'translateX(0)';
    this.element.style.opacity = '1';
    
    return this.element.animate([
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(100px)', opacity: 0.5 }
    ], {
      duration: 1000,
      easing: 'ease-out',
      fill: 'forwards'
    });
  }
  
  promoteToCompositeLayer() {
    if (!this.willChange) {
      this.element.style.willChange = 'transform, opacity';
      this.willChange = true;
    }
  }
  
  demoteFromCompositeLayer() {
    if (this.willChange) {
      this.element.style.willChange = 'auto';
      this.willChange = false;
    }
  }
  
  onAnimationComplete() {
    // Clean up composite layer
    this.demoteFromCompositeLayer();
  }
}
```

## Debugging and Profiling Patterns

### 1. Performance Monitor
```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      frameTime: [],
      renderTime: [],
      updateTime: [],
      memoryUsage: []
    };
    this.maxSamples = 60; // 1 second at 60fps
  }
  
  startFrame() {
    this.frameStart = performance.now();
  }
  
  endFrame() {
    const frameTime = performance.now() - this.frameStart;
    this.addMetric('frameTime', frameTime);
    
    this.updateMemoryMetrics();
  }
  
  startTiming(name) {
    this[`${name}Start`] = performance.now();
  }
  
  endTiming(name) {
    const time = performance.now() - this[`${name}Start`];
    this.addMetric(`${name}Time`, time);
  }
  
  addMetric(name, value) {
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    
    this.metrics[name].push(value);
    
    if (this.metrics[name].length > this.maxSamples) {
      this.metrics[name].shift();
    }
  }
  
  updateMemoryMetrics() {
    if ('memory' in performance) {
      this.addMetric('memoryUsage', performance.memory.usedJSHeapSize / 1048576);
    }
  }
  
  getAverageMetric(name) {
    const values = this.metrics[name];
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  displayStats() {
    console.log(`Average Frame Time: ${this.getAverageMetric('frameTime').toFixed(2)}ms`);
    console.log(`Average FPS: ${(1000 / this.getAverageMetric('frameTime')).toFixed(1)}`);
    console.log(`Average Memory: ${this.getAverageMetric('memoryUsage').toFixed(2)}MB`);
  }
}
```

These performance patterns provide a foundation for optimizing browser graphics applications. The next step is understanding how to [debug and measure](01-debugging-tools.md) these optimizations effectively.