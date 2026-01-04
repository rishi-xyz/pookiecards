const colyseus = require('colyseus');

class BattleRoom extends colyseus.Room {
  maxClients = 2;
  
  // Set the room to be visible while it has less than 2 players
  onAuth(client, options, request) {
    return true; // Allow all clients to join
  }
  
  requestJoin(options, roomListing) {
    // Allow joining if the room has less than 2 players
    return this.clients.length < 2;
  }
  maxClients = 2;
  
  onCreate(options) {
    console.log(`🎮 BattleRoom ${this.roomId} created for matchmaking`);
    this.setMetadata({
      name: 'Battle Room',
      description: 'A room for battling players'
    });
    
    // Set up the room state schema
    this.setState({
      players: {},
      battleId: options.battleId || this.roomId,
      battleStarted: false,
      battleEnded: false,
      winner: null,
      turn: null, // playerId whose turn it is
      battleLog: [],
      matchRequests: {}, // Track match acceptances
      gameData: {
        player1: {
          id: null,
          name: 'Player 1',
          hp: 100,
          maxHp: 100,
          defending: false
        },
        player2: {
          id: null,
          name: 'Player 2',
          hp: 100,
          maxHp: 100,
          defending: false
        }
      }
    });
    
    this.onMessage('playerReady', (client, message) => {
      console.log(`📤 Player ready received from ${client.sessionId}`);
      
      // Assign player to the game
      if (!this.state.gameData.player1.id) {
        this.state.gameData.player1.id = client.sessionId;
        this.state.gameData.player1.name = message.name || `Player ${client.sessionId.slice(0, 6)}`;
        this.state.players[client.sessionId] = {
          id: client.sessionId,
          name: this.state.gameData.player1.name,
          position: 'player1'
        };
        console.log(`✅ Assigned ${client.sessionId} as Player 1`);
      } else if (!this.state.gameData.player2.id && client.sessionId !== this.state.gameData.player1.id) {
        this.state.gameData.player2.id = client.sessionId;
        this.state.gameData.player2.name = message.name || `Player ${client.sessionId.slice(0, 6)}`;
        this.state.players[client.sessionId] = {
          id: client.sessionId,
          name: this.state.gameData.player2.name,
          position: 'player2'
        };
        console.log(`✅ Assigned ${client.sessionId} as Player 2`);
      } else if (client.sessionId === this.state.gameData.player1.id) {
        console.log(`⚠️ Player ${client.sessionId} already assigned as Player 1`);
      } else {
        console.log(`⚠️ Player ${client.sessionId} already assigned as Player 2`);
      }
      
      // When both DIFFERENT players are ready, send match requests
      if (this.state.gameData.player1.id && 
          this.state.gameData.player2.id && 
          this.state.gameData.player1.id !== this.state.gameData.player2.id && 
          !this.state.battleStarted && 
          !this.state.matchRequestSent) {
        
        console.log(`🤝 Battle ${this.roomId}: Sending match requests to both players`);
        this.state.matchRequestSent = true;
        
        // Send match request to both players
        this.broadcast('matchRequest', {
          battleId: this.state.battleId,
          player1: this.state.gameData.player1,
          player2: this.state.gameData.player2,
          message: 'Found opponent! Accept or decline battle?'
        });
        
        console.log(`📨 Match request sent: ${this.state.gameData.player1.name} vs ${this.state.gameData.player2.name}`);
      }
      
      // Send current state to the client
      client.send('roomState', {
        battleId: this.state.battleId,
        playerData: this.state.players[client.sessionId],
        gameData: this.state.gameData,
        battleStarted: this.state.battleStarted,
        battleLog: this.state.battleLog
      });
    });
    
    // Handle match accept/decline responses
    this.onMessage('matchResponse', (client, message) => {
      console.log(`📝 Match response from ${client.sessionId}: ${message.action}`);
      
      // Track player's response
      this.state.matchRequests[client.sessionId] = message.action;
      
      const player1Accepted = this.state.matchRequests[this.state.gameData.player1.id] === 'accept';
      const player2Accepted = this.state.matchRequests[this.state.gameData.player2.id] === 'accept';
      
      console.log(`📊 Match status: Player1=${this.state.matchRequests[this.state.gameData.player1.id]}, Player2=${this.state.matchRequests[this.state.gameData.player2.id]}`);
      
      // If both accepted, start the battle
      if (player1Accepted && player2Accepted && !this.state.battleStarted) {
        console.log(`✅ Both players accepted! Starting battle ${this.roomId}`);
        this.state.battleStarted = true;
        this.state.turn = this.state.gameData.player1.id; // Player 1 starts
        this.state.battleLog.push(`Battle ${this.roomId} started! Both players accepted.`);
        this.state.battleLog.push(`${this.state.gameData.player1.name} vs ${this.state.gameData.player2.name}`);
        
        // Send battle started message to both clients
        this.broadcast('battleStarted', {
          battleId: this.state.battleId,
          player1: this.state.gameData.player1,
          player2: this.state.gameData.player2
        });
        
        console.log(`🎯 Battle ${this.roomId} started: ${this.state.gameData.player1.name} vs ${this.state.gameData.player2.name}`);
      } 
      // If someone declined, find new match or reset
      else if (message.action === 'decline') {
        console.log(`❌ Player ${client.sessionId} declined the match`);
        
        // Notify the other player that match was declined
        const otherPlayerId = client.sessionId === this.state.gameData.player1.id 
          ? this.state.gameData.player2.id 
          : this.state.gameData.player1.id;
          
        if (otherPlayerId) {
          const otherPlayer = this.clients.find(c => c.sessionId === otherPlayerId);
          if (otherPlayer) {
            otherPlayer.send('matchDeclined', {
              message: 'Opponent declined the match. Finding new opponent...',
              decliner: this.state.players[client.sessionId]?.name || 'Opponent'
            });
          }
        }
        
        // Reset match request state for this player
        delete this.state.matchRequests[client.sessionId];
        this.state.matchRequestSent = false;
        
        // Remove declining player from game so they can find new match
        if (client.sessionId === this.state.gameData.player1.id) {
          this.state.gameData.player1.id = null;
          this.state.gameData.player1.name = 'Player 1';
        } else {
          this.state.gameData.player2.id = null;
          this.state.gameData.player2.name = 'Player 2';
        }
        
        console.log(`🔄 Player ${client.sessionId} removed from match. Ready for new opponent.`);
      }
    });
    
    this.onMessage('playerAction', (client, message) => {
      console.log('Player action:', message.action, 'from:', client.sessionId);
      
      // Check if it's the player's turn
      if (this.state.turn !== client.sessionId) {
        client.send('error', { message: 'Not your turn!' });
        return;
      }
      
      // Determine which player is acting
      const isPlayer1 = this.state.gameData.player1.id === client.sessionId;
      const currentPlayer = isPlayer1 ? this.state.gameData.player1 : this.state.gameData.player2;
      const opponent = isPlayer1 ? this.state.gameData.player2 : this.state.gameData.player1;
      
      if (message.action === 'attack') {
        // Calculate damage (random between 15-25)
        const damage = Math.floor(Math.random() * 11) + 15; // 15-25
        
        // If opponent is defending, reduce damage
        if (opponent.defending) {
          const reducedDamage = Math.floor(damage / 2);
          opponent.hp = Math.max(0, opponent.hp - reducedDamage);
          this.state.battleLog.push(`${currentPlayer.name} attacks for ${damage} damage! ${opponent.name} was defending and took ${reducedDamage} damage.`);
          opponent.defending = false; // Reset defense state
        } else {
          opponent.hp = Math.max(0, opponent.hp - damage);
          this.state.battleLog.push(`${currentPlayer.name} attacks for ${damage} damage!`);
        }
        
        // Check if opponent is defeated
        if (opponent.hp <= 0) {
          this.state.battleEnded = true;
          this.state.winner = client.sessionId;
          this.state.battleLog.push(`${currentPlayer.name} wins the battle!`);
          this.broadcast('battleEnded', {
            winner: client.sessionId,
            winnerName: currentPlayer.name
          });
        } else {
          // Switch turn to opponent
          this.state.turn = opponent.id;
          this.state.battleLog.push(`It's now ${opponent.name}'s turn.`);
        }
      } else if (message.action === 'defend') {
        // Set defending state for current player
        currentPlayer.defending = true;
        this.state.battleLog.push(`${currentPlayer.name} is defending!`);
        
        // Switch turn to opponent
        this.state.turn = opponent.id;
        this.state.battleLog.push(`It's now ${opponent.name}'s turn.`);
      }
      
      // Update all clients with new game state
      this.broadcast('gameStateUpdate', {
        gameData: this.state.gameData,
        turn: this.state.turn,
        battleLog: [...this.state.battleLog.slice(-10)], // Send last 10 log entries
        battleEnded: this.state.battleEnded,
        winner: this.state.winner
      });
    });
    
    this.onMessage('leaveBattle', (client, message) => {
      console.log('Player leaving battle:', client.sessionId);
      
      // If battle is in progress and one player leaves, the other wins
      if (this.state.battleStarted && !this.state.battleEnded) {
        const isPlayer1 = this.state.gameData.player1.id === client.sessionId;
        const winner = isPlayer1 ? this.state.gameData.player2 : this.state.gameData.player1;
        
        if (winner && winner.id) {
          this.state.battleEnded = true;
          this.state.winner = winner.id;
          this.state.battleLog.push(`${winner.name} wins by default! Opponent left the battle.`);
          
          this.broadcast('battleEnded', {
            winner: winner.id,
            winnerName: winner.name
          });
        }
      }
    });
  }
  
