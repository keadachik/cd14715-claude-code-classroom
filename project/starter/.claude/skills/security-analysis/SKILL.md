---
name: security-analysis
description: Analyzes code for security vulnerabilities based on OWASP Top 10 and secure coding practices. Use when reviewing any code files for security issues, checking authentication/authorization logic, identifying injection vulnerabilities, detecting sensitive data exposure, or evaluating access control implementations.
---

# Security Analysis Skill

## Expertise

Security-focused code review with emphasis on OWASP Top 10 vulnerabilities and secure coding practices. Provides expert-level analysis for identifying security flaws, authentication weaknesses, injection vulnerabilities, and common security mistakes in modern codebases.

## Capabilities

- Detecting OWASP Top 10 vulnerabilities (injection, broken authentication, sensitive data exposure)
- Identifying authentication and authorization flaws
- Analyzing access control implementations
- Detecting insecure data handling and storage
- Reviewing input validation and sanitization
- Identifying security misconfigurations
- Checking for hardcoded secrets and credentials
- Evaluating secure coding practices

## Analysis Criteria

### OWASP Top 10 Vulnerabilities

**A01:2021 – Broken Access Control**
- Problem: Missing or improper access control checks
- Impact: Unauthorized access to resources, privilege escalation
- Fix: Implement proper role-based access control (RBAC), validate permissions before operations
- Examples: Missing authorization checks, direct object references without validation

**A02:2021 – Cryptographic Failures**
- Problem: Weak or missing encryption, sensitive data exposure
- Impact: Data breaches, exposure of PII or credentials
- Fix: Use strong encryption algorithms, never store passwords in plaintext, use HTTPS
- Examples: Plaintext passwords, weak hashing algorithms, missing SSL/TLS

**A03:2021 – Injection**
- Problem: Untrusted user input used directly in queries or commands
- Impact: Data breaches, remote code execution, system compromise
- Fix: Use parameterized queries, input validation, output encoding
- Examples: SQL injection, XSS, command injection, NoSQL injection

**A04:2021 – Insecure Design**
- Problem: Missing or weak security controls in design
- Impact: Systemic vulnerabilities, security bypass
- Fix: Implement security by design, threat modeling, defense in depth
- Examples: Missing rate limiting, lack of input validation, weak session management

**A05:2021 – Security Misconfiguration**
- Problem: Insecure default configurations, exposed debug information
- Impact: Information disclosure, unauthorized access
- Fix: Secure defaults, remove unnecessary features, update dependencies
- Examples: Default passwords, exposed error messages, debug mode enabled

**A06:2021 – Vulnerable and Outdated Components**
- Problem: Using dependencies with known vulnerabilities
- Impact: Exploitation of known vulnerabilities
- Fix: Keep dependencies updated, use dependency scanning tools
- Examples: Outdated npm packages, vulnerable libraries

**A07:2021 – Identification and Authentication Failures**
- Problem: Weak authentication mechanisms, session management flaws
- Impact: Account takeover, unauthorized access
- Fix: Strong passwords, multi-factor authentication, secure session handling
- Examples: Weak password policies, session fixation, password in URL

**A08:2021 – Software and Data Integrity Failures**
- Problem: Insecure CI/CD pipelines, deserialization of untrusted data
- Impact: Supply chain attacks, code injection
- Fix: Verify integrity of dependencies, secure CI/CD, validate serialized data
- Examples: Unsigned dependencies, insecure deserialization

**A09:2021 – Security Logging and Monitoring Failures**
- Problem: Insufficient logging or monitoring
- Impact: Delayed detection of attacks, incomplete audit trails
- Fix: Log security events, monitor for anomalies, alert on suspicious activities
- Examples: Missing authentication logs, no failed login attempts tracking

**A10:2021 – Server-Side Request Forgery (SSRF)**
- Problem: Server makes requests based on untrusted user input
- Impact: Internal network access, information disclosure
- Fix: Validate and sanitize URLs, use allowlists, restrict network access
- Examples: Fetching URLs from user input, internal API calls based on user data

### Common Security Issues

**Hardcoded Secrets**
- Problem: API keys, passwords, or tokens in source code
- Impact: Credential exposure, unauthorized access
- Fix: Use environment variables, secrets management, never commit secrets

**Cross-Site Scripting (XSS)**
- Problem: User input rendered without sanitization
- Impact: Session hijacking, credential theft, malicious script execution
- Fix: Output encoding, Content Security Policy (CSP), input validation

**SQL Injection**
- Problem: User input concatenated into SQL queries
- Impact: Database compromise, data theft, data manipulation
- Fix: Parameterized queries, prepared statements, input validation

**Insecure Direct Object References**
- Problem: Direct access to internal resources without authorization
- Impact: Unauthorized data access, privilege escalation
- Fix: Implement access control checks, use indirect references

**Missing Input Validation**
- Problem: User input used without validation or sanitization
- Impact: Injection attacks, data corruption, system compromise
- Fix: Validate and sanitize all user input, use allowlists

## Examples

### Example 1: SQL Injection Vulnerability

**Input:**
```typescript
function getUserData(userId: string) {
  const query = `SELECT * FROM users WHERE id = '${userId}'`;
  return db.query(query);
}
```

**Analysis:**
- Problem: User input directly concatenated into SQL query
- Impact: SQL injection attack, database compromise
- Fix: Use parameterized queries or prepared statements

**Fixed:**
```typescript
function getUserData(userId: string) {
  const query = 'SELECT * FROM users WHERE id = ?';
  return db.query(query, [userId]);
}
```

### Example 2: Hardcoded Credentials

**Input:**
```typescript
const apiKey = 'sk-1234567890abcdef';
const dbPassword = 'admin123';
```

**Analysis:**
- Problem: Secrets hardcoded in source code
- Impact: Credential exposure if code is committed or leaked
- Fix: Use environment variables or secrets management

**Fixed:**
```typescript
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable is required');
}
```

### Example 3: Missing Access Control

**Input:**
```typescript
async function deleteUser(userId: string) {
  await db.delete('users', { id: userId });
}
```

**Analysis:**
- Problem: No authorization check before deletion
- Impact: Unauthorized deletion, privilege escalation
- Fix: Add authorization check before operation

**Fixed:**
```typescript
async function deleteUser(userId: string, currentUser: User) {
  if (currentUser.role !== 'admin' && currentUser.id !== userId) {
    throw new Error('Unauthorized');
  }
  await db.delete('users', { id: userId });
}
```

## Output Format

Return JSON with:
```json
{
  "issues": [
    {
      "line": 10,
      "severity": "critical" | "high" | "medium" | "low",
      "category": "injection" | "authentication" | "authorization" | "data-exposure" | "configuration" | "other",
      "owasp": "A01" | "A02" | "A03" | "A04" | "A05" | "A06" | "A07" | "A08" | "A09" | "A10",
      "rule": "sql-injection",
      "message": "Description of the security issue",
      "suggestion": "How to fix it",
      "codeExample": "Example fix"
    }
  ],
  "summary": {
    "critical": 2,
    "high": 3,
    "medium": 1,
    "low": 0
  },
  "securityScore": 65
}
```