# ComfyUI Registry Web Frontend - Comprehensive Repository Analysis

## Repository Overview

**Purpose**: Frontend React application for the ComfyUI Registry, a public collection platform for ComfyUI custom nodes and extensions.

**Repository Details**:
- **GitHub**: https://github.com/Comfy-Org/registry-web
- **Live Site**: https://comfyregistry.org (production), https://registry.comfy.org (alternative)
- **Current Version**: 0.1.2
- **License**: Not specified
- **Organization**: Comfy-Org (Official ComfyUI organization)

**Mission**: Provide a secure, versioned marketplace for ComfyUI custom nodes with discovery, installation, rating, and management capabilities.

## Technology Stack

### Core Framework & Libraries
- **Framework**: Next.js 15.3.3 (React 18.2.0)
- **Runtime**: Bun (preferred) + Node.js 20+ support
- **Language**: TypeScript 5.8.3
- **Build System**: Next.js with Webpack 5 + MDX support

### UI & Styling
- **CSS Framework**: Tailwind CSS 3.4.17
- **Component Library**: Flowbite React 0.7.5
- **Icons**: React Icons 5.4.0
- **Theme**: Custom Comfy-branded color scheme with dark mode support

### State Management & Data Fetching
- **API Client**: Axios 1.9.0 with custom Firebase JWT interceptor
- **State Management**: TanStack React Query 5.79.0 with persistence
- **Form Handling**: React Hook Form 7.57.0 + Zod 3.25.46 validation
- **Caching**: LocalStorage with selective query persistence

### Search & Discovery
- **Search Engine**: Algolia InstantSearch 4.78.3
- **Components**: React InstantSearch 7.15.8 with Next.js router integration
- **Features**: Autocomplete, query suggestions, hierarchical filtering

### Authentication & Security
- **Auth Provider**: Firebase Authentication 10.14.1
- **User Management**: React Firebase Hooks 5.1.1
- **JWT Integration**: Automatic token attachment to API requests

### Development & Testing
- **Component Development**: Storybook 8.6.14
- **Visual Testing**: Chromatic integration
- **Testing Framework**: Vitest 3.1.4 with browser testing
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

### Analytics & Monitoring
- **Analytics**: Mixpanel Browser 2.65.0
- **Notifications**: React Toastify 9.1.3

## Directory Structure

```
/
├── .github/workflows/          # CI/CD pipelines
├── .storybook/                # Storybook configuration
├── components/                # React components (organized by feature)
│   ├── AccessTokens/          # API key management
│   ├── AuthUI/               # Authentication components
│   ├── CodeBlock/            # Code syntax highlighting
│   ├── DeveloperRegistry/    # Developer registration
│   ├── Header/               # Site navigation
│   ├── Labels/               # Tag/label components
│   ├── Search/               # Search functionality
│   ├── common/               # Shared UI components
│   ├── nodes/                # Node management components
│   ├── publisher/            # Publisher management
│   └── registry/             # Registry browsing
├── docs/                     # Documentation
├── pages/                    # Next.js pages (file-based routing)
│   ├── admin/               # Admin-only pages
│   ├── auth/                # Authentication pages
│   ├── nodes/               # Node detail pages
│   └── publishers/          # Publisher pages
├── public/                   # Static assets
│   ├── fonts/               # Custom fonts (Glacial Indifference, League Spartan)
│   └── images/              # Icons and graphics
├── src/                     # Source code
│   ├── api/                 # API client and generated types
│   ├── analytic/            # Analytics utilities
│   ├── hooks/               # Custom React hooks
│   ├── mapper/              # Data transformation utilities
│   └── stories/             # Storybook stories
├── styles/                  # Global CSS
└── utils/                   # Utility functions
```

## Development Workflow

### Essential Commands

```bash
# Development
bun install              # Install dependencies
bun dev                 # Start development server (localhost:3000)
bun build               # Production build
bun start               # Start production server

# Code Quality
bun run lint            # ESLint checking
bun run fix             # Auto-fix ESLint issues
bun run format          # Check Prettier formatting
bun run format-fix      # Auto-format with Prettier

# Component Development
bun run storybook       # Start Storybook (localhost:6006)
bun run build-storybook # Build Storybook static files
bun run chromatic       # Run visual testing

# API Generation
bun orval               # Generate API types from OpenAPI spec
```

