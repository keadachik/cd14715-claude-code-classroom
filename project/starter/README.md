# Enterprise Multi-Agent Code Review Orchestrator

Build a production-ready multi-agent system that automates code review using the Claude Agent SDK.

## Project Overview

This system uses multiple specialized AI agents working together to provide comprehensive code reviews:

- **Main Orchestrator** - Coordinates the review process and aggregates results
- **Code Quality Analyzer** - Identifies code smells, anti-patterns, and best practice violations
- **Test Coverage Analyzer** - Evaluates test completeness and suggests missing test cases
- **Refactoring Suggester** - Recommends architectural improvements and refactoring opportunities



## What's Provided

This starter includes the infrastructure you need:

- **Type Definitions** (`src/types/`) - Zod schemas for validation
- **Logger** (`src/utils/logger.ts`) - Winston structured logging
- **Report Generator** (`src/utils/report-generator.ts`) - Markdown/HTML/JSON report generation
- **Project Config** - `package.json`, `tsconfig.json`, `.env.example`
- **Test Skeletons** (`tests/`) - Test file structure
- **Example Skill** (`.claude/skills/`) - Sample Claude skill

## What You Need to Implement

Your tasks:


1. **Agent Definitions** (`src/agents/`)
   - Code Quality Analyzer
   - Test Coverage Analyzer
   - Refactoring Suggester

2. **Prompts** (`src/prompts/`)
   - Orchestrator prompt
   - Agent-specific prompts

3. **MCP Configuration** (`src/config/mcp.config.ts`)
   - GitHub MCP server
   - ESLint MCP server

4. **Orchestrator** (`src/orchestrator.ts`)
   - Main coordination logic
   - Agent spawning and result aggregation

6. **Main Entry Point** (`src/main.ts`)
   - CLI argument parsing
   - Environment validation
   - Report generation

7. **Error Handler** (Recommended) (`src/utils/error-handler.ts`)
   - Custom `ReviewError` class
   - Retry logic with exponential backoff
   - Timeout wrapper

8. **Rate Limiter** (Optional) (`src/utils/rate-limiter.ts`)
   - Token bucket algorithm with sliding window
   - Request and token tracking
   - Concurrent request management

## Getting Started

### Prerequisites

- Node.js 18+
- **AWS Bedrock Access** (recommended - credentials provided by Udacity) OR [Anthropic API Key](https://console.anthropic.com/)
- [GitHub Personal Access Token](https://github.com/settings/tokens) (recommended for private repos - scopes: `repo`, `read:org`)

### Installation

**In Vocareum Workspace (Recommended):**
```bash
# Install dependencies from repository root (uses npm workspaces)
cd /path/to/repository-root
npm install

# Copy environment template
cd project/starter
cp .env.example .env

# Edit .env with your AWS credentials from Vocareum
```

**Local Setup (Alternative):**
```bash
# If you cloned only the starter folder
cd project/starter
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your authentication credentials
```

### Configuration

Edit `.env` with **ONE** authentication method:

**Method 1: AWS Bedrock (Recommended)**
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
CLAUDE_CODE_USE_BEDROCK=1
ANTHROPIC_MODEL=us.anthropic.claude-sonnet-4-5-20250929-v1:0
```

**Method 2: Anthropic API (Optional)**
```bash
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

**Both methods also need:**
```bash
# Optional - for higher rate limits and private repos
# GITHUB_TOKEN=ghp_...

# Required - absolute path to project directory
PROJECT_ROOT=/absolute/path/to/project/starter
```

### Running

```bash
# Development mode
npm run dev -- <owner> <repo> <pr-number>

# Production build
npm run build
npm start <owner> <repo> <pr-number>

# Example
npm run dev -- facebook react 12345
```

### Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- orchestrator.test.ts

# Watch mode
npm test -- --watch
```

## Key Technologies

- **Claude Agent SDK** - Multi-agent orchestration framework
- **Model Context Protocol (MCP)** - External data integration
- **Zod** - Schema validation and type safety
- **TypeScript** - Type-safe development
- **Vitest** - Testing framework
- **Winston** - Structured logging

## Success Criteria

Your implementation is complete when:

- [ ] TypeScript compiles without errors: `npm run build`
- [ ] All tests pass: `npm test`
- [ ] Can review a real PR: `npm start owner repo pr-number`
- [ ] Generates reports in at least one format (MD, HTML, JSON)
- [ ] Rate limiting prevents API throttling (Optional)
- [ ] Errors are handled gracefully (Optional Recommended)

## Resources

- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Zod Documentation](https://zod.dev/)



Good luck! 
