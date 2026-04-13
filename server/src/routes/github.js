import { Router } from 'express';
import { parseRepoUrl, fetchRepoTree, fetchMultipleFiles } from '../services/githubService.js';
import { buildDependencyGraph, findOrphanedFiles } from '../services/parserService.js';

const router = Router();

/**
 * POST /api/github/analyze
 * Analyze a GitHub repository — fetch tree, parse imports, build graph
 */
router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Parse the repo URL
    const { owner, repo } = parseRepoUrl(url);
    console.log(`\n📊 Analyzing: ${owner}/${repo}`);

    // Fetch file tree
    console.log('  → Fetching file tree...');
    const { files, truncated, totalFiles } = await fetchRepoTree(owner, repo);
    console.log(`  → Found ${files.length} files (${totalFiles} total, truncated: ${truncated})`);

    // Determine which files to fetch content for (source code only)
    const sourceExtensions = new Set([
      'js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs',
      'py', 'pyx', 'go', 'rs', 'rb', 'php',
      'java', 'kt', 'c', 'cpp', 'h', 'hpp', 'cc',
      'css', 'scss', 'sass', 'less',
      'vue', 'svelte',
      'swift', 'sh', 'bash',
    ]);

    const sourceFiles = files.filter(f => {
      const ext = f.path.split('.').pop()?.toLowerCase();
      return sourceExtensions.has(ext);
    });

    // Fetch file contents (limit to avoid rate limits)
    const filesToFetch = sourceFiles.slice(0, 200);
    console.log(`  → Fetching content for ${filesToFetch.length} source files...`);
    const fileContents = await fetchMultipleFiles(
      owner, repo,
      filesToFetch.map(f => f.path),
    );
    console.log(`  → Fetched ${Object.keys(fileContents).length} files`);

    // Build dependency graph
    console.log('  → Building dependency graph...');
    const graph = buildDependencyGraph(files, fileContents);
    const orphanedFiles = findOrphanedFiles(graph.nodes);
    console.log(`  → Graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges, ${orphanedFiles.length} orphans`);

    res.json({
      owner,
      repo,
      graph,
      orphanedFiles: orphanedFiles.map(f => f.id),
      stats: {
        totalFiles: totalFiles,
        analyzedFiles: files.length,
        fetchedFiles: Object.keys(fileContents).length,
        nodes: graph.nodes.length,
        edges: graph.edges.length,
        orphans: orphanedFiles.length,
        truncated,
      },
    });

  } catch (error) {
    console.error('GitHub analyze error:', error.message);
    res.status(error.status || 500).json({
      error: error.message || 'Failed to analyze repository',
    });
  }
});

/**
 * POST /api/github/file
 * Fetch content of a single file
 */
router.post('/file', async (req, res) => {
  try {
    const { owner, repo, path: filePath } = req.body;

    if (!owner || !repo || !filePath) {
      return res.status(400).json({ error: 'owner, repo, and path are required' });
    }

    const { fetchFileContent } = await import('../services/githubService.js');
    const content = await fetchFileContent(owner, repo, filePath);

    if (content === null) {
      return res.status(404).json({ error: 'File not found or is binary' });
    }

    res.json({ content, path: filePath });

  } catch (error) {
    console.error('File fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