### Code Quality Standards

- **TypeScript**: Strict mode enabled, no implicit any
- **ESLint**: Next.js config + Prettier integration
- **Prettier**: Automatic formatting on save and in CI
- **Import Sorting**: Automatic package.json sorting in CI

### Testing Strategy

- **Component Testing**: Storybook with Vitest browser integration
- **Visual Testing**: Chromatic for UI regression detection
- **Manual Testing**: Development server for integration testing

## Architecture & Design Patterns

### Component Architecture

**Hierarchical Organization**:
- **Pages**: File-based routing with Next.js
- **Feature Components**: Grouped by domain (auth, nodes, publishers)
- **Common Components**: Shared UI primitives and layouts
- **HOCs**: Authentication and URL parameter management

**Key Patterns**:
- **Container/Presentation**: Separation of data fetching and UI
- **Custom Hooks**: Encapsulated state logic (e.g., `useRouterQuery`)
- **Provider Pattern**: Query client and theme providers
- **Compound Components**: Complex UI components with sub-components

### State Management

**API State**: TanStack React Query with selective persistence
- User data cached in localStorage
- Publisher data persistence for offline access
- Automatic retry logic with 404 handling
- Query key strategy for efficient caching

**Local State**: React Hook Form for forms, useState for UI state
**Authentication State**: Firebase Auth with React hooks integration

### API Integration

**Auto-Generated Client**: Orval generates React Query hooks from OpenAPI spec
- **Source**: Backend OpenAPI endpoint (configurable environment)
- **Output**: `src/api/generated.ts` with typed hooks
- **Custom Instance**: Axios with Firebase JWT token injection
- **Error Handling**: Automatic retry logic and error boundaries

### Search Architecture

**Algolia Integration**:
- **Index**: `nodes_index` for searchable nodes
- **Query Suggestions**: `nodes_index_query_suggestions`
- **Hierarchical Facets**: Category-based filtering
- **Router Integration**: Search state synced with URL

### Authentication Flow

**Firebase Authentication**:
1. User signs in through Firebase Auth UI
2. JWT token automatically attached to API requests
3. User state persisted across sessions
4. Admin routes protected with HOCs
5. Analytics tracking for authenticated users

## Critical Development Guidelines

### API Design Principles

**Generated Types**: Always use Orval-generated types for API interactions
- Never manually define API interfaces
- Regenerate types when backend changes
- Use custom Axios instance for consistent auth headers

**Error Handling**:
- 404s should not trigger retries
- Network errors retry up to 3 times
- Toast notifications for user-facing errors

### Component Development Standards

**Storybook-First Development**:
- All components should have Storybook stories
- Test different states and props variations
- Include accessibility checks in stories
- Use Chromatic for visual regression testing

**Accessibility**:
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Color contrast compliance

**Performance**:
- Lazy loading for heavy components
- Image optimization with Next.js Image
- Query persistence for frequently accessed data

### Security Practices

**Firebase Security**:
- JWT tokens automatically expire and refresh
- No sensitive data in localStorage
- Admin routes properly protected
- Environment variables for sensitive config

**Content Security**:
- Image domains whitelisted in Next.js config
- No inline scripts or unsafe eval
- Sanitized user-generated content

### Git & PR Guidelines

**Branch Strategy**:
- `main`: Production deployments (auto-deployed to comfyregistry.org)
- `dev`: Development branch for feature integration
- `staging`: Pre-production testing (if needed)

**Commit Messages**: Follow conventional commits pattern
**PR Requirements**: Prettier formatting, ESLint passing, build success

## Common Development Tasks

### Adding New Features

1. **Component Development**:
   ```bash
   # Create component in appropriate feature directory
   # Add Storybook story
   # Test with Storybook
   bun run storybook
   ```

