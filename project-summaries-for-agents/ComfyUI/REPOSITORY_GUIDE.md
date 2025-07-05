# ComfyUI Repository Guide

## Repository Overview

**ComfyUI** is the most powerful and modular visual AI engine and application. It provides a graph/nodes/flowchart based interface for designing and executing advanced AI model pipelines including image generation, video generation, audio synthesis, and 3D content creation.

- **Repository**: https://github.com/comfyanonymous/ComfyUI
- **Version**: 0.3.43 (from pyproject.toml)
- **License**: Available in LICENSE file
- **Website**: https://www.comfy.org/
- **Documentation**: https://docs.comfy.org/
- **Community**: Discord & Matrix channels

## Core Purpose

This repository contains the backend server and core execution engine for ComfyUI. It handles:
- Model loading and management (checkpoints, LoRAs, embeddings, etc.)
- Graph execution and validation
- Sampling and inference pipelines
- API server for frontend communication
- Custom node system for extensibility

## Technology Stack

- **Language**: Python 3.9+ (3.12 recommended, 3.13 supported)
- **Core ML Libraries**:
  - PyTorch + torchvision + torchaudio for ML operations
  - transformers>=4.37.2, tokenizers>=0.13.3 for language models
  - safetensors>=0.4.2 for secure model loading
  - einops, scipy, numpy>=1.25.0 for numerical operations
- **Server & Database**:
  - aiohttp>=3.11.8 for async web server
  - SQLAlchemy + alembic for database management
  - yarl>=1.18.0 for URL handling
- **Media Processing**:
  - Pillow for image processing
  - av>=14.2.0 for audio/video processing
  - soundfile for audio I/O
- **Optional Dependencies**:
  - kornia>=0.7.1 for computer vision
  - spandrel for upscaling models
  - pydantic~=2.0 for data validation
- **Frontend**:
  - comfyui-frontend-package==1.23.4 (separate Vue.js frontend)
  - comfyui-workflow-templates==0.1.32
  - comfyui-embedded-docs==0.2.3
- **Testing**: pytest for unit tests

## Directory Structure

### Core Directories

- **`comfy/`** - Core library containing all model implementations, samplers, and ML logic
  - `ldm/` - Latent diffusion model implementations
  - `text_encoders/` - Various text encoder implementations (CLIP, T5, etc.)
  - `controlnet.py`, `lora.py` - Model modifier implementations
  - `model_management.py` - GPU/memory management
  - `samplers.py`, `sample.py` - Sampling algorithms

- **`comfy_extras/`** - Built-in node implementations for various features
  - Each `nodes_*.py` file contains nodes for specific functionality
  - Examples: `nodes_flux.py`, `nodes_video_model.py`, `nodes_audio.py`

- **`api_server/`** - REST API server implementation
  - `routes/` - API endpoint definitions  
  - `routes/internal/` - Internal API routes
  - `services/` - Business logic services (terminal_service.py)
  - `utils/` - File operation utilities

- **`app/`** - Application-level functionality
  - `user_manager.py` - User session management
  - `model_manager.py` - Model installation/management  
  - `custom_node_manager.py` - Custom node package management
  - `frontend_management.py` - Frontend version management
  - `app_settings.py` - Application configuration
  - `logger.py` - Logging utilities
  - `database/` - Database models and utilities

- **`execution.py`** - Core graph execution engine
- **`nodes.py`** - Core built-in node definitions
- **`server.py`** - Main server entry point

### Model & Data Directories

- **`models/`** - Directory for storing AI models (checkpoints, LoRAs, VAEs, etc.)
- **`input/`** - Input files for workflows
- **`output/`** - Generated output files
- **`custom_nodes/`** - Third-party custom node packages

### Configuration & Scripts

- **`extra_model_paths.yaml.example`** - Example for configuring additional model paths
- **`requirements.txt`** - Python dependencies  
- **`pyproject.toml`** - Project metadata and build configuration
- **`alembic.ini`** - Database migration configuration
- **`pytest.ini`** - Test configuration
- **`CONTRIBUTING.md`** - Contribution guidelines
- **`new_updater.py`** - Update mechanism
- **`script_examples/`** - API usage examples

## Development Guidelines

### Release Process

ComfyUI follows a **weekly release cycle every Friday** with three interconnected repositories:

1. **ComfyUI Core** (this repo) - Releases stable versions (e.g., v0.7.0)
2. **ComfyUI Desktop** - Builds releases using latest stable core
3. **ComfyUI Frontend** - Weekly updates merged into core, features frozen for upcoming release

### Code Style & Quality

