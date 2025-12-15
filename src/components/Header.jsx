import React from 'react';
import { Key, RefreshCw } from 'lucide-react';

const Header = ({ keyCount, fatePoints, onOpenSync }) => {
  return (
    <header className="bg-osrs-panel border-b border-gray-600 p-4 sticky top-0 z-40 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-osrs-gold tracking-wider" style={{ textShadow: '2px 2px 0 #000' }}>
          OSRS FATE-LOCKED
        </h1>

        <div className="flex items-center gap-6">
          {/* Sync Button */}
          <button
            onClick={onOpenSync}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded border border-zinc-600 transition-colors text-sm font-medium"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Sync Stats</span>
          </button>

          {/* Key Count */}
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-gray-600">
            <Key className="text-yellow-400" size={24} />
            <span className="text-2xl font-bold text-white">{keyCount}</span>
            <span className="text-sm text-gray-400 uppercase tracking-wide">Current Keys</span>
          </div>

          {/* Fate Points */}
          <div className="flex flex-col w-48">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>FATE POINTS</span>
              <span>{fatePoints}/50</span>
            </div>
            <div className="w-full bg-black h-4 rounded-full overflow-hidden border border-gray-600 relative">
              <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${Math.min((fatePoints / 50) * 100, 100)}%` }}
              />
              {/* Markers */}
              <div className="absolute top-0 left-1/2 w-px h-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
