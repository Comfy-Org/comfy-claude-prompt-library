# ComfyUI v3 Node Schema

The v3 schema represents a complete redesign of how nodes are defined in ComfyUI, moving from a dictionary-based system to an object-oriented, declarative approach with strong typing.

## Core Concepts

### 1. Single Schema Definition

Instead of multiple class attributes like `INPUT_TYPES`, `CATEGORY`, etc., v3 nodes define their entire structure within a single `@classmethod` called `define_schema()`. This method returns a `SchemaV3` object, making the node's definition self-contained and explicit.

```python
class MyNodeV3(io.ComfyNodeV3):
    @classmethod
    def define_schema(cls):
        return io.SchemaV3(
            node_id="MyNode_V3",
            display_name="My Node (V3)",
            category="my_category",
            description="Node description shown as tooltip.",
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

All inputs and outputs are defined as instances of classes from the `comfy_api.v3.io` module. This provides strong typing, better IDE support, and a richer set of configuration options directly in the definition.

```python
from comfy_api.v3 import io

# Basic types with configuration
io.Int.Input("my_int", default=42, min=0, max=100)
io.Float.Input("my_float", default=1.0, step=0.01, display_mode=io.NumberDisplay.slider)
io.String.Input("text", multiline=True, placeholder="Enter text...")
io.Boolean.Input("enable", default=True, label_on="Yes", label_off="No")
io.Combo.Input("mode", options=["a", "b", "c"])

# Core ComfyUI types
io.Image.Input("image", optional=True)
io.Model.Input("model", tooltip="The model to use")
io.Clip.Input("clip")
io.Vae.Input("vae")
io.Conditioning.Input("positive")
io.Latent.Input("latent")

# Outputs with unique IDs and display names
io.Image.Output(id="main_image", display_name="Output Image")
io.Mask.Output(id="alpha_mask", display_name="Alpha Mask")
```

### 3. Stateless Execution with Class Methods

Nodes are designed to be stateless. The execution logic is a `@classmethod` called `execute`. Instance-specific data is managed through dedicated context objects.

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

    # Return a structured output
    return io.NodeOutput(processed_image, ui=ui.PreviewImage(processed_image))
```

### 4. Advanced Features

#### Multi-Type Inputs
A single input socket can accept multiple, specified types.
```python
io.MultiType.Input("value", types=[io.Image, io.Mask, io.Latent])
```

#### Dynamic Inputs
The UI can dynamically add or remove input sockets based on a template.
```python
io.AutogrowDynamic.Input(
    id="images",
    template_input=io.Image.Input("image"),
    min=1,  # Require at least one image input
    max=8   # Allow up to 8 image inputs
)
```

#### Custom Types
Developers can define their own data types for use in inputs and outputs.
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

Nodes can return structured data for the frontend to render, such as image previews, text, or audio players, directly from the `execute` method.

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
            node_id="LoadImage",
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
