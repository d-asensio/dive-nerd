export function formatNumber ({ value, precision, units }) {
  if (typeof value !== 'number') return ''

  return `${value.toFixed(precision)} ${units}`
}
