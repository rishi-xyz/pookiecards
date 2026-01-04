'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Define the card stats type
type CardStats = {
  name: string;
  level: number;
  hp: number;
  attack: number;
  defense: number;
};

// Define the base stats for different Pokémon
const BASE_STATS: Record<string, CardStats> = {
  charmander: { name: 'Charmander', level: 1, hp: 90, attack: 60, defense: 40 },
  squirtle: { name: 'Squirtle', level: 1, hp: 100, attack: 50, defense: 60 },
  bulbasaur: { name: 'Bulbasaur', level: 1, hp: 95, attack: 55, defense: 55 },
  'charmander ': { name: 'Charmander', level: 1, hp: 90, attack: 60, defense: 40 },
  'squirtle ': { name: 'Squirtle', level: 1, hp: 100, attack: 50, defense: 60 },
  pikachu: { name: 'Pikachu', level: 1, hp: 85, attack: 65, defense: 45 },
};

interface CardProps {
  cardId: string;
  cardImage: string; // Path to the card image in public folder
}

const Card: React.FC<CardProps> = ({ cardId, cardImage }) => {
  // Initialize stats based on cardId, default to pikachu if not found
  const initialStats = BASE_STATS[cardId.toLowerCase()] || BASE_STATS.pikachu;
  const [stats, setStats] = useState<CardStats>(initialStats);

  // Function to use attack potion
  const useAttackPotion = () => {
    setStats(prev => ({
      ...prev,
      attack: prev.attack + 10,
      level: prev.level + 1,
    }));
  };

  // Function to use defense potion
  const useDefensePotion = () => {
    setStats(prev => ({
      ...prev,
      defense: prev.defense + 8,
      level: prev.level + 1,
    }));
  };

  // Function to use HP potion
  const useHpPotion = () => {
    setStats(prev => ({
      ...prev,
      hp: prev.hp + 12,
      level: prev.level + 1,
    }));
  };

  return (
    <div className="relative w-[300px] h-[420px]">
      {/* Card image */}
      <Image
        src={cardImage}
        alt={stats.name}
        width={300}
        height={420}
        className="w-full h-full object-cover rounded-lg"
      />
      
      {/* Level display above the blue box */}
      <div className="absolute top-2 left-0 right-0 text-center">
        <div className="text-white font-bold text-lg bg-black/50 px-2 py-1 rounded inline-block">
          Lv. {stats.level}
        </div>
      </div>
      
      {/* Blue stats box at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-white p-3 rounded-b-lg">
        <div className="text-center text-sm">
          <div className="flex justify-between">
            <span>HP: {stats.hp}</span>
            <span>ATK: {stats.attack}</span>
            <span>DEF: {stats.defense}</span>
          </div>
        </div>
      </div>
      
      {/* Potion buttons */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-center space-x-2 transform -translate-y-1/2">
        <button 
          onClick={useAttackPotion}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Attack Potion
        </button>
        <button 
          onClick={useDefensePotion}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Defense Potion
        </button>
        <button 
          onClick={useHpPotion}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          HP Potion
        </button>
      </div>
    </div>
  );
};

export default Card;