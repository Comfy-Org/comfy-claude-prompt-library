# ComfyUI Documentation Repository Guide

## Repository Overview

**Repository**: [Comfy-Org/docs](https://github.com/Comfy-Org/docs)  
**Purpose**: Official documentation site for ComfyUI ecosystem  
**Live Site**: https://docs.comfy.org/  
**Technology**: Mintlify documentation platform with bilingual support  
**License**: Various (see LICENSE file)  

This repository contains the complete documentation for ComfyUI, including user guides, developer documentation, tutorials, and API references. The documentation supports both English and Chinese languages with full content parity.

## Technology Stack

### Core Framework
- **Mintlify 4.1.21** - Modern documentation platform
- **MDX** - Markdown with React components for rich content
- **Sharp 0.33.3** - Image processing for optimized assets
- **Maple Theme** - Custom ComfyUI branding with dark/light modes
- **FontAwesome** - Icon library for navigation and UI elements

### Analytics & Tracking
- **Mixpanel** - User behavior analytics
- **PostHog** - Product analytics and feature tracking

### Development Tools
- **npm** - Package management
- **GitHub Actions** - Automated validation and deployment
- **Vercel** - Hosting and deployment platform

## Directory Structure

### Content Organization
```
/
├── docs.json                 # Mintlify configuration & navigation
├── package.json             # Dependencies and development scripts
├── openapi.yml              # Registry API specification
├── index.mdx                # Homepage content
├── installation/            # Installation guides (all platforms)
├── get_started/             # Getting started tutorials
├── interface/               # UI documentation and guides
├── tutorials/               # Comprehensive tutorial library
├── built-in-nodes/          # Documentation for core nodes
├── development/             # Developer guides and architecture
├── custom-nodes/            # Custom node development
├── comfy-cli/              # CLI tool documentation
├── registry/               # ComfyUI Registry documentation
├── specs/                  # Technical specifications
├── troubleshooting/        # Common issues and solutions
├── community/              # Contributing guidelines
├── snippets/               # Reusable content components
├── images/                 # All documentation assets
├── public/                 # Example workflow files
├── logo/                   # Brand assets
└── zh-CN/                  # Complete Chinese translations
```

### Key File Categories

#### Configuration Files
- `docs.json` - Navigation structure, themes, redirects, localization settings
- `package.json` - Dependencies and development scripts
- `openapi.yml` - API documentation for ComfyUI Registry

#### Content Types
- `.mdx` files - Main documentation content with React components
- `/snippets/*.mdx` - Reusable content blocks for consistent messaging
- `/images/**/*` - Screenshots, diagrams, examples, and brand assets
- `/public/*.json` - Example workflow files for download

## Development Workflow

### Essential Commands
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# The server runs on http://localhost:3000
```

### Content Creation Process
1. **Create/Edit MDX files** in appropriate directory structure
2. **Add navigation entries** in `docs.json` for new pages
3. **Include Chinese translations** in parallel `zh-CN/` structure
4. **Add redirects** if moving or renaming existing files
5. **Test locally** with `npm run dev`
6. **Create PR** - Vercel automatically deploys to https://docs.comfy.org/

### Development Guidelines

#### File Management Rules
- **NEVER move existing files** without adding redirects in `docs.json`
- **Always create Chinese translations** for new English content
- **Use reusable snippets** for common content (installation steps, etc.)
- **Follow existing naming conventions** for consistency

#### Content Standards
- Use descriptive, SEO-friendly filenames
- Include proper frontmatter in MDX files
- Organize images in parallel directory structure
- Reference workflow examples via raw GitHub URLs
- Maintain version compatibility in technical specifications

## Critical Development Guidelines

### Internationalization (i18n) Requirements
- **Mandatory Translation Parity**: Every English content change requires corresponding Chinese update
- **GitHub Actions Validation**: Automated checks enforce translation requirements
- **Navigation Mirroring**: Both language versions must maintain parallel navigation structures
- **Shared Assets**: Images are stored once and referenced by both languages

### Link Stability and Redirects
- **External Link Preservation**: Documentation URLs are referenced in tutorials, templates, and external sites
- **Required Redirects**: Moving files requires redirect rules in `docs.json`
- **GitHub Action Validation**: PRs fail if redirects are missing for moved files
- **Redirect Format**: 
  ```json
  "redirects": [
    {
      "source": "/path/to/old-file",
      "destination": "/path/to/new-file"
    }
  ]
  ```

### Content Organization Principles
- **Hierarchical Structure**: Use nested groups in navigation for logical organization
- **Progressive Complexity**: Tutorials organized from basic to advanced
- **Domain Separation**: Clear boundaries between user guides, developer docs, and API references
- **Asset Correlation**: Images stored in parallel structure to content hierarchy

## Architecture & Patterns

### Navigation Architecture
- **Dropdown-based Navigation**: Four main sections with hierarchical organization
- **Icon Integration**: FontAwesome icons for visual navigation aids
- **Language Switching**: Seamless switching between English and Chinese
- **Deep Linking**: Direct access to specific documentation sections

### Content Management System
- **MDX Components**: React components embedded in Markdown for rich interactions
- **Snippet System**: Centralized reusable content for consistency
- **Asset Pipeline**: Optimized image processing and delivery
- **Version Control Integration**: Git-based content management with automated deployment

### Tutorial Organization Strategy
```
Basic Tutorials (Entry Level)
├── Text-to-image
├── Image-to-image
├── Inpainting/Outpainting
├── LoRA usage
└── Upscaling

Advanced Tutorials (Experienced Users)
├── ControlNet (multiple techniques)
├── Flux Models
├── 3D Generation (Hunyuan3D)
├── Video Generation (LTXV, Hunyuan Video)
└── Audio Generation (ACE Step)

API Integrations (Developer Focused)
├── Image APIs (OpenAI, Stability AI, Luma, etc.)
├── Video APIs (Google, MiniMax, etc.)
└── 3D APIs (Rodin, Tripo)
```

## Common Development Tasks

### Adding New Documentation
1. **Create MDX file** in appropriate English directory
2. **Add navigation entry** in `docs.json` under correct language section
3. **Create Chinese translation** in parallel `zh-CN/` structure
4. **Add Chinese navigation** entry in `docs.json`
5. **Include relevant images** in `/images/` with descriptive paths
6. **Test locally** and create PR

### Updating Existing Content
1. **Edit English MDX file**
2. **Update corresponding Chinese file** in `zh-CN/`
3. **Update images** if needed
4. **Test changes locally**
5. **Submit PR** (GitHub Actions validate translation parity)

### Moving or Renaming Files
1. **Move/rename files** in both English and Chinese directories
2. **Add redirect rules** to `docs.json`
3. **Update navigation** entries in `docs.json`
4. **Test all links** to ensure no broken references
5. **Submit PR** (GitHub Actions validate redirects)

### Managing Workflow Examples
1. **Create workflow in ComfyUI** with embedded model URLs
2. **Use workflow editor tool** to embed metadata
3. **Upload to example_workflows repository**
4. **Reference via raw GitHub URLs** in documentation
5. **Include preview images** in `/images/tutorial/` structure

## Testing and Validation

### Local Testing
```bash
# Start development server
npm run dev

# Test in browser at http://localhost:3000
# Verify all links, images, and navigation work
# Test both English and Chinese content
# Confirm responsive design on mobile
```

### Automated Validation
- **Translation Parity**: GitHub Actions ensure Chinese translations exist
- **Redirect Validation**: Automated checks for required redirects
- **Link Checking**: Validates internal and external links
- **Image Optimization**: Ensures assets are properly optimized

### Pre-PR Checklist
- [ ] Content renders correctly in local development
- [ ] Chinese translations are complete and accurate
- [ ] Navigation entries added to both language sections
- [ ] Images are optimized and properly referenced
- [ ] External links work correctly
- [ ] Redirects added for any moved files

## Troubleshooting Common Issues

### Development Server Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version compatibility
node --version  # Should be compatible with Mintlify requirements
```

### Missing Chinese Translations
- **Error**: GitHub Actions fail with translation validation errors
- **Solution**: Create corresponding file in `zh-CN/` directory with same relative path
- **Check**: Ensure navigation entries exist for both languages in `docs.json`

### Broken Links After File Moves
- **Error**: 404 errors on previously working documentation links
- **Solution**: Add redirect rules to `docs.json` for old → new paths
- **Prevention**: Always add redirects when moving existing files

### Image Loading Issues
- **Error**: Images not displaying in documentation
- **Solution**: Ensure images are in `/images/` directory with correct relative paths
- **Format**: Use web-optimized formats (WebP, PNG, JPG)
- **Size**: Keep images under 1MB for optimal loading

## Extension and Customization

### Adding New Tutorial Categories
1. **Create directory structure** in `/tutorials/new-category/`
2. **Add corresponding Chinese directory** in `/zh-CN/tutorials/new-category/`
3. **Update navigation** in `docs.json` for both languages
4. **Create category overview** page explaining the tutorial series
5. **Add relevant images** in `/images/tutorial/new-category/`

### Custom MDX Components
- **Location**: Components can be defined in MDX files or externally
- **Usage**: Embed React components directly in Markdown content
- **Examples**: Interactive workflow viewers, code snippets, callout boxes
- **Best Practice**: Keep components simple and focused on content enhancement

### API Documentation Updates
1. **Update OpenAPI spec** in `openapi.yml`
2. **Regenerate API docs** using Mintlify scraping tools
3. **Update navigation** to include new endpoints
4. **Add usage examples** in relevant tutorial sections
5. **Test API documentation** for accuracy and completeness

## Meta-Information for AI Agents

### Priority Files for Understanding
1. **docs.json** - Complete navigation and configuration
2. **README.md** - Development setup and contribution guidelines
3. **package.json** - Technology stack and scripts
4. **Key tutorial files** - Understanding content patterns
5. **Snippet files** - Reusable content components

### Decision Trees for Common Tasks

#### Adding New Content
```
New Content → Is it user-facing or developer docs?
├── User-facing → What skill level?
│   ├── Beginner → /tutorials/basic/
│   ├── Intermediate → /tutorials/[specific-topic]/
│   └── Advanced → /tutorials/advanced/ or /tutorials/[specific-api]/
└── Developer → What type?
    ├── API Integration → /development/comfyui-server/
    ├── Custom Nodes → /custom-nodes/
    └── Registry → /registry/
```

#### Content Updates
```
Content Change → What type of change?
├── Text only → Edit MDX + Chinese translation
├── Structure change → Update navigation in docs.json
├── File move → Add redirects + update navigation
└── New images → Add to /images/ with proper path structure
```

This repository represents a mature, well-architected documentation system that balances user accessibility with developer needs while maintaining strong internationalization support and content governance practices.