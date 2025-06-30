# Scan API Contracts

I need to validate API contracts and consistency for: $ARGUMENTS

## Your Task

Analyze API definitions, implementations, and usage for consistency and contract violations.

## Execution Steps

1. **API Definition Analysis**
   - Locate OpenAPI/Swagger specs
   - GraphQL schema definitions
   - TypeScript interfaces/types
   - API documentation
   - Postman collections

2. **Implementation Validation**
   - Response shapes match definitions
   - Required fields always present
   - Data types match specifications
   - Status codes used correctly
   - Error response consistency

3. **Client-Server Contract**
   - Request validation implementation
   - Response type safety
   - Missing error handling
   - Assumed optional fields
   - Version compatibility

4. **REST Best Practices**
   - Proper HTTP methods (GET not mutating)
   - RESTful resource naming
   - Consistent URL patterns
   - Proper status code usage
   - HATEOAS compliance (if applicable)

5. **Breaking Change Detection**
   - Removed endpoints
   - Changed field types
   - New required fields
   - Modified enums
   - Changed authentication

## Report Format

```
## API Contract Analysis

### Contract Violations
- [Endpoint]: Response missing required field 'X'
- [Endpoint]: Returns 200 for errors (should be 4xx)

### Type Mismatches
- [Field]: Defined as number, returns string
- [Field]: Sometimes null, not marked optional

### Breaking Changes Detected
- [Endpoint]: Field 'X' changed from string to number
- [Endpoint]: New required field 'Y' added

### Best Practice Issues
- GET /api/users/delete - Should use DELETE method
- Inconsistent error response format

### Recommendations
1. Generate types from OpenAPI spec
2. Add runtime validation
3. Version the API properly
```