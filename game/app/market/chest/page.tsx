'use client';

import { useState } from 'react';
import Image from 'next/image';

// Define card types
type CardRarity = 'common' | 'rare' | 'legendary';
type ChestType = 'standard' | 'rare';

interface Card {
  id: string;
  name: string;
  rarity: CardRarity;
  src: string;
}

// Card data mapping
const CARD_DATA: Record<string, Card> = {
  // Common cards
  squirtle: { id: 'squirtle', name: 'Squirtle', rarity: 'common', src: '/cards/squirtle.png' },
  charmander: { id: 'charmander', name: 'Charmander', rarity: 'common', src: '/cards/charmander.png' },
  bulbasaur: { id: 'bulbasaur', name: 'Bulbasaur', rarity: 'common', src: '/cards/BULBASAUR.png' },
  pikachu: { id: 'pikachu', name: 'Pikachu', rarity: 'common', src: '/cards/pikachu.png' },
  
  // Rare cards (11_ prefix)
  celebi: { id: 'celebi', name: 'Celebi', rarity: 'rare', src: '/cards/11_celebi.png' },
  jirachi: { id: 'jirachi', name: 'Jirachi', rarity: 'rare', src: '/cards/11_jirachi.png' },
  
  // Legendary cards (00_ and 0_ prefix)
  arceus: { id: 'arceus', name: 'Arceus', rarity: 'legendary', src: '/cards/00_ARCEUS.png' },
  darkrai: { id: 'darkrai', name: 'Darkrai', rarity: 'legendary', src: '/cards/00_DARKRAI.png' },
  deoxys: { id: 'deoxys', name: 'Deoxys', rarity: 'legendary', src: '/cards/0_deoxys.png' },
  mew: { id: 'mew', name: 'Mew', rarity: 'legendary', src: '/cards/0_mew.png' },
  mewtwo: { id: 'mewtwo', name: 'Mewtwo', rarity: 'legendary', src: '/cards/0_mewtwo.png' },
};

// Define card pools
const COMMON_CARDS = ['squirtle', 'charmander', 'bulbasaur', 'pikachu'];
const RARE_CARDS = ['celebi', 'jirachi'];
const LEGENDARY_CARDS = ['arceus', 'darkrai', 'deoxys', 'mew', 'mewtwo'];

// UI states
type UIState = 'select' | 'opening' | 'revealed' | 'claimed';

const getRandomCard = (chestType: ChestType): Card => {
  // Standard chest only contains common cards
  if (chestType === 'standard') {
    const randomCommonId = COMMON_CARDS[Math.floor(Math.random() * COMMON_CARDS.length)];
    return CARD_DATA[randomCommonId];
  }

  // Rare chest has mixed probabilities
  const rand = Math.random();
  
  if (rand < 0.7) {
    // 70% chance for common card
    const randomCommonId = COMMON_CARDS[Math.floor(Math.random() * COMMON_CARDS.length)];
    return CARD_DATA[randomCommonId];
  } else if (rand < 0.9) {
    // 20% chance for rare card
    const randomRareId = RARE_CARDS[Math.floor(Math.random() * RARE_CARDS.length)];
    return CARD_DATA[randomRareId];
  } else {
    // 10% chance for legendary card
    const randomLegendaryId = LEGENDARY_CARDS[Math.floor(Math.random() * LEGENDARY_CARDS.length)];
    return CARD_DATA[randomLegendaryId];
  }
};

const ChestOpeningPage = () => {
  const [uiState, setUiState] = useState<UIState>('select');
  const [selectedChest, setSelectedChest] = useState<ChestType | null>(null);
  const [cards, setCards] = useState<Card[]>([]);

  const handleChestSelect = (chestType: ChestType) => {
    setSelectedChest(chestType);
  };

  const handleConfirmChest = () => {
    if (!selectedChest) return;
    
    setUiState('opening');
    
    // Wait 2 seconds before revealing cards
    setTimeout(() => {
      // Determine number of cards based on chest type
      const cardCount = selectedChest === 'standard' 
        ? 3 
        : Math.random() > 0.5 ? 4 : 5; // Randomly 4 or 5 for rare chests
      
      // Generate random cards
      const newCards: Card[] = [];
      for (let i = 0; i < cardCount; i++) {
        newCards.push(getRandomCard(selectedChest));
      }
      
      setCards(newCards);
      setUiState('revealed');
    }, 2000);
  };

  const handleClaim = () => {
    setUiState('claimed');
  };

  const resetChest = () => {
    setUiState('select');
    setSelectedChest(null);
    setCards([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center text-white flex-grow">Pokémon Card Chests</h1>
          <a href="/" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
            Home
          </a>
        </div>
        
        {uiState === 'select' && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl text-white mb-6">Select a Chest</h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div 
                className={`w-64 h-80 rounded-xl border-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedChest === 'standard' 
                    ? 'border-yellow-400 bg-yellow-400/20' 
                    : 'border-gray-400 bg-gray-700/50 hover:bg-gray-700/70'
                }`}
                onClick={() => handleChestSelect('standard')}
              >
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-white">Standard Chest</h3>
                <p className="text-gray-300 mt-2 text-center">
                  3 Common Cards<br />
                  High chance of common cards
                </p>
              </div>
              
              <div 
                className={`w-64 h-80 rounded-xl border-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedChest === 'rare' 
                    ? 'border-purple-400 bg-purple-400/20' 
                    : 'border-gray-400 bg-gray-700/50 hover:bg-gray-700/70'
                }`}
                onClick={() => handleChestSelect('rare')}
              >
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold text-white">Rare Chest</h3>
                <p className="text-gray-300 mt-2 text-center">
                  4-5 Cards<br />
                  70% Common, 20% Rare, 10% Legendary
                </p>
              </div>
            </div>
            
            {selectedChest && (
              <button
                className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors"
                onClick={handleConfirmChest}
              >
                Confirm Chest Selection
              </button>
            )}
          </div>
        )}
        
        {uiState === 'opening' && (
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-6">⏳</div>
            <h2 className="text-3xl font-bold text-white text-center">
              Opening {selectedChest === 'standard' ? 'Standard' : 'Rare'} Chest...
            </h2>
            <p className="text-xl text-gray-300 text-center mt-4">
              Get ready for your rewards!
            </p>
            <div className="mt-8 w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {uiState === 'revealed' && (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Your {selectedChest === 'standard' ? 'Standard' : 'Rare'} Chest Rewards!
            </h2>
            
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-4xl overflow-x-auto py-4">
                <div className="flex gap-4 min-w-max">
                  {cards.map((card, index) => (
                    <div key={`${card.id}-${index}`} className="relative flex-shrink-0">
                      <Image
                        src={card.src}
                        alt={card.name}
                        width={300}
                        height={420}
                        className="w-[300px] h-[420px] object-contain rounded-lg border-2 border-white/30 shadow-lg"
                      />
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                        card.rarity === 'common' ? 'bg-gray-700 text-gray-300' :
                        card.rarity === 'rare' ? 'bg-blue-600 text-white' :
                        'bg-yellow-500 text-black'
                      }`}>
                        {card.rarity.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors"
              onClick={handleClaim}
            >
              Claim Rewards
            </button>
          </div>
        )}
        
        {uiState === 'claimed' && (
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Rewards Claimed Successfully!
            </h2>
            <p className="text-xl text-gray-300 text-center mb-8">
              You received {cards.length} cards from your {selectedChest} chest.
            </p>
            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-lg transition-colors"
              onClick={resetChest}
            >
              Open Another Chest
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChestOpeningPage;