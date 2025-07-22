# TypeScript Serialization Patterns

## Private Fields and Deserialization Issues

### The Problem

TypeScript private fields using the `#field` syntax create real private members that cannot be accessed from outside the class. This causes issues during deserialization when trying to assign plain objects to typed properties.

```typescript
class LGraphNode {
  #concreteInputs: ConcreteInput[]  // Private field
  #concreteOutputs: ConcreteOutput[]  // Private field
}

interface IBaseWidget {
  parentSubgraphNode?: LGraphNode  // This type expectation...
}

// During deserialization, this fails:
const plainObject = { id: 123, pos: [10, 20] }  // From JSON
widget.parentSubgraphNode = plainObject  // ❌ Type error
```

**Error**: Cannot assign plain object to LGraphNode type because private fields are not assignable.

### Solution Patterns

#### Pattern 1: Remove Redundant Properties
**Best Choice**: When the property represents information available through other means.

```typescript
// Before: Widget stores parent reference
interface IBaseWidget {
  parentSubgraphNode?: LGraphNode  // Redundant
  node: LGraphNode  // Already available
}

// After: Use existing reference
// widget.node provides parent context
// No additional property needed
```

**When to Use**: When the failing property duplicates information already available through other object references.

#### Pattern 2: Interface Segregation
**Caution**: Can lead to circular type references.

```typescript
// ❌ Creates circular reference
interface IBaseWidget {
  parentSubgraphNode?: IBaseWidget["parentSubgraphNode"]
}

// ✅ Better: Create specific interface
interface NodeLike {
  id: string
  pos: Point
  // Only serializable properties
}

interface IBaseWidget {
  parentSubgraphNode?: NodeLike
}
```

**When to Use**: When you need a subset of properties that are serialization-safe. Avoid self-referencing types.

#### Pattern 3: Runtime Type Guards
**Complex**: For when you need both runtime and compile-time safety.

```typescript
interface SerializableNode {
  id: string
  pos: Point
}

function isFullNode(node: SerializableNode | LGraphNode): node is LGraphNode {
  return 'addInput' in node
}

// Usage
if (isFullNode(widget.parentNode)) {
  // Can call LGraphNode methods
  widget.parentNode.addInput(...)
}
```

**When to Use**: When you need to handle both serialized and live objects in the same code path.

## Circular Type Reference Detection

### Warning Signs

1. **Self-referencing types**:
   ```typescript
   // ❌ Immediate red flag
   interface Widget {
     parent?: Widget["parent"]
   }
   ```

2. **Accessing properties from the same interface**:
   ```typescript
   // ❌ Circular reference
   interface IBaseWidget {
     parentNode?: IBaseWidget["parentNode"]  
   }
   ```

3. **Complex generic constraints that reference themselves**:
   ```typescript
   // ❌ Can become circular
   interface Node<T extends Node<T>> {
     parent?: T
   }
   ```

### Detection and Resolution

**Immediate Fix**: If you see `Type["property"]` referencing the same type, it's likely circular:

```typescript
// Problem
interface IBaseWidget {
  parentSubgraphNode?: IBaseWidget["parentSubgraphNode"]  // Circular!
}

// Solution: Create separate interface
interface SubgraphNodeRef {
  // Define what you actually need
}

interface IBaseWidget {
  parentSubgraphNode?: SubgraphNodeRef
}
```

## Best Practices

### 1. Analyze Root Cause First
Before adding complex type solutions, ask:
- Is this property actually needed?
- Can existing object references provide the same information?
- Are we duplicating state that creates maintenance burden?

### 2. Prefer Composition Over Complex Types
```typescript
// ❌ Complex type gymnastics
interface IWidget {
  parent?: Partial<LGraphNode> & Pick<LGraphNode, 'id' | 'pos'>
}

// ✅ Simple composition
interface IWidget {
  node: LGraphNode  // Use existing reference
  // parent context available via widget.node.graph.findParentSubgraph()
}
```

### 3. Design for Serialization Early
When designing interfaces that will be serialized:

1. **Separate serializable from runtime data**:
   ```typescript
   // Serializable data
   interface SerializedWidget {
     name: string
     value: any
     type: string
   }
   
   // Runtime augmentation
   interface IWidget extends SerializedWidget {
     node: LGraphNode  // Runtime-only reference
   }
   ```

2. **Use factory patterns for reconstruction**:
   ```typescript
   class WidgetFactory {
     static fromSerialized(data: SerializedWidget, node: LGraphNode): IWidget {
       return {
         ...data,
         node  // Inject runtime reference
       }
     }
   }
   ```

### 4. Document Serialization Behavior
```typescript
interface IBaseWidget {
  /**
   * Reference to owning node.
   * @remarks This property is a runtime reference and should not be serialized.
   * It will be undefined after deserialization and needs to be reconstructed.
   */
  node: LGraphNode
}
```

## Common Anti-Patterns

### 1. Creating Interfaces Just for Types
```typescript
// ❌ Creates maintenance burden
interface NodeLike {
  id: string
  pos: Point
  // Duplicates LGraphNode properties
}
```

Instead, question if you need the property at all.

### 2. Using `any` to Avoid Type Issues
```typescript
// ❌ Loses type safety
interface IWidget {
  parentNode?: any  // Defeats purpose of TypeScript
}
```

### 3. Overly Complex Generic Constraints
```typescript
// ❌ Hard to understand and maintain
interface Widget<T extends Pick<Node<T>, keyof Node<T>>> {
  parent?: T
}
```

## Debugging Tips

### 1. Check for Private Fields
When serialization fails, inspect the target type:
```bash
# Look for # syntax in class definitions
grep -r "#[a-zA-Z]" src/ --include="*.ts"
```

### 2. Trace Type Dependencies
Use TypeScript compiler to see where circular references originate:
```bash
npx tsc --noEmit --pretty
```

### 3. Test Serialization Explicitly
```typescript
// Add tests for round-trip serialization
const serialized = JSON.parse(JSON.stringify(widget))
const reconstructed = WidgetFactory.fromSerialized(serialized, node)
expect(reconstructed.name).toBe(widget.name)
```

## Key Learnings

1. **TypeScript private fields (#syntax) prevent deserialization** - they create truly private members that can't be assigned plain object values.

2. **Circular type references indicate design issues** - if you're referencing the same interface within itself, reconsider the design.

3. **Remove redundant properties before adding type complexity** - often the "failing" property represents information available through other means.

4. **Design for serialization from the start** - separate runtime references from serializable data in your type design.

5. **Test serialization boundaries** - include round-trip serialization tests to catch these issues early.