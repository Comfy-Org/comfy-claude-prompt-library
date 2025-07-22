# GPU Compatibility Issues and Solutions

## RTX 50 Series (Blackwell) xformers Incompatibility

### Issue Description
Users with NVIDIA RTX 50 series GPUs (5070, 5070 Ti, 5080, 5090) encounter CUDA errors when xformers is enabled in ComfyUI.

**Error Message:**
```
CUDA error (C:/a/xformers/xformers/third_party/flash-attention/hopper\flash_fwd_launch_template.h:188): invalid argument
```

### Affected Hardware
- NVIDIA RTX 5070
- NVIDIA RTX 5070 Ti  
- NVIDIA RTX 5080
- NVIDIA RTX 5090
- All Blackwell architecture GPUs (compute capability sm_120)

### Root Cause
The xformers library's flash attention implementation is not compatible with the new Blackwell architecture (sm_120). The current xformers versions (including 0.0.31.post1) were built before these GPUs existed and don't include support for the new compute capability.

### Solution

**Primary Solution: Disable xformers**
```bash
# Windows
.\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --disable-xformers

# Linux/Mac
python main.py --disable-xformers
```

**Alternative Solutions:**

1. **Use PyTorch's native attention (automatically enabled when xformers is disabled)**
   ```bash
   python main.py --use-pytorch-cross-attention
   ```

2. **Force split attention mode**
   ```bash
   python main.py --disable-xformers --use-split-cross-attention
   ```

### Performance Impact
Minimal performance difference has been reported by users:
- With xformers: ~1min 57.7sec (benchmark)
- Without xformers: ~1min 54.7sec (benchmark)
- Some users report slightly better performance without xformers on RTX 50 series

### Current Status (July 2025)
- xformers still does not officially support RTX 50 series GPUs
- Community builds exist but have mixed results:
  - `xformers-0.0.30+9a2cd3ef.d20250321` (for Python 3.12.8)
- PyTorch 2.7+ with CUDA 12.8 fully supports these GPUs
- Native PyTorch attention provides comparable performance

### Required Software Versions
For RTX 50 series support, ensure you have:
- PyTorch 2.7.0+ with CUDA 12.8
- NVIDIA Driver 572.70 or newer
- CUDA 12.8+

**Install command for proper PyTorch:**
```bash
pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128
```

### References
- [GitHub Issue #8861](https://github.com/comfyanonymous/ComfyUI/issues/8861)
- [GitHub Discussion #6643 - Nvidia 50 Series support thread](https://github.com/comfyanonymous/ComfyUI/discussions/6643)

### Notes for Developers
The issue stems from:
1. xformers' flash attention kernel not recognizing sm_120 architecture
2. The flash_fwd_launch_template.h file containing hardcoded architecture checks
3. PyTorch's native attention has caught up in performance, making xformers less critical

Until xformers officially adds Blackwell support, the `--disable-xformers` flag is the recommended approach.