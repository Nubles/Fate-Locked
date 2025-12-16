import React from 'react';
import { Card } from './ui/BaseComponents';
import {
  Shirt, Book, Map,
  Sword, Heart, Pickaxe,
  Dumbbell, Footprints, Anvil,
  Shield, FlaskConical, Fish,
  Crosshair, VenetianMask, CookingPot,
  Star, Gem, Flame,
  Sparkles, Feather, Trees,
  Orbit, Skull, Sprout,
  Hammer, PawPrint, Anchor
} from 'lucide-react';

// OSRS Skill Tab Order (Row by Row)
const SKILL_DISPLAY_ORDER = [
  'Attack', 'Hitpoints', 'Mining',
  'Strength', 'Agility', 'Smithing',
  'Defence', 'Herblore', 'Fishing',
  'Ranged', 'Thieving', 'Cooking',
  'Prayer', 'Crafting', 'Firemaking',
  'Magic', 'Fletching', 'Woodcutting',
  'Runecraft', 'Slayer', 'Farming',
  'Construction', 'Hunter', 'Sailing'
];

const SKILL_ICONS = {
  Attack: Sword,
  Hitpoints: Heart,
  Mining: Pickaxe,
  Strength: Dumbbell,
  Agility: Footprints,
  Smithing: Anvil, // Fallback: Hammer
  Defence: Shield,
  Herblore: FlaskConical,
  Fishing: Fish,
  Ranged: Crosshair,
  Thieving: VenetianMask,
  Cooking: CookingPot,
  Prayer: Star,
  Crafting: Gem,
  Firemaking: Flame,
  Magic: Sparkles,
  Fletching: Feather,
  Woodcutting: Trees,
  Runecraft: Orbit,
  Slayer: Skull,
  Farming: Sprout,
  Construction: Hammer,
  Hunter: PawPrint,
  Sailing: Anchor
};

const SKILL_COLORS = {
  Attack: '#9ca3af', // Silver/Grey
  Hitpoints: '#ef4444', // Red
  Mining: '#a8a29e', // Stone
  Strength: '#16a34a', // Green
  Agility: '#3b82f6', // Blue
  Smithing: '#9ca3af', // Grey
  Defence: '#60a5fa', // Blue
  Herblore: '#22c55e', // Green
  Fishing: '#93c5fd', // Light Blue
  Ranged: '#15803d', // Dark Green
  Thieving: '#a855f7', // Purple
  Cooking: '#7f1d1d', // Dark Red
  Prayer: '#fef08a', // Pale Yellow
  Crafting: '#b45309', // Brown
  Firemaking: '#f97316', // Orange
  Magic: '#2563eb', // Blue
  Fletching: '#0d9488', // Teal
  Woodcutting: '#16a34a', // Green
  Runecraft: '#eab308', // Yellow
  Slayer: '#e4e4e7', // Zinc
  Farming: '#22c55e', // Green
  Construction: '#fdba74', // Orange/Tan
  Hunter: '#92400e', // Brown
  Sailing: '#1e40af' // Dark Blue
};

const StatusGrid = ({ items, type, skillLevels }) => {
  if (!items || !Array.isArray(items)) {
    return <div className="text-red-500 text-xs p-2">Error: No data available</div>;
  }

  if (type === 'GEAR') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {items.map((item, idx) => (
          <div
            key={item.name || idx}
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
    // Calculate Total Level
    const totalLevel = skillLevels
      ? Object.values(skillLevels).reduce((a, b) => a + b, 0)
      : 0;

    return (
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 bg-[#383838] p-1 gap-1 border border-[#5a5a5a] rounded-sm">
          {SKILL_DISPLAY_ORDER.map((skillName) => {
            const skillData = items.find(i => i.name === skillName);
            const level = skillLevels ? skillLevels[skillName] : 1;
            const Icon = SKILL_ICONS[skillName] || Book;
            const iconColor = SKILL_COLORS[skillName] || '#d1d5db';

            if (!skillData) return null;

            // Visual state based on locked/unlocked
            const isUnlocked = skillData.isUnlocked;

            return (
              <div
                key={skillName}
                className={`
                  flex items-center gap-1 p-1 h-8 bg-[#1e1e1e] border border-[#5a5a5a] rounded-sm select-none relative
                  ${!isUnlocked ? 'opacity-50' : ''}
                `}
                title={skillName}
              >
                {/* Icon */}
                <div className="w-5 h-5 flex items-center justify-center" style={{ color: iconColor }}>
                  <Icon size={16} />
                </div>

                {/* Level Text (Yellow) */}
                <div className="flex-1 text-right font-sans text-osrs-gold text-[10px] leading-tight font-bold shadow-black drop-shadow-md">
                   {level}/{level}
                </div>

                {/* Overlay for locked status */}
                {!isUnlocked && (
                    <div className="absolute inset-0 bg-red-900/20 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Total Level Bar */}
        <div className="bg-[#101010] border border-[#5a5a5a] rounded-sm p-1 flex justify-center gap-2 items-center px-3">
             <span className="text-osrs-gold text-xs font-bold">Total level:</span>
             <span className="text-osrs-gold text-xs font-bold">{totalLevel}</span>
        </div>
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

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {Object.entries(grouped).map(([regionName, areaItems]) => (
            <div key={regionName} className="bg-black/20 p-2 rounded border border-zinc-700/50">
            <div className="text-[10px] text-zinc-400 uppercase font-bold mb-2 ml-1 tracking-wider">{regionName}</div>
            <div className="flex flex-wrap gap-2">
                {areaItems.map((item, idx) => (
                <div
                    key={item.name || idx}
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

  return null;
};

const UnlockTracker = ({ gearSlots, skills, regions, skillLevels }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gear */}
      <Card>
        <div className="flex items-center gap-2 mb-4 text-osrs-gold border-b border-gray-600 pb-2">
          <Shirt size={20} />
          <h3 className="text-lg font-bold">Gear Slots</h3>
          <span className="ml-auto text-xs text-gray-400">
            {Array.isArray(gearSlots) ? `${gearSlots.filter(i => i.isUnlocked).length}/${gearSlots.length}` : '0/0'}
          </span>
        </div>
        <StatusGrid items={gearSlots} type="GEAR" />
      </Card>

      {/* Skills */}
      <Card>
        <div className="flex items-center gap-2 mb-4 text-osrs-gold border-b border-gray-600 pb-2">
          <Book size={20} />
          <h3 className="text-lg font-bold">Skills</h3>
          <span className="ml-auto text-xs text-gray-400">
             {Array.isArray(skills) ? `${skills.filter(i => i.isUnlocked).length}/${skills.length}` : '0/0'}
          </span>
        </div>
        <StatusGrid items={skills} type="SKILLS" skillLevels={skillLevels} />
      </Card>

      {/* Regions */}
      <Card>
        <div className="flex items-center gap-2 mb-4 text-osrs-gold border-b border-gray-600 pb-2">
          <Map size={20} />
          <h3 className="text-lg font-bold">Regions</h3>
          <span className="ml-auto text-xs text-gray-400">
             {Array.isArray(regions) ? `${regions.filter(i => i.isUnlocked).length}/${regions.length}` : '0/0'}
          </span>
        </div>
        <StatusGrid items={regions} type="REGIONS" />
      </Card>
    </div>
  );
};

export default UnlockTracker;
