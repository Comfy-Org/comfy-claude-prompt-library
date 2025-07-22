# Extension Backward Compatibility Patterns

This document captures proven patterns for implementing version-aware extensions while maintaining zero breaking changes in the ComfyUI frontend.

## Core Principle: Optional Metadata Approach

The key insight is that compatibility information should be **optional** and **additive**, never blocking or filtering existing functionality.

### Extension Metadata Pattern

Add optional metadata to extensions without changing the interface:

```typescript
// src/types/comfy.ts - Extended interface
export interface ComfyExtension {
  name: string
  
  // NEW: Optional metadata - no breaking changes
  metadata?: {
    version?: string
    supported_frontend_version?: string
    supported_backend_version?: string
    author?: string
    description?: string
    repository?: string
  }
  
  // All existing hooks remain unchanged
  beforeRegisterNodeDef?(nodeType: typeof LGraphNode, nodeData: ComfyNodeDef, app: ComfyApp): void
}
```

### Version-Aware Extension Implementation

Extensions can check node versions and adapt behavior without breaking existing functionality:

```typescript
app.registerExtension({
  name: "Modern.VersionAwareExtension",
  
  // Optional metadata for debugging/tracking
  metadata: {
    version: "2.0.0",
    supported_frontend_version: "2.5.0",
    author: "ModernDev",
    description: "Demonstrates version-aware patterns"
  },
  
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    // Check node API version and adapt behavior
    const apiVersion = VersionUtils.getNodeAPIVersion(nodeData)
    
    // Can also check backend version for feature detection
    const backendVersion = VersionUtils.getBackendVersion()
    if (backendVersion && VersionUtils.compareVersions(backendVersion, '0.3.0') >= 0) {
      // Enable features available in backend v0.3.0+
    }
    
    if (VersionUtils.compareVersions(apiVersion, '3.0') >= 0) {
      this.handleV3Node(nodeType, nodeData)
    } else if (VersionUtils.compareVersions(apiVersion, '2.0') >= 0) {
      this.handleV2Node(nodeType, nodeData)
    } else {
      this.handleV1Node(nodeType, nodeData)  // Current format
    }
  },
  
  handleV1Node(nodeType: typeof LGraphNode, nodeData: ComfyNodeDef) {
    // Current format handling - works with existing nodes
    if (nodeData.input?.required) {
      // Safe V1 modifications
    }
  },
  
  handleV2Node(nodeType: typeof LGraphNode, nodeData: ComfyNodeDef) {
    // Future V2 format handling
    console.log(`V2 node detected: ${nodeData.name}`)
  },
  
  handleV3Node(nodeType: typeof LGraphNode, nodeData: ComfyNodeDef) {
    // Future V3 format handling
    console.log(`V3 node detected: ${nodeData.name}`)
  }
})
```

## Node-Level Versioning Pattern

Instead of filtering extensions, attach version information to individual nodes:

### Schema Extension

```typescript
// src/schemas/nodeDefSchema.ts - Added to zComfyNodeDef
export const zComfyNodeDef = z.object({
  // ... existing fields
  
  // Version compatibility fields
  api_version: z.string().optional(),        // "1.0", "2.0", "3.0"
  frontend_version: z.string().optional(),   // Minimum frontend version required
  backend_version: z.string().optional()     // Backend version this node comes from
})
```

### Version Detection Utilities

```typescript
// src/utils/versionUtils.ts - Utility functions
export class VersionUtils {
  static getNodeAPIVersion(nodeData: ComfyNodeDef): string {
    return nodeData.api_version || '1.0'  // Default to V1
  }
  
  static isNodeV3Compatible(nodeData: ComfyNodeDef): boolean {
    const apiVersion = this.getNodeAPIVersion(nodeData)
    return this.compareVersions(apiVersion, '3.0') >= 0
  }
  
  // Access backend version from systemStatsStore
  static getBackendVersion(): string | undefined {
    const systemStatsStore = useSystemStatsStore()
    return systemStatsStore.systemStats?.system?.comfyui_version
  }
  
  static getNodeCompatibilityInfo(nodeData: ComfyNodeDef) {
    const apiVersion = this.getNodeAPIVersion(nodeData)
    const frontendVersion = this.getFrontendVersion()
    const requiredFrontendVersion = nodeData.frontend_version

    let status: 'compatible' | 'warning' | 'error' = 'compatible'
    let message = 'Compatible'

    if (requiredFrontendVersion) {
      const isCompatible = this.isVersionCompatible(
        frontendVersion,
        requiredFrontendVersion
      )
      
      if (!isCompatible) {
        status = 'error'
        message = `Requires frontend v${requiredFrontendVersion}, current: v${frontendVersion}`
      }
    }

    return {
      status,
      message,
      apiVersion,
      frontendVersion,
      requiredFrontendVersion,
      isV2Compatible: this.isNodeV2Compatible(nodeData),
      isV3Compatible: this.isNodeV3Compatible(nodeData)
    }
  }
}
```

