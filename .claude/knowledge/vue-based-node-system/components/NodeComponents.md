# Node Components Documentation

## Overview

The node component system provides modular Vue components for rendering LiteGraph nodes in the DOM. Each component handles a specific aspect of node rendering while maintaining separation of concerns.

## Component Hierarchy

```
LGraphNode.vue (Main container)
├── NodeHeader.vue (Title, controls)
├── NodeSlots.vue (Input/output connections)
│   ├── InputSlot.vue
│   └── OutputSlot.vue
├── NodeWidgets.vue (Widget container)
│   └── Individual widget components
└── NodeContent.vue (Custom content area)
```

## Core Components

### LGraphNode.vue
Main node container that orchestrates all sub-components:

```vue
<template>
  <article
    :class="[
      'lg-node',
      `lg-node--${nodeData.type}`,
      {
        'lg-node--selected': selected,
        'lg-node--executing': executing,
        'lg-node--dragging': isDragging
      }
    ]"
    :style="nodeStyle"
    @pointerdown="handlePointerDown"
    @click="handleClick"
  >
    <NodeHeader 
      :title="nodeData.title"
      :type="nodeData.type"
      :mode="nodeData.mode"
      :selected="selected"
      @collapse="handleCollapse"
    />
    
    <div class="lg-node-body">
      <NodeSlots
        v-if="hasSlots"
        :inputs="nodeData.inputs"
        :outputs="nodeData.outputs"
        @slot-click="handleSlotClick"
      />
      
      <NodeWidgets
        v-if="hasWidgets"
        :widgets="nodeData.widgets"
        :node-id="nodeData.id"
      />
      
      <NodeContent
        v-if="hasCustomContent"
        :node-data="nodeData"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
interface LGraphNodeProps {
  nodeData: VueNodeData
  position?: { x: number; y: number }
  size?: { width: number; height: number }
  selected?: boolean
  executing?: boolean
}

const nodeStyle = computed(() => ({
  transform: `translate(${position?.x || 0}px, ${position?.y || 0}px)`,
  width: size?.width ? `${size.width}px` : undefined,
  height: size?.height ? `${size.height}px` : undefined,
  '--node-width': size?.width || 200,
  '--node-height': size?.height || 100
}))

const handlePointerDown = (event: PointerEvent) => {
  if (event.button === 0) { // Left click only
    emit('node-click', event, nodeData)
  }
}
</script>

<style scoped>
.lg-node {
  @apply absolute bg-background border rounded-lg shadow-md;
  contain: layout style paint;
}

.lg-node--selected {
  @apply ring-2 ring-primary;
}

.lg-node--dragging {
  @apply cursor-move;
  will-change: transform;
}
</style>
```

### NodeHeader.vue
Renders node title and control buttons:

```vue
<template>
  <header class="lg-node-header">
    <div class="lg-node-header-content">
      <h3 class="lg-node-title">{{ title }}</h3>
      <span class="lg-node-type">{{ type }}</span>
    </div>
    
    <div class="lg-node-controls">
      <button 
        v-if="showCollapseButton"
        @click="handleCollapse"
        class="lg-node-control-btn"
      >
        <svg class="w-4 h-4">
          <!-- Collapse icon -->
        </svg>
      </button>
    </div>
    
    <svg 
      v-if="selected"
      class="lg-node-selection-indicator"
      viewBox="0 0 100 10"
    >
      <rect 
        class="lg-node-selection-rect"
        x="0" y="0" 
        width="100" height="10"
        fill="currentColor"
      />
    </svg>
  </header>
</template>

<script setup lang="ts">
interface NodeHeaderProps {
  title: string
  type: string
  mode?: number
  selected?: boolean
}

const emit = defineEmits<{
  collapse: []
}>()

const showCollapseButton = computed(() => 
  props.mode !== 2 // Not in collapsed mode
)
</script>

<style scoped>
.lg-node-header {
  @apply relative flex items-center justify-between p-2;
  @apply bg-muted/50 rounded-t-lg border-b;
}

.lg-node-title {
  @apply text-sm font-medium truncate;
}

.lg-node-type {
  @apply text-xs text-muted-foreground;
}

.lg-node-selection-indicator {
  @apply absolute inset-x-0 -top-2 h-2 text-primary;
}
</style>
```

### NodeSlots.vue
Container for input/output slots:

```vue
<template>
  <div class="lg-node-slots">
    <div class="lg-node-inputs">
      <InputSlot
        v-for="(input, index) in inputs"
        :key="`input-${index}`"
        :slot-data="input"
        :index="index"
        @click="handleInputClick(index, $event)"
      />
    </div>
    
    <div class="lg-node-outputs">
      <OutputSlot
        v-for="(output, index) in outputs"
        :key="`output-${index}`"
        :slot-data="output"
        :index="index"
        @click="handleOutputClick(index, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface NodeSlotsProps {
  inputs?: unknown[]
  outputs?: unknown[]
}

const emit = defineEmits<{
  'slot-click': [
    event: PointerEvent,
    slotIndex: number,
    isInput: boolean
  ]
}>()

const handleInputClick = (index: number, event: PointerEvent) => {
  emit('slot-click', event, index, true)
}

const handleOutputClick = (index: number, event: PointerEvent) => {
  emit('slot-click', event, index, false)
}
</script>

<style scoped>
.lg-node-slots {
  @apply flex justify-between px-2 py-1;
}

.lg-node-inputs,
.lg-node-outputs {
  @apply flex flex-col gap-1;
}
</style>
```

### InputSlot.vue / OutputSlot.vue
Individual slot components:

```vue
<template>
  <div 
    class="lg-slot"
    :class="[
      isInput ? 'lg-slot--input' : 'lg-slot--output',
      { 'lg-slot--connected': isConnected }
    ]"
    @click="handleClick"
  >
    <div class="lg-slot-dot" />
    <span class="lg-slot-label">{{ slotName }}</span>
  </div>
</template>

<script setup lang="ts">
interface SlotProps {
  slotData: unknown
  index: number
  isInput?: boolean
}

const slotName = computed(() => {
  const slot = props.slotData as { name?: string } | null
  return slot?.name || `${props.isInput ? 'Input' : 'Output'} ${props.index}`
})

const isConnected = computed(() => {
  const slot = props.slotData as { link?: unknown } | null
  return !!slot?.link
})
</script>

<style scoped>
.lg-slot {
  @apply flex items-center gap-1 cursor-pointer;
  @apply hover:bg-accent/10 px-1 py-0.5 rounded;
}

.lg-slot--input {
  @apply flex-row;
}

.lg-slot--output {
  @apply flex-row-reverse;
}

.lg-slot-dot {
  @apply w-3 h-3 rounded-full bg-muted-foreground;
  @apply transition-colors;
}

.lg-slot--connected .lg-slot-dot {
  @apply bg-primary;
}

.lg-slot-label {
  @apply text-xs text-muted-foreground;
}
</style>
```

### NodeContent.vue
Placeholder for custom node content:

```vue
<template>
  <div class="lg-node-content">
    <!-- Custom content based on node type -->
    <component
      v-if="customComponent"
      :is="customComponent"
      :node-data="nodeData"
    />
    
    <!-- Default content -->
    <div v-else class="lg-node-content-default">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface NodeContentProps {
  nodeData: VueNodeData
}

// Map node types to custom components
const customComponents: Record<string, Component> = {
  'image/preview': ImagePreviewNode,
  'text/display': TextDisplayNode,
  // Add more custom node types
}

const customComponent = computed(() => 
  customComponents[props.nodeData.type]
)
</script>
```

## Data Interfaces

### VueNodeData
The core data structure passed to node components:

```typescript
export interface VueNodeData {
  id: string
  title: string
  type: string
  mode: number
  selected: boolean
  executing: boolean
  widgets?: SafeWidgetData[]
  inputs?: unknown[]
  outputs?: unknown[]
}
```

### Position and Size
Node positioning handled via props:

```typescript
interface NodePosition {
  x: number
  y: number
}

interface NodeSize {
  width: number
  height: number
}
```

## Event System

### Node Events
```typescript
// Main node container events
emit<{
  'node-click': [event: PointerEvent, nodeData: VueNodeData]
  'node-drag-start': [event: PointerEvent, nodeData: VueNodeData]
  'node-drag': [event: PointerEvent, nodeData: VueNodeData]
  'node-drag-end': [event: PointerEvent, nodeData: VueNodeData]
}>()

// Slot events
emit<{
  'slot-click': [
    event: PointerEvent,
    nodeData: VueNodeData,
    slotIndex: number,
    isInput: boolean
  ]
  'slot-hover': [slotIndex: number, isInput: boolean]
}>()

// Header events  
emit<{
  collapse: []
  pin: []
  settings: []
}>()
```

## Styling System

### CSS Variables
Nodes expose CSS variables for theming:

```css
.lg-node {
  --node-bg: theme('colors.background');
  --node-border: theme('colors.border');
  --node-shadow: theme('boxShadow.md');
  --node-radius: theme('borderRadius.lg');
  --node-header-bg: theme('colors.muted.DEFAULT/50');
}
```

### Node Type Styling
Apply custom styles per node type:

```css
.lg-node--math { --node-border: theme('colors.blue.500'); }
.lg-node--image { --node-border: theme('colors.green.500'); }
.lg-node--text { --node-border: theme('colors.purple.500'); }
```

### State Classes
Visual states applied via classes:

```css
.lg-node--selected { @apply ring-2 ring-primary; }
.lg-node--executing { @apply animate-pulse; }
.lg-node--error { @apply ring-2 ring-destructive; }
.lg-node--disabled { @apply opacity-50; }
```

## Performance Optimizations

### CSS Containment
All nodes use CSS containment:

```css
.lg-node {
  contain: layout style paint;
}
```

### Conditional Rendering
Only render necessary sections:

```vue
<NodeWidgets v-if="hasWidgets" />
<NodeSlots v-if="hasSlots" />
<NodeContent v-if="hasCustomContent" />
```

### Event Delegation
Use single event listener on container:

```typescript
// In TransformPane
const handleNodeEvent = (event: PointerEvent) => {
  const nodeEl = (event.target as Element).closest('.lg-node')
  if (nodeEl) {
    const nodeId = nodeEl.getAttribute('data-node-id')
    // Handle event for specific node
  }
}
```

## Accessibility

### ARIA Attributes
```vue
<article
  role="article"
  :aria-label="`Node: ${nodeData.title}`"
  :aria-selected="selected"
  :aria-busy="executing"
>
```

### Keyboard Navigation
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      selectNode()
      break
    case 'Delete':
      deleteNode()
      break
  }
}
```

## Extension Points

### Custom Node Types
Register custom node components:

```typescript
// In node type registry
export const nodeTypeComponents: Record<string, Component> = {
  'custom/mynode': MyCustomNode,
  'special/preview': SpecialPreviewNode
}

// Usage in LGraphNode.vue
const NodeComponent = nodeTypeComponents[nodeData.type] || DefaultNode
```

### Slot Customization
Override slot rendering:

```vue
<template #input-slot="{ slot, index }">
  <CustomInputSlot :data="slot" :index="index" />
</template>
```

### Widget Integration
Nodes automatically render registered widgets via NodeWidgets component.

## Best Practices

1. **Keep components focused** - Each component has single responsibility
2. **Use props for data** - Never access LiteGraph directly
3. **Emit events upward** - Let parent components handle state changes
4. **Optimize rendering** - Use v-if for conditional sections
5. **Type everything** - Full TypeScript coverage