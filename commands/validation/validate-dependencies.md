# Validate Dependencies

I need to audit dependencies for: $ARGUMENTS

## Your Task

Analyze project dependencies for vulnerabilities, outdated packages, and licensing issues.

## Execution Steps

1. **Locate Package Files**
   - Check for package.json (Node.js)
   - Check for requirements.txt, Pipfile, pyproject.toml (Python)
   - Check for Cargo.toml (Rust)
   - Check for go.mod (Go)
   - Check for composer.json (PHP)

2. **Analyze Direct Dependencies**
   - List all direct dependencies with current versions
   - Check against latest stable versions
   - Identify deprecated packages
   - Note packages that haven't been updated in >2 years

3. **Security Vulnerability Check**
   - Check for known CVEs in dependencies
   - Identify packages with security advisories
   - Look for packages using outdated crypto or auth methods
   - Check npm audit, pip-audit, or equivalent

4. **License Compliance**
   - Identify all dependency licenses
   - Flag GPL/AGPL in commercial projects
   - Check for license compatibility issues
   - Identify packages with no clear license

5. **Dependency Health Analysis**
   - Check download stats/popularity
   - Review maintenance status
   - Analyze transitive dependency depth
   - Identify single points of failure

## Report Format

```
## Dependency Audit Report

### Security Vulnerabilities
- [Package@Version]: [CVE-ID] - [Description]
  Fix: Update to version X.Y.Z

### Outdated Packages
- [Package]: Current: X.Y.Z → Latest: A.B.C
  Breaking changes: [Yes/No]

### License Issues
- [Package]: [License Type] - [Potential Issue]

### Maintenance Concerns
- [Package]: Last updated [Date] - [Concern]

### Recommendations
1. Immediate updates needed for security
2. Consider replacing unmaintained packages
3. Review license compliance
```

## Important Notes

- Prioritize security vulnerabilities as Critical
- Consider the stability of the project before suggesting major updates
- Check if updates have breaking changes
- For monorepos, analyze each package separately
- Include both production and development dependencies in the analysis