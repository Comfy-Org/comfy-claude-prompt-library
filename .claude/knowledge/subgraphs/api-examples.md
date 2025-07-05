# LiteGraph Subgraph API Examples

## Basic Subgraph Operations

### Creating a Subgraph Definition

```typescript
import { LGraph, Subgraph, createUuidv4 } from "@/litegraph"

// Method 1: Create empty subgraph
const rootGraph = new LGraph()
const subgraphData = {
  id: createUuidv4(),
  name: "Math Operations",
  nodes: [],
  links: [],
  inputs: [],
  outputs: [],
  inputNode: { id: -1, pos: [10, 100] },
  outputNode: { id: -2, pos: [400, 100] }
}

const subgraph = rootGraph.createSubgraph(subgraphData)

// Method 2: Convert existing nodes to subgraph
const selectedNodes = new Set([node1, node2, node3])
const { subgraph, node } = rootGraph.convertToSubgraph(selectedNodes)
```

### Adding Inputs and Outputs

```typescript
// Add inputs with different types
const numberInput = subgraph.addInput("value", "number")
const stringInput = subgraph.addInput("text", "string")
const boolInput = subgraph.addInput("enabled", "boolean")

// Add outputs
const resultOutput = subgraph.addOutput("result", "number")
const statusOutput = subgraph.addOutput("status", "string")

// Rename IO slots
subgraph.renameInput(numberInput, "numericValue")
subgraph.renameOutput(resultOutput, "calculation")

// Remove IO slots
subgraph.removeInput(boolInput)
subgraph.removeOutput(statusOutput)
```

### Creating Subgraph Instances

```typescript
// Current workaround - direct instantiation
const subgraphNode = new SubgraphNode(
  parentGraph,
  subgraph,
  {
    id: parentGraph.last_node_id++,
    type: subgraph.id,
    pos: [200, 200],
    size: [140, 80],
    color: "#335",
    bgcolor: "#557"
  }
)

parentGraph.add(subgraphNode)

// Connect to other nodes
const sourceNode = parentGraph.getNodeById(1)
sourceNode.connect(0, subgraphNode, 0)  // Connect to first input
subgraphNode.connect(0, targetNode, 0)   // Connect from first output
```

## Event Handling

### Listening to Subgraph Changes

```typescript
// Listen for IO additions
subgraph.events.addEventListener("input-added", (event) => {
  const { input } = event.detail
  console.log(`New input added: ${input.name} (${input.type})`)
  
  // Update UI or perform other actions
  updateSubgraphPreview(subgraph)
})

// Listen for IO removal with cancellation
subgraph.events.addEventListener("removing-output", (event) => {
  const { output, index } = event.detail
  
  // Check if output is connected
  if (output.getLinks().length > 0) {
    if (!confirm(`Output "${output.name}" has connections. Remove anyway?`)) {
      event.preventDefault()  // Cancel removal
    }
  }
})

// Listen for renaming
subgraph.events.addEventListener("renaming-input", (event) => {
  const { input, oldName, newName, index } = event.detail
  console.log(`Input ${index} renamed from "${oldName}" to "${newName}"`)
})

// Complete event handler setup
function setupSubgraphEventHandlers(subgraph: Subgraph) {
  const events = [
    "adding-input", "input-added", "removing-input", "renaming-input",
    "adding-output", "output-added", "removing-output", "renaming-output"
  ]
  
  events.forEach(eventName => {
    subgraph.events.addEventListener(eventName, (e) => {
      console.log(`Subgraph event: ${eventName}`, e.detail)
    })
  })
}
```

### Working with SubgraphNode Events

```typescript
// SubgraphNode automatically syncs with definition changes
// No manual event handling needed for basic sync

// But you can still listen to node events
subgraphNode.onAdded = function() {
  console.log("Subgraph instance added to graph")
}

subgraphNode.onRemoved = function() {
  console.log("Subgraph instance removed from graph")
}

// Custom execution behavior
subgraphNode.onExecute = function() {
  // Subgraphs are typically flattened for execution
  // But you can add custom behavior here
  console.log("Executing subgraph instance")
}
```

