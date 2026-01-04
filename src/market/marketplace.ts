// src/marketplace.ts
import express from 'express'
import { playerStore, PlayerCard } from '../store/PlayerStore'

export type Listing = {
  cardId: string
  name: string
  priceXP: number
  sellerId: string
}

const listings: Listing[] = []

export const marketplaceRouter = express.Router()

// Get all listings
marketplaceRouter.get('/', (req, res) => {
  res.json(listings)
})

// List a card for sale
marketplaceRouter.post('/list', (req, res) => {
  const { sessionId, cardId, priceXP } = req.body
  const player = playerStore.getPlayer(sessionId)
  const card = player.cards.find(c => c.cardId === cardId)
  if (!card) return res.status(400).json({ message: 'Card not found' })

  listings.push({
    cardId: card.cardId,
    name: card.name,
    priceXP,
    sellerId: sessionId
  })

  res.json({ message: 'Card listed successfully' })
})
