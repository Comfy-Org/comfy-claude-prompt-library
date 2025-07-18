# ComfyUI v3 API Reference

Complete reference for the ComfyUI v3 node API, including all types, methods, and decorators.

## Core Classes

### ComfyNodeV3

Base class for all v3 nodes.

```python
from comfy_api.v3 import ComfyNodeV3

class ComfyNodeV3:
    # Class properties set during execution
    state: NodeState          # Persistent state storage
    resources: Resources      # Resource loader with caching
    hidden: HiddenHolder      # Access to hidden inputs

    @classmethod
    @abstractmethod
    def define_schema(cls) -> SchemaV3:
        """Define node schema. Must be overridden."""
        pass

    @classmethod
    @abstractmethod
    def execute(cls, **kwargs) -> NodeOutput:
        """Execute node logic. Can be async."""
        pass

    @classmethod
    def validate_inputs(cls, **kwargs) -> bool:
        """Optional: Validate inputs before execution."""
        pass

    @classmethod
    def fingerprint_inputs(cls, **kwargs) -> Any:
        """Optional: Generate a fingerprint for caching."""
        pass

    @classmethod
    def GET_SERIALIZERS(cls) -> list[Serializer]:
        """Optional: Define custom serializers."""
        return []
```

### SchemaV3

Node definition schema.

```python
@dataclass
class SchemaV3:
    node_id: str                    # Globally unique ID
    display_name: str = None        # UI display name
    category: str = "sd"            # Node category
    inputs: list[InputV3] = None    # Input definitions
    outputs: list[OutputV3] = None  # Output definitions
    hidden: list[Hidden] = None     # Hidden inputs
    description: str = ""           # Tooltip description
    is_input_list: bool = False     # Handle list inputs
    is_output_node: bool = False    # Force execution
    is_deprecated: bool = False     # Mark as deprecated
    is_experimental: bool = False   # Mark as experimental
    is_api_node: bool = False       # API node flag
    not_idempotent: bool = False    # Disable caching
```

### NodeOutput

Structured return value from `execute`.

```python
class NodeOutput:
    def __init__(
        self,
        *args: Any,                    # Output values
        ui: UIOutput | dict = None,    # UI elements
        expand: dict = None,           # Subgraph expansion
        block_execution: str = None    # Execution blocker
    ):
        pass
```

## Input Types

### Basic Inputs

```python
# Integer input
io.Int.Input(
    id: str,
    display_name: str = None,
    optional: bool = False,
    tooltip: str = None,
    lazy: bool = None,
    default: int = None,
    min: int = None,
    max: int = None,
    step: int = None,
    control_after_generate: bool = None,
    display_mode: NumberDisplay = None,
    socketless: bool = None,
    force_input: bool = None
)

# Float input
io.Float.Input(
    id: str,
    display_name: str = None,
    optional: bool = False,
    tooltip: str = None,
    lazy: bool = None,
    default: float = None,
    min: float = None,
    max: float = None,
    step: float = None,
    round: float = None,
    display_mode: NumberDisplay = None,
    socketless: bool = None,
    force_input: bool = None
)

# String input
io.String.Input(
    id: str,
    display_name: str = None,
    optional: bool = False,
    tooltip: str = None,
    lazy: bool = None,
    multiline: bool = False,
    placeholder: str = None,
    default: str = None,
    dynamic_prompts: bool = None,
    socketless: bool = None,
    force_input: bool = None
)

# Boolean input
io.Boolean.Input(
    id: str,
    display_name: str = None,
    optional: bool = False,
    tooltip: str = None,
    lazy: bool = None,
    default: bool = None,
    label_on: str = None,
    label_off: str = None,
    socketless: bool = None,
    force_input: bool = None
)

# Combo (dropdown) input
io.Combo.Input(
    id: str,
    options: list[str] = None,
    display_name: str = None,
    optional: bool = False,
    tooltip: str = None,
    lazy: bool = None,
    default: str = None,
    control_after_generate: bool = None,
    upload: UploadType = None,
    image_folder: FolderType = None,
    remote: RemoteOptions = None,
    socketless: bool = None
)

# Multi-select combo
io.MultiCombo.Input(
    id: str,
    options: list[str],
    display_name: str = None,
    optional: bool = False,
    tooltip: str = None,
    lazy: bool = None,
    default: list[str] = None,
    placeholder: str = None,
    chip: bool = None,
    control_after_generate: bool = None,
    socketless: bool = None
)
```