## Advanced Patterns

### Dynamic Subgraph Creation

```typescript
function createProcessingSubgraph(
  inputTypes: string[],
  outputType: string,
  processingNodes: any[]
): Subgraph {
  const subgraphData = {
    id: createUuidv4(),
    name: "Dynamic Processor",
    nodes: [],
    links: [],
    inputs: [],
    outputs: [],
    inputNode: { id: -1, pos: [10, 50] },
    outputNode: { id: -2, pos: [400, 50] }
  }
  
  const subgraph = rootGraph.createSubgraph(subgraphData)
  
  // Add inputs dynamically
  inputTypes.forEach((type, index) => {
    subgraph.addInput(`input_${index}`, type)
  })
  
  // Add output
  subgraph.addOutput("result", outputType)
  
  // Add processing nodes
  let x = 150
  processingNodes.forEach(nodeData => {
    const node = LiteGraph.createNode(nodeData.type)
    node.pos = [x, 50]
    subgraph.add(node)
    x += 150
  })
  
  return subgraph
}
```

### Nested Subgraph Pattern

```typescript
// Create outer subgraph
const outerSubgraph = rootGraph.createSubgraph({
  id: createUuidv4(),
  name: "Outer Process",
  nodes: [],
  links: [],
  inputs: [],
  outputs: []
})

// Create inner subgraph
const innerSubgraph = rootGraph.createSubgraph({
  id: createUuidv4(),
  name: "Inner Process",
  nodes: [],
  links: [],
  inputs: [],
  outputs: []
})

// Add inner subgraph instance to outer subgraph
const innerInstance = new SubgraphNode(
  outerSubgraph,
  innerSubgraph,
  {
    id: outerSubgraph.last_node_id++,
    type: innerSubgraph.id,
    pos: [200, 100]
  }
)

outerSubgraph.add(innerInstance)
```

### Subgraph Templates

```typescript
class SubgraphTemplate {
  static createMathSubgraph(rootGraph: LGraph): Subgraph {
    const subgraph = rootGraph.createSubgraph({
      id: createUuidv4(),
      name: "Math Operations",
      nodes: [],
      links: [],
      inputs: [],
      outputs: []
    })
    
    // Standard math inputs
    subgraph.addInput("a", "number")
    subgraph.addInput("b", "number")
    subgraph.addInput("operation", "string")
    
    // Output
    subgraph.addOutput("result", "number")
    
    // Add math nodes
    const addNode = LiteGraph.createNode("math/add")
    const multNode = LiteGraph.createNode("math/multiply")
    const switchNode = LiteGraph.createNode("logic/switch")
    
    subgraph.add(addNode)
    subgraph.add(multNode)
    subgraph.add(switchNode)
    
    // Connect nodes...
    
    return subgraph
  }
  
  static createFilterSubgraph(rootGraph: LGraph): Subgraph {
    // Another template...
  }
}
```

### Working with Subgraph IO

```typescript
// Access subgraph IO from instance
const subgraphNode = graph.getNodeById(5) as SubgraphNode

// Get internal connections
const inputConnections = subgraphNode.resolveSubgraphInputLinks(0)
console.log("Input 0 connects to:", inputConnections)

const outputConnection = subgraphNode.resolveSubgraphOutputLink(0)
console.log("Output 0 comes from:", outputConnection)

// Programmatically connect inside subgraph
const innerNode = subgraph.getNodeById(1)
const inputSlot = subgraph.inputs[0]
const outputSlot = subgraph.outputs[0]

// Connect from subgraph input to inner node
inputSlot.connect(innerNode, 0)

// Connect from inner node to subgraph output
innerNode.connect(0, outputSlot)
```

### Serialization and Loading

