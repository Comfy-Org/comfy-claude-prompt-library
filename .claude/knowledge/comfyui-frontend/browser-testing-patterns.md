# Browser Testing Patterns for ComfyUI Frontend

This document captures patterns and lessons learned for Playwright browser testing in ComfyUI, particularly around node interactions and canvas operations.

## Node Interaction Patterns

### Double-Clicking Nodes

When implementing double-click interactions with nodes, use `canvas.dblclick` with calculated positions rather than node reference methods:

```typescript
// ❌ BAD: NodeRef doesn't support body clicks
await nodeRef.click('body', { clickCount: 2 })  // Error: Invalid click position body

// ✅ GOOD: Use canvas.dblclick with calculated position
const nodePos = await nodeRef.getPosition()
const nodeSize = await nodeRef.getSize()
await comfyPage.canvas.dblclick({
  position: {
    x: nodePos.x + nodeSize.width / 2,
    y: nodePos.y + nodeSize.height / 2
  },
  delay: 5
})
```

### Node Click Positions

The NodeRef class supports only specific click positions:

```typescript
// Supported positions for NodeRef.click()
type ClickPosition = 'title' | 'collapse'

// Title click - useful for selection, context menus
await nodeRef.click('title')

// Collapse click - toggles node collapse state  
await nodeRef.click('collapse')
```

### Title Editing Pattern

To edit a node's title via double-click:

```typescript
// Double-click on title area (above node body)
const nodePos = await nodeRef.getPosition()
const nodeSize = await nodeRef.getSize()
await comfyPage.canvas.dblclick({
  position: {
    x: nodePos.x + nodeSize.width / 2,
    y: nodePos.y - 10  // Title area is above the node body
  },
  delay: 5
})

// Wait for title editor
await expect(comfyPage.page.locator('.node-title-editor')).toBeVisible()

// Edit the title
await comfyPage.page.keyboard.press('Control+a')
await comfyPage.page.keyboard.type('New Title')
await comfyPage.page.keyboard.press('Enter')
```

## Canvas Operations

### Direct Canvas Interactions

For interactions that don't fit the NodeRef API, use canvas methods directly:

```typescript
// Get canvas bounds for absolute positioning
const canvasBounds = await comfyPage.canvas.boundingBox()

// Click at specific canvas coordinates
await comfyPage.canvas.click({
  position: { x: 100, y: 200 }
})

// Double-click to trigger actions
await comfyPage.canvas.dblclick({
  position: { x: 100, y: 200 },
  delay: 5  // Small delay for stability
})

// Tap for mobile testing
await comfyPage.canvas.tap({
  position: { x: 100, y: 200 }
})
```

### Coordinate Conversion

When working with node positions, remember they're in canvas space:

```typescript
// Node positions are canvas coordinates
const nodePos = await nodeRef.getPosition()  // Canvas coordinates
const nodeSize = await nodeRef.getSize()

// Calculate center point
const centerX = nodePos.x + nodeSize.width / 2
const centerY = nodePos.y + nodeSize.height / 2

// Use calculated positions for interactions
await comfyPage.canvas.dblclick({
  position: { x: centerX, y: centerY }
})
```

## Workflow Loading

### Using Existing Test Workflows

Prefer using existing workflow files over creating new ones:

```typescript
// ✅ GOOD: Use existing workflows
await comfyPage.loadWorkflow('nested-subgraph')  // Loads from browser_tests/assets/

// ❌ AVOID: Creating new workflows unless necessary
// Only create new workflows if testing specific edge cases
```

### Available Test Workflows

Common workflows in `browser_tests/assets/`:
- `nested-subgraph.json` - Contains nested subgraph nodes
- `simple_link.json` - Basic node connections
- `single_ksampler.json` - Single KSampler node
- `batch_move_links.json` - Multiple link operations
- `single_group_only.json` - Group node testing

## Subgraph Testing

### Entering Subgraphs

To enter a subgraph node:

```typescript
// Get the subgraph node
const subgraphNode = await comfyPage.getNodeRefById('10')

// Double-click center to enter
const nodePos = await subgraphNode.getPosition()
const nodeSize = await subgraphNode.getSize()
await comfyPage.canvas.dblclick({
  position: {
    x: nodePos.x + nodeSize.width / 2,
    y: nodePos.y + nodeSize.height / 2
  },
  delay: 5
})

// Wait for breadcrumb to confirm entry
await comfyPage.page.waitForSelector('.subgraph-breadcrumb')
```

