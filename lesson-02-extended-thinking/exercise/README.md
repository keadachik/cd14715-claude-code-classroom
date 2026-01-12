# Exercise: Extended Thinking for Fraud Detection

Practice using extended thinking for compliance-grade fraud analysis.

## Scenario

A fintech company's fraud detection system flags transactions. Compliance officers need clear reasoning to approve or reject them, and regulators require audit trails.

## Project Structure

```
src/
├── fraud-analyzer.ts      # Deliverable: exported function
├── sample-transactions.ts # 5 test transactions
└── index.ts               # Tests for the deliverable
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

## Deliverable: fraud-analyzer.ts

```typescript
export interface FraudAnalysis {
  risk_level: "low" | "medium" | "high" | "critical";
  confidence: number;
  reasoning_steps: string[];
  risk_factors: string[];
  recommendation: "approve" | "review" | "decline";
}

export async function analyzeFraudRisk(
  transaction: Transaction
): Promise<FraudAnalysis>
```

## Tests (index.ts)

| Step | Description |
|------|-------------|
| 1 | Baseline: analysis WITHOUT extended thinking |
| 2 | Test `analyzeFraudRisk()` on obvious fraud |
| 3 | Test audit trail extraction for compliance |
| 4 | Test all 5 transactions |

## 5 Test Transactions

| Transaction | Expected Risk | Reason |
|-------------|---------------|--------|
| legitimate_large | Low | Loyal customer, normal location |
| obvious_fraud | Critical | Foreign location, unusual hours, flagged account |
| ambiguous_case | Medium | Travel purchase, requires judgment |
| velocity_abuse | High | Gift cards, late night, previous flag |
| first_time_buyer | Medium | New account, high-value electronics |

## Key Takeaway

Extended thinking provides transparent reasoning for high-stakes decisions. The audit trail helps compliance teams defend decisions to regulators.

