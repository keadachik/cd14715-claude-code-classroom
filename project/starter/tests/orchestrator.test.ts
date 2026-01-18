import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CodeReviewOrchestrator } from '../src/orchestrator.js';
import { withRetry, withTimeout, ReviewError, ErrorCodes } from '../src/utils/error-handler.js';
import { RateLimiter } from '../src/utils/rate-limiter.js';

/**
 * Tests for CodeReviewOrchestrator and related utilities
 */

describe('CodeReviewOrchestrator', () => {
  describe('Configuration', () => {
    it('should initialize with default options', () => {
      const orchestrator = new CodeReviewOrchestrator();
      // Verify the orchestrator was created successfully
      expect(orchestrator).toBeDefined();
      expect(orchestrator).toBeInstanceOf(CodeReviewOrchestrator);
    });

    it('should accept custom configuration options', () => {
      const orchestrator = new CodeReviewOrchestrator({
        maxCostUsd: 5.00,
        maxTimeMs: 600000,
        fileCount: 10
      });
      expect(orchestrator).toBeDefined();
    });
  });

  describe('Integration', () => {
    // These tests require actual API keys and should be skipped in CI
    it.skip('should review a real small PR', async () => {
      // NOTE: Only run manually with valid API keys
      // The system has been tested with:
      // - octocat/Hello-World PRs
      // - airaamane/simple-todo-app PRs #1, #2, #3
    });
  });
});

describe('Error Handler Utilities', () => {
  describe('withRetry', () => {
    it('should return result on first successful attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await withRetry(fn, 3, 100);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed on subsequent attempt', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockResolvedValue('success');

      const result = await withRetry(fn, 3, 100);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after exhausting all retries', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Always fails'));

      await expect(withRetry(fn, 2, 100)).rejects.toThrow();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should implement exponential backoff', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValue('success');

      const start = Date.now();
      await withRetry(fn, 3, 100);
      const elapsed = Date.now() - start;

      // Should have waited at least 100ms (first retry delay)
      expect(elapsed).toBeGreaterThanOrEqual(100);
    });
  });

  describe('withTimeout', () => {
    it('should return result if function completes before timeout', async () => {
      const fn = vi.fn().mockResolvedValue('fast result');
      const result = await withTimeout(fn, 1000);
      expect(result).toBe('fast result');
    });

    it('should throw ReviewError on timeout', async () => {
      const slowFn = () => new Promise(resolve => setTimeout(resolve, 500));

      await expect(withTimeout(slowFn, 100)).rejects.toThrow(ReviewError);
    });

    it('should include timeout info in error', async () => {
      const slowFn = () => new Promise(resolve => setTimeout(resolve, 500));

      try {
        await withTimeout(slowFn, 100, 'Custom timeout message');
      } catch (error) {
        expect(error).toBeInstanceOf(ReviewError);
        expect((error as ReviewError).code).toBe(ErrorCodes.AGENT_TIMEOUT);
      }
    });
  });

  describe('ReviewError', () => {
    it('should create error with code and metadata', () => {
      const error = new ReviewError('Test error', ErrorCodes.VALIDATION_FAILED, { field: 'test' });
      expect(error.message).toBe('Test error');
      expect(error.code).toBe(ErrorCodes.VALIDATION_FAILED);
      expect(error.metadata).toEqual({ field: 'test' });
    });
  });
});

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter({
      maxRequestsPerMinute: 10,
      maxTokensPerMinute: 10000,
      maxConcurrent: 2
    });
  });

  describe('canProceed', () => {
    it('should return true when under limits', () => {
      expect(rateLimiter.canProceed(1000)).toBe(true);
    });

    it('should return false when token limit would be exceeded', async () => {
      // First, fill up the token budget by acquiring slots
      for (let i = 0; i < 9; i++) {
        await rateLimiter.acquire(1000);
        rateLimiter.release(); // Release to allow next acquire
      }
      // Next request would exceed 10000 token limit (9000 + 2000 > 10000)
      expect(rateLimiter.canProceed(2000)).toBe(false);
    });
  });

  describe('acquire and release', () => {
    it('should track active requests', async () => {
      await rateLimiter.acquire(100);
      const status = rateLimiter.getStatus();
      expect(status.activeRequests).toBe(1);
      expect(status.requestsInWindow).toBe(1);
    });

    it('should decrement active requests on release', async () => {
      await rateLimiter.acquire(100);
      rateLimiter.release();
      const status = rateLimiter.getStatus();
      expect(status.activeRequests).toBe(0);
    });
  });

  describe('getStatus', () => {
    it('should return current rate limit status', () => {
      const status = rateLimiter.getStatus();
      expect(status).toHaveProperty('activeRequests');
      expect(status).toHaveProperty('requestsInWindow');
      expect(status).toHaveProperty('tokensInWindow');
      expect(status).toHaveProperty('availableRequests');
      expect(status).toHaveProperty('availableTokens');
    });

    it('should track tokens accurately', async () => {
      await rateLimiter.acquire(500);
      await rateLimiter.acquire(300);
      const status = rateLimiter.getStatus();
      expect(status.tokensInWindow).toBe(800);
    });
  });
});
