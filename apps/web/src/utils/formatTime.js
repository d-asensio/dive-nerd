function padTo2Digits (num) {
  return num.toString().padStart(2, '0')
}

export function formatTimeMinutes (totalMinutes) {
  if (typeof totalMinutes !== 'number') return

  const minutes = Math.floor(totalMinutes)
  const seconds = Math.round((totalMinutes * 60) % 60)

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
}
