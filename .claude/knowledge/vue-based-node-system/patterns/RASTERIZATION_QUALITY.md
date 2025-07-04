# Rasterization and Quality Management

## Current Implementation Status

The TransformPane component already has interaction detection infrastructure:
- Listens to `wheel` events for zoom detection
- Listens to `pointerdown/up` events for pan detection
- Applies `transform-pane--interacting` class during interactions
- Has a 200ms debounce before removing the interacting state

## Browser Rendering Mechanics

### The Pixel Stretching Phenomenon

When CSS transforms scale elements, browsers exhibit specific rasterization behavior:

1. **Initial render**: Browser rasterizes elements at their original size
2. **Transform applied**: CSS transform scales the rasterized bitmap
3. **Pixel stretching**: The bitmap is stretched, causing pixelation
4. **Re-rasterization trigger**: Certain events cause fresh rasterization at new resolution
5. **Quality restored**: New pixels rendered at appropriate resolution

### Key Concepts

#### Layout vs Visual Size
The browser maintains two separate concepts:
- **Layout size**: Original, untransformed dimensions used for layout calculations
- **Visual size**: Transformed result displayed on screen

```
Layout Tree → Paint → Rasterization → Composite
                          ↑                ↑
                    (Resolution)    (Transform applied)
```

#### Rasterization Triggers
Events that force re-rasterization:
- CSS property changes (e.g., adding a selection ring)
- Explicit repaint triggers
- Browser-determined quality thresholds
- will-change property modifications

### Browser Optimizations

#### Compositing Layers
```css
.transform-pane {
  will-change: transform; /* Creates compositing layer */
}
```

Benefits:
- Rasterized at different resolutions as needed
- Cached on GPU
- Re-rasterized independently of other elements

#### Damage Tracking
When element properties change:
1. Element marked as "damaged" (needs repaint)
2. Browser checks current transform scale
3. Re-rasterizes at appropriate resolution
4. Updates compositing layer

## Implementation Strategies

### 1. Resolution Switching (Threshold-Based)

```typescript
interface RasterizationManager {
  lastRasterScale: number
  rasterThreshold: number
  thresholds: number[]
}

// Discrete zoom levels for re-rasterization
const RASTER_THRESHOLDS = [0.1, 0.25, 0.5, 1, 2, 4, 8]

function findNearestThreshold(scale: number): number {
  return RASTER_THRESHOLDS.reduce((prev, curr) => 
    Math.abs(curr - scale) < Math.abs(prev - scale) ? curr : prev
  )
}

function checkRasterizationThreshold(
  currentScale: number, 
  lastScale: number
): boolean {
  const currentThreshold = findNearestThreshold(currentScale)
  const lastThreshold = findNearestThreshold(lastScale)
  return currentThreshold !== lastThreshold
}
```

### 2. Interaction-Based Quality

```typescript
interface QualityState {
  isInteracting: boolean
  qualityTimer: number | null
  lastQualityScale: number
}

// Low quality during interaction, high quality when stopped
function handleInteractionQuality(
  state: QualityState,
  element: HTMLElement,
  interacting: boolean
) {
  if (interacting) {
    element.style.imageRendering = 'pixelated'
    clearTimeout(state.qualityTimer)
  } else {
    state.qualityTimer = setTimeout(() => {
      element.style.imageRendering = 'auto'
      forceHighQualityRaster(element)
    }, 100)
  }
}
```

### 3. Force Re-rasterization Techniques

```typescript
// Method 1: Toggle class
function forceRepaintViaClass(element: HTMLElement) {
  element.classList.add('force-repaint')
  void element.offsetHeight // Force reflow
  element.classList.remove('force-repaint')
}

// Method 2: Will-change modification
function forceRepaintViaWillChange(element: HTMLElement) {
  element.style.willChange = 'auto'
  requestAnimationFrame(() => {
    element.style.willChange = 'transform'
  })
}

// Method 3: Transform nudge
function forceRepaintViaNudge(element: HTMLElement) {
  const currentTransform = element.style.transform
  element.style.transform = currentTransform + ' translateZ(0.01px)'
  requestAnimationFrame(() => {
    element.style.transform = currentTransform
  })
}
```

### 4. CSS-Only Approaches

```css
/* Let browser optimize quality */
.transform-pane {
  will-change: transform;
  image-rendering: high-quality; /* Browser decides when to re-raster */
}

/* Explicit quality control */
.transform-pane--interacting {
  image-rendering: pixelated; /* Fast but low quality */
}

.transform-pane--static {
  image-rendering: crisp-edges; /* High quality when not moving */
}
```

## Real-World Implementations

### Google Maps Approach
- Discrete zoom levels (z1, z2, z3...)
- Pre-rendered tiles at each level
- Tile resolution swapped at thresholds

### Figma/Miro Approach
- Low-quality during zoom animation
- High-quality re-raster on zoom end
- Smart caching of common zoom levels

### Adobe Creative Suite Approach
- "Adaptive Resolution" setting
- Renders at 50% during interaction
- Full quality on mouse release

## Performance Considerations

### Memory Usage
- Higher resolution = more memory
- Cache commonly used scales
- Clear cache at memory pressure

### GPU Considerations
- Larger textures for high-res rasters
- Texture memory limits
- Mobile GPU constraints

### CPU Impact
- Re-rasterization is CPU intensive
- Batch re-rasterizations when possible
- Use RAF to avoid blocking

## Best Practices

1. **Default to browser optimizations** - Modern browsers handle most cases well
2. **Optimize for interaction** - Users accept lower quality during movement
3. **Set quality thresholds** - Discrete levels prevent constant re-rasterization
4. **Monitor performance** - Track rasterization frequency and duration
5. **Provide user control** - Quality settings for different hardware
6. **Test on various devices** - Mobile behavior differs significantly

## Integration with Transform Container Pattern

The Transform Container Pattern works exceptionally well with quality management:

```typescript
// Single point of quality control
const updateTransformQuality = (
  container: HTMLElement,
  scale: number,
  interacting: boolean
) => {
  // Update transform
  container.style.setProperty('--zoom', scale)
  
  // Update quality based on interaction state
  if (interacting) {
    container.classList.add('transform-pane--interacting')
  } else {
    container.classList.remove('transform-pane--interacting')
    
    // Check if we crossed a threshold
    if (shouldReRasterize(scale)) {
      forceHighQualityRaster(container)
    }
  }
}
```

This centralized approach ensures consistent quality management across all nodes.