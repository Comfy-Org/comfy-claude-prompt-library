# ComfyUI v3 Migration Guide

This guide helps developers migrate existing v1 nodes to the new v3 schema and take advantage of async execution and process isolation.

## Quick Start: The Core Changes

1.  **Inherit from `io.ComfyNodeV3`**: Your node class now subclasses `io.ComfyNodeV3`.
2.  **Use `define_schema`**: All metadata (`INPUT_TYPES`, `CATEGORY`, etc.) moves into a single `@classmethod def define_schema(cls)` that returns an `io.SchemaV3` object.
3.  **Use `execute`**: The main logic function is now always a `@classmethod def execute(cls, ...)` method.
4.  **Use Typed I/O**: Inputs and outputs are now strongly-typed objects from the `io` module (e.g., `io.Image.Input(...)`).
5.  **Return `NodeOutput`**: The `execute` method must return an `io.NodeOutput` instance.
6.  **Use `NODES_LIST`**: Node registration is done by adding the class to a `NODES_LIST` at the end of the file, replacing `NODE_CLASS_MAPPINGS` and `NODE_DISPLAY_NAME_MAPPINGS`.

## Step-by-Step Migration

### Step 1: Class Definition and Schema

**V1:**
```python
class Canny:
    CATEGORY = "image/preprocessors"
    FUNCTION = "detect_edge"
    RETURN_TYPES = ("IMAGE",)

    @classmethod
    def INPUT_TYPES(s):
        return {"required": {
            "image": ("IMAGE",),
            "low_threshold": ("FLOAT", {"default": 0.4}),
            "high_threshold": ("FLOAT", {"default": 0.8}),
        }}
    
    def detect_edge(self, image, low_threshold, high_threshold):
        # ... logic ...
        return (img_out,)

NODE_CLASS_MAPPINGS = {"Canny": Canny}
```

**V3:**
```python
from comfy_api.v3 import io

class Canny(io.ComfyNodeV3):
    @classmethod
    def define_schema(cls):
        return io.SchemaV3(
            node_id="Canny_V3",
            category="image/preprocessors",
            inputs=[
                io.Image.Input("image"),
                io.Float.Input("low_threshold", default=0.4),
                io.Float.Input("high_threshold", default=0.8),
            ],
            outputs=[io.Image.Output()],
        )
    
    @classmethod
    def execute(cls, image, low_threshold, high_threshold):
        # ... logic ...
        return io.NodeOutput(img_out)

NODES_LIST = [Canny]
```

### Step 2: Naming and Registration (`node_id`, `display_name`, `NODES_LIST`)

This is a critical step for ensuring your V3 node coexists with or replaces the V1 version correctly.

1.  **Remove Old Mappings**: Delete the `NODE_CLASS_MAPPINGS` and `NODE_DISPLAY_NAME_MAPPINGS` dictionaries.
2.  **Create `NODES_LIST`**: Create a new list called `NODES_LIST` and add your V3 class to it.
3.  **Set `node_id`**: The `node_id` in `SchemaV3` **must** be the key from the old `NODE_CLASS_MAPPINGS`.
4.  **Set `display_name` (Conditionally)**:
    -   Check if a key existed in the old `NODE_DISPLAY_NAME_MAPPINGS`.
    -   **If yes**: Set `display_name` to that value.
    -   **If no**: **Omit** the `display_name` parameter from `SchemaV3` entirely.

**Example:**

**V1 Registration:**
```python
NODE_CLASS_MAPPINGS = {
    "APG": APG,
}
NODE_DISPLAY_NAME_MAPPINGS = {
    "APG": "Adaptive Projected Guidance",
}
```

**V3 `define_schema`:**
```python
@classmethod
def define_schema(cls):
    return io.SchemaV3(
        node_id="APG_V3", # From MAPPINGS key + "_V3"
        display_name="Adaptive Projected Guidance _V3", # From DISPLAY MAPPINGS value + " _V3"
        # ... other parameters
    )

NODES_LIST = [APG]  # ... at end of file
```

