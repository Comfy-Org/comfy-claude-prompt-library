# ComfyUI Frontend Development Onboarding

## Engineering-First Onboarding Philosophy

Based on best practices from Facebook, Stripe, and Uber, this onboarding treats technical setup as a critical engineering problem with measurable outcomes.

### Core Principles
1. **Ship Code on Day One**: Deploy real code immediately to build confidence
2. **Mentorship as Infrastructure**: Formal mentorship program, not ad-hoc
3. **Learning Through Real Work**: Use actual bugs and features from backlog
4. **Documentation as Code**: Version controlled, peer reviewed, continuously updated
5. **Measure What Matters**: Track time to first PR, productive contribution, satisfaction

## Quick Start Guide

### Goal: Ship your first code change within Day 1

**Prerequisites:**
- Node.js v20+
- Python 3.12+
- Git
- Code editor

**Setup ComfyUI Backend:**
1. Follow manual install guide: https://docs.comfy.org/installation/manual_install
2. Start backend: `python main.py`
3. Backend runs at `http://localhost:8188`

**Setup Frontend:**
```bash
git clone https://github.com/Comfy-Org/ComfyUI_frontend.git
cd ComfyUI_frontend
npm install
npm run prepare
npm run dev
```
Frontend runs at `http://localhost:5173`

**Your First Code Change:**
1. Open `src/components/topbar/TopMenubar.vue`
2. Change "ComfyUI" text to "ComfyUI - Dev Mode"
3. See live reload in browser
4. Commit: `git commit -m "[feat] Add dev mode indicator to top menubar"`

## Development Environment

### Testing Framework
- **Unit Testing**: Vitest with happy-dom
- **Component Testing**: Co-located `.spec.ts` files
- **Browser Testing**: Playwright with ComfyUI backend integration

**Key Commands:**
```bash
# Unit tests
npm run test:unit -- Button.spec.ts
npm run test:unit -- --watch
npm run test:unit -- --ui

# Browser tests (requires --multi-user backend)
cd ComfyUI && python main.py --multi-user
npm run test:browser
npx playwright test --ui
```

### Code Quality Automation
- **Pre-commit Hooks**: Husky with lint-staged
- **ESLint**: TypeScript + Vue 3 rules
- **Prettier**: Single quotes, no semicolons, 2-space indent
- **Type Checking**: Vue-tsc integration

**Manual Commands:**
```bash
npm run lint              # Check issues
npm run lint:fix          # Auto-fix
npm run format           # Format all files
npm run typecheck        # Type checking
```

### Build & Deployment
```bash
# Development
npm run dev              # Hot reload with Vue DevTools

# Production
npm run build            # Optimized bundle
npm run preview          # Preview production locally

# With environment variables
export ALGOLIA_APP_ID=your_app_id
export ALGOLIA_API_KEY=your_api_key
npm run build
```

## Architecture Overview

### Key Technologies
- **Vue 3**: Composition API with TypeScript
- **Vite**: Build tool with fast HMR
- **LiteGraph**: Canvas-based node editor
- **PrimeVue**: UI component library
- **Pinia**: State management

### Project Structure
```
ComfyUI_frontend/
├── src/
│   ├── components/      # Vue components
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript definitions
│   └── utils/           # Utility functions
├── tests-ui/            # Unit tests
├── browser_tests/       # Playwright tests
└── dist/                # Build output
```

### Development Workflow
1. **Feature Branch**: `git checkout -b feature/your-feature`
2. **Development**: Make changes, tests auto-run
3. **Quality Checks**: Pre-commit hooks run linting/formatting
4. **Testing**: Unit, component, and browser tests
5. **Pull Request**: GitHub with automated CI/CD
6. **Deployment**: Production build to `dist/`

## Common Issues & Solutions

### Setup Problems
- **Frontend won't start**: `rm -rf node_modules && npm install`
- **Backend connection errors**: Ensure backend on port 8188
- **TypeScript errors**: `npm run typecheck -- --force`
- **Git hooks not working**: `npm run prepare`

### Testing Issues
- **Browser tests fail**: Backend must run with `--multi-user`
- **Playwright missing**: `npx playwright install`
- **ComfyUI_devtools**: Must be installed in custom_nodes

### Performance Optimization
- **Build analysis**: `npm run build -- --analyze`
- **Development profiling**: `npm run dev -- --profile`
- **Memory usage**: 16GB+ RAM recommended for large workflows

## Success Metrics

You've successfully completed onboarding when you can:
- ✅ Run full development environment locally
- ✅ Make code changes and see them in browser
- ✅ Run tests and linting without errors
- ✅ Submit your first pull request
- ✅ Deploy a change to nightly build

## Integration with ComfyUI Backend

### Local Development
```bash
# Use local frontend with ComfyUI backend
cd ComfyUI
python main.py --front-end-root ../ComfyUI_frontend/dist
```

### Backend Integration Points
- **API Communication**: WebSocket and REST endpoints
- **Node Registry**: Dynamic loading of custom nodes
- **Workflow Execution**: Real-time progress updates
- **Model Management**: Loading and inference coordination

## Best Practices

### Code Quality
- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Co-locate component tests with components
- Maintain consistent code formatting

### Performance
- Implement lazy loading for large components
- Use canvas scaling for node editor
- Optimize with requestAnimationFrame for updates
- Monitor bundle size and performance metrics

### Testing Strategy
- Unit tests for utility functions
- Component tests for Vue components
- Browser tests for integration scenarios
- Visual regression testing for UI changes

This onboarding guide ensures new developers can contribute meaningfully to ComfyUI's frontend while maintaining code quality and performance standards.