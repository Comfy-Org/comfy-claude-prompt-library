# ComfyUI File Path Annotations

## Temporary File Annotation Pattern

ComfyUI uses a special annotation pattern in file paths to indicate temporary files that are part of the workflow execution:

### Format
```
{subfolder}/{filename} [temp]
```

### Examples
- `audio/recording-123.wav [temp]`
- `webcam/capture-456.png [temp]`
- `threed/render-789.png [temp]`

### Key Points

1. **Dual-Purpose System**: The `[temp]` annotation works alongside the upload API's `type` parameter:
   ```typescript
   // Upload API parameter
   body.append('type', 'temp')
   
   // File path annotation  
   return `audio/${tempAudio.name} [temp]`
   ```

2. **UI Indication**: The `[temp]` annotation tells the frontend this is a temporary file that should be handled differently from regular input files during workflow serialization and execution.

3. **Consistent Pattern**: Used across different node types:
   - Audio recording nodes: `audio/${name} [temp]`
   - Webcam capture nodes: `webcam/${name} [temp]`
   - 3D rendering nodes: `threed/${name} [temp]`

4. **Workflow Serialization**: These annotated paths are included when workflows are saved/loaded, allowing the system to distinguish between permanent assets and temporary captures.

### Implementation Example

From the audio recording implementation:
```typescript
const convertBlobToFileAndSubmit = async (blob: Blob): Promise<string> => {
  const name = `recording-${Date.now()}.wav`
  const file = new File([blob], name, { type: blob.type || 'audio/wav' })

  const body = new FormData()
  body.append('image', file)
  body.append('subfolder', 'audio')
  body.append('type', 'temp')  // Backend storage type

  const resp = await api.fetchApi('/upload/image', {
    method: 'POST',
    body
  })

  const tempAudio = await resp.json()
  return `audio/${tempAudio.name} [temp]`  // Frontend annotation
}
```

This pattern ensures proper handling of temporary files throughout the ComfyUI workflow lifecycle.