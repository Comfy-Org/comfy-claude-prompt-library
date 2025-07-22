# Iconify Tailwind CSS Integration for ComfyUI Frontend

## Problem Statement

ComfyUI frontend currently uses two icon systems:
1. **PrimeIcons** - CSS classes (`pi pi-folder`) for string-based registrations
2. **Iconify Vue Components** - (`<i-lucide:folder />`) for templates

The issue: Many systems expect icon **strings** for CSS classes, but Iconify components don't provide CSS class equivalents.

## Pre-Migration Assessment

Before implementing the Iconify Tailwind solution, conduct a comprehensive inventory of current icon usage:

### Complete Icon Inventory Required

**Why inventory first:**
- ComfyUI uses 112+ unique PrimeIcons across 520+ files
- Multiple icon systems coexist (PrimeIcons, MDI, Iconify components)
- Designer-friendly mapping tools essential for systematic replacement

**Methodology:** See [`icon-migration-methodology.md`](./icon-migration-methodology.md) for:
- Python scripts for regex-based extraction
- Interactive HTML preview generation
- Semantic description mapping
- Common pitfalls and solutions

**Key patterns to extract:**
```javascript
// PrimeIcons patterns
'pi pi-folder'              // CSS classes
PrimeIcons.FOLDER           // Enum references

// Material Design Icons
'mdi mdi-play'              // CSS classes

// Iconify (current component usage)
<i-lucide:folder />         // Vue components
'lucide:folder'             // String references
```

**Deliverables needed before migration:**
1. Complete icon usage report with locations
2. Interactive HTML preview for designers
3. Semantic descriptions for each icon context
4. Mapping recommendations from designers

## Solution: Iconify Tailwind Plugin

The `@iconify/tailwind` plugin generates CSS classes for Iconify icons, providing the same workflow as PrimeIcons but with 200,000+ icons.

### Installation

```bash
npm i -D @iconify/tailwind
```

### Configuration Options

#### Option 1: Dynamic Selectors (Recommended)
```js
// tailwind.config.js
const { addDynamicIconSelectors } = require("@iconify/tailwind");

module.exports = {
  plugins: [
    addDynamicIconSelectors(),
  ],
};
```

**Usage:**
```html
<span class="icon-[lucide--folder-open]"></span>
<span class="icon-[material-symbols--edit]"></span>
```

#### Option 2: Static Selectors
```js
// tailwind.config.js
const { addIconSelectors } = require("@iconify/tailwind");

module.exports = {
  plugins: [
    addIconSelectors(["lucide", "material-symbols", "tabler"]),
  ],
};
```

**Usage:**
```html
<span class="iconify lucide--folder-open"></span>
<span class="iconify material-symbols--edit"></span>
```

### Migration Strategy

**Current PrimeIcons:**
```typescript
{
  icon: 'pi pi-folder-open',
  // ...
}
```

**New Iconify CSS:**
```typescript
{
  icon: 'iconify lucide--folder-open',
  // or: 'icon-[lucide--folder-open]'
  // ...
}
```

### Benefits

1. **Same workflow** - Designers can still specify icons as strings
2. **Massive icon library** - 200,000+ icons vs ~100 PrimeIcons
3. **Tree-shaking** - Only used icons are bundled
4. **Consistent API** - Works with existing registration systems
5. **Gradual migration** - Can coexist with PrimeIcons during transition

### Implementation Notes

- The plugin works alongside existing `unplugin-icons` Vue component setup
- Requires `@iconify/json` dependency for icon data
- Icon syntax: `{collection}--{icon-name}` (double dash separator)
- Supports custom icon sets
- Compatible with current Tailwind 3.4.4 setup

### Icon Discovery

- Browse all icons: https://icon-sets.iconify.design/
- Popular collections: lucide, material-symbols, tabler, heroicons
- Icon names use double-dash format: `folder-open` becomes `folder--open`

This approach solves the CSS class requirement while maintaining the developer and designer workflow.