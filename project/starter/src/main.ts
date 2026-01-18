import * as dotenv from 'dotenv';
import { writeFile, mkdir } from 'fs/promises';
import { execSync } from 'child_process';
import { ReportGenerator } from './utils/report-generator';
import { CodeReviewOrchestrator } from './orchestrator';

// Load environment variables
dotenv.config();

/**
 * Main entry point for the Claude Multi-Agent Code Review System
 * Usage: npm run dev <owner> <repo> <pr-number>
 */
async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  // TODO: Validate command line arguments
  // - Check if owner, repo, and prStr are provided
  // - Convert prStr to number and validate it's a valid integer
  // - Exit with error message if validation fails

  if (!owner || !repo || !prStr) {
    console.error('Usage: npm run dev <owner> <repo> <pr-number>');
    process.exit(1);
  }

  const prNumber = parseInt(prStr, 10);
  if (isNaN(prNumber) || prNumber <= 0) {
    console.error('Error: PR number must be a positive integer');
    process.exit(1);
  }

  // TODO: Validate authentication (choose ONE method)
  // Students must have either:
  //   - ANTHROPIC_API_KEY environment variable, OR
  //   - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY for Bedrock
  //
  // If using AWS Bedrock:
  //   - Verify AWS_REGION is set
  //   - Log: "🔐 Using AWS Bedrock authentication"
  // If using Anthropic API:
  //   - Log: "🔐 Using Anthropic API authentication"
  // If neither method is configured:
  //   - Exit with clear error message showing both options

  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasAwsCredentials = !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  );
  if (!hasAnthropicKey && !hasAwsCredentials) {
    console.error('Error: Authentication required');
    console.error('Set either ANTHROPIC_API_KEY or AWS credentials');
    process.exit(1);
  }

  if (hasAwsCredentials && !process.env.AWS_REGION) {
    console.error('Error: AWS_REGION is required when using AWS credentials');
    process.exit(1);
  }

  console.log(hasAwsCredentials ? '🔐 Using AWS Bedrock authentication' : '🔐 Using Anthropic API authentication');

  // TODO: Validate ANTHROPIC_MODEL environment variable
  // This is REQUIRED for both authentication methods
  // - For AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0
  // - For Anthropic API: claude-sonnet-4-5-20250929
  // Exit with error if not set

  const model = process.env.ANTHROPIC_MODEL;
  if (!model) {
    console.error('Error: ANTHROPIC_MODEL is not set');
    console.error('For AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0');
    console.error('For Anthropic API: claude-sonnet-4-5-20250929');
    process.exit(1);
  }

  try {
    // Get file count from PR for dynamic maxTurns calculation
    let fileCount = 8; // Default assumption
    try {
      const ghOutput = execSync(
        `gh pr view ${prNumber} --repo ${owner}/${repo} --json files --jq '.files | length'`,
        { encoding: 'utf-8', timeout: 10000 }
      ).trim();
      fileCount = parseInt(ghOutput, 10) || 8;
      console.log(`📁 PR has ${fileCount} changed files`);
    } catch (ghError) {
      console.warn(`⚠️  Could not get file count via gh CLI, using default: ${fileCount}`);
    }

    // TODO: Create orchestrator instance
    // TODO: Call .reviewPullRequest(owner, repo, prNumber);
    // TODO: Generate formatted reports using ReportGenerator
    // Hint: Use ReportGenerator to create Markdown, HTML, and JSON reports
    // Save reports to 'reports/' directory with appropriate filenames
    const orchestrator = new CodeReviewOrchestrator({ fileCount });
    const report = await orchestrator.reviewPullRequest(owner, repo, prNumber);

    // Generate formatted reports using ReportGenerator
    const reportGenerator = new ReportGenerator();
    const filename = `${owner}_${repo}_${prNumber}`;

    // Create reports directory if it doesn't exist
    await mkdir('reports', { recursive: true });

    // Generate and save reports in all three formats
    await writeFile(`reports/${filename}.json`, reportGenerator.generateJSONReport(report));
    await writeFile(`reports/${filename}.md`, reportGenerator.generateMarkdownReport(report));
    await writeFile(`reports/${filename}.html`, reportGenerator.generateHTMLReport(report));

    console.log(`✅ Reports generated in reports/ directory`);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
