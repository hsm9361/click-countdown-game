import type { GameState } from './types'

export interface KeyboardInputOptions {
  getMode: () => GameState
  getTarget: () => HTMLButtonElement | null
  getRestartButton: () => HTMLButtonElement | null
}

export interface KeyboardInput {
  destroy(): void
}

export function createKeyboardInput(opts: KeyboardInputOptions): KeyboardInput {
  function onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return
    const key = event.key
    if (key !== ' ' && key !== 'Enter') return

    const mode = opts.getMode()
    if (mode === 'playing') {
      const target = opts.getTarget()
      event.preventDefault()
      if (target !== null) {
        target.click()
      }
      return
    }

    if (mode === 'gameover' && key === 'Enter') {
      const restartBtn = opts.getRestartButton()
      event.preventDefault()
      if (restartBtn !== null) {
        restartBtn.click()
      }
      return
    }

    if (mode === 'gameover' && key === ' ') {
      event.preventDefault()
    }
  }

  window.addEventListener('keydown', onKeyDown)

  return {
    destroy(): void {
      window.removeEventListener('keydown', onKeyDown)
    },
  }
}