## Extension Adaptation Patterns

### Graceful Degradation Pattern

```typescript
app.registerExtension({
  name: "Adaptive.Extension",
  
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    // Try modern approach first, fall back gracefully
    if (VersionUtils.isNodeV3Compatible(nodeData)) {
      try {
        this.enhanceWithV3Features(nodeType, nodeData)
      } catch (error) {
        console.warn(`V3 enhancement failed for ${nodeData.name}, falling back`)
        this.enhanceWithV1Features(nodeType, nodeData)
      }
    } else {
      // Always works - current format
      this.enhanceWithV1Features(nodeType, nodeData)
    }
  }
})
```

### Selective Enhancement Pattern

```typescript
app.registerExtension({
  name: "Selective.V3Extension",
  
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    // Only enhance nodes that support our requirements
    if (!VersionUtils.isNodeV3Compatible(nodeData)) {
      console.log(`Skipping incompatible node ${nodeData.name}`)
      return  // Skip enhancement, but don't break
    }
    
    // Safe to use V3 features
    this.addV3Enhancements(nodeType, nodeData)
  }
})
```

### Progressive Enhancement Pattern

```typescript
app.registerExtension({
  name: "Progressive.Enhancement",
  
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    // Always add basic functionality
    this.addBasicEnhancements(nodeType, nodeData)
    
    // Add additional features based on capabilities
    if (VersionUtils.isNodeV2Compatible(nodeData)) {
      this.addV2Enhancements(nodeType, nodeData)
    }
    
    if (VersionUtils.isNodeV3Compatible(nodeData)) {
      this.addV3Enhancements(nodeType, nodeData)
    }
    
    // Add experimental features if available
    if (nodeData.experimental && this.hasExperimentalSupport()) {
      this.addExperimentalEnhancements(nodeType, nodeData)
    }
  }
})
```

## Developer Tools Integration

### Extension Service Enhancement

```typescript
// src/services/extensionService.ts - Non-breaking addition
export const useExtensionService = () => {
  // ... existing methods unchanged
  
  // NEW: Compatibility reporting
  const getExtensionCompatibilityReport = () => {
    const extensions = extensionStore.extensions
    const frontendVersion = VersionUtils.getFrontendVersion()
    
    return {
      frontendVersion,
      total: extensions.length,
      compatible: extensions.filter(ext => 
        !ext.metadata?.supported_frontend_version || 
        VersionUtils.isVersionCompatible(frontendVersion, ext.metadata.supported_frontend_version)
      ).length,
      details: extensions.map(ext => ({
        name: ext.name,
        metadata: ext.metadata,
        isCompatible: !ext.metadata?.supported_frontend_version || 
          VersionUtils.isVersionCompatible(frontendVersion, ext.metadata.supported_frontend_version)
      }))
    }
  }
  
  return {
    loadExtensions,
    registerExtension,
    invokeExtensions,
    invokeExtensionsAsync,
    getExtensionCompatibilityReport  // NEW
  }
}
```

### Global Debugging Tools

```typescript
// src/utils/extensionDebugger.ts - Developer console integration
export class ExtensionDebugger {
  static logCompatibilityReport() {
    const report = useExtensionService().getExtensionCompatibilityReport()
    
    console.group('🔌 Extension Compatibility Report')
    console.log(`Frontend Version: ${report.frontendVersion}`)
    console.log(`Compatible Extensions: ${report.compatible}/${report.total}`)
    
    report.details.forEach(ext => {
      const status = ext.isCompatible ? '✅' : '⚠️'
      console.log(`${status} ${ext.name}`, ext.metadata || 'No metadata')
    })
    console.groupEnd()
  }
}

// Global access for developers
if (typeof window !== 'undefined') {
  (window as any).ComfyUI = {
    ...(window as any).ComfyUI,
    debugExtensions: ExtensionDebugger,
    versionUtils: VersionUtils
  }
}
```

## Using systemStatsStore for Feature Detection

The systemStatsStore provides runtime information about the backend, enabling feature detection and API versioning:

