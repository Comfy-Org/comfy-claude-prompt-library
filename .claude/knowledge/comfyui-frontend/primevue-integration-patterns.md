# PrimeVue Integration Patterns in ComfyUI Frontend

## Tooltip Behavior and Z-Index Management

### Key Discovery: Body-Level Rendering
PrimeVue tooltips render at `document.body` level, not within the component DOM tree. This has critical implications:

1. **Scoped CSS is ineffective** - Styles like `:deep(.p-tooltip)` within a component won't work
2. **Global styles affect all tooltips** - Changes to `.p-tooltip` impact the entire application
3. **Stacking context issues** - Tooltips need careful z-index management relative to other overlays

### The Custom Class Solution
When you need targeted tooltip styling (e.g., higher z-index for specific tooltips):

```vue
<!-- Instead of simple string syntax -->
<span v-tooltip="'Tooltip text'">

<!-- Use object syntax with custom class -->
<span v-tooltip="{ value: 'Tooltip text', class: 'my-custom-tooltip' }">
```

Then target in global CSS:
```css
.p-tooltip.my-custom-tooltip {
  z-index: 1200 !important;
}
```

### Real-World Example: Workflow Tab Tooltips
Problem: Workflow tab tooltips were hidden behind the menubar (z-index: 1001)

Failed approaches:
1. ❌ Global PrimeVue config: `zIndex: { tooltip: 1100 }` - doesn't work
2. ❌ Scoped component CSS: `.workflow-tabs :deep(.p-tooltip)` - tooltips render outside
3. ❌ Global tooltip rule: `.p-tooltip { z-index: 1100 }` - broke settings dialog tooltips

Successful solution:
```vue
<!-- WorkflowTab.vue -->
<span v-tooltip.bottom="{ value: workflowOption.workflow.key, class: 'workflow-tab-tooltip' }">
```

```css
/* style.css - targeted rule */
.p-tooltip.workflow-tab-tooltip {
  z-index: 1200 !important; /* Higher than menubar's 1001 */
}
```

### Z-Index Strategy Guidelines

1. **Document your z-index layers**:
   - Base content: 0-10
   - Floating elements: 100-500
   - Dropdown menus: 999-1000
   - Modal dialogs: 1000-2000
   - Tooltips: 1100-1200
   - Critical overlays: 9999

2. **Use targeted approaches**: Prefer custom classes over global changes
3. **Test in context**: Always verify tooltips work in dialogs, with menus, etc.
4. **Consider stacking contexts**: Parent transforms/positioning can create new contexts

### Dialog and Tooltip Interactions
When tooltips appear within dialogs, they need special consideration:
- Dialogs create their own stacking context
- Tooltips inside dialogs might need higher z-index than the dialog itself
- Test tooltip behavior when dialogs are open

### Debugging Tips
1. Use browser DevTools to inspect where tooltip elements are rendered
2. Check computed z-index values and stacking contexts
3. Look for existing global CSS rules that might conflict
4. Verify parent elements don't create unexpected stacking contexts