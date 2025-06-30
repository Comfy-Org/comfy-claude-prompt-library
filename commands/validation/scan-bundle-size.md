# Scan Bundle Size

I need to analyze bundle size and optimization opportunities for: $ARGUMENTS

## Your Task

Analyze JavaScript/CSS bundle sizes, identify bloat, and find optimization opportunities.

## Execution Steps

1. **Bundle Composition**
   - Total bundle size (raw/gzipped)
   - Number of chunks
   - Entry point sizes
   - Vendor vs application code ratio
   - CSS bundle sizes

2. **Large Dependencies**
   - Top 10 largest dependencies
   - Duplicate packages (different versions)
   - Development dependencies in bundle
   - Unused exports from packages
   - Alternative lighter packages

3. **Code Splitting Analysis**
   - Missing lazy loading opportunities
   - Large synchronous imports
   - Route-based splitting potential
   - Shared chunks efficiency
   - Dynamic import usage

4. **Asset Optimization**
   - Unoptimized images
   - Large font files
   - Uncompressed assets
   - Missing modern formats (WebP, AVIF)
   - Inline vs external resources

5. **Build Configuration**
   - Tree shaking effectiveness
   - Minification settings
   - Source map inclusion
   - Compression (gzip/brotli)
   - Modern vs legacy bundles

## Report Format

```
## Bundle Size Analysis

### Bundle Overview
- Total Size: X MB (Y MB gzipped)
- JS: A MB | CSS: B MB | Assets: C MB
- Initial Load: D MB

### Largest Dependencies
1. [package]: X KB - Consider [alternative]
2. [package]: Y KB - Only using 10%

### Optimization Opportunities
- Enable code splitting: Save ~X KB
- Lazy load [component]: Save ~Y KB
- Replace [package] with [lighter]: Save ~Z KB

### Quick Wins
- Remove unused CSS: ~30% reduction
- Optimize images: ~2MB savings
- Enable compression: ~70% reduction

### Build Recommendations
1. Configure webpack SplitChunksPlugin
2. Add bundle analyzer plugin
3. Set up progressive loading
```