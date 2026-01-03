'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const PokemonDetailPage = () => {
  const { pokemonId } = useParams();
  
  // Sample Pokémon data based on the ID
  const pokemonData = {
    id: parseInt(pokemonId as string) || 1,
    name: pokemonId === '1' ? 'Pikachu' : 
          pokemonId === '2' ? 'Charizard' : 
          pokemonId === '3' ? 'Blastoise' : 
          pokemonId === '4' ? 'Venusaur' : 
          pokemonId === '5' ? 'Gengar' : 
          pokemonId === '6' ? 'Alakazam' : 
          pokemonId === '7' ? 'Machamp' : 'Lapras',
    level: 7,
    hp: 100,
    attack: 30,
    defense: 20,
    image: pokemonId === '1' ? '⚡' : 
           pokemonId === '2' ? '🔥' : 
           pokemonId === '3' ? '💧' : 
           pokemonId === '4' ? '🌿' : 
           pokemonId === '5' ? '👻' : 
           pokemonId === '6' ? '🔮' : 
           pokemonId === '7' ? '🥊' : '🌊',
    potions: {
      attack: 2,
      defense: 1
    },
    stones: 1,
    canEvolve: true
  };
  
  const [pokemon, setPokemon] = useState(pokemonData);
  const [evolutionAnimation, setEvolutionAnimation] = useState(false);

  const useAttackPotion = () => {
    if (pokemon.potions.attack > 0) {
      setPokemon(prev => ({
        ...prev,
        attack: prev.attack + 5,
        potions: {
          ...prev.potions,
          attack: prev.potions.attack - 1
        }
      }));
    }
  };

  const useDefensePotion = () => {
    if (pokemon.potions.defense > 0) {
      setPokemon(prev => ({
        ...prev,
        defense: prev.defense + 5,
        potions: {
          ...prev.potions,
          defense: prev.potions.defense - 1
        }
      }));
    }
  };

  const useEvolutionStone = () => {
    if (pokemon.stones > 0 && pokemon.canEvolve) {
      setEvolutionAnimation(true);
      setTimeout(() => {
        setPokemon(prev => ({
          ...prev,
          name: `${prev.name}-Mega`,
          level: prev.level + 3,
          hp: prev.hp + 20,
          attack: prev.attack + 10,
          defense: prev.defense + 8,
          stones: prev.stones - 1,
          canEvolve: false
        }));
        setEvolutionAnimation(false);
      }, 1000);
    }
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
          <div className={`w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 ${evolutionAnimation ? 'animate-fade-out-in' : ''}`}>
            {/* Pokémon Info Section */}
            <div className="text-center mb-8">
              <div className={`text-8xl mb-4 transition-all duration-300 ${evolutionAnimation ? 'scale-110' : ''}`}>
                {pokemon.image}
              </div>
              <h1 className="text-3xl font-bold mb-2">{pokemon.name}</h1>
              <div className="text-lg text-gray-400 mb-6">LVL: {pokemon.level}</div>
            </div>
            
            {/* Stats Section */}
            <div className="mb-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">HP</span>
                  <span className="font-bold">{pokemon.hp}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">ATK</span>
                  <span className="font-bold text-red-400">{pokemon.attack}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">DEF</span>
                  <span className="font-bold text-blue-400">{pokemon.defense}</span>
                </div>
              </div>
            </div>
            
            {/* Potions & Stones Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-center">UPGRADES</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Attack Potion */}
                <button 
                  className={`p-4 rounded-lg border flex flex-col items-center ${
                    pokemon.potions.attack > 0 
                      ? 'bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-500/50 hover:from-red-800/50 hover:to-red-700/50 cursor-pointer' 
                      : 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={useAttackPotion}
                  disabled={pokemon.potions.attack === 0}
                >
                  <div className="text-2xl mb-2">🧪</div>
                  <span className="text-sm">Attack Potion</span>
                  <span className="text-xs text-red-400">+5 ATK</span>
                  <span className="text-xs mt-1">{pokemon.potions.attack} left</span>
                </button>
                
                {/* Defense Potion */}
                <button 
                  className={`p-4 rounded-lg border flex flex-col items-center ${
                    pokemon.potions.defense > 0 
                      ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500/50 hover:from-blue-800/50 hover:to-blue-700/50 cursor-pointer' 
                      : 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={useDefensePotion}
                  disabled={pokemon.potions.defense === 0}
                >
                  <div className="text-2xl mb-2">🧪</div>
                  <span className="text-sm">Defense Potion</span>
                  <span className="text-xs text-blue-400">+5 DEF</span>
                  <span className="text-xs mt-1">{pokemon.potions.defense} left</span>
                </button>
              </div>
              
              {/* Evolution Stone */}
              <button 
                className={`w-full p-4 rounded-lg border flex flex-col items-center ${
                  pokemon.stones > 0 && pokemon.canEvolve
                    ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/50 hover:from-purple-800/50 hover:to-purple-700/50 cursor-pointer' 
                    : 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
                }`}
                onClick={useEvolutionStone}
                disabled={pokemon.stones === 0 || !pokemon.canEvolve}
              >
                <div className="text-2xl mb-2">💎</div>
                <span className="text-sm">Evolution Stone</span>
                <span className="text-xs mt-1">{pokemon.stones} left</span>
                {!pokemon.canEvolve && (
                  <span className="text-xs text-gray-400 mt-1">Already evolved</span>
                )}
              </button>
            </div>
            
            {/* Back Button */}
            <div className="mt-8">
              <Link href="/pokedex" className="block">
                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300">
                  BACK TO POKEDEX
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;