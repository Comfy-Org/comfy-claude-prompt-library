# Building Domain-Specific Claude Code Systems

This guide demonstrates how to build complete Claude Code systems for specific domains, using a personal finance manager as a case study.

## Overview

Domain-specific systems leverage Claude Code's capabilities to create intelligent, context-aware tools for specialized tasks. The key is combining structured commands, data persistence, and domain knowledge into a cohesive system.

## Architecture Pattern

### 1. Command Organization by Function

Structure commands hierarchically based on their purpose:

```
.claude/commands/
├── finance/          # Core domain operations
│   ├── analyze-subscriptions.md
│   ├── monthly-spending-report.md
│   └── find-savings-opportunities.md
├── import/           # Data ingestion
│   ├── smart-csv-import.md
│   └── parse-bank-pdf.md
└── export/           # Data extraction
    ├── tax-summary.md
    └── spending-export.md
```

### 2. Domain-Specific CLAUDE.md

Create a comprehensive CLAUDE.md that includes:

- **Data Format Documentation**: Common formats in your domain (e.g., bank CSV formats)
- **Domain Rules**: Business logic and validation rules
- **Processing Guidelines**: How to handle edge cases
- **Security Practices**: Domain-specific privacy concerns

Example for finance domain:

```markdown
## CSV Format Detection
Common formats to handle:
- **Chase**: "Transaction Date","Post Date","Description","Category","Type","Amount","Memo"
- **Bank of America**: "Posted Date","Reference Number","Payee","Address","Amount"

## Amount Parsing
- Handle negative numbers for debits: "-$123.45" or "($123.45)"
- Remove currency symbols and commas before parsing

## Security Practices
- NEVER log full account numbers (show last 4 digits only)
- Encrypt all data files at rest
```

### 3. Data Architecture

Design a data layer that supports your commands:

```
project/
├── data/
│   ├── raw/           # Original unprocessed data
│   ├── processed/     # Cleaned, standardized data
│   ├── analysis/      # Generated reports and insights
│   └── domain/        # Domain-specific storage
├── config/
│   ├── schema.json    # Data structure definitions
│   ├── mappings.json  # Value standardization
│   └── rules.json     # Processing rules
└── scripts/
    └── init.py        # Database/structure setup
```

### 4. Progressive Command Design

Start simple and build complexity:

1. **Basic Commands**: Single-purpose, straightforward operations
2. **Analysis Commands**: Build on basic commands with intelligence
3. **Workflow Commands**: Chain multiple operations together
4. **Optimization Commands**: Advanced features for power users

## Implementation Example: Finance System

### Phase 1: Basic Tracking
```markdown
# Simple Subscription Finder
<task>
Find recurring charges in CSV file: $ARGUMENTS
List merchant, amount, frequency
</task>
```

### Phase 2: Intelligent Analysis
```markdown
# Subscription Analyzer with Intelligence
<role>
You are a financial analyst specializing in subscription management.
</role>

<task>
Analyze subscriptions with these capabilities:
- Detect pricing changes over time
- Identify unused services
- Find bundling opportunities
- Suggest retention offer strategies
</task>
```

### Phase 3: Complete Workflow
Commands that orchestrate entire processes:
- Import → Clean → Analyze → Report → Recommend

## Design Principles

### 1. Domain Knowledge in Commands

Embed domain expertise directly in command templates:

```markdown
<role>
You are a [domain expert] with deep knowledge of [specific area].
</role>

<context>
[Domain-specific context and constraints]
</context>
```

### 2. Flexible Data Handling

Use configuration files for adaptability:

```json
{
  "field_mappings": {
    "merchant_patterns": {
      "NETFLIX.COM": "Netflix",
      "NTFLX": "Netflix"
    }
  }
}
```

### 3. Progressive Enhancement

Each command should work standalone but integrate into larger workflows:

- Single command: Analyze one file
- Workflow: Analyze multiple files, compare, generate insights
- System: Continuous monitoring with alerts

### 4. User Education

Commands should teach users about the domain:

```markdown
## Insights
- **Why this matters**: [Educational context]
- **What to do next**: [Actionable steps]
- **Learn more**: [Domain concepts explained]
```

## Common Patterns

### Auto-Detection Pattern
```markdown
1. Read input data
2. Detect format/structure automatically
3. Apply appropriate processing rules
4. Validate results
5. Provide confidence scores
```

### Progressive Analysis Pattern
```markdown
1. Quick scan for obvious insights
2. Deep analysis if requested
3. Comparative analysis with history
4. Predictive analysis for trends
5. Optimization recommendations
```

### Template-Based Reporting
```markdown
<output_format>
# Structured Report Title

## Executive Summary
[Key findings in 2-3 sentences]

## Detailed Analysis
[Structured sections based on domain]

## Recommendations
[Prioritized action items]

## Next Steps
[Clear path forward]
</output_format>
```

## Best Practices

1. **Start with MVP**: Build minimal viable commands first
2. **Use Real Data Early**: Test with actual user data ASAP
3. **Iterate Based on Usage**: Let real usage drive features
4. **Document Patterns**: Capture successful patterns in CLAUDE.md
5. **Maintain Simplicity**: Complex domains need simple interfaces

## Anti-Patterns to Avoid

1. **Over-Engineering**: Don't build features before validating need
2. **Rigid Scripts**: Prefer intelligent commands over fixed logic
3. **Domain Assumption**: Don't assume user has domain knowledge
4. **Data Silos**: Ensure commands can share data/context

## Success Metrics

A well-designed domain system should:

- Reduce time to insight by 80%+
- Handle 95%+ of common cases automatically
- Educate users about the domain
- Scale from simple to complex use cases
- Maintain data privacy and security

## Case Studies

### Personal Finance Manager
- Started with subscription tracking
- Expanded to full financial analysis
- Key insight: Progressive complexity works

### Code Review System
- Started with basic style checks
- Evolved to architectural analysis
- Key insight: Domain expertise in prompts

### Content Management
- Started with simple publishing
- Grew to full editorial workflow
- Key insight: Templates enable consistency

## Conclusion

Domain-specific Claude Code systems combine the flexibility of natural language with the structure of traditional software. By embedding domain knowledge in commands and building progressively, you can create powerful tools that adapt to user needs while maintaining simplicity.