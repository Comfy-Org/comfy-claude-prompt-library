# ComfyUI-Copilot Repository Guide

## Repository Overview

**ComfyUI-Copilot** is an AI-powered intelligent assistant for ComfyUI that simplifies and enhances the AI algorithm debugging and deployment process through natural language interactions. Built by Alibaba International Digital Commerce (AIDC-AI), it provides intuitive node recommendations, workflow building aids, and model querying services.

- **Repository**: https://github.com/AIDC-AI/ComfyUI-Copilot
- **Current Version**: 1.3.3
- **License**: MIT
- **Language Support**: Python 3.10+, TypeScript/React
- **Type**: ComfyUI Custom Node Extension

## Core Purpose

ComfyUI-Copilot serves as an intelligent assistant that:
- Lowers barriers to entry with natural language interaction
- Provides AI-driven node suggestions and workflow implementations  
- Offers real-time assistance for development challenges
- Enables parameter exploration and optimization (GenLab feature)
- Supports personalized workflow generation based on user requirements

## Technology Stack

### Backend (Python)
- **Framework**: Integrated with ComfyUI's server system (aiohttp)
- **Core Dependencies**: 
  - `asyncio` for async operations
  - `aiohttp` for web server integration
  - ComfyUI's `server` and `folder_paths` modules
- **Architecture**: Custom node extension that extends ComfyUI's prompt server

### Frontend (React/TypeScript)
- **Framework**: React 18.2.0 with TypeScript 5.2.2
- **Build System**: Vite 5.4.14 with custom configuration
- **UI Library**: Tailwind CSS 3.4.15 with custom styling
- **Key Dependencies**:
  - `@heroicons/react`, `@tabler/icons-react` for icons
  - `react-markdown` with `remark-gfm`, `remark-math`, `rehype-katex`
  - `dexie` and `dexie-react-hooks` for client-side database
  - `fuse.js` for search functionality
  - `vis-network` for graph visualization
  - `jsencrypt` for RSA encryption

### Development Tools
- **Linting**: ESLint with Prettier integration
- **Type Checking**: TypeScript with strict configuration
- **CSS Processing**: PostCSS with Tailwind and Autoprefixer
- **Build Optimization**: Custom Vite configuration with code splitting

## Directory Structure

```
ComfyUI-Copilot/
├── __init__.py                    # Main entry point, web route registration
├── pyproject.toml                 # Python project configuration
├── service/                       # Backend services
│   ├── conversation_service.py    # Chat API endpoints and session management
│   └── node_service.py           # Node-related operations
├── ui/                           # Frontend React application
│   ├── package.json              # NPM dependencies and scripts
│   ├── vite.config.ts            # Build configuration
│   ├── src/
│   │   ├── main.tsx              # React entry point
│   │   ├── App.tsx               # Root component
│   │   ├── components/           # UI components
│   │   │   ├── chat/             # Chat interface components
│   │   │   ├── debug/            # Parameter debug interface (GenLab)
│   │   │   └── markdown/         # Markdown rendering
│   │   ├── context/              # React context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── apis/                 # API integration layer
│   │   ├── types/                # TypeScript type definitions
│   │   └── utils/                # Utility functions
├── entry/                        # Compiled JavaScript entry files
├── dist/                         # Built frontend assets
└── public/                       # Static assets and workflow templates
    └── workflows/                # Pre-built workflow templates
```

## Critical Development Guidelines

### Code Standards
- **Python**: Follow ComfyUI extension patterns, use async/await for I/O operations
- **TypeScript**: Strict typing enabled, prefer interfaces over types
- **React**: Functional components with hooks, context for state management
- **CSS**: Scoped Tailwind classes, component-specific styling

### Architecture Principles
- **Extension Integration**: Deep integration with ComfyUI's canvas and API system
- **State Management**: Context-based with localStorage persistence
- **API Design**: Streaming responses for real-time chat experience
- **Performance**: Lazy loading, code splitting, memoization for heavy operations

### Git and Development Workflow
- **Commit Messages**: Conventional commits with Chinese descriptions (feat:, fix:, etc.)
- **Branching**: Feature branches merged to main, active development on parameter_debug_dev
- **Build Process**: Multi-environment builds (dev, pre-production, production)

## Architecture & Patterns

### Frontend Architecture

#### Component Hierarchy
```
App (Root)
├── ChatProvider (Context)
└── WorkflowChat (Main Container)
    ├── ChatHeader
    ├── Tab Navigation (Chat | GenLab)
    ├── Chat Tab:
    │   ├── MessageList (with specialized message types)
    │   ├── ChatInput (with image upload)
    │   └── SelectedNodeInfo
    └── GenLab Tab:
        └── ParameterDebugInterface (modular screen-based architecture)
```

#### State Management
- **Primary Pattern**: `useReducer` with `ChatContext`
- **Persistence**: localStorage with session-based caching
- **Real-time Updates**: Streaming API responses with incremental message updates

#### API Integration
- **Streaming Chat**: AsyncGenerator pattern for real-time responses
- **Security**: RSA encryption for API key protection
- **Error Handling**: Graceful degradation with user-friendly messages

### Backend Architecture

#### Integration Pattern
- **Extension Model**: Registers as ComfyUI custom node
- **Web Routes**: Extends ComfyUI's PromptServer with custom endpoints
- **Session Management**: In-memory session storage with message history

#### Key Endpoints
- `/workspace/workflow_gen` - Main chat interface
- `/workspace/fetch_messages_by_id` - Message history retrieval
- `/api/chat/invoke` - Advanced chat with image support

### ComfyUI Integration

#### Deep Integration Features
- **Canvas Integration**: Real-time node selection events
- **Sidebar Extension**: Professional sidebar tab registration
- **Workflow Management**: Import/export workflow JSON files
- **Theme Adaptation**: Automatic dark/light theme switching

## Development Workflow

### Essential Commands

#### Frontend Development
```bash
cd ui/
npm install                    # Install dependencies
npm run dev                   # Development server
npm run build                 # Production build
npm run build:pre             # Pre-production build
npm run build:prod           # Production build with specific API endpoint
npm run lint                 # ESLint checking
```

#### Build Process
```bash
npm run build:css            # Build Tailwind CSS
node scripts/post-build.js   # Post-build processing
```