  onJoin(client, options) {
    console.log(`👤 Client ${client.sessionId} joined battle room ${this.roomId}`);
    console.log(`📊 Room ${this.roomId} now has ${this.clients.length} players`);
    this.state.battleLog.push(`${client.sessionId} joined the battle room.`);
    
    // Broadcast updated player count
    this.broadcast('playerCountUpdate', { count: this.clients.length });
    
    // Only start battle when we have 2 DIFFERENT clients and both have sent playerReady
    // This prevents self-matching and ensures real players
    if (this.clients.length === 2 && !this.state.battleStarted) {
      const clientsArray = Array.from(this.clients);
      
      // Ensure we have two different clients (prevent self-matching)
      if (clientsArray[0].sessionId !== clientsArray[1].sessionId) {
        console.log(`⚔️ Battle ${this.roomId} has 2 different players, waiting for both to be ready...`);
        // Don't auto-start - wait for both players to send playerReady message
      } else {
        console.log(`⚠️ Same client tried to join twice, ignoring...`);
      }
    }
  }
  
  onLeave(client, consented) {
    console.log(`👋 Client ${client.sessionId} left battle room ${this.roomId}`);
    console.log(`📊 Room ${this.roomId} now has ${this.clients.length} players`);
    this.state.battleLog.push(`${client.sessionId} left the battle room.`);
    
    // Broadcast updated player count
    this.broadcast('playerCountUpdate', { count: this.clients.length });
    
    // Remove player from game data
    if (this.state.gameData.player1.id === client.sessionId) {
      this.state.gameData.player1.id = null;
      this.state.gameData.player1.name = 'Player 1';
    } else if (this.state.gameData.player2.id === client.sessionId) {
      this.state.gameData.player2.id = null;
      this.state.gameData.player2.name = 'Player 2';
    }
    
    // Remove from players object
    delete this.state.players[client.sessionId];
    
    // If battle was in progress and one player left, end the battle
    if (this.state.battleStarted && !this.state.battleEnded) {
      const remainingPlayer = this.clients.find(c => c.sessionId !== client.sessionId);
      if (remainingPlayer) {
        this.state.battleEnded = true;
        this.state.winner = remainingPlayer.sessionId;
        this.state.battleLog.push(`Battle ended! ${remainingPlayer.sessionId} wins by default!`);
        
        // Notify remaining player
        remainingPlayer.send('battleEnded', {
          winner: remainingPlayer.sessionId,
          winnerName: this.state.players[remainingPlayer.sessionId]?.name || 'Player'
        });
      }
    }
  }
  
  onDispose() {
    console.log(`🗑️ Room ${this.roomId} disposing...`);
  }
  
  // Add a method to manually dispose the room after a delay
  autoDisposeAfterDelay(delay = 30000) {
    console.log(`⏰ Room ${this.roomId} will auto-dispose in ${delay}ms`);
    setTimeout(() => {
      if (this.clients.length === 0) {
        console.log(`🗑️ Auto-disposing empty room ${this.roomId}`);
        this.disconnect();
      } else {
        console.log(`👥 Room ${this.roomId} still has clients, not disposing`);
      }
    }, delay);
  }
}

module.exports = BattleRoom;