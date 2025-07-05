# xyflow Repository Guide for Claude Code

## Repository Overview

**Purpose**: xyflow is a powerful open-source monorepo containing React Flow and Svelte Flow - highly customizable libraries for building node-based UIs, workflow systems, diagrams, and interactive flow charts.

**Repository**: https://github.com/xyflow/xyflow  
**Current Version**: React Flow v12.8.1, Svelte Flow v1.2.1  
**License**: MIT  
**Stars**: 30,378+ (as of July 2025)  
**Primary Language**: TypeScript  
**Maintainer**: xyflow team (commercial open source)

## Technology Stack

### Primary Technologies
- **Languages**: TypeScript, JavaScript
- **Frameworks**: React 17+, Svelte 5+
- **Build System**: Turbo monorepo, Rollup, Vite
- **Package Manager**: pnpm v9.2.0
- **Testing**: Playwright (E2E), Cypress (component tests)
- **State Management**: Zustand (React Flow)
- **Styling**: PostCSS, CSS modules

### Key Dependencies
- `@xyflow/system`: Shared core functionality
- `classcat`: Conditional CSS class concatenation
- `zustand`: State management for React Flow
- `@svelte-put/shortcut`: Keyboard shortcuts for Svelte Flow

## Directory Structure

```
xyflow/
├── packages/                    # Core library packages
│   ├── react/                  # React Flow v12
│   │   ├── src/
│   │   │   ├── components/     # Core React components
│   │   │   ├── hooks/          # React hooks API
│   │   │   ├── container/      # Main container components
│   │   │   ├── store/          # Zustand store setup
│   │   │   └── types/          # TypeScript definitions
│   │   └── package.json
│   ├── svelte/                 # Svelte Flow
│   │   ├── src/
│   │   │   ├── lib/           # Svelte library code
│   │   │   │   ├── components/ # Core Svelte components
│   │   │   │   ├── hooks/      # Svelte stores/hooks
│   │   │   │   ├── actions/    # Svelte actions
│   │   │   │   └── plugins/    # Additional components
│   │   │   └── routes/         # Demo/test routes
│   │   └── package.json
│   └── system/                 # Shared core library
│       ├── src/
│       │   ├── utils/          # Shared utilities
│       │   ├── types/          # Shared types
│       │   ├── xydrag/         # Drag handling
│       │   ├── xyhandle/       # Connection handling
│       │   ├── xypanzoom/      # Pan/zoom functionality
│       │   └── xyresizer/      # Node resizing
│       └── package.json
├── examples/                   # Example applications
│   ├── react/                  # React examples & tests
│   └── svelte/                 # Svelte examples & tests
├── tests/                      # Test suites
│   └── playwright/             # E2E tests
├── tooling/                    # Build configuration
│   ├── eslint-config/
│   ├── postcss-config/
│   ├── rollup-config/
│   └── tsconfig/
├── turbo.json                  # Turbo monorepo config
├── pnpm-workspace.yaml         # PNPM workspace config
└── CONTRIBUTING.md             # Contribution guidelines
```

## Development Workflow

### Essential Commands
```bash
# Install dependencies
pnpm install

# Development (runs all packages)
pnpm dev

# Development for specific framework
pnpm dev:react
pnpm dev:svelte

# Build all packages
pnpm build

# Run tests
pnpm test:react      # React E2E tests
pnpm test:svelte     # Svelte E2E tests
pnpm test:react:ui   # React tests with UI
pnpm test:svelte:ui  # Svelte tests with UI

# Code quality
pnpm lint            # Run ESLint
pnpm typecheck       # TypeScript checking

# Release process (uses changesets)
pnpm release
```

### Development Setup
1. **Prerequisites**: Node.js, pnpm v9.2.0
2. **Installation**: `pnpm install`
3. **Start development**: `pnpm dev`
4. **Run examples**: Navigate to `http://localhost:3000` (React) or appropriate port

## Critical Development Guidelines

### Git Workflow
- Main branch: `main`
- React Flow v11 maintained on `v11` branch
- Uses changesets for release management
- Commit messages should be descriptive and follow the changeset style guide
- PRs require meaningful descriptions

### Changeset Style Guide
- Use active voice and present tense ("Fix..." not "Fixed...")
- Communicate impact of changes for humans
- Use backticks for function/component names
- Omit redundant verbs and personal pronouns
- Example: "Fix reconnections when connectionMode is set to loose"

### Code Standards
- TypeScript for all new code
- Follow existing patterns in codebase
- Components should be highly customizable
- Maintain backward compatibility when possible
- Performance is critical - only re-render changed nodes

### Contributing Philosophy
- Core features decided by maintainer team ("cathedral" model)
- Community contributions welcome for:
  - Bug reports and fixes
  - Documentation improvements
  - Answering questions in Discord/GitHub
  - Creating tutorials
- Always discuss new features before implementing

## Architecture & Patterns

### Core Concepts

#### 1. Monorepo Structure
- `@xyflow/system`: Shared core functionality used by both React and Svelte
- `@xyflow/react`: React-specific implementation
- `@xyflow/svelte`: Svelte-specific implementation

