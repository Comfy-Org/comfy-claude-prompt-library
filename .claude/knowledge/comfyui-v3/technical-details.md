# Technical Details: ComfyUI v3 Architecture

Deep dive into the technical implementation details of the ComfyUI v3 system.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      ComfyUI Host Process                     │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Execution Engine│  │ Node Registry│  │Model Manager │   │
│  │   (async)       │  │  (v1 + v3)   │  │  (shared)    │   │
│  └─────────────────┘  └──────────────┘  └──────────────┘   │
│           │                    │                  │           │
│  ┌────────┴──────────────────┬─┴──────────────────┴───────┐  │
│  │              pyisolate RPC Layer                       │  │
│  └────────┬──────────────────┴────────────────────┬──────┘  │
└───────────┼───────────────────────────────────────┼──────────┘
            │                                       │
    ┌───────▼────────┐                     ┌───────▼────────┐
    │  Node Process  │                     │  Node Process  │
    │  (numpy 1.x)   │                     │  (numpy 2.x)   │
    │  ┌──────────┐  │                     │  ┌──────────┐  │
    │  │ v3 Nodes │  │                     │  │ v3 Nodes │  │
    │  └──────────┘  │                     │  └──────────┘  │
    └────────────────┘                     └────────────────┘
```

## v3 Schema Implementation

### Type System Architecture

The v3 type system uses a decorator-based approach with metaclasses:

```python
# Type definition
@comfytype(io_type="IMAGE")
class Image(ComfyTypeIO):
    Type = torch.Tensor  # Python type hint
    
    class Input(InputV3):
        # Input-specific parameters
        pass
    
    class Output(OutputV3):
        # Output-specific parameters
        pass
```

### Schema Validation

Schema validation happens at multiple levels:

1. **Definition Time**: When `DEFINE_SCHEMA()` is called
2. **Registration Time**: When node is loaded
3. **Execution Time**: Input/output type checking

```python
def validate(self):
    """Validate schema integrity."""
    input_ids = [i.id for i in self.inputs]
    output_ids = [o.id for o in self.outputs]
    
    # Check uniqueness
    if len(set(input_ids)) != len(input_ids):
        raise ValueError("Duplicate input IDs")
    
    # Check no overlap
    if set(input_ids) & set(output_ids):
        raise ValueError("Input and output IDs must be unique")
```

### Backward Compatibility Layer

The v3 system maintains v1 compatibility through property emulation:

```python
@classproperty
def RETURN_TYPES(cls):
    if cls._RETURN_TYPES is None:
        schema = cls.GET_SCHEMA()
        cls._RETURN_TYPES = [o.io_type for o in schema.outputs]
    return cls._RETURN_TYPES
```

## Async Execution Implementation

### Event Loop Management

Each execution creates a new event loop to avoid conflicts:

```python
def execute(self, prompt, prompt_id, extra_data={}, execute_outputs=[]):
    asyncio_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(asyncio_loop)
    asyncio.run(self.execute_async(prompt, prompt_id, extra_data, execute_outputs))
```

### Task Scheduling

Async tasks are scheduled with intelligent batching:

```python
async def _async_map_node_over_list(...):
    if inspect.iscoroutinefunction(f):
        # Create task with context
        task = asyncio.create_task(
            async_wrapper(f, prompt_id, unique_id, index, inputs)
        )
        
        # Non-blocking check for immediate completion
        await asyncio.sleep(0)
        
        if task.done():
            results.append(task.result())
        else:
            # Store for later resolution
            results.append(task)
```

### Pending Task Resolution

Background tasks monitor and unblock execution:

```python
if has_pending_tasks:
    pending_async_nodes[unique_id] = output_data
    unblock = execution_list.add_external_block(unique_id)
    
    async def await_completion():
        tasks = [x for x in output_data if isinstance(x, asyncio.Task)]
        await asyncio.gather(*tasks, return_exceptions=True)
        unblock()  # Signal completion
    
    asyncio.create_task(await_completion())
```

## Process Isolation Architecture

### Extension Lifecycle

1. **Virtual Environment Creation**
   ```python
   # Using uv for speed
   subprocess.run([
       "uv", "venv", venv_path,
       "--python", python_version
   ])
   ```

2. **Dependency Installation**
   ```python
   # Batch install with uv
   subprocess.run([
       "uv", "pip", "install",
       "--python", venv_python,
       *dependencies
   ])
   ```

3. **Process Spawning**
   ```python
   # Launch with proper environment
   process = await asyncio.create_subprocess_exec(
       venv_python,
       "-m", "pyisolate._internal.client",
       stdin=asyncio.subprocess.PIPE,
       stdout=asyncio.subprocess.PIPE,
       env={**os.environ, "VIRTUAL_ENV": venv_path}
   )
   ```

### RPC Protocol

The RPC system uses JSON-RPC over stdin/stdout:

```python
# Request format
{
    "jsonrpc": "2.0",
    "method": "execute_node",
    "params": {
        "node_id": "ImageInvert_v3",
        "inputs": {"image": <tensor_ref>}
    },
    "id": "req_123"
}

