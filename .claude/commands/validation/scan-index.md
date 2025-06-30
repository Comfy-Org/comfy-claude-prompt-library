# Validation & Scanning Commands Index

I need to help you choose the right validation scan for: $ARGUMENTS

## Available Scanning Commands

### Security & Safety
- **validate-basic-security** - Quick scan for common security issues (secrets, injections, auth)
- **scan-configuration** - Validate config files for security and consistency

### Code Quality
- **validate-code-quality** - Analyze complexity, code smells, and maintainability
- **scan-performance** - Find performance bottlenecks and inefficient patterns
- **scan-type-safety** - Check TypeScript typing coverage and safety
- **scan-dead-code** - Identify unused code that can be removed
- **scan-error-handling** - Evaluate error handling completeness

### Dependencies & Build
- **validate-dependencies** - Audit packages for vulnerabilities and updates
- **scan-bundle-size** - Analyze bundle size and optimization opportunities
- **scan-circular-dependencies** - Detect circular dependency chains

### Testing & Coverage
- **scan-test-coverage** - Analyze test coverage and quality
- **scan-api-contracts** - Validate API contracts and consistency

### Frontend Specific
- **scan-accessibility** - Check WCAG compliance and a11y best practices
- **scan-memory-leaks** - Detect potential memory leak patterns

## Quick Selection Guide

**"I need a general health check"**
→ Run: validate-code-quality, validate-dependencies, scan-test-coverage

**"Preparing for production"**
→ Run: validate-basic-security, scan-configuration, scan-bundle-size

**"Performance issues"**
→ Run: scan-performance, scan-memory-leaks, scan-bundle-size

**"Code cleanup"**
→ Run: scan-dead-code, scan-circular-dependencies, validate-code-quality

**"Security audit"**
→ Run: validate-basic-security, validate-dependencies, scan-configuration

## Usage Examples

```bash
# Scan entire project
/validation:validate-code-quality .

# Scan specific directory
/validation:scan-performance src/components

# Multiple scans
/validation:validate-basic-security && /validation:scan-test-coverage
```

Would you like me to run a specific scan or combination of scans?