const EMOJI_POOL: readonly string[] = [
  '🎮', '🕹️', '🎯', '💎', '🪙', '⭐', '🌟', '⚡', '💥', '🔥',
  '💣', '🚀', '🏆', '🥇', '👑', '🎁', '💰', '🪄', '⚔️', '🛡️',
  '🏹', '🎲', '🎰', '👾', '🤖',
]

export function pickEmoji(previousEmoji: string | null): string {
  const pool = previousEmoji !== null
    ? EMOJI_POOL.filter(e => e !== previousEmoji)
    : EMOJI_POOL
  return pool[Math.floor(Math.random() * pool.length)]
}