### Navigating Back

To exit a subgraph:

```typescript
// Use Escape key to go back
await comfyPage.page.keyboard.press('Escape')

// Or click breadcrumb items (if testing navigation)
await comfyPage.page.locator('.subgraph-breadcrumb button').first().click()
```

## Timing and Synchronization

### Frame Synchronization

After actions that modify the canvas:

```typescript
// Wait for next frame after canvas modifications
await comfyPage.nextFrame()

// For animations or gradual changes
await comfyPage.page.waitForTimeout(100)
```

### Element Visibility

Always wait for elements before interacting:

```typescript
// Wait for specific elements
await expect(comfyPage.page.locator('.node-title-editor')).toBeVisible()

// Wait with timeout
await comfyPage.page.waitForSelector('.comfy-modal', { timeout: 5000 })
```

## Common Pitfalls and Solutions

### Issue: NodeRef Body Clicks
**Problem**: `nodeRef.click('body')` throws "Invalid click position body"  
**Solution**: Use `canvas.dblclick()` with calculated positions

### Issue: Flaky Title Editing
**Problem**: Title editor doesn't appear consistently  
**Solution**: Add delay to dblclick and wait for editor visibility

### Issue: Coordinate Misalignment
**Problem**: Clicks miss their targets  
**Solution**: Use node position/size methods and calculate precise coordinates

### Issue: Subgraph Navigation Timing
**Problem**: Breadcrumb doesn't update immediately  
**Solution**: Wait for `.subgraph-breadcrumb` selector after entering

## Best Practices

1. **Use Existing Infrastructure**: Leverage ComfyPage fixtures and helper methods
2. **Explicit Waits**: Always wait for elements/states rather than using arbitrary delays
3. **Precise Coordinates**: Calculate exact positions rather than guessing
4. **Test Workflows**: Reuse existing test workflows when possible
5. **Error Messages**: Capture specific error messages for debugging
6. **Frame Timing**: Use `nextFrame()` after canvas modifications

## Example: Complete Node Interaction Test

```typescript
test('Edit subgraph node title and verify breadcrumb update', async ({ comfyPage }) => {
  // Load workflow with subgraphs
  await comfyPage.loadWorkflow('nested-subgraph')
  
  // Get subgraph node
  const subgraphNode = await comfyPage.getNodeRefById('10')
  const nodePos = await subgraphNode.getPosition()
  const nodeSize = await subgraphNode.getSize()
  
  // Enter subgraph to check initial breadcrumb
  await comfyPage.canvas.dblclick({
    position: {
      x: nodePos.x + nodeSize.width / 2,
      y: nodePos.y + nodeSize.height / 2
    },
    delay: 5
  })
  
  await comfyPage.page.waitForSelector('.subgraph-breadcrumb')
  const breadcrumb = comfyPage.page.locator('.subgraph-breadcrumb')
  const initialText = await breadcrumb.textContent()
  
  // Go back to main graph
  await comfyPage.page.keyboard.press('Escape')
  
  // Double-click title to edit
  await comfyPage.canvas.dblclick({
    position: {
      x: nodePos.x + nodeSize.width / 2,
      y: nodePos.y - 10  // Title area
    },
    delay: 5
  })
  
  // Edit title
  await expect(comfyPage.page.locator('.node-title-editor')).toBeVisible()
  await comfyPage.page.keyboard.press('Control+a')
  await comfyPage.page.keyboard.type('Updated Title')
  await comfyPage.page.keyboard.press('Enter')
  
  await comfyPage.nextFrame()
  
  // Verify breadcrumb updated
  await comfyPage.canvas.dblclick({
    position: {
      x: nodePos.x + nodeSize.width / 2,
      y: nodePos.y + nodeSize.height / 2
    },
    delay: 5
  })
  
  await comfyPage.page.waitForSelector('.subgraph-breadcrumb')
  const updatedText = await breadcrumb.textContent()
  expect(updatedText).toContain('Updated Title')
  expect(updatedText).not.toBe(initialText)
})
```

This pattern ensures reliable node interactions in browser tests while working within the constraints of the ComfyUI testing framework.