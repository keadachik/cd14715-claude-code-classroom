# Demo: Claude Skills - Email Etiquette

Build an agent that reviews emails using a Claude Skill.

## Scenario

Your team reviews emails but lacks consistent quality standards. Build an agent that uses an email etiquette skill to analyze emails for tone, structure, and professionalism.

## Project Structure

```
demo/
├── .claude/
│   └── skills/
│       └── email-etiquette/
│           └── SKILL.md        # Email review skill
├── src/
│   ├── email-reviewer.ts       # Exported function (deliverable)
│   ├── sample-emails.ts        # Test emails
│   └── index.ts                # Test
└── README.md
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

## Deliverable: email-reviewer.ts

```typescript
export interface EmailReviewResult {
  raw: string;
}

export async function reviewEmail(
  emailContent: string
): Promise<EmailReviewResult>
```

## Key Pattern: Using Skills with Agent SDK

```typescript
for await (const message of query({
  prompt: reviewPrompt(emailContent),
  options: {
    cwd: PROJECT_ROOT,                    // Where .claude/skills/ lives
    settingSources: ["project"],          // Load skills from filesystem
    allowedTools: ["Skill", "Read", "Grep", "Glob"],
  },
})) { ... }
```

## Skill: email-etiquette

The skill teaches the agent to check for:

| Category | Issues |
|----------|--------|
| Tone | Too casual (slang, emojis), Too formal (archaic language) |
| Structure | Missing greeting, unclear purpose, no sign-off |
| Clarity | Vague requests, missing context |
| Grammar | Typos, incomplete sentences |

## Key Takeaway

Skills extend Claude with reusable expertise stored in `.claude/skills/`. Use `settingSources: ["project"]` to load skills and the `Skill` tool to apply them. Skills provide consistent analysis across agents.

