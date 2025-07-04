# Widget Components Documentation

## Overview

The widget system provides Vue components for rendering LiteGraph widgets with proper data binding and type safety. Each widget type maps to a specific Vue component that handles rendering and user interaction.

## Widget Registry

### Type Mapping
The system maps LiteGraph widget types to Vue components:

```typescript
// useWidgetRenderer.ts
const typeToEnum: Record<string, string> = {
  // Number inputs
  'number': WidgetType.NUMBER,
  'slider': WidgetType.SLIDER,
  'INT': WidgetType.INT,
  'FLOAT': WidgetType.FLOAT,
  
  // Text inputs  
  'text': WidgetType.STRING,
  'string': WidgetType.STRING,
  'STRING': WidgetType.STRING,
  
  // Selection
  'combo': WidgetType.COMBO,
  'COMBO': WidgetType.COMBO,
  
  // Boolean
  'toggle': WidgetType.TOGGLESWITCH,
  'boolean': WidgetType.BOOLEAN,
  'BOOLEAN': WidgetType.BOOLEAN,
  
  // Special
  'button': WidgetType.BUTTON,
  'BUTTON': WidgetType.BUTTON,
  'image': WidgetType.IMAGE,
  'color': WidgetType.COLOR,
  
  // Text-based widgets mapped to appropriate components
  'MARKDOWN': WidgetType.TEXTAREA,  // Markdown uses textarea for multiline
  'customtext': WidgetType.TEXTAREA  // Custom text uses textarea for multiline
}
```

### Component Registry
```typescript
export const widgetTypeToComponent: Record<string, Component> = {
  [WidgetType.INT]: WidgetSlider,
  [WidgetType.FLOAT]: WidgetSlider,
  [WidgetType.NUMBER]: WidgetSlider,
  [WidgetType.SLIDER]: WidgetSlider,
  [WidgetType.STRING]: WidgetInputText,
  [WidgetType.COMBO]: WidgetSelect,
  [WidgetType.TOGGLESWITCH]: WidgetToggleSwitch,
  [WidgetType.BOOLEAN]: WidgetToggleSwitch,
  [WidgetType.BUTTON]: WidgetButton,
  [WidgetType.IMAGE]: WidgetImage,
  [WidgetType.COLOR]: WidgetColorPicker
}
```

## Core Components

### NodeWidgets.vue
Container component that renders all widgets for a node:

```vue
<template>
  <div class="lg-node-widgets flex flex-col gap-2">
    <component
      v-for="(widget, index) in supportedWidgets"
      :key="`${widget.name}-${index}`"
      :is="getVueComponent(widget)"
      :widget="widget"
      :node-id="nodeId"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
const supportedWidgets = computed(() => {
  return props.widgets?.filter(w => shouldRenderAsVue(w)) || []
})

const getVueComponent = (widget: SafeWidgetData) => {
  const componentName = getWidgetComponent(widget.type)
  const component = widgetTypeToComponent[componentName]
  return component || WidgetInputText // Fallback
}
</script>
```

### Widget Data Interface
All widgets receive data through the SafeWidgetData interface:

```typescript
export interface SafeWidgetData {
  name: string
  type: string
  value: unknown
  options?: Record<string, unknown>
  callback?: ((value: unknown) => void) | undefined
}
```

## Individual Widget Components

### WidgetSelect (Combo)
Handles dropdown selection widgets:

```vue
<template>
  <div class="widget-wrapper">
    <label v-if="widget.name">{{ widget.name }}</label>
    <Select 
      v-model="localValue" 
      :options="selectOptions"
      :disabled="readonly"
      @update:model-value="onChange"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  widget: SimplifiedWidget<any>
  modelValue: any
  readonly?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

// Local value for immediate UI updates
const localValue = ref(props.modelValue)

const selectOptions = computed(() => {
  const options = props.widget.options
  // LiteGraph stores combo options in 'values' array
  if (options?.values && Array.isArray(options.values)) {
    return options.values
  }
  return []
})

const onChange = (newValue: any) => {
  localValue.value = newValue
  emit('update:modelValue', newValue)
  
  // Call LiteGraph callback to update the authoritative state
  if (props.widget.callback) {
    props.widget.callback(newValue)
  }
}

// Watch for external updates from LiteGraph
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})
</script>
```

### WidgetSlider (Number/Float/Int)
Numeric input with optional slider:

```vue
<template>
  <div class="widget-wrapper">
    <label v-if="widget.name">{{ widget.name }}</label>
    <Slider 
      v-model="localValue" 
      v-bind="filteredProps" 
      :disabled="readonly"
      @update:model-value="onChange" 
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  widget: SimplifiedWidget<number>
  modelValue: number
  readonly?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Local value for immediate UI updates
const localValue = ref(props.modelValue || 0)

const onChange = (newValue: number) => {
  localValue.value = newValue
  emit('update:modelValue', newValue)
  
  // Call LiteGraph callback to update the authoritative state
  if (props.widget.callback) {
    props.widget.callback(newValue)
  }
}

// Watch for external updates from LiteGraph
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || 0
})

// Extract min/max/step from widget options
const min = computed(() => 
  Number(props.widget.options?.min) || 0
)
const max = computed(() => 
  Number(props.widget.options?.max) || 100
)
const step = computed(() => 
  Number(props.widget.options?.step) || 1
)
</script>
```

### WidgetInputText (String)
Text input for string values:

