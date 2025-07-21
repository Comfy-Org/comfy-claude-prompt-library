# Semantic Memory System Repository Guide

## Repository Overview

**Purpose**: A semantic search system that provides Claude Code with persistent memory across sessions by indexing and searching through past conversation summaries.

**Repository**: `/home/c_byrne/agents/semantic-memory-system`
**License**: Not specified
**Main Language**: Python

## Technology Stack

### Core Technologies
- **Python 3.x**: Primary language
- **ChromaDB 1.0.13**: Vector database for storing embeddings
- **Sentence Transformers 4.1.0**: Semantic similarity via `all-MiniLM-L6-v2` model
- **Rich 14.0.0**: Terminal UI and formatting
- **spaCy 3.8.7**: Natural language processing utilities
- **pytest 8.4.1**: Testing framework

### Development Tools
- **ruff 0.1.6**: Python linter
- **mypy 1.7.1**: Type checking
- **pre-commit 3.6.0**: Git hooks

## Directory Structure

```
semantic-memory-system/
├── scripts/                    # Core Python modules
│   ├── index_summaries.py     # Indexes summaries into vector DB
│   ├── memory_search.py       # Semantic search implementation
│   ├── health_check.py        # System diagnostics
│   ├── extract_metadata.py    # Metadata extraction utilities
│   └── add_metadata_to_summaries.py  # Metadata enrichment
├── chroma_db/                 # Vector database storage
│   ├── chroma.sqlite3         # SQLite backend
│   └── [uuid]/                # Vector data files
├── claude-integration/        # Claude Code integration
│   ├── CLAUDE.md-snippet.md   # Integration instructions
│   └── commands/              # Custom Claude commands
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # Technical architecture
│   ├── INTEGRATION.md         # Integration guide
│   └── TROUBLESHOOTING.md     # Common issues
├── tests/                     # Unit tests
│   ├── test_metadata_extraction.py
│   └── test_search_functionality.py
├── *.sh                       # Shell script interfaces
└── venv/                      # Python virtual environment
```

## Development Workflow

### Essential Commands

```bash
# Initial setup (one-time)
./setup.sh

# Search for past work
./search.sh "vue component implementation"
# Or: python scripts/memory_search.py "vue component implementation"

# Run health check
python scripts/health_check.py

# Rebuild index (with backup)
./reindex.sh

# Run all tests
./run_tests.sh

# Run specific tests
python -m pytest tests/test_search_functionality.py -v

# Backup database
./backup.sh
```

### Code Quality Commands

```bash
# Linting
./lint.sh
# Or: ruff check scripts/ tests/

# Type checking
mypy scripts/

# Run benchmarks
./benchmark.sh
```

## Critical Development Guidelines

### 1. Virtual Environment Usage
Always activate the virtual environment before development:
```bash
source venv/bin/activate
```

### 2. Database Management
- **Location**: `chroma_db/` directory contains the vector database
- **Backup**: Always backup before reindexing: `./backup.sh`
- **Collection**: Single collection named "claude_summaries"

### 3. Embedding Model
- **Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Dimensions**: 384-dimensional vectors
- **Language**: English-optimized
- Do NOT change without rebuilding entire index

### 4. Scoring Algorithm
The hybrid scoring formula MUST remain consistent:
```python
hybrid_score = (0.7 × semantic_similarity) + 
               (0.2 × recency_score) + 
               (0.1 × complexity_bonus)
```

### 5. Path Conventions
- **Summaries Source**: `~/.claude/compacted-summaries/*.md`
- **Database Path**: `~/agents/semantic-memory-system/chroma_db/`
- **Commands Path**: `~/.claude/commands/system/`

## Architecture & Patterns

### Core Architecture
1. **Indexing Pipeline**:
   - Read markdown files from `~/.claude/compacted-summaries/`
   - Extract YAML frontmatter metadata
   - Generate embeddings using sentence transformer
   - Store in ChromaDB with metadata

2. **Search Pipeline**:
   - Convert query to embedding
   - Find k-nearest neighbors in vector space
   - Apply hybrid scoring (semantic + recency + complexity)
   - Filter by 30% similarity threshold
   - Return top 3 results

### Key Design Patterns

#### 1. Singleton Database Connection
```python
class MemorySearcher:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=str(DB_PATH))
        self.collection = self.client.get_collection(name=COLLECTION_NAME)
```

