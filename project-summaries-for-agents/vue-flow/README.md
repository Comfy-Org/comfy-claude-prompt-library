# Vue Flow Repository Guide for AI Agents

## Repository Overview

**Purpose**: Vue Flow is a highly customizable Vue 3 flowchart/diagram library for building interactive node-based editors, workflow designers, and graph visualization tools.

**Repository**: https://github.com/bcakmakoglu/vue-flow  
**Documentation**: https://vueflow.dev/  
**Owner**: Braks (bcakmakoglu)  
**License**: MIT  
**Current Version**: Core package v1.45.0  

## Technology Stack

### Primary Technologies
- **Vue 3.3+** (peer dependency) - Modern Vue composition API
- **TypeScript** - Full type safety throughout
- **D3.js libraries** - For zoom, pan, and drag functionality
- **VueUse** - Vue composition utilities
- **Vite** - Build tool and dev server

### Key Dependencies
```json
{
  "@vueuse/core": "^10.11.1",
  "d3-drag": "^3.0.0",
  "d3-interpolate": "^3.0.1",
  "d3-selection": "^3.0.0",
  "d3-zoom": "^3.0.0"
}
```

### Development Tools
- **pnpm v9.2.0+** (enforced) - Package manager
- **Node v20+** (enforced) - Runtime
- **Turbo** - Monorepo build orchestration
- **Changesets** - Version management
- **ESLint + Prettier** - Code quality
- **Cypress** - Component testing
- **VitePress** - Documentation

## Directory Structure

```
vue-flow/
├── packages/                    # Monorepo packages
│   ├── core/                   # Main @vue-flow/core package
│   │   ├── src/
│   │   │   ├── components/     # Vue components (Edges, Nodes, etc.)
│   │   │   ├── composables/    # Vue composables
│   │   │   ├── container/      # Container components (VueFlow, Viewport)
│   │   │   ├── context/        # Provider/inject contexts
│   │   │   ├── store/          # State management
│   │   │   ├── types/          # TypeScript definitions
│   │   │   └── utils/          # Utility functions
│   │   └── dist/               # Build output
│   ├── background/             # Background pattern component
│   ├── controls/               # Zoom/pan controls
│   ├── minimap/                # Minimap component
│   ├── node-resizer/           # Node resizing functionality
│   ├── node-toolbar/           # Node toolbar component
│   └── pathfinding-edge/       # Smart edge routing
├── docs/                       # VitePress documentation
├── examples/                   # Example implementations
│   ├── vite/                   # Vite example
│   ├── nuxt3/                  # Nuxt 3 integration
│   └── quasar/                 # Quasar framework integration
├── tests/                      # Test files
│   └── cypress/                # Cypress component tests
├── tooling/                    # Shared tooling configs
└── .changeset/                 # Changeset files
```

## Development Workflow

### Essential Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development mode (builds and watches all packages + runs Vite example)
pnpm dev

# Run documentation site locally
pnpm dev:docs

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Create a changeset for version updates
pnpm changeset

# Publish packages (CI only, includes lint, build, test)
pnpm ci:publish
```

### Code Quality Tools

- **Linting**: `pnpm lint` - ESLint with @antfu config + Prettier
- **Type Checking**: Automatic during build via vue-tsc
- **Testing**: `pnpm test` - Cypress component tests
- **Formatting**: Handled by ESLint/Prettier integration

### Testing Strategies

- Component tests using Cypress
- Test files in `tests/cypress/component/`
- Focus on user interactions and visual regression
- Test custom nodes/edges integration

## Critical Development Guidelines

### Coding Standards

1. **TypeScript First**: All code must be properly typed
2. **Composition API**: Use Vue 3 Composition API exclusively
3. **Reactive Patterns**: Use `shallowRef` where possible for performance
4. **No Prop Mutations**: Never mutate props directly
5. **Event Naming**: Use kebab-case for events (e.g., `node-drag-stop`)

### API Design Principles

1. **Composable-Driven**: Expose functionality through composables
2. **Type Safety**: Export all necessary types for consumers
3. **Backward Compatibility**: Maintain compatibility within major versions
4. **Tree-Shakeable**: Ensure all exports can be tree-shaken
5. **SSR-Safe**: Components must work in SSR environments

### Git and PR Guidelines

1. **Commit Convention**: Use conventional commits (feat:, fix:, docs:, etc.)
2. **Changesets**: Always create changesets for changes affecting packages
3. **Testing**: Ensure all tests pass before merging
4. **Documentation**: Update docs for any public API changes

### Style Import Requirements

Vue Flow requires explicit style imports:
```typescript
// Required styles
import '@vue-flow/core/dist/style.css'
// Optional theme
import '@vue-flow/core/dist/theme-default.css'
```

## Architecture & Patterns

### Core Architectural Concepts

1. **Reactive Store Pattern**
   - Custom store using Vue reactivity
   - State + Actions + Getters pattern
   - Singleton storage for multiple instances

2. **Provider/Inject System**
   - Flow state injected via symbols
   - Type-safe dependency injection
   - Avoids prop drilling

3. **Composable Architecture**
   - `useVueFlow()` - Main API access
   - `useNode()` - Node-specific state
   - `useEdge()` - Edge-specific state
   - `useHandle()` - Connection handling
   - `useNodeConnections()` - Node connection lookups

### State Management

```typescript
// State flows through the system:
User Input → Props/v-model → Store Actions → State Updates → Reactive Re-render
```

Key state concepts:
- Nodes/Edges stored in reactive Maps for O(1) access
- Computed properties for derived state
- Event hooks for side effects
- Connection lookups for efficient edge queries

### Extension System

1. **Custom Nodes**: Register via `nodeTypes` prop
2. **Custom Edges**: Register via `edgeTypes` prop
3. **Custom Handles**: Use Handle component or composable
4. **Event Handlers**: Extensive hook system
5. **Slots**: For UI customization

### Communication Patterns

- **Events**: Emitted for all user interactions
- **Props**: Two-way binding via v-model
- **Hooks**: Programmatic event subscriptions
- **Injection**: Access parent context via inject

## Recent Features (v1.44.0+)

### DOM Attributes Support (v1.45.0)
Nodes and edges now support a `domAttributes` prop for adding custom HTML/SVG attributes:
```typescript
// Node example
{
  id: 'node-1',
  position: { x: 100, y: 100 },
  domAttributes: {
    'data-testid': 'my-node',
    'data-custom': 'value'
  }
}
```

### Viewport Animation Features (v1.44.0)
1. **Interpolation Options**: Choose between 'smooth' (zoom interpolation) or 'linear' interpolation
2. **Custom Easing Functions**: Provide custom easing for viewport transitions
```typescript
// Example usage
fitView({
  duration: 800,
  ease: (t) => t * t, // quadratic easing
  interpolate: 'linear'
})
```

### Node Resizer Auto-Scale (v1.45.0)
The node resizer now supports an `autoScale` prop (default: true) that scales resize controls with the zoom level for better visibility.

### Performance Optimizations (v1.44.0)
- Widespread use of `shallowRef` for better performance with large graphs
- Optimized handle bounds calculations
- Improved connection lookup efficiency

### Accessibility Enhancements
- Full keyboard navigation support (Arrow keys for node movement)
- `focusable` prop for nodes and edges
- `ariaLabel` support for screen readers
- `disableKeyboardA11y` option to disable keyboard controls

### Connection Features
- `connectionStatus` for validation feedback
- `paneClickDistance` for click tolerance
- `autoPanSpeed` for edge auto-panning

## Common Development Tasks

### Adding a New Feature

1. Identify the appropriate package (core or addon)
2. Create composable if logic is reusable
3. Add TypeScript types/interfaces
4. Implement with reactive patterns
5. Add tests for the feature
6. Update documentation
7. Create changeset

### Creating Custom Nodes

```vue
<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@vue-flow/core'

