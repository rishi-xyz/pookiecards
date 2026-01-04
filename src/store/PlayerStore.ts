// src/store/PlayerStore.ts
import { Pokemon, getRandomPokemonByRarity } from '../game/pokemon'

export type PlayerCard = Pokemon & {
  cardId: string // unique ID for this player's card instance
}

export type PlayerProfile = {
  xp: number
  level: number
  potions: number
  cards: PlayerCard[]
}

class PlayerStore {
  private players: Map<string, PlayerProfile> = new Map()

  // Get or create a player profile
  getPlayer(sessionId: string): PlayerProfile {
    if (!this.players.has(sessionId)) {
      this.players.set(sessionId, { xp: 0, level: 1, potions: 0, cards: [] })
    }
    return this.players.get(sessionId)!
  }

  // Add XP and auto-level up
  addXP(sessionId: string, amount: number) {
    const player = this.getPlayer(sessionId)
    player.xp += amount
    const newLevel = Math.floor(player.xp / 100) + 1
    player.level = newLevel
  }

  // Add potions
  addPotions(sessionId: string, amount: number) {
    const player = this.getPlayer(sessionId)
    player.potions += amount
  }

  // Add a Pokémon card to player's collection
  addCard(sessionId: string, pokemon: Pokemon) {
    const player = this.getPlayer(sessionId)
    const cardId = `${pokemon.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    player.cards.push({ ...pokemon, cardId })
  }

  // Upgrade a card's stat using a potion
  upgradeCard(sessionId: string, cardId: string, field: 'maxHp' | 'attack' | 'defense'): boolean {
    const player = this.getPlayer(sessionId)
    if (player.potions < 1) return false

    const card = player.cards.find(c => c.cardId === cardId)
    if (!card) return false

    card[field] += 5 // Increase stat by 5
    player.potions -= 1
    return true
  }

  // Get card by ID
  getCard(sessionId: string, cardId: string): PlayerCard | undefined {
    const player = this.getPlayer(sessionId)
    return player.cards.find(c => c.cardId === cardId)
  }
}

export const playerStore = new PlayerStore()
