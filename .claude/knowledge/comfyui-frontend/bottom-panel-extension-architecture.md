# Bottom Panel Extension Architecture

## Overview

ComfyUI's bottom panel system provides an extensible workspace for terminal functionality, logs, and custom extension content. The system is built with Vue 3, TypeScript, and follows a modular architecture that supports both Vue components and custom DOM rendering.

## Current Architecture (Single Panel)

### Core Components

#### State Management (`bottomPanelStore.ts`)
```typescript
export const useBottomPanelStore = defineStore('bottomPanel', () => {
  const bottomPanelVisible = ref(false)
  const bottomPanelTabs = ref<BottomPanelExtension[]>([])
  const activeBottomPanelTabId = ref<string>('')
  
  const registerBottomPanelTab = (tab: BottomPanelExtension) => {
    bottomPanelTabs.value = [...bottomPanelTabs.value, tab]
    // Auto-register toggle command for each tab
    useCommandStore().registerCommand({
      id: `Workspace.ToggleBottomPanelTab.${tab.id}`,
      function: () => toggleBottomPanelTab(tab.id)
    })
  }
})
```

#### Component Structure
```vue
<!-- BottomPanel.vue -->
<template>
  <div class="flex flex-col h-full">
    <Tabs v-model:value="bottomPanelStore.activeBottomPanelTabId">
      <Tab v-for="tab in bottomPanelStore.bottomPanelTabs">
        {{ tab.title.toUpperCase() }}
      </Tab>
    </Tabs>
    <div class="flex-grow h-0"> <!-- h-0 forces proper flex-grow -->
      <ExtensionSlot :extension="bottomPanelStore.activeBottomPanelTab" />
    </div>
  </div>
</template>
```

### Extension Slot Pattern

The `ExtensionSlot` component supports two rendering modes:

```vue
<!-- ExtensionSlot.vue -->
<template>
  <!-- Vue component mode -->
  <component :is="extension.component" v-if="extension.type === 'vue'" />
  
  <!-- Custom rendering mode -->
  <div v-else :ref="mountCustomExtension" />
</template>

<script setup lang="ts">
const mountCustomExtension = (extension: CustomExtension, el: HTMLElement) => {
  extension.render(el)
}

onBeforeUnmount(() => {
  if (props.extension.type === 'custom' && props.extension.destroy) {
    props.extension.destroy()
  }
})
</script>
```

### Extension Types

```typescript
interface BaseBottomPanelExtension {
  id: string
  title: string
}

type VueBottomPanelExtension = BaseBottomPanelExtension & {
  type: 'vue'
  component: Component
}

type CustomBottomPanelExtension = BaseBottomPanelExtension & {
  type: 'custom'
  render: (container: HTMLElement) => void
  destroy?: () => void
}

type BottomPanelExtension = VueBottomPanelExtension | CustomBottomPanelExtension
```

## Multi-Panel Extension Pattern

### API Evolution (Backwards Compatible)

```typescript
// Extended interface - existing extensions continue working
interface BottomPanelExtension {
  id: string
  title: string
  targetPanel?: 'terminal' | 'shortcuts'  // NEW - defaults to 'terminal'
  type: 'vue' | 'custom'
  // ... existing fields
}
```

### Store Architecture for Multiple Panels

```typescript
export const useBottomPanelStore = defineStore('bottomPanel', () => {
  // Panel definitions
  const panels = ref<Record<string, Panel>>({
    terminal: { id: 'terminal', tabs: [], activeTabId: '' },
    shortcuts: { id: 'shortcuts', tabs: [], activeTabId: '' }
  })
  
  const activePanelId = ref<string>('terminal')
  const panelVisible = ref(false)
  
  // Backwards compatible registration
  const registerBottomPanelTab = (tab: BottomPanelExtension) => {
    const targetPanel = tab.targetPanel || 'terminal'  // Default preserves compatibility
    panels.value[targetPanel].tabs.push(tab)
    
    // Still register per-tab toggle command
    useCommandStore().registerCommand({
      id: `Workspace.ToggleBottomPanelTab.${tab.id}`,
      function: () => toggleBottomPanelTab(tab.id)
    })
  }
  
  // New panel-level commands
  const togglePanel = (panelId: string) => {
    if (activePanelId.value === panelId && panelVisible.value) {
      panelVisible.value = false
    } else {
      activePanelId.value = panelId
      panelVisible.value = true
    }
  }
})
```

## Registration Lifecycle

### Core Registration
```typescript
// GraphView.vue initialization
const init = () => {
  useBottomPanelStore().registerCoreBottomPanelTabs()
}

// Core tabs registration
const registerCoreBottomPanelTabs = () => {
  registerBottomPanelTab(useLogsTerminalTab())
  if (isElectron()) {
    registerBottomPanelTab(useCommandTerminalTab())
  }
}
```

### Extension Registration
```typescript
// extensionService.ts
const registerExtension = (extension: ComfyExtension) => {
  useBottomPanelStore().registerExtensionBottomPanelTabs(extension)
}

// Extension definition
app.registerExtension({
  name: 'MyExtension',
  bottomPanelTabs: [
    {
      id: 'my.tab',
      title: 'My Tab',
      targetPanel: 'shortcuts',  // NEW - targets specific panel
      type: 'vue',
      component: MyComponent
    }
  ]
})
```

## Built-in Tabs

### Logs Terminal
- Real-time WebSocket log streaming
- XTerm.js integration with auto-sizing
- Backend compatibility checks
- Minimum 80 columns for Colab compatibility

### Command Terminal (Electron Only)
- Bidirectional native terminal communication
- State persistence across mount/unmount
- Dynamic resizing based on panel visibility

## Key Architectural Decisions

1. **Automatic Command Integration**: Every tab gets a toggle command automatically
2. **Memory Management**: Custom extensions implement optional `destroy()` lifecycle
3. **Performance**: Components use `markRaw()` to prevent unnecessary reactivity
4. **Lazy Mounting**: Tabs only render when active
5. **Mutual Exclusion**: Only one panel visible at a time in multi-panel mode

## Migration Path

Existing extensions require no changes - they automatically target the 'terminal' panel. New extensions can opt into specific panels:

```typescript
// Old (still works)
bottomPanelTabs: [{ id: 'logs', title: 'Logs', type: 'vue', component: LogsTerminal }]

// New (panel-aware)
bottomPanelTabs: [{ 
  id: 'shortcuts', 
  title: 'Shortcuts', 
  targetPanel: 'shortcuts',  // Explicitly target shortcuts panel
  type: 'vue', 
  component: ShortcutsView 
}]
```

This architecture provides a robust, extensible foundation while maintaining complete backwards compatibility with existing extensions.