2. **API Integration**:
   ```bash
   # Update OpenAPI spec in backend
   # Regenerate types
   bun orval
   # Use generated hooks in components
   ```

3. **Styling**:
   - Use Tailwind classes with custom Comfy theme colors
   - Follow Flowbite component patterns
   - Test dark mode compatibility

### Testing Procedures

**Component Testing**:
```bash
# Run Storybook tests
bun run test-storybook

# Visual testing
bun run chromatic
```

**Integration Testing**:
```bash
# Start development server
bun dev
# Test user flows manually
# Check network tab for API calls
```

### Deployment Process

**Production Deployment**:
1. Create PR to `main` branch
2. Ensure CI passes (linting, building, Chromatic)
3. Merge PR
4. Vercel automatically deploys to https://comfyregistry.org

**Environment Variables**:
- `NEXT_PUBLIC_BACKEND_URL`: API endpoint
- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration
- `CHROMATIC_PROJECT_TOKEN`: Visual testing token

### Troubleshooting Common Issues

**API Generation Issues**:
- Ensure backend is running and accessible
- Check OpenAPI endpoint availability
- Verify environment variables

**Build Failures**:
- Run `bun run lint --fix` for ESLint issues
- Run `bun run format-fix` for Prettier issues
- Check TypeScript errors with strict mode

**Storybook Issues**:
- Clear Storybook cache: `rm -rf node_modules/.cache`
- Restart with `bun run storybook`

## Integration Points

### ComfyUI Ecosystem

**Registry Backend**: RESTful API with OpenAPI specification
**ComfyUI-Manager**: Extension that consumes registry data
**Security Scanning**: Backend scans for malicious node behavior
**Version Management**: Semantic versioning for node compatibility

### External Services

**Algolia**: Search indexing and query processing
**Firebase**: Authentication and user management
**Vercel**: Hosting and deployment platform
**Chromatic**: Visual testing and UI review
**Google Cloud Storage**: Asset hosting with CORS configuration

## Meta-Optimization for AI Development

### Claude Code Integration Points

**High-Priority Files**:
- `src/api/generated.ts`: Auto-generated API client (read-only)
- `orval.config.ts`: API generation configuration
- `components/*/`: Feature-specific React components
- `pages/*/`: Next.js routing and page components

**Configuration Files**:
- `next.config.ts`: Build and deployment configuration
- `tailwind.config.cjs`: Styling system configuration
- `tsconfig.json`: TypeScript compilation settings

**Development Utilities**:
- `package.json`: Scripts and dependency management
- `.github/workflows/`: CI/CD pipeline definitions
- `.storybook/`: Component development environment

### Decision Trees for Common Scenarios

**Adding New API Endpoint**:
1. Update backend OpenAPI spec
2. Run `bun orval` to regenerate types
3. Import and use generated hooks in components
4. Add error handling for new endpoint

**Creating New Page**:
1. Add file to `pages/` directory (Next.js routing)
2. Create associated components in `components/`
3. Add Storybook stories for new components
4. Update navigation if needed

**Modifying Existing Component**:
1. Check if component has Storybook story
2. Make changes and test in Storybook
3. Run Chromatic for visual regression testing
4. Update tests if behavior changes

### Context-Rich Development Information

**Why Certain Patterns Exist**:
- **Orval Generation**: Ensures type safety and reduces manual API client maintenance
- **Storybook Integration**: Enables component-driven development and visual testing
- **Firebase Auth**: Provides secure, scalable authentication with JWT tokens
- **TanStack Query**: Handles complex caching scenarios for node discovery

**Common Pitfalls**:
- Don't manually edit `src/api/generated.ts` (auto-generated file)
- Always test components in Storybook before integration
- Remember to update environment variables for different deployments
- Ensure new components follow accessibility guidelines

**Impact of Changes**:
- API changes require regenerating types and may break existing components
- Component changes should be visually tested to prevent UI regressions
- Authentication changes affect all protected routes and API calls
- Search configuration changes impact user discovery experience

This comprehensive guide enables rapid onboarding for AI agents and human developers, providing both conceptual understanding and practical implementation guidance for the ComfyUI Registry Web frontend.