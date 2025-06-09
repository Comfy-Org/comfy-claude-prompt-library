# Comfy-CLI Repository Guide for Claude Code

## Repository Overview

**Purpose**: Command Line Interface for Managing ComfyUI - a comprehensive CLI tool that simplifies installation, configuration, and management of ComfyUI, a powerful open-source machine learning framework for Stable Diffusion workflows.

**Repository**: [Comfy-Org/comfy-cli](https://github.com/Comfy-Org/comfy-cli)  
**License**: GNU General Public License v3.0  
**Stars**: 453+ (as of 2025)  
**Primary Language**: Python  
**Minimum Python**: 3.9+

## Technology Stack

### Core Dependencies
- **Typer**: Command-line interface framework (≥0.9.0)
- **Rich**: Terminal formatting and progress bars
- **UV**: Modern Python dependency resolver and installer
- **GitPython**: Git operations
- **PyYAML**: Configuration file handling
- **Requests/HTTPX**: HTTP client operations
- **Mixpanel**: Analytics and telemetry
- **Questionary**: Interactive prompts

### Development Tools
- **Ruff**: Linting and formatting (line-length: 120, target: py39)
- **Pytest**: Testing framework with coverage
- **Pre-commit**: Git hooks for code quality

## Directory Structure

```
comfy-cli/
├── comfy_cli/                    # Main package
│   ├── __main__.py              # Entry point
│   ├── cmdline.py               # Primary CLI interface with Typer
│   ├── constants.py             # Centralized config (URLs, enums, paths)
│   ├── workspace_manager.py     # Workspace detection and management
│   ├── config_manager.py        # Persistent configuration
│   ├── env_checker.py           # Environment validation
│   ├── tracking.py              # Analytics system
│   ├── command/                 # Command implementations
│   │   ├── install.py          # ComfyUI installation logic
│   │   ├── launch.py           # Process launching and management
│   │   ├── run.py              # Workflow execution
│   │   ├── custom_nodes/       # Node management system
│   │   │   ├── command.py      # Main node operations
│   │   │   ├── cm_cli_util.py  # ComfyUI-Manager integration
│   │   │   └── bisect_custom_nodes.py # Debug problematic nodes
│   │   └── models/
│   │       └── models.py       # Model downloading and management
│   ├── registry/               # ComfyUI Registry integration
│   │   ├── api.py             # REST API client
│   │   ├── types.py           # Data classes
│   │   └── config_parser.py   # PyProject.toml handling
│   ├── standalone.py          # Standalone Python environment
│   ├── uv.py                  # UV-based dependency management
│   ├── file_utils.py          # File operations and downloads
│   ├── git_utils.py           # Git repository operations
│   ├── ui.py                  # Rich-based UI components
│   └── utils.py               # General utilities
├── tests/                      # Test suite
│   ├── comfy_cli/             # Unit tests (mirrors source structure)
│   ├── e2e/                   # End-to-end workflow tests
│   └── uv/                    # Dependency resolution tests
├── assets/                     # Demo media
├── pyproject.toml             # Project configuration
├── README.md                  # User documentation
└── DEV_README.md             # Development guide
```

## Development Workflow

### Essential Commands

```bash
# Setup development environment
pip install -e .                    # Install in editable mode
export ENVIRONMENT=dev               # Enable development mode
pre-commit install                   # Install git hooks

# Development workflow
comfy --help                        # Test CLI functionality
python -m comfy_cli.__main__         # Run via module

# Code quality
ruff check .                        # Lint code
ruff format .                       # Format code
pytest tests/                       # Run test suite
pytest tests/comfy_cli/specific_test.py  # Run specific test

# Testing with coverage
pytest --cov=comfy_cli tests/       # Generate coverage report
```

### VSCode Debug Configuration
```json
{
  "name": "Python Debugger: Run",
  "type": "debugpy",
  "request": "launch",
  "module": "comfy_cli.__main__",
  "args": [],
  "console": "integratedTerminal"
}
```

## Critical Development Guidelines

### Code Standards and Patterns

1. **Use Typer for all command interfaces**: Follow existing command structure patterns
2. **Rich for console output**: Use `rich.print`, progress bars, and tables
3. **Singleton pattern for managers**: Use `@singleton` decorator for stateful classes
4. **Tracking decorators**: Add `@tracking.track_command()` to new commands
5. **Error handling**: Use Typer exceptions and Rich formatting for user-friendly errors

### API Design Principles

**CRITICAL**: This tool is used by thousands of users with extensive custom node ecosystems. Design APIs that:

- **Maintain backward compatibility**: Never break existing command signatures
- **Use clear, descriptive command names**: Follow `comfy <noun> <verb>` pattern
- **Provide consistent option naming**: Use existing patterns for workspace, output, etc.
- **Handle edge cases gracefully**: Validate inputs and provide helpful error messages
- **Support extensibility**: New commands should fit the hierarchical structure

### Workspace Management Patterns

**Priority Resolution Order**:
1. Explicit: `--workspace=<path>`
2. Recent: `--recent` (last used)
3. Current: `--here` (current directory)
4. Default: Set via `comfy set-default`

**Critical Files to Understand**:
- `workspace_manager.py:45-120` - Workspace resolution logic
- `cmdline.py:65-93` - Global option validation
- `constants.py:20-30` - Default workspace paths

### Git and PR Guidelines

**Commit Message Format**: Use conventional commits without colons:
- `[feat] add new model download source`
- `[fix] resolve Unicode error in Windows`
- `[docs] update CLI reference`

**PR Requirements**:
- Include "Fixes #n" for issue references
- Keep descriptions concise (1-3 sentences)
- Run full test suite: `pytest tests/`
- Ensure code quality: `ruff check . && ruff format .`

## Architecture & Patterns

### Command Hierarchy Design

```python
# Main app with hierarchical subcommands
app = typer.Typer()
app.add_typer(custom_nodes.app, name="node")
app.add_typer(models_command.app, name="model")

# Global options with mutual exclusivity
@app.callback()
def entry(
    workspace: Optional[str] = typer.Option(None, callback=g_exclusivity.validate),
    recent: Optional[bool] = typer.Option(None, callback=g_exclusivity.validate),
    here: Optional[bool] = typer.Option(None, callback=g_exclusivity.validate),
):
    # Workspace resolution logic
```

### Dependency Management Architecture

The UV-based dependency system handles complex scenarios:

1. **Core ComfyUI** requirements resolution
2. **Custom node** dependency aggregation
3. **GPU-specific** PyTorch installation
4. **Conflict detection** and user interaction

**Key Implementation**: `uv.py:DependencyCompiler` class

### Registry Integration

**Publishing Flow**:
1. Validate node structure (`ruff --select S` security checks)
2. Package respecting `.gitignore` and `includes` field
3. Upload to signed URL with metadata
4. Update registry with node information

**Critical Security**: All uploaded nodes undergo security validation

## Common Development Tasks

### Adding New Commands

1. **Create command module**: `comfy_cli/command/new_feature/`
2. **Implement command class**:
   ```python
   import typer
   from comfy_cli.tracking import track_command
   
   app = typer.Typer()
   
   @app.command()
   @track_command
   def new_action(name: str):
       """Add new functionality"""
       # Implementation
   ```
3. **Register in cmdline.py**: `app.add_typer(new_feature.app, name="feature")`
4. **Add tests**: `tests/comfy_cli/command/test_new_feature.py`

### Adding New Model Sources

1. **Extend URL pattern matching** in `models/models.py`
2. **Add download logic** following existing patterns
3. **Update model type detection** in constants
4. **Add tests** with mock responses

### Testing Procedures

**Unit Tests**: Focus on individual component logic
```bash
pytest tests/comfy_cli/test_specific.py -v
```

**Integration Tests**: Test command interactions
```bash
pytest tests/e2e/ -v
```

**Mock Strategy**: Use `unittest.mock` for external services:
- HTTP requests
- File system operations
- Git operations
- Process execution

### Deployment Process

**Automated via CI/CD**:
1. Version bumping in `pyproject.toml`
2. PyPI publishing via `pypa/gh-action-pypi-publish`
3. Security scanning and validation
4. Test execution across Python versions

## Troubleshooting Guides

### Common Issues

1. **Import Errors**: Check if package installed in editable mode (`pip install -e .`)
2. **Command Not Found**: Verify entry points in `pyproject.toml`
3. **Workspace Resolution**: Use `comfy which` to debug path detection
4. **Dependency Conflicts**: Check UV resolver output and custom node requirements

### Debug Patterns

1. **Enable debug logging**: Set `ENVIRONMENT=dev`
2. **Trace workspace resolution**: Add logging to `workspace_manager.py`
3. **Mock external services**: Use test fixtures for HTTP calls
4. **Breakpoint debugging**: `import ipdb; ipdb.set_trace()`

### Performance Considerations

- **UV is fast**: Prefer UV over pip for dependency operations
- **Concurrent operations**: Use async patterns for network operations
- **Caching**: Leverage workspace metadata caching
- **Progress feedback**: Always show progress for long operations

## Meta-Optimization for Claude Code

### Priority Files for Understanding

**High Priority** (read first):
1. `cmdline.py` - Command structure and global options
2. `workspace_manager.py` - Core workspace logic
3. `constants.py` - Configuration and constants
4. `DEV_README.md` - Development patterns

**Medium Priority** (context-dependent):
1. `command/install.py` - Installation logic
2. `uv.py` - Dependency management
3. `registry/api.py` - Registry integration
4. `command/custom_nodes/command.py` - Node management

### Decision Trees

**When adding new functionality**:
1. Is it a new command? → Add to `command/` directory
2. Is it workspace-related? → Extend `workspace_manager.py`
3. Is it configuration? → Update `config_manager.py`
4. Is it dependency-related? → Modify `uv.py`

**When debugging issues**:
1. Command not found? → Check `cmdline.py` registration
2. Workspace issues? → Debug with `comfy which`
3. Dependency issues? → Check UV resolver output
4. Import errors? → Verify package installation

### Code Patterns to Follow

**Command Structure**:
```python
@app.command()
@tracking.track_command
def action_name(
    required_param: str,
    optional_param: Optional[str] = typer.Option(None, help="Description"),
):
    """Clear command description"""
    # Implementation with error handling
```

**Error Handling**:
```python
try:
    # Operation
except SpecificError as e:
    raise typer.Exit(1) from e
```

**Progress Reporting**:
```python
with Progress() as progress:
    task = progress.add_task("Description", total=100)
    # Update progress.update(task, advance=10)
```

This guide provides Claude Code with comprehensive understanding of comfy-cli's architecture, development patterns, and best practices for effective AI-assisted development while maintaining code quality and user experience standards.