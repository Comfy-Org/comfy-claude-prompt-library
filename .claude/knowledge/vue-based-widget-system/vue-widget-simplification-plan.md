# Vue Widget Simplification Plan

## Overview

With the migration to Vue-based node rendering, the widget system can be dramatically simplified. Since nodes themselves will be Vue components, widgets no longer need to manage their own positioning, visibility, or coordinate transformations. This document outlines what can be removed and what remains.

## What Gets Removed

### 1. **domWidgetStore**
- No longer needed to track widget positions or visibility states
- Parent node components handle all widget layout naturally through Vue's component hierarchy
- Removes ~200 lines of state management code

### 2. **Position Synchronization Logic**
- No more manual position calculations or updates
- No need for `updatePosition()` or coordinate tracking
- Parent node's CSS layout handles widget positioning automatically
- Eliminates the `onDrawForeground` hook for widget updates

### 3. **Coordinate Transformation Calculations**
- No canvas-to-DOM coordinate mapping needed
- TransformPane handles all zoom/pan transforms at a higher level
- Widgets exist naturally within the transformed coordinate space
- Removes complex `canvas.ds.scale` and `canvas.ds.offset` calculations

### 4. **Z-index Management**
- Natural DOM stacking order replaces manual z-index tracking
- Node selection/focus handled by parent components
- CSS `isolation: isolate` creates stacking contexts naturally

### 5. **Visibility Tracking**
- No manual visibility state management
- Vue's conditional rendering (`v-if`/`v-show`) handles visibility
- Viewport culling handled at the node level, not widget level
- Removes `hideOnZoom` complexity and placeholder rendering

### 6. **Complex Clipping Logic**
- No need for `useDomClipping` or intersection calculations
- Standard CSS `overflow` properties handle containment
- Node components manage their own boundaries
- CSS `contain: layout style paint` provides performance isolation

### 7. **Event Handling Complexity**
- No more manual event passthrough logic (wheel events, pointer events)
- Standard Vue event handling replaces custom event chains
- Removes `useChainCallback` patterns for lifecycle management

### 8. **Widget Lifecycle Management**
- No `onAdded`/`onRemoved` chains needed
- Vue component lifecycle (`onMounted`/`onUnmounted`) handles everything
- Automatic cleanup via Vue's reactivity system
- Removes `pruneWidgets()` function and orphan widget cleanup

### 9. **Canvas Drawing Fallbacks**
- No need for `draw()` methods on widgets
- No placeholder rectangles during zoom
- No custom canvas rendering for widget states
- Removes all 2D context drawing code from widgets

## What Remains (Simplified)

### 1. **Basic Widget Interface**

```typescript
interface SimplifiedWidget<T = any> {
  // Core properties
  name: string
  type: string
  value: T
  
  // Value management
  getValue(): T
  setValue(value: T, triggerCallback?: boolean): void
  callback?: (value: T) => void
  
  // LiteGraph compatibility
  serializeValue?(): any
  computeSize?(): { minHeight: number; maxHeight?: number }
  options?: {
    min?: number
    max?: number
    step?: number
    precision?: number
    multiline?: boolean
    values?: string[] | number[]  // For combo widgets
  }
  
  // No longer needed:
  // - id, node, margin, isVisible()
  // - position, size, zIndex
  // - element references
  // - computedHeight, y (positioning)
  // - onRemove, beforeQueued, afterQueued
  // - draw() canvas rendering
  // - mouse/pointer event handlers
  // - disabled state (handled by Vue component)
}
```

### 2. **Widget Components**

Widget components become pure UI components focused solely on:

```vue
<template>
  <div class="widget">
    <label>{{ widget.name }}</label>
    <input 
      v-model="value" 
      :min="widget.options?.min"
      :max="widget.options?.max"
      :step="widget.options?.step"
    />
  </div>
</template>

<script setup lang="ts">
// Using defineModel for cleaner two-way binding (Vue 3.4+)
const value = defineModel<string>({ required: true })

const props = defineProps<{
  widget: SimplifiedWidget<string>
  readonly?: boolean  // From parent node state
}>()

// The parent component handles the actual widget.setValue() and callback
// This component just manages the UI representation
</script>
```

### 3. **Widget Registration**

Simplified registration for backward compatibility:

```typescript
// Still maintain widget type registry
export const ComfyWidgets: Record<string, WidgetConstructor> = {
  INT: (node, name, value) => ({
    name,
    type: 'INT',
    value,
    getValue: () => value,
    setValue: (v) => { value = v },
    callback: node.callback
  }),
  // ... other widget types
}
```

## New Architecture

### Node Component Handles Layout

```vue
<!-- LGraphNode.vue -->
<template>
  <div class="lg-node" :class="nodeClasses">
    <NodeHeader :title="node.title" />
    
    <div class="node-widgets">
      <component 
        v-for="(widget, index) in node.widgets"
        :key="`${node.id}-widget-${index}`"
        :is="getWidgetComponent(widget.type)"
        :widget="widget"
        v-model="widget.value"
        @update:modelValue="handleWidgetUpdate(widget, $event)"
      />
    </div>
    
    <NodeSlots :inputs="node.inputs" :outputs="node.outputs" />
  </div>
</template>

<script setup lang="ts">
import { getWidgetComponent } from '@/widgets/registry'

const props = defineProps<{
  node: LGraphNode
}>()

function handleWidgetUpdate(widget: SimplifiedWidget, value: any) {
  widget.setValue(value)
  widget.callback?.(value)
  // Trigger LiteGraph node update if needed
  props.node.setDirtyCanvas(true, true)
}
</script>
```

### Transform Pane Handles All Positioning

