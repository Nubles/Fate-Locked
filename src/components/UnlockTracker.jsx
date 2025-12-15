import React from 'react';
import { Card } from './ui/BaseComponents';
import { Shirt, Book, Map } from 'lucide-react';

const StatusGrid = ({ items, type }) => {
  if (type === 'GEAR') {
    // Gear specific layout if needed, or just a grid
    // The prompt asks for "visualize as a grid representing OSR inventory slots"
    // Since we just have a list of names, we'll do a grid.
    return (
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div
            key={item.name}
            className={`
              aspect-square flex flex-col items-center justify-center p-2 rounded border-2 text-center text-xs font-bold transition-all
              ${item.isUnlocked
                ? 'bg-green-900/30 border-green-500 text-green-100 shadow-[0_0_5px_rgba(34,197,94,0.3)]'
                : 'bg-red-900/30 border-red-900/50 text-red-400 opacity-60'}
            `}
          >
            {/* Ideally icons here, but names for now */}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'SKILLS') {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {items.map((item) => (
            <div
            key={item.name}
            className={`
              flex items-center justify-center p-2 rounded border text-[10px] sm:text-xs font-bold text-center break-words leading-tight
              ${item.isUnlocked
                ? 'bg-green-900/30 border-green-500 text-green-100'
                : 'bg-red-900/30 border-red-900/50 text-red-400 opacity-60'}
            `}
            title={item.name}
          >
            {item.name}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'REGIONS') {
    return (
        <div className="flex flex-wrap gap-2">
        {items.map((item) => (
            <div
            key={item.name}
            className={`
              px-3 py-1 rounded-full border text-sm font-bold
              ${item.isUnlocked
                ? 'bg-green-900/30 border-green-500 text-green-100'
                : 'bg-red-900/30 border-red-900/50 text-red-400 opacity-60'}
            `}
          >
            {item.name}
          </div>
        ))}
      </div>
    );
  }
};

const UnlockTracker = ({ gearSlots, skills, regions }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gear */}
      <Card>
        <div className="flex items-center gap-2 mb-4 text-osrs-gold border-b border-gray-600 pb-2">
          <Shirt size={20} />
          <h3 className="text-lg font-bold">Gear Slots</h3>
          <span className="ml-auto text-xs text-gray-400">{gearSlots.filter(i => i.isUnlocked).length}/{gearSlots.length}</span>
        </div>
        <StatusGrid items={gearSlots} type="GEAR" />
      </Card>

      {/* Skills */}
      <Card>
        <div className="flex items-center gap-2 mb-4 text-osrs-gold border-b border-gray-600 pb-2">
          <Book size={20} />
          <h3 className="text-lg font-bold">Skills</h3>
          <span className="ml-auto text-xs text-gray-400">{skills.filter(i => i.isUnlocked).length}/{skills.length}</span>
        </div>
        <StatusGrid items={skills} type="SKILLS" />
      </Card>

      {/* Regions */}
      <Card>
        <div className="flex items-center gap-2 mb-4 text-osrs-gold border-b border-gray-600 pb-2">
          <Map size={20} />
          <h3 className="text-lg font-bold">Regions</h3>
          <span className="ml-auto text-xs text-gray-400">{regions.filter(i => i.isUnlocked).length}/{regions.length}</span>
        </div>
        <StatusGrid items={regions} type="REGIONS" />
      </Card>
    </div>
  );
};

export default UnlockTracker;
