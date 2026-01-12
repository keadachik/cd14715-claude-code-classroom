# Multi-Agent Code Review System with Claude Agent SDK

## 1. Project Overview

### Introduction

Welcome to one of the most practical AI engineering projects you'll build: a **production-ready, multi-agent code review system** powered by the **Claude Agent SDK**.

**The Scenario:** You've just joined DevFlow, a fast-growing startup that's scaling rapidly. Your engineering team is drowning in pull request reviews. Senior developers spend 30% of their time reviewing code, creating a bottleneck that slows down the entire development pipeline. Your tech lead has tasked you with building an AI-powered solution that can provide comprehensive, automated code reviews—freeing up senior engineers to focus on architecture and mentorship.

**Your Goal:** Build a multi-agent system where specialized AI agents work in parallel to analyze pull requests from multiple angles—code quality, test coverage, and refactoring opportunities—then synthesize their findings into a polished, actionable report.

### The Challenge

Manual code reviews are:
- **Time-consuming**: A thorough review of a 500-line PR can take 30-60 minutes
- **Inconsistent**: Different reviewers catch different issues
- **Limited in scope**: Humans often focus on logic, missing security or performance issues

Your task is to build a system that:
1. Fetches pull request data from GitHub using MCP (Model Context Protocol)
2. Dispatches three specialized subagents to analyze code in parallel
3. Aggregates their insights into a unified, validated report
4. Outputs professional HTML/Markdown/JSON reports

### Your Product

The final system architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                    MAIN ORCHESTRATOR                            │
│         (Coordinates analysis, aggregates results)              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Code Quality  │   │ Test Coverage │   │  Refactoring  │
│   Analyzer    │   │   Analyzer    │   │   Suggester   │
│               │   │               │   │               │
│ • Security    │   │ • Coverage    │   │ • Patterns    │
│ • Performance │   │ • Test gaps   │   │ • Modernize   │
│ • Best practs │   │ • Assertions  │   │ • Clean code  │
└───────────────┘   └───────────────┘   └───────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
              ┌─────────────────────────┐
              │   ReviewReport (JSON)   │
              │   ─────────────────     │
              │   • File-by-file        │
              │   • Aggregated scores   │
              │   • Recommendations     │
              └─────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   [report.md]        [report.html]       [report.json]