### Step 3: Converting I/O

| V1 Type (`string`) | V3 Class (`io.<Type>`) | Common `Input()` Options (as keyword arguments)                           |
|:-------------------|:-----------------------|:--------------------------------------------------------------------------|
| `STRING`           | `io.String`            | `default`, `multiline`, `dynamic_prompts`, `placeholder`                  |
| `INT`              | `io.Int`               | `default`, `min`, `max`, `step`, `display_mode`, `control_after_generate` |
| `FLOAT`            | `io.Float`             | `default`, `min`, `max`, `step`, `round`, `display_mode`                  |
| `BOOLEAN`          | `io.Boolean`           | `default`, `label_on`, `label_off`                                        |
| `COMBO`            | `io.Combo`             | `options`, `default`, `upload`, `image_folder`, `remote`                  |
| (custom)           | `io.MultiCombo`        | `options`, `default`, `placeholder`, `chip`                               |
| `IMAGE`            | `io.Image`             |                                                                           |
| `MASK`             | `io.Mask`              |                                                                           |
| `LATENT`           | `io.Latent`            |                                                                           |
| `CONDITIONING`     | `io.Conditioning`      |                                                                           |
| `CLIP`             | `io.Clip`              |                                                                           |
| `VAE`              | `io.Vae`               |                                                                           |
| `MODEL`            | `io.Model`             |                                                                           |
| `CONTROL_NET`      | `io.ControlNet`        |                                                                           |
| `SAMPLER`          | `io.Sampler`           |                                                                           |
| `SIGMAS`           | `io.Sigmas`            |                                                                           |
| `GUIDER`           | `io.Guider`            |                                                                           |
| `CLIP_VISION`      | `io.ClipVision`        |                                                                           |
| `UPSCALE_MODEL`    | `io.UpscaleModel`      |                                                                           |
| `AUDIO`            | `io.Audio`             |                                                                           |
| `VIDEO`            | `io.Video`             |                                                                           |
| `WEBCAM`           | `io.Webcam`            | `default`, `socketless`                                                   |
| `*`                | `io.AnyType`           | Used for inputs that can accept any type, like the PreviewAny node.       |

#### Advanced Input Types

**MultiType Input (accepts multiple types):**
```python
io.MultiType.Input("input", types=[io.Mask, io.Float, io.Int], optional=True)
```

**Combo with Remote Options:**
```python
io.Combo.Input(
    "lora_name",
    options=folder_paths.get_filename_list("loras"),
    tooltip="The name of the LoRA."
)
```

**Optional Parameters:**
```python
io.Boolean.Input(
    "case_sensitive",
    default=True,
    optional=True,  # Makes this input optional
    tooltip="Whether to use case-sensitive matching"
)
```


### Step 4: Migrating Logic

-   **Execution Method**: Rename your old `FUNCTION` to `execute` and make it a `@classmethod`.
-   **Return Value**: Wrap your return tuple in `io.NodeOutput()`. For UI updates, use the `ui` keyword argument: `io.NodeOutput(ui=ui.PreviewImage(image))`.
-   **State**: Replace `self.variable` with `cls.state.variable`.
-   **Hidden Inputs**: Replace `prompt` and `unique_id` parameters with `cls.hidden.prompt` and `cls.hidden.unique_id`. Request them in the schema with `hidden=[io.Hidden.prompt, io.Hidden.unique_id]`.
-   **Optional Methods**: `IS_CHANGED` becomes `fingerprint_inputs`, and `VALIDATE_INPUTS` becomes `validate_inputs`. Both should be `@classmethod`.

## Common Migration Patterns

### 1. Hidden Inputs

**V1:**
```python
"hidden": {
    "prompt": "PROMPT",
    "unique_id": "UNIQUE_ID"
}

def execute(self, ..., prompt=None, unique_id=None):
    ...  # Use hidden inputs
```

