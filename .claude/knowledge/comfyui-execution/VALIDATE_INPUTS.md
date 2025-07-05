# VALIDATE_INPUTS in ComfyUI

## Overview

`VALIDATE_INPUTS` is a class method nodes can implement to provide custom input validation beyond the built-in type checking.

## Execution Context

**Critical Timing**: `VALIDATE_INPUTS` only executes AFTER static validation passes. If static combo validation fails (lines 737-762), `VALIDATE_INPUTS` never runs.

Location in `execution.py`: Lines 764-791

## Implementation Pattern

```python
class MyNode:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "file_path": ("STRING", {}),
                "mode": (["read", "write"], {}),
            }
        }
    
    @classmethod  
    def VALIDATE_INPUTS(s, file_path, mode):
        # Custom validation with full context
        if mode == "write" and not os.access(file_path, os.W_OK):
            return f"No write permission for {file_path}"
        
        if mode == "read" and not os.path.exists(file_path):
            return f"File not found: {file_path}"
            
        return True  # Validation passed
```

## Method Signature

```python
@classmethod
def VALIDATE_INPUTS(cls, **kwargs):
    # kwargs contains all inputs by name
    # Return True for success
    # Return string for error message
    # Can also return ExecutionBlocker for advanced control
```

## Input Access

The method receives filtered inputs based on its signature:

```python
# In execution.py
argspec = inspect.getfullargspec(obj_class.VALIDATE_INPUTS)
validate_function_inputs = argspec.args  # ['cls', 'input1', 'input2']
validate_has_kwargs = argspec.varkw is not None  # **kwargs present?

# Only inputs matching signature are passed
for x in input_data_all:
    if x in validate_function_inputs or validate_has_kwargs:
        input_filtered[x] = input_data_all[x]
```

## Special Parameters

- `input_types`: Include this parameter to receive type information
  ```python
  def VALIDATE_INPUTS(s, file_path, input_types):
      # input_types contains the received type info
  ```

## Real Examples from Codebase

### File Validation
```python
# From LoadImage
@classmethod
def VALIDATE_INPUTS(s, image):
    if not folder_paths.exists_annotated_filepath(image):
        return "Invalid image file: {}".format(image)
    return True
```

### Latent File Validation  
```python
# From LoadLatent
@classmethod
def VALIDATE_INPUTS(s, latent):
    if not folder_paths.exists_annotated_filepath(latent):
        return "Invalid latent file: {}".format(latent)
    return True
```

## Return Values

- `True`: Validation successful
- `False`: Generic validation failure
- `str`: Specific error message (preferred)
- `ExecutionBlocker`: Advanced control over execution flow

## Error Handling

Failed validation produces:
```python
error = {
    "type": "custom_validation_failed", 
    "message": "Custom validation failed for node",
    "details": f"{input_name} - {error_message}",
    "extra_info": {"input_name": input_name}
}
```

## Use Cases

1. **File existence/permission checks**
2. **Cross-input validation** (e.g., width/height ratios)
3. **External resource validation** (API keys, URLs)
4. **Dynamic value validation** when static combo validation isn't suitable
5. **Complex business logic** that requires multiple inputs

## Limitations

- **Never runs if static validation fails first**
- Only receives inputs that match method signature
- Cannot modify inputs, only validate them
- Runs during prompt validation, not during actual execution