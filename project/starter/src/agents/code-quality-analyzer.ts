import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { CODE_QUALITY_ANALYZER_PROMPT } from '../prompts/code-quality-analyzer.prompt.js';

export const codeQualityAnalyzer: AgentDefinition = {
    description: 'Analyzes code for security vulnerabilities, performance issues, and maintainability concerns. Focuses on finding bugs, security flaws, and code smells.',
    prompt: CODE_QUALITY_ANALYZER_PROMPT,
    model: 'inherit',
    tools: ['Read', 'Skill'],
};

