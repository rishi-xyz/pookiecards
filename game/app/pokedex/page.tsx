'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PokedexPage = () => {
  const [filter, setFilter] = useState<'all' | 'owned' | 'locked'>('all');
  
  // Sample Pokémon data
  const pokemonData = [
    { id: 1, name: 'Pikachu', hp: 100, atk: 30, def: 20, owned: true, image: '⚡' },
    { id: 2, name: 'Charizard', hp: 120, atk: 35, def: 25, owned: true, image: '🔥' },
    { id: 3, name: 'Blastoise', hp: 110, atk: 32, def: 30, owned: true, image: '💧' },
    { id: 4, name: 'Venusaur', hp: 115, atk: 31, def: 28, owned: false, image: '🌿' },
    { id: 5, name: 'Gengar', hp: 95, atk: 33, def: 18, owned: false, image: '👻' },
    { id: 6, name: 'Alakazam', hp: 85, atk: 38, def: 15, owned: false, image: '🔮' },
    { id: 7, name: 'Machamp', hp: 130, atk: 40, def: 25, owned: false, image: '🥊' },
    { id: 8, name: 'Lapras', hp: 125, atk: 28, def: 32, owned: false, image: '🌊' },
  ];
  
  const [selectedPokemon, setSelectedPokemon] = useState<typeof pokemonData[0] | null>(null);
  
  const filteredPokemon = filter === 'owned' 
    ? pokemonData.filter(p => p.owned)
    : filter === 'locked'
      ? pokemonData.filter(p => !p.owned)
      : pokemonData;

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
              <h1 className="text-2xl font-bold">
                Pokecards
              </h1>
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
            <h1 className="text-4xl font-bold text-center mb-12">POKEDEX</h1>
            
            {/* Filter Controls */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-4 bg-gray-800/50 p-2 rounded-lg">
                <button 
                  className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${filter === 'owned' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setFilter('owned')}
                >
                  Owned
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${filter === 'locked' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setFilter('locked')}
                >
                  Locked
                </button>
              </div>
            </div>
            
            {/* Pokémon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredPokemon.map((pokemon) => (
                <div 
                  key={pokemon.id}
                  className={`rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    pokemon.owned 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500' 
                      : 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedPokemon(pokemon)}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-6xl mb-3">{pokemon.image}</div>
                    <h3 className="text-lg font-bold mb-2">{pokemon.name}</h3>
                    
                    <div className="flex space-x-2 text-sm mb-3">
                      <span className="bg-gray-700 px-2 py-1 rounded">HP: {pokemon.hp}</span>
                      <span className="bg-gray-700 px-2 py-1 rounded">ATK: {pokemon.atk}</span>
                      <span className="bg-gray-700 px-2 py-1 rounded">DEF: {pokemon.def}</span>
                    </div>
                    
                    {!pokemon.owned && (
                      <div className="text-center text-gray-400 text-sm">
                        <div className="flex justify-center mb-1">
                          <span className="text-xl">🔒</span>
                        </div>
                        Win more battles to unlock
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-700 relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setSelectedPokemon(null)}
            >
              ✕
            </button>
            
            <div className="text-center">
              <div className="text-8xl mb-4">{selectedPokemon.image}</div>
              <h2 className="text-3xl font-bold mb-2">{selectedPokemon.name}</h2>
              
              <div className="grid grid-cols-3 gap-4 my-6">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">HP</div>
                  <div className="text-xl font-bold">{selectedPokemon.hp}</div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">ATK</div>
                  <div className="text-xl font-bold">{selectedPokemon.atk}</div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">DEF</div>
                  <div className="text-xl font-bold">{selectedPokemon.def}</div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                {selectedPokemon.owned 
                  ? 'A powerful Pokémon with balanced stats and unique abilities.' 
                  : 'This Pokémon is currently locked. Win more battles to unlock it!'}
              </p>
              
              <button 
                className={`w-full py-3 rounded-lg font-bold ${
                  selectedPokemon.owned 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600' 
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                } transition-all duration-300`}
                disabled={!selectedPokemon.owned}
              >
                {selectedPokemon.owned ? 'SELECT' : 'LOCKED'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokedexPage;