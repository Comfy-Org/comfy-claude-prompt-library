# ComfyUI Validation Flow

## Execution Order

ComfyUI's input validation follows a strict sequential order in `execution.py`:

1. **Static Combo Validation** (lines 737-762)
   - Checks if input values exist in predefined combo lists
   - Applies to inputs defined as `(list, {...})` format
   - **Critical**: If this fails, execution stops and returns errors

2. **VALIDATE_INPUTS Custom Validation** (lines 764-791)  
   - Only runs if static validation passes
   - Allows nodes to implement custom validation logic
   - Has access to full execution context and input data

## The Timing Dependency Problem

```python
# In execution.py validate_inputs()
if isinstance(input_type, list):
    combo_options = input_type
    if val not in combo_options:
        # FAIL HERE - execution stops
        errors.append(error)
        continue

# This section only reached if above passes
if len(validate_function_inputs) > 0 or validate_has_kwargs:
    ret = _map_node_over_list(obj_class, input_filtered, "VALIDATE_INPUTS")
```

**Key Insight**: `VALIDATE_INPUTS` never gets called if static combo validation fails first. This creates issues for nodes that want to:
- Validate dynamic combo options at runtime
- Use custom logic to determine valid values
- Handle combos populated by frontend after `INPUT_TYPES()` definition

## Validation Types

### Static Combo Validation
- Triggers on: `isinstance(input_type, list)` where `input_type` is first element of tuple
- Examples:
  ```python
  "model": (["sd15", "sdxl", "flux"], {})  # List triggers validation
  "sampler": (comfy.samplers.KSampler.SAMPLERS, {})  # List triggers validation
  ```

### String Type Inputs  
- No automatic validation for: `"COMBO"`, `"STRING"`, `"INT"`, etc.
- Examples:
  ```python
  "option": ("COMBO", {"remote": {"route": "/api/options"}})  # No static validation
  "text": ("STRING", {})  # No static validation
  ```

## Working Examples

### LoadImageOutput (Works Fine)
```python
"image": ("COMBO", {
    "remote": {
        "route": "/internal/files/output",
        "refresh_button": True,
        "control_after_refresh": "first",
    },
})
```
- Uses `"COMBO"` string type → skips static validation
- Frontend populates via remote route
- Relies on `VALIDATE_INPUTS` for file existence check

### LoadImage (Static Validation)
```python
"image": (sorted(files), {"image_upload": True})
```  
- Uses actual list → triggers static validation
- Files must exist in list at validation time
- Both static validation AND `VALIDATE_INPUTS` run

## Best Practices

1. **Use string types** (`"COMBO"`, etc.) for dynamic options that can't be known at `INPUT_TYPES()` time
2. **Implement `VALIDATE_INPUTS`** for custom validation logic with runtime context
3. **Use list types** only for truly static, predetermined options
4. **Remember validation order** when debugging - static validation can block custom validation