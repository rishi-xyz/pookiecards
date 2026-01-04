// src/upgrade.ts
import express from 'express'
import { playerStore } from './store/PlayerStore'

export const upgradeRouter = express.Router()

// Upgrade a card using a potion
upgradeRouter.post('/', (req, res) => {
  const { sessionId, cardId, field } = req.body

  if (!['maxHp', 'attack', 'defense'].includes(field)) {
    return res.status(400).json({ message: 'Invalid field' })
  }

  const success = playerStore.upgradeCard(sessionId, cardId, field)
  if (!success) {
    return res.status(400).json({ message: 'Not enough potions or invalid card' })
  }

  const player = playerStore.getPlayer(sessionId)
  res.json({
    message: 'Card upgraded successfully',
    player
  })
})
