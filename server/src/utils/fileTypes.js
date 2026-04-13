/**
 * File type definitions — maps extensions to categories and colors
 * Used for graph node coloring and filtering
 */

const FILE_TYPES = {
  // JavaScript / TypeScript
  js:   { category: 'javascript', color: '#f7df1e', label: 'JavaScript' },
  jsx:  { category: 'javascript', color: '#61dafb', label: 'React JSX' },
  ts:   { category: 'typescript', color: '#3178c6', label: 'TypeScript' },
  tsx:  { category: 'typescript', color: '#3178c6', label: 'React TSX' },
  mjs:  { category: 'javascript', color: '#f7df1e', label: 'ES Module' },
  cjs:  { category: 'javascript', color: '#f7df1e', label: 'CommonJS' },

  // Styles
  css:    { category: 'style', color: '#264de4', label: 'CSS' },
  scss:   { category: 'style', color: '#cf649a', label: 'SCSS' },
  sass:   { category: 'style', color: '#cf649a', label: 'Sass' },
  less:   { category: 'style', color: '#1d365d', label: 'Less' },
  styl:   { category: 'style', color: '#ff6347', label: 'Stylus' },

  // Python
  py:   { category: 'python', color: '#3776ab', label: 'Python' },
  pyx:  { category: 'python', color: '#3776ab', label: 'Cython' },
  pyi:  { category: 'python', color: '#3776ab', label: 'Python Stub' },

  // Go
  go:   { category: 'go', color: '#00add8', label: 'Go' },

  // Rust
  rs:   { category: 'rust', color: '#dea584', label: 'Rust' },

  // Java / Kotlin
  java:   { category: 'java', color: '#b07219', label: 'Java' },
  kt:     { category: 'kotlin', color: '#A97BFF', label: 'Kotlin' },
  kts:    { category: 'kotlin', color: '#A97BFF', label: 'Kotlin Script' },

  // C / C++
  c:    { category: 'c', color: '#555555', label: 'C' },
  h:    { category: 'c', color: '#555555', label: 'C Header' },
  cpp:  { category: 'cpp', color: '#f34b7d', label: 'C++' },
  hpp:  { category: 'cpp', color: '#f34b7d', label: 'C++ Header' },
  cc:   { category: 'cpp', color: '#f34b7d', label: 'C++' },

  // Ruby
  rb:   { category: 'ruby', color: '#cc342d', label: 'Ruby' },

  // PHP
  php:  { category: 'php', color: '#4f5d95', label: 'PHP' },

  // Swift
  swift: { category: 'swift', color: '#F05138', label: 'Swift' },

  // Shell
  sh:   { category: 'shell', color: '#89e051', label: 'Shell' },
  bash: { category: 'shell', color: '#89e051', label: 'Bash' },
  zsh:  { category: 'shell', color: '#89e051', label: 'Zsh' },

  // Config
  json:   { category: 'config', color: '#6b7280', label: 'JSON' },
  yaml:   { category: 'config', color: '#6b7280', label: 'YAML' },
  yml:    { category: 'config', color: '#6b7280', label: 'YAML' },
  toml:   { category: 'config', color: '#6b7280', label: 'TOML' },
  ini:    { category: 'config', color: '#6b7280', label: 'INI' },
  env:    { category: 'config', color: '#6b7280', label: 'Env' },
  xml:    { category: 'config', color: '#6b7280', label: 'XML' },

  // Markup / Docs
  md:     { category: 'docs', color: '#8b5cf6', label: 'Markdown' },
  mdx:    { category: 'docs', color: '#8b5cf6', label: 'MDX' },
  txt:    { category: 'docs', color: '#8b5cf6', label: 'Text' },
  rst:    { category: 'docs', color: '#8b5cf6', label: 'reStructuredText' },

  // HTML
  html:   { category: 'html', color: '#e34c26', label: 'HTML' },
  htm:    { category: 'html', color: '#e34c26', label: 'HTML' },
  vue:    { category: 'html', color: '#42b883', label: 'Vue' },
  svelte: { category: 'html', color: '#ff3e00', label: 'Svelte' },

  // Test
  test:   { category: 'test', color: '#22c55e', label: 'Test' },
  spec:   { category: 'test', color: '#22c55e', label: 'Spec' },

  // Data
  sql:    { category: 'data', color: '#e38c00', label: 'SQL' },
  graphql:{ category: 'data', color: '#e10098', label: 'GraphQL' },
  gql:    { category: 'data', color: '#e10098', label: 'GraphQL' },
  prisma: { category: 'data', color: '#2D3748', label: 'Prisma' },

  // Docker
  dockerfile: { category: 'devops', color: '#2496ED', label: 'Dockerfile' },

  // Other
  lock:   { category: 'config', color: '#4b5563', label: 'Lock File' },
};

const DEFAULT_TYPE = { category: 'other', color: '#9ca3af', label: 'Other' };

/**
 * Get file type info from filename
 */
export function getFileType(filename) {
  if (!filename) return DEFAULT_TYPE;

  // Check for test files
  const lowerName = filename.toLowerCase();
  if (lowerName.includes('.test.') || lowerName.includes('.spec.') || lowerName.includes('__test__')) {
    return { category: 'test', color: '#22c55e', label: 'Test' };
  }

  // Check for Dockerfile
  if (lowerName === 'dockerfile' || lowerName.startsWith('dockerfile.')) {
    return FILE_TYPES.dockerfile;
  }

  // Check for dotfiles/configs
  if (lowerName === '.gitignore' || lowerName === '.eslintrc' || lowerName === '.prettierrc') {
    return { category: 'config', color: '#6b7280', label: 'Config' };
  }

  const ext = filename.split('.').pop()?.toLowerCase();
  return FILE_TYPES[ext] || DEFAULT_TYPE;
}

/**
 * Get all unique categories for filtering
 */
export function getAllCategories() {
  const categories = new Set();
  Object.values(FILE_TYPES).forEach(t => categories.add(t.category));
  categories.add('other');
  return Array.from(categories).sort();
}

export default FILE_TYPES;
