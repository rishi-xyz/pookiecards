'use client';

import React from 'react';
import Card from '../components/Card';

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Pokémon Card Stats System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example cards with different Pokémon */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Bulbasaur Card</h2>
            <Card cardId="bulbasaur" cardImage="/cards/BULBASAUR.png" />
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Pikachu Card</h2>
            <Card cardId="pikachu" cardImage="/cards/pikachu.png" />
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Charmander Card</h2>
            <Card cardId="charmander " cardImage="/cards/charmander .png" />
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Squirtle Card</h2>
            <Card cardId="squirtle " cardImage="/cards/squirtle .png" />
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Mew Card</h2>
            <Card cardId="mew" cardImage="/cards/0mew.png" />
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Mewtwo Card</h2>
            <Card cardId="mewtwo" cardImage="/cards/0mewtwo.png" />
          </div>
        </div>
        
        <div className="mt-12 bg-gray-800/50 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-4">How the System Works</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Each card starts with base stats based on the Pokémon type</li>
            <li>Use potions to upgrade stats: Attack, Defense, or HP</li>
            <li>Each potion use increases the respective stat and the card level</li>
            <li>Stats are displayed on the card with the level indicator at the top</li>
            <li>All state is managed per card instance independently</li>
          </ul>
        </div>
        
        <div className="mt-12 bg-gray-800/50 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-4">Card Stats Information</h2>
          <p className="mb-2">Each card has three primary stats that can be upgraded:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>HP (Hit Points): Represents the card's health</li>
            <li>Attack: Represents the card's offensive power</li>
            <li>Defense: Represents the card's defensive capability</li>
          </ul>
        </div>
        
        <div className="mt-12 bg-gray-800/50 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-4">Potion Effects</h2>
          <p className="mb-2">Each potion type provides different stat bonuses:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Attack Potion: +10 Attack, +1 Level</li>
            <li>Defense Potion: +8 Defense, +1 Level</li>
            <li>HP Potion: +12 HP, +1 Level</li>
          </ul>
        </div>
        
        <div className="mt-12 bg-gray-800/50 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-4">Level System</h2>
          <p>Each time you use a potion on a card, its level increases by 1. Higher level cards become more powerful in battles.</p>
        </div>
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default DemoPage;