### ComfyUI Types

```python
# Core types
io.Image.Input(id, ...)        # Type: torch.Tensor [B,H,W,C]
io.Mask.Input(id, ...)         # Type: torch.Tensor [H,W] or [B,H,W]
io.Latent.Input(id, ...)       # Type: dict with 'samples' tensor
io.Conditioning.Input(id, ...)  # Type: list[tuple[tensor, dict]]
io.Model.Input(id, ...)        # Type: ModelPatcher
io.Clip.Input(id, ...)         # Type: CLIP
io.Vae.Input(id, ...)          # Type: VAE
io.ControlNet.Input(id, ...)   # Type: ControlNet

# Sampling types
io.Sampler.Input(id, ...)      # Type: Sampler
io.Sigmas.Input(id, ...)       # Type: torch.Tensor
io.Noise.Input(id, ...)        # Type: torch.Tensor
io.Guider.Input(id, ...)       # Type: CFGGuider

# Additional types
io.ClipVision.Input(id, ...)         # Type: ClipVisionModel
io.ClipVisionOutput.Input(id, ...)   # Type: ClipVisionOutput
io.StyleModel.Input(id, ...)         # Type: StyleModel
io.Gligen.Input(id, ...)             # Type: ModelPatcher
io.UpscaleModel.Input(id, ...)       # Type: ImageModelDescriptor
io.Audio.Input(id, ...)              # Type: dict with 'waveform' and 'sample_rate'
io.Video.Input(id, ...)              # Type: VideoInput
io.Webcam.Input(id, ...)             # Type: str (filepath)
io.WanCameraEmbedding.Input(id, ...) # Type: torch.Tensor
io.LoraModel.Input(id, ...)          # Type: dict[str, Tensor]
io.Hooks.Input(id, ...)              # Type: HookGroup
io.HookKeyframes.Input(id, ...)      # Type: HookKeyframeGroup
io.SVG.Input(id, ...)                # Type: SVG (custom class)
io.Voxel.Input(id, ...)              # Type: Voxel data (custom class)
io.Mesh.Input(id, ...)               # Type: Mesh data (custom class)
```

### Advanced Inputs

```python
# Multi-type input (accepts multiple types)
io.MultiType.Input(
    id: str | InputV3,  # Can override from existing input
    types: list[type[ComfyType]],
    display_name: str = None,
    optional: bool = False,
    tooltip: str = None,
    lazy: bool = None
)

# Dynamic growing input
io.AutogrowDynamic.Input(
    id: str,
    template_input: InputV3,  # Template for each new input
    min: int = 1,             # Minimum inputs
    max: int = None           # Maximum inputs
)

# Custom type
@io.comfytype(io_type="MY_CUSTOM")
class MyCustom:
    Type = MyDataClass
    class Input(io.InputV3):
        ...
    class Output(io.OutputV3):
        ...
```

## Output Types

```python
# Basic output
io.Image.Output(
    id: str = None,
    display_name: str = None,
    tooltip: str = None,
    is_output_list: bool = False  # Output is list
)

# All ComfyUI types have corresponding outputs
io.Mask.Output(id, ...)
io.Latent.Output(id, ...)
io.Model.Output(id, ...)
io.Clip.Output(id, ...)
io.Vae.Output(id, ...)
io.Conditioning.Output(id, ...)
io.String.Output(id, ...)
io.Int.Output(id, ...)
io.Float.Output(id, ...)
io.Boolean.Output(id, ...)
# ... etc
```

## Hidden Inputs

