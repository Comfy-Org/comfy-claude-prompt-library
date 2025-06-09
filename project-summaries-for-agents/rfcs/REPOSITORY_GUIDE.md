# ComfyUI RFCs Repository Analysis

## Repository Overview

- **Purpose**: RFC (Request for Comments) process for substantial changes to ComfyUI core, APIs, and standards
- **Repository**: [Comfy-Org/rfcs](https://github.com/Comfy-Org/rfcs)
- **Current Branch**: main
- **License**: Likely MIT (as per ComfyUI ecosystem standards)

This repository manages the formal proposal process for significant changes to the ComfyUI ecosystem, ensuring community input and careful consideration for features that will impact thousands of users and extension developers.

## Technology Stack

- **Primary Format**: Markdown (.md files)
- **Process Management**: GitHub Pull Requests + Discussions
- **Documentation**: GitHub Pages/Discussions integration
- **Development Tools**: Git, GitHub CLI
- **Specifications**: JSON/Python for API definitions

## Directory Structure

```
/home/c_byrne/projects/comfyui-frontend-testing/rfcs/
├── 0000-template.md              # RFC template for new proposals
├── README.md                     # Process documentation and guidelines
├── rfcs/                         # Active and completed RFCs
│   ├── 0000-corenodes.md        # RFC: More Core Nodes
│   ├── 0001-object_info_v2.md   # RFC: object_info API v2
│   ├── 0002-litegraph_native_reroute.md # RFC: Native Reroute
│   ├── 0003-widget-input-socket.md # RFC: Widget Input Socket
│   ├── 0004-widget-values-format.md # RFC: Widget Values Format
│   ├── 0005-subgraph.md         # RFC: Subgraph support
│   └── put_rfcs_here.txt        # Placeholder/instruction file
└── specifications/               # Current API specs and standards
    ├── README.md                # Specifications documentation
    ├── api.js                   # TypeScript API interface
    ├── api.py                   # Python API interface
    ├── node_def.json           # Node definition JSON schema
    ├── node_def.py             # Python node definition format
    └── pyproject.toml          # Custom node pack manifest
```

## Development Workflow

### RFC Submission Process

1. **Pre-RFC Discussion**: Start with GitHub Issues or Discord for initial feedback
2. **Draft RFC**: Copy `0000-template.md` and create `rfcs/0000-my-feature.md`
3. **Submit PR**: Create pull request with RFC markdown file
4. **Community Review**: Automatic discussion thread created for feedback
5. **Core Team Review**: Final evaluation and acceptance/rejection
6. **Implementation**: Accepted RFCs become active and can be implemented

### Essential Commands

```bash
# Clone and setup
git clone git@github.com:Comfy-Org/rfcs.git
cd rfcs

# Create new RFC
cp 0000-template.md rfcs/0000-my-feature.md
# Edit the RFC content
git add rfcs/0000-my-feature.md
git commit -m "[rfc] Add RFC for my-feature"
git push origin feature-branch

# Check RFC status
git log --oneline -10
gh pr list
gh pr view <pr-number>
```

### RFC States

- **Pending**: Submitted as PR with discussion thread
- **Active**: Accepted and undergoing implementation  
- **Landed**: Feature shipped in stable release
- **Rejected**: Officially declined

## Critical Development Guidelines

### RFC Scope (What Requires RFC)

**Substantial changes requiring RFC:**
- New ComfyUI core library additions or backend API modifications
- Major ComfyUI functionality changes (execution engine)
- Workflow.json schema changes
- Custom node standards modifications
- Frontend widgets and APIs requests
- Core nodes that should be provided by ComfyUI
- Developer-facing APIs (like `/prompt` endpoint)

**Does NOT require RFC:**
- Bug fixes
- Documentation improvements
- Minor feature additions via normal PR process

### Writing Quality Standards

- **Convincing motivation**: Clear business/user value
- **Impact understanding**: Demonstrate awareness of consequences
- **Honest assessment**: Include drawbacks and alternatives
- **Implementation detail**: Sufficient for experienced developers
- **Community consideration**: How it affects extension ecosystem

### RFC Template Structure

1. **Metadata**: Start date, target version, related issues
2. **Summary**: Brief feature explanation
3. **Basic Example**: Code samples if applicable
4. **Motivation**: Why this change is needed
5. **Detailed Design**: Comprehensive technical specification
6. **Drawbacks**: Implementation costs and complexity analysis
7. **Alternatives**: Other approaches considered
8. **Adoption Strategy**: Migration path and breaking change assessment
9. **Unresolved Questions**: Outstanding technical decisions

## Architecture & Patterns

### RFC Content Patterns

**Highly Technical RFCs** cover:
- **API Architecture Changes**: Comprehensive restructuring with lazy loading, new endpoints, data format standardization
- **Schema Evolution**: Workflow JSON format changes with backwards compatibility layers
- **Core Functionality**: Fundamental additions like subgraph support requiring new data models
- **Extension Ecosystem**: Changes affecting thousands of custom nodes and developers

**Common Technical Elements:**
- Code examples showing before/after states
- API schemas and endpoint definitions
- Performance analysis and benchmarks
- Migration strategies with compatibility layers
- Phased implementation plans

### Design Principles

1. **Backwards Compatibility**: Critical for ecosystem stability
2. **Performance First**: Impact analysis required for all changes
3. **Extension Ecosystem**: Consider effects on custom nodes
4. **Schema Versioning**: Structured evolution of data formats
5. **Community Input**: Broad stakeholder engagement

### Integration Points

- **ComfyUI Core**: Main application implementation
- **Frontend**: UI/UX changes requiring coordination
- **Backend APIs**: Server-side modifications
- **Custom Nodes**: Extension compatibility considerations
- **Workflow Format**: JSON schema evolution

## Common Development Tasks

### Creating a New RFC

```bash
# 1. Copy template
cp 0000-template.md rfcs/0000-my-feature.md

# 2. Edit RFC following template structure
# - Fill in metadata (date, version, issues)
# - Write compelling motivation
# - Provide detailed technical design
# - Include code examples
# - Address drawbacks honestly
# - Consider alternatives
# - Plan adoption strategy

# 3. Submit for review
git add rfcs/0000-my-feature.md
git commit -m "[rfc] Add RFC for my-feature"
git push origin rfc-my-feature

# 4. Create PR (triggers automatic discussion)
gh pr create --title "RFC: My Feature" --body "See RFC document for details"
```

### Reviewing RFCs

- **Technical Review**: Implementation feasibility and design quality
- **Impact Assessment**: Effects on users, developers, ecosystem
- **Alternative Analysis**: Other approaches and trade-offs
- **Adoption Planning**: Migration complexity and breaking changes

### Implementing Accepted RFCs

1. **Reference Implementation**: Link to implementation PR in RFC
2. **Phased Rollout**: Often implemented in stages
3. **Compatibility Layers**: Maintain backwards compatibility during transition
4. **Documentation Updates**: Update specs and guides
5. **Community Communication**: Announce changes and migration paths

## Meta-Information for AI Agents

### High-Priority Files to Read

1. **README.md** - Complete process understanding
2. **0000-template.md** - RFC structure and requirements
3. **Recent RFCs** (0001-0005) - Current active proposals and patterns
4. **specifications/** - Current API definitions and standards

### Decision Trees for Common Scenarios

**"Should this be an RFC?"**
- Does it change public APIs? → YES
- Does it affect workflow.json format? → YES  
- Does it impact custom node compatibility? → YES
- Is it a substantial architectural change? → YES
- Otherwise → Use normal PR process

**"How to evaluate RFC quality?"**
- Motivation clear and compelling? 
- Technical design detailed enough?
- Drawbacks honestly assessed?
- Alternatives considered?
- Adoption strategy realistic?

### Context for AI Development

- **Ecosystem Scale**: Changes affect thousands of users and developers
- **Stability Priority**: Backwards compatibility is paramount
- **Extension Ecosystem**: Large custom node marketplace must be considered
- **Performance Critical**: ComfyUI is used for real-time AI workflows
- **Community Driven**: Strong emphasis on stakeholder input and consensus

### Common Patterns to Follow

- **Schema Versioning**: Always version API and format changes
- **Compatibility Layers**: Provide migration paths for breaking changes  
- **Phased Implementation**: Roll out complex changes incrementally
- **Performance Analysis**: Include performance impact assessment
- **Documentation**: Update specifications when APIs change

This repository represents the formal governance layer for ComfyUI's evolution, ensuring thoughtful consideration of changes that will impact the broader ecosystem.