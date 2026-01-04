'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import initializeColyseusClient from '@/src/utils/colyseusClient';

const BattleArenaPage = () => {
  const router = useRouter();
  const { battleId } = useParams();
  
  // Player and opponent state - initialize with empty data
  const [player, setPlayer] = useState({
    name: 'Player',
    hp: 100,
    maxHp: 100,
    atk: 30,
    def: 20,
    defending: false,
    id: null
  });
  
  const [opponent, setOpponent] = useState({
    name: 'Opponent',
    hp: 100,
    maxHp: 100,
    atk: 28,
    def: 22,
    defending: false,
    id: null
  });
  
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleMessage, setBattleMessage] = useState('YOUR TURN');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [winnerName, setWinnerName] = useState('');
  const [attackAnimation, setAttackAnimation] = useState(false);
  const [defenseAnimation, setDefenseAnimation] = useState(false);
  const [damageIndicator, setDamageIndicator] = useState<{value: number, x: number, y: number} | null>(null);
  const [opponentShake, setOpponentShake] = useState(false);
  const [playerShield, setPlayerShield] = useState(false);
  const [colyseusRoom, setColyseusRoom] = useState<any>(null);
  const [isPlayerLocal, setIsPlayerLocal] = useState(true); // Track if this player is the local player
  
  useEffect(() => {
    const connectToBattleRoom = async () => {
      try {
        console.log(`🔌 Attempting to connect to battle room: ${battleId}`);
        const client = initializeColyseusClient();
        
        // Join the battle room using the room ID from the URL
        const room = await client.joinById(battleId);
        console.log(`✅ Successfully connected to battle room: ${room.roomId}`);
        setColyseusRoom(room);
        
        // Send player ready message
        room.send('playerReady', { name: 'Player' });
        
        // Listen for game state updates
        room.onMessage('gameStateUpdate', (message: any) => {
          console.log('Game state update received:', message);
          
          // Update opponent data
          setOpponent(prev => ({
            ...prev,
            hp: message.gameData.player1.id !== room.sessionId ? 
              message.gameData.player1.hp : message.gameData.player2.hp,
            maxHp: message.gameData.player1.id !== room.sessionId ? 
              message.gameData.player1.maxHp : message.gameData.player2.maxHp,
            defending: message.gameData.player1.id !== room.sessionId ? 
              message.gameData.player1.defending : message.gameData.player2.defending,
            name: message.gameData.player1.id !== room.sessionId ? 
              message.gameData.player1.name : message.gameData.player2.name,
            id: message.gameData.player1.id !== room.sessionId ? 
              message.gameData.player1.id : message.gameData.player2.id,
          }));
          
          // Update player data
          setPlayer(prev => ({
            ...prev,
            hp: message.gameData.player1.id === room.sessionId ? 
              message.gameData.player1.hp : message.gameData.player2.hp,
            maxHp: message.gameData.player1.id === room.sessionId ? 
              message.gameData.player1.maxHp : message.gameData.player2.maxHp,
            defending: message.gameData.player1.id === room.sessionId ? 
              message.gameData.player1.defending : message.gameData.player2.defending,
            name: message.gameData.player1.id === room.sessionId ? 
              message.gameData.player1.name : message.gameData.player2.name,
            id: message.gameData.player1.id === room.sessionId ? 
              message.gameData.player1.id : message.gameData.player2.id,
          }));
          
          // Update turn information
          setIsPlayerTurn(message.turn === room.sessionId);
          
          // Update battle log
          setBattleLog(prev => [...prev, ...message.battleLog]);
          
          // Update battle status
          if (message.battleEnded) {
            setGameOver(true);
            if (message.winner === room.sessionId) {
              setWinner('player');
              setWinnerName(message.winnerName);
            } else {
              setWinner('opponent');
              setWinnerName(message.winnerName);
            }
          }
        });
        
        // Listen for battle ended
        room.onMessage('battleEnded', (message: any) => {
          console.log('Battle ended:', message);
          setGameOver(true);
          if (message.winner === room.sessionId) {
            setWinner('player');
            setWinnerName(message.winnerName);
          } else {
            setWinner('opponent');
            setWinnerName(message.winnerName);
          }
        });
        
        // Listen for errors
        room.onError((code: number, message: string) => {
          console.error(`❌ Room error ${code}: ${message}`);
          // Don't automatically redirect - let user decide with END BATTLE button
        });
        
        // Listen for when room is left
        room.onLeave(() => {
          console.log('👋 Disconnected from battle room');
          // Don't automatically redirect - let user decide with END BATTLE button
        });
        
      } catch (error) {
        console.error(`❌ Error connecting to battle room ${battleId}:`, error);
        console.log('🔄 Could not connect to battle room, staying on page');
        // Don't automatically redirect - let user try again or use END BATTLE button
      }
    };
    
    connectToBattleRoom();
    
    // Clean up on unmount
    return () => {
      if (colyseusRoom) {
        colyseusRoom.send('leaveBattle', {});
        colyseusRoom.leave();
      }
    };
  }, [battleId, router]);

  // Reset defense status at the start of each turn
  useEffect(() => {
    if (!isPlayerTurn && player.defending) {
      setPlayer(prev => ({ ...prev, defending: false }));
    }
    if (isPlayerTurn && opponent.defending) {
      setOpponent(prev => ({ ...prev, defending: false }));
    }
  }, [isPlayerTurn]);

  const handleAttack = () => {
    if (!isPlayerTurn || isAnimating || gameOver || !colyseusRoom) return;
      
    setIsAnimating(true);
    setAttackAnimation(true);
      
    // Send attack action to the server
    colyseusRoom.send('playerAction', { action: 'attack' });
    
    setBattleMessage(`${player.name} is attacking...`);
    
    // Brief animation delay
    setTimeout(() => {
      setAttackAnimation(false);
      setIsAnimating(false);
    }, 1000);
  };

  const handleDefense = () => {
    if (!isPlayerTurn || isAnimating || gameOver || !colyseusRoom) return;
      
    setIsAnimating(true);
    setDefenseAnimation(true);
      
    // Send defense action to the server
    colyseusRoom.send('playerAction', { action: 'defend' });
    
    setBattleMessage(`${player.name} is defending...`);
    
    // Brief animation delay
    setTimeout(() => {
      setDefenseAnimation(false);
      setIsAnimating(false);
    }, 1000);
  };







  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white overflow-hidden relative">
      {/* Animated energy waves background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse-slow animation-delay-1500"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gray-800 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse-slow animation-delay-3000"></div>
        </div>
        
        {/* Floating particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-400 opacity-30 animate-sparkle"
            style={{
              top: `${(i * 10) % 100}%`,
              left: `${(i * 15) % 100}%`,
              width: `${((i % 4) + 2)}px`,
              height: `${((i % 4) + 2)}px`,
              animationDuration: `${((i % 4) + 3)}s`,
              animationDelay: `${((i % 5))}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => router.back()}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">P</span>
              </div>
              <h1 className="text-2xl font-bold">
                Pokecards
              </h1>
            </div>
          </div>
          
          {/* Battle ID */}
          <div className="text-sm text-gray-400">
            Battle #{battleId}
          </div>
        </header>
        
        {/* Battle Arena */}
        <div className="flex-grow flex flex-col justify-between p-8">
          {/* Opponent Card */}
          <div className="flex justify-center mb-12">
            <div className={`w-80 h-40 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-2 ${opponent.defending ? 'border-blue-500' : 'border-gray-700'} transition-all duration-300 ${opponentShake ? 'animate-shake' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-red-300">{opponent.name}</h2>
                <div className="text-sm bg-gradient-to-r from-gray-700 to-gray-600 px-2 py-1 rounded-full">
                  LVL 6
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-400">HP</span>
                    <div className="flex-grow bg-gray-700 rounded-full h-3">
                      <div 
                        className={`bg-gradient-to-r ${opponent.hp / opponent.maxHp < 0.3 ? 'from-red-600 to-red-500' : 'from-red-500 to-red-400'} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${(opponent.hp / opponent.maxHp) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{opponent.hp}/{opponent.maxHp}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-red-400 mr-1">⚔️</span>
                      <span>ATK: {opponent.atk}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-400 mr-1">🛡️</span>
                      <span>DEF: {opponent.def}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {opponent.defending && (
                <div className="mt-2 text-center text-blue-400 text-sm animate-pulse">
                  DEFENDING
                </div>
              )}
              
              {/* Damage indicator */}
              {damageIndicator && (
                <div 
                  className="absolute text-red-400 font-bold text-xl animate-float-up"
                  style={{
                    top: `${damageIndicator.y}%`,
                    left: `${damageIndicator.x}%`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 50
                  }}
                >
                  {damageIndicator.value}
                </div>
              )}
            </div>
          </div>
          
          {/* Battle Message */}
          <div className="text-center mb-6">
            <p className="text-lg font-medium">{battleMessage}</p>
          </div>
          
          {/* Player Card */}
          <div className="flex justify-center">
            <div className={`w-80 h-40 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-2 ${player.defending ? 'border-blue-500' : 'border-gray-700'} transition-all duration-300 relative`}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-blue-300">{player.name}</h2>
                <div className="text-sm bg-gradient-to-r from-red-600 to-blue-500 px-2 py-1 rounded-full">
                  LVL 7
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-400">HP</span>
                    <div className="flex-grow bg-gray-700 rounded-full h-3">
                      <div 
                        className={`bg-gradient-to-r ${player.hp / player.maxHp < 0.3 ? 'from-red-600 to-red-500' : 'from-green-500 to-green-400'} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{player.hp}/{player.maxHp}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-red-400 mr-1">⚔️</span>
                      <span>ATK: {player.atk}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-400 mr-1">🛡️</span>
                      <span>DEF: {player.def}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {player.defending && (
                <div className="mt-2 text-center text-blue-400 text-sm animate-pulse">
                  DEFENDING
                </div>
              )}
              
              {/* Shield effect when defending */}
              {playerShield && (
                <div className="absolute inset-0 rounded-xl border-4 border-blue-400/50 animate-pulse"></div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAttack}
              disabled={!isPlayerTurn || gameOver || isAnimating}
              className={`
                w-40 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-white overflow-hidden
                ${isPlayerTurn && !gameOver && !isAnimating 
                  ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 cursor-pointer' 
                  : 'bg-gray-700 cursor-not-allowed opacity-50'}
                transition-all duration-300 transform hover:scale-105 active:scale-95 ${attackAnimation ? 'scale-95' : ''}
                border border-red-500/30
              `}
            >
              <span>ATTACK</span>
            </button>
            
            <button
              onClick={handleDefense}
              disabled={!isPlayerTurn || gameOver || isAnimating}
              className={`
                w-40 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-white overflow-hidden
                ${isPlayerTurn && !gameOver && !isAnimating 
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 cursor-pointer' 
                  : 'bg-gray-700 cursor-not-allowed opacity-50'}
                transition-all duration-300 transform hover:scale-105 active:scale-95 ${defenseAnimation ? 'scale-95' : ''}
                border border-blue-500/30
              `}
            >
              <span>DEFENSE</span>
            </button>
            
            <button
              onClick={() => {
                if (colyseusRoom) {
                  console.log('🔪 Manually ending battle');
                  colyseusRoom.send('leaveBattle', {});
                  colyseusRoom.leave();
                }
                router.push('/');
              }}
              className="
                w-32 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-white overflow-hidden
                bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 cursor-pointer
                transition-all duration-300 transform hover:scale-105 active:scale-95
                border border-gray-500/30
              "
            >
              <span>END BATTLE</span>
            </button>
          </div>
        </div>
        
        {/* Battle Log */}
        <div className="p-4 bg-black/50 border-t border-gray-700 max-h-32 overflow-y-auto">
          <div className="text-sm text-gray-400">
            {battleLog.slice(-3).map((log, index) => (
              <div key={index} className="mb-1 last:mb-0">{log}</div>
            ))}
          </div>
        </div>
        
        {/* Win/Lose Result Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 text-center">
              {winner === 'player' ? (
                <>
                  <h2 className="text-4xl font-bold mb-4">VICTORY</h2>
                  <p className="text-lg text-gray-300 mb-6">You defeated your opponent</p>
                  
                  <div className="mb-8">
                    <div className="flex justify-center space-x-6 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">+200 XP</div>
                        <div className="text-sm text-gray-400">Rewards</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">+1</div>
                        <div className="text-sm text-gray-400">Win</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400">XP: 1400 | LVL: 7</div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
                      onClick={() => window.location.reload()}
                    >
                      PLAY AGAIN
                    </button>
                    <button 
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                      onClick={() => {
                        if (colyseusRoom) {
                          colyseusRoom.send('leaveBattle', {});
                          colyseusRoom.leave();
                        }
                        router.push('/');
                      }}
                    >
                      BACK TO MENU
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold mb-4 text-red-400">DEFEAT</h2>
                  <p className="text-lg text-gray-300 mb-6">Better luck next battle</p>
                  
                  <div className="mb-8">
                    <div className="flex justify-center space-x-6 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">+50 XP</div>
                        <div className="text-sm text-gray-400">Rewards</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400">XP: 1250 | LVL: 7</div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
                      onClick={() => window.location.reload()}
                    >
                      TRY AGAIN
                    </button>
                    <button 
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                      onClick={() => {
                        if (colyseusRoom) {
                          colyseusRoom.send('leaveBattle', {});
                          colyseusRoom.leave();
                        }
                        router.push('/');
                      }}
                    >
                      BACK TO MENU
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleArenaPage;