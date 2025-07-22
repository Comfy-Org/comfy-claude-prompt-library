# ComfyUI Frontend Release Infrastructure

Comprehensive documentation of the DevOps infrastructure, release processes, and automation workflows for ComfyUI Frontend.

## Release Cycle Overview

### 2-Week Overlapping Release Cycle
- **Development Phase**: 1 week active development on main branch
- **Feature Freeze**: 1 week bug fixes only on core/X.Y branch
- **Overlapping Development**: Next version development starts during current version's freeze
- **Publication**: End of feature freeze triggers release to all distribution channels

### Version Management
- **Current Version**: 1.24.0-1 (semantic versioning)
- **Core Branches**: `core/<major>.<minor>` (e.g., `core/1.23`, `core/1.24`)
- **Release Branches**: Named with target version (e.g., `release/1.23.5`)
- **Nightly Releases**: Available at GitHub releases for testing

## GitHub Workflows Breakdown (14 Total)

### Core Release Workflows
1. **`release.yaml`** - Main release pipeline
   - Triggered by PR merge with "Release" label to main/core/* branches
   - Builds production assets with environment secrets
   - Creates GitHub release (draft for branches, published for main)
   - Publishes to PyPI and npm simultaneously
   - Uses: SENTRY_DSN, ALGOLIA_API, PyPI_TOKEN, NPM_TOKEN

2. **`version-bump.yaml`** - Automated version management
   - Manual trigger with version type (patch/minor/major/prerelease)
   - Creates PR with version increment via `comfy-pr-bot` (not github-actions)
   - Uses special PR_GH_TOKEN for automated PR creation
   - **Cannot use "stable" as version_type** - not in allowed values
   - For pre-release → stable promotion, must manually create PR

3. **`dev-release.yaml`** - Development releases
   - Manual workflow for `.dev` suffix releases to PyPI
   - Allows testing without affecting stable releases

### Testing Workflows
4. **`test-ui.yaml`** - Comprehensive browser testing
   - Playwright tests across multiple browsers (chromium, chromium-2x, mobile-chrome)
   - Sets up ComfyUI backend integration
   - Triggered on push/PR to main/core/*/desktop/* branches

5. **`vitest.yaml`** - Unit and component testing
   - Runs both unit tests and component tests
   - Triggered on push/PR to main branches

6. **`test-browser-exp.yaml`** - Experimental browser tests

### Code Quality Workflows
7. **`eslint.yaml`** - Linting on pull requests
8. **`format.yaml`** - Code formatting checks with Prettier

### Internationalization Workflows
9. **`i18n.yaml`** - Automated translation updates
   - Uses OpenAI API for automated translations
   - Collects new strings requiring translation
   - Commits updates back to PRs automatically

10. **`i18n-custom-nodes.yaml`** - Custom node translations
11. **`i18n-node-defs.yaml`** - Node definition translations

### Dependency Management Workflows
12. **`update-litegraph.yaml`** - LiteGraph dependency updates
13. **`update-electron-types.yaml`** - Electron types updates
14. **`update-manager-types.yaml`** - ComfyUI Manager types updates

## Multi-Channel Release Process

### Distribution Channels

1. **GitHub Releases**
   - Primary distribution method
   - Contains `dist.zip` with compiled frontend assets
   - Draft releases for core branches, auto-publish for main
   - Nightly releases available for testing

2. **PyPI Package** (`comfyui-frontend-package`)
   - Python wrapper around compiled frontend assets
   - Used by ComfyUI backend to fetch specific frontend versions
   - Build process: copies dist/* to `comfyui_frontend_package/static/`
   - Version controlled via `COMFYUI_FRONTEND_VERSION` environment variable

3. **npm Package** (`@comfyorg/comfyui-frontend-types`)
   - TypeScript definitions only for extension developers
   - Separate build process: `npm run build:types`
   - Enables type-safe extension development

### Release Trigger Flow
1. Version bump workflow creates PR with "Release" label
2. PR merge triggers `release.yaml` workflow
3. Production build with environment secrets
4. Simultaneous publication to all three channels
5. Automated release verification and notification

## Core Branch Identification Methodology

### Determining Target Core Branch for Hotfixes

1. **Fetch ComfyUI Requirements**:
   ```bash
   curl -s https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/requirements.txt | grep "comfyui-frontend-package"
   ```

2. **Parse Version**:
   - Extract version from: `comfyui-frontend-package==1.23.4`
   - Parse to get major.minor: `1.23.4` → `1.23`

3. **Determine Core Branch**:
   - Format: `core/<major>.<minor>` (e.g., `core/1.23`)
   - Verify existence: `git ls-remote origin refs/heads/core/*`

### Critical Notes
- **ComfyUI uses `master` branch**, not `main`
- Core branch version will be behind main branch (expected)
- Always verify core branch exists before attempting hotfix

## PyPI Package Structure and Versioning

### Package Configuration
- **Package Name**: `comfyui-frontend-package`
- **Structure**: Python package wrapping compiled frontend assets
- **Static Files**: Frontend dist/* copied to `comfyui_frontend_package/static/`
- **Build Tool**: Python build module with setuptools

### Version Management
- **Source**: `COMFYUI_FRONTEND_VERSION` environment variable
- **Format**: Semantic versioning (e.g., `1.23.4`)
- **Dev Releases**: Append `.dev` suffix for development versions
- **Publishing**: Uses PyPA's official GitHub Action with secure token

### Build Process
```bash
# Production build pipeline
npm run build           # TypeScript + Vite build
npm run zipdist        # Create dist.zip for GitHub
npm run build:types    # Build TypeScript definitions for npm

# Python package build
# Copy dist/* to comfyui_frontend_package/static/
# Set COMFYUI_FRONTEND_VERSION
# python -m build
# Upload to PyPI
```

### Environment Configuration
- **SENTRY_DSN**: Error tracking integration
- **ALGOLIA_APP_ID/API_KEY**: Search functionality
- **USE_PROD_CONFIG**: Production build flag
- **PyPI_TOKEN**: Secure publishing to PyPI
- **NPM_TOKEN**: Publishing TypeScript definitions

## Security and Access Control

### Required Secrets
- `GITHUB_TOKEN`: Standard GitHub Actions token
- `PR_GH_TOKEN`: Special token for automated PR creation
- `NPM_TOKEN`: npm package publishing
- `PYPI_TOKEN`: PyPI package publishing
- `OPENAI_API_KEY`: Automated i18n translations
- `SENTRY_DSN`: Error tracking
- `ALGOLIA_*`: Search API credentials

### Quality Gates
- All tests must pass (unit, component, browser)
- TypeScript compilation required
- ESLint checks enforced on PRs
- Prettier formatting validation
- No `@ts-expect-error` additions allowed

## Hotfix Process Integration

### Cherry-pick Workflow
1. Identify core branch via requirements.txt parsing
2. Create hotfix branch from core branch
3. Cherry-pick commits/PRs with conflict resolution
4. Create PR to core branch (no "Release" label yet)
5. Wait for tests and merge
6. Create version bump PR with **"Release" label** (critical)
7. Merge triggers multi-channel publication

### Critical Success Factors
- **"Release" label**: Required for triggering publication workflows
- **Core branch targeting**: Must target correct core/X.Y branch
- **Version increment**: Must follow semantic versioning
- **Test validation**: All automated tests must pass before release

## Critical Release Gotchas

### update-locales Workflow Issues
- **Problem**: The update-locales workflow sometimes adds commits with `[skip ci]` message to Release PRs
- **Impact**: This prevents the release workflow from triggering when PR is merged
- **Detection**: Check PR commits for `[skip ci]` before merging
- **Behavior**: Inconsistent - sometimes adds `[skip ci]`, sometimes doesn't

### Release Workflow Behavior
- **Runs on main HEAD**: Release workflow uses current main, not the merged commit
- **Cannot release historical commits**: No support for releasing from specific tags/commits
- **No manual trigger**: release.yaml lacks workflow_dispatch option

### PR Creation Details
- **Author**: Version bump PRs created by `comfy-pr-bot`, not `github-actions`
- **Search PRs**: Use `gh pr list --author comfy-pr-bot` to find version bump PRs
- **Workflow Speed**: Version bump workflow typically completes in ~20-30 seconds

## Recovery Strategies

### When Release Workflow Doesn't Trigger

**Option 1: Revert and Retry (Recommended)**
1. Create PR to revert version (e.g., 1.24.0 → 1.24.0-1)
2. Merge the revert PR
3. Run version bump workflow again
4. This creates fresh PR without `[skip ci]`
5. Benefits: Cleaner than creating extra version numbers

**Option 2: Patch Release**
1. Create patch release (e.g., 1.24.1) to trigger workflow
2. Adds extra version but ensures proper distribution
3. Use when revert approach isn't feasible

### Pre-release to Stable Promotion
1. Cannot use version-bump workflow (no "stable" type)
2. Must manually:
   - Create branch: `git checkout -b version-bump-X.Y.Z`
   - Edit package.json to remove pre-release suffix
   - Commit and push
   - Create PR with "Release" label

This infrastructure supports professional-grade continuous delivery with comprehensive quality controls and multiple distribution channels serving different parts of the ComfyUI ecosystem.