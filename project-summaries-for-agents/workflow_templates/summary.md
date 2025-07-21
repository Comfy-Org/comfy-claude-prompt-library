# ComfyUI Workflow Templates Repository Guide

## Repository Overview

- **Purpose**: Official collection of workflow templates for ComfyUI, providing pre-built workflows that demonstrate various AI generation capabilities (image, video, audio, 3D)
- **Repository**: https://github.com/Comfy-Org/workflow_templates
- **Package**: Published to PyPI as `comfyui_workflow_templates` (v0.1.33)
- **License**: MIT License
- **Integration**: Templates are bundled and served through the ComfyUI frontend application
- **Template Count**: 130+ workflow templates across multiple categories

## Technology Stack

- **Primary Language**: Python
- **Build System**: setuptools with pyproject.toml
- **Dependencies**: Minimal - only jsonschema for validation
- **Distribution**: PyPI package that includes all template files
- **File Formats**: JSON workflows, WebP/MP3/MP4 thumbnails
- **CI/CD**: GitHub Actions for validation, publishing, and GCS sync

## Directory Structure

```
workflow_templates/
├── templates/                  # All workflow templates and assets
│   ├── index.json             # Master index of all templates with metadata
│   ├── index.schema.json      # JSON schema for validation
│   └── *.json + *-N.webp      # 130+ workflow files with thumbnails
├── docs/                      # Documentation and images
│   ├── SPEC.md               # Technical specification
│   └── pictures/             # Documentation images
├── scripts/                   # Utility scripts
│   └── validate_templates.py  # Comprehensive validation script
├── .github/workflows/         # CI/CD automation
│   ├── publish.yml           # Auto-publish to PyPI on version bump
│   ├── validate-templates.yml # PR validation checks
│   └── sync-gcs.yml          # Google Cloud Storage sync
├── comfyui_workflow_templates/  # Python package structure
├── pyproject.toml             # Package configuration
├── setup.py                   # Package setup
└── README.md                  # Detailed contributor guide
```

## Development Workflow

### Essential Commands
```bash
# Validate all templates (MUST run before PR)
python scripts/validate_templates.py

# Install for development
pip install -e .

# Test integration with ComfyUI frontend
# In frontend repo: Add DISABLE_TEMPLATES_PROXY=true to .env
# Copy templates/ folder to frontend/public/
```

### Code Quality Tools
- **Validation Script**: Enhanced with 5 validation stages:
  1. JSON schema validation
  2. File consistency checks
  3. Duplicate name detection
  4. Required thumbnail verification
  5. Model metadata format validation (ensures no top-level models)
- **GitHub Actions**: 
  - Automated validation on PRs (only runs on template/script changes)
  - JSON syntax checking
  - File size warnings (>5MB)
  - Auto-publish to PyPI on version bump
  - GCS sync for cloud distribution
- **Model Metadata**: Must be embedded in node properties, NOT at top-level

## Critical Development Guidelines

### From README.md and SPEC.md

1. **File Naming Convention**:
   - Workflow: `template_name.json` (lowercase, underscores, no spaces/dots/special chars)
   - Thumbnails: `template_name-1.webp`, `template_name-2.webp` (numbered)
   - Supported formats: webp (images), mp3 (audio), mp4 (video)

2. **Thumbnail Requirements**:
   - Every template MUST have at least one thumbnail (`-1` suffix)
   - Compress to <1MB when possible
   - Recommended: 512x512 or 768x768 pixels
   - Convert to WebP for best compression
   - Support for multiple thumbnails (up to 9)

3. **Model Metadata Format**:
   - Models MUST be embedded in node properties, NOT top-level
   - Include: name, url, hash, hash_type, directory
   - Widget values must match model names exactly
   - Validation script now checks for widget value correspondence
   - Example in node properties:
   ```json
   "properties": {
     "models": [{
       "name": "model.safetensors",
       "url": "https://huggingface.co/...",
       "hash": "sha256_hash",
       "hash_type": "SHA256",
       "directory": "models/checkpoints"
     }]
   }
   ```

4. **Version Bumping**:
   - ALWAYS bump version in pyproject.toml when adding/modifying templates
   - This triggers automatic PyPI release via GitHub Actions
   - Recent pattern: frequent small version bumps (0.1.x)

5. **Workflow Creation Best Practices**:
   - Start ComfyUI with `--disable-all-custom-nodes` to prevent metadata pollution
   - First execution output should match the thumbnail
   - Include node version requirements when needed (cnr_id, ver in properties)
   - Add documentation nodes (MarkdownNote) for complex workflows

## Architecture & Patterns

### Template System Architecture
- **Index-Based**: All templates registered in `index.json` with categories
- **Category Structure**: moduleName, title, type (optional), templates array
- **Template Metadata**: name, title (optional), description, mediaType, mediaSubtype, thumbnailVariant, tutorialUrl
- **Distribution Model**: PyPI package consumed by ComfyUI frontend
- **Thumbnail Variants**: compareSlider, hoverDissolve, hoverZoom, zoomHover (legacy)

