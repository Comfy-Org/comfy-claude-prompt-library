# ComfyUI v3 Initiative

This knowledge base documents the ComfyUI v3 initiative, a major architectural overhaul aimed at improving the custom node experience through better dependency management, modern APIs, and scalable execution.

## Overview

The v3 initiative consists of three interconnected components:

1. **[v3 Node Schema](./v3-schema.md)** - New object-oriented node definition system
2. **[Async Nodes](./async-nodes.md)** - Native async/await support for non-blocking execution
3. **[Process Isolation](./process-isolation.md)** - Multi-process node execution via pyisolate

## Key Goals

- **Improve Stability** - Separate internal functions from public APIs
- **Solve Dependency Conflicts** - Run nodes with conflicting dependencies
- **Enable Dynamic I/O** - First-class support for dynamic inputs/outputs
- **Streamline Development** - Better IDE support, type hints, documentation
- **Future-Proof Architecture** - Support for distributed/parallel execution

## Quick Links

- [Migration Guide](./migration-guide.md) - Converting v1 nodes to v3
- [API Reference](./api-reference.md) - Complete v3 API documentation
- [Examples](./examples.md) - Sample v3 node implementations
- [Technical Deep Dive](./technical-details.md) - Architecture and implementation details

## Timeline

- **Current Status**: In development, seeking feedback
- **v3 Schema**: Active development on `v3-definition` branch
- **Async Nodes**: Working implementation on `js/drafts/async_nodes_v2` branch
- **Process Isolation**: pyisolate package available, integration pending

## Resources

- Blog Post: [Dependency Resolution and Custom Node Standards](https://blog.comfy.org/dependency-resolution-and-custom-node-standards)
- Discord: #exclusive-custom-node-devs channel
- GitHub: [ComfyUI Repository](https://github.com/comfyanonymous/ComfyUI)