**V3:**
```python
hidden=[
    io.Hidden.prompt,
    io.Hidden.unique_id
]

@classmethod
def execute(cls, ...):
    # Access via **cls**
    prompt = cls.hidden.prompt
    unique_id = cls.hidden.unique_id
```

### 2. State Management

**V1:**
```python
def __init__(self):
    self.last_seed = None
    self.cache = {}

def execute(self, seed, ...):
    if seed != self.last_seed:
        self.cache.clear()
        self.last_seed = seed
```

**V3:**
```python
@classmethod
def execute(cls, seed, ...):
    if cls.state.last_seed != seed:
        cls.state.cache = {}
        cls.state.last_seed = seed
```

### 3. UI Output

**V1:**
```python
def execute(self, image):
    # Save preview manually
    preview = save_temp_image(image)
    return {"ui": {"images": preview}, "result": (image,)}
```

**V3:**
```python
@classmethod
def execute(cls, image):
    return io.NodeOutput(image, ui=ui.PreviewImage(image))
```

### 4. Dynamic Inputs

**V1:**
```python
@classmethod
def INPUT_TYPES(s):
    # Complex logic to generate dynamic inputs
    inputs = {"required": {}}
    for i in range(get_dynamic_count()):
        inputs["required"][f"input_{i}"] = ("IMAGE",)
    return inputs
```

**V3:**
```python
inputs=[
    io.AutoGrowDynamic.Input("images", 
        template_input=io.Image.Input("image"),
        min=1,
        max=10
    )
]
```

### 5. Resource Loading

**V1:**
```python
def execute(self, model_name):
    # Direct file loading
    model_path = folder_paths.get_full_path("checkpoints", model_name)
    model = comfy.utils.load_torch_file(model_path)
```

**V3:**
```python
from comfy_api.v3 import resources

@classmethod
def execute(cls, model_name):
    # Cached resource loading
    model = cls.resources.get(
        resources.TorchDictFolderFilename("checkpoints", model_name)
    )
```

## Making Nodes Async

### Basic Async Node

```python
class AsyncNodeV3(ComfyNodeV3):
    @classmethod
    async def execute(cls, image, url):
        # Network request without blocking
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                data = await response.json()
        
        # Process with the data
        result = process_image_with_data(image, data)
        return io.NodeOutput(result)
```

### Progress Tracking

```python
@classmethod
async def execute(cls, images, unique_id):
    from comfy.utils import ProgressBar
    
    batch_size = images.shape[0]
    pbar = ProgressBar(batch_size, node_id=unique_id)
    
    results = []
    for i in range(batch_size):
        # Async processing
        result = await process_single(images[i])
        results.append(result)
        pbar.update(1)
    
    return io.NodeOutput(torch.cat(results))
```

## Enabling Process Isolation

### 1. Create manifest.yaml

```yaml
name: my_custom_nodes
version: 1.0.0
description: My custom node collection
author: Your Name
dependencies:
  - numpy==1.26.4
  - scikit-image>=0.22.0
  - opencv-python
isolated: true
share_torch: true
```

### 2. Update __init__.py

```python
from pyisolate import ExtensionBase
from .nodes import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

class MyNodesExtension(ExtensionBase):
    def on_module_loaded(self, module):
        # Nodes are automatically registered
        pass
    
    async def get_node_mappings(self):
        return NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

# Extension entry point
def create_extension():
    return MyNodesExtension()
```

## Practical Migration Examples

### Complete String Node Conversion

This example shows a full conversion of the StringConcatenate node from v1 to v3:

**V1 Implementation:**
```python
class StringConcatenate():
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "string_a": (IO.STRING, {"multiline": True}),
                "string_b": (IO.STRING, {"multiline": True}),
                "delimiter": (IO.STRING, {"multiline": False, "default": ""})
            }
        }

    RETURN_TYPES = (IO.STRING,)
    FUNCTION = "execute"
    CATEGORY = "utils/string"

    def execute(self, string_a, string_b, delimiter, **kwargs):
        return delimiter.join((string_a, string_b)),
```

**V3 Implementation:**
```python
from comfy_api.v3 import io

class StringConcatenate(io.ComfyNodeV3):
    """Concatenates two strings with an optional delimiter between them."""
    
    @classmethod
    def define_schema(cls):
        return io.SchemaV3(
            node_id="StringConcatenate",
            display_name="String Concatenate",
            category="utils/string",
            description="Concatenates two strings together with an optional delimiter between them.",
            inputs=[
                io.String.Input(
                    "string_a",
                    display_name="String A",
                    multiline=True,
                    tooltip="The first string to concatenate"
                ),
                io.String.Input(
                    "string_b", 
                    display_name="String B",
                    multiline=True,
                    tooltip="The second string to concatenate"
                ),
                io.String.Input(
                    "delimiter",
                    display_name="Delimiter",
                    default="",
                    multiline=False,
                    tooltip="The delimiter to insert between the two strings (empty by default)"
                ),
            ],
            outputs=[
                io.String.Output(
                    "concatenated",
                    display_name="Concatenated String",
                    tooltip="The result of concatenating string_a and string_b with the delimiter"
                ),
            ],
        )
    
    @classmethod
    def execute(cls, string_a: str, string_b: str, delimiter: str) -> io.NodeOutput:
        """Concatenates two strings with an optional delimiter."""
        result = delimiter.join((string_a, string_b))
        return io.NodeOutput(result)
```

### Replacing V1 Nodes Strategy

When replacing v1 nodes with v3 implementations:

1. **Keep Original Node Names**: Don't add "V3" suffix to maintain compatibility
2. **Preserve All Parameters**: Keep same parameter names and defaults
3. **Maintain Return Structure**: v3 automatically generates v1-compatible returns
4. **Test Workflow Compatibility**: Ensure existing workflows continue to work

Example migration workflow:
```bash
# 1. Create new branch
git checkout -b v3-node-migration

# 2. Backup original
cp nodes_original.py nodes_original.py.bak

# 3. Replace with v3 version
cp nodes_v3.py nodes_original.py

# 4. Test with existing workflows
comfy-cli test-workflows ./test-workflows/
```

## Testing Your Migration

### 1. Backward Compatibility Test

```python
# Your v3 node should work with v1 calls
def test_v1_compatibility():
    node = MyNodeV3()
    inputs = node.INPUT_TYPES()
    assert "required" in inputs
    assert hasattr(node, "FUNCTION")
    assert hasattr(node, "RETURN_TYPES")
```

### 2. Async Execution Test

```python
import asyncio

async def test_async_execution():
    result = await MyAsyncNode.execute(image=test_image)
    assert result is not None
```

### 3. Isolation Test

```bash
# Test with conflicting dependencies
comfy-cli test-node --isolated my_custom_nodes
```

## Best Practices

1. **Keep nodes stateless** - Use `cls.state` for any mutable data
2. **Make I/O operations async** - Network, disk, database operations
3. **Use resource caching** - Via `cls.resources.get()`
4. **Declare all dependencies** - In manifest.yaml
5. **Test both sync and async** - Ensure compatibility
6. **Document type changes** - Help users update workflows

## Common Issues

### Issue: State not persisting
**Solution:** Use `cls.state` instead of instance variables

### Issue: Hidden inputs not working
**Solution:** Access via `cls.hidden.unique_id` not function parameters

### Issue: Async not executing
**Solution:** Ensure method is `async def` and use `await` for async calls

### Issue: Import errors in isolation
**Solution:** Add all dependencies to manifest.yaml

### Issue: Tensors not sharing
**Solution:** Enable `share_torch: true` in manifest.yaml
