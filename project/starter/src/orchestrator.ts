import { ReviewReport, ReviewReportSchema } from './types/report-types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { orchestratorPrompt } from './prompts/index.js';
import { mcpServersConfig } from './config/mcp.config.js';
import { codeQualityAnalyzer } from './agents/code-quality-analyzer.js';
import { testCoverageAnalyzer } from './agents/test-coverage-analyzer.js';
import { refactoringSuggester } from './agents/refactoring-suggester.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Orchestrator configuration options
 */
export interface OrchestratorOptions {
}

// Lesson 08: Claude Skills で学ぶ設定
// .claude/skills/ ディレクトリの場所を指定
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '../..');
/**
 * Main Code Review Orchestrator
 * Coordinates subagents to analyze pull requests and generate comprehensive reports
 */
export class CodeReviewOrchestrator {


  constructor(options: OrchestratorOptions = {}) {
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
    // 1. Validate the model
    const model = process.env.ANTHROPIC_MODEL;
    if (!model) {
      throw new Error('ANTHROPIC_MODEL is not set');
    }

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

    // 3. Use structured outputs to define the output format
    const result = query({
      prompt: orchestratorPrompt(owner, repo, prNumber),
      options: {
        cwd: PROJECT_ROOT,
        settingSources: ['project'],
        model,
        agents: subagents,
        allowedTools: [
          'Task',
          'mcp__github__get_pull_request',
          'mcp__github__list_pull_request_files',
          'mcp__eslint__lint',
          'Read',
          'Grep',
          'Glob',
          'Skill' // Lesson 08: Claude Skills を使用するために必要
        ],
        mcpServers: mcpServersConfig,
        outputFormat: {
          type: 'json_schema',
          schema: jsonSchema as any,
        },
        maxTurns: 20,
      }
    });

    // 4. Get structured output and validate with Zod schema
    for await (const message of result) {
      if (message.type === 'result' &&
        message.subtype === 'success' &&
        message.structured_output) {
        const parseResult = ReviewReportSchema.safeParse(message.structured_output);
        if (parseResult.success) {
          return parseResult.data;
        } else {
          throw new Error(`Schema validation failed: ${parseResult.error.message}`);
        }
      }
    }

    throw new Error('Failed to get structured output from orchestrator');
  }
}
