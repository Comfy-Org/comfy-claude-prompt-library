# ComfyUI Website Platform - Repository Analysis Guide

## Repository Overview

**Repository**: ComfyUI Website Platform  
**Location**: `~/projects/comfyui-frontend-testing/website/`  
**Purpose**: Web platform for ComfyUI API key management and user dashboard  
**Primary Function**: Allows users to authenticate, manage API keys, view usage logs, and update profile information  

The ComfyUI Website is the official web dashboard for managing API keys that integrate with ComfyUI's AI workflow platform. It provides users with secure authentication, API key lifecycle management, and usage monitoring capabilities.

## Technology Stack

### Core Framework
- **Nuxt 3** (v3.17.4) - Vue.js meta-framework with SSR capabilities
- **Vue 3** (v3.5.16) - Progressive JavaScript framework
- **TypeScript** - Type-safe development with strict typing

### Authentication & Backend
- **Firebase Authentication** (v11.8.1) - User authentication with email/password and OAuth
- **VueFire** (v3.2.1) - Vue.js bindings for Firebase
- **Firebase Admin SDK** (v13.3.0) - Backend Firebase operations

### UI & Styling
- **PrimeVue** (v4.3.3) - Vue UI component library with comprehensive components
- **Tailwind CSS** (v4.1.8) - Utility-first CSS framework
- **PrimeIcons** (v7.0.0) - Icon library
- **Inter Font Family** - Typography with variable font support

### State Management & Data
- **Pinia** (v3.0.2) - Vue state management library
- **Zod** (v3.25.48) - TypeScript-first schema declaration and validation

### Development & Testing
- **Vitest** (v3.2.0) - Unit testing framework
- **Playwright** (v1.52.0) - End-to-end testing
- **ESLint** (v9.28.0) - Code linting with TypeScript support
- **Prettier** (v3.5.3) - Code formatting
- **Husky** (v9.1.7) - Git hooks for quality enforcement

### Internationalization
- **@nuxtjs/i18n** (v9.5.5) - Multi-language support (8 languages: EN, ZH, RU, JA, KO, FR, ES, DE)

## Directory Structure

```
website/
├── assets/                    # Static assets (CSS, fonts, images)
│   ├── css/                  # Global styles (main.css, inter.css)
│   ├── fonts/                # Inter font family files
│   └── images/               # ComfyUI logos and brand assets
├── components/               # Vue components
│   ├── forms/                # Authentication form components
│   └── *.vue                # Feature-specific components
├── composables/              # Vue 3 composables for business logic
├── i18n/locales/            # Translation files for 8 languages
├── layouts/                 # Nuxt layout components
├── middleware/              # Nuxt middleware for route protection
├── pages/                   # File-based routing structure
│   ├── admin/               # Admin dashboard pages
│   └── profile/             # User dashboard pages
├── schemas/                 # Zod validation schemas
├── services/                # Service layer (Firebase, customer API)
├── tests/                   # Comprehensive test suite
│   ├── e2e/                 # Playwright end-to-end tests
│   └── unit/                # Vitest unit tests
├── types/                   # TypeScript type definitions
└── util/                    # Utility functions
```

### Key Files
- **`nuxt.config.ts`** - Nuxt configuration with module setup
- **`CLAUDE.md`** - AI agent development guidelines
- **`app.vue`** - Root application component
- **`components.d.ts`** - Auto-generated component type definitions

## Development Workflow

### Essential Commands
```bash
# Development
npm install                  # Install dependencies
npm run dev                 # Start development server (Node.js 22 LTS)
npm run build              # Build for production
npm run preview            # Preview production build

# Quality Assurance
npm run test               # Run all tests
npm run test:unit          # Run Vitest unit tests
npm run test:e2e           # Run Playwright E2E tests

# Code Quality (runs automatically via lint-staged)
prettier --write           # Format code
eslint --fix              # Lint and auto-fix code
```

### Git Workflow
1. **Create feature branch** from `main`
2. **Submit PR** to `main` branch
3. **Vercel preview deployment** automatically created
4. **Code review** and CI checks must pass
5. **Squash merge** to `main` after approval

### Development Environment
- **Dev Container** support for consistent development environment
- **VSCode** recommended with Dev Containers extension
- **Node.js 22 LTS** required
- **Hot Module Replacement** for rapid development

## Critical Development Guidelines

### Code Quality Standards
- **TypeScript-first** development with strict typing
- **ESLint + Prettier** enforced via git hooks
- **Component-driven** architecture with clear separation of concerns
- **Composable pattern** for business logic reuse
- **Error boundary** handling at all levels

### API Design Principles
From CLAUDE.md guidelines:
- **Clean, sustainable, and scalable public APIs**
- **Domain-driven design** patterns
- **Stable interfaces** that allow for component evolution
- **Restricted access patterns** for security

### Authentication Patterns
- **Firebase-first** authentication strategy
- **JWT token-based** API communication
- **Middleware-driven** route protection
- **OAuth + email/password** support

### Component Conventions
- **PrimeVue components** preferred for UI consistency
- **Tailwind utilities** for styling
- **TypeScript props** with proper validation
- **Emit events** for parent-child communication

## Architecture & Patterns

### Authentication Flow
```
User Login → Firebase Auth → Backend Registration → JWT Token → API Access
```