```

**Key Technologies:**
- **Claude Agent SDK**: Orchestrates agents and handles tool execution
- **MCP (Model Context Protocol)**: Integrates GitHub API and ESLint via standardized protocol
- **Zod**: Runtime validation of structured outputs
- **TypeScript**: Type-safe development

### Deliverables

Your submission must include:

| File | Description |
|------|-------------|
| `src/agents/*.ts` | Three subagent definitions |
| `src/prompts/*.ts` | Prompt templates for orchestrator and each subagent |
| `src/orchestrator.ts` | Main orchestrator using Claude Agent SDK |
| `src/main.ts` | Entry point with validation and report generation |
| `tests/*.test.ts` | Unit tests for schemas and core functionality |

---

## 2. Environment Setup

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** or your favourite
- **Git**
- **GitHub Personal Access Token** (recommended for private repos and higher rate limits - with `repo` and `read:org` scopes)
- **AWS Account** with Bedrock access (recommended) OR Anthropic API key (AWS Bedrock credentials will be provided to you by Udacity)

### Local Setup Instructions

#### Step 1: Clone and Install

```bash
cd project/starter
npm install
```

#### Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials. Choose **ONE** authentication method:

##### Method 1: AWS Bedrock (Recommended for Workspace)

```bash
# AWS Region (required for Bedrock)
AWS_REGION=us-east-1

# AWS Credentials (provided by Vocareum workspace)
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Enable Bedrock integration
CLAUDE_CODE_USE_BEDROCK=1

# Model name for Bedrock (required)
ANTHROPIC_MODEL=us.anthropic.claude-sonnet-4-5-20250929-v1:0

# Output token limits (recommended for Bedrock)
CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096
MAX_THINKING_TOKENS=1024
```

**AWS IAM Requirements:**
Your IAM user/role needs permissions for `bedrock:InvokeModel`, `bedrock:InvokeModelWithResponseStream`, and `bedrock:ListInferenceProfiles` on Bedrock resources.

##### Method 2: Anthropic API (Optional)

```bash
# Anthropic API Key (get from https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Model name for Anthropic API (required)
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

##### Required for Both Methods

```bash
# GitHub Personal Access Token (recommended for private repos and higher rate limits)
# Generate at: https://github.com/settings/tokens
# Required scopes: 'repo', 'read:org'
# GITHUB_TOKEN=ghp_your-token-here

# PROJECT_ROOT: Absolute path to your project root (required)
PROJECT_ROOT=/path/to/your/project/starter

# Logging level (optional)
LOG_LEVEL=info
```

#### Step 3: Verify Setup

```bash
npm run dev
```

You should see the starter code execute (it will show a "not implemented" error - that's expected!).

### Vocareum Workspace Instructions

1. Open the terminal in your workspace
2. Navigate to: `cd /home/student/project/starter`
3. Run `npm install`
4. Edit `.env` using `nano .env`
5. Set your API credentials
6. Test with: `npm run dev octocat Hello-World 1`

---

## 3. Instructions

### Phase 1: Foundation & Configuration

**Goal:** Understand the project structure and configure external integrations.

#### Task 1.1: Explore the Starter Code

Before writing any code, familiarize yourself with what's provided:

- `src/types/` - Zod schemas are already defined for you. Study these carefully:
  - What fields does `CodeQualityResultSchema` expect?
  - What does a valid `ReviewReport` look like?
  - How is `zod-to-json-schema` used for SDK structured outputs?

- `src/utils/report-generator.ts` - Already implemented. Understand how it transforms a `ReviewReport` into different formats.

- `src/config/mcp.config.ts` - **You need to complete this.** Configure the GitHub and ESLint MCP servers.

#### Task 1.2: Configure MCP Servers

The MCP configuration file needs two server definitions. Research the following:

1. **GitHub MCP Server**: How do you configure `@modelcontextprotocol/server-github`? What environment variable does it need?

2. **ESLint MCP Server**: How do you configure `@eslint/mcp`?

**Hints:**
- MCP servers use `stdio` transport type
- Use `npx -y` to run packages without installing
- Check what tools each MCP server provides (you'll need this for the orchestrator's `allowedTools`)

**Resources:**
- [MCP Server GitHub](https://github.com/modelcontextprotocol/servers)
- [ESLint MCP Documentation](https://eslint.org/docs/latest/use/mcp)

---

### Phase 2: Building the Sub-Agents

**Goal:** Create three specialized subagents that the orchestrator will invoke.

#### Understanding Subagents

In the Claude Agent SDK, a subagent is defined using the `AgentDefinition` type. Study the SDK documentation to understand:
- What properties does an `AgentDefinition` have?
- What does the `tools` array control?
- What does `model: 'inherit'` mean?

#### Task 2.1: Code Quality Analyzer

Create `src/agents/code-quality-analyzer.ts`

This agent should analyze code for:
- Security vulnerabilities (SQL injection, XSS, hardcoded secrets)
- Performance issues (N+1 queries, memory leaks, inefficient algorithms)
- Maintainability concerns (high complexity, tight coupling)
- Best practice violations

**Questions to answer:**
- What tools does this agent need? (Think: reading files, searching patterns)
- What should the prompt instruct the agent to return? (Look at `CodeQualityResultSchema`)
- How detailed should the `description` be for the orchestrator to know when to use it?

#### Task 2.2: Test Coverage Analyzer

Create `src/agents/test-coverage-analyzer.ts`

This agent should:
- Identify functions/methods without test coverage
- Suggest specific test cases with meaningful assertions
- Estimate coverage percentage
- Prioritize which untested paths are most critical

**Think about:**
- How can an LLM estimate test coverage without running tests?
- What makes a test suggestion actionable vs. generic?

#### Task 2.3: Refactoring Suggester

Create `src/agents/refactoring-suggester.ts`

This agent should identify:
- Code that could use modern language features
- Opportunities to apply design patterns
- Extract method/class candidates
- Dead code or redundant logic

#### Task 2.4: Write the Prompts

Create prompt files in `src/prompts/` for each agent.

**Prompt Engineering Tips:**
- Be specific about the output format (reference the Zod schema structure)
- Include examples of good vs. bad findings
- Specify severity/priority criteria
- Tell the agent what tools it has available

#### Task 2.5: Export Your Agents

Update `src/agents/index.ts` and `src/prompts/index.ts` to export everything.

---

### Phase 3: The Orchestrator Logic

**Goal:** Build the main orchestrator that coordinates all subagents.

#### Task 3.1: Design the Orchestrator Prompt

Create `src/prompts/orchestrator.prompt.ts`

The orchestrator prompt is critical. It must instruct the main agent to:

1. **Fetch PR data** using GitHub MCP tools
2. **Invoke all three subagents** for each file (study the SDK docs on "explicit invocation")
3. **Aggregate results** into the `ReviewReport` schema

**Key Questions:**
- How do you tell an agent to spawn subagents? (Hint: look up "explicit invocation pattern" in SDK docs)
- How do you ensure subagents run in parallel vs. sequentially?
- What happens if a subagent fails? How should the orchestrator handle it?

#### Task 3.2: Implement the Orchestrator Class

Complete `src/orchestrator.ts`

You need to use the `query` function from `@anthropic-ai/claude-agent-sdk`. Study:
- How to configure `Options` with MCP servers, agents, and tools
- How to use `outputFormat` with JSON schema for structured outputs
- How to iterate over the async result stream
- How to extract the final `structured_output`

**Critical Configuration Decisions:**
- Which tools should you allow? (Built-in + MCP tools)
- What model should you use?
- How many `maxTurns` is reasonable?
- What `permissionMode` is appropriate for automated CI/CD use?

**Validation:**
- Use Zod's `safeParse` or `parse` to validate the final output
- Handle validation failures gracefully

---

### Phase 4: Production Polish

**Goal:** Complete the entry point and add robustness.

#### Task 4.1: Complete Main Entry Point

Update `src/main.ts` to:

1. Parse and validate command-line arguments
2. Validate environment variables (check for API keys/Bedrock config)
3. Create the orchestrator and call `reviewPullRequest`
4. Use `ReportGenerator` to create all output formats
5. Save reports to the `reports/` directory
6. Handle errors gracefully with meaningful messages

#### Task 4.2: Consider Edge Cases

Think about:
- What if the PR has no changed files?
- What if a subagent returns malformed data?
- What if the GitHub token is invalid?
- What if rate limits are hit?

You don't need to handle all of these, but consider which are most important for a production system.

---

## 4. Testing & Validation

### Unit Testing

The starter includes test stubs in `tests/`. Implement tests for:

1. **Schema Validation**: Test that your Zod schemas accept valid data and reject invalid data
2. **Edge Cases**: Empty arrays, boundary values (score of 0, score of 100)
3. **JSON Schema Export**: Verify the JSON schema is valid for SDK structured outputs

Run tests with:
```bash
npm test
```

### Integration Test

Test with a real pull request:

```bash
npm run dev octocat Hello-World 1
```

**What to verify:**
- MCP servers connect successfully
- All three subagents are invoked
- Final report passes Zod validation
- Reports are generated in all formats

### Validation Checklist

Before submitting:

- [ ] MCP config connects to GitHub and ESLint servers
- [ ] All three subagents have definitions and prompts
- [ ] Orchestrator spawns agents and aggregates results
- [ ] Structured output matches `ReviewReportSchema`
- [ ] Reports generate in MD, HTML, and JSON formats
- [ ] Unit tests pass (`npm test`)
- [ ] Integration test succeeds with a real PR
- [ ] No hardcoded API keys in code
- [ ] Error messages are helpful, not stack traces

---

## 5. Resources

### Official Documentation
- [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk) - Start here for SDK concepts
- [SDK Subagents Guide](https://platform.claude.com/docs/en/agent-sdk/subagents) - Critical for Phase 3
- [SDK Structured Outputs](https://platform.claude.com/docs/en/agent-sdk/structured-outputs) - For JSON schema config

### MCP Resources
- [MCP Protocol](https://modelcontextprotocol.io/)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [ESLint MCP](https://eslint.org/docs/latest/use/mcp)

### Other
- [Zod Documentation](https://zod.dev/)
- [Amazon Bedrock Setup](https://code.claude.com/docs/en/amazon-bedrock)

---

## Hints (Use Sparingly!)

<details>
<summary>Hint 1: MCP Tool Names</summary>

MCP tools follow the pattern `mcp__<server>__<tool>`. For GitHub, the tool to read PR data is `mcp__github__pull_request_read`.

</details>

<details>
<summary>Hint 2: Explicit Invocation</summary>

To reliably trigger subagents, your prompt should use phrases like "Use the code-quality-analyzer agent to..." rather than "The code-quality-analyzer should..."

</details>

<details>
<summary>Hint 3: Structured Output</summary>

The SDK's `outputFormat` expects a plain JSON schema object, not a Zod schema. Use `zod-to-json-schema` with `{ $refStrategy: 'root' }` to convert properly.

</details>

<details>
<summary>Hint 4: Async Iteration</summary>

The `query` function returns an async iterable. You need `for await (const message of result)` and check for `message.type === 'result'` to get the final output.

</details>

---

Good luck building your multi-agent code review system!
