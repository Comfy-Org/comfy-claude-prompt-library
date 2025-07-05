# ComfyUI Frontend Repository Guide

**Repository:** [Comfy-Org/ComfyUI_frontend](https://github.com/Comfy-Org/ComfyUI_frontend)  
**License:** GPL-3.0-only  
**Version:** 1.22.2 (Check package.json for current version)  
**Local Path:** `~/projects/comfyui-frontend-testing/ComfyUI_frontend-clone`

## Repository Overview

ComfyUI_frontend is the official frontend implementation for ComfyUI, a powerful node-based interface for AI image generation workflows. It's a sophisticated Vue 3 application that provides a visual graph editor for creating and executing complex image generation pipelines.

### Purpose and Functionality
- **Visual Node Editor**: LiteGraph.js-based canvas for creating node workflows
- **Extension System**: Robust plugin architecture with bottom panel tab support  
- **Queue Management**: Execution queue with real-time progress tracking
- **Template Workflows**: Pre-built workflow templates for common use cases
- **Multi-language Support**: Built-in i18n with support for 7 languages
- **3D Visualization**: 3D model loading and animation capabilities
- **Desktop Integration**: Electron app with native platform features
- **Subgraph System**: Organize workflows into reusable subgraphs
- **Bottom Panel**: Extensible bottom panel with terminal tabs (logs, commands)
- **Audio Support**: Audio node functionality and upload capabilities
- **Release Management**: Built-in help center with release notifications

### Release Process
- **2-week release cycles**: 1 week development, 1 week feature freeze
- **Nightly releases**: Published daily to GitHub releases
- **Overlapping development**: Next version development starts during feature freeze
- **Version format**: `--front-end-version Comfy-Org/ComfyUI_frontend@latest`

## Technology Stack

### Core Technologies
- **Vue 3** (v3.5.13) with Composition API
- **TypeScript** (v5.4.5) for type safety
- **Pinia** (v2.1.7) for state management
- **PrimeVue** (v4.2.5) + TailwindCSS (v3.4.4) for UI
- **LiteGraph.js** (@comfyorg/litegraph v0.16.1) for node editor
- **Vite** (v5.4.19) for build tooling
- **Vue-i18n** (v9.14.3) for internationalization

### Key Dependencies
- **Zod** (v3.23.8) - Schema validation
- **Axios** (v1.8.2) - HTTP client
- **Lodash** (v4.17.21) - Utility functions
- **VueUse** (@vueuse/core v11.0.0) - Vue composition utilities
- **Three.js** (v0.170.0) - 3D rendering
- **Fuse.js** (v7.0.0) - Fuzzy search
- **Firebase** (v11.6.0) - Authentication and backend services

### Development Tools
- **Playwright** - Browser testing
- **Vitest** - Unit and component testing
- **ESLint** + **Prettier** - Code quality
- **Husky** - Git hooks
- **Vue DevTools** - Development debugging

## Directory Structure

```
ComfyUI_frontend/
├── src/                          # Main application source
│   ├── components/               # Vue components organized by feature
│   │   ├── actionbar/           # Top action bar components
│   │   ├── bottomPanel/         # Bottom panel and tabs
│   │   ├── common/              # Shared/reusable components
│   │   ├── dialog/              # Modal and dialog components
│   │   ├── graph/               # Node graph related components
│   │   ├── sidebar/             # Sidebar and navigation
│   │   ├── templates/           # Workflow template components
│   │   ├── bottomPanel/         # Bottom panel components
│   │   │   └── tabs/terminal/   # Terminal tab components
│   │   ├── breadcrumb/          # Subgraph breadcrumb navigation
│   │   ├── helpcenter/          # Help center and release notes
│   │   └── ...                  # Other feature-specific directories
│   ├── composables/             # Vue composables for shared logic
│   │   ├── auth/                # Authentication composables
│   │   ├── node/                # Node-specific functionality
│   │   ├── setting/             # Settings management
│   │   ├── widgets/             # Widget-specific composables
│   │   └── ...                  # Other domain-specific composables
│   ├── stores/                  # Pinia stores for state management
│   │   ├── workspace/           # Workspace-specific stores
│   │   │   ├── bottomPanelStore.ts # Bottom panel state management
│   │   │   └── ...              # Other workspace stores
│   │   ├── commandStore.ts      # Command execution
│   │   ├── graphStore.ts        # Graph canvas state
│   │   ├── workflowStore.ts     # Workflow management
│   │   ├── subgraphNavigationStore.ts # Subgraph navigation state
│   │   ├── releaseStore.ts      # Release management
│   │   └── ...                  # Other domain stores
│   ├── services/                # Business logic services
│   │   ├── nodeSearchService.ts # Node search functionality
│   │   ├── workflowService.ts   # Workflow operations
│   │   ├── subgraphService.ts   # Subgraph functionality
│   │   ├── releaseService.ts    # Release management
│   │   ├── audioService.ts      # Audio handling
│   │   └── ...                  # Other service modules
│   ├── extensions/core/         # Built-in extensions
│   │   ├── groupNode.ts         # Group node functionality
│   │   ├── noteNode.ts          # Note annotations
│   │   ├── maskeditor.ts        # Image mask editor
│   │   ├── uploadAudio.ts       # Audio upload functionality
│   │   └── ...                  # Other core extensions
│   ├── scripts/                 # Core application scripts
│   │   ├── api.ts               # Backend API communication
│   │   ├── app.ts               # Main application class
│   │   ├── ui/                  # UI utility scripts
│   │   └── utils.ts             # General utilities
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── views/                   # Top-level page components
│   └── locales/                 # i18n translation files
├── browser_tests/               # Playwright browser tests
│   ├── fixtures/                # Test page objects and utilities
│   ├── tests/                   # Test specifications
│   └── assets/                  # Test workflow files
├── tests-ui/                    # Unit and component tests
│   └── tests/                   # Test files organized by type
├── public/                      # Static assets
├── build/                       # Build configuration and plugins
└── scripts/                     # Build and deployment scripts
```

## Development Workflow

### Essential Commands

```bash
# Development
npm run dev                    # Start development server
npm run dev:electron          # Start with Electron API mocked

# Code Quality
npm run typecheck             # TypeScript type checking
npm run lint                  # ESLint code linting
npm run lint:fix              # Auto-fix linting issues
npm run format                # Format code with Prettier
npm run format:check          # Check code formatting

# Testing
npm run test:unit             # Run unit tests
npm run test:component        # Run component tests
npm run test:browser          # Run Playwright browser tests

# Build
npm run build                 # Production build
npm run build:types          # Build TypeScript types
npm run preview              # Preview production build

# i18n
npm run locale               # Manage translations
npm run collect-i18n         # Collect i18n strings

# Setup
npm run prepare             # Install Git hooks
```

### Development Server Setup

1. **Start ComfyUI backend** at `localhost:8188`
2. **Environment setup**: Copy `.env.example` to `.env` and configure
3. **Run development server**: `npm run dev` 
4. **Access**: `http://localhost:5173/`

### Code Quality Workflow

**Critical Post-Development Process:**
1. Create tests (unit, component, browser as appropriate)
2. Run tests until passing: `npm run test:unit`, `npm run test:component`, `npm run test:browser`
3. Run quality checks: `npm run typecheck`, `npm run lint`, `npm run format`
4. Check README updates and documentation needs
5. Consider external documentation updates at https://docs.comfy.org

## Critical Development Guidelines

### Vue 3 Development Patterns

**MUST use Vue 3 Composition API:**
```typescript
// ✅ Correct: Vue 3.5+ style props
<script setup lang="ts">
interface Props {
  title: string
  isVisible?: boolean
}

// Destructure props directly (Vue 3.5+ preserves reactivity)
const { title, isVisible = false } = defineProps<Props>()

const emit = defineEmits<{
  close: [reason: string]
}>()

// Use ref/reactive for state
const isLoading = ref(false)
const data = reactive({ items: [] })

// Use computed for derived state
const displayTitle = computed(() => title.toUpperCase())

// Lifecycle hooks
onMounted(() => {
  // Setup logic
})
</script>
```

**PrimeVue Component Guidelines:**
```typescript
// ✅ Use current components
import Select from 'primevue/select'          // NOT Dropdown
import Popover from 'primevue/popover'        // NOT OverlayPanel  
import DatePicker from 'primevue/datepicker'  // NOT Calendar
import ToggleSwitch from 'primevue/toggleswitch' // NOT InputSwitch
import Drawer from 'primevue/drawer'          // NOT Sidebar
```

### Styling Guidelines

**Always prefer Tailwind over custom CSS:**
```html
<!-- ✅ Preferred -->
<div class="flex items-center justify-between p-4 bg-surface-100 dark-theme:bg-surface-800">

<!-- ❌ Avoid custom CSS -->
<div class="custom-header">
```

**Dark theme classes:**
```html
<!-- ✅ Correct dark theme prefix -->
<div class="bg-white dark-theme:bg-gray-900">

<!-- ❌ Wrong - don't use "dark:" -->
<div class="bg-white dark:bg-gray-900">
```

### TypeScript Guidelines

- **Avoid `@ts-expect-error`** - Fix type issues properly
- **Use strict TypeScript** settings
- **Leverage Zod** for runtime validation
- **Proper type imports**: `import type { } from ''`

### i18n Requirements

**All user-facing strings must use vue-i18n:**
```typescript
// ✅ Correct
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const message = t('actions.save')

// ❌ Incorrect
const message = "Save"
```

**Add translations to:** `src/locales/en/main.json`

## Architecture & Patterns

### Extension System Architecture

ComfyUI's extension system is central to its design:

```typescript
// Extension registration pattern
app.registerExtension({
  name: "MyExtension",
  
  // Settings registration
  settings: [
    {
      id: 'my.setting',
      name: 'My Setting',
      type: 'boolean',
      defaultValue: true
    }
  ],
  
  // Bottom panel tabs (NEW)
  bottomPanelTabs: [
    {
      id: 'my.tab',
      title: 'My Tab',
      icon: 'pi pi-list',
      type: 'vue',
      component: MyTabComponent
    }
  ],
  
  // Commands and keybindings
  commands: [
    {
      id: 'my.command',
      function: () => { /* implementation */ }
    }
  ],
  
  keybindings: [
    {
      combo: { key: 'k', ctrl: true },
      commandId: 'my.command'
    }
  ],
  
  // Lifecycle hooks
  async init() { /* called after canvas creation */ },
  async setup() { /* called after full setup */ },
  beforeRegisterNodeDef(nodeType, nodeData, app) { /* modify nodes */ },
  nodeCreated(node, app) { /* handle new nodes */ }
})
```

### State Management Patterns

**Store Organization:**
```typescript
// Pinia store pattern (setup style)
export const useFeatureStore = defineStore('feature', () => {
  // State
  const items = ref([])
  const isLoading = ref(false)
  
  // Getters
  const itemCount = computed(() => items.value.length)
  
  // Actions
  async function fetchItems() {
    isLoading.value = true
    try {
      const response = await api.getItems()
      items.value = response.data
    } finally {
      isLoading.value = false
    }
  }
  
  return { items, isLoading, itemCount, fetchItems }
})
```

### Service Layer Patterns

**Composable-style services preferred:**
```typescript
export function useNodeSearchService(data: NodeDef[]) {
  const searchIndex = new FuseSearch(data, options)
  
  function searchNodes(query: string, filters: Filter[] = []) {
    return searchIndex.search(query, filters)
  }
  
  function updateData(newData: NodeDef[]) {
    searchIndex.updateData(newData)
  }
  
  return { searchNodes, updateData }
}
```

### Component Communication

**Props down, events up:**
```typescript
// Parent component
<ChildComponent 
  :data="items" 
  @item-selected="handleSelection"
  @item-deleted="handleDeletion" 
/>

// Child component emits
const emit = defineEmits<{
  'item-selected': [item: Item]
  'item-deleted': [id: string]
}>()
```

**Cross-component communication via stores:**
```typescript
// In any component that needs shared state
const workflowStore = useWorkflowStore()
const { currentWorkflow, isExecuting } = storeToRefs(workflowStore)
```

### Bottom Panel Extension System

The bottom panel provides an extensible tab system for additional functionality:

```typescript
// Bottom panel tab definition
interface BottomPanelExtension {
  id: string
  title: string
  icon: string
  type: 'vue' | 'custom'
  component?: Component
  tooltip?: string
}

// Register bottom panel tab via extension
app.registerExtension({
  name: 'MyExtension',
  bottomPanelTabs: [
    {
      id: 'my.tab',
      title: 'My Tab',
      icon: 'pi pi-list',
      type: 'vue',
      component: MyTabComponent
    }
  ]
})

// Or register directly with the store
const bottomPanelStore = useBottomPanelStore()
bottomPanelStore.registerBottomPanelTab({
  id: 'my.tab',
  title: 'My Tab',
  icon: 'pi pi-list',
  type: 'vue',
  component: MyTabComponent
})
```

**Built-in bottom panel tabs:**
- **Logs Tab**: Displays application logs and execution output
- **Commands Tab**: Terminal interface for command execution (Electron only)

### Subgraph System Architecture

Subgraphs allow organizing complex workflows into reusable components:

```typescript
// Subgraph service usage
const subgraphService = useSubgraphService()

// Register a subgraph node definition
subgraphService.registerLitegraphNode(
  nodeDef,        // ComfyNodeDef
  subgraph,       // Subgraph instance
  exportedSubgraph // ExportedSubgraph
)

// Navigation between subgraphs
const subgraphNav = useSubgraphNavigationStore()
subgraphNav.enterSubgraph(subgraphId)
subgraphNav.exitSubgraph()
```

**Key subgraph features:**
- **Hierarchical Navigation**: Breadcrumb-based subgraph navigation
- **Input/Output Mapping**: Automatic interface generation
- **Reusable Components**: Export/import subgraph definitions
- **Nested Subgraphs**: Support for multiple levels of nesting

### Audio System Architecture

Audio nodes and processing capabilities:

```typescript
// Audio service for handling audio operations
const audioService = useAudioService()

// Upload audio files
const uploadAudio = (file: File) => {
  return audioService.uploadAudio(file)
}

// Audio node functionality
const audioNode = {
  type: 'audio',
  inputs: ['audio_input'],
  outputs: ['audio_output'],
  // Audio processing logic
}
```

**Audio features:**
- **Audio Upload**: Support for audio file uploads
- **Audio Processing**: Node-based audio manipulation
- **Format Support**: Multiple audio format compatibility

## Common Development Tasks

### Adding a New Feature

1. **Plan the implementation** using TodoWrite
2. **Identify affected components** - check existing patterns
3. **Create/update stores** if state management needed  
4. **Implement composables** for shared logic
5. **Create/modify components** following Vue 3 patterns
6. **Add tests** (unit, component, browser)
7. **Update i18n** translations
8. **Run quality checks** before submission

### Creating a New Extension

1. **Register extension** with `app.registerExtension()`
2. **Define settings** if configuration needed
3. **Implement lifecycle hooks** as required
4. **Add commands/keybindings** for user interaction
5. **Add bottom panel tabs** if UI extension needed
6. **Test compatibility** with other extensions
7. **Document extension APIs** and usage

### Adding a Bottom Panel Tab

1. **Create Vue component** for tab content
2. **Define tab metadata** (id, title, icon)
3. **Register via extension** or directly with store
4. **Test tab functionality** and responsiveness
5. **Add appropriate commands** for tab interaction
6. **Consider Electron-specific features** if needed

### Adding a New Component

1. **Check existing components** for similar patterns
2. **Choose appropriate directory** under `src/components/`
3. **Follow naming conventions** (PascalCase for files)
4. **Use TypeScript** with proper prop definitions
5. **Implement tests** for component behavior
6. **Add to component registry** if needed globally
7. **Consider bottom panel integration** if UI extension needed
8. **Update component READMEs** with new additions

### Working with Subgraphs

1. **Use subgraph service** for registration and management
2. **Implement proper navigation** with breadcrumb system
3. **Define clear interfaces** for input/output mapping
4. **Test nested subgraph scenarios** thoroughly
5. **Consider performance** with complex subgraph hierarchies
6. **Document subgraph patterns** for reusability

### Integrating Audio Features

1. **Use audio service** for file operations
2. **Implement proper validation** for audio formats
3. **Handle audio processing** in background threads
4. **Test audio upload functionality** across platforms
5. **Consider audio quality** and compression settings
6. **Document audio node interfaces** clearly

### Debugging Common Issues

**Extension Loading:**
- Check extension registration syntax
- Verify hook implementations
- Test in development mode first

**State Management:**
- Use Vue DevTools for store inspection
- Check store composition and reactivity
- Verify proper store references

**Canvas/Graph Issues:**
- Use `nextFrame()` after canvas modifications
- Check LiteGraph event handling
- Verify node reference management

**Styling Issues:**
- Check Tailwind class conflicts
- Verify dark theme class usage
- Test responsive breakpoints

## Testing Infrastructure

### Multi-layered Testing Approach

**1. Unit Tests** (`tests-ui/tests/`)
```bash
npm run test:unit                    # Run all unit tests
npm run test:unit -- --watch        # Watch mode
npm run test:unit -- specific.test.ts  # Single file
```

**2. Component Tests** (`src/components/**/*.spec.ts`)
```bash
npm run test:component              # Run component tests
npm run test:component -- --watch   # Watch mode
```

**3. Browser Tests** (`browser_tests/`)
```bash
npm run test:browser                # Run Playwright tests
npx playwright test --ui            # Interactive mode
npx playwright test widget.spec.ts  # Specific test
```

### Testing Patterns

**Component Testing:**
```typescript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' }
    })
    
    expect(wrapper.text()).toContain('Test')
  })
})
```

**Browser Testing:**
```typescript
import { comfyPageFixture as test } from '../fixtures/ComfyPage'

test.describe('Node Interaction', () => {
  test('should create and connect nodes', async ({ comfyPage }) => {
    await comfyPage.loadWorkflow('simple_workflow')
    const node = await comfyPage.getFirstNodeRef()
    await node.click()
    
    await expect(comfyPage.canvas).toHaveScreenshot('node-selected.png')
  })
})
```

### Critical Testing Guidelines

- **Always call `nextFrame()`** after canvas interactions
- **Use node references** over hardcoded coordinates
- **Clean up persistent state** between tests
- **Prefer functional assertions** over screenshots
- **Test in Linux environment** for CI compatibility
- **Multi-user testing**: Use `--multi-user` flag for parallel tests
- **Audio testing**: Test audio node functionality and upload capabilities
- **Subgraph testing**: Test subgraph navigation and functionality
- **Bottom panel testing**: Test extension tabs and terminal functionality

## Git and PR Guidelines

### Commit Message Format
```
[category] Brief description

Detailed explanation if needed

Fixes #123
```

**Categories:** `[feat]`, `[fix]`, `[docs]`, `[chore]`, `[refactor]`

### PR Requirements

**Before creating PR:**
1. All tests passing locally
2. Code quality checks passed
3. No `@ts-expect-error` additions
4. i18n translations added
5. Documentation updated if needed

**PR Description Format:**
- **Be concise** - 1-3 sentences preferred
- **No "Generated with Claude Code"** references
- **Add "Fixes #n"** for issue resolution
- **Use bullet points** only for complex changes

### Branch Strategy
- **Main branch**: `main`  
- **Feature branches**: descriptive names
- **Release branches**: follow project conventions

## Meta-Optimization for AI Development

### File Priority for AI Agents

**Always read first:**
1. `CLAUDE.md` - Project-specific guidelines
2. `src/composables/README.md` - Composable patterns
3. `src/stores/README.md` - State management patterns  
4. `src/services/README.md` - Service layer patterns
5. `src/extensions/core/README.md` - Extension system
6. Component-specific READMEs in subdirectories

### Key Decision Points

**When to create vs. modify:**
- **ALWAYS prefer editing** existing files over creating new ones
- **Check existing patterns** before implementing new approaches
- **Use established services** rather than reimplementing

**Architecture decisions:**
- **Domain-driven design** - organize by feature domains
- **Clean public APIs** - thousands of extensions depend on stability
- **Composition over inheritance** - use composables and services
- **Reactive patterns** - leverage Vue 3 reactivity properly

### Common Pitfalls to Avoid

1. **Using deprecated PrimeVue components**
2. **Adding custom CSS instead of Tailwind**
3. **Bypassing the extension system**
4. **Breaking API compatibility**
5. **Ignoring i18n requirements**
6. **Using Vue 2 patterns in Vue 3 code**
7. **Not testing across different environments**

### Performance Considerations

- **Use VueUse composables** for common functionality
- **Leverage Vue 3 tree-shaking** 
- **Minimize bundle size** with proper imports
- **Optimize canvas operations** with `nextFrame()`
- **Cache expensive computations** in services
- **Use virtual scrolling** for large lists

---

This guide serves as the definitive reference for AI-assisted development in the ComfyUI frontend codebase, emphasizing the clean architecture, extensibility, and stability required for a platform supporting thousands of users and extensions.