```typescript
// Save graph with subgraphs
const serialized = rootGraph.serialize()
const json = JSON.stringify(serialized)

// Load graph with subgraphs
const loaded = JSON.parse(json)
const newGraph = new LGraph()
newGraph.configure(loaded)

// Access loaded subgraphs
const loadedSubgraphs = newGraph.subgraphs
loadedSubgraphs.forEach((subgraph, id) => {
  console.log(`Loaded subgraph: ${subgraph.name} (${id})`)
})

// Clone a subgraph
const clonedSubgraph = existingSubgraph.clone()
rootGraph.subgraphs.set(clonedSubgraph.id, clonedSubgraph)
```

### Execution Context

```typescript
// Access flattened nodes during execution
function debugSubgraphExecution(subgraphNode: SubgraphNode) {
  const flattened = subgraphNode.getInnerNodes()
  
  console.log("Flattened execution order:")
  flattened.forEach(dto => {
    console.log(`- ${dto.id}: ${dto.title} (${dto.type})`)
  })
  
  // Check input resolution
  flattened.forEach(dto => {
    dto.inputs.forEach((input, slot) => {
      const resolved = dto.resolveInput(slot)
      if (resolved) {
        console.log(`  Input ${slot} <- Node ${resolved.origin_id}[${resolved.origin_slot}]`)
      }
    })
  })
}
```

## Best Practices

### 1. Always Check Subgraph Existence
```typescript
function createSubgraphInstance(graphId: UUID, subgraphId: UUID) {
  const graph = getGraphById(graphId)
  const subgraph = graph.subgraphs.get(subgraphId)
  
  if (!subgraph) {
    throw new Error(`Subgraph ${subgraphId} not found`)
  }
  
  return new SubgraphNode(graph, subgraph, {...})
}
```

### 2. Handle Events Properly
```typescript
// Use type-safe event handling
import type { SubgraphEventMap } from "@/infrastructure/SubgraphEventMap"

function handleSubgraphEvent<K extends keyof SubgraphEventMap>(
  subgraph: Subgraph,
  event: K,
  handler: (e: CustomEvent<SubgraphEventMap[K]>) => void
) {
  subgraph.events.addEventListener(event, handler)
}
```

### 3. Validate Before Operations
```typescript
function safeRemoveInput(subgraph: Subgraph, input: SubgraphInput) {
  // Check if input exists
  if (!subgraph.inputs.includes(input)) {
    console.warn("Input not found in subgraph")
    return
  }
  
  // Check connections
  const links = input.getLinks()
  if (links.length > 0) {
    console.warn(`Input has ${links.length} connections`)
  }
  
  // Remove with event handling
  try {
    subgraph.removeInput(input)
  } catch (error) {
    console.error("Failed to remove input:", error)
  }
}
```

### 4. Manage Subgraph Lifecycle
```typescript
class SubgraphManager {
  private graphs = new Map<UUID, LGraph>()
  private instances = new Map<UUID, Set<SubgraphNode>>()
  
  registerSubgraph(graph: LGraph, subgraph: Subgraph) {
    graph.subgraphs.set(subgraph.id, subgraph)
    this.instances.set(subgraph.id, new Set())
  }
  
  createInstance(graph: LGraph, subgraphId: UUID): SubgraphNode {
    const subgraph = this.findSubgraph(subgraphId)
    const instance = new SubgraphNode(graph, subgraph, {...})
    
    this.instances.get(subgraphId)?.add(instance)
    return instance
  }
  
  deleteSubgraph(subgraphId: UUID) {
    // Remove all instances first
    const instances = this.instances.get(subgraphId)
    instances?.forEach(node => {
      node.graph?.remove(node)
    })
    
    // Remove from all graphs
    this.graphs.forEach(graph => {
      graph.subgraphs.delete(subgraphId)
    })
  }
}
```

These examples demonstrate the current API and patterns for working with subgraphs in LiteGraph. Note that some operations (like creating instances via LiteGraph.createNode) don't work properly yet and require workarounds.