// src/game/pokemon.ts

export type Pokemon = {
  id: string
  name: string
  maxHp: number
  attack: number
  defense: number
  rarity: 'common' | 'rare' | 'legendary' // added rarity for chest logic
}

// Define all Pokémon
export const POKEMONS: Record<string, Pokemon> = {
  pikachu: {
    id: "pikachu",
    name: "Pikachu",
    maxHp: 100,
    attack: 30,
    defense: 10,
    rarity: 'common'
  },
  charizard: {
    id: "charizard",
    name: "Charizard",
    maxHp: 120,
    attack: 39,
    defense: 15,
    rarity: 'legendary'
  },
  bulbasaur: {
    id: "bulbasaur",
    name: "Bulbasaur",
    maxHp: 110,
    attack: 25,
    defense: 20,
    rarity: 'common'
  },
  mewtwo: {
    id: "mewtwo",
    name: "Mewtwo",
    maxHp: 130,
    attack: 50,
    defense: 20,
    rarity: 'legendary'
  },
  charmander: {
    id: "charmander",
    name: "Charmander",
    maxHp: 95,
    attack: 28,
    defense: 12,
    rarity: 'common'
  },
  // Add more Pokémon here as needed
}

// Helper: get a random Pokémon by rarity
export function getRandomPokemonByRarity(rarity: 'common' | 'rare' | 'legendary'): Pokemon {
  const filtered = Object.values(POKEMONS).filter(p => p.rarity === rarity)
  const index = Math.floor(Math.random() * filtered.length)
  return filtered[index]
}
