/**
 * API helper functions
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Analyze a GitHub repository
 */
export async function analyzeRepo(repoUrl) {
  return request('/github/analyze', {
    method: 'POST',
    body: JSON.stringify({ url: repoUrl }),
  });
}

/**
 * Fetch a single file's content
 */
export async function fetchFile(owner, repo, path) {
  return request('/github/file', {
    method: 'POST',
    body: JSON.stringify({ owner, repo, path }),
  });
}

/**
 * Get AI explanation of a file
 */
export async function explainFile(filePath, fileContent, owner, repo) {
  return request('/ai/explain', {
    method: 'POST',
    body: JSON.stringify({ filePath, fileContent, owner, repo }),
  });
}

/**
 * Get AI repo summary
 */
export async function summarizeRepo(owner, repo, files, edges) {
  return request('/ai/summarize', {
    method: 'POST',
    body: JSON.stringify({ owner, repo, files, edges }),
  });
}

/**
 * Get AI dead code analysis
 */
export async function analyzeDeadCode(orphanedFiles, owner, repo) {
  return request('/ai/dead-code', {
    method: 'POST',
    body: JSON.stringify({ orphanedFiles, owner, repo }),
  });
}
