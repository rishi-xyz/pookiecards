'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import initializeColyseusClient from '@/src/utils/colyseusClient';

const BattleMatchmakingPage = () => {
  const router = useRouter();
  const [matchmakingState, setMatchmakingState] = useState('searching'); // searching, vs, found, matchRequest
  const [matchmakingText, setMatchmakingText] = useState('Searching for opponent...');
  const [dots, setDots] = useState('');
  const [matchmakingSubtexts] = useState([
    'Preparing battle arena...',
    'Shuffling combat cards...',
    'Locking ruleset...',
    'Scanning for worthy opponent...'
  ]);
  const [currentSubtextIndex, setCurrentSubtextIndex] = useState(0);
  const [colyseusRoom, setColyseusRoom] = useState<any>(null);
  const [numPlayersOnline, setNumPlayersOnline] = useState(0);
  const [battleData, setBattleData] = useState<any>(null);
  const [matchRequestData, setMatchRequestData] = useState<any>(null);
  
  useEffect(() => {
    const setupMatchmaking = async () => {
      try {
        const client = initializeColyseusClient();
        
        // Join or create a battle room for matchmaking
        // The server handles matching players automatically
        const room = await client.joinOrCreate('battle');
        
        setColyseusRoom(room);
        
        // Listen for match requests
        room.onMessage('matchRequest', (message: any) => {
          console.log(`🤝 Match request received: ${message.player1.name} vs ${message.player2.name}`);
          setMatchRequestData(message);
          setMatchmakingState('matchRequest');
        });
        
        // Listen for match declined
        room.onMessage('matchDeclined', (message: any) => {
          console.log(`❌ Match declined: ${message.message}`);
          setMatchmakingState('searching');
          setMatchRequestData(null);
        });
        
        // Listen for when another player joins
        room.onMessage('battleStarted', (message: any) => {
          console.log(`🎯 Battle started! Battle ID: ${message.battleId}`);
          console.log(`⚔️ Match found: ${message.player1.name} vs ${message.player2.name}`);
          
          // Store battle data for UI
          setBattleData(message);
          setMatchmakingState('vs');
          
          // Show VS animation for 2 seconds
          setTimeout(() => {
            setMatchmakingState('found');
            
            // Redirect to battle page after showing match found
            setTimeout(() => {
              // Use the actual battle ID from the message or room
              const battleId = message.battleId || room.roomId;
              console.log(`🚀 Redirecting to battle: /battle/${battleId}`);
              router.push(`/battle/${battleId}`);
            }, 2000);
          }, 2000);
        });
        
        // Send player ready message
        room.send('playerReady', { name: 'Player' });
        
        // Listen for errors
        room.onError((code: number, message: string) => {
          console.error(`❌ Matchmaking error ${code}: ${message}`);
          // Don't automatically redirect - let user handle manually
        });
        
        // Listen for when opponent leaves
        room.onLeave(() => {
          console.log('👋 Opponent left matchmaking');
          // Don't automatically redirect - let user handle manually
        });
        
        // Update number of players online when clients join/leave
        room.onMessage('playerCountUpdate', (message: any) => {
          setNumPlayersOnline(message.count);
        });
        
      } catch (error) {
        console.error('❌ Error setting up matchmaking:', error);
        // Don't automatically redirect - let user handle manually
      }
    };
    
    setupMatchmaking();
    
    // Set up intervals for animations
    const subtextInterval = setInterval(() => {
      setCurrentSubtextIndex(prev => (prev + 1) % matchmakingSubtexts.length);
    }, 3000);

    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => {
      clearInterval(subtextInterval);
      clearInterval(dotsInterval);
      
      // Clean up room connection if it exists
      if (colyseusRoom) {
        (colyseusRoom as any).leave();
      }
    };
  }, [router]);



  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white overflow-hidden relative">
      {/* Animated energy waves background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse-slow animation-delay-1500"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gray-800 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse-slow animation-delay-3000"></div>
        </div>
        
        {/* Floating particles - Using static positions to avoid hydration mismatch */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-400 opacity-30 animate-sparkle"
            style={{
              top: `${(i * 7) % 100}%`,
              left: `${(i * 13) % 100}%`,
              width: `${((i % 6) + 2)}px`,
              height: `${((i % 6) + 2)}px`,
              animationDuration: `${((i % 4) + 3)}s`,
              animationDelay: `${((i % 5))}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - Consistent across app */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            {/* Logo with gas mask styling */}
            <div className="flex items-center space-x-3 cursor-pointer group">
              <Image
                src="/logo001.png"
                alt="Pokecards Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
              <h1 className="text-2xl font-bold">
                Pokecards
              </h1>
            </div>
          </div>
          
          {/* Wallet Button - Dimmed and disabled during matchmaking */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-lg glass-effect border border-gray-600/30 text-gray-500 cursor-not-allowed transition-all duration-300 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <span>Wallet</span>
            </button>
          </div>
        </header>
        
        {/* Player Identity and Online Players - Top-Center */}
        <div className="flex justify-center mb-8 space-x-4">
          <div className="flex items-center space-x-3 px-4 py-2 rounded-full glass-effect border border-red-500/50 border-blue-500/50 flex items-center animate-energy-flicker">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-blue-300 font-medium">0x742...8c3F</span>
            </div>
            <div className="h-4 w-px bg-gray-600"></div>
            <span className="text-yellow-300 font-medium">Nevis</span>
          </div>
          
          {/* Online Players Indicator */}
          <div className="flex items-center space-x-3 px-4 py-2 rounded-full glass-effect border border-red-500/50 border-blue-500/50 flex items-center animate-energy-flicker">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400 font-medium">{colyseusRoom ? (colyseusRoom as any).roomId : 'Connecting...'}</span>
            </div>
            <div className="h-4 w-px bg-gray-600"></div>
            <span className="text-yellow-300 font-medium">{numPlayersOnline} Online</span>
          </div>
        </div>
        
        {/* Central Matchmaking Focus */}
        <div className="flex flex-col items-center justify-center flex-grow">
          {matchmakingState === 'searching' && (
            <div className="flex flex-col items-center">
              {/* Logo as animated core element */}
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-600/20 to-blue-500/20 p-4 animate-spin-slow">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <div className="text-4xl font-bold text-white animate-breathing-scale">P</div>
                  </div>
                </div>
                
                {/* Circular energy ring around logo */}
                <div className="absolute -inset-8 rounded-full border-2 border-red-500/30 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping animation-delay-1000"></div>
                  <div className="absolute left-0 top-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping animation-delay-500"></div>
                  <div className="absolute right-0 top-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping animation-delay-1500"></div>
                </div>
              </div>
              
              {/* Matchmaking text */}
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold mb-2 animate-glitch">
                  MATCHMAKING{dots}
                </h2>
                <p className="text-lg text-gray-400 animate-fade-in-out">
                  {matchmakingSubtexts[currentSubtextIndex]}
                </p>
              </div>
            </div>
          )}
          
          {matchmakingState === 'matchRequest' && (
            <div className="flex flex-col items-center animate-scale-in">
              {/* Match Request Alert */}
              <div className="w-96 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-xl p-6 border-2 border-yellow-500/50 mb-8 animate-pulse-slow">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2 text-yellow-300">⚔️ BATTLE REQUEST!</h2>
                  <p className="text-lg text-gray-300 mb-4">{matchRequestData?.message || 'Found opponent! Accept or decline battle?'}</p>
                </div>
                
                {/* Opponent Preview */}
                <div className="flex items-center justify-center space-x-8 mb-6">
                  {/* Your Card */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-500/20 p-2 mb-2 border-2 border-blue-500/50">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                          <span className="text-lg">👤</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-blue-300">You</h3>
                  </div>
                  
                  {/* VS */}
                  <div className="text-2xl font-bold text-yellow-400">VS</div>
                  
                  {/* Opponent Card */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600/20 to-red-500/20 p-2 mb-2 border-2 border-red-500/50 animate-distortion">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center">
                          <span className="text-lg text-gray-500">❓</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-red-300">
                      {matchRequestData?.player2?.name || 'Opponent'}
                    </h3>
                  </div>
                </div>
                
                {/* Accept/Decline Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      if (colyseusRoom && matchRequestData) {
                        console.log('✅ Accepting match request');
                        colyseusRoom.send('matchResponse', { action: 'accept' });
                        setMatchmakingState('vs'); // Show VS animation while waiting
                      }
                    }}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-700 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    ACCEPT
                  </button>
                  <button
                    onClick={() => {
                      if (colyseusRoom) {
                        console.log('❌ Declining match request');
                        colyseusRoom.send('matchResponse', { action: 'decline' });
                        setMatchmakingState('searching');
                        setMatchRequestData(null);
                      }
                    }}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    DECLINE
                  </button>
                </div>
              </div>
              
              {/* Timer indicator */}
              <div className="text-sm text-gray-400 animate-pulse">
                Waiting for opponent response...
              </div>
            </div>
          )}
          
          {matchmakingState === 'vs' && (
            <div className="flex items-center justify-center space-x-12 animate-scale-in">
              {/* Player Card (Left) */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600/20 to-blue-500/20 p-2 mb-2 border-2 border-red-500/50">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-blue-300">Nevis</h3>
                <span className="text-sm bg-gradient-to-r from-red-600 to-blue-500 px-2 py-1 rounded-full mt-1">
                  LVL 7
                </span>
              </div>
              
              {/* VS Lightning */}
              <div className="text-4xl font-bold animate-pulse">⚡</div>
              
              {/* Opponent Card (Right) */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600/20 to-blue-500/20 p-2 mb-2 border-2 border-red-500/50 animate-distortion">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-gray-500">❓</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-red-300 animate-flicker">
                  {battleData ? battleData.player2.name : 'OPPONENT'}
                </h3>
                <span className="text-sm bg-gradient-to-r from-gray-600 to-gray-500 px-2 py-1 rounded-full mt-1 animate-pulse">
                  LVL ?
                </span>
              </div>
            </div>
          )}
          
          {matchmakingState === 'found' && (
            <div className="flex flex-col items-center animate-scale-in">
              {/* Logo pulse effect */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-600/30 to-blue-500/30 p-4 mb-8 animate-ping-slow">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <div className="text-4xl font-bold text-white">P</div>
                </div>
              </div>
              
              {/* MATCH FOUND text */}
              <h2 className="text-5xl font-bold mb-2 animate-text-slam">
                MATCH FOUND
              </h2>
              <p className="text-xl text-gray-300 mb-8 animate-fade-in">
                PREPARE FOR BATTLE
              </p>
              
              {/* Opponent card fully revealed */}
              <div className="flex items-center justify-center space-x-12">
                {/* Player Card (Left) */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600/20 to-blue-500/20 p-2 mb-2 border-2 border-red-500/50">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-blue-300">Nevis</h3>
                  <span className="text-xs bg-gradient-to-r from-red-600 to-blue-500 px-2 py-1 rounded-full mt-1">
                    LVL 7
                  </span>
                </div>
                
                {/* VS Lightning */}
                <div className="text-3xl font-bold">⚡</div>
                
                {/* Opponent Card (Right) - Fully revealed */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600/20 to-blue-500/20 p-2 mb-2 border-2 border-red-500/50">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-red-300">
                    {battleData ? battleData.player2.name : 'TRAINER'}
                  </h3>
                  <span className="text-xs bg-gradient-to-r from-red-600 to-blue-500 px-2 py-1 rounded-full mt-1">
                    LVL 6
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom HUD - Persistent */}
        <div className="flex justify-center mb-8 space-x-4">
          <div className="w-80 glass-effect rounded-full p-1 border border-red-500/30 border-blue-500/30">
            <div className="flex justify-between text-sm px-2 mb-1">
              <span>XP: 1200</span>
              <span>LVL: 7</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 progress-pulse">
              <div className="bg-gradient-to-r from-red-500 to-blue-400 h-2.5 rounded-full" style={{width: '65%'}}></div>
            </div>
          </div>
          
          {/* Cancel Matchmaking Button */}
          <button
            onClick={() => {
              if (colyseusRoom) {
                console.log('❌ Canceling matchmaking');
                colyseusRoom.leave();
              }
              router.push('/');
            }}
            className="px-6 py-3 rounded-full glass-effect border border-red-500/50 text-red-400 hover:text-red-300 transition-all duration-300 flex items-center space-x-2 hover:bg-red-500/10"
          >
            <span>Cancel Matchmaking</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleMatchmakingPage;