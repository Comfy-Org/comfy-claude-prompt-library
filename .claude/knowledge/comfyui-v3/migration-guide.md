# ComfyUI v3 Migration Guide

This guide helps developers migrate existing v1 nodes to the new v3 schema and take advantage of async execution and process isolation.

## Quick Start

### Minimal v3 Node

```python
from comfy_api.v3 import io, ComfyNodeV3, SchemaV3

class MinimalNodeV3(ComfyNodeV3):
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="MinimalNode",
            display_name="Minimal Node",
            category="examples",
            inputs=[
                io.Image.Input("image"),
                io.Float.Input("strength", default=1.0, min=0.0, max=1.0)
            ],
            outputs=[
                io.Image.Output("result")
            ]
        )
    
    @classmethod
    def execute(cls, image, strength):
        # Process image
        result = image * strength
        return io.NodeOutput(result)
```

## Step-by-Step Migration

### Step 1: Convert INPUT_TYPES

**V1:**
```python
@classmethod
def INPUT_TYPES(s):
    return {
        "required": {
            "image": ("IMAGE",),
            "model": ("MODEL",),
            "steps": ("INT", {"default": 20, "min": 1, "max": 10000}),
            "cfg": ("FLOAT", {"default": 8.0, "min": 0.0, "max": 100.0, "step": 0.1}),
            "sampler_name": (comfy.samplers.KSampler.SAMPLERS,),
        },
        "optional": {
            "mask": ("MASK",),
        }
    }
```

**V3:**
```python
inputs=[
    io.Image.Input("image"),
    io.Model.Input("model"),
    io.Int.Input("steps", default=20, min=1, max=10000),
    io.Float.Input("cfg", default=8.0, min=0.0, max=100.0, step=0.1),
    io.Combo.Input("sampler_name", options=comfy.samplers.KSampler.SAMPLERS),
    io.Mask.Input("mask", optional=True),
]
```

### Step 2: Convert RETURN_TYPES

**V1:**
```python
RETURN_TYPES = ("IMAGE", "LATENT")
RETURN_NAMES = ("images", "latents")
OUTPUT_TOOLTIPS = ("Generated images", "Latent representation")
```

**V3:**
```python
outputs=[
    io.Image.Output("images", tooltip="Generated images"),
    io.Latent.Output("latents", tooltip="Latent representation")
]
```

### Step 3: Convert Metadata

**V1:**
```python
FUNCTION = "sample"
CATEGORY = "sampling"
OUTPUT_NODE = True
DEPRECATED = False
EXPERIMENTAL = True
```

**V3:**
```python
return SchemaV3(
    node_id="KSampler",
    category="sampling",
    is_output_node=True,
    is_deprecated=False,
    is_experimental=True,
    # FUNCTION is always "execute" in v3
)
```

### Step 4: Convert Execute Method

**V1:**
```python
def sample(self, model, image, steps, cfg, sampler_name, mask=None):
    # Instance method with self
    if hasattr(self, 'device'):
        device = self.device
    else:
        device = model_management.get_torch_device()
    
    # Process...
    return (images, latent)
```

**V3:**
```python
@classmethod
def execute(cls, model, image, steps, cfg, sampler_name, mask=None):
    # Class method with cls
    # Use state for instance variables
    if cls.state.device is None:
        cls.state.device = model_management.get_torch_device()
    
    # Process...
    return io.NodeOutput(images, latent)
```

## Common Migration Patterns

### 1. Hidden Inputs

**V1:**
```python
"hidden": {
    "prompt": "PROMPT",
    "unique_id": "UNIQUE_ID"
}

def execute(self, ..., prompt=None, unique_id=None):
    # Use hidden inputs
```

**V3:**
```python
hidden=[
    io.Hidden.prompt,
    io.Hidden.unique_id
]

@classmethod
def execute(cls, ...):
    # Access via cls.hidden
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
    io.AutoGrowDynamicInput("images", 
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
    def DEFINE_SCHEMA(cls):
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

### Module-Level Registration

When creating a standalone v3 node module (not using pyisolate), register nodes at the module level:

```python
# nodes_string.py
import re
from comfy_api.v3 import io

class StringConcatenate(io.ComfyNodeV3):
    # ... node implementation ...

class StringReplace(io.ComfyNodeV3):
    # ... node implementation ...

class RegexMatch(io.ComfyNodeV3):
    # ... node implementation ...

# CRITICAL: Module-level registration for v3 nodes
NODE_CLASS_MAPPINGS = {
    "StringConcatenate": StringConcatenate,
    "StringReplace": StringReplace,
    "RegexMatch": RegexMatch,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "StringConcatenate": "Concatenate",
    "StringReplace": "Replace",
    "RegexMatch": "Regex Match",
}
```

### Complete Type Mapping Reference

| V1 Type | V3 Input Type | V3 Output Type | Notes |
|---------|---------------|----------------|--------|
| ("STRING",) | io.String.Input() | io.String.Output() | Supports multiline parameter |
| ("INT",) | io.Int.Input() | io.Int.Output() | Supports min, max, default |
| ("FLOAT",) | io.Float.Input() | io.Float.Output() | Supports min, max, step, default |
| ("BOOLEAN",) | io.Boolean.Input() | io.Boolean.Output() | Supports default |
| (["opt1", "opt2"],) | io.Combo.Input(options=[...]) | - | For dropdown selections |
| ("IMAGE",) | io.Image.Input() | io.Image.Output() | |
| ("MASK",) | io.Mask.Input() | io.Mask.Output() | |
| ("MODEL",) | io.Model.Input() | io.Model.Output() | |
| ("CLIP",) | io.Clip.Input() | io.Clip.Output() | |
| ("VAE",) | io.Vae.Input() | io.Vae.Output() | |
| ("CONDITIONING",) | io.Conditioning.Input() | io.Conditioning.Output() | |
| ("LATENT",) | io.Latent.Input() | io.Latent.Output() | |
| Multiple types | io.MultiType.Input(types=[...]) | - | Accept multiple input types |

### Advanced Input Types

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