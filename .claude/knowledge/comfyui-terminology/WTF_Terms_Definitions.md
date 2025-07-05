# WTF Page Terms - Definitions

This document contains comprehensive definitions for all terms in the WTF Page Notion database.

## Terms with Definitions

### COMBO
**Context:** Frontend Feature + Backend Feature  
**Definition:** Dropdown widget for selecting from predefined options like samplers or schedulers.

### Sand Projects
**Context:** General  
**Definition:** Small, urgent but less important tasks that fill time if not managed properly.

### Rock Projects
**Context:** General  
**Definition:** Most important, high-impact initiatives that should be prioritized first.

### First Principle
**Context:** General  
**Definition:** Breaking down problems to fundamentals to ensure alignment with our established organizational values.

### Graph
**Context:** General  
**Definition:** Structure of connected nodes where edges define relationships and data flow.

### DAG
**Context:** General  
**Definition:** Directed Acyclic Graph - connections flow one direction without loops, preventing circular dependencies.

### Workflow
**Context:** General  
**Definition:** Saved state of the graph stored as JSON, preserving all nodes and connections.

### Node
**Context:** General  
**Definition:** Single operation that takes inputs, performs a task, and produces outputs.

### Widget
**Context:** Frontend Feature  
**Definition:** UI component inside nodes that has a value passed as output, like sliders or dropdowns.

### Remote Widget
**Context:** Frontend Feature  
**Definition:** Widget that fetches options dynamically from HTTP endpoints with caching.

### AUDIO_UI Widget
**Context:** Frontend Feature  
**Definition:** Audio playback widget that renders HTML audio controls for previewing audio files in nodes like LoadAudio, SaveAudio, PreviewAudio.

### AUDIO_RECORD Widget
**Context:** Frontend Feature  
**Definition:** Audio recording widget that provides microphone recording functionality with start/stop controls and automatic WAV encoding for RecordAudio nodes.

### Manager
**Context:** General  
**Definition:** ComfyUI-Manager extension for installing and managing custom nodes automatically.

### Custom Node
**Context:** General (Frontend Feature + Backend Feature)  
**Definition:** Community-created extensions that add new functionality, distributed as git repositories.

### Serialize
**Context:** General  
**Definition:** Converting graph's in-memory representation into JSON format for saving or transmission.

### Client
**Context:** General  
**Definition:** Frontend application running in browser that handles UI and graph editing.

### Nightly Nodes
**Context:** General  
**Definition:** Registry packages tracking latest development versions rather than stable releases.

### Unclaimed Nodes
**Context:** General  
**Definition:** Auto-added registry packages that haven't been claimed by their creators yet.

### CNR (Comfy Node Registry)
**Context:** General  
**Definition:** Official registry at registry.comfy.org for publishing and discovering custom nodes.

### pyproject.toml
**Context:** General  
**Definition:** Python project config file with ComfyUI-specific fields for registry integration.

### Canvas
**Context:** Frontend Feature  
**Definition:** Graphics surface that allows drawing and interacting with the node graph.

### Templates
**Context:** General  
**Definition:** Pre-built workflows from Browse Templates, managed in workflow_templates repository.

### Group Nodes
**Context:** General  
**Definition:** Multiple nodes collapsed into a single reusable unit.

### Groups
**Context:** Frontend Feature  
**Definition:** Visual boxes around nodes for organization, allowing movement as a unit.

### Subgraph
**Context:** General  
**Definition:** Nested graph within another graph for organizing complex workflows.

### Model
**Context:** General  
**Definition:** Dictionary of trained weights and parameters stored in files like .safetensors or .ckpt that represent a trained AI system capable of generating images, understanding text, or performing other tasks. Examples include Gemini or Flux.

### Schema
**Context:** General  
**Definition:** Structured definition describing data format and validation rules.

### Spec
**Context:** General  
**Definition:** Format definition like OpenAPI or JSON schema that describes data structure or API.

### OpenAPI
**Context:** General  
**Definition:** Standard format for describing REST APIs with endpoints and data schemas.

### Proxy
**Context:** General  
**Definition:** Intermediary service forwarding requests between clients and external APIs.

### Reactive
**Context:** Frontend Feature  
**Definition:** UI automatically updates when underlying data changes, without manual refresh.

### BAU (Business as usual)
**Context:** General  
**Definition:** Maintenance, bug fixes, and minor updates

---

*Document generated for WTF Page Notion database entries*