```python
from comfy_api.v3 import Hidden

# Available hidden inputs
Hidden.unique_id            # Node's unique ID
Hidden.prompt              # Complete prompt
Hidden.extra_pnginfo       # PNG metadata dict
Hidden.dynprompt           # Dynamic prompt object
Hidden.auth_token_comfy_org # ComfyOrg auth token
Hidden.api_key_comfy_org   # ComfyOrg API key

# Usage in schema
hidden=[
    Hidden.unique_id,
    Hidden.prompt
]

# Access in execute
unique_id = cls.hidden.unique_id
prompt = cls.hidden.prompt
```

## State Management

```python
# NodeState interface
class NodeState:
    def get_value(self, key: str) -> Any
    def set_value(self, key: str, value: Any)
    def pop(self, key: str) -> Any
    def __contains__(self, key: str) -> bool

    # Attribute access
    cls.state.my_value = 42
    value = cls.state.my_value

    # Dictionary access
    cls.state["key"] = "value"
    value = cls.state["key"]
```

## Practical Input/Output Examples

### Enhanced Documentation with Tooltips and Display Names

```python
# String input with full documentation
io.String.Input(
    "prompt",
    display_name="Text Prompt",
    multiline=True,
    default="A beautiful landscape",
    tooltip="Enter the text description for image generation",
    placeholder="Type your prompt here..."
)

# Integer with constraints and UI hints
io.Int.Input(
    "steps",
    display_name="Sampling Steps",
    default=20,
    min=1,
    max=150,
    tooltip="Number of denoising steps. Higher values take longer but may produce better results",
    display_mode=io.NumberDisplay.slider
)

# Combo with dynamic options
io.Combo.Input(
    "checkpoint",
    options=folder_paths.get_filename_list("checkpoints"),
    display_name="Model Checkpoint",
    tooltip="Select the AI model to use for generation"
)

# Output with documentation
io.Image.Output(
    "generated_image",
    display_name="Generated Image",
    tooltip="The final generated image based on your prompt"
)

# Combo with dynamic options and file upload
io.Combo.Input(
    "audio_file",
    options=sorted(folder_paths.filter_files_content_types(os.listdir(folder_paths.get_input_directory()), ["audio", "video"])),
    display_name="Audio File",
    tooltip="Select an audio file or upload a new one",
    upload=io.UploadType.audio
)
```

### Return Pattern with NodeOutput

```python
@classmethod
def execute(cls, text: str, count: int) -> io.NodeOutput:
    # Single output
    result = process_text(text, count)
    return io.NodeOutput(result)

    # Multiple outputs
    image, mask = generate_image_and_mask(text)
    return io.NodeOutput(image, mask)

    # With UI preview
    image = generate_image(text)
    return io.NodeOutput(image, ui=ui.PreviewImage(image))

    # With multiple UI elements
    images = batch_generate(text, count)
    previews = [ui.PreviewImage(img) for img in images]
    return io.NodeOutput(images, ui={"images": previews})
```

## Resource Management

```python
# Load cached resources
from comfy_api.v3 import resources

# Load torch file
model = cls.resources.get(
    resources.TorchDictFolderFilename(
        folder_name="checkpoints",  # Folder category
        file_name="model.safetensors"
    )
)

# With default value
model = cls.resources.get(key, default=None)

# Custom resource types (future)
class MyResourceKey(ResourceKey):
    Type = MyResourceType
    def __init__(self, ...):
        pass
```

## UI Output Classes

```python
from comfy_api.v3 import ui

# Image preview
ui.PreviewImage(
    image: torch.Tensor,
    animated: bool = False
)

# Mask preview
ui.PreviewMask(
    mask: torch.Tensor,
    animated: bool = False
)

# Audio preview
ui.PreviewAudio(
    values: list[SavedResult | dict]
)

# Text output
ui.PreviewText(
    value: str
)

# 3D preview
ui.PreviewUI3D(
    values: list[SavedResult | dict]
)
```

## Decorators and Helpers

```python
# Create custom ComfyType
@io.comfytype(io_type="CUSTOM_TYPE")
class CustomType:
    Type = CustomClass
    class Input(io.InputV3):
        ...
    class Output(io.OutputV3):
        ...

# Custom serializer
class MySerializer(Serializer, io_type="MY_TYPE"):
    @classmethod
    def serialize(cls, obj: Any) -> str:
        return json.dumps(obj)
    
    @classmethod
    def deserialize(cls, s: str) -> Any:
        return json.loads(s)
```

