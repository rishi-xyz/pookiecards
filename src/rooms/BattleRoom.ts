import { Room, Client } from "colyseus"
import { POKEMONS } from "../game/pokemon"
import { playerStore } from "../store/PlayerStore"

const TURN_TIME_LIMIT = 15_000 // 15 seconds

type PlayerBattleState = {
  pokemonId: string
  hp: number
}

export class BattleRoom extends Room {
  maxClients = 2

  players: Map<string, PlayerBattleState> = new Map()
  turnOrder: string[] = []
  currentTurn: string | null = null
  battleEnded = false
  turnTimeout?: NodeJS.Timeout

  onCreate() {
    console.log("BattleRoom created:", this.roomId)

    this.onMessage("SELECT_POKEMON", (client, data) => {
      const pokemon = POKEMONS[data.pokemonId]

      if (!pokemon) {
        client.send("ERROR", "Invalid Pokémon")
        return
      }

      this.players.set(client.sessionId, {
        pokemonId: pokemon.id,
        hp: pokemon.maxHp
      })

      client.send("POKEMON_SELECTED", pokemon)

      if (this.players.size === 2) {
        this.startBattle()
      }
    })

    this.onMessage("ATTACK", (client) => {
      if (this.battleEnded) return
      if (client.sessionId !== this.currentTurn) return

      const attackerId = client.sessionId
      const defenderId = this.getOpponent(attackerId)
      if (!defenderId) return

      const damage = this.calculateDamage(attackerId, defenderId)
      const defenderState = this.players.get(defenderId)!

      defenderState.hp -= damage

      this.broadcast("ATTACK_RESULT", {
        attackerId,
        defenderId,
        damage,
        defenderHp: defenderState.hp
      })

      if (defenderState.hp <= 0) {
        this.endBattle(attackerId)
      } else {
        this.switchTurn()
      }
    })
  }

  onJoin(client: Client) {
    console.log("Player joined:", client.sessionId)
  }

  onLeave(client: Client) {
    console.log("Player left:", client.sessionId)

    if (!this.battleEnded) {
      const opponent = this.getOpponent(client.sessionId)
      if (opponent) {
        this.endBattle(opponent)
      }
    }
  }

  startBattle() {
    this.turnOrder = Array.from(this.players.keys())
    this.currentTurn = this.turnOrder[0]

    this.broadcast("BATTLE_STARTED", {
      battleId: this.roomId,
      players: this.turnOrder.map((id) => {
        const state = this.players.get(id)!
        return {
          playerId: id,
          pokemon: POKEMONS[state.pokemonId],
          hp: state.hp
        }
      }),
      currentTurn: this.currentTurn,
      turnTimeMs: TURN_TIME_LIMIT
    })

    this.startTurnTimer()
  }

  switchTurn() {
    if (!this.currentTurn) return

    this.currentTurn =
      this.currentTurn === this.turnOrder[0]
        ? this.turnOrder[1]
        : this.turnOrder[0]

    this.broadcast("TURN_CHANGED", {
      currentTurn: this.currentTurn,
      turnTimeMs: TURN_TIME_LIMIT
    })

    this.startTurnTimer()
  }

  startTurnTimer() {
    this.clearTurnTimer()

    this.turnTimeout = setTimeout(() => {
      if (this.battleEnded || !this.currentTurn) return

      const afkPlayer = this.currentTurn
      const winner = this.getOpponent(afkPlayer)

      if (winner) {
        this.broadcast("PLAYER_AFK", { afkPlayer })
        this.endBattle(winner)
      }
    }, TURN_TIME_LIMIT)
  }

  clearTurnTimer() {
    if (this.turnTimeout) {
      clearTimeout(this.turnTimeout)
      this.turnTimeout = undefined
    }
  }

  calculateDamage(attackerId: string, defenderId: string): number {
    const attacker = this.players.get(attackerId)!
    const defender = this.players.get(defenderId)!

    const attackerPokemon = POKEMONS[attacker.pokemonId]
    const defenderPokemon = POKEMONS[defender.pokemonId]

    const damage = attackerPokemon.attack - defenderPokemon.defense
    return Math.max(5, damage)
  }

  getOpponent(playerId: string): string | null {
    for (const id of this.players.keys()) {
      if (id !== playerId) return id
    }
    return null
  }

  endBattle(winnerId: string) {
    if (this.battleEnded) return

    this.battleEnded = true
    this.clearTurnTimer()

    const loserId = this.getOpponent(winnerId)
    if (!loserId) return

    playerStore.addXP(winnerId, 50)
    playerStore.addXP(loserId, 20)

    this.broadcast("BATTLE_ENDED", {
      battleId: this.roomId,
      winner: winnerId,
      rewards: {
        [winnerId]: {
          xpGained: 50,
          totalXP: playerStore.getPlayer(winnerId).xp,
          level: playerStore.getLevel(winnerId)
        },
        [loserId]: {
          xpGained: 20,
          totalXP: playerStore.getPlayer(loserId).xp,
          level: playerStore.getLevel(loserId)
        }
      }
    })

    console.log(`Battle ${this.roomId} ended. Winner: ${winnerId}`)
  }
}
