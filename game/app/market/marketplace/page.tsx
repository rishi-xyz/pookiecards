'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const MarketplacePage = () => {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState<any>(null);
  
  // Sample marketplace data
  const marketplaceCards = [
    { id: 1, name: 'Pikachu', image: '⚡', hp: 100, def: 25, price: 50, seller: 'Trainer123' },
    { id: 2, name: 'Charizard', image: '🔥', hp: 120, def: 30, price: 120, seller: 'ProGamer' },
    { id: 3, name: 'Blastoise', image: '💧', hp: 110, def: 35, price: 90, seller: 'WaterMaster' },
    { id: 4, name: 'Venusaur', image: '🌿', hp: 115, def: 32, price: 100, seller: 'NatureKing' },
    { id: 5, name: 'Gengar', image: '👻', hp: 95, def: 20, price: 75, seller: 'GhostPro' },
    { id: 6, name: 'Alakazam', image: '🔮', hp: 85, def: 15, price: 150, seller: 'PsychicAce' },
  ];

  const handleBuyCard = (card: any) => {
    // In a real app, this would handle the purchase logic
    alert(`Purchased ${card.name} from ${card.seller} for ${card.price} coins!`);
    setShowBuyModal(null);
  };
  
  const confirmPurchase = (card: any) => {
    // In a real app, this would handle the purchase logic
    alert(`Purchased ${card.name} from ${card.seller} for ${card.price} SOL!`);
    setShowBuyModal(null);
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
        <div className="flex-grow p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">MARKETPLACE</h1>
              <div 
                className="text-gray-400 cursor-pointer hover:text-blue-400 transition-colors duration-300"
                onClick={() => setShowInfoModal(true)}
              >
                Buy & Sell Pokémon Cards
              </div>
            </div>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceCards.map((card) => (
                <div 
                  key={card.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{card.image}</div>
                    <h3 className="text-xl font-bold mb-2">{card.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-700/50 p-2 rounded">
                        <div className="text-sm text-gray-400">HP</div>
                        <div className="font-bold">{card.hp}</div>
                      </div>
                      <div className="bg-gray-700/50 p-2 rounded">
                        <div className="text-sm text-gray-400">DEF</div>
                        <div className="font-bold">{card.def}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm">
                        <div className="text-gray-400">Seller</div>
                        <div className="font-bold">{card.seller}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-gray-400 text-sm">Price</div>
                        <div className="font-bold text-yellow-400">{card.price} <span className="text-xs">coins</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-700 relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setSelectedCard(null)}
            >
              ✕
            </button>
            
            <div className="text-center">
              <div className="text-8xl mb-4">{selectedCard.image}</div>
              <h2 className="text-3xl font-bold mb-2">{selectedCard.name}</h2>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">HP</div>
                  <div className="text-xl font-bold">{selectedCard.hp}</div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">DEF</div>
                  <div className="text-xl font-bold">{selectedCard.def}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-gray-400 text-sm">Seller</div>
                  <div className="font-bold">{selectedCard.seller}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">Price</div>
                  <div className="font-bold text-yellow-400 text-xl">{selectedCard.price} coins</div>
                </div>
              </div>
              
              <button 
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
                onClick={() => {
                  setSelectedCard(null);
                  setShowBuyModal(selectedCard);
                }}
              >
                BUY CARD
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-lg w-full border border-gray-700 relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowInfoModal(false)}
            >
              ✕
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">How to Buy & Sell Pokémon Cards</h2>
              
              <div className="text-left space-y-4 mb-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Buying Cards</h3>
                  <p className="text-gray-300">Browse the marketplace grid to find cards you want. Click on any card to view details, then click "BUY CARD" to purchase it if you have enough coins.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Selling Cards</h3>
                  <p className="text-gray-300">Go to your Pokedex, select a card you own, and choose the "Sell" option. Set your desired price and your card will appear in the marketplace for other players to purchase.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Safety Tips</h3>
                  <p className="text-gray-300">Always check the seller's reputation and card stats before purchasing. Prices are set by individual players, so shop around for the best deals!</p>
                </div>
              </div>
              
              <button 
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
                onClick={() => setShowInfoModal(false)}
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Buy Confirmation Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-700 relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowBuyModal(null)}
            >
              ✕
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">Confirm Purchase</h2>
              
              <div className="flex justify-center mb-6">
                <div className="text-7xl">{showBuyModal.image}</div>
              </div>
              
              <div className="text-left mb-6 bg-gray-700/30 p-4 rounded-lg">
                <div className="mb-2">
                  <span className="text-gray-400">Pokémon: </span>
                  <span className="font-bold">{showBuyModal.name}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">HP: </span>
                  <span>{showBuyModal.hp}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">ATK: </span>
                  <span>{showBuyModal.atk || 30}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">DEF: </span>
                  <span>{showBuyModal.def}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-400 text-sm mb-1">Seller</div>
                <div className="font-bold">{showBuyModal.seller}</div>
              </div>
              
              <div className="mb-6 p-4 bg-gray-700/30 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Price</div>
                <div className="text-2xl font-bold text-yellow-400">{showBuyModal.price} SOL</div>
                <div className="text-sm text-gray-400 mt-2">Your Balance: 1.20 SOL</div>
              </div>
              
              <div className="text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </div>
              
              <div className="flex space-x-4">
                <button 
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                  onClick={() => setShowBuyModal(null)}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
                  onClick={() => confirmPurchase(showBuyModal)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;