```vue
<!-- TransformPane.vue -->
<template>
  <div 
    class="transform-pane" 
    :style="{ 
      transform: `scale(${zoom}) translate(${panX}px, ${panY}px)` 
    }"
  >
    <LGraphNode
      v-for="node in visibleNodes"
      :key="node.id"
      :node="node"
      :style="{ 
        transform: `translate(${node.pos[0]}px, ${node.pos[1]}px)` 
      }"
    />
  </div>
</template>
```

## Files to Remove

### Core Infrastructure
- `src/scripts/domWidget.ts` - Entire DOM widget system
- `src/stores/domWidgetStore.ts` - Widget state management
- `src/components/graph/DomWidgets.vue` - Widget container
- `src/components/graph/widgets/DomWidget.vue` - Widget wrapper

### Related Code to Clean Up
- Remove `addWidget` export from `domWidget.ts`
- Remove `BaseDOMWidget`, `DOMWidget`, `ComponentWidget` interfaces
- Remove `DOMWidgetOptions` and related types
- Clean up `useChainCallback` usage for widget lifecycle
- Remove widget-specific event handling in composables
- Remove `useAbsolutePosition` and `useDomClipping` composables
- Remove `useElementBounding` usage for widget positioning
- Clean up `LGraphNode.prototype.addDOMWidget` extension

## Migration Strategy

### Phase 1: Simplify Widget Interface
1. Create new simplified widget interfaces
2. Remove position/visibility related code from widgets
3. Update widget components to be pure UI components

### Phase 2: Remove Infrastructure
1. Deprecate `domWidgetStore`
2. Remove `DomWidgets.vue` container component
3. Remove position synchronization composables
4. Remove `ComponentWidgetImpl` class

### Phase 3: Update Widget Creation
1. Simplify widget constructors to return plain objects
2. Remove DOM-specific widget implementations
3. Ensure all widgets work within Vue node components
4. Update widget composables to use simplified pattern

## Benefits

### 1. **Simplified Codebase**
- ~70% less widget-related code
- No complex coordinate math
- No manual DOM manipulation
- Removes entire files: `domWidget.ts`, `domWidgetStore.ts`, `DomWidgets.vue`

### 2. **Better Performance**
- No per-frame position updates in `onDrawForeground`
- Native CSS layout instead of manual positioning
- Reduced memory usage (no position tracking)
- Leverages Vue's optimized reactivity instead of manual updates
- CSS containment and GPU acceleration built-in

### 3. **Improved Developer Experience**
- Widgets are just Vue components
- Standard v-model patterns with `defineModel`
- No special positioning logic needed
- TypeScript inference works naturally
- Vue DevTools integration for debugging

### 4. **Natural Vue Patterns**
- Props down, events up
- Component composition
- Standard Vue lifecycle
- Reactive state management without manual tracking
- Automatic cleanup and memory management

## Compatibility Considerations

### For Extension Developers
- Existing widget constructors continue to work
- Compatibility layer translates old widget format to new
- Simple migration path for custom widgets

### Breaking Changes
- Direct DOM manipulation in widgets will no longer work
- Position-based widget logic needs refactoring
- Custom coordinate calculations become unnecessary

### Migration Examples

#### Before (Current System):
```typescript
// Complex widget with manual DOM management
const widget = new ComponentWidgetImpl({
  node,
  name: inputSpec.name,
  component: MyWidget,
  inputSpec,
  options: {
    getValue: () => widgetValue.value,
    setValue: (value) => {
      widgetValue.value = value
      node.onWidgetChanged?.(inputSpec.name, value)
    },
    getMinHeight: () => calculateHeight(widgetValue.value),
    hideOnZoom: true,
    margin: 10
  }
})
addWidget(node, widget)
```

#### After (Simplified):
```typescript
// Simple widget object
const widget = {
  name: inputSpec.name,
  type: 'MY_WIDGET',
  value: inputSpec.default,
  getValue: () => widget.value,
  setValue: (v) => { widget.value = v },
  callback: (v) => node.onWidgetChanged?.(inputSpec.name, v),
  options: inputSpec.options
}
node.widgets.push(widget)
```

## Technical Details

### Reactivity System Changes
- **Before**: Manual value tracking with callbacks and DOM updates
- **After**: Vue's reactivity automatically handles updates via `defineModel`
- Widget values become reactive refs that trigger re-renders automatically
- No need for proxy objects to intercept value access (like in combo widget)
- Widget options can be static since Vue handles reactivity

### Event Handling Simplification
- **Before**: Complex event passthrough logic for canvas interaction
- **After**: Standard Vue event modifiers and propagation
- No need for special handling of wheel, pointer, or keyboard events

### Memory Management Improvements
- **Before**: Manual cleanup in `onRemove()`, memory leaks from event listeners
- **After**: Vue automatically cleans up components and their listeners
- No need for `markRaw` or `toRaw` optimizations on widget instances
- Eliminates widget state Map that could grow unbounded
- No more manual reference clearing in cleanup code

### Type Safety Enhancements
- Full TypeScript support through Vue's prop system
- Better inference for widget values and options
- Component props provide compile-time safety

### Widget-Node Communication
- **Before**: Complex callback chains through multiple layers
- **After**: Direct parent-child component communication
- Widget updates flow naturally through Vue's prop/emit pattern
- Node component acts as the mediator between widget and LiteGraph

## Summary

The migration to Vue-based nodes allows us to remove most of the complex widget positioning and state management code. Widgets become simple Vue components that only handle their core responsibility: displaying values and handling user input. All layout and positioning is handled naturally through Vue's component hierarchy and CSS, resulting in a much cleaner and more maintainable system.

Key improvements:
- **90% reduction** in widget infrastructure code
- **Zero manual DOM manipulation** needed
- **Native performance** through CSS transforms
- **Standard Vue patterns** throughout
- **Automatic memory management** via Vue lifecycle