# Response format
{
    "jsonrpc": "2.0",
    "result": {
        "outputs": [<tensor_ref>],
        "ui": {"images": [...]}
    },
    "id": "req_123"
}
```

### Tensor Sharing Protocol

Zero-copy tensor sharing uses shared memory:

```python
# Host side
shm = SharedMemory(create=True, size=tensor.nbytes)
shm_array = np.ndarray(tensor.shape, dtype=tensor.dtype, buffer=shm.buf)
shm_array[:] = tensor.numpy()

# Send reference
tensor_ref = {
    "type": "shared_tensor",
    "name": shm.name,
    "shape": tensor.shape,
    "dtype": str(tensor.dtype),
    "device": str(tensor.device)
}

# Client side
shm = SharedMemory(name=tensor_ref["name"])
array = np.ndarray(
    tensor_ref["shape"],
    dtype=tensor_ref["dtype"],
    buffer=shm.buf
)
tensor = torch.from_numpy(array)
```

## State Management System

### NodeState Implementation

State is managed per node instance with persistence:

```python
class NodeStateLocal(NodeState):
    def __init__(self, node_id: str):
        self.node_id = node_id
        self.local_state = {}
    
    def __getattr__(self, key: str):
        # Transparent attribute access
        if key in self.local_state:
            return self.local_state[key]
        return None
    
    def __setattr__(self, key: str, value: Any):
        # Transparent attribute setting
        if key in ['node_id', 'local_state']:
            super().__setattr__(key, value)
        else:
            self.local_state[key] = value
```

### Resource Caching

Resources are cached with automatic cleanup:

```python
class ResourcesLocal(Resources):
    def __init__(self):
        self.local_resources: dict[ResourceKey, Any] = {}
    
    def get(self, key: ResourceKey, default=...):
        # Check cache
        if key in self.local_resources:
            return self.local_resources[key]
        
        # Load resource
        if isinstance(key, TorchDictFolderFilename):
            path = folder_paths.get_full_path(key.folder_name, key.file_name)
            resource = comfy.utils.load_torch_file(path, safe_load=True)
            
        # Cache and return
        self.local_resources[key] = resource
        return resource
```

## Performance Optimizations

### Async Task Batching

Tasks are batched to reduce context switching:

```python
# Give tasks a chance to complete synchronously
await asyncio.sleep(0)

# Batch gather for efficiency
if remaining_tasks:
    await asyncio.gather(*remaining_tasks, return_exceptions=True)
```

### Memory Management

Shared memory is managed with reference counting:

```python
class SharedMemoryManager:
    def __init__(self):
        self.references = {}
    
    def create_shared(self, tensor):
        shm = SharedMemory(create=True, size=tensor.nbytes)
        self.references[shm.name] = {
            "memory": shm,
            "count": 1
        }
        return shm
    
    def release(self, name):
        if name in self.references:
            self.references[name]["count"] -= 1
            if self.references[name]["count"] == 0:
                self.references[name]["memory"].close()
                self.references[name]["memory"].unlink()
                del self.references[name]
```

### Virtual Environment Caching

Venvs are reused when dependencies match:

```python
def get_venv_hash(dependencies):
    """Generate hash for dependency set."""
    dep_str = "\n".join(sorted(dependencies))
    return hashlib.sha256(dep_str.encode()).hexdigest()

def get_or_create_venv(dependencies):
    venv_hash = get_venv_hash(dependencies)
    venv_path = os.path.join(venv_root, venv_hash)
    
    if os.path.exists(venv_path):
        # Reuse existing
        return venv_path
    
    # Create new
    create_venv(venv_path, dependencies)
    return venv_path
```

## Security Considerations

### Process Sandboxing

Each isolated process has restricted capabilities:

```python
# Future implementation
class SecurityPolicy:
    def __init__(self):
        self.allowed_paths = []
        self.network_access = False
        self.max_memory = "2GB"
        self.max_cpu = 80
    
    def apply(self, process):
        # Apply OS-level restrictions
        if sys.platform == "linux":
            # Use cgroups, namespaces
            pass
        elif sys.platform == "win32":
            # Use job objects
            pass
```

### Path Validation

All file paths are validated and normalized:

```python
def validate_path(path, allowed_dirs):
    """Ensure path is within allowed directories."""
    real_path = os.path.realpath(path)
    for allowed in allowed_dirs:
        if real_path.startswith(os.path.realpath(allowed)):
            return real_path
    raise SecurityError(f"Path {path} not in allowed directories")
```

## Future Architecture

### Distributed Execution

Future support for distributed nodes:

```python
class RemoteExtension(Extension):
    def __init__(self, url, auth_token):
        self.client = RemoteRPCClient(url, auth_token)
    
    async def execute_node(self, node_id, **inputs):
        # Execute on remote server
        return await self.client.call("execute_node", node_id, inputs)
```

### GPU Scheduling

Intelligent GPU resource management:

```python
class GPUScheduler:
    async def schedule_execution(self, node, estimated_vram):
        while not self.has_available_vram(estimated_vram):
            await self.wait_for_vram()
        
        reservation = self.reserve_vram(estimated_vram)
        try:
            result = await node.execute()
            return result
        finally:
            reservation.release()
```

### Hot Reloading

Live node updates without restart:

```python
class HotReloadManager:
    def watch_extensions(self):
        for event in watchdog.watch(extensions_dir):
            if event.type == "modified":
                extension = self.get_extension(event.path)
                await extension.reload()
                self.notify_clients(f"Reloaded {extension.name}")
```