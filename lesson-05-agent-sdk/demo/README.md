# Demo: Claude Agent SDK - Document Summarizer

Build your first agent using the Claude Agent SDK.

## Scenario

A documentation team needs an automated summarizer that can read files, extract key points, and produce structured summaries.

## Project Structure

```
src/
├── document-summarizer.ts # Exported function (deliverable)
├── sample-api-guide.md    # Test document
└── index.ts               # Tests for the function
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

## Deliverable: document-summarizer.ts

```typescript
export interface DocumentSummary {
  keyPoints: string[];
  summary: string;
  raw: string;
}

export async function summarizeDocument(
  filePath: string
): Promise<DocumentSummary>
```

## Agent SDK Pattern

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// 1. Create prompt function
const prompt = (filePath: string) => `Read and summarize: ${filePath}`;

// 2. Call query with tools
const result = query({
  prompt: prompt(filePath),
  options: { allowedTools: ["Read"] },
});

// 3. Iterate over results
for await (const message of result) {
  if (message.type === "result" && message.subtype === "success") {
    return message.result;
  }
}
```

## Tests (index.ts)

| Step | Description |
|------|-------------|
| 1 | Summarize sample API guide |
| 2 | Show full raw agent output |

## Key Benefit

Agent SDK handles tool execution automatically. The agent:
1. Sees the Read tool is available
2. Uses Read to fetch the file
3. Analyzes content
4. Returns formatted response

No manual tool call handling needed!

## Key Takeaway

The Claude Agent SDK simplifies building agentic systems by handling tool execution automatically. Use `query()` with `allowedTools` and the SDK manages the ReAct loop.

