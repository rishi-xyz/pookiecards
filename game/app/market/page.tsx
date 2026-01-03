'use client';

import React from 'react';
import Link from 'next/link';

const MarketPage = () => {
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
              <Link href="/">
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
          <div className="w-full max-w-4xl">
            <h1 className="text-4xl font-bold text-center mb-12">MARKET</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Marketplace Panel (Left) */}
              <Link href="/market/marketplace" className="block">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-105 h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-6">🛒</div>
                    <h2 className="text-2xl font-bold mb-4">Marketplace</h2>
                    <p className="text-gray-300 mb-6">
                      Purchase individual items with full control. Buy Pokémon cards, attack potions, defense potions, and more.
                    </p>
                    
                    <div className="mt-8">
                      <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 rounded-lg font-bold">
                        Browse Items
                      </div>
                    </div>
                    
                    <div className="mt-8 text-left">
                      <h3 className="font-bold mb-3">Available Items:</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Pokémon Cards</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Attack Potions</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Defense Potions</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Special Upgrades</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Chest Box Panel (Right) */}
              <Link href="/market/chest" className="block">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 hover:border-yellow-500 transition-all duration-300 cursor-pointer transform hover:scale-105 h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-6">🎁</div>
                    <h2 className="text-2xl font-bold mb-4">Chest Box</h2>
                    <p className="text-gray-300 mb-6">
                      Buy chests for exciting random rewards! Get multiple cards, potions, and special items in one purchase.
                    </p>
                    
                    <div className="mt-8">
                      <div className="inline-block bg-gradient-to-r from-yellow-600 to-orange-500 px-6 py-3 rounded-lg font-bold">
                        Open Chests
                      </div>
                    </div>
                    
                    <div className="mt-8 text-left">
                      <h3 className="font-bold mb-3">Chest Contents:</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center">
                          <span className="text-yellow-400 mr-2">★</span>
                          <span>3+ Pokémon Cards</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-yellow-400 mr-2">★</span>
                          <span>Mixed Potions</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-yellow-400 mr-2">★</span>
                          <span>Rare Rewards</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-yellow-400 mr-2">★</span>
                          <span>Surprise Bonuses</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="mt-12 text-center text-gray-400">
              <p>Choose your preferred shopping style: direct purchases or exciting random rewards!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;