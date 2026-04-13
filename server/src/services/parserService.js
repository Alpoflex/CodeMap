import { getFileType } from '../utils/fileTypes.js';
import path from 'path';

/**
 * Parser Service — Regex-based import/dependency analyzer
 * Supports: JavaScript, TypeScript, Python, Go, Rust, CSS, and more
 */

// ──────────────────────────────────────────────
// Import pattern definitions per language
// ──────────────────────────────────────────────

const IMPORT_PATTERNS = {
  javascript: [
    // import X from 'Y'  |  import { X } from 'Y'  |  import 'Y'
    /import\s+(?:[\w*{}\s,]+\s+from\s+)?['"]([^'"]+)['"]/g,
    // require('Y')
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    // import('Y')  —  dynamic import
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    // export { X } from 'Y'
    /export\s+(?:[\w*{}\s,]+\s+from\s+)['"]([^'"]+)['"]/g,
  ],
  python: [
    // import X  |  import X.Y
    /^\s*import\s+([\w.]+)/gm,
    // from X import Y
    /^\s*from\s+([\w.]+)\s+import/gm,
  ],
  go: [
    // import "X"  |  import ( "X" )
    /import\s+(?:\(\s*)?["']([^"']+)["']/g,
    // Individual imports in block
    /^\s*["']([^"']+)["']\s*$/gm,
  ],
  rust: [
    // use X::Y
    /^\s*use\s+([\w:]+)/gm,
    // mod X;
    /^\s*mod\s+(\w+)\s*;/gm,
  ],
  css: [
    // @import 'X'  |  @import url('X')
    /@import\s+(?:url\s*\(\s*)?['"]([^'"]+)['"]/g,
  ],
  java: [
    // import com.example.X
    /^\s*import\s+([\w.]+)/gm,
  ],
  ruby: [
    // require 'X'  |  require_relative 'X'
    /require(?:_relative)?\s+['"]([^'"]+)['"]/g,
  ],
  php: [
    // use Namespace\Class
    /^\s*use\s+([\w\\]+)/gm,
    // require|include 'X'
    /(?:require|include)(?:_once)?\s+['"]([^'"]+)['"]/g,
  ],
};

/**
 * Determine language from file extension
 */
function getLanguage(filePath) {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const langMap = {
    js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
    ts: 'javascript', tsx: 'javascript',
    py: 'python', pyx: 'python',
    go: 'go',
    rs: 'rust',
    css: 'css', scss: 'css', sass: 'css', less: 'css',
    java: 'java', kt: 'java',
    rb: 'ruby',
    php: 'php',
    vue: 'javascript', svelte: 'javascript',
  };
  return langMap[ext] || null;
}

/**
 * Extract imports from file content
 */
function extractImports(content, filePath) {
  const language = getLanguage(filePath);
  if (!language || !IMPORT_PATTERNS[language]) return [];

  const imports = new Set();
  const patterns = IMPORT_PATTERNS[language];

  for (const pattern of patterns) {
    // Reset regex lastIndex
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath) {
        imports.add(importPath);
      }
    }
  }

  return Array.from(imports);
}

/**
 * Resolve an import path to a file in the repository
 */
function resolveImport(importPath, sourceFile, allFiles) {
  const allPaths = allFiles.map(f => f.path || f);
  const sourceDir = path.dirname(sourceFile);

  // Skip external/node_modules imports
  if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
    // Could be a package — check if it maps to a local file
    // For Python: convert dots to slashes
    const pythonPath = importPath.replace(/\./g, '/');
    const candidates = [
      pythonPath + '.py',
      pythonPath + '/__init__.py',
      importPath,
    ];
    for (const candidate of candidates) {
      if (allPaths.includes(candidate)) return candidate;
    }
    return null; // External dependency
  }

  // Resolve relative path
  const resolved = path.normalize(path.join(sourceDir, importPath));

  // Try exact match first
  if (allPaths.includes(resolved)) return resolved;

  // Try with common extensions
  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.vue', '.svelte', '.css', '.scss'];
  for (const ext of extensions) {
    if (allPaths.includes(resolved + ext)) return resolved + ext;
  }

  // Try index file
  const indexFiles = extensions.map(ext => path.join(resolved, 'index' + ext));
  for (const indexFile of indexFiles) {
    if (allPaths.includes(indexFile)) return indexFile;
  }

  return null;
}

/**
 * Build the full dependency graph from repository files
 */
export function buildDependencyGraph(files, fileContents) {
  const nodes = [];
  const edges = [];
  const edgeSet = new Set(); // Prevent duplicate edges

  // Create nodes
  for (const file of files) {
    const filePath = file.path || file;
    const content = fileContents[filePath] || '';
    const lineCount = content ? content.split('\n').length : 0;
    const fileType = getFileType(filePath.split('/').pop());

    nodes.push({
      id: filePath,
      name: filePath.split('/').pop(),
      path: filePath,
      directory: path.dirname(filePath),
      lines: lineCount,
      size: file.size || 0,
      type: fileType.category,
      color: fileType.color,
      label: fileType.label,
    });
  }

  // Create edges from imports
  for (const file of files) {
    const filePath = file.path || file;
    const content = fileContents[filePath];
    if (!content) continue;

    const imports = extractImports(content, filePath);

    for (const imp of imports) {
      const resolved = resolveImport(imp, filePath, files);
      if (resolved) {
        const edgeKey = `${filePath}→${resolved}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({
            source: filePath,
            target: resolved,
            importPath: imp,
          });
        }
      }
    }
  }

  // Calculate connectivity for each node
  const inDegree = {};
  const outDegree = {};
  edges.forEach(edge => {
    outDegree[edge.source] = (outDegree[edge.source] || 0) + 1;
    inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
  });

  nodes.forEach(node => {
    node.inDegree = inDegree[node.id] || 0;
    node.outDegree = outDegree[node.id] || 0;
    node.isOrphan = node.inDegree === 0 && node.outDegree === 0;
  });

  return { nodes, edges };
}

/**
 * Find orphaned files (no imports and not imported by anything)
 */
export function findOrphanedFiles(nodes) {
  return nodes.filter(node => {
    // Config files and docs are expected to be standalone
    if (['config', 'docs', 'other'].includes(node.type)) return false;
    return node.isOrphan;
  });
}

export { extractImports, resolveImport, getLanguage };
