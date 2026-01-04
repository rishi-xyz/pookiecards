// src/rooms/BattleRoom.ts
import { Room, Client } from "colyseus"
import { Pokemon, POKEMONS } from "../game/pokemon"
import { playerStore, PlayerCard } from "../store/PlayerStore"

const TURN_TIME_LIMIT = 15_000 // 15 seconds

type PlayerBattleState = {
  cardId: string      // selected Pokémon card instance ID
  hp: number          // current HP in battle
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

    // Player selects a Pokémon card for battle
    this.onMessage("SELECT_POKEMON", (client, data: { cardId: string }) => {
      const playerProfile = playerStore.getPlayer(client.sessionId)
      const card = playerProfile.cards.find(c => c.cardId === data.cardId)

      if (!card) {
        client.send("ERROR", "Invalid Pokémon card")
        return
      }

      this.players.set(client.sessionId, {
        cardId: card.cardId,
        hp: card.maxHp
      })

      client.send("POKEMON_SELECTED", card)

      if (this.players.size === 2) {
        this.startBattle()
      }
    })

    // Player attacks
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

  // Start the battle when both players selected Pokémon
  startBattle() {
    this.turnOrder = Array.from(this.players.keys())
    this.currentTurn = this.turnOrder[0]

    this.broadcast("BATTLE_STARTED", {
      battleId: this.roomId,
      players: this.turnOrder.map(id => {
        const state = this.players.get(id)!
        const card = playerStore.getCard(id, state.cardId)!
        return {
          playerId: id,
          pokemon: card,
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
    this.currentTurn = this.turnOrder.find(id => id !== this.currentTurn) || null

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
    const attackerState = this.players.get(attackerId)!
    const defenderState = this.players.get(defenderId)!

    const attackerCard = playerStore.getCard(attackerId, attackerState.cardId)!
    const defenderCard = playerStore.getCard(defenderId, defenderState.cardId)!

    const damage = attackerCard.attack - defenderCard.defense
    return Math.max(5, damage) // minimum 5 damage
  }

  getOpponent(playerId: string): string | null {
    return this.turnOrder.find(id => id !== playerId) || null
  }

  endBattle(winnerId: string) {
    if (this.battleEnded) return
    this.battleEnded = true
    this.clearTurnTimer()

    const loserId = this.getOpponent(winnerId)
    if (!loserId) return

    // Reward XP and potions
    playerStore.addXP(winnerId, 50)
    playerStore.addPotions(winnerId, 1)
    playerStore.addXP(loserId, 20)
    playerStore.addPotions(loserId, 0) // optional: loser may get zero potions

    this.broadcast("BATTLE_ENDED", {
      battleId: this.roomId,
      winner: winnerId,
      rewards: {
        [winnerId]: {
          xpGained: 50,
          potionsGained: 1,
          totalXP: playerStore.getPlayer(winnerId).xp,
          level: playerStore.getPlayer(winnerId).level
        },
        [loserId]: {
          xpGained: 20,
          potionsGained: 0,
          totalXP: playerStore.getPlayer(loserId).xp,
          level: playerStore.getPlayer(loserId).level
        }
      }
    })

    console.log(`Battle ${this.roomId} ended. Winner: ${winnerId}`)
  }
}
