# Exercise: Claude Agent SDK - Contract Standardizer

Build an agent to standardize vendor contracts for legal review.

## Scenario

Your procurement team receives contracts in wildly different formats. Your legal team spends hours reformatting them to compare terms. Build an agent that reads contract files, extracts key terms, and writes standardized output files.

## Project Structure

```
src/
├── contracts/               # Input contract files
│   ├── saas.txt
│   ├── consulting.txt
│   ├── vendor.txt
│   └── email.txt
├── standardized/            # Output (agent writes here)
├── contract-standardizer.ts # Exported function (deliverable)
├── sample-contracts.ts      # Contract file paths
└── index.ts                 # Tests
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

## Deliverable: contract-standardizer.ts

```typescript
export interface StandardizedContract {
  inputPath: string;
  outputPath: string;
  raw: string;
}

export async function standardizeContract(
  inputPath: string,
  outputFilename: string
): Promise<StandardizedContract>
```

## Agent Tools

| Tool | Purpose |
|------|---------|
| Read | Read contract files from `contracts/` folder |
| Write | Write standardized output to `standardized/` folder |

## Standardized Output Format

```markdown
## Contract Summary

### Parties
- **Vendor:** [Name]
- **Customer:** [Name]

### Term
- **Effective Date:** [Date]
- **Duration:** [Length]

### Financial Terms
- **Payment Amount:** [Amount]
- **Payment Frequency:** [Frequency]

### Legal Terms
- **Liability Cap:** [Terms]
- **Termination Notice:** [Period]

### IP & Data
- **IP Ownership:** [Terms]
- **Data Protection:** [Terms]

### Risk Assessment
- [Red flags or missing terms]
```

## Test Contracts

| ID | File | Description |
|----|------|-------------|
| saas | saas.txt | Well-structured SaaS agreement |
| consulting | consulting.txt | Less formal consulting SOW |
| vendor | vendor.txt | Complex vendor MSA |
| email | email.txt | Minimal email proposal |

## Key Takeaway

Agent SDK enables file-based document processing. The agent reads input files, processes content, and writes output files autonomously using Read and Write tools.

