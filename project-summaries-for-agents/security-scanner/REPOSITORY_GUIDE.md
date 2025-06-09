# Security Scanner Repository Guide

## Repository Overview

**Purpose**: A cloud function that scans custom node packages for security issues in the [Comfy Registry](https://registry.comfy.org) ecosystem.

**Repository**: `/home/c_byrne/projects/comfy-testing-environment/security-scanner`  
**Owner**: Comfy-Org  
**License**: Not specified  
**Type**: Google Cloud Function (Python)

The security scanner serves as an automated gateway for all custom node packages published to the Comfy Registry. It performs multi-layered security analysis on custom node packages before they become available for installation through ComfyUI Manager.

## Technology Stack

### Primary Languages & Frameworks
- **Python 3.x** - Core implementation language
- **Google Cloud Functions Framework** - Serverless deployment platform
- **Flask** - HTTP request handling

### Key Dependencies
```
functions_framework    # Google Cloud Functions runtime
requests              # HTTP client for downloading packages
yara-python          # Pattern matching engine for malware detection
openai               # GPT-based code analysis (currently disabled)
tiktoken             # Token counting for LLM interactions
pylint               # Python static analysis
tree_sitter          # Multi-language parsing (Python, JS, TS, CSS, HTML, JSON, TOML, YAML)
chardet              # Character encoding detection
aiohttp              # Async HTTP client for URL validation
nest_asyncio         # Nested async event loop support
python-dotenv        # Environment variable management
```

### Testing & Development
```
pytest               # Test framework
pytest-asyncio       # Async test support
requests             # HTTP testing utilities
```

## Directory Structure

```
security-scanner/
├── main.py                           # Entry point: security_scan cloud function
├── requirements.txt                  # Production dependencies
├── test-requirements.txt             # Testing dependencies
├── pytest.ini                       # Pytest configuration
├── docs/                            # Documentation
│   └── URL_SCANNING_POLICY.md       # Detailed URL scanning methodology
├── scan/                            # Core scanning modules
│   ├── web.py                       # Main orchestrator: security_scan_url()
│   ├── yara_scan.py                 # YARA-based pattern matching
│   ├── gpt_scan.py                  # GPT-based code analysis (disabled)
│   ├── pylint_custom_plugin_scan.py # Custom Pylint checkers
│   ├── remove_comments.py           # Comment removal preprocessing
│   ├── unzip_files.py               # Archive extraction utilities
│   └── util.py                      # Helper functions and decorators
├── utils/
│   └── issue.py                     # Standardized issue schema and validation
├── tests/                           # Test suite
│   ├── conftest.py                  # Pytest configuration and fixtures
│   ├── samples/                     # Test data
│   │   ├── positive/                # Malicious samples (should trigger alerts)
│   │   └── negative/                # Safe samples (should pass)
│   ├── test_yara_scan.py           # YARA scanner tests
│   ├── test_pylint_custom_plugin_scan.py # Pylint checker tests
│   ├── test_remove_comments.py     # Comment removal tests
│   ├── test_web.py                 # Integration tests
│   └── types_.py                   # Type definitions for tests
├── yara-rules/                     # Security detection rules
│   ├── contains_malicious_url.yara # Known malicious URL detection
│   ├── contains_blacklisted_url.yara # Suspicious service detection
│   ├── contains_custom_url_dependency.yara # Non-PyPI dependency detection
│   ├── contains_obfuscated_url.yara # Encoded/hidden URL detection
│   ├── downloads_and_executes.yara # Malware deployment patterns
│   ├── contains_rm_rf.yara         # Dangerous file deletion
│   ├── contains_btc_address.yara   # Cryptocurrency mining detection
│   ├── imports_cryptography_py.yara # Cryptography usage monitoring
│   └── signature-base/             # External YARA rule collection
└── gpt_scan_huge_file_debug.py    # Debug utility for large file analysis
```

## Development Workflow

### Essential Commands

#### Local Development Setup
```bash
# Install dependencies
pip install -r requirements.txt
pip install functions-framework

# Environment setup
source .env  # Must contain OPENAI_API_KEY

# Start local development server
functions-framework --target=security_scan
```

#### Testing Commands
```bash
# Run all tests
pytest

# Run specific test modules
pytest tests/test_yara_scan.py
pytest tests/test_pylint_custom_plugin_scan.py

# Run with verbose output
pytest -s -v

# Test with sample data
curl -m 10 -X POST http://localhost:8080/security_scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/snomiao/comfy-malicious-node-test-bad-archive/archive/refs/heads/main.zip"}'
```

#### Manual Testing
```bash
# Test main function directly
python main.py
```

### Code Quality Tools
- **pytest**: Comprehensive test suite with fixtures and async support
- **YARA**: Pattern-based malware detection with custom rules
- **Pylint**: Custom checkers for specific security patterns
- **No explicit linting/formatting**: Repository doesn't specify linters like black, flake8, mypy

## Critical Development Guidelines

### Security Scanning Architecture
The scanner employs a **multi-layered defense strategy**:

1. **File Filtering**: Only scans specific file types (Python, JS, HTML, config files)
2. **Size Limits**: 10MB general files, 100KB config files
3. **Comment Removal**: Preprocesses source code to avoid false positives
4. **Pattern Matching**: YARA rules for known attack patterns
5. **Static Analysis**: Pylint checkers for dangerous code constructs
6. **URL Validation**: Real-time threat intelligence via URLhaus API
7. **Post-Match Filtering**: Whitelist legitimate services and URLs

### Core Scanning Pipeline
```python
# scan/web.py:security_scan_url()
Download ZIP → Extract → [GPT Scan] → YARA Scan → Pylint Scan → Aggregate Issues
```

### Issue Standardization
All scanners must use the `utils.issue.Issue` class for consistent reporting:

```python
@dataclass
class Issue:
    file_path: str           # Relative path within package
    line_number: int         # 1-based line number
    issue_type: str          # Standardized issue identifier
    severity: Severity       # CRITICAL, HIGH, MEDIUM, LOW, INFO
    scanner: str             # Which scanner detected the issue
    description: str         # Human-readable explanation
    code_snippet: Optional[str]  # Offending code line
    recommendation: Optional[str] # How to fix
    metadata: Dict[str, Any]      # Scanner-specific details
```

### YARA Rule Development
- **Rule Location**: `yara-rules/` directory
- **File Extensions**: `.yar` or `.yara`
- **Metadata Requirements**: Include `severity`, `description`, `category`
- **Post-Match Filters**: Define filters in `yara_scan.py:POST_MATCH_FILTERS`
- **External Variables**: Use `ext` (file extension) and `filename` for conditional matching

### Pylint Custom Checkers
- **Checker Classes**: Inherit from `pylint.checkers.BaseChecker`
- **Message Codes**: Use W9xxx format for warnings
- **Registration**: Register in `scan_by_pylint()` function
- **Current Checkers**:
  - `SubprocessPipChecker`: Detects `subprocess` calls with `pip install`
  - `ProhibitedStringChecker`: Detects hardcoded sensitive strings

### URL Scanning Policy
See [`docs/URL_SCANNING_POLICY.md`](docs/URL_SCANNING_POLICY.md) for comprehensive URL detection methodology:

- **Malicious URLs**: Real-time validation via URLhaus API
- **Blacklisted Services**: File sharing, paste sites, tunneling services
- **Custom Dependencies**: Non-PyPI package sources with whitelist
- **Obfuscated URLs**: Encoded/compressed URL detection

## Architecture & Patterns

### Modular Scanner Design
Each scanner is a self-contained module with standardized interface:
```python
def scan_by_X(directory: str, temp_dir_prefix: str) -> List[Dict]:
    """
    Args:
        directory: Path to extracted package
        temp_dir_prefix: Base path for relative file reporting
    Returns:
        List of standardized issue dictionaries
    """
```

### Async URL Validation
YARA post-match filters support async operations for external API calls:
```python
POST_MATCH_FILTERS = {
    "contains_malicious_url": [filter_matched_urls],  # Async URLhaus lookup
    "contains_custom_url_dependency": [filter_url_dependencies],  # Sync whitelist
}
```

### Caching Strategy
- **URL Cache**: `yara_scan.py` maintains in-memory cache of URLhaus results
- **File Encoding Cache**: LRU cache for file encoding detection
- **Compiled Rules Cache**: Global YARA rules compilation

### Error Handling Patterns
- **Graceful Degradation**: Individual scanner failures don't abort entire scan
- **Retry Logic**: `@retry_with_backoff` decorator for external API calls
- **File Safety**: Temp directory cleanup in `finally` blocks

## Common Development Tasks

### Adding New YARA Rules
1. **Create Rule File**: `yara-rules/new_rule_name.yara`
2. **Define Metadata**: Include required fields (severity, description)
3. **Add Post-Match Filter** (if needed): Update `POST_MATCH_FILTERS` dict
4. **Test Rule**: Add test cases in `tests/samples/`
5. **Update Documentation**: Document detection logic

### Adding New Pylint Checkers
1. **Create Checker Class**: Inherit from `BaseChecker`
2. **Define Messages**: Use W9xxx format
3. **Implement Visitors**: Override `visit_*` methods
4. **Register Checker**: Add to `scan_by_pylint()` function
5. **Add Tests**: Create test cases with positive/negative samples

### Testing New Scanners
1. **Create Test Data**: Add samples to `tests/samples/positive/` and `negative/`
2. **Write Tests**: Follow existing patterns in `test_*.py` files
3. **Integration Testing**: Test via main scanner entry point
4. **Manual Testing**: Use curl commands with local server

### Debugging Scanner Issues
1. **Enable Verbose Output**: Use `pytest -s -v` for detailed logs
2. **Check File Processing**: Ensure files meet size/type requirements
3. **Validate Issue Schema**: Check `Issue` class validation errors
4. **Test Individual Scanners**: Run scanners in isolation
5. **Examine Post-Match Filters**: Debug async URL validation

### Deploying Changes
1. **Test Locally**: Full test suite must pass
2. **Update Dependencies**: Modify `requirements.txt` if needed
3. **Deploy Function**: Use Google Cloud deployment process
4. **Update Registry Backend**: Configure `SECRET_SCANNER_URL` environment variable

## Meta-Optimization for Claude Code

### Critical Files to Read First
1. **`main.py`** - Entry point and function signature
2. **`scan/web.py`** - Main orchestration logic
3. **`utils/issue.py`** - Issue schema and validation
4. **`docs/URL_SCANNING_POLICY.md`** - URL scanning methodology
5. **`pytest.ini`** - Test configuration and patterns

### Common Pitfalls to Avoid
- **File Size Limits**: Respect 10MB limit for scanned files
- **Issue Schema**: Always use `Issue` class for standardized reporting
- **Async Context**: URL validation requires proper async handling
- **Temp File Cleanup**: Ensure proper resource cleanup in scanners
- **YARA Compilation**: Rules are compiled globally; changes require restart

### Extension Patterns
- **New Scanner Types**: Follow the `scan_by_X(directory, temp_dir_prefix)` pattern
- **Custom Filters**: Add post-match processing to `POST_MATCH_FILTERS`
- **Issue Types**: Add new types to `RECOMMENDED_ISSUE_TYPES` in `utils/issue.py`
- **File Type Support**: Update YARA rule conditions and scanner file filters

### Performance Considerations
- **Concurrent Scanning**: Multiple scanners run sequentially (not parallel)
- **Memory Usage**: Large files are filtered out before processing
- **API Rate Limits**: URLhaus calls are cached and rate-limited
- **File Preprocessing**: Comment removal creates temporary files

### Security Considerations
- **Malware Samples**: Test samples in `tests/samples/positive/` contain actual malicious patterns
- **Environment Variables**: OpenAI API key required for GPT scanning (currently disabled)
- **External APIs**: URLhaus dependency for real-time threat intelligence
- **Package Safety**: All downloaded packages are processed in isolated temp directories

This repository implements sophisticated security scanning for the ComfyUI ecosystem, providing automated protection against malicious custom nodes while maintaining a balance between security and usability.