## Async Support

```python
# Async execute
class AsyncNode(ComfyNodeV3):
    @classmethod
    async def execute(cls, **kwargs):
        result = await async_operation()
        return io.NodeOutput(result)

# Async validation
@classmethod
async def VALIDATE_INPUTS(cls, **kwargs):
    is_valid = await check_validity()
    return True if is_valid else "Error message"

# Async lazy check
async def check_lazy_status(cls, **kwargs):
    needed = await determine_needed_inputs()
    return needed  # List of input names
```

## Complete Example

```python
from comfy_api.v3 import io, ui, resources, ComfyNodeV3, SchemaV3
import torch

class AdvancedNodeV3(ComfyNodeV3):
    @classmethod
    def define_schema(cls):
        return SchemaV3(
            node_id="AdvancedNode",
            display_name="Advanced Node",
            category="examples/advanced",
            description="Demonstrates v3 features",
            inputs=[
                # Basic inputs
                io.Image.Input("image", tooltip="Input image"),
                io.Model.Input("model", tooltip="Model to use"),
                
                # Configured inputs
                io.Float.Input("strength", 
                    default=0.75,
                    min=0.0,
                    max=1.0,
                    step=0.05,
                    display_mode=io.NumberDisplay.slider
                ),
                
                # Multi-type
                io.MultiType.Input("flexible",
                    types=[io.Image, io.Mask, io.Latent],
                    optional=True
                ),
                
                # Dynamic
                io.AutoGrowDynamic.Input("extra_images",
                    template_input=io.Image.Input("img"),
                    min=0,
                    max=5
                )
            ],
            outputs=[
                io.Image.Output("result", tooltip="Processed image"),
                io.Latent.Output("latent", is_output_list=True)
            ],
            hidden=[
                io.Hidden.unique_id,
                io.Hidden.prompt
            ],
            is_output_node=True,
            is_experimental=True
        )
    
    @classmethod
    async def execute(cls, image, model, strength, flexible=None, **kwargs):
        # Access state
        if cls.state.last_model != model:
            cls.state.cache = {}
            cls.state.last_model = model
        
        # Load resources
        weights = cls.resources.get(
            resources.TorchDictFolderFilename("loras", "style.safetensors"),
            default=None
        )
        
        # Access hidden
        node_id = cls.hidden.unique_id
        
        # Process async
        result = await process_with_model(image, model, strength)
        
        # Handle dynamic inputs
        extra_images = [v for k, v in kwargs.items() if k.startswith("extra_")]
        
        # Return with UI
        return io.NodeOutput(
            result, 
            [latent],
            ui=ui.PreviewImage(result)
        )
    
    @classmethod
    async def fingerprint_inputs(cls, strength, **kwargs):
        if strength < 0.1:
            return "Strength too low for good results"
        return True
```

## Type Reference

### Type Mappings

| v3 Type | Python Type | Shape/Format |
|---------|------------|--------------|
| `io.Image.Type` | `torch.Tensor` | `[B,H,W,C]` float32 0-1 |
| `io.Mask.Type` | `torch.Tensor` | `[H,W]` or `[B,H,W]` float32 |
| `io.Latent.Type` | `dict` | `{"samples": tensor, ...}` |
| `io.Conditioning.Type` | `list` | `[(tensor, dict), ...]` |
| `io.Audio.Type` | `dict` | `{"waveform": tensor, "sample_rate": int}` |
| `io.Int.Type` | `int` | Python integer |
| `io.Float.Type` | `float` | Python float |
| `io.String.Type` | `str` | Python string |
| `io.Boolean.Type` | `bool` | Python boolean |

### Enum Types

```python
# Number display modes
io.NumberDisplay.number  # Standard input
io.NumberDisplay.slider  # Slider widget
io.NumberDisplay.color   # Color picker widget

# Folder types
io.FolderType.input   # Input folder
io.FolderType.output  # Output folder
io.FolderType.temp    # Temp folder

# Upload types
io.UploadType.image
io.UploadType.audio
io.UploadType.video
io.UploadType.model
```