#### 2. State Management
- **React Flow**: Uses Zustand for centralized state management
- **Svelte Flow**: Uses Svelte stores and runes (Svelte 5)
- Both share common state patterns from `@xyflow/system`

#### 3. Component Architecture
```
ReactFlow/SvelteFlow (Main Component)
├── Viewport (Pan/Zoom handling)
├── NodeRenderer (Renders all nodes)
├── EdgeRenderer (Renders all edges)
├── ConnectionLine (Active connections)
├── Controls (Zoom/Fit controls)
├── MiniMap (Overview)
└── Background (Grid/Dots pattern)
```

#### 4. Hook/Store Patterns

**React Flow Hooks**:
- `useReactFlow()`: Main instance API
- `useNodes()`, `useEdges()`: State access
- `useNodesState()`, `useEdgesState()`: Stateful helpers
- `useViewport()`: Viewport control
- `useConnection()`: Connection state

**Svelte Flow Stores**:
- `useSvelteFlow()`: Main instance API
- Node/edge stores with Svelte 5 runes
- Reactive viewport updates

#### 5. Performance Optimizations
- Only changed nodes re-render
- Virtualization for large graphs
- Memoized calculations
- Batch updates via `BatchProvider`

### Extension Points

#### Custom Nodes
```typescript
// React
const CustomNode = ({ data, selected }) => {
  return <div className={selected ? 'selected' : ''}>{data.label}</div>;
};

// Svelte
// CustomNode.svelte
<script>
  export let data;
  export let selected;
</script>
<div class:selected>{data.label}</div>
```

#### Custom Edges
- Extend from `BaseEdge` component
- Support for custom paths and labels
- Interactive edge updates

#### Custom Handles
- Connection points on nodes
- Support for validation logic
- Multiple handles per node

## Common Development Tasks

### Adding a New Feature
1. Check existing discussions/issues
2. Discuss with maintainers first
3. Create feature in appropriate package
4. Add tests (E2E in `/tests/playwright`)
5. Update types if needed
6. Add changeset for release notes
7. Submit PR with clear description

### Creating Examples
1. Add to `/examples/react` or `/examples/svelte`
2. Follow existing example patterns
3. Include in example routes
4. Document any new patterns introduced

### Testing Approach
1. **E2E Tests**: Playwright for user interactions
2. **Component Tests**: Cypress for React components
3. **Test Location**: `/tests/playwright/e2e/`
4. **Example Tests**: Use generic test patterns in `/examples/{framework}/src/generic-tests/`

### Debugging Tips
- Use React/Svelte DevTools
- Enable `debug` prop on ReactFlow/SvelteFlow
- Check store state with `useReactFlow().toObject()`
- Use UI test mode: `pnpm test:react:ui`

## API Design Principles

### Composability
- Small, focused components
- Hooks/stores for state access
- Plugin architecture for extensions

### Customization
- Every visual element customizable
- CSS variables for theming
- Override default components

### Performance
- Minimize re-renders
- Efficient diffing algorithms
- Optimized event handling

### Developer Experience
- TypeScript-first API
- Comprehensive types
- Clear error messages
- Extensive documentation

## Important Files Reference

### Core Implementation
- `/packages/react/src/container/ReactFlow/index.tsx` - Main React component
- `/packages/svelte/src/lib/container/SvelteFlow/SvelteFlow.svelte` - Main Svelte component
- `/packages/system/src/xypanzoom/XYPanZoom.ts` - Pan/zoom implementation
- `/packages/system/src/xyhandle/XYHandle.ts` - Connection handling

### Configuration
- `/turbo.json` - Monorepo task configuration
- `/pnpm-workspace.yaml` - Package workspace setup
- `/.changeset/config.json` - Release configuration

### Types
- `/packages/react/src/types/` - React Flow types
- `/packages/svelte/src/lib/types/` - Svelte Flow types
- `/packages/system/src/types/` - Shared types

## External Resources

### Official Documentation
- React Flow: https://reactflow.dev
- Svelte Flow: https://svelteflow.dev
- API Reference: https://reactflow.dev/api-reference
- Learn Section: https://reactflow.dev/learn

### Community
- Discord: https://discord.gg/Bqt6xrs
- GitHub Discussions: https://github.com/xyflow/xyflow/discussions
- Examples: https://reactflow.dev/examples

### Pro/Commercial
- React Flow Pro: https://reactflow.dev/pro
- Contact: info@reactflow.dev

## Quick Decision Tree

**Q: Adding a new node type?**
→ Create component in your app, pass via `nodeTypes` prop

**Q: Custom connection behavior?**
→ Use connection handlers and validation props

**Q: Performance issues?**
→ Check node count, use `onlyRenderVisibleElements`, optimize custom nodes

**Q: State management?**
→ Use provided hooks (React) or stores (Svelte), avoid direct manipulation

**Q: Styling approach?**
→ CSS modules for components, CSS variables for theming

**Q: Contributing code?**
→ Discuss first, follow patterns, add tests, create changeset