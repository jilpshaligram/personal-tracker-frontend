// Predefined vibrant palette suitable for charts
const PALETTE = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#84cc16', // lime-500
  '#06b6d4', // cyan-500
  '#d946ef', // fuchsia-500
];

/**
 * Generates a deterministic color from a given string (e.g. category name).
 * This ensures that 'Food' always gets the same color across different users or periods.
 */
export function getCategoryColor(categoryName: string): string {
  if (!categoryName) return '#94a3b8'; // slate-400 fallback

  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert negative hash to positive
  hash = Math.abs(hash);

  return PALETTE[hash % PALETTE.length];
}
