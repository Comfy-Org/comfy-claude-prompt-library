# ANALYZE Repository for Claude

Your task is to create a comprehensive repository analysis guide optimized for Claude Code to understand how the repository works. This guide will serve as documentation that helps AI agents quickly get up-to-speed on the codebase.

## Storage System

All repository summaries are stored in `~/project-summaries-for-agents/`:
- `filepath-mapping.json`: Maps repository file paths to summary folder names
- Individual folders contain the actual summary files for each repository

## Process Overview

1. **Check for existing summary**: Before starting, check if a summary already exists for this repository path
2. **If exists**: Focus on IMPROVING the existing summary (shorter process)
3. **If new**: Create a comprehensive new summary (full analysis process)

## For Existing Summaries (Improvement Mode)

When a summary already exists:
1. Read the existing summary file
2. Identify gaps, outdated information, or areas needing enhancement
3. Update specific sections rather than rewriting everything
4. Focus on recent changes, new patterns, or missed architectural details
5. Keep the improvement process concise and targeted

## For New Summaries (Full Analysis Mode)

### Repository Analysis Methodology

You should exhaust all available resources to understand the repository:

#### 1. Check for DeepWiki Documentation
- Visit https://deepwiki.com/[repo-owner]/[repo-name] to see if comprehensive documentation exists
- Example: https://deepwiki.com/Comfy-Org/ComfyUI_frontend for the Comfy-Org/ComfyUI_frontend repo
- Extract all available architectural and development information

#### 2. Analyze Local Repository Structure
- Examine the current working directory and identify key files
- Check for CLAUDE.md files that contain development guidelines
- Read README files at multiple levels (root, subdirectories)
- Identify package.json, requirements.txt, or equivalent dependency files
- Look for configuration files (vite.config, tsconfig.json, etc.)

#### 3. Research Official Documentation
- Use WebSearch to find official project documentation
- Look for developer guides, API documentation, and architecture overviews
- Check for contributing guidelines and development setup instructions

#### 4. Examine Git History and Development Patterns
- Use `git log --oneline -20` to understand recent development activity
- Check `git status` and `git diff` to understand current state
- Use GitHub CLI (`gh`) to examine recent PRs, issues, and releases
- Identify commit message patterns and development workflow

#### 5. Analyze Codebase Architecture
- Identify main technologies, frameworks, and libraries used
- Map out directory structure and file organization patterns
- Understand build systems, testing frameworks, and development tools
- Document core modules, services, and architectural patterns

## Output Format

Create a comprehensive markdown guide that includes:

### Repository Overview
- Purpose and main functionality
- Repository ownership and links
- Current version and license information

### Technology Stack
- Primary languages and frameworks
- Key dependencies and their versions
- Build tools and development environment

### Directory Structure
- Well-organized overview of folder hierarchy
- Purpose of each major directory
- Key files and their roles

### Development Workflow
- Essential commands for development, testing, and building
- Code quality tools (linting, formatting, type checking)
- Testing strategies and commands

### Critical Development Guidelines
- Coding standards and patterns to follow
- API design principles
- Git and PR guidelines
- Important rules from CLAUDE.md files

### Architecture & Patterns
- Core architectural concepts
- Extension/plugin systems
- State management approaches
- Communication patterns

### Common Development Tasks
- How to add new features
- Testing procedures
- Deployment processes
- Troubleshooting guides

## Meta-Optimization for Claude Code

Remember that this guide will be consumed by AI agents, so:

### Structure for AI Consumption
- Use clear, hierarchical markdown formatting
- Include specific file paths and line references where relevant
- Provide concrete code examples and patterns
- Use consistent terminology throughout

### Action-Oriented Information
- Focus on "how to do X" rather than just "what is X"
- Include specific commands and their purposes
- Highlight critical files that Claude should prioritize reading
- Provide decision trees for common development scenarios

### Context-Rich Details
- Explain WHY certain patterns exist, not just WHAT they are
- Include common pitfalls and how to avoid them
- Document the relationship between different parts of the system
- Explain the impact of changes on various components

### Optimization for Different Use Cases
- Separate beginner vs. advanced information clearly
- Include both conceptual understanding and practical implementation
- Provide templates and examples for common tasks
- Link to relevant external documentation and resources

## Quality Standards

The final guide should:
- Be comprehensive yet concise
- Enable rapid onboarding for new contributors
- Serve as a reliable reference for development decisions
- Help AI agents understand the codebase's unique patterns and conventions
- Provide actionable guidance for common development tasks

Focus on creating a guide that maximizes the effectiveness of AI-assisted development while maintaining accuracy and completeness.