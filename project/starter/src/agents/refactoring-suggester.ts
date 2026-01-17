import { AgentDefinition } from "@anthropic-ai/claude-agent-sdk";
import { REF_SUGGESTER_PROMPT } from "../prompts/refactoring-suggester.prompt.js";

export const refactoringSuggester: AgentDefinition = {
    description: 'Identifies opportunities to improve code structure, modernize patterns, and apply design principles. Suggests extract method/class candidates and dead code removal.',
    prompt: REF_SUGGESTER_PROMPT,
    model: 'inherit',
    tools: ['Read', 'Grep', 'Glob'],
};