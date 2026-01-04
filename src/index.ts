// src/index.ts
import express from 'express'
import cors from 'cors'
import { upgradeRouter } from './upgrade'
import { marketplaceRouter } from './market/marketplace'
import { openChest } from './market/chest'
import { playerStore } from './store/PlayerStore'

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/upgrade-card', upgradeRouter)
app.use('/api/market', marketplaceRouter)

// Get player info
app.get('/api/player/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId
  const player = playerStore.getPlayer(sessionId)
  res.json(player)
})

// Open chest
app.post('/api/chest/open', (req, res) => {
  const { sessionId, chestType, costXP } = req.body
  const card = openChest(sessionId, chestType, costXP)
  if (!card) return res.status(400).json({ message: 'Not enough XP to open chest' })

  const player = playerStore.getPlayer(sessionId)
  res.json({ card, player })
})

// Start server
const PORT = 3001
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