```vue
<template>
  <div class="widget-wrapper">
    <label v-if="widget.name">{{ widget.name }}</label>
    <InputText
      v-model="localValue"
      v-bind="filteredProps"
      :disabled="readonly"
      @update:model-value="onChange"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  widget: SimplifiedWidget<string>
  modelValue: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Local value for immediate UI updates
const localValue = ref(props.modelValue || '')

const onChange = (newValue: string) => {
  localValue.value = newValue
  emit('update:modelValue', newValue)
  
  // Call LiteGraph callback to update the authoritative state
  if (props.widget.callback) {
    props.widget.callback(newValue)
  }
}

// Watch for external updates from LiteGraph
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || ''
})
</script>
```

### WidgetToggleSwitch (Boolean)
Boolean toggle switch:

```vue
<template>
  <div class="widget-wrapper">
    <label v-if="widget.name">{{ widget.name }}</label>
    <ToggleSwitch
      v-model="localValue"
      v-bind="filteredProps"
      :disabled="readonly"
      @update:model-value="onChange"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  widget: SimplifiedWidget<boolean>
  modelValue: boolean
  readonly?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Local value for immediate UI updates
const localValue = ref(props.modelValue || false)

const onChange = (newValue: boolean) => {
  localValue.value = newValue
  emit('update:modelValue', newValue)
  
  // Call LiteGraph callback to update the authoritative state
  if (props.widget.callback) {
    props.widget.callback(newValue)
  }
}

// Watch for external updates from LiteGraph
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || false
})
</script>
```

## Widget Options

Common widget options supported:

```typescript
interface WidgetOptions {
  // Numeric widgets
  min?: number
  max?: number
  step?: number
  precision?: number
  
  // Combo widgets
  values?: string[]
  
  // Text widgets
  multiline?: boolean
  placeholder?: string
  
  // All widgets
  readonly?: boolean
  hidden?: boolean
  serialize?: boolean
  canvasOnly?: boolean // Skip Vue rendering
}
```

## Value Handling

### Default Values
Handle undefined values appropriately:

```typescript
// For combo widgets, use first option as default
if (value === undefined && 
    widget.type === 'combo' && 
    widget.options?.values?.length > 0) {
  value = widget.options.values[0]
}

// For numeric widgets, default to 0
if (value === undefined && 
    ['number', 'INT', 'FLOAT'].includes(widget.type)) {
  value = 0
}
```

### Type Coercion
Ensure values match expected types:

```typescript
// Numeric widgets
const numericValue = Number(widget.value) || 0

// String widgets
const stringValue = String(widget.value || '')

// Boolean widgets
const booleanValue = Boolean(widget.value)
```

## Callback System

### Widget Callbacks
All widgets follow a consistent pattern for handling user interactions:

```typescript
const onChange = (newValue: unknown) => {
  // 1. Update local state for immediate UI feedback
  localValue.value = newValue
  
  // 2. Emit v-model update for parent component
  emit('update:modelValue', newValue)
  
  // 3. Call LiteGraph callback to update authoritative state
  if (props.widget.callback) {
    props.widget.callback(newValue)
  }
}
```

### Two-way Sync
Widgets watch for external updates from LiteGraph:

```typescript
// Watch for changes from LiteGraph (e.g., programmatic updates, undo/redo)
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})
```

### Data Flow
1. **User interaction** → Widget component detects change
2. **Local update** → Immediate UI feedback via `localValue`
3. **Emit update** → Parent component notified via `update:modelValue`
4. **LiteGraph callback** → Authoritative state updated
5. **Chained callback** → Vue state synchronized via `useGraphNodeManager`
6. **External changes** → Watch detects and updates local state

## Styling

### Widget Wrapper
Common wrapper structure:

```vue
<template>
  <div class="widget-wrapper">
    <label v-if="showLabel" class="widget-label">
      {{ widget.name }}
    </label>
    <div class="widget-content">
      <!-- Widget component here -->
    </div>
  </div>
</template>

<style scoped>
.widget-wrapper {
  @apply flex flex-col gap-1;
}

.widget-label {
  @apply text-sm text-muted-foreground;
}

.widget-content {
  @apply w-full;
}
</style>
```

### Responsive Design
Widgets adapt to node width:
- Compact mode for narrow nodes
- Full mode for wide nodes
- Slider visibility based on available space

## Performance Considerations

### Component Reuse
Vue automatically reuses component instances when possible:
```vue
<component
  v-for="(widget, index) in widgets"
  :key="`${widget.name}-${index}`"
  :is="getComponent(widget)"
/>
```

### Memoization
For expensive computations:
```typescript
const processedOptions = computed(() => {
  // Expensive processing cached
  return processWidgetOptions(props.widget.options)
})
```

### Event Throttling
For high-frequency updates:
```typescript
import { debounce } from 'lodash'

const debouncedCallback = debounce((value) => {
  props.widget.callback?.(value)
}, 100)
```

## Error Handling

### Safe Value Access
Always provide fallbacks:
```typescript
const value = computed(() => {
  try {
    return processValue(props.widget.value)
  } catch (error) {
    console.warn('Widget value error:', error)
    return getDefaultValue(props.widget.type)
  }
})
```

### Component Errors
Use Vue error boundaries:
```vue
<ErrorBoundary>
  <component :is="widgetComponent" />
</ErrorBoundary>
```

## Future Enhancements

### Planned Widget Types
- **ColorPicker**: HSV/RGB color selection
- **ImageWidget**: Image preview and upload
- **CodeEditor**: Syntax highlighted code input
- **FileUpload**: Drag and drop file handling

### Performance Optimizations
- Virtual scrolling for many widgets
- Lazy loading for complex widgets
- Web Worker processing for validation

### Enhanced Features
- Widget grouping and collapsing
- Conditional visibility rules
- Custom widget validators
- Keyboard navigation support