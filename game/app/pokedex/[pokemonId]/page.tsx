'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

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
      defense: 1,
      hp: 3
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
              <Image
                src="/logo001.png"
                alt="Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
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
            {/* Card Container */}
            <div className="relative mb-8">
              {/* Card Image */}
              <div className="w-full h-96 bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl border-4 border-white/20 relative overflow-hidden flex items-center justify-center">
                <div className={`text-8xl transition-all duration-300 ${evolutionAnimation ? 'scale-110' : ''}`}>
                  {pokemon.image}
                </div>
                
                {/* Level display at top left inside the card */}
                <div className="absolute top-2 left-2 text-white font-bold text-lg bg-black/50 px-2 py-1 rounded inline-block">
                  Lv. {pokemon.level}
                </div>
                
                {/* Stats overlay at bottom of the card */}
                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-white p-3 rounded-b-lg">
                  <div className="text-center text-sm">
                    <div className="flex justify-between">
                      <span>HP: {pokemon.hp}</span>
                      <span>ATK: {pokemon.attack}</span>
                      <span>DEF: {pokemon.defense}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pokémon Name */}
              <h1 className="text-3xl font-bold mt-4 text-center">{pokemon.name}</h1>
            </div>
            
            {/* Potion & Evolution Buttons Below the Card */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-center">UPGRADES</h2>
              
              <div className="flex flex-col space-y-4">
                {/* Attack Potion */}
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  onClick={useAttackPotion}
                  disabled={pokemon.potions.attack === 0}
                >
                  Attack Potion
                </button>
                
                {/* Defense Potion */}
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  onClick={useDefensePotion}
                  disabled={pokemon.potions.defense === 0}
                >
                  Defense Potion
                </button>
                
                {/* HP Potion */}
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => {
                    if (pokemon.potions.hp > 0) {
                      setPokemon(prev => ({
                        ...prev,
                        hp: prev.hp + 12,
                        level: prev.level + 1,
                        potions: {
                          ...prev.potions,
                          hp: prev.potions.hp - 1
                        }
                      }));
                    }
                  }}
                  disabled={pokemon.potions.hp === 0}
                >
                  HP Potion
                </button>
                
                {/* Evolution Stone */}
                <button 
                  className={`bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm ${
                    (pokemon.stones === 0 || !pokemon.canEvolve) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={useEvolutionStone}
                  disabled={pokemon.stones === 0 || !pokemon.canEvolve}
                >
                  Evolution Stone
                </button>
              </div>
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