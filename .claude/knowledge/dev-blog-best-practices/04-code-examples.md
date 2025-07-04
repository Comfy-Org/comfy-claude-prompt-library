# Code Examples Best Practices

## The Art of Technical Code Examples

Code examples are often the most valuable part of a developer blog post. They need to be clear, correct, and contextual while serving both educational and practical purposes.

## Core Principles

### 1. Completeness vs Clarity
Strike a balance between runnable code and focused examples:
- Include enough context to understand
- Remove boilerplate that doesn't add value
- Use `// ...` to indicate omitted sections
- Link to complete examples when needed

### 2. Progressive Disclosure
Build complexity gradually:
```javascript
// Start simple
const cache = new Map();

// Add complexity
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

// Show full implementation
class TTLCache {
  constructor(ttl = 60 * 1000) {
    this.cache = new Map();
    this.timers = new Map();
    this.ttl = ttl;
  }
  // ...
}
```

### 3. Real-World Relevance
Use examples that readers might actually implement:
- Avoid `foo`, `bar`, `baz` unless explaining abstract concepts
- Use domain-appropriate variable names
- Include error handling when relevant
- Show edge cases that matter

## Code Example Patterns

### The Before/After Pattern
Show transformation clearly:

```javascript
// ❌ Before: Inefficient approach
function processUsers(users) {
  const results = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
      results.push({
        id: users[i].id,
        name: users[i].name.toUpperCase()
      });
    }
  }
  return results;
}

// ✅ After: Improved approach
function processUsers(users) {
  return users
    .filter(user => user.active)
    .map(user => ({
      id: user.id,
      name: user.name.toUpperCase()
    }));
}
```

### The Building Block Pattern
Show incremental construction:

```python
# Step 1: Basic retry decorator
def retry(max_attempts=3):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
            return wrapper
        return decorator

# Step 2: Add exponential backoff
def retry(max_attempts=3, backoff_factor=2):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(backoff_factor ** attempt)
            return wrapper
        return decorator

# Step 3: Add specific exception handling
def retry(max_attempts=3, backoff_factor=2, exceptions=(Exception,)):
    # ... full implementation
```

### The Problem/Solution Pattern
Present the issue, then the fix:

```go
// Problem: Race condition in counter
type Counter struct {
    value int
}

func (c *Counter) Increment() {
    c.value++ // ⚠️ Not thread-safe!
}

// Solution: Use mutex for synchronization
type Counter struct {
    mu    sync.Mutex
    value int
}

func (c *Counter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}
```

## Formatting Guidelines

### Syntax Highlighting
- Always specify the language for syntax highlighting
- Use appropriate language identifiers (javascript, python, go, etc.)
- Consider using syntax highlighting for config files too (yaml, json, toml)

### Line Length
- Keep lines under 80 characters when possible
- Break long lines logically:
```javascript
// ❌ Too long
const result = await fetch(`https://api.example.com/v1/users/${userId}/profile?include=avatar,preferences&format=json`);

// ✅ Better
const result = await fetch(
  `https://api.example.com/v1/users/${userId}/profile` +
  `?include=avatar,preferences&format=json`
);
```

### Comments
Use comments strategically:
```python
def process_payment(amount, currency="USD"):
    # Convert amount to cents to avoid floating point issues
    amount_cents = int(amount * 100)
    
    # Validate against business rules
    if amount_cents < 50:  # $0.50 minimum
        raise ValueError("Amount too small")
    
    # Process with payment provider
    response = payment_provider.charge(
        amount=amount_cents,
        currency=currency,
        metadata={"source": "blog_example"}  # Track API usage
    )
    
    return response.transaction_id
```

### Variable Naming
Choose names that enhance understanding:
```javascript
// ❌ Unclear naming
const d = new Date();
const u = users.filter(x => x.a);

// ✅ Clear naming
const now = new Date();
const activeUsers = users.filter(user => user.isActive);
```

## Advanced Techniques

### Interactive Examples
When possible, make examples runnable:
- Link to CodePen, JSFiddle, or similar
- Provide setup instructions for local running
- Include test cases readers can try

### Error Handling Examples
Show both happy path and error cases:
```rust
// Happy path
match file.read_to_string(&mut contents) {
    Ok(_) => println!("File read successfully"),
    Err(e) => eprintln!("Failed to read file: {}", e),
}

// Common error scenarios
match connect_to_database(url) {
    Ok(conn) => conn,
    Err(e) => match e {
        DatabaseError::ConnectionTimeout => {
            // Retry with backoff
        },
        DatabaseError::AuthenticationFailed => {
            // Check credentials
        },
        _ => panic!("Unexpected database error: {}", e),
    }
}
```

### Performance Comparisons
When showing optimization, include benchmarks:
```python
# Benchmark results on 1M items:
# Original: 2.34s
def find_duplicates_v1(items):
    duplicates = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                duplicates.append(items[i])
    return duplicates

# Optimized: 0.08s (29x faster)
def find_duplicates_v2(items):
    seen = set()
    duplicates = set()
    for item in items:
        if item in seen:
            duplicates.add(item)
        seen.add(item)
    return list(duplicates)
```

## Common Pitfalls

### 1. Incomplete Imports
Always show necessary imports:
```python
# ❌ Missing imports
def create_temp_file():
    with tempfile.NamedTemporaryFile() as tmp:
        return tmp.name

# ✅ Complete example
import tempfile

def create_temp_file():
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        return tmp.name
```

### 2. Unrealistic Examples
Avoid overly simplified examples:
```javascript
// ❌ Too simple to be useful
function add(a, b) {
    return a + b;
}

// ✅ Realistic with edge cases
function add(a, b) {
    // Handle non-numeric inputs
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('Arguments must be numbers');
    }
    
    // Check for overflow
    const result = a + b;
    if (!Number.isFinite(result)) {
        throw new RangeError('Result exceeds numeric limits');
    }
    
    return result;
}
```

### 3. Platform-Specific Code
Indicate platform requirements:
```bash
# macOS/Linux
export API_KEY="your-key-here"

# Windows (PowerShell)
$env:API_KEY = "your-key-here"

# Windows (cmd)
set API_KEY=your-key-here
```

## Code Example Checklist

- [ ] Language specified for syntax highlighting
- [ ] Imports and dependencies shown
- [ ] Variable names are meaningful
- [ ] Comments explain "why" not "what"
- [ ] Error handling included where relevant
- [ ] Edge cases demonstrated
- [ ] Performance implications noted
- [ ] Security considerations addressed
- [ ] Testing approach shown
- [ ] Links to runnable versions provided