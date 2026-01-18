import { describe, it, expect } from 'vitest';
import { CodeQualityResultSchema, TestCoverageResultSchema, RefactoringSuggestionSchema } from '../src/types/index.js';

describe('Schema Validation', () => {
    it('should accept valid CodeQualityResult', () => {
        const validData = {
            file: 'src/payment.ts',
            issues: [
                {
                    line: 42,
                    severity: 'high',
                    category: 'security',
                    description: 'Potential SQL injection',
                    suggestion: 'Use parameterized queries'
                }
            ],
            overallScore: 85,
            summary: 'Code quality is good with one security concern'
        };

        expect(() => CodeQualityResultSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid CodeQualityResult', () => {
        const invalidData = {
            file: 'src/test.ts',
            issues: [],
            overallScore: 150, // Score out of 0-100 range
            summary: 'Test summary'
        };

        expect(() => CodeQualityResultSchema.parse(invalidData)).toThrow();
    });

    it('should accept valid TestCoverageResult', () => {
        const validData = {
            file: 'src/utils.ts',
            hasTests: true,
            testFiles: ['src/utils.test.ts'],
            untestedPaths: [
                {
                    type: 'function',
                    location: 'processData:15',
                    priority: 'high',
                    reasoning: 'Critical data processing function',
                    suggestedTest: 'Test with edge cases'
                }
            ],
            coverageEstimate: 75,
            summary: 'Good coverage but missing edge cases'
        };

        expect(() => TestCoverageResultSchema.parse(validData)).not.toThrow();
    });

    it('should accept valid RefactoringSuggestion', () => {
        const validData = {
            file: 'src/handlers.ts',
            suggestions: [
                {
                    type: 'extract-function',
                    location: 'handleRequest:50-80',
                    impact: 'high',
                    description: 'Extract validation logic',
                    before: 'if (x && y && z) { ... }',
                    after: 'if (isValid(x, y, z)) { ... }',
                    benefits: 'Improved readability and testability'
                }
            ],
            summary: 'One high-impact refactoring opportunity found'
        };

        expect(() => RefactoringSuggestionSchema.parse(validData)).not.toThrow();
    });
});