- **Linting**: Uses Ruff with specific rules:
  - N805 (invalid-first-argument-name-for-method)
  - S307 (suspicious-eval-usage), S102 (exec)
  - T (print-usage), W (warnings), F (Pyflakes)
  - Run: `ruff check`
- **Code Quality Standards**:
  - Cyclomatic complexity < 10 per function
  - Nesting depth < 4 levels
  - Function length < 50 lines
  - Avoid O(n²) algorithms and N+1 query patterns

### Development Patterns

1. **Model Implementation Pattern**:
   - New models go in `comfy/ldm/` or appropriate subdirectory
   - Follow existing patterns for model wrappers and patchers
   - Use `model_base.py` as base classes

2. **Node Development**:
   - Nodes must define `INPUT_TYPES`, `RETURN_TYPES`, `FUNCTION`
   - Use type hints from `comfy/comfy_types/`
   - Built-in nodes go in `comfy_extras/nodes_*.py`
   - Custom nodes go in `custom_nodes/` subdirectories

3. **Memory Management**:
   - Always use `comfy.model_management` for GPU operations
   - Implement proper cleanup in model classes
   - Follow VRAM optimization patterns

### Testing

- **Unit tests** in `tests-unit/` using pytest
  - `app_test/` - Application layer tests
  - `comfy_test/` - Core comfy module tests  
  - `comfy_extras_test/` - Node extension tests
  - `execution_test/` - Graph execution tests
  - `folder_paths_test/` - File system tests
- **Integration tests** in `tests/` for inference testing
  - `inference/` - Model inference tests
  - `compare/` - Quality comparison tests
- **Commands**:
  - Unit tests: `pytest tests-unit/`
  - Integration tests: `pytest tests/`
  - Specific test: `pytest tests-unit/app_test/custom_node_manager_test.py`

### Common Development Tasks

1. **Adding a new model type**:
   - Implement model in `comfy/ldm/`
   - Add to `comfy/supported_models.py`
   - Create nodes in `comfy_extras/nodes_*.py`

2. **Creating new nodes**:
   - Define class with proper node interface
   - Add to `NODE_CLASS_MAPPINGS` in the module
   - Ensure proper input validation

3. **Modifying execution flow**:
   - Changes to `execution.py` require careful testing
   - Maintain backward compatibility
   - Consider caching implications

## Architecture Patterns

1. **Model Patcher System**: Models are wrapped in patcher objects that handle modifications (LoRA, ControlNet) without modifying original weights

2. **Lazy Loading**: Models are loaded on-demand and managed by `model_management.py`

3. **Node Graph Execution**: Topological sorting and caching for efficient execution

4. **Type System**: Strong typing for node inputs/outputs via `comfy_types`
5. **API Integration**: Support for external API providers through `comfy_api_nodes/`
6. **Database Migrations**: Alembic for schema changes in `alembic_db/`

## Model Support Matrix

### Image Generation Models
- **Stable Diffusion**: SD1.x, SD2.x, SDXL, SDXL Turbo, SD3/SD3.5
- **Advanced Models**: Flux, AuraFlow, HunyuanDiT, Pixart Alpha/Sigma
- **Specialized**: Stable Cascade, Lumina 2.0, HiDream, Cosmos Predict2

### Video Generation Models  
- **Core**: Stable Video Diffusion, Mochi, LTX-Video
- **Advanced**: Hunyuan Video, Nvidia Cosmos, Wan 2.1

### Audio & 3D Models
- **Audio**: Stable Audio, ACE Step
- **3D**: Hunyuan3D 2.0

### Control & Enhancement
- **ControlNet & T2I-Adapter**: Pose, depth, canny edge control
- **LoRA support**: Regular, Locon, LoHA variants
- **Upscaling**: ESRGAN variants, SwinIR, Swin2SR
- **Inpainting**: Dedicated inpainting model support

## Essential Commands for AI Development

### Development Server
```bash
# Basic startup
python main.py

# Development with latest frontend
python main.py --front-end-version Comfy-Org/ComfyUI_frontend@latest

# CPU-only mode
python main.py --cpu

# Enable previews
python main.py --preview-method auto
```

### Quality Assurance
```bash
# Linting
ruff check

# Unit tests
pytest tests-unit/

# Integration tests
pytest tests/inference/

# Specific test module
pytest tests-unit/app_test/custom_node_manager_test.py
```

### Model Management
```bash
# Install via comfy-cli (recommended)
pip install comfy-cli
comfy install

# Manual dependency installation
pip install -r requirements.txt
```

## Critical Files for AI Development

### High-Impact Files (Changes Affect All Users)
- `execution.py` - Core graph execution engine
- `comfy/model_management.py` - GPU/memory management
- `nodes.py` - Core built-in node definitions
- `server.py` - Main API server entry point
- `folder_paths.py` - File system path management

### Key Implementation Files
- `comfy/model_base.py` - Base classes for all models
- `comfy/supported_models.py` - Model registry and detection
- `comfy/samplers.py` - Sampling algorithms
- `comfy/lora.py` - LoRA implementation
- `comfy/controlnet.py` - ControlNet support

### Extension Points
- `comfy_extras/nodes_*.py` - Built-in node implementations
- `custom_nodes/` - Third-party extensions
- `comfy/comfy_types/` - Type system for nodes
- `api_server/routes/` - API endpoint extensions

## Security Considerations

- Safe model loading with pickle scanning (`checkpoint_pickle.py`)
- Input validation in node execution
- File path sanitization for user uploads
- API authentication via user sessions

## Integration Points

### Frontend Integration
- **WebSocket & REST APIs** for real-time communication
- **Frontend versions**: Stable (fortnightly) vs Daily releases
- **Legacy support**: Available via command-line flags

### Extension System
- **Custom nodes**: Python packages in `custom_nodes/`
- **Model loading**: Configurable paths via `extra_model_paths.yaml`
- **API nodes**: External service integration via `comfy_api_nodes/`
- **Database**: SQLite for persistent user/session data

### Hardware Support
- **NVIDIA**: CUDA with optimized PyTorch builds
- **AMD**: ROCm support on Linux
- **Intel**: Arc GPU support via IPEX
- **Apple Silicon**: Native Metal Performance Shaders
- **CPU-only**: Fallback mode with `--cpu` flag

## Development Workflow

### Daily Development
1. **Make changes** in appropriate module
2. **Run quality checks**:
   - `ruff check` for linting
   - `pytest tests-unit/` for unit tests
   - `pytest tests/inference/` for integration tests
3. **Test functionality**:
   - Test with example workflows in web interface
   - Use `script_examples/` for API testing
4. **Ensure compatibility**:
   - No breaking changes to node interfaces
   - Backward compatibility with existing workflows
   - Check custom node compatibility

### Frontend Development
- **Frontend repo**: https://github.com/Comfy-Org/ComfyUI_frontend
- **Use latest daily**: `--front-end-version Comfy-Org/ComfyUI_frontend@latest`
- **Use legacy**: `--front-end-version Comfy-Org/ComfyUI_legacy_frontend@latest`
- Frontend updates are merged into core repository fortnightly

### Contributing
- **Guidelines**: Follow `CONTRIBUTING.md`
- **Community**: Discord https://comfy.org/discord, Matrix channels
- **Issues**: Search existing before creating, use issue templates
- **Pull Requests**: Reference wiki guide for code contributions

## Performance Optimization Patterns

### Memory Management
- **VRAM optimization**: Automatic GPU memory management
- **Model offloading**: Smart loading/unloading based on usage
- **Batch processing**: Efficient handling of multiple operations
- **Cache management**: Intelligent caching of intermediate results

### Execution Optimization
- **Partial execution**: Only re-runs changed graph portions
- **Topological sorting**: Optimal execution order
- **Async operations**: Non-blocking API operations
- **Smart scheduling**: Queue management for concurrent workflows

### GPU Optimization Tips
- **Memory efficient attention**: Use `--use-pytorch-cross-attention`
- **ROCm optimization**: Set `TORCH_ROCM_AOTRITON_ENABLE_EXPERIMENTAL=1`
- **TuneableOp**: Set `PYTORCH_TUNABLEOP_ENABLED=1` for AMD GPUs
- **FP8 operations**: Automatic fallback when FP8 operations fail

## Troubleshooting Guide

### Common Issues
1. **"Torch not compiled with CUDA"**: Reinstall PyTorch with CUDA support
2. **Memory errors**: Use `--cpu` or reduce batch sizes
3. **Model loading failures**: Check model format and paths
4. **Custom nodes conflicts**: Check dependencies and compatibility

### Debug Commands
```bash
# Check GPU compatibility
python -c "import torch; print(torch.cuda.is_available())"

# Verify model paths
python -c "import folder_paths; print(folder_paths.folder_names_and_paths)"

# Test basic inference
python script_examples/basic_api_example.py
```

### Hardware-Specific Setup
- **AMD RDNA2**: `HSA_OVERRIDE_GFX_VERSION=10.3.0 python main.py`
- **AMD RDNA3**: `HSA_OVERRIDE_GFX_VERSION=11.0.0 python main.py`
- **Intel Arc**: Use PyTorch nightly with XPU support
- **Apple Silicon**: Install PyTorch nightly with Metal support