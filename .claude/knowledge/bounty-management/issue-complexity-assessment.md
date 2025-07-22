# Issue Complexity Assessment for Bounties

Hard-learned lessons about realistic complexity evaluation for bounty candidates and new hire assignments.

## Critical Reality Check

**Initial Assessment Problem**: Consistently overestimated suitability of complex issues for bounties. What seemed like "simple" TypeScript fixes or UI enhancements were actually too architectural or required deep system knowledge.

### Bounty Complexity Calibration

**TOO COMPLEX for Bounties**:
- TypeScript generic interface improvements (e.g., SettingParams interface)
- Localization system integration (context menu i18n)
- Subgraph expansion/undo functionality
- Nullability fixes in core stores
- Any issue requiring architectural decisions

**GOOD for Bounties**:
- Regex escaping in search highlighting
- Menu visibility toggle fixes  
- CSS styling issues with clear scope
- Documentation flag additions
- Simple HTTP request error handling

### New Hire Complexity Guidelines

**PERFECT for New Hires** (more lenient than bounties):
- Any issue labeled "good first issue"
- Bug fixes with clear reproduction steps
- Menu/settings visibility problems
- Form validation edge cases
- UI consistency issues

## Assessment Framework

### Red Flags (Skip for Bounty)
- Issue has active discussion about approach
- Requires understanding of multiple systems
- Involves state management changes
- No clear "correct" solution obvious
- Comments mention complexity or architectural concerns

### Green Flags (Good for Bounty/New Hire)
- Single file/component scope
- Clear reproduction steps
- Obvious "right" way to fix
- Isolated from core systems
- Has "good first issue" label (new hires)

## Lessons from Specific Issues

### Issue #4466 - Regex Escaping
- **Status**: Perfect bounty candidate BUT already assigned
- **Learning**: Always check comments for assignment status
- **Pattern**: Simple, isolated, clear fix in single function

### Issue #4140 - Export Menu Visibility  
- **Status**: Perfect new hire candidate
- **Pattern**: Settings/toggle issue, safe to experiment, good learning

### Issue #4405 - TypeScript Generics
- **Initial Assessment**: Seemed like simple typing fix
- **Reality**: Too complex, requires understanding of entire settings system
- **Learning**: TypeScript "improvements" often touch many files

### Issue #4088 - Context Menu Localization
- **Initial Assessment**: Add i18n support, seemed straightforward  
- **Reality**: Requires understanding of localization architecture
- **Learning**: Any system integration is too complex for bounties

## Decision Process

1. **Read issue carefully** - Don't just scan title
2. **Check comments** - Look for assignment, discussion, complexity signals
3. **Identify scope** - How many files/components involved?
4. **Assess prerequisites** - What system knowledge required?
5. **Verify isolation** - Can this break other things?

## Complexity Estimation Errors

### Common Overoptimism Patterns
- "Just add a flag" → Often touches multiple systems
- "Simple UI fix" → May require understanding of complex state
- "TypeScript improvement" → Usually architectural, not surface-level
- "Add option/setting" → Settings systems are often complex

### Calibration Technique
Before marking as bounty candidate, ask:
- Could a developer unfamiliar with the codebase complete this in <8 hours?
- Does this require making design decisions?
- Are there multiple valid approaches?
- Does success depend on understanding system architecture?

If any answer is "yes", it's likely too complex for a bounty.