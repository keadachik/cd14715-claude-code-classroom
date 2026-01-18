import { describe, it, expect } from 'vitest';
import { CodeQualityResultSchema, TestCoverageResultSchema, RefactoringSuggestionSchema } from '../src/types/index.js';

describe('Schema Validation', () => {
    it('should accept valid CodeQualityResult', () => {
        const validData = {
            issues: [
                {
                    type: 'security',
                    severity: 'high',
                    file: 'src/payment.ts',
                    line: 42,
                    message: 'Potential SQL injection',
                    suggestion: 'Use parameterized queries'
                }
            ],
            overallScore: 85
        };

        expect(() => CodeQualityResultSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid CodeQualityResult', () => {
        const invalidData = {
            issues: [],
            overallScore: 150 // スコアは0-100の範囲外
        };

        expect(() => CodeQualityResultSchema.parse(invalidData)).toThrow();
    });
});