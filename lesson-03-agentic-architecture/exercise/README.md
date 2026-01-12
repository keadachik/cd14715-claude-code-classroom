# Customer Support Ticket Routing System Architecture

Design a multi-agent architecture for an intelligent customer support system.

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

## Overview

Design a system that triages tickets, routes to appropriate teams, suggests solutions from knowledge base, and escalates complex issues.

## Scenario

Your SaaS company receives 5,000+ support tickets daily. Requirements:
- Enterprise SLA: < 1 hour response
- Auto-resolve common questions
- Route technical issues to engineering
- Route billing issues to finance
- Escalate unresolved issues to humans

## Prerequisites

- Completed the demo (Company Research Agent Architecture)
- Understanding of agentic patterns

## Tasks

### 1. Analyze Requirements

- List distinct responsibilities (triage, routing, KB search, etc.)
- Identify parallel vs. sequential tasks
- Consider SLA requirements
- Plan human escalation paths

### 2. Design Option A: Single Agent

- Define one generalist agent
- List all tools needed
- Describe step-by-step workflow
- Document pros and cons

### 3. Design Option B: Multi-Agent

Define 4-6 specialized agents:
- Triage Agent
- Technical Agent
- Billing Agent
- Knowledge Base Agent
- Routing Agent
- Escalation Agent

For each agent specify:
- Responsibility
- Tools
- Model (Haiku/Sonnet)
- Can run in parallel?

### 4. Make Recommendation

Choose Option A or B based on:
- Volume (5000+ tickets/day)
- Speed requirements (enterprise SLA)
- Complexity of ticket types
- Cost considerations

### 5. Create Workflow Diagram

- Show ticket flow from intake to resolution
- Indicate parallel processing
- Include decision points
- Show SLA monitoring

### 6. Analyze Failure Modes

- What if Triage Agent is down?
- What if KB search fails?
- How to handle degraded operation?

## Deliverable

`ARCHITECTURE.md` document with:
- Single vs multi-agent comparison
- Justified recommendation
- Workflow diagram
- Tool requirements per agent
- SLA considerations
- Failure mode analysis

## Key Takeaway

Enterprise systems require architecture that balances speed, accuracy, and cost. Multi-agent systems excel at high-volume, complex workflows where different ticket types need specialized handling.

