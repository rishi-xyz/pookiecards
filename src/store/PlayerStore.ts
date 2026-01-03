type PlayerProfile = {
  xp: number
}

class PlayerStore {
  private players: Map<string, PlayerProfile> = new Map()

  getPlayer(sessionId: string): PlayerProfile {
    if (!this.players.has(sessionId)) {
      this.players.set(sessionId, { xp: 0 })
    }
    return this.players.get(sessionId)!
  }

  addXP(sessionId: string, amount: number) {
    const player = this.getPlayer(sessionId)
    player.xp += amount
  }

  getLevel(sessionId: string) {
    const xp = this.getPlayer(sessionId).xp
    return Math.floor(xp / 100) + 1
  }
}

export const playerStore = new PlayerStore()
