/**
 * File type → color mapping for graph nodes
 * Matches server/src/utils/fileTypes.js
 */

export const FILE_TYPE_COLORS = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  style: '#264de4',
  python: '#3776ab',
  go: '#00add8',
  rust: '#dea584',
  java: '#b07219',
  kotlin: '#A97BFF',
  c: '#555555',
  cpp: '#f34b7d',
  ruby: '#cc342d',
  php: '#4f5d95',
  swift: '#F05138',
  shell: '#89e051',
  config: '#6b7280',
  docs: '#8b5cf6',
  html: '#e34c26',
  test: '#22c55e',
  data: '#e38c00',
  devops: '#2496ED',
  other: '#9ca3af',
};

/**
 * Category → label mapping
 */
export const CATEGORY_LABELS = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  style: 'CSS/Styles',
  python: 'Python',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  kotlin: 'Kotlin',
  c: 'C',
  cpp: 'C++',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  shell: 'Shell',
  config: 'Config',
  docs: 'Docs',
  html: 'HTML/Template',
  test: 'Test',
  data: 'Data',
  devops: 'DevOps',
  other: 'Other',
};

/**
 * Get color for a file type category
 */
export function getColorForType(type) {
  return FILE_TYPE_COLORS[type] || FILE_TYPE_COLORS.other;
}

/**
 * Get all unique categories from nodes
 */
export function getUniqueCategories(nodes) {
  const categories = new Set(nodes.map(n => n.type));
  return Array.from(categories).sort();
}