#### 2. Metadata Extraction Pattern
All summaries must have YAML frontmatter:
```yaml
---
title: "Session Title"
date: "2024-07-20"
technologies: ["Python", "Vue.js"]
complexity: "high"
---
```

#### 3. Error Handling Strategy
- Graceful degradation on missing metadata
- Clear error messages with recovery instructions
- Exit codes for different failure modes

### Integration with Claude Code

#### Automatic Memory Search
Configured in `~/.claude/CLAUDE.md` to run before every task:
1. Extract key terms from user request
2. Run semantic search
3. Present memory recap
4. Ask user for direction

#### Custom Commands
- `/system:semantic-memory-search <query>` - Manual search
- `/system:memory-health-check` - System diagnostics

## Common Development Tasks

### Adding New Features

#### 1. Adding New Metadata Fields
1. Update `extract_metadata()` in `scripts/index_summaries.py`
2. Add field to metadata schema
3. Update health check validation in `scripts/health_check.py`
4. Rebuild index: `./reindex.sh`

#### 2. Changing Embedding Model
1. Update `EMBEDDING_MODEL` constant in `scripts/index_summaries.py`
2. Ensure dimension compatibility
3. Full reindex required: `./reindex.sh`

#### 3. Adjusting Search Behavior
1. Modify scoring weights in `MemorySearcher.search()`
2. Update similarity threshold (default 0.3)
3. Test with benchmark suite: `./benchmark.sh`

### Testing Procedures

#### Unit Tests
```bash
# Run all tests
./run_tests.sh

# Run specific test file
python -m pytest tests/test_metadata_extraction.py -v

# Run with coverage
python -m pytest --cov=scripts tests/
```

#### Integration Testing
```bash
# Full system test
python test_system.py

# Health check
python scripts/health_check.py
```

### Troubleshooting Guide

#### Common Issues

1. **"Collection not found" error**:
   - Run `python scripts/index_summaries.py` to create collection
   - Check database exists at `chroma_db/`

2. **Import errors**:
   - Activate virtual environment: `source venv/bin/activate`
   - Reinstall dependencies: `pip install -r requirements.txt`

3. **No search results**:
   - Check similarity threshold (may be too high)
   - Verify summaries exist in `~/.claude/compacted-summaries/`
   - Run health check for diagnostics

4. **Slow search performance**:
   - Check database size with health check
   - Consider reducing n_results parameter
   - Ensure not loading model repeatedly

## Performance Characteristics

- **Search Latency**: ~130ms average
- **Indexing Speed**: ~1-2 seconds per summary
- **Database Size**: ~2MB per 100 summaries
- **Memory Usage**: ~100MB for model loading

## Security Considerations

- All data stored locally (no external APIs)
- File system permissions control access
- No network requests during search
- Input sanitization prevents path traversal

## Best Practices for AI Development

### 1. Always Check Existing Implementation
Before modifying, understand current patterns:
```bash
# Check implementation
cat scripts/memory_search.py

# Review architecture
cat docs/ARCHITECTURE.md
```

### 2. Test Before Committing
```bash
# Run tests
./run_tests.sh

# Check linting
./lint.sh
```

### 3. Document Metadata Requirements
When creating summaries, include rich metadata:
```yaml
---
title: "Descriptive Title"
date: "YYYY-MM-DD"
technologies: ["list", "of", "techs"]
complexity: "low|medium|high"
problem_domain: "web_development"
---
```

### 4. Handle Errors Gracefully
Always provide actionable error messages and recovery paths.

## Quick Reference

### File Paths
- **Summaries**: `~/.claude/compacted-summaries/*.md`
- **Database**: `~/agents/semantic-memory-system/chroma_db/`
- **Scripts**: `~/agents/semantic-memory-system/scripts/`
- **Commands**: `~/.claude/commands/system/`

### Key Functions
- `index_summaries.py`: Builds vector database
- `memory_search.py`: Searches for similar content
- `health_check.py`: System diagnostics
- `extract_metadata.py`: Metadata utilities

### Critical Constants
- **Embedding Model**: `all-MiniLM-L6-v2`
- **Vector Dimensions**: 384
- **Similarity Threshold**: 0.3
- **Max Results**: 3
- **Collection Name**: `claude_summaries`

This system enables Claude Code to maintain context across sessions, making development more efficient by building on past work rather than starting fresh each time.