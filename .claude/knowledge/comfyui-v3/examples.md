# ComfyUI v3 Node Examples

Real-world examples of v3 nodes demonstrating various features and patterns.

## Basic Examples

### Simple Image Processor

```python
from comfy_api.v3 import io, ui, ComfyNodeV3, SchemaV3
import torch

class ImageInvertV3(ComfyNodeV3):
    """Simple node that inverts image colors."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="ImageInvert_v3",
            display_name="Invert Image",
            category="image/filters",
            description="Inverts the colors of an image",
            inputs=[
                io.Image.Input("image", tooltip="Image to invert")
            ],
            outputs=[
                io.Image.Output("inverted", tooltip="Inverted image")
            ]
        )
    
    @classmethod
    def execute(cls, image):
        # Invert: 1.0 - image
        inverted = 1.0 - image
        return io.NodeOutput(inverted, ui=ui.PreviewImage(inverted))
```

### Math Operations

```python
class MathOperationV3(ComfyNodeV3):
    """Performs math operations on two values."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="MathOperation_v3",
            display_name="Math Operation",
            category="utils/math",
            inputs=[
                io.Float.Input("a", default=0.0),
                io.Float.Input("b", default=0.0),
                io.Combo.Input("operation", 
                    options=["add", "subtract", "multiply", "divide", "power"],
                    default="add"
                )
            ],
            outputs=[
                io.Float.Output("result")
            ]
        )
    
    @classmethod
    def execute(cls, a, b, operation):
        operations = {
            "add": a + b,
            "subtract": a - b,
            "multiply": a * b,
            "divide": a / b if b != 0 else 0,
            "power": a ** b
        }
        result = operations[operation]
        return io.NodeOutput(result)
```

## Async Examples

### API Integration

```python
import aiohttp
import json

class TextGeneratorV3(ComfyNodeV3):
    """Generates text using external API."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="TextGenerator_v3",
            display_name="AI Text Generator",
            category="text/generation",
            inputs=[
                io.String.Input("prompt", multiline=True),
                io.String.Input("api_url", default="http://localhost:11434/api/generate"),
                io.String.Input("model", default="llama2"),
                io.Float.Input("temperature", default=0.7, min=0.0, max=2.0)
            ],
            outputs=[
                io.String.Output("generated_text")
            ]
        )
    
    @classmethod
    async def execute(cls, prompt, api_url, model, temperature):
        async with aiohttp.ClientSession() as session:
            payload = {
                "model": model,
                "prompt": prompt,
                "temperature": temperature,
                "stream": False
            }
            
            async with session.post(api_url, json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    text = data.get("response", "")
                    return io.NodeOutput(text)
                else:
                    raise RuntimeError(f"API error: {response.status}")
```

### Batch Processing with Progress

```python
from comfy.utils import ProgressBar
import asyncio

class BatchImageProcessorV3(ComfyNodeV3):
    """Processes images in batch with progress tracking."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="BatchImageProcessor_v3",
            display_name="Batch Image Processor",
            category="image/batch",
            inputs=[
                io.Image.Input("images"),
                io.Float.Input("process_time", default=0.1, min=0.01, max=1.0,
                    tooltip="Simulated processing time per image")
            ],
            outputs=[
                io.Image.Output("processed")
            ],
            hidden=[io.Hidden.unique_id]
        )
    
    @classmethod
    async def execute(cls, images, process_time, **kwargs):
        batch_size = images.shape[0]
        pbar = ProgressBar(batch_size, node_id=cls.hidden.unique_id)
        
        processed = []
        for i in range(batch_size):
            # Simulate async processing
            await asyncio.sleep(process_time)
            
            # Example: Apply blur
            import torch.nn.functional as F
            blurred = F.gaussian_blur(images[i:i+1], kernel_size=5)
            processed.append(blurred)
            
            pbar.update(1)
        
        result = torch.cat(processed, dim=0)
        return io.NodeOutput(result, ui=ui.PreviewImage(result))
```

## Advanced Examples

### Model Loader with Resources

```python
import folder_paths
import comfy.utils
import comfy.sd

class CheckpointLoaderV3(ComfyNodeV3):
    """Loads checkpoint models with caching."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="CheckpointLoader_v3",
            display_name="Load Checkpoint",
            category="loaders",
            inputs=[
                io.Combo.Input("ckpt_name",
                    options=folder_paths.get_filename_list("checkpoints"),
                    tooltip="Select checkpoint to load"
                )
            ],
            outputs=[
                io.Model.Output("model"),
                io.Clip.Output("clip"),
                io.Vae.Output("vae")
            ]
        )
    
    @classmethod
    def execute(cls, ckpt_name):
        # Use resource caching
        ckpt = cls.resources.get(
            resources.TorchDictFolderFilename("checkpoints", ckpt_name)
        )
        
        # Load components
        model, clip, vae = comfy.sd.load_checkpoint_guess_config(
            ckpt, 
            embedding_directory=folder_paths.get_folder_paths("embeddings")
        )
        
        return io.NodeOutput(model, clip, vae)
```

### State Management Example