#### Installation as ComfyUI Extension
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/AIDC-AI/ComfyUI-Copilot
# Or install via ComfyUI Manager
```

### Code Quality Tools
- **TypeScript**: Strict type checking enabled
- **ESLint**: React and TypeScript rules with Prettier integration
- **Prettier**: Code formatting with specific configuration
- **Git Hooks**: Pre-commit formatting (setupGitHooks.js)

### Testing Strategy
- **Manual Testing**: Extensive manual testing with ComfyUI integration
- **Browser Testing**: Cross-browser compatibility verification
- **Performance Testing**: Bundle size optimization and loading performance

## Common Development Tasks

### Adding New Chat Message Types

1. **Create Message Component** in `ui/src/components/chat/messages/`
2. **Update Message Types** in `types/types.ts`
3. **Register in MessageList** for rendering
4. **Update Backend Response** in `conversation_service.py`

### Extending API Functionality

1. **Backend Route** in `service/conversation_service.py`
2. **Frontend API Call** in `apis/workflowChatApi.ts`  
3. **Type Definitions** in `types/types.ts`
4. **Component Integration** in relevant UI components

### Adding New Debug/GenLab Features

1. **Screen Component** in `components/debug/screens/`
2. **Utility Functions** in `components/debug/utils/`
3. **Type Definitions** in `components/debug/types/`
4. **State Management** updates in debug interface

### Workflow Template Management

1. **Add JSON file** to `public/workflows/`
2. **Update template loading** in `conversation_service.py`
3. **Test workflow compatibility** with ComfyUI

## Integration Points

### ComfyUI Extension System
- **Registration**: Uses ComfyUI's sidebar extension API
- **Event System**: Custom events for node selection and canvas interaction
- **API Access**: Full access to ComfyUI's internal APIs and graph manipulation

### External APIs
- **Chat Service**: Configurable API endpoints for different environments
- **Model Services**: Integration with various AI model providers
- **Security**: RSA encryption for API key management

### Data Persistence
- **Client-side**: localStorage for session data and preferences
- **Server-side**: In-memory session storage for chat history
- **Workflow Storage**: JSON files in public directory

## Key Features Implementation

### Chat Interface
- **Real-time Streaming**: AsyncGenerator-based message streaming
- **Message Types**: Extensible system for different response types
- **Image Support**: Base64 image upload and processing
- **Session Management**: UUID-based session tracking

### GenLab (Parameter Debug)
- **Parameter Exploration**: Batch execution with different parameter combinations
- **Prompt Rewriting**: AI-assisted prompt optimization
- **History Tracking**: Local storage of exploration results
- **Visual Comparison**: Side-by-side result analysis

### Node Management
- **Smart Search**: Fuzzy search with Fuse.js
- **Installation Guidance**: Automatic redirection to GitHub repositories
- **Downstream Recommendations**: AI-powered subgraph suggestions
- **Parameter Documentation**: Comprehensive node parameter explanations

## Performance Considerations

### Frontend Optimizations
- **Code Splitting**: Strategic lazy loading and dynamic imports
- **Bundle Analysis**: Optimized vendor chunks for common dependencies
- **Memory Management**: Efficient message list rendering and state cleanup
- **Theme Switching**: Optimized CSS-in-JS with ComfyUI theme integration

### Backend Optimizations
- **Async Operations**: Non-blocking I/O for all network operations
- **Streaming Responses**: Chunked response delivery for real-time experience
- **Session Management**: Efficient in-memory storage with cleanup

## Troubleshooting Guide

### Common Issues

#### Build Failures
- **Node Version**: Ensure Node.js 16+ for optimal compatibility
- **Dependency Conflicts**: Use `npm install --legacy-peer-deps` if needed
- **Tailwind CSS**: Run `npm run build:css` if styles not updating

#### ComfyUI Integration Issues
- **Extension Loading**: Verify custom_nodes directory structure
- **API Conflicts**: Check for port conflicts on ComfyUI server
- **Theme Issues**: Ensure proper CSS injection for theme switching

#### Development Issues
- **Hot Reload**: Use development mode with proper Vite configuration
- **CORS Issues**: Development mode handles CORS with proxy configuration
- **TypeScript Errors**: Check strict mode settings in tsconfig.json

### Debug Resources
- **Console Logs**: Extensive logging in development mode
- **Network Tab**: Monitor streaming API responses
- **React DevTools**: Component state and context inspection
- **ComfyUI Console**: Backend error logging and debugging

## Meta-Information for AI Assistants

### Priority Files for Understanding
1. **`__init__.py`** - Entry point and web route setup
2. **`ui/src/main.tsx`** - Frontend initialization and ComfyUI integration
3. **`ui/src/context/ChatContext.tsx`** - Core state management
4. **`service/conversation_service.py`** - Backend API implementation
5. **`ui/package.json`** - Dependencies and build scripts
6. **`ui/vite.config.ts`** - Build configuration and optimization

### Key Architectural Decisions
- **Hybrid Architecture**: Python backend with React frontend for optimal ComfyUI integration
- **Extension Pattern**: Non-intrusive integration preserving ComfyUI functionality
- **Real-time Communication**: Streaming architecture for responsive user experience
- **Modular Design**: Component-based architecture enabling easy feature additions

### Common Modification Patterns
- **Message Types**: Follow existing pattern in `messages/` directory
- **API Endpoints**: Extend `conversation_service.py` with proper TypeScript types
- **UI Components**: Use existing hooks and context patterns
- **Workflow Templates**: JSON files with proper validation

This guide provides comprehensive information for AI agents to understand and work effectively with the ComfyUI-Copilot codebase, focusing on practical development tasks while maintaining the project's architectural integrity.