defineProps<NodeProps>()
</script>

<template>
  <div class="custom-node">
    <Handle type="target" :position="Position.Top" />
    <!-- Node content -->
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
```

### Creating Custom Edges

```vue
<script setup lang="ts">
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@vue-flow/core'

const props = defineProps<EdgeProps>()
const path = computed(() => getBezierPath(props))
</script>

<template>
  <BaseEdge :path="path[0]" :marker-end="markerEnd" />
</template>
```

### Testing Procedures

1. Write component tests for new features
2. Test in example apps (Vite, Nuxt, Quasar)
3. Verify TypeScript types compile
4. Check SSR compatibility
5. Test with different Vue versions

### Deployment Process

1. Create PR with changes
2. Add changeset via `pnpm changeset`
3. CI runs tests and builds
4. Merge triggers automatic release
5. Packages published to npm

## Troubleshooting Guide

### Common Issues

1. **Styles not applied**: Ensure style imports are included
2. **TypeScript errors**: Check Vue version compatibility (3.3+)
3. **SSR issues**: Use client-only wrapper or check for browser APIs
4. **Performance**: Use `v-memo` for large graphs, limit re-renders

### Build Issues

- Clear `node_modules` and `pnpm-lock.yaml`
- Ensure pnpm version matches requirement
- Check Node version (v20+)
- Run `pnpm build` in root directory

### Development Setup Issues

- Use provided dev container for consistent environment
- Install recommended VS Code extensions
- Ensure git hooks are installed

## Key Files for AI Agents

When working on Vue Flow, prioritize reading these files:

1. **Core Component**: `packages/core/src/container/VueFlow/VueFlow.vue`
2. **Store Implementation**: `packages/core/src/store/index.ts`
3. **Type Definitions**: `packages/core/src/types/index.ts`
4. **Main Composable**: `packages/core/src/composables/useVueFlow.ts`
5. **Package Config**: `packages/core/package.json`
6. **Node Types**: `packages/core/src/types/node.ts`
7. **Edge Types**: `packages/core/src/types/edge.ts`
8. **Viewport Helper**: `packages/core/src/composables/useViewportHelper.ts`

## Performance Considerations

1. Use `shallowRef` for large objects
2. Implement `v-memo` for node lists
3. Debounce viewport updates
4. Use connection lookups for O(1) access
5. Minimize edge recalculations
6. Leverage `autoScale` for resize controls at different zoom levels

## External Resources

- **Official Docs**: https://vueflow.dev/
- **GitHub Issues**: https://github.com/bcakmakoglu/vue-flow/issues
- **Discord Community**: Join via website
- **Examples**: https://vueflow.dev/examples/
- **API Reference**: https://vueflow.dev/typedocs/
- **Changelog**: https://vueflow.dev/changelog/

## AI Agent Tips

### When Implementing Features
1. Always check for existing similar patterns in the codebase
2. Use the extensive type system - avoid `any` types
3. Follow the reactive patterns established in core composables
4. Test with both controlled and uncontrolled flow states
5. Consider performance implications for large graphs (1000+ nodes)

### Common Patterns to Follow
- Use `computed` for derived state, not watchers
- Prefer composables over mixins or direct store access
- Always provide proper TypeScript types for custom nodes/edges
- Use the established event naming conventions
- Leverage the injection system for accessing flow state in nested components

### Testing Custom Components
- Test with different viewport sizes and zoom levels
- Verify keyboard navigation works correctly
- Check that custom nodes/edges render in all example environments
- Ensure proper cleanup on component unmount
- Test with both light and dark themes if applicable