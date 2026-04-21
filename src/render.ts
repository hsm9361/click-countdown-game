export interface GameUI {
  showTarget(emoji: string, x: number, y: number, size: number, onClick: () => void, clicksRequired: number): void
  hideTarget(): void
  popTarget(reactionMs: number): void
  pulseTarget(clicksRemaining: number, onClick: () => void): void
  updateTimer(fraction: number): void
  updateScore(score: number): void
  showGameOver(score: number, highScore: number, isNewHigh: boolean, avgReactionMs: number | null, onRestart: () => void): void
  hideGameOver(): void
  getCurrentTarget(): HTMLButtonElement | null
  getRestartButton(): HTMLButtonElement | null
  destroy(): void
}

export function createGameUI(container: HTMLElement): GameUI {
  // Score display
  const scoreEl = document.createElement('div')
  scoreEl.id = 'score'
  scoreEl.textContent = '점수: 0'

  // Timer bar
  const timerBar = document.createElement('div')
  timerBar.id = 'timer-bar'
  const timerFill = document.createElement('div')
  timerFill.id = 'timer-fill'
  timerBar.appendChild(timerFill)

  // Target area
  const targetArea = document.createElement('div')
  targetArea.id = 'target-area'

  container.appendChild(scoreEl)
  container.appendChild(timerBar)
  container.appendChild(targetArea)

  let currentTarget: HTMLButtonElement | null = null
  let gameOverOverlay: HTMLDivElement | null = null
  let gameOverRestartBtn: HTMLButtonElement | null = null

  function setBadge(btn: HTMLButtonElement, remaining: number): void {
    let badge = btn.querySelector<HTMLSpanElement>('.click-badge')
    if (remaining > 1) {
      if (badge === null) {
        badge = document.createElement('span')
        badge.className = 'click-badge'
        btn.appendChild(badge)
      }
      badge.textContent = String(remaining)
    } else if (badge !== null) {
      badge.remove()
    }
  }

  return {
    showTarget(
      emoji: string,
      x: number,
      y: number,
      size: number,
      onClick: () => void,
      clicksRequired: number,
    ): void {
      if (currentTarget !== null) {
        currentTarget.remove()
      }
      const btn = document.createElement('button')
      btn.className = 'target-btn'
      if (clicksRequired > 1) {
        btn.classList.add('is-multi')
      }
      btn.textContent = emoji
      btn.style.fontSize = `${size}px`
      btn.style.minWidth = `${size}px`
      btn.style.minHeight = `${size}px`
      btn.style.left = `${x}px`
      btn.style.top = `${y}px`
      btn.setAttribute(
        'aria-label',
        clicksRequired > 1
          ? `타겟 이모지: ${emoji}, ${clicksRequired}번 클릭 필요`
          : `타겟 이모지: ${emoji}`,
      )
      btn.addEventListener('click', onClick, { once: true })
      setBadge(btn, clicksRequired)
      targetArea.appendChild(btn)
      currentTarget = btn
    },

    hideTarget(): void {
      if (currentTarget !== null) {
        currentTarget.remove()
        currentTarget = null
      }
    },

    pulseTarget(clicksRemaining: number, onClick: () => void): void {
      if (currentTarget === null) return
      const btn = currentTarget
      btn.classList.remove('is-pulsing')
      void btn.offsetWidth
      btn.classList.add('is-pulsing')
      const onAnimEnd = (): void => {
        btn.classList.remove('is-pulsing')
      }
      btn.addEventListener('animationend', onAnimEnd, { once: true })
      setBadge(btn, clicksRemaining)
      btn.addEventListener('click', onClick, { once: true })
    },

    popTarget(reactionMs: number): void {
      if (currentTarget === null) return
      const popping = currentTarget
      currentTarget = null

      const left = parseFloat(popping.style.left || '0')
      const top = parseFloat(popping.style.top || '0')
      const size = parseFloat(popping.style.minWidth || '64')
      const centerX = left + size / 2
      const centerY = top + size / 2

      popping.classList.add('is-popping')
      const removePop = (): void => {
        popping.remove()
      }
      popping.addEventListener('animationend', removePop, { once: true })
      window.setTimeout(removePop, 600)

      const text = document.createElement('div')
      text.className = 'reaction-text'
      text.textContent = `${Math.round(reactionMs)}ms`
      text.style.left = `${centerX}px`
      text.style.top = `${centerY}px`
      targetArea.appendChild(text)
      const removeText = (): void => {
        text.remove()
      }
      text.addEventListener('animationend', removeText, { once: true })
      window.setTimeout(removeText, 1200)
    },

    updateTimer(fraction: number): void {
      timerFill.style.width = `${fraction * 100}%`
      if (fraction > 0.5) {
        timerFill.style.backgroundColor = '#4caf50'
      } else if (fraction > 0.25) {
        timerFill.style.backgroundColor = '#ffeb3b'
      } else {
        timerFill.style.backgroundColor = '#f44336'
      }
    },

    updateScore(score: number): void {
      scoreEl.textContent = `점수: ${score}`
    },

    showGameOver(
      score: number,
      highScore: number,
      isNewHigh: boolean,
      avgReactionMs: number | null,
      onRestart: () => void,
    ): void {
      if (gameOverOverlay !== null) {
        gameOverOverlay.remove()
      }
      const overlay = document.createElement('div')
      overlay.id = 'gameover-overlay'

      const panel = document.createElement('div')
      panel.id = 'gameover-panel'

      const title = document.createElement('h2')
      title.textContent = '게임 오버'

      const scoreLabel = document.createElement('p')
      scoreLabel.className = 'score-label'
      scoreLabel.textContent = '최종 점수'

      const scoreValue = document.createElement('p')
      scoreValue.className = 'score-value'
      scoreValue.textContent = String(score)

      const highScoreRow = document.createElement('div')
      highScoreRow.className = 'highscore-row'
      highScoreRow.textContent = `최고 점수: ${highScore}`
      if (isNewHigh) {
        const badge = document.createElement('span')
        badge.className = 'new-badge'
        badge.textContent = 'NEW!'
        highScoreRow.appendChild(badge)
      }

      const restartBtn = document.createElement('button')
      restartBtn.id = 'restart-btn'
      restartBtn.textContent = '다시 하기'
      restartBtn.addEventListener('click', onRestart, { once: true })

      panel.appendChild(title)
      panel.appendChild(scoreLabel)
      panel.appendChild(scoreValue)
      panel.appendChild(highScoreRow)
      if (avgReactionMs !== null) {
        const avgRow = document.createElement('div')
        avgRow.className = 'avg-row'
        avgRow.textContent = `평균 반응속도: ${Math.round(avgReactionMs)}ms`
        panel.appendChild(avgRow)
      }
      panel.appendChild(restartBtn)
      overlay.appendChild(panel)
      document.body.appendChild(overlay)

      gameOverOverlay = overlay
      gameOverRestartBtn = restartBtn
    },

    hideGameOver(): void {
      if (gameOverOverlay !== null) {
        gameOverOverlay.remove()
        gameOverOverlay = null
      }
      gameOverRestartBtn = null
    },

    getCurrentTarget(): HTMLButtonElement | null {
      return currentTarget
    },

    getRestartButton(): HTMLButtonElement | null {
      return gameOverRestartBtn
    },

    destroy(): void {
      scoreEl.remove()
      timerBar.remove()
      targetArea.remove()
      if (currentTarget !== null) {
        currentTarget.remove()
        currentTarget = null
      }
      if (gameOverOverlay !== null) {
        gameOverOverlay.remove()
        gameOverOverlay = null
      }
      gameOverRestartBtn = null
    },
  }
}
