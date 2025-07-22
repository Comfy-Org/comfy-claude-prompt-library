# ComfyUI Frontend Responsive Design Patterns

## Overview

ComfyUI's responsive design system uses multiple breakpoint sources, leading to inconsistencies across the codebase. This document captures the discovered patterns and provides guidance for maintaining responsive consistency.

## The Four Breakpoint Systems

### 1. Tailwind CSS Configuration
Located in `tailwind.config.js`, defines the primary breakpoint system:

```javascript
screens: {
  sm: '640px',     // Standard Tailwind
  md: '768px',     // Standard Tailwind
  lg: '1024px',    // Standard Tailwind
  xl: '1280px',    // Standard Tailwind
  '2xl': '1536px', // Standard Tailwind
  '3xl': '1800px', // Custom extension
  '4xl': '2500px', // Custom extension
  '5xl': '3200px'  // Custom extension
}
```

**Important**: The custom extensions (3xl, 4xl, 5xl) are defined but rarely used in practice.

### 2. VueUse Breakpoints
The `@vueuse/core` library provides `breakpointsTailwind` with standard values:

```javascript
{
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}
```

**Critical Discovery**: VueUse doesn't include the custom Tailwind extensions (3xl, 4xl, 5xl). This means composables using VueUse won't recognize these custom breakpoints.

### 3. PrimeVue Component Breakpoints
PrimeVue's Menubar component has its own responsive system:

```javascript
// BaseMenubar.vue
breakpoint: {
  type: String,
  default: '960px'  // Different from Tailwind's md: 768px!
}
```

**Key Insight**: Most PrimeVue components don't implement responsive breakpoints, but Menubar does with a configurable `breakpoint` prop. The default 960px doesn't align with any Tailwind breakpoint.

### 4. Hardcoded Values
Various hardcoded breakpoints scattered throughout:

- **GraphView.vue**: `useBreakpoints({ md: 961 })` - Custom mobile detection
- **coreSettings.ts**: `window.innerWidth < 1536` - Affects sidebar and workflow tabs
- **CSS media queries**: Multiple files use `@media (max-width: 768px)`

## Critical Inconsistencies

### Mobile Breakpoint Confusion
The codebase uses three different values for "mobile" detection:
- **768px**: Standard Tailwind `md`, used in CSS media queries
- **960px**: PrimeVue Menubar default
- **961px**: Custom value in GraphView.vue

This inconsistency means components may have different responsive behavior at similar viewport widths.

### Hardcoded Critical Defaults
```typescript
// coreSettings.ts
defaultValue: () => (window.innerWidth < 1536 ? 'small' : 'normal')
```

These hardcoded values affect default UI behavior but don't reference the Tailwind configuration, making them brittle and hard to maintain.

## Recommended Patterns

### 1. Use VueUse with Tailwind Breakpoints
```typescript
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('md') // Consistent 768px
```

### 2. Configure PrimeVue Components
```vue
<Menubar 
  :model="items"
  breakpoint="768px"  <!-- Align with Tailwind md -->
/>
```

### 3. Replace Hardcoded Values
```typescript
// Instead of hardcoding:
// window.innerWidth < 1536

// Use:
import { breakpointsTailwind } from '@vueuse/core'
window.innerWidth < breakpointsTailwind['2xl']
```

### 4. Prefer Tailwind Classes Over Media Queries
```vue
<!-- Instead of CSS media queries -->
<style>
@media (max-width: 768px) {
  .container { flex-direction: column; }
}
</style>

<!-- Use Tailwind responsive prefixes -->
<div class="flex md:flex-row flex-col">
```

## useResponsiveCollapse Pattern

The `useResponsiveCollapse` composable provides a standardized way to handle responsive collapsing:

```typescript
export const useResponsiveCollapse = (
  breakpointThreshold: BreakpointKey = 'lg'  // Default 1024px
) => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isSmallScreen = breakpoints.smallerOrEqual(breakpointThreshold)
  // Auto-collapse on small screens
}
```

This pattern is used in ManagerDialogContent and TemplateWorkflowsContent for consistent sidebar behavior.

## Complete Breakpoint Reference

| Value | Source | Usage |
|-------|--------|-------|
| 640px | Tailwind `sm` | Mobile-first breakpoint |
| 768px | Tailwind `md` | Tablet/mobile threshold |
| 850px | CSS media query | Menu height adjustment |
| 960px | PrimeVue default | Menubar responsive toggle |
| 961px | GraphView custom | Mobile detection (inconsistent) |
| 1024px | Tailwind `lg` | Desktop breakpoint |
| 1280px | Tailwind `xl` | Large desktop |
| 1536px | Tailwind `2xl` | Default behavior changes |
| 1800px | Tailwind `3xl` | Custom (rarely used) |
| 2500px | Tailwind `4xl` | Custom (rarely used) |
| 3000px | CSS media query | Ultra-wide dialogs |
| 3200px | Tailwind `5xl` | Custom (rarely used) |

## Migration Strategy

1. **Standardize Mobile Detection**: Replace all 960px/961px usage with 768px
2. **Create Breakpoint Constants**: Export a central breakpoint configuration
3. **Audit Media Queries**: Convert CSS media queries to Tailwind classes
4. **Configure Components**: Set explicit breakpoints on responsive components
5. **Remove Unused Breakpoints**: Consider removing 3xl/4xl/5xl if not needed

## Testing Responsive Behavior

When testing responsive features:
1. Test at exact breakpoint values (767px, 768px, 769px)
2. Verify consistent behavior across all responsive systems
3. Check PrimeVue component breakpoints match Tailwind values
4. Ensure VueUse composables use standard breakpoints

This documentation reflects the current state of ComfyUI's responsive design system and provides actionable patterns for improvement.