**Key Components:**
- **`useFirebaseService`** - Central authentication composable
- **`auth.ts` middleware** - Route protection
- **`verified-email.ts` middleware** - Email verification enforcement
- **`admin.global.ts` middleware** - Admin access control

### API Key Management System
```
Authentication → API Key Generation → Backend Storage → Usage Tracking
```

**Components:**
- **`useApiKeys`** composable - API key operations
- **`ApiKeyDisplay.vue`** - Key presentation with security
- **`GenerateApiKeyDialog.vue`** - Key creation workflow

### State Management Pattern
- **Composables over Pinia** for most state
- **Reactive Firebase state** via VueFire
- **Computed properties** for derived state
- **Local component state** for UI-specific data

### Error Handling Strategy
```
Service Layer Error → User-Friendly Message → UI Display → Graceful Degradation
```

## Common Development Tasks

### Adding New Authentication Features
1. **Extend `firebaseService.ts`** with new methods
2. **Update middleware** if route protection needed
3. **Add error mapping** in `handleFirebaseError`
4. **Create UI components** following PrimeVue patterns
5. **Write comprehensive tests** (unit + E2E)

### Creating New API Endpoints
1. **Define TypeScript interfaces** in `types/api.ts`
2. **Create composable** following `useApiKeys` pattern
3. **Implement JWT authentication** with Firebase tokens
4. **Add error handling** with user-friendly messages
5. **Test with realistic mocking** in E2E tests

### Adding New Pages/Routes
1. **Create page component** in `pages/` directory
2. **Add middleware** for authentication/authorization
3. **Implement layout** (default, profile, or admin)
4. **Add translations** in `i18n/locales/`
5. **Write E2E tests** for user flows

### Extending UI Components
1. **Follow PrimeVue component patterns**
2. **Use TypeScript props** with validation
3. **Implement proper error states**
4. **Add accessibility attributes**
5. **Create unit tests** for component logic

## Testing Strategy

### Unit Testing (Vitest)
- **Composable isolation** testing with comprehensive mocking
- **Service layer** testing with Firebase mock implementations
- **Component logic** testing with Vue Test Utils
- **Error scenario** coverage for all code paths

### E2E Testing (Playwright)
- **Sophisticated mocking system** with `MockBuilder` pattern
- **Stateful API mocking** for realistic user flows
- **Authentication flow** testing across all providers
- **Cross-browser testing** with visual regression detection

### Testing Patterns
```typescript
// Unit test pattern
const { result } = await useApiKeys();
expect(result.value).toEqual(expectedData);

// E2E test pattern
const cleanup = await createMockBuilder(page)
  .withAuth({ emailVerified: true })
  .withStatefulApiKeys({ initialKeys: [] })
  .build();
```

## Security Considerations

### Authentication Security
- **Firebase ID tokens** for all API communication
- **Automatic token refresh** handling
- **Secure OAuth flows** with proper redirect handling
- **Email verification** enforcement for sensitive operations

### API Key Security
- **Plaintext keys** only displayed once upon creation
- **Key prefixes** shown in UI for identification
- **Bearer token authentication** for backend API
- **Admin role validation** for privileged operations

### Frontend Security
- **XSS protection** via Vue's built-in sanitization
- **CSRF protection** through Firebase token validation
- **Route protection** via middleware system
- **Input validation** with Zod schemas

## Performance Optimizations

### Build Optimizations
- **SSR disabled** (`ssr: false`) for SPA behavior
- **Module federation** with Nuxt's auto-imports
- **Tree shaking** for minimal bundle size
- **Lazy loading** for route-based code splitting

### Runtime Optimizations
- **Provider hoisting** to prevent Firebase re-initialization
- **Persistent authentication** with `browserLocalPersistence`
- **Intelligent caching** in composables
- **Minimal re-fetching** strategies

## Troubleshooting Guide

### Common Issues

**Permission Denied on Dev Container:**
```bash
sudo chown -R $(whoami):$(whoami) .nuxt
```

**Firebase Authentication Errors:**
- Check environment variables in `.env`
- Verify Firebase project configuration
- Ensure proper OAuth provider setup

**TypeScript Errors:**
- Run `nuxt prepare` to regenerate types
- Check `components.d.ts` for component types
- Verify proper Vue 3 + TypeScript patterns

**Test Failures:**
- Ensure Playwright browsers installed: `npx playwright install --with-deps`
- Check Firebase emulator configuration
- Verify mock data consistency

### Development Tips
- **Use single test execution** instead of full suite for performance
- **Run typecheck** after code changes: `nuxt typecheck`
- **Check ESLint config** for custom rules in `eslint.config.js`
- **Reference PrimeVue docs** at https://primevue.org/ for component usage

## Quality Standards for AI-Assisted Development

### Code Generation Guidelines
- **Follow existing patterns** found in similar components/composables
- **Maintain TypeScript strictness** throughout
- **Use PrimeVue components** over custom implementations
- **Implement proper error handling** with user-friendly messages
- **Add comprehensive tests** for new functionality

### Architecture Consistency
- **Composable-first** for business logic
- **Service layer** for external API communication
- **Middleware** for cross-cutting concerns
- **Component separation** between presentation and logic

This guide provides the foundation for understanding and extending the ComfyUI Website platform, with emphasis on maintaining code quality, security, and user experience standards.