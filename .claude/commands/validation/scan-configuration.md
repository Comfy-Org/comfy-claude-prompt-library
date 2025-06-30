# Scan Configuration Files

I need to validate configuration files for: $ARGUMENTS

## Your Task

Analyze configuration files for security issues, inconsistencies, and best practices violations.

## Execution Steps

1. **Identify Configuration Files**
   - .env, .env.*, config.json, config.yml
   - docker-compose.yml, Dockerfile
   - nginx.conf, apache.conf
   - CI/CD configs (.github/workflows, .gitlab-ci.yml)
   - Build configs (webpack, vite, rollup)

2. **Security Checks**
   - Hardcoded credentials or secrets
   - Insecure default settings
   - Exposed debug flags in production
   - Permissive CORS or security headers
   - Open ports or services

3. **Consistency Validation**
   - Environment variable mismatches
   - Conflicting settings across files
   - Missing required configurations
   - Duplicate or redundant settings

4. **Best Practices**
   - Using environment-specific configs
   - Proper secret management
   - Resource limits defined
   - Logging levels appropriate
   - Backup and recovery settings

5. **Infrastructure Validation**
   - Container security settings
   - Network isolation
   - Volume mount permissions
   - Resource constraints
   - Health check configurations

## Report Format

```
## Configuration Scan Results

### Security Issues
- [Config File]: [Issue] - [Risk Level]
  Fix: [Specific remediation]

### Inconsistencies
- [Setting]: Defined differently in [File1] vs [File2]

### Missing Configurations
- [Required Setting]: Not found in [Environment]

### Best Practice Violations
- [Issue]: [File] - [Recommendation]
```