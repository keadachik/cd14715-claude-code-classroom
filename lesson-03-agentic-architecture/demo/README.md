# Designing Agentic Workflows

Learn the fundamental differences between traditional prompt-response systems and agentic systems.

## Overview

This demo explores how to design agents that can use tools, iterate on tasks, and coordinate with other agents to solve complex problems.

## Scenario

A company wants to automate their customer research process. Instead of a single prompt ("research this company"), they need an agent that can autonomously search the web, analyze findings, follow up on interesting leads, and compile a comprehensive report.

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

Choose **one** authentication method:

### Option 1: AWS Bedrock (Recommended for Vocareum)

Create `.env`:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_SESSION_TOKEN=your-session-token
CLAUDE_CODE_USE_BEDROCK=1
ANTHROPIC_MODEL=us.anthropic.claude-sonnet-4-5-20250929-v1:0
```

Copy AWS credentials from your Vocareum workspace.

### Option 2: Direct Anthropic API

Create `.env`:
```
ANTHROPIC_API_KEY=your-key-here
```

Get your API key from https://console.anthropic.com

## What You'll Learn

- What makes a system "agentic" (autonomy, tool use, iteration)
- Common agentic patterns (ReAct, tool use, delegation)
- When to use single vs. multiple agents
- How to design clear agent responsibilities
- Orchestration patterns for multi-agent systems

## Key Concepts

### Non-Agentic vs Agentic

**Non-Agentic:**
```
User → Prompt → Claude → Single Response → Done
```

**Agentic:**
```
User → Agent → Tool1 → Agent evaluates → Tool2 → ... → Final Response
```

### Orchestration Patterns

1. **Sequential Pipeline**: Agent1 → Agent2 → Agent3
2. **Parallel Processing**: Agents run simultaneously, merge results
3. **Hierarchical Delegation**: Orchestrator manages sub-orchestrators

## Deliverable

`ARCHITECTURE.md` documenting a multi-agent company research system with:
- Single vs multi-agent comparison
- Agent responsibilities and tools
- Workflow diagram showing parallel execution
- Pros/cons analysis

## Key Takeaway

Design agents with clear, focused responsibilities. Use single agents for straightforward tasks and multi-agent systems when you need parallelization or specialized expertise.

