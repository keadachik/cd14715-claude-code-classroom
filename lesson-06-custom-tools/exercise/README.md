# Exercise: Custom Tools - API Validator

Build a custom tool that validates API responses and checks SLA compliance.

## Scenario

Your engineering team needs to validate that API responses match expected schemas, measure latency, and detect breaking changes. Build a custom MCP tool for API validation.

## Project Structure

```
src/
├── api-validator.ts  # Exported tool (deliverable)
└── index.ts          # Test with agent
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

## Deliverable: api-validator.ts

```typescript
export interface ValidationResult {
  success: boolean;
  statusCode: number;
  latencyMs: number;
  schemaValid: boolean;
  schemaErrors: string[] | null;
  performanceIssues: {
    exceedsSLA: boolean;
    slaThresholdMs: number;
    actualLatencyMs: number;
  };
  breakingChanges: string[] | null;
  warnings: string[];
}

export const apiValidatorServer: SdkMcpServer;
```

## Tool Schema

```typescript
const validateApiSchema = {
  apiUrl: z.url(),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  expectedFields: z.array(z.string()),
  maxLatencyMs: z.number().positive(),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.string().optional(),
};
```

## Validation Checks

| Check | Description |
|-------|-------------|
| Status Code | 2xx = success |
| Expected Fields | Breaking change if missing |
| Extra Fields | Warning for data leakage |
| Latency | Compare against SLA threshold |

## Usage with Agent

```typescript
for await (const message of query({
  prompt: "Validate the API at ...",
  options: {
    mcpServers: {
      "api-validator": apiValidatorServer,
    },
    allowedTools: ["mcp__api-validator__validate_api_response"],
  },
})) { ... }
```

## Key Takeaway

Custom tools extend agent capabilities with domain-specific logic. Use `createSdkMcpServer` and `tool()` helper to create MCP-compatible tools that agents can use.