```typescript
// Example: API endpoint versioning based on backend version
import { useSystemStatsStore } from '@/stores/systemStatsStore'

export function useHistoryAPI() {
  const systemStatsStore = useSystemStatsStore()
  
  async function getHistory(max_items: number = 200) {
    const backendVersion = systemStatsStore.systemStats?.system?.comfyui_version
    
    // Use version detection to choose appropriate endpoint
    if (backendVersion && VersionUtils.compareVersions(backendVersion, '0.3.0') >= 0) {
      // Use new history_v2 endpoint for newer backends
      const res = await api.fetchApi(`/history_v2?max_items=${max_items}`)
      const json = await res.json()
      // Handle new array format
      return processV2History(json)
    } else {
      // Fall back to legacy endpoint for older backends
      const res = await api.fetchApi(`/history?max_items=${max_items}`)
      const json = await res.json()
      // Handle legacy dict format
      return processV1History(json)
    }
  }
  
  return { getHistory }
}
```

### systemStatsStore Schema

The systemStatsStore contains comprehensive backend information:

```typescript
// Available in systemStatsStore.systemStats?.system
interface SystemInfo {
  os: string                    // Operating system
  python_version: string        // Python version
  embedded_python: boolean      // Using embedded Python
  comfyui_version: string      // Backend version for feature detection
  pytorch_version: string       // PyTorch version
  argv: string[]               // Command line arguments
  ram_total: number            // Total RAM
  ram_free: number             // Available RAM
}
```

## Migration Strategy

### Legacy Extension (No Changes)
```typescript
// Existing extensions work unchanged
app.registerExtension({
  name: "LegacyExtension",
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    // Works exactly as before - no metadata = compatible
  }
})
```

### Metadata-Only Migration
```typescript
// Step 1: Add metadata for tracking
app.registerExtension({
  name: "TrackedExtension",
  metadata: {
    version: "1.0.0",
    author: "Developer"
  },
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    // Same functionality, now tracked
  }
})
```

### Version-Aware Migration
```typescript
// Step 2: Add version awareness
app.registerExtension({
  name: "ModernExtension",
  metadata: {
    version: "2.0.0",
    supported_frontend_version: "2.0.0"
  },
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    const apiVersion = VersionUtils.getNodeAPIVersion(nodeData)
    // Adapt behavior based on node version
  }
})
```

## Real-World Example: Subgraph Title Synchronization

A practical example of maintaining compatibility while fixing reactivity issues:

### The Problem
- Subgraph node titles stored in two places: `node.title` and `subgraph.name`
- TitleEditor only updates `node.title`, causing breadcrumb desync
- Extensions may depend on either property

### The Compatible Solution

```typescript
// src/composables/subgraphTitleSync.ts
export const useSubgraphTitleSync = () => {
  const workflowStore = useWorkflowStore()

  const syncSubgraphTitle = (subgraphNode: LGraphNode, newTitle: string) => {
    // Maintain compatibility: check if node is subgraph
    if (!subgraphNode.isSubgraphNode?.()) {
      return
    }
    
    // Update both locations to maintain compatibility
    // 1. Runtime: For UI components (breadcrumbs)
    subgraphNode.subgraph.name = newTitle
    
    // 2. Persistence: For save/load and extensions
    const activeWorkflow = workflowStore.activeWorkflow
    if (activeWorkflow?.activeState?.definitions?.subgraphs) {
      const exportedSubgraph = activeWorkflow.activeState.definitions.subgraphs.find(
        (s: any) => s.id === subgraphNode.subgraph.id
      )
      if (exportedSubgraph) {
        exportedSubgraph.name = newTitle
      }
    }
  }

  return { syncSubgraphTitle }
}
```

### Integration Without Breaking Changes

```typescript
// src/components/graph/TitleEditor.vue
const onEdit = (newValue: string) => {
  if (titleEditorStore.titleEditorTarget && newValue.trim() !== '') {
    const trimmedTitle = newValue.trim()
    
    // Always update node.title for compatibility
    titleEditorStore.titleEditorTarget.title = trimmedTitle
    
    // Additional sync for subgraphs - extensions reading node.title still work
    const target = titleEditorStore.titleEditorTarget
    if (target instanceof LGraphNode && target.isSubgraphNode?.()) {
      syncSubgraphTitle(target, trimmedTitle)
    }
    
    app.graph.setDirtyCanvas(true, true)
  }
}
```

### Extension Compatibility Maintained