```python
class IterativeRefinerV3(ComfyNodeV3):
    """Refines images iteratively with state tracking."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="IterativeRefiner_v3",
            display_name="Iterative Refiner",
            category="image/processing",
            inputs=[
                io.Image.Input("image"),
                io.Int.Input("iterations", default=3, min=1, max=10),
                io.Boolean.Input("reset", default=False,
                    tooltip="Reset refinement history")
            ],
            outputs=[
                io.Image.Output("refined"),
                io.Int.Output("total_iterations")
            ]
        )
    
    @classmethod
    def execute(cls, image, iterations, reset):
        # Initialize or reset state
        if reset or cls.state.history is None:
            cls.state.history = []
            cls.state.total_iterations = 0
        
        # Get last refined image or use input
        current = cls.state.history[-1] if cls.state.history else image
        
        # Iterative refinement
        for i in range(iterations):
            # Example: Progressive sharpening
            import torch.nn.functional as F
            kernel = torch.tensor([[-1,-1,-1],
                                   [-1, 9,-1],
                                   [-1,-1,-1]], dtype=torch.float32)
            kernel = kernel.view(1, 1, 3, 3)
            kernel = kernel.repeat(current.shape[-1], 1, 1, 1)
            
            current = current.permute(0, 3, 1, 2)
            sharpened = F.conv2d(current, kernel, padding=1, groups=current.shape[1])
            current = sharpened.permute(0, 2, 3, 1)
            current = torch.clamp(current, 0, 1)
        
        # Update state
        cls.state.history.append(current)
        cls.state.total_iterations += iterations
        
        # Keep history size manageable
        if len(cls.state.history) > 10:
            cls.state.history.pop(0)
        
        return io.NodeOutput(
            current, 
            cls.state.total_iterations,
            ui=ui.PreviewImage(current)
        )
```

### Dynamic Inputs Example

```python
class ImageBlenderV3(ComfyNodeV3):
    """Blends multiple images with weights."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="ImageBlender_v3",
            display_name="Image Blender",
            category="image/blend",
            inputs=[
                io.AutoGrowDynamicInput("images",
                    template_input=io.Image.Input("image"),
                    min=2,
                    max=8
                ),
                io.Combo.Input("mode", 
                    options=["average", "weighted", "max", "min"],
                    default="average"
                )
            ],
            outputs=[
                io.Image.Output("blended")
            ]
        )
    
    @classmethod
    def execute(cls, mode, **kwargs):
        # Collect all image inputs
        images = []
        for key, value in sorted(kwargs.items()):
            if key.startswith("image"):
                images.append(value)
        
        if not images:
            raise ValueError("No images provided")
        
        # Stack images
        stacked = torch.stack(images, dim=0)
        
        # Blend based on mode
        if mode == "average":
            blended = torch.mean(stacked, dim=0)
        elif mode == "weighted":
            # Simple linear weighting
            weights = torch.linspace(1, 0.1, len(images))
            weights = weights / weights.sum()
            weights = weights.view(-1, 1, 1, 1, 1)
            blended = (stacked * weights).sum(dim=0)
        elif mode == "max":
            blended = torch.max(stacked, dim=0)[0]
        elif mode == "min":
            blended = torch.min(stacked, dim=0)[0]
        
        return io.NodeOutput(blended, ui=ui.PreviewImage(blended))
```

### Multi-Type Input Example

```python
class UniversalInverterV3(ComfyNodeV3):
    """Inverts images, masks, or conditioning."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="UniversalInverter_v3",
            display_name="Universal Inverter",
            category="utils/invert",
            inputs=[
                io.MultiType.Input("input",
                    types=[io.Image, io.Mask, io.Conditioning]
                ),
                io.Float.Input("strength", default=1.0, min=0.0, max=1.0)
            ],
            outputs=[
                io.MultiType.Output("inverted",
                    types=[io.Image, io.Mask, io.Conditioning]
                )
            ]
        )
    
    @classmethod
    def execute(cls, input, strength):
        # Detect input type and process accordingly
        if isinstance(input, torch.Tensor):
            # Image or Mask
            if input.dim() == 4:  # Image [B,H,W,C]
                inverted = 1.0 - input
                inverted = input + (inverted - input) * strength
                return io.NodeOutput(inverted, ui=ui.PreviewImage(inverted))
            else:  # Mask [H,W] or [B,H,W]
                inverted = 1.0 - input
                inverted = input + (inverted - input) * strength
                return io.NodeOutput(inverted, ui=ui.PreviewMask(inverted))
        
        elif isinstance(input, list):  # Conditioning
            # Invert conditioning strength
            inverted = []
            for cond, data in input:
                new_data = data.copy()
                if 'strength' in new_data:
                    new_data['strength'] = 1.0 - new_data['strength']
                inverted.append((cond, new_data))
            return io.NodeOutput(inverted)
        
        else:
            raise ValueError(f"Unsupported input type: {type(input)}")
```

## Process Isolation Example

### Node with Specific Dependencies

```python
# manifest.yaml
"""
name: scientific_processor
version: 1.0.0
dependencies:
  - numpy==1.24.0  # Specific older version needed
  - scipy==1.10.0
  - scikit-image==0.20.0
isolated: true
share_torch: true
"""

# __init__.py
from comfy_api.v3 import io, ComfyNodeV3, SchemaV3
import numpy as np
from scipy import signal
from skimage import filters

class ScientificProcessorV3(ComfyNodeV3):
    """Image processing with scientific libraries."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="ScientificProcessor_v3",
            display_name="Scientific Processor",
            category="image/scientific",
            inputs=[
                io.Image.Input("image"),
                io.Combo.Input("filter_type",
                    options=["gaussian", "sobel", "laplacian", "butterworth"],
                    default="gaussian"
                ),
                io.Float.Input("sigma", default=1.0, min=0.1, max=10.0)
            ],
            outputs=[
                io.Image.Output("filtered")
            ]
        )
    
    @classmethod
    def execute(cls, image, filter_type, sigma):
        # Convert to numpy
        img_np = image.cpu().numpy()
        batch_size = img_np.shape[0]
        
        results = []
        for i in range(batch_size):
            img = img_np[i]
            
            if filter_type == "gaussian":
                filtered = filters.gaussian(img, sigma=sigma, channel_axis=-1)
            elif filter_type == "sobel":
                gray = np.mean(img, axis=-1)
                filtered = filters.sobel(gray)
                filtered = np.stack([filtered]*3, axis=-1)
            elif filter_type == "laplacian":
                gray = np.mean(img, axis=-1)
                filtered = filters.laplace(gray)
                filtered = np.stack([filtered]*3, axis=-1)
            elif filter_type == "butterworth":
                # Frequency domain filtering
                for c in range(3):
                    channel = img[:,:,c]
                    fft = np.fft.fft2(channel)
                    fft_shift = np.fft.fftshift(fft)
                    # Apply Butterworth filter
                    H = 1 / (1 + (D/sigma)**4)  # Simplified
                    filtered_fft = fft_shift * H
                    filtered[:,:,c] = np.real(np.fft.ifft2(np.fft.ifftshift(filtered_fft)))
            
            results.append(filtered)
        
        # Convert back to tensor
        result = torch.from_numpy(np.stack(results)).float()
        return io.NodeOutput(result, ui=ui.PreviewImage(result))

# Entry point for pyisolate
from pyisolate import ExtensionBase

class ScientificExtension(ExtensionBase):
    def on_module_loaded(self, module):
        self.nodes = {
            "ScientificProcessor_v3": ScientificProcessorV3
        }

def create_extension():
    return ScientificExtension()
```

## Complete Workflow Example

```python
class TextToImageWorkflowV3(ComfyNodeV3):
    """Complete text-to-image workflow in one node."""
    
    @classmethod
    def DEFINE_SCHEMA(cls):
        return SchemaV3(
            node_id="TextToImageWorkflow_v3",
            display_name="Text to Image Workflow",
            category="workflows",
            description="All-in-one text to image generation",
            inputs=[
                io.String.Input("positive_prompt", multiline=True),
                io.String.Input("negative_prompt", multiline=True, default=""),
                io.Model.Input("model"),
                io.Clip.Input("clip"),
                io.Vae.Input("vae"),
                io.Int.Input("seed", default=0, min=0, max=0xffffffffffffffff),
                io.Int.Input("steps", default=20, min=1, max=150),
                io.Float.Input("cfg", default=7.0, min=0.0, max=30.0),
                io.Combo.Input("sampler_name", 
                    options=comfy.samplers.KSampler.SAMPLERS,
                    default="euler"
                ),
                io.Combo.Input("scheduler",
                    options=comfy.samplers.KSampler.SCHEDULERS,
                    default="normal"
                ),
                io.Int.Input("width", default=1024, min=64, max=8192, step=8),
                io.Int.Input("height", default=1024, min=64, max=8192, step=8),
                io.Int.Input("batch_size", default=1, min=1, max=64)
            ],
            outputs=[
                io.Image.Output("images", is_output_list=True),
                io.Latent.Output("latents")
            ],
            is_output_node=True
        )
    
    @classmethod
    async def execute(cls, positive_prompt, negative_prompt, model, clip, vae,
                      seed, steps, cfg, sampler_name, scheduler,
                      width, height, batch_size):
        import comfy.sample
        import comfy.samplers
        import latent_preview
        
        # Encode prompts
        positive_cond = clip.encode_from_text(positive_prompt)
        negative_cond = clip.encode_from_text(negative_prompt)
        
        # Create empty latent
        latent = torch.zeros([batch_size, 4, height // 8, width // 8])
        
        # Set up sampler
        sampler = comfy.samplers.KSampler(
            model, steps, cfg, sampler_name, scheduler,
            positive_cond, negative_cond, latent,
            denoise=1.0, seed=seed
        )
        
        # Sample with progress callback
        def callback(step, x0, x, total_steps):
            # Could update progress here
            pass
        
        samples = sampler.sample(latent, callback=callback)
        
        # Decode latents
        images = vae.decode(samples["samples"])
        
        return io.NodeOutput(
            images,
            samples,
            ui=ui.PreviewImage(images)
        )
```