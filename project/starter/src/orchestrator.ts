import { ReviewReport, ReviewReportSchema } from './types/report-types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { orchestratorPrompt } from './prompts/index.js';
import { mcpServersConfig } from './config/mcp.config.js';
import { codeQualityAnalyzer } from './agents/code-quality-analyzer.js';
import { testCoverageAnalyzer } from './agents/test-coverage-analyzer.js';
import { refactoringSuggester } from './agents/refactoring-suggester.js';
import { withRetry, withTimeout, ReviewError, ErrorCodes } from './utils/error-handler.js';
import { RateLimiter } from './utils/rate-limiter.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Orchestrator configuration options
 */
export interface OrchestratorOptions {
  maxCostUsd?: number;      // Cost limit in USD (default: 1.00)
  maxTimeMs?: number;       // Time limit in ms (default: 300000 = 5min)
  fileCount?: number;       // Number of files for dynamic maxTurns
}

// Lesson 08: Claude Skills で学ぶ設定
// .claude/skills/ ディレクトリの場所を指定
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '../..');

/**
 * Main Code Review Orchestrator
 * Coordinates subagents to analyze pull requests and generate comprehensive reports
 */
export class CodeReviewOrchestrator {
  private maxCostUsd: number;
  private maxTimeMs: number;
  private fileCount: number;
  private rateLimiter: RateLimiter;

  constructor(options: OrchestratorOptions = {}) {
    this.maxCostUsd = options.maxCostUsd ?? 2.00;
    this.maxTimeMs = options.maxTimeMs ?? 480000; // 8 minutes
    this.fileCount = options.fileCount ?? 8; // Default assumption
    // Initialize rate limiter with conservative limits for API calls
    this.rateLimiter = new RateLimiter({
      maxRequestsPerMinute: 30,
      maxTokensPerMinute: 80000,
      maxConcurrent: 3
    });
  }

