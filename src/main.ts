import './style.css'
import { startGame } from './game'

document.addEventListener('DOMContentLoaded', () => {
  const appEl = document.getElementById('app')
  if (appEl === null) {
    throw new Error('No #app element found in the document')
  }
  startGame(appEl)
}, { once: true })
