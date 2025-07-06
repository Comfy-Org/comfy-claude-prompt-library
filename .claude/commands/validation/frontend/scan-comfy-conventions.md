# Scan ComfyUI Frontend Conventions

I need to check ComfyUI-specific frontend conventions and patterns for: $ARGUMENTS

## Your Task

Validate adherence to ComfyUI frontend conventions, PrimeVue patterns, and project-specific best practices.

## Execution Steps

1. **PrimeVue Deprecated Component Usage**
   - `Dropdown` should be `Select` (import from 'primevue/select')
   - `OverlayPanel` should be `Popover` (import from 'primevue/popover')
   - `Calendar` should be `DatePicker` (import from 'primevue/datepicker')
   - `InputSwitch` should be `ToggleSwitch` (import from 'primevue/toggleswitch')
   - `Sidebar` should be `Drawer` (import from 'primevue/drawer')
   - `Chips` should be `AutoComplete` with multiple enabled and typeahead disabled
   - `TabMenu` should be `Tabs` without panels
   - `Steps` should be `Stepper` without panels
   - `InlineMessage` should be `Message` component

2. **API & URL Patterns**
   - `api.apiURL()` usage for backend API calls (/prompt, /queue, /view, etc.)
   - `api.fileURL()` usage for static files from public folder
   - Image previews using `api.apiURL('/view?...')`
   - Extension loading using `api.fileURL(extensionPath)`
   - Incorrect API URL construction patterns
   - Hard-coded URLs instead of API helpers

3. **Internationalization & User Experience**
   - Hard-coded strings instead of `vue-i18n` usage
   - Missing entries in `src/locales/en/main.json`
   - User-facing text not using translation functions
   - Non-actionable error messages
   - Generic error messages instead of specific guidance

4. **Styling & CSS Conventions**
   - Custom CSS instead of Tailwind utility classes
   - `dark:` prefix instead of `dark-theme:` for dark mode
   - Missing theme-aware styling patterns
   - Inline styles that could be Tailwind utilities
   - CSS classes that duplicate Tailwind functionality

5. **TypeScript & Code Quality**
   - `@ts-expect-error` usage (should be avoided)
   - `as any` type assertions (NEVER use)
   - Type assertions as anything other than last resort
   - `null` returns instead of `undefined`
   - Missing type definitions for props/emits

6. **Security & Safety Patterns**
   - Raw HTML usage (`v-html`) without DOMPurify sanitization
   - Dynamic content not validated through trusted sources
   - Template patterns preferred over `v-html`
   - Missing sanitization for user-generated content
   - Unsafe innerHTML or similar patterns

7. **Architecture & API Design**
   - Clean, scalable public APIs and interfaces
   - Domain-driven design pattern violations
   - Extension/mod accessibility concerns
   - Component APIs that don't restrict external access appropriately
   - Missing abstraction layers for complex functionality

8. **LiteGraph Specific Patterns**
   - Missing `TypedArray` `subarray` usage opportunities
   - `Rectangle` size/pos properties not sharing array buffer
   - Complex `if` statements that could be single-line
   - Unnecessary removal of `&&=` or `||=` operators
   - `null` returns instead of `undefined`

## Report Format

```
## ComfyUI Convention Analysis

### Critical PrimeVue Migrations
- [Component]: Using deprecated Dropdown
  Fix: Replace with Select from 'primevue/select'
  
- [Component]: Using deprecated OverlayPanel  
  Fix: Replace with Popover from 'primevue/popover'

### API Pattern Violations
- [File]: Hard-coded URL '/api/prompt'
  Fix: Use api.apiURL('/prompt')
  
- [File]: Static file path '/templates/default.json'
  Fix: Use api.fileURL('/templates/default.json')

### Internationalization Issues
- [Component]: Hard-coded string "Loading data..."
  Fix: Use $t('common.loading') and add to main.json

### TypeScript Anti-patterns
- [File:Line]: Using 'as any' type assertion
  Fix: NEVER use 'as any' - implement proper typing
  
- [File:Line]: Using @ts-expect-error
  Fix: Address root type issue instead of suppressing

### Security Concerns
- [Component]: v-html without sanitization
  Fix: Use DOMPurify.sanitize() or prefer template syntax

### Styling Violations
- [Component]: Custom CSS instead of Tailwind
  Fix: Replace with utility classes
  
- [Component]: Using 'dark:' prefix
  Fix: Use 'dark-theme:' prefix for consistency

### Architecture Issues
- [Component]: Public API exposes internal implementation
  Fix: Create proper abstraction layer for extension compatibility

### LiteGraph Optimizations
- [Function]: Manual array operations
  Fix: Use TypedArray subarray for better performance
  
- [Function]: Returning null instead of undefined
  Fix: Return undefined for idiomatic JavaScript

### Quick Wins
- Migrate X deprecated PrimeVue components
- Replace Y hard-coded URLs with API helpers
- Add Z missing translations to main.json
- Convert A custom CSS to Tailwind utilities
```

## Important Notes

- PrimeVue component migration is high priority for compatibility
- API URL patterns are critical for deployment flexibility  
- All user-facing text must use vue-i18n for internationalization
- NEVER use `as any` or suppress TypeScript errors
- Architecture decisions must consider extension/mod compatibility
- Focus on maintainable, scalable patterns for large user base