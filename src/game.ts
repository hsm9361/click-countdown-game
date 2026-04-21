import { DEFAULT_CONFIG, type GameState } from './types'
import { pickEmoji } from './images'
import { computeSafeMargin, computeTargetSize, randomPosition } from './position'
import { getHighScore, setHighScore } from './storage'
import { Timer } from './timer'
import { createGameUI, type GameUI } from './render'
import { createKeyboardInput } from './input'

export function startGame(container: HTMLElement): void {
  const config = DEFAULT_CONFIG

  let state: GameState = 'playing'
  let score = 0
  let currentTimeMs = config.initialTimeMs
  let previousEmoji: string | null = null
  let timer: Timer | null = null
  let roundStartedAt = 0
  let roundIndex = 0
  let clicksRemaining = 1
  const reactionTimes: number[] = []
  let ui: GameUI = createGameUI(container)
  const input = createKeyboardInput({
    getMode: () => state,
    getTarget: () => ui.getCurrentTarget(),
    getRestartButton: () => ui.getRestartButton(),
  })

  function pickClicksRequired(): number {
    if (roundIndex < config.multiClickStartRound) return 1
    if (Math.random() >= config.multiClickChance) return 1
    const span = config.multiClickMax - config.multiClickMin + 1
    return config.multiClickMin + Math.floor(Math.random() * span)
  }

  function startRound(): void {
    roundIndex += 1
    const emoji = pickEmoji(previousEmoji)
    previousEmoji = emoji

    const timeLimitMs = Math.max(currentTimeMs, config.minTimeMs)
    const targetSize = computeTargetSize(config.targetSizePx)
    const safeMargin = computeSafeMargin(config.safeMarginPx)
    const position = randomPosition(targetSize, safeMargin)
    const clicksRequired = pickClicksRequired()
    clicksRemaining = clicksRequired

    timer = new Timer(
      timeLimitMs,
      (_remainingMs: number, fraction: number) => {
        ui.updateTimer(fraction)
        ui.updateScore(score)
      },
      () => {
        gameOver()
      },
    )

    ui.showTarget(emoji, position.x, position.y, targetSize, onTargetClicked, clicksRequired)
    ui.updateTimer(1)
    ui.updateScore(score)
    roundStartedAt = performance.now()
    timer.start()
  }

  function onTargetClicked(): void {
    if (state !== 'playing') return
    clicksRemaining -= 1
    if (clicksRemaining > 0) {
      ui.pulseTarget(clicksRemaining, onTargetClicked)
      return
    }
    const reactionMs = performance.now() - roundStartedAt
    reactionTimes.push(reactionMs)
    if (timer !== null) {
      timer.stop()
      timer = null
    }
    score += 1
    currentTimeMs = currentTimeMs * config.decayFactor
    ui.popTarget(reactionMs)
    startRound()
  }

  function gameOver(): void {
    if (state === 'gameover') return
    state = 'gameover'

    if (timer !== null) {
      timer.stop()
      timer = null
    }

    ui.hideTarget()

    const storedHigh = getHighScore()
    const isNewHigh = score > storedHigh
    if (isNewHigh) {
      setHighScore(score)
    }
    const highScore = isNewHigh ? score : storedHigh

    const avgReactionMs = reactionTimes.length === 0
      ? null
      : reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length

    ui.showGameOver(score, highScore, isNewHigh, avgReactionMs, restart)
  }

  function restart(): void {
    if (timer !== null) {
      timer.stop()
      timer = null
    }
    input.destroy()
    ui.destroy()
    startGame(container)
  }

  startRound()
}
