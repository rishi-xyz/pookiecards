export type Pokemon = {
  id: string
  name: string
  maxHp: number
  attack: number
  defense: number
}

export const POKEMONS: Record<string, Pokemon> = {
  pikachu: {
    id: "pikachu",
    name: "Pikachu",
    maxHp: 100,
    attack: 30,
    defense: 10
  },
  charizard: {
    id: "charizard",
    name: "Charizard",
    maxHp: 120,
    attack: 39,
    defense: 15
  },
  bulbasaur: {
    id: "bulbasaur",
    name: "Bulbasaur",
    maxHp: 110,
    attack: 25,
    defense: 20
  }
}