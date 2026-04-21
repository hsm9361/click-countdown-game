const HIGH_SCORE_KEY = 'clickCountdown_highScore'

export function getHighScore(): number {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_KEY)
    if (raw === null) return 0
    const parsed = parseInt(raw, 10)
    return isNaN(parsed) ? 0 : parsed
  } catch {
    return 0
  }
}

export function setHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score))
  } catch {
    // private browsing or storage disabled — silent no-op
  }
}
