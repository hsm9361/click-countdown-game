export function randomPosition(
  targetSize: number,
  safeMargin: number,
): { x: number; y: number } {
  const availableWidth = Math.max(0, window.innerWidth - 2 * safeMargin - targetSize)
  const availableHeight = Math.max(0, window.innerHeight - 2 * safeMargin - targetSize)

  const x = safeMargin + Math.random() * availableWidth
  const y = safeMargin + Math.random() * availableHeight

  return { x, y }
}

export function computeTargetSize(defaultSize: number): number {
  const minDim = Math.min(window.innerWidth, window.innerHeight)
  const fluid = Math.floor(minDim * 0.13)
  const cap = Math.max(72, defaultSize)
  return Math.max(48, Math.min(cap, fluid))
}

export function computeSafeMargin(defaultMargin: number): number {
  const minDim = Math.min(window.innerWidth, window.innerHeight)
  const fluid = Math.floor(minDim * 0.08)
  return Math.max(16, Math.min(defaultMargin, fluid))
}
