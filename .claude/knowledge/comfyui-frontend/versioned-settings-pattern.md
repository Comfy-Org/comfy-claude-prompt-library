# Versioned Settings Pattern

## Overview

The versioned settings system allows ComfyUI to change default settings for new users while preserving existing users' expected behavior. This pattern was implemented in PRs #4337 and #4354, and provides a clean solution for improving defaults without breaking changes.

## Implementation Pattern

### 1. Setting Definition

Add a `defaultsByInstallVersion` field to any setting that needs version-specific defaults:

```typescript
{
  id: 'Comfy.LinkRelease.Action',
  category: ['LiteGraph', 'LinkRelease', 'Action'],
  name: 'Action on link release (No modifier)',
  type: 'combo',
  options: Object.values(LinkReleaseTriggerAction),
  defaultValue: LinkReleaseTriggerAction.CONTEXT_MENU,  // Original default for existing users
  defaultsByInstallVersion: {
    '1.24.1': LinkReleaseTriggerAction.SEARCH_BOX      // New default for users installing 1.24.1+
  }
}
```

### 2. How It Works

The settings store checks the user's `Comfy.InstalledVersion` setting:
- If user installed before the specified version → uses `defaultValue`
- If user installed at or after the specified version → uses versioned default
- If user has explicitly set the value → explicit setting always wins

### 3. Multiple Version Thresholds

You can specify multiple version thresholds:

```typescript
defaultsByInstallVersion: {
  '1.24.0': LinkReleaseTriggerAction.SEARCH_BOX,
  '1.30.0': LinkReleaseTriggerAction.AI_SUGGESTION  // Future enhancement
}
```

The system picks the highest version that's less than or equal to the user's installed version.

## Real-World Example: Link Release Actions

**Problem**: The context menu was confusing for new users when releasing a link. The search box provides better UX with fuzzy search and filtering.

**Solution**: Use versioned defaults to give new users the improved experience while existing users keep their familiar behavior.

```typescript
// Both settings were updated to swap the defaults for new users
{
  id: 'Comfy.LinkRelease.Action',
  defaultValue: LinkReleaseTriggerAction.CONTEXT_MENU,
  defaultsByInstallVersion: {
    '1.24.1': LinkReleaseTriggerAction.SEARCH_BOX
  }
},
{
  id: 'Comfy.LinkRelease.ActionShift',
  defaultValue: LinkReleaseTriggerAction.SEARCH_BOX,
  defaultsByInstallVersion: {
    '1.24.1': LinkReleaseTriggerAction.CONTEXT_MENU
  }
}
```

## Testing Versioned Behavior

### Test Strategy

1. **New User Test**: Set InstalledVersion to current/future version
2. **Existing User Test**: Set InstalledVersion to older version
3. **Override Test**: Verify explicit settings override versioned defaults

### Playwright Test Pattern

```typescript
test('New user (1.24.1+) gets search box by default on link release', async ({
  comfyPage
}) => {
  // Start fresh to test new user behavior
  await comfyPage.setup({ clearStorage: true })
  // Simulate new user with 1.24.1+ installed version
  await comfyPage.setSetting('Comfy.InstalledVersion', '1.24.1')
  await comfyPage.setSetting('Comfy.NodeSearchBoxImpl', 'default')
  // Don't set LinkRelease settings explicitly to test versioned defaults

  await comfyPage.disconnectEdge()
  await expect(comfyPage.searchBox.input).toHaveCount(1)
  await expect(comfyPage.searchBox.input).toBeVisible()
})

test('Existing user (pre-1.24.1) gets context menu by default on link release', async ({
  comfyPage
}) => {
  await comfyPage.setup({ clearStorage: true })
  await comfyPage.setSetting('Comfy.InstalledVersion', '1.23.0')
  await comfyPage.setSetting('Comfy.NodeSearchBoxImpl', 'default')

  await comfyPage.disconnectEdge()
  // Context menu should appear, search box should not
  await expect(comfyPage.searchBox.input).toHaveCount(0)
  const contextMenu = comfyPage.page.locator('.litecontextmenu')
  await expect(contextMenu).toBeVisible()
})
```

### Key Testing Insights

- Use `clearStorage: true` to simulate fresh installation
- Set `Comfy.InstalledVersion` before testing defaults
- Don't set the setting explicitly when testing defaults
- Use selectors/locators instead of screenshots for assertions

## When to Use This Pattern

Consider versioned defaults when:
- You've identified a better default through user feedback
- The change would disrupt existing users' workflows
- You want to provide improved UX for new users
- The setting significantly impacts user experience

## Implementation Checklist

- [ ] Add `defaultsByInstallVersion` to setting definition
- [ ] Choose appropriate version threshold (usually next release)
- [ ] Add tests for new user behavior
- [ ] Add tests for existing user behavior  
- [ ] Add test for explicit override behavior
- [ ] Document the change in PR description
- [ ] Consider if other related settings need updating

## Technical Details

The implementation in `settingStore.ts`:
- `getVersionedDefaultValue()` handles version comparison
- Falls back to `defaultValue` if no version match
- Handles function-based defaults correctly
- Prevents infinite loops by skipping check for `Comfy.InstalledVersion` itself
- Uses semantic version comparison for proper ordering

## Best Practices

1. **Version Selection**: Use the next minor or major release version as threshold
2. **Related Settings**: Update related settings together (e.g., both normal and shift modifiers)
3. **Documentation**: Always document why the default is changing
4. **Testing**: Test all three scenarios (new, existing, override)
5. **Gradual Rollout**: Consider using feature flags for very impactful changes

## Future Considerations

The versioned settings system could be extended to:
- Support percentage-based rollouts
- Include A/B testing capabilities
- Provide analytics on setting adoption
- Allow server-side default overrides

This pattern provides a robust solution for evolving ComfyUI's UX while respecting existing users' workflows and expectations.