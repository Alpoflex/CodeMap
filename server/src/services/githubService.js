import { Octokit } from '@octokit/rest';

/**
 * GitHub API service — fetches repository structure and file contents
 */

let octokit = null;

function getOctokit() {
  if (!octokit) {
    octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }
  return octokit;
}

/**
 * Parse owner/repo from a GitHub URL
 */
export function parseRepoUrl(url) {
  // Handle formats:
  // https://github.com/owner/repo
  // https://github.com/owner/repo.git
  // github.com/owner/repo
  // owner/repo
  const cleaned = url.replace(/\.git$/, '').replace(/\/$/, '');
  const match = cleaned.match(/(?:github\.com\/)?([^/]+)\/([^/]+)$/);
  if (!match) throw new Error('Invalid GitHub repository URL');
  return { owner: match[1], repo: match[2] };
}

/**
 * Fetch the entire file tree of a repository
 */
export async function fetchRepoTree(owner, repo, branch = 'main') {
  const client = getOctokit();

  // Try to get the default branch first
  let defaultBranch = branch;
  try {
    const { data: repoData } = await client.repos.get({ owner, repo });
    defaultBranch = repoData.default_branch;
  } catch (err) {
    console.warn('Could not fetch repo metadata, using branch:', branch);
  }

  try {
    const { data } = await client.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: 'true',
    });

    // Filter to only blob (file) entries, skip very large trees
    const files = data.tree
      .filter(item => item.type === 'blob')
      .filter(item => !shouldIgnoreFile(item.path))
      .slice(0, 500); // Limit to 500 files for performance

    return {
      files,
      truncated: data.truncated,
      totalFiles: data.tree.filter(i => i.type === 'blob').length,
    };
  } catch (err) {
    if (err.status === 404) {
      throw new Error(`Repository not found: ${owner}/${repo}. Check the URL and ensure the repo is public or your token has access.`);
    }
    throw err;
  }
}

/**
 * Fetch content of a single file
 */
export async function fetchFileContent(owner, repo, path, ref) {
  const client = getOctokit();

  try {
    const { data } = await client.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    if (data.content) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return content;
    }
    return null;
  } catch (err) {
    // File might be too large or binary
    return null;
  }
}

/**
 * Fetch contents of multiple files (batched)
 */
export async function fetchMultipleFiles(owner, repo, paths, ref) {
  const BATCH_SIZE = 10;
  const results = {};

  for (let i = 0; i < paths.length; i += BATCH_SIZE) {
    const batch = paths.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (path) => {
      const content = await fetchFileContent(owner, repo, path, ref);
      return { path, content };
    });

    const batchResults = await Promise.allSettled(promises);
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.content) {
        results[result.value.path] = result.value.content;
      }
    });

    // Small delay between batches to respect rate limits
    if (i + BATCH_SIZE < paths.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Files to ignore in the tree
 */
function shouldIgnoreFile(path) {
  const ignorePaths = [
    'node_modules/', '.git/', 'vendor/', '__pycache__/',
    '.next/', 'dist/', 'build/', 'coverage/', '.cache/',
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    '.DS_Store', 'thumbs.db',
  ];

  const lowerPath = path.toLowerCase();
  return ignorePaths.some(ignore => lowerPath.includes(ignore));
}
