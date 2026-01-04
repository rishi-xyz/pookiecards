// src/chest.ts
import { playerStore } from '../store/PlayerStore'
import { getRandomPokemonByRarity, Pokemon } from '../game/pokemon'

type ChestType = 'common' | 'rare' | 'legendary'

const chestProbs: Record<ChestType, Record<'common' | 'rare' | 'legendary', number>> = {
  common: { common: 0.85, rare: 0.14, legendary: 0.01 },
  rare: { common: 0.5, rare: 0.45, legendary: 0.05 },
  legendary: { common: 0.2, rare: 0.5, legendary: 0.3 }
}

// Open a chest using XP
export function openChest(sessionId: string, chestType: ChestType, costXP: number) {
  const player = playerStore.getPlayer(sessionId)
  if (player.xp < costXP) return null
  player.xp -= costXP

  const roll = Math.random()
  const probs = chestProbs[chestType]

  let rarity: 'common' | 'rare' | 'legendary' = 'common'
  if (roll <= probs.common) rarity = 'common'
  else if (roll <= probs.common + probs.rare) rarity = 'rare'
  else rarity = 'legendary'

  const card: Pokemon = getRandomPokemonByRarity(rarity)
  playerStore.addCard(sessionId, card)
  playerStore.addPotions(sessionId, 1) // reward 1 potion

  return card
}
