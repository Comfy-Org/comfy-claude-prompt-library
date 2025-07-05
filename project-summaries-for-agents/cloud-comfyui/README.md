# ComfyUI Cloud Infrastructure Repository Guide

## Repository Overview
- **Purpose**: Cloud infrastructure for running ComfyUI at scale, providing API-based workflow execution
- **Repository**: https://github.com/Comfy-Org/cloud
- **Language**: Go 1.24.2 with PostgreSQL database
- **Architecture**: Microservices pattern with 3 core services + database

## Technology Stack
- **Backend Language**: Go 1.24.2
- **Database**: PostgreSQL with Ent ORM
- **Infrastructure**: Google Cloud Platform (GCP) with Terraform
- **Container**: Docker with Skaffold for orchestration
- **Development Tools**: Air (hot reloading), Supabase (local DB)
- **Authentication**: Firebase
- **Real-time**: Supabase Realtime for broadcasting

## Directory Structure
```
cloud/
├── database/                # Ent ORM database layer
│   ├── schema/             # Entity definitions
│   ├── migrate/            # Database migrations
│   └── testutil/           # Database testing utilities
├── services/
│   ├── ingest/             # API gateway service
│   │   ├── static/         # Embedded ComfyUI frontend
│   │   └── server/         # HTTP handlers
│   ├── dispatcher/         # Job orchestration service
│   └── inference/          # ComfyUI execution service
├── infrastructure/         # Terraform IaC
│   ├── global/            # Main configuration
│   └── modules/           # Reusable modules
├── integration/           # Integration tests
└── supabase/             # Local database setup
```

## Development Workflow

### Essential Commands
```bash
# Database setup (first time)
supabase start

# Run all services locally
cd services/ingest && ./start.sh     # Port 8080
cd services/dispatcher && ./start.sh  # Port 8081
cd services/inference && ./start.sh   # Port 8082

# Database schema changes
cd database
go generate ./...

# Generate migration files
atlas migrate diff migration --dir "file://ent/migrate/migrations" --to "ent://ent/schema" --dev-url "docker://postgres/15/test?search_path=public"

# Run integration tests
cd integration && go test ./...
```

### Code Quality Tools
- **Linting**: Built into Go toolchain
- **Testing**: `go test ./...` in each service directory
- **Type checking**: Go compiler handles this

## Critical Development Guidelines

### From CLAUDE.md
1. **Database changes require code generation**: Always run `go generate ./...` after schema changes
2. **Service architecture is fixed**: Ingest → Dispatcher → Inference flow
3. **Each service has specific responsibilities**: Don't mix concerns
4. **Use existing patterns**: Check similar endpoints before implementing new ones

### Git and PR Guidelines
1. Use descriptive commit messages focusing on "why" not "what"
2. Keep PRs focused on single features/fixes
3. Include "Fixes #n" in PR descriptions when closing issues
4. Follow existing code patterns in each service

## Architecture & Patterns

### Core Architecture
```
User Request → Ingest Service (8080) → Creates Job
                    ↓
             Dispatcher Service (8081) → Updates Status
                    ↓
             Inference Service (8082) → Executes ComfyUI
                    ↓
             Outputs stored in GCS → Results broadcast via Supabase
```

### Database Entities
- **User**: Authentication, settings, admin flags
- **Job**: Workflow execution tracking (pending → in_progress → completed/error/timeout)
- **Output**: Generated content references
- **History**: Execution history tracking
- **File/FileRelationship**: File management
- **UserData**: User-specific data storage

### Service Communication
- HTTP REST APIs between services
- WebSocket for real-time updates (inference ↔ ComfyUI)
- Supabase Realtime for client broadcasts
- PostgreSQL for shared state

## Common Development Tasks

### Adding a New API Endpoint
1. Update OpenAPI spec in service's `openapi.yaml`
2. Run `go generate ./...` to generate handler interfaces
3. Implement handler in `server/implementation/`
4. Add tests in same directory with `_test.go` suffix

### Modifying Database Schema
1. Edit schema files in `database/schema/`
2. Run `go generate ./...` in database directory
3. Generate migration: `atlas migrate diff ...`
4. Test locally with Supabase
5. Migrations auto-apply in dev/staging

### Debugging Job Flow
1. Check job creation in ingest logs
2. Verify status update in dispatcher logs
3. Monitor WebSocket connection in inference logs
4. Query database for job status: `SELECT * FROM jobs WHERE id = 'uuid'`

### Local Development Setup
1. Install prerequisites: Go 1.24.2, Docker, Supabase CLI
2. Start Supabase: `supabase start`
3. Create `.env` files in each service directory if needed
4. Run services with `./start.sh` scripts
5. Test with curl or frontend at http://localhost:8080

## Service-Specific Details

### Ingest Service (Port 8080)
- **Purpose**: API gateway, authentication, job creation
- **Key endpoints**: `/api/prompt`, `/api/queue`, `/api/history`
- **Static files**: Serves embedded ComfyUI frontend
- **Auth**: Firebase in production, mock in localdev

### Dispatcher Service (Port 8081)
- **Purpose**: Job orchestration and status management
- **Key endpoint**: `/dispatch`
- **Responsibility**: Routes jobs to available inference instances

### Inference Service (Port 8082)
- **Purpose**: ComfyUI execution and output handling
- **Components**: WebSocket client, storage gateway, broadcast system
- **Requirements**: `supabase-credentials.json` for broadcasting

## Testing Strategies
- Unit tests: Each service has `_test.go` files
- Integration tests: `integration/` directory tests service interactions
- Local testing: Use curl or Postman against local services
- Database tests: `testutil` provides test database setup

## Deployment
- **Environments**: localdev, staging, production
- **CI/CD**: GitHub Actions with Cloud Build
- **Infrastructure**: Managed by Terraform in `infrastructure/`
- **Container registry**: Google Container Registry
- **Runtime**: Google Cloud Run

## Key Files to Read First
1. `/cloud/CLAUDE.md` - Critical architecture overview
2. `/cloud/database/schema/job.go` - Core job entity
3. `/cloud/services/ingest/server/implementation/prompt.go` - Job creation flow
4. `/cloud/services/*/README.md` - Service-specific documentation
5. `/cloud/infrastructure/README.md` - Deployment architecture

## Common Pitfalls
1. **Forgetting to run `go generate`** after schema changes
2. **Not starting Supabase** before running services
3. **Port conflicts** - ensure 8080-8082 are free
4. **Missing credentials** - Firebase and Supabase JSON files required
5. **Schema migrations** - Always test locally first

## External Resources
- Ent ORM Documentation: https://entgo.io/
- Supabase Local Development: https://supabase.com/docs/guides/cli/local-development
- ComfyUI Repository: https://github.com/comfyanonymous/ComfyUI
- Atlas Migration Tool: https://atlasgo.io/