### Validation Pipeline (Enhanced)
1. JSON schema validation against index.schema.json
2. File consistency checks (all referenced files exist)
3. Duplicate name detection across categories
4. Required thumbnail verification (-1 suffix mandatory)
5. Model metadata format validation:
   - Detects and reports top-level models arrays
   - Suggests which nodes should contain the models
   - Validates widget values match model names

### Recent Development Patterns
- **API Integration Focus**: Major expansion of API templates (50+ API workflows)
  - OpenAI, Stability AI, Runway, Moonvalley, Luma, Kling, etc.
- **Model Standardization**: Recent PR #73 standardized all model metadata format
- **Video Generation**: Significant growth in video generation templates
- **Frequent Updates**: Multiple templates added/updated weekly
- **Thumbnail Improvements**: Ongoing efforts to update and standardize thumbnails

## Common Development Tasks

### Adding a New Template (Updated Process)

1. **Create Workflow**:
   ```bash
   # Start ComfyUI without custom nodes
   python main.py --disable-all-custom-nodes
   # Create and export workflow
   ```

2. **Prepare Assets**:
   - Compress thumbnail to WebP (<1MB)
   - Use tools like EzGif for compression
   - Name files: `my_template.json`, `my_template-1.webp`

3. **Add to index.json**:
   ```json
   {
     "name": "my_template",
     "title": "Optional Display Title",
     "description": "Brief description",
     "mediaType": "image",
     "mediaSubtype": "webp",
     "thumbnailVariant": "hoverZoom",
     "tutorialUrl": "https://docs.example.com"
   }
   ```

4. **Embed Model Metadata**:
   - Find model loader nodes
   - Add models array to node properties (NOT top-level)
   - Ensure widget_values match model names exactly
   - Include hash from HuggingFace or calculate manually

5. **Validate and Submit**:
   ```bash
   python scripts/validate_templates.py
   # Fix any errors reported
   # Bump version in pyproject.toml
   git add -A && git commit -m "Add my_template workflow"
   # Create PR - will trigger automatic validation
   ```

6. **Post-Merge**:
   - Version bump triggers automatic PyPI release
   - Add translations in ComfyUI_frontend repo

### Testing Templates
```bash
# Validate structure (enhanced checks)
python scripts/validate_templates.py

# Test in frontend
cd ../ComfyUI_frontend
echo "DISABLE_TEMPLATES_PROXY=true" >> .env
cp -r ../workflow_templates/templates public/
npm run dev
```

### Troubleshooting Templates
- **Missing thumbnail**: Check file naming matches exactly (case-sensitive)
- **Model not downloading**: Verify hash, URL, and model in node properties
- **Widget value mismatch**: New validation catches model name mismatches
- **Top-level models error**: Move models from root to node properties
- **Validation failures**: Script provides detailed error messages with suggestions
- **Template not showing**: Check index.json entry and file paths

## Key Files for AI Agents

### Priority Files to Read
1. `/templates/index.json` - Master template registry with all metadata
2. `/scripts/validate_templates.py` - Enhanced validation logic (5 stages)
3. `/docs/SPEC.md` - Formal technical specification
4. `/README.md` - Step-by-step contributor guide with examples
5. `/templates/index.schema.json` - JSON schema definition
6. `/.github/workflows/` - CI/CD automation scripts

### Template Categories (Expanded)
- **Basics**: Core workflows (SD, SDXL, ControlNet, etc.)
- **Flux**: Flux model variants (15+ templates)
- **API**: External service integrations (50+ templates)
  - OpenAI (DALL-E, GPT, Image models)
  - Stability AI (SD3.5, Stable Image Ultra)
  - Video APIs (Runway, Moonvalley, Luma, Kling, Pika, etc.)
  - 3D APIs (Rodin, Tripo, Hunyuan3D)
  - Audio APIs (ACE, Stable Audio)
- **Image/Video**: Advanced generation workflows
- **3D/Audio**: Specialized media generation
- **Upscaling**: Enhancement workflows (ESRGAN, etc.)
- **HiDream**: New category for HiDream models

### Recent Development Activity
- **Version**: Currently at 0.1.33 (rapid iteration)
- **Active Areas**: 
  - API template expansion (majority of recent additions)
  - Video generation workflows (WAN models, LTX-V, Hunyuan)
  - Model metadata standardization
  - Thumbnail updates and improvements
- **Commit Patterns**: 
  - Consistent version bumping
  - Fix-forward approach for issues
  - Active maintenance with multiple contributors

## Integration Points

### ComfyUI Frontend Integration
- Templates packaged and distributed via PyPI
- Frontend fetches from package, not GitHub directly
- Template browser UI with category filtering
- Automatic model downloading based on embedded metadata
- Translation system in frontend repository
- DISABLE_TEMPLATES_PROXY environment variable for local testing

### Distribution Channels
1. **PyPI**: Primary distribution as Python package
2. **GitHub Releases**: Created automatically on version bump
3. **Google Cloud Storage**: Synced for additional distribution
4. **Frontend Bundle**: Included in ComfyUI frontend builds

This repository serves as the centralized, quality-controlled source for all official ComfyUI workflow examples, with robust validation, automated distribution, and active community contribution.