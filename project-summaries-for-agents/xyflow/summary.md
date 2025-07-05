# XYFlow Repository Analysis for Claude Code

## Repository Overview

**Purpose**: XYFlow is a powerful monorepo containing open source libraries for building node-based UIs with React (React Flow) or Svelte (Svelte Flow). These libraries are ready out-of-the-box and infinitely customizable for creating interactive flow charts, node editors, workflow systems, and diagrams.

**Repository**: https://github.com/xyflow/xyflow  
**License**: MIT  
**Main Websites**: 
- React Flow: https://reactflow.dev
- Svelte Flow: https://svelteflow.dev  
- Organization: https://xyflow.com

## Technology Stack

### Core Technologies
- **Languages**: TypeScript, JavaScript
- **Frameworks**: React (>=17), Svelte (^5.25.0)
- **Build Tools**: Turbo (monorepo), Rollup, Vite, SvelteKit
- **Package Manager**: pnpm (v9.2.0)
- **Testing**: Cypress, Playwright
- **State Management**: Zustand (React Flow)
- **Core Dependencies**: 
  - d3-zoom, d3-drag, d3-selection (pan/zoom interactions)
  - classcat (className utilities)
  - @svelte-put/shortcut (Svelte keyboard shortcuts)

### Development Tools
- **Linting**: ESLint with custom config
- **Type Checking**: TypeScript 5.4.5
- **CSS Processing**: PostCSS with autoprefixer, cssnano
- **Version Management**: Changesets for releases
- **CI/CD**: Changeset GitHub action

## Directory Structure

```
xyflow/
├── packages/                    # Core library packages
│   ├── react/                  # React Flow v12 (@xyflow/react)
│   │   ├── src/
│   │   │   ├── additional-components/  # Background, Controls, MiniMap, etc.
│   │   │   ├── components/            # Core React components
│   │   │   ├── container/             # Main container components
│   │   │   ├── contexts/              # React contexts
│   │   │   ├── hooks/                 # React hooks
│   │   │   ├── store/                 # Zustand store
│   │   │   ├── styles/                # CSS files
│   │   │   ├── types/                 # TypeScript types
│   │   │   └── utils/                 # Utility functions
│   │   └── package.json
│   ├── svelte/                 # Svelte Flow (@xyflow/svelte)
│   │   ├── src/lib/
│   │   │   ├── actions/               # Svelte actions
│   │   │   ├── components/            # Svelte components
│   │   │   ├── container/             # Container components
│   │   │   ├── hooks/                 # Svelte hooks (runes)
│   │   │   ├── plugins/               # Additional components
│   │   │   ├── store/                 # Svelte stores/runes
│   │   │   ├── types/                 # TypeScript types
│   │   │   └── utils/                 # Utility functions
│   │   └── package.json
│   └── system/                 # Shared vanilla JS core (@xyflow/system)
│       ├── src/
│       │   ├── xydrag/                # Dragging functionality
│       │   ├── xyhandle/              # Handle/connection logic
│       │   ├── xyminimap/             # Minimap utilities
│       │   ├── xypanzoom/             # Pan/zoom functionality
│       │   ├── xyresizer/             # Node resizing
│       │   ├── utils/                 # Shared utilities
│       │   └── types/                 # Shared types
│       └── package.json
├── examples/                   # Example applications
│   ├── react/                  # React examples with Cypress tests
│   ├── svelte/                 # Svelte examples
│   └── astro-xyflow/          # Astro integration example
├── tests/                      # E2E tests
│   └── playwright/            # Playwright test suites
├── tooling/                    # Shared tooling configs
│   ├── eslint-config/
│   ├── postcss-config/
│   ├── rollup-config/
│   └── tsconfig/
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # PNPM workspace config
└── package.json                # Root package.json
```

## Development Workflow

### Essential Commands

```bash
# Install dependencies (must have pnpm installed)
pnpm install

# Development
pnpm dev                    # Run all packages in dev mode
pnpm dev:react             # Run React Flow dev only
pnpm dev:svelte            # Run Svelte Flow dev only

# Building
pnpm build                 # Build all packages
pnpm build:all            # Build everything including examples

# Testing
pnpm test:react           # Run React Flow tests
pnpm test:svelte          # Run Svelte Flow tests
pnpm test:react:ui        # Run tests with UI
pnpm test:svelte:ui       # Run tests with UI

# Code Quality
pnpm lint                 # Run ESLint on packages
pnpm typecheck            # Run TypeScript type checking

# Releases
pnpm release              # Publish packages using changesets
```

### Development Setup
1. Install pnpm globally: `npm i -g pnpm`
2. Install dependencies: `pnpm install`
3. Build once: `pnpm build`
4. Start development: `pnpm dev`

## Critical Development Guidelines

### Git and PR Guidelines
- Use meaningful commit messages following changeset style guide
- Create changesets for PR changes
- Use active voice and present tense in commit messages
- Use backticks for function/component names
- Never use git commands with `-i` flag (interactive mode)

### Code Style and Patterns
- TypeScript throughout with proper types
- Component-based architecture
- Hooks pattern for React Flow
- Runes (Svelte 5 signals) for Svelte Flow
- Shared vanilla JS core in @xyflow/system
- Framework-specific implementations leverage each framework's strengths

