import React from 'react';
import { Card } from './ui/BaseComponents';
import { Shirt, Book, Map } from 'lucide-react';

const StatusGrid = ({ items, type }) => {
  if (type === 'GEAR') {
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
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'SKILLS') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div
            key={item.name}
            className={`
              flex flex-col items-center justify-center p-1 rounded border text-[10px] sm:text-xs font-bold text-center break-words h-12
              ${item.isUnlocked
                ? 'bg-green-900/30 border-green-500 text-green-100'
                : 'bg-red-900/30 border-red-900/50 text-red-400 opacity-60'}
            `}
            title={item.name}
          >
            <span className="w-full">{item.name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'REGIONS') {
    // Group items by region for better display
    const grouped = items.reduce((acc, item) => {
      const region = item.region || 'Misc';
      if (!acc[region]) acc[region] = [];
      acc[region].push(item);
      return acc;
    }, {});

    // Sort regions slightly? Or keep order of insertion (which is effectively order of keys in REGION_AREAS)
    // Object.entries order is preserved for non-integer keys in JS usually.

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {Object.entries(grouped).map(([regionName, areaItems]) => (
            <div key={regionName} className="bg-black/20 p-2 rounded border border-zinc-700/50">
            <div className="text-[10px] text-zinc-400 uppercase font-bold mb-2 ml-1 tracking-wider">{regionName}</div>
            <div className="flex flex-wrap gap-2">
                {areaItems.map((item) => (
                <div
                    key={item.name}
                    className={`
                    px-2 py-1 rounded text-xs font-bold border transition-colors
                    ${item.isUnlocked
                        ? 'bg-green-900/40 border-green-600 text-green-200 shadow-[0_0_5px_rgba(34,197,94,0.2)]'
                        : 'bg-red-900/20 border-red-900/30 text-red-500 opacity-50'}
                    `}
                >
                    {item.name}
                </div>
                ))}
            </div>
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