  /**
   * Review a pull request using parallel subagent analysis
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param prNumber - Pull request number
   * @returns Complete review report
   */
  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    // Wrap the entire operation with retry logic for transient failures
    return withRetry(
      () => this.executeReview(owner, repo, prNumber),
      2, // Max 2 retries (3 total attempts)
      5000 // 5 second base delay between retries
    );
  }

  /**
   * Internal method that executes the actual review with timeout protection
   */
  private async executeReview(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    // 1. Validate the model
    const model = process.env.ANTHROPIC_MODEL;
    if (!model) {
      throw new ReviewError('ANTHROPIC_MODEL is not set', ErrorCodes.INVALID_CONFIG);
    }

    // 2. Acquire rate limit slot before making API call
    const estimatedTokens = this.fileCount * 5000; // Estimate tokens based on file count
    console.log(`🔒 Acquiring rate limit slot (estimated ${estimatedTokens} tokens)...`);
    await this.rateLimiter.acquire(estimatedTokens);
    console.log(`✅ Rate limit slot acquired. Status:`, this.rateLimiter.getStatus());

    // 2. Define subagent as a Record type
    const subagents = {
      'code-quality-analyzer': codeQualityAnalyzer,
      'test-coverage-analyzer': testCoverageAnalyzer,
      'refactoring-suggester': refactoringSuggester
    };

    // Convert Zod schema to JSON Schema
    const jsonSchema = zodToJsonSchema(ReviewReportSchema as any, {
      $refStrategy: 'root'
    });

    // Dynamic maxTurns based on file count
    const maxTurns = 30 + (this.fileCount * 8);

    // Cost estimation
    const estimatedCost = this.fileCount * 0.15;
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Starting PR Review: ${owner}/${repo}#${prNumber}`);
    console.log(`📊 Files: ${this.fileCount} | MaxTurns: ${maxTurns}`);
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(2)} | Limit: $${this.maxCostUsd.toFixed(2)}`);
    console.log(`⏱️  Time limit: ${this.maxTimeMs / 1000}s`);
    console.log(`${'='.repeat(60)}\n`);

    // 3. Use structured outputs to define the output format
    const result = query({
      prompt: orchestratorPrompt(owner, repo, prNumber),
      options: {
        cwd: PROJECT_ROOT,
        settingSources: ['project'],
        model,
        agents: subagents,
        allowedTools: [
          'Task', // Required for subagent invocation
          'mcp__github__get_pull_request',
          'mcp__github__get_pull_request_files',
          'mcp__eslint__lint', // ESLint MCP for code linting
        ],
        mcpServers: mcpServersConfig,
        outputFormat: {
          type: 'json_schema',
          schema: jsonSchema as any,
        },
        maxTurns,
      }
    });

    // 4. Observability and early failure detection
    const startTime = Date.now();
    let turnCount = 0;
    let taskCount = 0;
    let githubMcpCount = 0;
    let readCount = 0;
    const toolHistory: string[] = [];
    const expectedMaxReads = this.fileCount * 3 + 10; // 3 subagents × files + buffer

    try {
    for await (const message of result) {
      const elapsed = Date.now() - startTime;
      const elapsedSec = (elapsed / 1000).toFixed(1);

      // Time-based abort
      if (elapsed > this.maxTimeMs) {
        console.error(`\n❌ ABORT: Time limit exceeded (${this.maxTimeMs / 1000}s)`);
        console.error(`   Turns: ${turnCount}, Tasks: ${taskCount}`);
        throw new Error(`Time limit exceeded: ${elapsedSec}s`);
      }

      // 3-minute warning
      if (elapsed > 180000 && elapsed < 181000) {
        console.warn(`\n⚠️  WARNING: 3 minutes elapsed. Turns: ${turnCount}, Tasks: ${taskCount}`);
      }

      // Debug: Log all message types to understand timing
      console.log(`[${elapsedSec}s] Message type: ${message.type}${message.type === 'result' ? ` (${message.subtype})` : ''}`);

      if (message.type === 'assistant') {
        turnCount++;
        const content = message.message?.content;

        // Progress indicator
        const progress = Math.round((turnCount / maxTurns) * 100);
        const progressBar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));

        if (Array.isArray(content)) {
          for (const block of content) {
            if (block.type === 'tool_use') {
              const toolName = block.name;
              toolHistory.push(toolName);

              // Count specific tools
              if (toolName === 'Task') taskCount++;
              if (toolName.startsWith('mcp__github__')) githubMcpCount++;
              if (toolName === 'Read') readCount++;

              // Log with progress
              console.log(`[${elapsedSec}s] Turn ${turnCount}/${maxTurns} [${progressBar}] ${progress}%`);
              console.log(`         → ${toolName} (Tasks: ${taskCount}/3, GitHub: ${githubMcpCount}/2, Reads: ${readCount})`);

              // Read overuse warning
              if (readCount > expectedMaxReads) {
                console.warn(`\n⚠️  WARNING: Read calls (${readCount}) exceed expected max (${expectedMaxReads})`);
              }
            }
          }
        }

        // Early failure detection - Turn-based
        if (turnCount === 5 && githubMcpCount === 0) {
          console.error(`\n❌ ABORT: No GitHub MCP calls in first 5 turns`);
          console.error(`   Tools used: ${toolHistory.join(', ')}`);
          throw new Error('Early failure: GitHub MCP not called');
        }

        if (turnCount === 10 && taskCount < 3) {
          console.error(`\n❌ ABORT: Only ${taskCount}/3 Tasks called in first 10 turns`);
          console.error(`   Tools used: ${toolHistory.join(', ')}`);
          throw new Error(`Early failure: Only ${taskCount}/3 Tasks invoked`);
        }

        // 80% warning
        if (turnCount === Math.floor(maxTurns * 0.8)) {
          console.warn(`\n⚠️  WARNING: 80% of maxTurns reached (${turnCount}/${maxTurns})`);
          console.warn(`   Tasks: ${taskCount}/3, Elapsed: ${elapsedSec}s`);
        }

      } else if (message.type === 'result') {
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

        if (message.subtype === 'success' && message.structured_output) {
          console.log(`\n✅ SUCCESS in ${totalTime}s (${turnCount} turns)`);

          const parseResult = ReviewReportSchema.safeParse(message.structured_output);
          if (parseResult.success) {
            return parseResult.data;
          } else {
            console.error('Schema validation failed:', parseResult.error.message);
            throw new Error(`Schema validation failed: ${parseResult.error.message}`);
          }
        } else if (message.subtype === 'error_max_turns') {
          console.error(`\n❌ FAILED: Max turns reached in ${totalTime}s`);
          console.error(`   Turns: ${turnCount}, Tasks: ${taskCount}/3`);
          console.error(`   Last 10 tools: ${toolHistory.slice(-10).join(', ')}`);
          throw new Error('Orchestrator failed: max turns reached');
        } else {
          console.error(`\n❌ FAILED: ${message.subtype || 'unknown error'} in ${totalTime}s`);
          throw new Error(`Orchestrator failed: ${message.subtype || 'unknown error'}`);
        }
      }
    }

    throw new ReviewError('Failed to get structured output from orchestrator', ErrorCodes.STRUCTURED_OUTPUT_FAILED);
    } finally {
      // Always release the rate limiter slot when done
      this.rateLimiter.release(estimatedTokens);
      console.log(`🔓 Rate limit slot released.`);
    }
  }
}
