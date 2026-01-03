'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ChestBoxPage = () => {
  const [selectedChest, setSelectedChest] = useState<any>(null);
  const [openingChest, setOpeningChest] = useState<any>(null);
  const [revealedCards, setRevealedCards] = useState<any[]>([]);
  const [showClaim, setShowClaim] = useState(false);
  
  // Define card type
  type CardType = {
    id: number;
    name: string;
    image: string;
    hp: number;
    atk: number;
    def: number;
    rarity: string;
  };

  // Chest types data
  const chestTypes = [
    {
      id: 1,
      name: 'Standard',
      cost: 0.5,
      minCards: 3,
      maxCards: 3,
      description: 'Mostly common Pokémon',
      color: 'from-gray-600 to-gray-700',
      border: 'border-gray-500'
    },
    {
      id: 2,
      name: 'Rare',
      cost: 1.5,
      minCards: 4,
      maxCards: 5,
      description: 'Higher chance of rare Pokémon',
      color: 'from-purple-600 to-purple-700',
      border: 'border-purple-500'
    },
    {
      id: 3,
      name: 'Legendary',
      cost: 3.0,
      minCards: 6,
      maxCards: 7,
      description: 'Guaranteed rare or legendary Pokémon',
      color: 'from-yellow-600 to-yellow-700',
      border: 'border-yellow-500'
    }
  ];

  const handleChestSelect = (chest: any) => {
    setSelectedChest(chest);
  };

  const confirmPurchase = () => {
    if (selectedChest) {
      // Simulate purchase
      setSelectedChest(null);
      setOpeningChest({...selectedChest}); // Create a copy to preserve data
      startOpeningAnimation();
    }
  };

  const startOpeningAnimation = () => {
    // Store the selected chest in a variable to prevent null reference
    const chestToOpen = openingChest;
    
    // Simulate chest opening sequence
    setTimeout(() => {
      // Check if chestToOpen is not null before proceeding
      if (!chestToOpen) return;
      
      // Generate random cards based on chest type
      const cardCount = Math.floor(Math.random() * (chestToOpen.maxCards - chestToOpen.minCards + 1)) + chestToOpen.minCards;
      
      // Define card pools based on chest type
      const commonCards = [
        { id: 1, name: 'Pikachu', image: '⚡', hp: 100, atk: 30, def: 20, rarity: 'common' },
        { id: 8, name: 'Lapras', image: '🌊', hp: 125, atk: 28, def: 32, rarity: 'rare' } // Lapras is common in this context
      ];
            
      const rareCards = [
        { id: 2, name: 'Charizard', image: '🔥', hp: 120, atk: 35, def: 25, rarity: 'rare' },
        { id: 3, name: 'Blastoise', image: '💧', hp: 110, atk: 32, def: 30, rarity: 'rare' },
        { id: 4, name: 'Venusaur', image: '🌿', hp: 115, atk: 31, def: 28, rarity: 'rare' }
      ];
            
      const legendaryCards = [
        { id: 5, name: 'Gengar', image: '👻', hp: 95, atk: 33, def: 18, rarity: 'legendary' },
        { id: 6, name: 'Alakazam', image: '🔮', hp: 85, atk: 38, def: 15, rarity: 'legendary' },
        { id: 7, name: 'Machamp', image: '🥊', hp: 130, atk: 40, def: 25, rarity: 'legendary' },
        { id: 9, name: 'Skrull', image: '👽', hp: 140, atk: 42, def: 30, rarity: 'legendary' }
      ];
            
      // Select cards based on chest type
      const selectedCards: CardType[] = [];
      for (let i = 0; i < cardCount; i++) {
        let cardPool: CardType[] = [];
              
        if (chestToOpen.name === 'Standard') {
          // Standard chest has mostly common cards
          cardPool = [...commonCards, ...rareCards];
        } else if (chestToOpen.name === 'Rare') {
          // Rare chest has more rare cards
          cardPool = [...rareCards, ...legendaryCards];
        } else if (chestToOpen.name === 'Legendary') {
          // Legendary chest has higher chance of legendary cards
          cardPool = [...legendaryCards, ...legendaryCards, ...rareCards]; // Double chance for legendary
        }
              
        const randomIndex = Math.floor(Math.random() * cardPool.length);
        selectedCards.push(cardPool[randomIndex]);
      }

      setRevealedCards(selectedCards);
      setTimeout(() => {
        setShowClaim(true);
      }, 2000);
    }, 1500);
  };

  const claimCards = () => {
    // In a real app, this would add cards to the user's collection
    alert('Cards have been added to your collection!');
    setOpeningChest(null);
    setRevealedCards([]);
    setShowClaim(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white overflow-hidden relative">
      {/* Animated energy waves background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-red-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-green-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-400 opacity-20 animate-sparkle"
            style={{
              top: `${(i * 7) % 100}%`,
              left: `${(i * 11) % 100}%`,
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
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">P</span>
              </div>
              <Link href="/market">
                <h1 className="text-2xl font-bold">
                  Pokecards
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Wallet Button */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-lg glass-effect border border-blue-500/30 text-blue-300 hover:border-blue-400 hover:text-blue-200 transition-all duration-300 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Wallet</span>
            </button>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <h1 className="text-4xl font-bold text-center mb-12">CHEST BOX</h1>
            
            <div className="space-y-6">
              {chestTypes.map((chest) => (
                <div 
                  key={chest.id}
                  className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 ${chest.border} hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-105`}
                  onClick={() => handleChestSelect(chest)}
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">{chest.name} Chest</h2>
                    <p className="text-gray-300 mb-4">{chest.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Cost</div>
                        <div className="text-xl font-bold text-yellow-400">{chest.cost} SOL</div>
                      </div>
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Cards Inside</div>
                        <div className="text-xl font-bold">{chest.minCards === chest.maxCards ? chest.minCards : `${chest.minCards} – ${chest.maxCards}`}</div>
                      </div>
                    </div>
                    
                    <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 rounded-lg font-bold">
                      Select Chest
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center text-gray-400">
              <p>Open chests for exciting random rewards and grow your collection!</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirm Chest Purchase Modal */}
      {selectedChest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-700 relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setSelectedChest(null)}
            >
              ✕
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">Confirm Chest Purchase</h2>
              
              <div className="text-left mb-6 bg-gray-700/30 p-4 rounded-lg">
                <div className="mb-2">
                  <span className="text-gray-400">Chest Type: </span>
                  <span className="font-bold">{selectedChest.name}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Cost: </span>
                  <span className="font-bold text-yellow-400">{selectedChest.cost} SOL</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">You will receive: </span>
                  <span className="font-bold">{selectedChest.minCards === selectedChest.maxCards ? selectedChest.minCards : `${selectedChest.minCards} – ${selectedChest.maxCards}`} cards</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                  onClick={() => setSelectedChest(null)}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
                  onClick={confirmPurchase}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chest Opening Animation */}
      {openingChest && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="text-center">
            <div className="text-8xl mb-8 animate-bounce">🎁</div>
            <h2 className="text-3xl font-bold mb-4">Opening {openingChest.name} Chest...</h2>
            <p className="text-gray-300">Get ready for your rewards!</p>
          </div>
        </div>
      )}
      
      {/* Card Reveal Screen */}
      {revealedCards.length > 0 && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">Chest Rewards!</h2>
            
            <div className="mb-4 text-gray-300">You received {revealedCards.length} cards</div>
            
            <div className={`grid ${revealedCards.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : revealedCards.length <= 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'} gap-6 mb-8`}>
              {revealedCards.map((card, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border ${card.rarity === 'legendary' ? 'border-yellow-500/50' : 'border-gray-700'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{card.image}</div>
                    <h3 className="text-lg font-bold">{card.name}</h3>
                    
                    <div className="flex space-x-1 text-sm mt-2">
                      <span className="bg-gray-700 px-1 rounded">HP: {card.hp}</span>
                      <span className="bg-gray-700 px-1 rounded">ATK: {card.atk}</span>
                      <span className="bg-gray-700 px-1 rounded">DEF: {card.def}</span>
                    </div>
                    
                    {card.rarity === 'legendary' && (
                      <div className="mt-2 text-xs text-yellow-400 font-bold">LEGENDARY</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {showClaim && (
              <div className="text-center">
                <button 
                  className="px-8 py-4 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold text-xl hover:from-yellow-700 hover:to-yellow-600 transition-all duration-300"
                  onClick={claimCards}
                >
                  CLAIM CARDS
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChestBoxPage;