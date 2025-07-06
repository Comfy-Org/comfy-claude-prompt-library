# Process Isolation with pyisolate

Process isolation enables ComfyUI nodes to run in separate Python processes with their own dependencies, solving the dependency conflict problem while maintaining seamless communication.

## Overview

pyisolate provides:
- Automatic virtual environment creation per node
- Transparent RPC communication
- Zero-copy PyTorch tensor sharing
- Shared state management
- Fast dependency installation with `uv`

## Architecture

```
┌─────────────────────┐     RPC      ┌─────────────┐
│  ComfyUI Host       │◄────────────►│   Node A    │
│                     │              │ (numpy 1.x) │
│  ┌──────────────┐   │              └─────────────┘
│  │Model Manager │   │     RPC      ┌─────────────┐
│  │   (Shared)   │   │◄────────────►│   Node B    │
│  └──────────────┘   │              │ (numpy 2.x) │
└─────────────────────┘              └─────────────┘
```

## Integration with ComfyUI v3

### 1. Node as Extension

Each v3 node package becomes a pyisolate extension:

```python
# nodes/my_node_pack/__init__.py
from comfy_api.v3 import io, ComfyNodeV3
from pyisolate import ExtensionBase

class MyNodeExtension(ExtensionBase):
    def on_module_loaded(self, module):
        # Register nodes with ComfyUI
        self.nodes = {
            "MyNode": MyNode,
            "MyOtherNode": MyOtherNode
        }
    
    async def execute_node(self, node_id: str, **inputs):
        node_class = self.nodes[node_id]
        # Execute in isolated environment
        return await node_class.execute(**inputs)
```

### 2. Manifest Declaration

```yaml
# nodes/my_node_pack/manifest.yaml
name: my_node_pack
version: 1.0.0
dependencies:
  - numpy==1.26.4  # Specific version needed
  - tensorflow==2.15.0
  - custom-library>=1.0.0
isolated: true
share_torch: true  # Enable tensor sharing
```

### 3. Node Registration

Modified node loading in ComfyUI:

```python
async def load_custom_node_v3(module_path):
    manifest = load_manifest(module_path)
    
    if manifest.get("isolated", False):
        # Load as isolated extension
        extension = await manager.load_extension(
            ExtensionConfig(
                name=manifest["name"],
                module_path=module_path,
                isolated=True,
                dependencies=manifest["dependencies"],
                share_torch=manifest.get("share_torch", False)
            )
        )
        # Register proxy nodes
        for node_id in extension.get_node_ids():
            NODE_CLASS_MAPPINGS[node_id] = create_proxy_node(extension, node_id)
    else:
        # Load normally in host process
        import_module(module_path)
```

### 4. Proxy Node Implementation

```python
def create_proxy_node(extension, node_id):
    """Create a proxy node that forwards execution to isolated process."""
    
    class ProxyNode(ComfyNodeV3):
        _extension = extension
        _node_id = node_id
        
        @classmethod
        def DEFINE_SCHEMA(cls):
            # Get schema from isolated process
            return cls._extension.get_node_schema(cls._node_id)
        
        @classmethod
        async def execute(cls, **inputs):
            # Forward execution to isolated process
            result = await cls._extension.execute_node(cls._node_id, **inputs)
            return result
    
    return ProxyNode
```

## Key Features

### 1. Dependency Isolation

Each node pack can specify exact dependencies:
```python
dependencies=[
    "numpy==1.26.4",      # Exact version
    "torch>=2.0.0,<3.0",  # Version range
    "opencv-python",      # Latest compatible
    "git+https://github.com/org/repo.git@v1.0"  # Git dependency
]
```

### 2. Zero-Copy Tensor Sharing

Large tensors shared without serialization:
```python
# In node execute method
async def execute(cls, image: torch.Tensor, model: ModelPatcher):
    # Tensors are shared, not copied!
    # Same memory used in host and node process
    processed = model(image)
    return io.NodeOutput(processed)
```

### 3. Shared Model Management

Models accessible across all nodes:
```python
from pyisolate import ProxiedSingleton

class ModelManager(ProxiedSingleton):
    def __init__(self):
        self.models = {}
    
    async def load_model(self, name: str, path: str):
        if name not in self.models:
            self.models[name] = await load_checkpoint(path)
        return self.models[name]
    
    async def get_model(self, name: str):
        return self.models.get(name)

# In any node (host or isolated)
manager = ModelManager()  # Returns proxy to host instance
model = await manager.get_model("sd_xl")
```

### 4. Resource Management

Automatic cleanup and resource limits:
```python
ExtensionConfig(
    name="heavy_node",
    isolated=True,
    max_memory="8GB",      # Memory limit (future)
    max_cpu_percent=80,    # CPU limit (future)
    timeout=300,           # Max execution time
    share_torch=True       # Share GPU tensors
)
```

## Benefits

### Stability
- Node crashes don't affect ComfyUI
- Memory leaks isolated
- Clean shutdown of misbehaving nodes

### Compatibility
- Run nodes with any dependencies
- Mix Python versions (future)
- No more "dependency hell"

### Performance
- Parallel node execution
- Shared memory for tensors
- Fast venv creation with `uv`
- Efficient RPC communication

### Security
- Nodes can be sandboxed
- Limited file system access (future)
- Network restrictions (future)

## Implementation Status

- ✅ Core pyisolate library complete
- ✅ RPC system with async support
- ✅ PyTorch tensor sharing
- ✅ Virtual environment management
- 🚧 ComfyUI integration design
- 📋 Node manifest specification
- 📋 Proxy node system
- 📋 Migration tools

## Future Enhancements

1. **Distributed Execution**
   - Nodes on different machines
   - Cloud node execution
   - Load balancing

2. **Enhanced Security**
   - Filesystem sandboxing
   - Network access control
   - Resource quotas

3. **Developer Tools**
   - Debugging isolated nodes
   - Performance profiling
   - Dependency analysis

4. **Advanced Features**
   - Hot reloading
   - Multiple Python versions
   - Container-based isolation