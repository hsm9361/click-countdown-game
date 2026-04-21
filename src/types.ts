export type GameState = 'playing' | 'gameover'

export interface GameConfig {
  initialTimeMs: number
  decayFactor: number
  minTimeMs: number
  targetSizePx: number
  safeMarginPx: number
  multiClickChance: number
  multiClickStartRound: number
  multiClickMin: number
  multiClickMax: number
}

export const DEFAULT_CONFIG: GameConfig = {
  initialTimeMs: 2000,
  decayFactor: 0.93,
  minTimeMs: 300,
  targetSizePx: 64,
  safeMarginPx: 56,
  multiClickChance: 0.25,
  multiClickStartRound: 3,
  multiClickMin: 2,
  multiClickMax: 3,
}
