# Scan Accessibility Issues

I need to check accessibility compliance for: $ARGUMENTS

## Your Task

Analyze UI components and pages for WCAG compliance and accessibility best practices.

## Execution Steps

1. **Semantic HTML Validation**
   - Missing or incorrect heading hierarchy
   - Non-semantic elements for interactive content
   - Missing landmark regions
   - Improper list structures
   - Form elements without labels

2. **ARIA Implementation**
   - Missing ARIA labels on interactive elements
   - Incorrect ARIA roles
   - Invalid ARIA attribute combinations
   - Redundant or conflicting ARIA

3. **Keyboard Navigation**
   - Elements not reachable by keyboard
   - Missing focus indicators
   - Incorrect tab order
   - Keyboard traps
   - Missing skip links

4. **Screen Reader Support**
   - Images without alt text
   - Decorative images not hidden
   - Dynamic content without announcements
   - Missing form error associations
   - Unclear button/link text

5. **Visual Accessibility**
   - Insufficient color contrast ratios
   - Color as sole information indicator
   - Missing focus indicators
   - Small touch targets (<44x44px)
   - No visible labels

## Report Format

```
## Accessibility Scan Results

### WCAG Violations
- Level A (Must Fix):
  - [Issue]: [File:Line] - [Impact on users]
  
- Level AA (Should Fix):
  - [Issue]: [File:Line] - [Impact on users]

### Keyboard Navigation Issues
- [Component]: Not keyboard accessible
  Fix: Add tabIndex and key handlers

### Screen Reader Issues
- [Element]: Missing accessible name
  Fix: Add aria-label or aria-labelledby

### Quick Fixes
- Add alt="" to decorative images
- Increase contrast ratio to 4.5:1
- Add focus-visible styles
```