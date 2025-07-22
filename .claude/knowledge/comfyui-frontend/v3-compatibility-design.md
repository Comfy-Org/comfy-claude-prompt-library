# Frontend V3 Compatibility Design

This document captures the design for implementing a v3 compatibility layer in the ComfyUI frontend that mirrors the backend's ComfyUI Registry (CNR) version declaration system.

## Background

The ComfyUI backend uses a compatibility system where custom node packs declare their supported ComfyUI version through CNR metadata fields like `supported_comfyui_version`. This allows the system to filter and provide appropriate APIs based on version compatibility.

The frontend needs a similar system for extensions that:
1. Allows extensions to declare their supported frontend version
2. Provides appropriate node data format (v1/v2/v3) based on compatibility
3. Maintains zero breaking changes for existing extensions

## Key Design Decisions

### 1. CNR-Style Version Declaration

Extensions declare compatibility through metadata, mirroring backend's pattern:

```typescript
app.registerExtension({
  name: "MyExtension",
  metadata: {
    name: "MyExtension",
    version: "1.5.0",
    supported_frontend_version: "2.0.0",  // Extension declares frontend compatibility
    supported_backend_version: "1.2.0",   // Optional backend compatibility
    author: "ExtensionAuthor"
  },
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    // Extension automatically gets v2 format based on declaration
  }
})
```

### 2. Version Detection

Frontend detects its version from package.json, mirroring backend's pyproject.toml approach:

```typescript
export class FrontendVersionService {
  static getCurrentFrontendVersion(): string {
    const packageJson = require('../../../package.json')
    return packageJson.version || '1.0.0'
  }
}
```

### 3. Compatibility Filtering

System validates extension compatibility at registration time:

```typescript
export class ExtensionCompatibilityService {
  static isExtensionCompatible(metadata: ExtensionRegistryMetadata): boolean {
    if (!metadata.supported_frontend_version) {
      return true  // No version = compatible (backward compatibility)
    }
    
    return this.isVersionCompatible(
      this.currentFrontendVersion,
      metadata.supported_frontend_version
    )
  }
}
```

### 4. API Format Provision

Extensions receive node data in appropriate format based on their declared version:

```typescript
// Map frontend version to API format
if (supportedVersion >= '3.0.0') {
  return formatAsV3(nodeData)  // node_id, is_experimental, etc.
} else if (supportedVersion >= '2.0.0') {
  return formatAsV2(nodeData)  // inputs, outputs objects
} else {
  return formatAsV1(nodeData)  // input.required, output arrays
}
```

## Schema Format Differences

### V1 Format (Legacy)
```typescript
{
  input: {
    required: { "image": ["IMAGE", {}] },
    optional: { "mask": ["MASK", {}] }
  },
  output: ["IMAGE"],
  output_name: ["result"]
}
```

### V2 Format (Current Frontend)
```typescript
{
  inputs: {
    "image": { type: "IMAGE", name: "image" },
    "mask": { type: "MASK", name: "mask", isOptional: true }
  },
  outputs: [
    { type: "IMAGE", name: "result", index: 0 }
  ]
}
```

### V3 Format (Future)
```typescript
{
  node_id: "ImageProcessor",
  display_name: "Image Processor",
  inputs: [
    { id: "image", io_type: "IMAGE", optional: false },
    { id: "mask", io_type: "MASK", optional: true }
  ],
  outputs: [
    { id: "result", io_type: "IMAGE" }
  ],
  is_experimental: false,
  not_idempotent: false
}
```

## Extension Touchpoints

The compatibility layer operates at these key touchpoints:

1. **beforeRegisterNodeDef Hook**: Primary extension modification point
   ```typescript
   beforeRegisterNodeDef(nodeType, nodeData, app)  // nodeData format varies by version
   ```

2. **Constructor nodeData Access**: Runtime access from node instances
   ```typescript
   const nodeData = this.constructor.nodeData  // Format depends on extension version
   ```

3. **Widget Configuration**: Extensions accessing input/output specifications
   ```typescript
   nodeData.input.required  // v1
   nodeData.inputs          // v2
   nodeData.v3_inputs       // v3
   ```

## Implementation Strategy

### Phase 1: Core Infrastructure
- Version detection from package.json
- Extension metadata interface
- Compatibility validation logic
- Basic v1/v2 format transformation

### Phase 2: Integration
- Modify extension service to check compatibility
- Implement format transformation for each API version
- Add compatibility warnings for incompatible extensions
- Test with existing extensions (all should be v1 compatible)

### Phase 3: Future Enhancement
- Add v3 schema support when backend v3 is finalized
- Create migration tools for extension developers
- Add developer documentation
- Implement compatibility testing utilities

## Benefits

1. **Zero Breaking Changes**: Existing extensions work unchanged (default to v1)
2. **Progressive Enhancement**: Extensions can opt into newer formats
3. **Clear Compatibility**: Extensions explicitly declare what they support
4. **Future Proof**: Easy to add new schema versions
5. **Developer Friendly**: Clear warnings and compatibility reports

## Extension System Constraints (Critical Findings)

**IMPORTANT**: Analysis of the actual ComfyUI frontend extension system revealed critical architectural constraints that make the original CNR-mirrored approach impossible:

### 1. Extension Registration Timing
Extensions self-register during module import execution - there's no pre-registration intercept point:
```typescript
// In extensionService.ts loadExtensions()
await import(/* @vite-ignore */ api.fileURL(ext))  // Extension immediately calls app.registerExtension()
```

This prevents filtering extensions before they register, as registration happens during the import statement itself.

### 2. Shared State Modification Pattern
All extensions receive the same `nodeData` object and modify it in-place:
```typescript
// Multiple extensions modify the same nodeData object
beforeRegisterNodeDef(nodeType, nodeData, app) {
  nodeData.input.required.newField = ['STRING', {}]  // Shared state
}
```

This makes per-extension API versioning impossible - you can't give different extensions different formats of the same node.

### 3. Extension Service Architecture
The extension service is a simple synchronous invoker with no filtering concept:
```typescript
const invokeExtensions = (method: keyof ComfyExtension, ...args: any[]) => {
  for (const ext of extensionStore.enabledExtensions) {
    if (method in ext) {
      ext[method](...args, app)  // Same args for all extensions
    }
  }
}
```

## Lessons Learned

1. **Backend Clarity**: The backend uses CNR metadata for basic compatibility, not manifest.yaml (which is for process isolation)
2. **Frontend Focus**: Frontend needs compatibility at extension touchpoints, not execution layer
3. **Simple Adapter**: Backend's ComfyNodeV3Adapter is simpler than initially thought - just unifies v1→v3 interface
4. **Different Problems**: Backend solves execution compatibility, frontend solves extension API compatibility
5. **Architecture Reality**: Extension filtering approaches fail due to self-registration timing and shared state patterns
6. **Node-Level Solution**: Version information belongs on individual nodes, not extensions, for granular compatibility

## Alternative Approach: Node-Level Versioning

Based on architectural constraints, the practical approach is:
- **Optional extension metadata** for tracking and debugging
- **Node-level version fields** (`api_version`, `frontend_version`) 
- **Extension adaptation** within existing hooks using version detection
- **Additive enhancement** without refactoring core architecture

This design provides a clean, extensible system for managing frontend API evolution while maintaining perfect backward compatibility.