# Async Nodes in ComfyUI

The async nodes implementation brings native async/await support to ComfyUI, enabling non-blocking execution and better resource utilization.

## Overview

Async nodes allow ComfyUI to:
- Execute I/O operations without blocking
- Run multiple nodes concurrently
- Provide real-time progress updates
- Better utilize CPU/GPU resources
- Prepare for distributed execution

## How It Works

### 1. Async Node Methods

Any node method can be async:

```python
class MyAsyncNode:
    async def execute(self, image, prompt):
        # Network request without blocking
        response = await fetch_api(prompt)
        
        # Process with progress
        result = await self.process_image(image)
        
        return (result,)
    
    async def fingerprint_inputs(self, value, threshold):
        # Async validation (e.g., checking remote service)
        is_valid = await check_remote_validation(value)
        return True if is_valid else "Validation failed"
    
    async def check_lazy_status(self, input1, input2, condition):
        # Async lazy evaluation
        needed = await determine_required_inputs(condition)
        return needed
```

### 2. Execution Flow

The execution system detects and handles async methods:

```python
# In _async_map_node_over_list
f = getattr(obj, func)
if inspect.iscoroutinefunction(f):
    # Create async task
    task = asyncio.create_task(f(**inputs))
    
    # Give it a chance to complete immediately
    await asyncio.sleep(0)
    
    if task.done():
        results.append(task.result())
    else:
        # Store pending task
        results.append(task)
```

### 3. Pending Task Management

When async tasks don't complete immediately:

1. Tasks stored in `pending_async_nodes`
2. External block added to execution list
3. Background coroutine monitors completion:
   ```python
   async def await_completion():
       tasks = [x for x in output_data if isinstance(x, asyncio.Task)]
       await asyncio.gather(*tasks, return_exceptions=True)
       unblock()
   ```
4. Execution continues when all tasks finish

### 4. Progress Tracking

New progress system for long-running operations:

```python
async def process_batch(self, images, unique_id):
    batch_size = images.shape[0]
    pbar = ProgressBar(batch_size, node_id=unique_id)
    
    processed = []
    for i in range(batch_size):
        # Async processing
        await process_single_image(images[i])
        pbar.update(1)  # Updates UI in real-time
    
    return (torch.cat(processed),)
```

### 5. Context Management

`CurrentNodeContext` tracks execution context:
- Maintains `(prompt_id, unique_id, list_index)`
- Ensures callbacks on correct event loop
- Critical for distributed scenarios

## Common Patterns

### Network Operations
```python
async def execute(self, prompt):
    # Non-blocking API calls
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json={"prompt": prompt}) as resp:
            result = await resp.json()
    return (process_result(result),)
```

### Concurrent Processing
```python
async def execute(self, images):
    # Process multiple images concurrently
    tasks = [process_image(img) for img in images]
    results = await asyncio.gather(*tasks)
    return (combine_results(results),)
```

### Resource Management
```python
class ResourceLimitedNode:
    _semaphore = asyncio.Semaphore(2)  # Max 2 concurrent
    
    async def execute(self, data):
        async with self._semaphore:
            result = await expensive_operation(data)
        return (result,)
```

### Long Operations with Cancellation
```python
async def execute(self, data, timeout=30.0):
    try:
        result = await asyncio.wait_for(
            long_running_task(data), 
            timeout=timeout
        )
        return (result,)
    except asyncio.TimeoutError:
        raise RuntimeError(f"Operation timed out after {timeout}s")
```

## Benefits

1. **Performance**
   - I/O doesn't block execution
   - Multiple nodes run concurrently
   - Better CPU/GPU utilization

2. **User Experience**
   - Real-time progress updates
   - Responsive UI during execution
   - Cancellable operations

3. **Scalability**
   - Ready for distributed execution
   - Efficient resource sharing
   - Better handling of external services

4. **Developer Experience**
   - Standard Python async/await
   - Clean error handling
   - Familiar patterns

## Implementation Details

### Modified Execution Flow

1. `execute_async()` replaces synchronous `execute()`
2. `IsChangedCache` operations are async
3. Cache operations support async: `await cache.set_prompt()`
4. Validation is async: `await validate_inputs()`

### Event Loop Management

- New event loop per execution: `asyncio.new_event_loop()`
- Proper cleanup and error handling
- Context preserved across async boundaries

### Backward Compatibility

- Synchronous nodes work unchanged
- Mixed sync/async execution supported
- Automatic detection via `inspect.iscoroutinefunction()`

## Testing

Comprehensive test suite in `tests/inference/test_async_nodes.py`:
- Async validation
- Error handling
- Timeout scenarios
- Resource management
- Batch processing
- Concurrent limits

## Future Enhancements

1. **Streaming Results** - Yield partial results during execution
2. **Priority Scheduling** - High-priority async tasks
3. **Resource Pools** - Shared async resource management
4. **Distributed Execution** - Async RPC to remote nodes