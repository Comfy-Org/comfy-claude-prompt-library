# Basic Security Validation

I need to check for basic security issues in: $ARGUMENTS

## Your Task

Perform a lightweight security scan focusing on common, easily-fixable security issues.

## Execution Steps

1. **Scan for Hardcoded Secrets**
   - API keys, tokens, passwords in code
   - Connection strings with credentials
   - Private keys or certificates
   - AWS/cloud credentials

2. **Check Common Vulnerabilities**
   - SQL injection risks (string concatenation in queries)
   - Command injection (exec/system calls with user input)
   - Path traversal vulnerabilities
   - Unvalidated redirects

3. **Review Authentication Patterns**
   - Passwords stored in plain text
   - Weak hashing algorithms (MD5, SHA1)
   - Missing authentication on sensitive endpoints
   - Session management issues

4. **Configuration Security**
   - Debug mode enabled in production configs
   - Exposed admin interfaces
   - Default credentials
   - Overly permissive CORS settings

5. **Quick Wins**
   - Files that shouldn't be committed (.env, config with secrets)
   - Exposed sensitive endpoints
   - Missing input validation
   - Console.log with sensitive data

## Report Format

```
## Security Scan Results

### Critical - Fix Immediately
- [Issue]: [File:Line] - [Impact]
  Fix: [Specific remediation]

### Important - Fix Soon
- [Issue]: [File:Line] - [Impact]
  Fix: [Specific remediation]

### Consider Fixing
- [Issue]: [File:Line] - [Impact]
  Fix: [Specific remediation]

### Summary
- Total issues found: X
- Critical issues: Y
- Files scanned: Z
```

## Important Notes

- Focus on practical, fixable issues
- Don't overwhelm with theoretical vulnerabilities
- Provide clear, actionable fixes
- Skip complex security analysis that requires specialized tools
- If secrets are found, note them but don't display the actual values