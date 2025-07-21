# Comfy-PR Repository Guide

## Repository Overview

**Purpose**: Comfy-PR is an automated system that helps ComfyUI Custom Node authors publish their nodes to the [Comfy Registry](https://registry.comfy.org/). It automatically creates pull requests to add necessary configuration files and GitHub Actions workflows to custom node repositories.

**Repository**: [Comfy-Org/Comfy-PR](https://github.com/Comfy-Org/Comfy-PR)  
**Homepage**: https://comfy-pr.vercel.app/  
**Description**: Automated PR creation system for growing the ComfyUI community by streamlining custom node publishing  
**Created**: May 18, 2024  
**License**: ISC  

## Technology Stack

### Primary Technologies
- **Runtime**: Bun (v1.1.21+) - JavaScript/TypeScript runtime
- **Framework**: Next.js 15.2.4 with React 19
- **Language**: TypeScript (strict mode enabled)
- **Database**: MongoDB with hot-resource connection management
- **Authentication**: NextAuth v5 with Google/GitHub OAuth
- **Styling**: Tailwind CSS with DaisyUI components

### Key Dependencies
- **GitHub Integration**: Octokit v4 for GitHub API interactions
- **CLI Tools**: comfy-cli (Python) for node operations
- **Process Management**: zx v8 for shell command execution
- **Communication**: Slack Web API, Gmail integration via Google APIs
- **Development**: Vitest for testing, ESLint/Prettier for code quality

### Build & Deployment
- Docker support with compose files
- Vercel deployment integration
- GitHub Actions for automation
- MongoDB for persistent storage

## Directory Structure

```
/home/c_byrne/projects/comfy-testing-environment/Comfy-PR/
├── app/                        # Next.js 15 app directory
│   ├── (dashboard)/           # Dashboard pages and components
│   │   ├── details/           # PR details view
│   │   ├── followup/          # Follow-up actions (Gmail, etc.)
│   │   ├── repos/             # Repository management
│   │   ├── rules/             # Follow-up rules management
│   │   └── totals/            # Analytics and charts
│   ├── api/                   # API routes
│   │   ├── auth/              # NextAuth configuration
│   │   ├── trpc/              # tRPC API endpoints
│   │   └── openapi.yaml/      # OpenAPI specification
│   └── tasks/                 # Task management pages
│       ├── github-action-update/
│       └── github-contributor-analyze/
├── src/                       # Core business logic
│   ├── cli.ts                 # CLI entry point
│   ├── index.ts               # Main worker entry point
│   ├── db/                    # Database utilities
│   ├── gh/                    # GitHub-specific utilities
│   ├── slack/                 # Slack integration
│   └── GithubActionUpdateTask/ # GitHub Action update tasks
├── templates/                 # PR and workflow templates
│   ├── add-toml.md           # PR template for pyproject.toml
│   ├── publish.yaml          # GitHub Action workflow template
│   └── follow-rules.yaml     # Follow-up rules configuration
├── scripts/                   # Utility scripts
├── docs/                      # Documentation
└── packages/                  # Internal packages
```

### Key Files and Their Roles

- `src/cli.ts`: CLI tool entry point for manual PR creation
- `src/index.ts`: Main worker that runs scheduled tasks
- `src/createComfyRegistryPullRequests.ts`: Core PR creation logic
- `src/makeTomlBranch.ts`: Creates pyproject.toml branches
- `src/makePublishBranch.ts`: Creates GitHub Actions workflow branches
- `app/layout.tsx`: Next.js root layout
- `docker-compose.yml`: Development environment setup

## Development Workflow

### Essential Commands

```bash
# Install dependencies
bun install

# Development server (Next.js app)
bun dev

# Run the main worker
bun src/index.ts

# Create PRs manually via CLI
bun src/cli.ts [GITHUB_REPO_URL]

# Run tests
bun test

# Type checking
bun run dev:tsc

# Production build
bun run build
```

### Environment Setup

1. **Required Environment Variables** (`.env` or `.env.local`):
   ```bash
   # GitHub authentication
   GH_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   
   # PR source organization (optional, defaults to user account)
   FORK_OWNER=ComfyNodePRs
   
   # PR branch prefix
   FORK_PREFIX=PR-
   
   # MongoDB connection (for worker mode)
   MONGODB_URI=mongodb://localhost:27017
   
   # Optional integrations
   SLACK_TOKEN=xoxb-XXXXXXXXXXXXX
   OPENAI_API_KEY=sk-XXXXXXXXXXXXX
   ```

2. **GitHub Token Requirements**:
   - Pull requests: Read and write
   - Workflows: Read and write
   - Metadata: Read-only

3. **SSH Key Setup**: Required for pushing code automatically

### Testing & Quality

- Run tests: `bun test`
- Watch mode: `bun test --watch`
- Linting: `bun run lint`
- Type checking: `bun run dev:tsc`

## Critical Development Guidelines

### Git and PR Workflow

1. **Automated PR Creation Process**:
   - Fork target repository
   - Create two branches:
     - `pyproject` branch: Adds pyproject.toml configuration
     - `publish` branch: Adds GitHub Actions workflow
   - Submit PRs with templated descriptions
   - Track PR status and provide follow-ups

2. **PR Templates**:
   - Located in `templates/` directory
   - Customizable markdown templates for different PR types
   - Includes instructions for node authors

3. **Branch Management**:
   - Uses `FORK_PREFIX` for branch naming
   - Implements force-push for updating existing branches
   - Cleans up local directories before operations

### Database Schema Patterns

- Collections use MongoDB with indexed fields
- Common pattern: `{ mtime: Date, ...data }`
- Implements $fresh/$stale pipeline operators for time-based queries
- Hot resource management for connection pooling

### Authentication & Security

- NextAuth v5 for user authentication
- OAuth providers: Google and GitHub
- MongoDB adapter for session storage
- API routes protected by authentication

## Architecture & Patterns

### Core Architectural Concepts

1. **Worker-Based Architecture**:
   - Main worker (`src/index.ts`) runs scheduled tasks
   - Parallel task execution with Promise.all
   - Automatic retry and error handling
   - CI environment detection for proper termination

2. **PR Creation Pipeline**:
   ```
   Repository URL → Fork Creation → Branch Modifications → PR Submission → Status Tracking
   ```

3. **Follow-Up System**:
   - Rule-based follow-up actions
   - Multiple notification channels (Slack, Email, GitHub comments)
   - Configurable rules in YAML format

### State Management

- MongoDB for persistent state
- Collections:
  - `CNRepos`: Custom node repositories
  - `CRPulls`: Pull request tracking
  - `Authors`: Contributor information
  - `FollowRules`: Automated follow-up rules
  - `GithubActionUpdateTask`: Action update tasks

### Communication Patterns

- **GitHub Integration**: Direct API calls via Octokit
- **Slack Notifications**: Web API for channel messages
- **Email**: Gmail API integration for follow-ups
- **Dashboard**: Real-time status via Next.js app

## Common Development Tasks

### Adding a New PR Type

1. Create template in `templates/` directory
2. Add branch creation logic in `src/` 
3. Update `createComfyRegistryPullRequests.ts` to include new type
4. Add corresponding UI in dashboard if needed

### Running Local Development

```bash
# Start MongoDB (if using docker)
docker compose -f docker-compose.mongodb.yml up

# Run development server
bun dev

# In another terminal, run worker tasks
bun src/index.ts
```

### Creating Manual PRs

```bash
# Single repository
bun src/cli.ts https://github.com/owner/repo

# Multiple repositories from file
bun src/cli.ts --repolist repos.txt

# Using environment variable
REPO=https://github.com/owner/repo bun src/cli.ts
```

### Debugging PR Creation

1. Check logs in console output
2. Verify GitHub token permissions
3. Ensure SSH keys are properly configured
4. Check MongoDB for PR status records
5. Review dashboard at https://comfy-pr.vercel.app

### Monitoring & Analytics

- Dashboard provides real-time PR status
- Totals analytics for tracking progress
- CSV/YAML export functionality
- Slack notifications for important events

## Important Implementation Notes

### Error Handling
- Comprehensive try-catch blocks in async operations
- Graceful degradation when services unavailable
- Detailed error logging with context

### Performance Considerations
- Parallel processing with `p-map` for batch operations
- Connection pooling for MongoDB
- Efficient git operations with cleanup
- 45-minute timeout for CI environments

### Security Best Practices
- Environment variables for sensitive data
- OAuth for user authentication
- Validated GitHub webhook signatures
- Sanitized user inputs in API routes

## Quick Reference Commands

```bash
# Development
bun dev                    # Start Next.js dev server
bun src/index.ts          # Run worker tasks
bun test                  # Run tests

# Production
bun run build             # Build for production
bun run start             # Start production server
vercel --prod             # Deploy to Vercel

# CLI Usage
bunx comfy-pr [URL]       # Create PR for repository
bun src/cli.ts --help     # Show CLI help

# Docker
docker compose up         # Start development environment
docker compose build      # Build containers
```

## Resources & Links

- **Comfy Registry**: https://registry.comfy.org/
- **Dashboard**: https://comfy-pr.vercel.app/
- **Documentation**: https://docs.comfy.org/
- **Discord**: Join server and contact robinken
- **CLI Tool**: `pip install comfy-cli`