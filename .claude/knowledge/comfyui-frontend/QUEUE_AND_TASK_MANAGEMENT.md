# Queue and Task Management Patterns

## Unified Delete API Pattern

The ComfyUI frontend uses a unified pattern for deleting items from both queue and history:

```typescript
// src/scripts/api.ts
async deleteItem(type: string, id: string) {
  await this.#postItem(type, { delete: [id] })
}
```

This single method handles both:
- **Queue deletion**: `api.deleteItem('queue', promptId)` → `POST /queue` with `{ delete: [promptId] }`
- **History deletion**: `api.deleteItem('history', promptId)` → `POST /history` with `{ delete: [promptId] }`

The task type is determined by the `TaskItemImpl` class:

```typescript
// src/stores/queueStore.ts
get apiTaskType(): APITaskType {
  switch (this.taskType) {
    case 'Running':
    case 'Pending':
      return 'queue'      // Routes to /queue endpoint
    case 'History':
      return 'history'    // Routes to /history endpoint
  }
}
```

## Context Menu UI Pattern for Task Deletion

Task deletion in the ComfyUI frontend is exclusively exposed through a context menu (right-click) pattern:

### Implementation

```typescript
// src/components/sidebar/tabs/QueueSidebarTab.vue
const menuItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
    {
      label: t('g.delete'),
      icon: 'pi pi-trash',
      command: () => menuTargetTask.value && removeTask(menuTargetTask.value),
      disabled: isExpanded.value || isInFolderView.value
    },
    // ... other menu items
  ]
})
```

### Behavior by Task Type

The `removeTask` function handles different task types appropriately:

```typescript
const removeTask = async (task: TaskItemImpl) => {
  if (task.isRunning) {
    await api.interrupt(task.promptId)  // Interrupt running tasks first
  }
  await queueStore.delete(task)         // Then delete via unified API
}
```

- **Running tasks**: First interrupted, then deleted
- **Pending tasks**: Directly deleted from queue
- **History tasks**: Directly deleted from history

### UI Limitations

- No visible delete buttons on individual task items
- Delete functionality only accessible via right-click
- Delete option disabled in expanded view or folder view modes
- No keyboard shortcuts for individual task deletion
- Bulk operations available via toolbar buttons (Clear All, Clear Pending)

This design choice makes the delete functionality less discoverable but prevents accidental deletions.

## API Property Usage Analysis

### Unused Properties Safe for Removal

The `meta` property in `zHistoryTaskItem` (src/schemas/apiSchema.ts:235) is **safe to remove** from the frontend's perspective:

- **Defined but unused**: Optional property containing node output metadata
- **TaskItemImpl abstraction**: Constructor doesn't accept or store meta property
- **No frontend access**: Zero grep results for `task.meta` or `historyTask.meta` across codebase
- **Follows cleanup pattern**: Similar to `animated` property removal (queueStore.ts:218-223)

When creating TaskItemImpl instances from API responses, only these properties are used:
- `taskType`, `prompt`, `status`, `outputs` (meta is ignored)

## Prompt Array Structure and Migration

### Current Array Structure

The prompt field uses a 5-element tuple structure defined in `zTaskPrompt`:

```typescript
const zTaskPrompt = z.tuple([
  zQueueIndex,        // Index 0: number - Queue position
  zPromptId,          // Index 1: string - Unique identifier
  zPromptInputs,      // Index 2: Record<string, PromptInputItem> - Node inputs
  zExtraData,         // Index 3: { extra_pnginfo?, client_id } - Workflow metadata
  zOutputsToExecute   // Index 4: NodeId[] - Target output nodes
])
```

### Array Access Locations

**Primary abstraction** (src/stores/queueStore.ts:272-289):
```typescript
// TaskItemImpl getters encapsulate most access
get queueIndex() { return this.prompt[0] }
get promptId() { return this.prompt[1] }
get promptInputs() { return this.prompt[2] }
get extraData() { return this.prompt[3] }
get outputsToExecute() { return this.prompt[4] }
```

**Direct access locations** (only 3 files):
- `src/scripts/api.ts:693` - `api.interrupt(prompt[1])` (prompt ID)
- `src/scripts/ui.ts:267,269,275` - Delete ops, display, workflow access
- `browser_tests/fixtures/utils/taskHistory.ts:37-41` - Test data creation

### Migration Strategy for Object Structure

When migrating from array to object structure (e.g., `{clientId, apiPrompt}`):

**Update order** (minimizes breakage):
1. **TaskItemImpl getters** - Updates primary abstraction layer
2. **Direct access sites** - Only 3 locations need changes
3. **Test fixtures** - Update test data creation
4. **Type definitions** - Update zTaskPrompt schema

**Low migration impact**: TaskItemImpl abstraction contains 90% of array access patterns, making structure changes manageable.

### Detailed Field Usage Analysis

#### promptInputs (prompt[2]) and outputsToExecute (prompt[4])
**Usage pattern**: Data preservation only in flatten() method
```typescript
// src/stores/queueStore.ts:396-409 
flatten(): TaskItemImpl[] {
  return this.outputs.map((output) =>
    new TaskItemImpl(
      'History',
      [
        this.queueIndex,
        this.promptId, 
        this.promptInputs,    // prompt[2] - preserved but not used
        this.extraData,
        this.outputsToExecute // prompt[4] - preserved but not used  
      ],
      this.status,
      { [output.nodeId]: { [output.mediaType]: [output] } },
      [output]
    )
  )
}
```
**Frontend impact**: These fields are carried through flattening for data consistency but never accessed directly by UI components. Safe candidates for backend optimization.

#### status.messages Field
**Usage pattern**: Extensively used for execution tracking and UI state
```typescript
// Core getters that depend on status.messages:
get messages() { return this.status?.messages || [] }
get interrupted() { 
  return _.some(this.messages, (message) => message[0] === 'execution_interrupted') 
}
get executionStartTimestamp() {
  const message = this.messages.find((message) => message[0] === 'execution_start')
  return message ? message[1].timestamp : undefined
}
get executionEndTimestamp() {
  const messages = this.messages.filter((message) =>
    ['execution_success', 'execution_interrupted', 'execution_error'].includes(message[0])
  )
  return _.max(messages.map((message) => message[1].timestamp))
}
```
**Frontend impact**: Critical for task status display (Cancelled vs other states), execution timing calculation, and UI state management. Cannot be removed without breaking core functionality.