### Contributing Philosophy
- Cathedral-style development - direction decided by core team
- Non-code contributions highly valued (bug reports, docs, tutorials)
- Reach out before building new features
- Follow Code of Conduct

### Changeset Style Guide
- Changelogs are for humans
- Communicate impact of changes
- Use active voice and present tense
- Omit redundant verbs and personal pronouns
- Focus on user impact, not implementation details

## Architecture & Patterns

### Core Architecture

1. **Three-Layer Architecture**:
   - **@xyflow/system**: Vanilla JS core with shared logic
   - **@xyflow/react**: React-specific implementation
   - **@xyflow/svelte**: Svelte-specific implementation

2. **Shared Core Features**:
   - Pan & Zoom (XYPanZoom)
   - Node Dragging (XYDrag)
   - Handle Connections (XYHandle)
   - Minimap (XYMiniMap)
   - Node Resizing (XYResizer)
   - Edge path calculations
   - DOM utilities and measurements

3. **State Management**:
   - React Flow: Zustand for global state
   - Svelte Flow: Svelte 5 runes ($state)
   - Both use batch updates for performance

4. **Rendering Strategy**:
   - Only changed nodes are re-rendered
   - Virtual viewport for performance
   - SVG-based edges with various path types

### Key Design Patterns

1. **Hook Pattern (React)**:
   - `useReactFlow()`: Main instance hook
   - `useNodes()`, `useEdges()`: State hooks
   - `useNodesState()`, `useEdgesState()`: Stateful hooks
   - Custom hooks for all functionality

2. **Action/Store Pattern (Svelte)**:
   - Actions for DOM interactions
   - Runes for reactive state
   - Stores for global state management

3. **Plugin Architecture**:
   - Background, MiniMap, Controls as separate components
   - Node/Edge types extensible via props
   - Custom nodes/edges as components

4. **Event System**:
   - Comprehensive event handlers
   - Connection events
   - Viewport events
   - Selection events

## Common Development Tasks

### Adding a New Feature

1. **Identify Target Package(s)**:
   - Shared logic → @xyflow/system
   - React-specific → @xyflow/react
   - Svelte-specific → @xyflow/svelte

2. **Implementation Steps**:
   ```bash
   # 1. Create feature branch
   git checkout -b feat/my-feature
   
   # 2. Implement in appropriate package
   # 3. Add/update tests
   # 4. Update examples if needed
   # 5. Create changeset
   pnpm changeset
   
   # 6. Test thoroughly
   pnpm test:react  # or test:svelte
   ```

3. **Feature Checklist**:
   - [ ] TypeScript types added
   - [ ] Tests written
   - [ ] Examples updated
   - [ ] Changeset created
   - [ ] Documentation considered

### Testing Procedures

1. **Unit Tests**: Component tests using Cypress
2. **E2E Tests**: Full flow tests with Playwright
3. **Example Apps**: Manual testing with examples
4. **Cross-Framework**: Ensure feature parity

### Debugging Common Issues

1. **Build Issues**:
   - Clean and rebuild: `pnpm clean && pnpm install && pnpm build`
   - Check turbo cache: `rm -rf node_modules/.cache/turbo`

2. **Type Errors**:
   - Run `pnpm typecheck` to identify issues
   - Check imports from correct packages

3. **Development Server**:
   - Ensure ports are available
   - Check console for webpack/vite errors

## Key Files for Claude Code

### Priority Files to Read

1. **Architecture Understanding**:
   - `/packages/system/src/index.ts` - Core exports
   - `/packages/react/src/hooks/useReactFlow.ts` - Main React hook
   - `/packages/svelte/src/lib/container/SvelteFlow/SvelteFlow.svelte` - Main Svelte component

2. **Type Definitions**:
   - `/packages/system/src/types/index.ts` - Shared types
   - `/packages/react/src/types/index.ts` - React types
   - `/packages/svelte/src/lib/types/index.ts` - Svelte types

3. **Configuration**:
   - `/turbo.json` - Build pipeline
   - `/pnpm-workspace.yaml` - Workspace setup
   - Package-specific `package.json` files

4. **Examples for Patterns**:
   - `/examples/react/src/examples/` - React patterns
   - `/examples/svelte/src/routes/examples/` - Svelte patterns

## External Resources

- **Documentation**: 
  - React Flow: https://reactflow.dev/learn
  - Svelte Flow: https://svelteflow.dev/learn
- **API Reference**: 
  - React Flow: https://reactflow.dev/api-reference
  - Svelte Flow: https://svelteflow.dev/api-reference
- **Discord**: https://discord.gg/Bqt6xrs
- **Pro Version**: https://pro.reactflow.dev

## Notes for AI Development

1. **Always Check Existing Patterns**: Before implementing, check how similar features are implemented
2. **Maintain Feature Parity**: Features should work similarly in both React and Svelte versions
3. **Use TypeScript Strictly**: All new code must be properly typed
4. **Test Cross-Framework**: Changes to system package affect both frameworks
5. **Follow Conventions**: Naming, file structure, and patterns are consistent throughout
6. **Consider Performance**: These libraries handle large graphs, optimization matters
7. **Backwards Compatibility**: Be careful with breaking changes, many production apps depend on these