```typescript
// Existing extension - continues to work
app.registerExtension({
  name: "NodeTitleReader",
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    // Still reads node.title - not broken by our change
    const originalOnAdded = nodeType.prototype.onAdded
    nodeType.prototype.onAdded = function() {
      originalOnAdded?.apply(this, arguments)
      console.log(`Node added with title: ${this.title}`)
    }
  }
})

// Modern extension - can access both properties
app.registerExtension({
  name: "SubgraphAwareExtension",
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    const originalOnPropertyChanged = nodeType.prototype.onPropertyChanged
    nodeType.prototype.onPropertyChanged = function(property, value) {
      originalOnPropertyChanged?.apply(this, arguments)
      
      if (property === 'title' && this.isSubgraphNode?.()) {
        // Can rely on synchronization being handled
        console.log(`Subgraph title changed: ${value}`)
        console.log(`Subgraph name: ${this.subgraph?.name}`)
      }
    }
  }
})
```

### Key Compatibility Principles Demonstrated

1. **Preserve Existing APIs**: `node.title` continues to work as before
2. **Add, Don't Replace**: Synchronization is added functionality, not a replacement
3. **Defensive Checks**: Always verify node types before accessing new properties
4. **Graceful Fallbacks**: Code works even if subgraph properties are missing
5. **No Breaking Assumptions**: Extensions reading either property continue to function

## Key Benefits

1. **Zero Breaking Changes**: All existing extensions continue working
2. **Gradual Adoption**: Extensions can opt-in to new patterns incrementally  
3. **Developer Friendly**: Rich debugging tools and compatibility reporting
4. **Future Proof**: Foundation for v3+ node formats without disruption
5. **Practical Implementation**: Works with existing architecture constraints

This approach provides a solid foundation for ComfyUI frontend evolution while respecting the architectural realities of the extension system.

## Bottom Panel Multi-Panel Extension Pattern

### Context
The bottom panel system needs to support multiple panels (terminal/debug panel and shortcuts panel) while maintaining backwards compatibility with existing extensions that register tabs.

### API Evolution Pattern

```typescript
// Original interface - all existing extensions use this
interface BottomPanelExtension {
  id: string
  title: string
  type: 'vue' | 'custom'
  component?: Component
  render?: (container: HTMLElement) => void
  destroy?: () => void
}

// Extended interface - backwards compatible
interface BottomPanelExtension {
  id: string
  title: string
  targetPanel?: 'terminal' | 'shortcuts'  // NEW - optional with default
  type: 'vue' | 'custom'
  component?: Component
  render?: (container: HTMLElement) => void
  destroy?: () => void
}
```

### Registration Routing Pattern

```typescript
// Updated store registration method
const registerBottomPanelTab = (tab: BottomPanelExtension) => {
  // Route to appropriate panel, defaulting to 'terminal' for compatibility
  const targetPanel = tab.targetPanel || 'terminal'
  
  // Existing extensions without targetPanel continue working in terminal panel
  panels.value[targetPanel].tabs.push(tab)
  
  // Command registration remains unchanged
  useCommandStore().registerCommand({
    id: `Workspace.ToggleBottomPanelTab.${tab.id}`,
    function: () => toggleBottomPanelTab(tab.id)
  })
}
```

### Extension Examples

```typescript
// Legacy extension - continues working unchanged
app.registerExtension({
  name: 'LegacyExtension',
  bottomPanelTabs: [{
    id: 'legacy.tab',
    title: 'Legacy Tab',
    type: 'vue',
    component: LegacyComponent
    // No targetPanel - defaults to 'terminal'
  }]
})

// Modern extension - targets specific panel
app.registerExtension({
  name: 'ShortcutsExtension',
  bottomPanelTabs: [{
    id: 'shortcuts.essentials',
    title: 'Essential Shortcuts',
    targetPanel: 'shortcuts',  // Explicitly targets shortcuts panel
    type: 'vue',
    component: EssentialShortcutsView
  }]
})

// Extension with tabs in multiple panels
app.registerExtension({
  name: 'MultiPanelExtension',
  bottomPanelTabs: [
    {
      id: 'debug.performance',
      title: 'Performance',
      targetPanel: 'terminal',  // Debug info in terminal panel
      type: 'vue',
      component: PerformanceMonitor
    },
    {
      id: 'shortcuts.custom',
      title: 'Custom Shortcuts',
      targetPanel: 'shortcuts',  // Shortcuts in shortcuts panel
      type: 'vue',
      component: CustomShortcuts
    }
  ]
})
```

### Key Compatibility Principles

1. **Default Values**: `targetPanel` defaults to 'terminal' preserving existing behavior
2. **No Required Changes**: Extensions work without modification
3. **Opt-in Enhancement**: New functionality requires explicit opt-in
4. **Command Compatibility**: Toggle commands remain consistent
5. **Registration Flow**: Same registration flow, just with routing logic

This pattern demonstrates how to extend core UI systems while maintaining perfect backwards compatibility through optional properties and sensible defaults.