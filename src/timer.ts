export class Timer {
  private _isRunning = false
  private rafId: number | null = null
  private startTime: number | null = null
  private readonly durationMs: number
  private readonly onTick: (remainingMs: number, fraction: number) => void
  private readonly onExpire: () => void

  constructor(
    durationMs: number,
    onTick: (remainingMs: number, fraction: number) => void,
    onExpire: () => void,
  ) {
    this.durationMs = durationMs
    this.onTick = onTick
    this.onExpire = onExpire
  }

  get isRunning(): boolean {
    return this._isRunning
  }

  start(): void {
    if (this._isRunning) return
    this._isRunning = true
    this.startTime = performance.now()
    this.rafId = requestAnimationFrame(this.tick)
  }

  stop(): void {
    this._isRunning = false
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private tick = (now: number): void => {
    if (!this._isRunning || this.startTime === null) return

    const elapsed = now - this.startTime
    const remaining = this.durationMs - elapsed

    if (remaining <= 0) {
      this._isRunning = false
      this.rafId = null
      this.onTick(0, 0)
      this.onExpire()
      return
    }

    const fraction = remaining / this.durationMs
    this.onTick(remaining, fraction)
    this.rafId = requestAnimationFrame(this.tick)
  }
}
