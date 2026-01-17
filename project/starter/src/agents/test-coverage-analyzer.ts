import { AgentDefinition } from "@anthropic-ai/claude-agent-sdk";
import { TEST_COVERAGE_ANALYZER_PROMPT } from "../prompts/test-coverage-analyzer.prompt.js";

export const testCoverageAnalyzer: AgentDefinition = {
    description: 'Evaluates test completeness and suggests specific test cases. Identifies untested code paths and prioritizes critical test scenarios.',
    prompt: TEST_COVERAGE_ANALYZER_PROMPT,
    model: 'inherit',
    tools: ['Read', 'Grep', 'Glob'],
};