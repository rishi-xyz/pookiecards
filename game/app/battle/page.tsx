import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BattleModePage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white overflow-hidden relative">
      {/* Animated energy waves background - slower, heavier motion */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-orange-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse-slow animation-delay-1500"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-yellow-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse-slow animation-delay-3000"></div>
        </div>
        
        {/* Floating embers/sparks - Using static positions to avoid hydration mismatch */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-yellow-400 opacity-30 animate-sparkle"
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
        
        {/* Subtle rumble effect */}
        <div className="absolute inset-0 bg-[url('data:image.svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-rumble opacity-10"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - Same as main menu */}
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
          
          {/* Wallet Button - Same as main menu */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-lg glass-effect border border-blue-500/30 text-blue-300 hover:border-blue-400 hover:text-blue-200 transition-all duration-300 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Wallet</span>
            </button>
          </div>
        </header>
        
        {/* Player Identity Section - Same as main menu */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3 px-4 py-2 rounded-full glass-effect border border-gray-600/30 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-blue-300 font-medium">0x742...8c3F</span>
            </div>
            <div className="h-4 w-px bg-gray-600"></div>
            <span className="text-yellow-300 font-medium">Nevis</span>
          </div>
        </div>
        
        {/* Main Focus Area - Center Screen */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="flex flex-col items-center">
            {/* STANDARD BATTLE Button */}
            <Link href="/battle/matchmaking" className="block">
              <button className="relative w-96 h-20 rounded-xl bg-gradient-to-r from-red-700 to-orange-600 flex items-center justify-center text-2xl font-bold text-white overflow-hidden group button-standard-battle">
                <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-[url('data:image.svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10 animate-energy-flow"></div>
                <div className="absolute inset-0 border-2 border-yellow-400/50 rounded-xl animate-border-pulse"></div>
                <span className="relative z-10 flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <span>STANDARD BATTLE</span>
                </span>
              </button>
            </Link>
            
            {/* Supporting Text */}
            <p className="mt-6 text-sm text-gray-400 text-center animate-fade-in">
              Face a random challenger in a standard ruleset battle.
            </p>
          </div>
        </div>
        
        {/* Bottom Section - Same as main menu */}
        <div className="flex justify-center mb-8">
          <div className="w-80 glass-effect rounded-full p-1 border border-gray-700">
            <div className="flex justify-between text-sm px-2 mb-1">
              <span>XP: 1200</span>
              <span>LVL: 7</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 progress-pulse">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full" style={{width: '65%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleModePage;