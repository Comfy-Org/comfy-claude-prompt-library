# ComfyUI v3 Node Schema

The v3 schema represents a complete redesign of how nodes are defined in ComfyUI, moving from a dictionary-based system to an object-oriented approach with strong typing.

## Core Concepts

### 1. Single Schema Definition

Instead of 7+ separate methods/properties, v3 nodes use a single `DEFINE_SCHEMA()` method:

```python
class MyNodeV3(ComfyNodeV3):
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="MyNode_v3",
            display_name="My Node (V3)",
            category="my_category",
            description="Node description shown as tooltip",
            inputs=[...],
            outputs=[...],
            hidden=[...],
            is_output_node=False,
            is_deprecated=False,
            is_experimental=False,
            is_api_node=False,
            not_idempotent=False
        )
```

### 2. Typed Input/Output System

All I/O types are now proper classes with type hints:

```python
from comfy_api.v3 import io

# Basic types
io.Int.Input("my_int", default=42, min=0, max=100)
io.Float.Input("my_float", default=1.0, step=0.01)
io.String.Input("text", multiline=True, placeholder="Enter text...")
io.Boolean.Input("enable", default=True, label_on="Yes", label_off="No")
io.Combo.Input("mode", options=["a", "b", "c"])

# ComfyUI types
io.Image.Input("image", optional=True)
io.Model.Input("model", tooltip="The model to use")
io.Clip.Input("clip")
io.Vae.Input("vae")
io.Conditioning.Input("positive")
io.Latent.Input("latent")

# Outputs
io.Image.Output("result", display_name="Output Image")
io.Int.Output("count")
```

### 3. Stateless Execution

Nodes are now stateless with class methods:

```python
@classmethod
def execute(cls, image: io.Image.Type, scale: float, **kwargs):
    # Access state via cls.state
    if cls.state.previous_scale != scale:
        cls.state.previous_scale = scale
        
    # Access resources via cls.resources
    model = cls.resources.get(TorchDictFolderFilename("models", "model.pt"))
    
    # Access hidden inputs via cls.hidden
    unique_id = cls.hidden.unique_id
    
    # Return using NodeOutput
    return io.NodeOutput(processed_image, ui=ui.PreviewImage(processed_image))
```

### 4. Advanced Features

#### Multi-Type Inputs
```python
io.MultiType.Input("value", types=[io.Image, io.Mask, io.Latent])
```

#### Dynamic Inputs
```python
io.AutoGrowDynamicInput("images", template_input=io.Image.Input("image"))
```

#### Custom Types
```python
@io.comfytype(io_type="MY_TYPE")
class MyCustomType:
    Type = MyDataClass
    class Input(io.InputV3):
        def __init__(self, id, special_param=None, **kwargs):
            super().__init__(id, **kwargs)
            self.special_param = special_param
```

### 5. State Management

Each node instance has access to:

- `cls.state` - Persistent state storage
- `cls.resources` - Resource loading with caching
- `cls.hidden` - Access to hidden inputs (unique_id, prompt, etc.)

### 6. UI Output System

Structured UI outputs for frontend:

```python
from comfy_api.v3 import ui

# Preview images
ui.PreviewImage(image_tensor)

# Preview with metadata
ui.PreviewImage(image_tensor, animated=True)

# Audio preview
ui.PreviewAudio(audio_files)

# Text output
ui.PreviewText("Processing complete!")

# 3D preview
ui.PreviewUI3D(mesh_files)
```

## Benefits

1. **Better IDE Support** - Full autocomplete and type checking
2. **Self-Documenting** - All metadata in one place
3. **Cleaner Code** - No more dictionary magic
4. **Future-Proof** - Ready for process isolation
5. **Backward Compatible** - Automatic v1 interface generation

## Migration Example

### V1 Node
```python
class LoadImage:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "image": (folder_paths.get_filename_list("input"),),
                "channel": (["RGB", "RGBA"],),
            }
        }
    
    RETURN_TYPES = ("IMAGE", "MASK")
    RETURN_NAMES = ("IMAGE", "MASK")
    FUNCTION = "load_image"
    CATEGORY = "image"
    
    def load_image(self, image, channel):
        # implementation
        return (img, mask)
```

### V3 Equivalent
```python
class LoadImageV3(ComfyNodeV3):
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="LoadImage_v3",
            display_name="Load Image",
            category="image",
            inputs=[
                io.Combo.Input("image", 
                    options=folder_paths.get_filename_list("input"),
                    tooltip="Select image to load"
                ),
                io.Combo.Input("channel", 
                    options=["RGB", "RGBA"],
                    default="RGB"
                )
            ],
            outputs=[
                io.Image.Output("image"),
                io.Mask.Output("mask")
            ]
        )
    
    @classmethod
    def execute(cls, image: str, channel: str):
        # implementation
        return io.NodeOutput(img, mask)
```

## Implementation Status

- Schema definition system: ✅ Complete
- Type system with all ComfyUI types: ✅ Complete
- Backward compatibility layer: ✅ Complete
- State/resource management: ✅ Complete
- UI output system: ✅ Complete
- Dynamic inputs: 🚧 In progress
- Full node conversion: 🔄 Ongoing