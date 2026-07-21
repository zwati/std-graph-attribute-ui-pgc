// src/utils/formatDate.js
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatMonth(monthStr) {
  // "2026-07" → "Jul 2026"
  if (!monthStr) return '—';
  const [y, m] = monthStr.split('-');
  return new Date(y, m - 1, 1).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' });
}
