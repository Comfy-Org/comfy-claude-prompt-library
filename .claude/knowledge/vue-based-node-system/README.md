# Vue-Based Node System Documentation

## Overview

This documentation covers the Vue-based node rendering system for ComfyUI, which replaces canvas-based node rendering with Vue components while maintaining LiteGraph as the source of truth for graph logic.

## Quick Navigation

### 📐 Architecture
- [**System Architecture**](./architecture/SYSTEM_ARCHITECTURE.md) - Overall system design and principles
- [**Data Flow**](./architecture/DATA_FLOW.md) - Unidirectional data flow from LiteGraph to Vue
- [**Lifecycle Management**](./architecture/LIFECYCLE_MANAGEMENT.md) - Event-driven node lifecycle

### 🛠 Implementation
- [**Phase 1 Complete**](./implementation/PHASE_1_COMPLETE.md) - Transform foundation ✅
- [**Phase 2 Complete**](./implementation/PHASE_2_COMPLETE.md) - Lifecycle & widgets ✅
- [**Phase 3 Planning**](./implementation/PHASE_3_PLANNING.md) - Performance optimizations 🚧
- [**TransformPane**](./implementation/TransformPane.md) - Transform synchronization details

### 🧩 Components
- [**Node Components**](./components/NodeComponents.md) - LGraphNode, NodeHeader, NodeSlots
- [**Widget Components**](./components/WidgetComponents.md) - Widget system and components

### 🎯 Patterns
- [**Safe Data Extraction**](./patterns/SAFE_DATA_EXTRACTION.md) - Critical pattern for Vue integration
- [**Memory Management**](./patterns/MEMORY_MANAGEMENT.md) - Preventing leaks, cleanup strategies
- [**Performance Patterns**](./patterns/PERFORMANCE_PATTERNS.md) - Optimizations for scale

## Key Concepts

### Transform Synchronization
The system uses a single CSS transform container that mirrors LiteGraph's canvas transforms, providing perfect visual alignment with minimal overhead.

### Safe Data Extraction
LiteGraph nodes cannot be made reactive due to private fields. Instead, we extract safe, serializable data during lifecycle events.

### Event-Driven Updates
All changes flow through LiteGraph's event system. No polling or continuous synchronization.

## Current Status

### ✅ Completed
- Basic transform synchronization
- Event-driven lifecycle management
- Vue widget rendering system
- Type-safe architecture
- Debug tools and metrics

### 🚧 In Progress
- Viewport culling optimization
- Level-of-detail (LOD) system
- Performance testing at scale

### 📋 Planned
- Spatial indexing (QuadTree)
- Virtual node rendering
- Component pooling
- Web Worker offloading

## Quick Start

### Enable Vue Nodes
```typescript
// In settings or debug panel
settingStore.set('Comfy.VueNodes.Enabled', true)
```

### Debug Tools
The debug panel (top-right in GraphCanvas) provides:
- Real-time transform metrics
- Node rendering statistics
- Performance monitoring
- Feature flag controls

### For Developers

1. **Never store LiteGraph nodes in reactive state** - Use `extractVueNodeData()`
2. **All state flows through LiteGraph** - Vue components only render
3. **Use TypeScript interfaces** - No `any` types
4. **Profile performance changes** - Maintain 60 FPS target

## File Organization

```
vue-based-node-system/
├── README.md                    # This file
├── architecture/               # System design docs
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATA_FLOW.md
│   └── LIFECYCLE_MANAGEMENT.md
├── implementation/             # Phase completion docs
│   ├── PHASE_1_COMPLETE.md
│   ├── PHASE_2_COMPLETE.md
│   ├── PHASE_3_PLANNING.md
│   └── TransformPane.md
├── components/                 # Component documentation
│   ├── NodeComponents.md
│   └── WidgetComponents.md
└── patterns/                   # Reusable patterns
    ├── SAFE_DATA_EXTRACTION.md
    ├── MEMORY_MANAGEMENT.md
    └── PERFORMANCE_PATTERNS.md
```

## Key Technical Decisions

1. **CSS Transform Container** - Single container transform for all nodes
2. **Event-Driven Architecture** - React to LiteGraph events, don't poll
3. **Safe Data Extraction** - Extract data before Vue reactivity
4. **Progressive Enhancement** - Feature flags for gradual rollout
5. **Widget Callback Wrapping** - Ensure widget.value is updated since LiteGraph callbacks are often empty
6. **Setup Order Matters** - Widget callbacks must be wrapped before data extraction

## Integration Points

- **LiteGraph Canvas** - Provides nodes, handles connections
- **Vue Components** - Renders node UI and widgets
- **Transform State** - Shared camera state between systems
- **Widget Callbacks** - Updates flow back to LiteGraph

## Contributing

When adding new features:
1. Update relevant documentation
2. Add TypeScript types
3. Include debug metrics
4. Test with 100+ nodes
5. Profile performance impact

## Resources

- [LiteGraph Documentation](https://github.com/jagenjo/litegraph.js)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [PrimeVue Components](https://primevue.org/)

---

*Last updated: Phase 2 complete, Phase 3 in planning*