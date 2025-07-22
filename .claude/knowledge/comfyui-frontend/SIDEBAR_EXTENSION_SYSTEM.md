# ComfyUI Sidebar Extension System

## Overview

The ComfyUI sidebar system provides a flexible API for extensions to add custom tabs to the sidebar. It supports both Vue components and custom DOM-based extensions through a unified interface.

## Architecture

### Core Components

1. **SideToolbar.vue** - Main sidebar container that manages tab switching
   ```vue
   <div v-if="selectedTab" class="sidebar-content-container">
     <ExtensionSlot :extension="selectedTab" />
   </div>
   ```

2. **ExtensionSlot.vue** - Renders either Vue components or custom extensions
   ```vue
   <template>
     <component v-if="extension.type === 'vue'" :is="extension.component" />
     <div v-else :ref="(el) => { if (el) mountCustomExtension(props.extension, el) }"></div>
   </template>
   ```

3. **sidebarTabStore.ts** - Pinia store managing sidebar state
   - `activeSidebarTabId` - Currently active tab ID (or null)
   - `toggleSidebarTab(tabId)` - Toggle tab visibility
   - `registerSidebarTab(tab)` - Register new sidebar tab

## Extension API

### Registering a Sidebar Tab

```javascript
// JavaScript/TypeScript Extension
app.extensionManager.registerSidebarTab({
  id: 'my-extension',
  icon: 'pi pi-code',        // PrimeVue icon class
  title: 'My Extension',      // Display title
  tooltip: 'Extension tooltip',
  type: 'custom',            // 'custom' or 'vue'
  render: (element) => {     // For custom type
    // Render your content into the provided element
    element.innerHTML = '<div>My content</div>'
  },
  destroy: () => {           // Optional cleanup
    // Clean up resources when tab is unmounted
  }
})
```

### Vue Component Extensions

```typescript
// For Vue extensions
const sidebarTab: SidebarTabExtension = {
  id: 'my-vue-tab',
  icon: 'pi pi-vue',
  title: 'Vue Tab',
  tooltip: 'Vue Component Tab',
  type: 'vue',
  component: markRaw(MyVueComponent)  // Vue component
}
```

## Lifecycle Management

### Extension Lifecycle

1. **Registration**: Extension registers with `registerSidebarTab()`
2. **First Render**: When user clicks tab, `render()` is called with container element
3. **Tab Switching**: When switching away, `destroy()` is called for cleanup
4. **Re-activation**: `render()` called again with fresh container

### Known Issue: Missing `:key` Attribute

Currently, `SideToolbar.vue` doesn't use a `:key` attribute on `ExtensionSlot`, causing Vue to update props instead of unmounting/remounting when switching tabs. This means:

- `onBeforeUnmount` in `ExtensionSlot` doesn't fire
- Custom extension `destroy()` methods aren't called properly
- Extensions may remain visible when they should be hidden

**Fix**: Add `:key="selectedTab.id"` to force proper lifecycle:
```vue
<ExtensionSlot :key="selectedTab.id" :extension="selectedTab" />
```

## Best Practices

### For Custom Extensions

1. **Always implement `destroy()`**: Clean up event listeners, timers, and DOM elements
2. **Store references for cleanup**: Keep track of anything that needs cleanup
3. **Handle re-renders**: `render()` may be called multiple times

```javascript
let cleanup = []

const sidebarTab = {
  id: 'best-practice-example',
  type: 'custom',
  render: (element) => {
    // Create content
    const content = document.createElement('div')
    element.appendChild(content)
    
    // Add event listener with cleanup
    const handler = () => console.log('clicked')
    content.addEventListener('click', handler)
    cleanup.push(() => content.removeEventListener('click', handler))
    
    // Timer with cleanup
    const timer = setInterval(() => {}, 1000)
    cleanup.push(() => clearInterval(timer))
  },
  destroy: () => {
    // Run all cleanup functions
    cleanup.forEach(fn => fn())
    cleanup = []
  }
}
```

### For React Extensions

```javascript
let reactRoot = null

const sidebarTab = {
  id: 'react-extension',
  type: 'custom',
  render: (element) => {
    const container = document.createElement('div')
    element.appendChild(container)
    
    reactRoot = ReactDOM.createRoot(container)
    reactRoot.render(<App />)
  },
  destroy: () => {
    if (reactRoot) {
      reactRoot.unmount()
      reactRoot = null
    }
  }
}
```

## State Access

Extensions can access sidebar state through:

```javascript
// Get current active tab
const activeTab = app.extensionManager.sidebarTab.activeSidebarTabId

// Toggle a tab programmatically
app.extensionManager.sidebarTab.toggleSidebarTab('my-tab-id')

// Check if sidebar is visible
const sidebarVisible = app.extensionManager.sidebarTab.activeSidebarTab !== null
```

## Common Patterns

### Persistent State Across Tab Switches

Since extensions are destroyed when switching tabs, use external state:

```javascript
// Global state outside the extension
const extensionState = {
  data: [],
  settings: {}
}

const sidebarTab = {
  render: (element) => {
    // Restore state on render
    renderWithState(element, extensionState)
  },
  destroy: () => {
    // State persists automatically
  }
}
```

### Responsive to Theme Changes

```javascript
render: (element) => {
  // Listen to theme changes
  const updateTheme = () => {
    const isDark = document.body.classList.contains('dark-theme')
    element.style.background = isDark ? '#1e1e1e' : '#ffffff'
  }
  
  updateTheme()
  const observer = new MutationObserver(updateTheme)
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  
  // Store for cleanup
  element._observer = observer
},
destroy: () => {
  element._observer?.disconnect()
}
```

## Integration with ComfyUI Systems

Sidebar extensions can interact with:

- **Graph API**: Access nodes, connections via `app.graph`
- **Canvas API**: Interact with canvas via `app.canvas`
- **Settings**: Read/write settings via `app.ui.settings`
- **Toasts**: Show notifications via `app.ui.toast`
- **Commands**: Register commands via `app.registerExtension`

## Future Considerations

1. **Secondary Sidebars**: Proposal for multiple sidebar regions (Issue #3635)
2. **Tab Persistence**: Saving active tab state across sessions
3. **Tab Ordering**: User-customizable tab order
4. **Keyboard Navigation**: Shortcuts for tab switching (Issue #3935)