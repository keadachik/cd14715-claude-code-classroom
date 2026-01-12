# Demo: Custom Tools - Tax Calculator

Build custom tools for agents using the Claude Agent SDK.

## Scenario

A financial application needs agents to calculate tax amounts with proper decimal precision. We'll build a custom "calculate_tax" tool using `createSdkMcpServer`.

## Project Structure

```
src/
├── tax-calculator.ts  # Exported tool (deliverable)
└── index.ts           # Tests for the tool
```

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

## Run

```bash
npm start
```

## Deliverable: tax-calculator.ts

```typescript
export interface TaxResult {
  subtotal: number;
  tax: number;
  total: number;
  effectiveRate: number;
  currency: string;
}

export const taxToolServer: SdkMcpServer;
export function calculateTax(amount, taxRate, round): TaxResult;
```

## Custom Tool Pattern

```typescript
import { z } from "zod";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";

const myToolServer = createSdkMcpServer({
  name: "my-tools",
  version: "1.0.0",
  tools: [
    tool(
      "tool_name",
      "Description of what the tool does",
      { param: z.string().describe("Parameter description") },
      async (args) => ({
        content: [{ type: "text", text: "Result" }],
      })
    ),
  ],
});
```

## Using Custom Tools

```typescript
for await (const message of query({
  prompt: generateMessages(),  // Must use async generator
  options: {
    mcpServers: { "my-tools": myToolServer },
    allowedTools: ["mcp__my-tools__tool_name"],
  },
})) {
  // Handle response
}
```

## Tests (index.ts)

| Step | Description |
|------|-------------|
| 1 | Test tool directly (without agent) |
| 2 | Use tool with agent via MCP server |
| 3 | Demonstrate precision handling |

## Key Takeaway

Custom tools extend agent capabilities. Use `createSdkMcpServer` and `tool()` helper with Zod schemas. Tool names follow `mcp__<server>__<tool>` pattern.

