# Vue Composable Patterns in ComfyUI Frontend

## VueUse Integration for Common UI Patterns

### Click Outside Detection with onClickOutside

The `onClickOutside` composable from VueUse provides a cleaner implementation than manual event listeners for detecting clicks outside an element.

#### Benefits Over Manual Implementation
- **Automatic cleanup**: No need to manually remove event listeners in `onUnmounted`
- **Built-in ignore option**: Easily exclude elements from triggering the outside click
- **Lightweight**: Only 1.03KB added to bundle
- **Better lifecycle handling**: Automatically handles component unmount

#### Example: Replacing Manual Event Listeners

**Before (Manual Implementation):**
```typescript
// Complex manual implementation
const helpCenterRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent): void => {
  const target = event.target as Element
  
  if (helpCenterRef.value && !helpCenterRef.value.contains(target)) {
    if (
      isSubmenuVisible.value &&
      submenuRef.value &&
      submenuRef.value.contains(target)
    ) {
      return
    }
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
```

**After (VueUse onClickOutside):**
```typescript
import { onClickOutside } from '@vueuse/core'

const helpCenterRef = ref<HTMLElement | null>(null)
const submenuRef = ref<HTMLElement | null>(null)

// Clean, declarative implementation
onClickOutside(
  helpCenterRef,
  () => emit('close'),
  { ignore: [submenuRef] }
)
```

#### Installation and Setup
VueUse is already included in ComfyUI Frontend dependencies (`@vueuse/core v11.0.0`).

#### Common Use Cases
1. **Dropdown menus**: Close when clicking outside
2. **Modal dialogs**: Dismiss on backdrop click
3. **Popovers**: Hide when user clicks elsewhere
4. **Context menus**: Dismiss on outside interaction

#### Advanced Options
```typescript
// With more control
const { stop } = onClickOutside(
  target,
  (event) => {
    console.log('Clicked outside:', event)
    closeMenu()
  },
  {
    ignore: [ignoreElRef, '.ignore-class'],
    capture: true,
    detectIframe: true
  }
)

// Stop listening when needed
stop()
```

### Other Useful VueUse Composables

While we haven't explored all of these in depth, VueUse offers many composables that could simplify ComfyUI Frontend code:

- `useEventListener`: Better event handling with auto-cleanup
- `useFocusTrap`: Trap focus within modals/dialogs
- `useKeyModifier`: Track modifier key states
- `useElementVisibility`: Track element visibility
- `useDraggable`: Implement drag functionality
- `useResizeObserver`: Monitor element size changes

Consider exploring VueUse documentation for more patterns that could replace manual implementations.