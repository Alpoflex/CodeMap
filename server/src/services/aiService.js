import Anthropic from '@anthropic-ai/sdk';

/**
 * AI Service — Anthropic Claude integration for code analysis
 */

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set. AI features are disabled.');
    }
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

/**
 * Explain what a file does, why it exists, and suggest improvements
 */
export async function explainFile(filePath, fileContent, repoContext) {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are analyzing a file from a GitHub repository. Provide a concise analysis in the following format:

## 📄 What This File Does
(2-3 sentences explaining the file's purpose)

## 🔗 Why It Exists
(1-2 sentences on its role in the project architecture)

## 💡 Suggestions
(2-3 bullet points for improvements)

## ⚡ Complexity
(Rate: Low / Medium / High with brief justification)

---

**Repository:** ${repoContext.owner}/${repoContext.repo}
**File:** ${filePath}

\`\`\`
${fileContent.slice(0, 4000)}
\`\`\`

${fileContent.length > 4000 ? '(File truncated — showing first 4000 characters)' : ''}

Respond in a clear, developer-friendly tone. Be specific and actionable.`,
      },
    ],
  });

  return message.content[0].text;
}

/**
 * Generate a plain-English architecture overview of the repo
 */
export async function summarizeRepo(repoContext, files, edges) {
  const anthropic = getClient();

  // Build a condensed file tree
  const fileTree = files
    .map(f => `${f.path} (${f.lines} lines, ${f.type})`)
    .join('\n');

  // Build edge summary
  const edgeSummary = edges
    .slice(0, 100)
    .map(e => `${e.source} → ${e.target}`)
    .join('\n');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are analyzing a GitHub repository. Generate a comprehensive architecture overview.

## Format your response as:

### 🏗️ Architecture Overview
(3-5 sentences describing the overall architecture)

### 📦 Key Components
(List the main modules/packages and their responsibilities)

### 🔄 Data Flow
(How data flows through the application)

### 🛠️ Tech Stack
(Technologies and frameworks detected)

### 📊 Code Health
(Brief assessment: organization, patterns, potential issues)

### 💡 Recommendations
(3-5 actionable recommendations for improvement)

---

**Repository:** ${repoContext.owner}/${repoContext.repo}
**Total Files:** ${files.length}

**File Tree:**
${fileTree.slice(0, 6000)}

**Dependency Graph (sample):**
${edgeSummary.slice(0, 3000)}

Respond in a clear, developer-friendly tone. Be insightful and specific.`,
      },
    ],
  });

  return message.content[0].text;
}

/**
 * Detect dead code and orphaned files
 */
export async function detectDeadCode(orphanedFiles, repoContext) {
  const anthropic = getClient();

  if (orphanedFiles.length === 0) {
    return '✅ No orphaned files detected. All source files have import relationships.';
  }

  const fileList = orphanedFiles
    .map(f => `- ${f.path} (${f.lines} lines, ${f.type})`)
    .join('\n');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze these orphaned files (files with no import relationships) from a GitHub repository:

**Repository:** ${repoContext.owner}/${repoContext.repo}

**Orphaned Files:**
${fileList}

For each file, determine:
1. Is this truly dead code, or is it likely used in another way (e.g., entry point, config, script, CLI)?
2. Risk level (🟢 Low / 🟡 Medium / 🔴 High) of removing it
3. Brief recommendation

Format as a clear list. Be practical — not all orphaned files are dead code.`,
      },
    ],
  });

  return message.content[0].text;
}
