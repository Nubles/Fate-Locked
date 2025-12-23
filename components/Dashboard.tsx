
import React, { useState, useMemo } from 'react';
import { EQUIPMENT_SLOTS, SKILLS_LIST, REGIONS_LIST, REGION_GROUPS, MISTHALIN_AREAS, MOBILITY_LIST, ARCANA_LIST, MINIGAMES_LIST, BOSSES_LIST, POH_LIST, MERCHANTS_LIST, STORAGE_LIST, EQUIPMENT_TIER_MAX, REGION_ICONS, SLOT_CONFIG, SPECIAL_ICONS, WIKI_OVERRIDES } from '../constants';
import { ChevronRight, ChevronDown, Lock, Sparkles, Footprints, Zap, Gamepad2, HelpCircle, Skull, Home, Coins, Package } from 'lucide-react';

interface DashboardProps {
  unlocks: {
    equipment: Record<string, number>;
    skills: Record<string, number>;
    levels: Record<string, number>;
    regions: string[];
    mobility: string[];
    arcana: string[];
    housing: string[];
    merchants: string[];
    minigames: string[];
    bosses: string[];
    storage: string[];
  };
  onSkillLevelUp: (skill: string) => void;
  specialKeys: number;
  onSpecialUnlock: (type: 'skill' | 'equipment' | 'region' | 'mobility' | 'arcana' | 'housing' | 'merchants' | 'minigames' | 'bosses' | 'storage', name: string) => void;
}

// Helper to generate Wiki URLs
const getWikiUrl = (name: string) => {
  if (WIKI_OVERRIDES[name]) {
    return `https://oldschool.runescape.wiki/w/${WIKI_OVERRIDES[name]}`;
  }
  return `https://oldschool.runescape.wiki/w/${encodeURIComponent(name.replace(/ /g, '_'))}`;
};

// Icon Mapping using OSRS Wiki Images
const getSkillIcon = (skillName: string, isUnlocked: boolean, isLeveling: boolean) => {
  const filename = `${skillName}_icon.png`;
  const url = `https://oldschool.runescape.wiki/images/${filename}`;

  return (
    <img
      src={url}
      alt={skillName}
      className={`w-5 h-5 object-contain transition-transform duration-200 ${isUnlocked ? '' : 'grayscale opacity-40'} ${isLeveling ? 'scale-125 rotate-6' : ''}`}
      onError={(e) => {
        (e.target as HTMLImageElement).style.opacity = '0.1';
      }}
    />
  );
};

const getRegionIcon = (regionName: string, isUnlocked: boolean) => {
  const filename = REGION_ICONS[regionName];
  if (!filename) return null;

  return (
    <img
      src={`https://oldschool.runescape.wiki/images/${filename}`}
      alt={regionName}
      className={`w-5 h-5 object-contain transition-all ${isUnlocked ? 'drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]' : 'grayscale opacity-40'}`}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (img.src.includes('Globe_icon.png')) return;
        img.src = 'https://oldschool.runescape.wiki/images/Globe_icon.png';
        img.style.opacity = isUnlocked ? '1' : '0.4';
      }}
    />
  );
};

const ProgressBar = ({ current, total, colorClass }: { current: number; total: number; colorClass: string }) => {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full bg-black/50 rounded-full h-1.5 mt-2">
      <div
        className={`h-1.5 rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ unlocks, onSkillLevelUp, specialKeys, onSpecialUnlock }) => {
  const [levelingSkill, setLevelingSkill] = useState<string | null>(null);
  const [floatingText, setFloatingText] = useState<{skill: string, text: string, id: number} | null>(null);

  const totalSkillTiers = useMemo(() =>
    (Object.values(unlocks.skills) as number[]).reduce((a, b) => a + b, 0),
  [unlocks.skills]);

  const totalEquipTiers = useMemo(() =>
    (Object.values(unlocks.equipment) as number[]).reduce((a, b) => a + b, 0),
  [unlocks.equipment]);

  const maxSkillTiers = SKILLS_LIST.length * 10;
  const maxEquipTiers = EQUIPMENT_SLOTS.length * EQUIPMENT_TIER_MAX;

  const completionPercent = useMemo(() => {
    const totalUnlocked = totalSkillTiers + unlocks.regions.length + totalEquipTiers + unlocks.mobility.length + unlocks.arcana.length + unlocks.housing.length + unlocks.merchants.length + unlocks.minigames.length + unlocks.bosses.length + unlocks.storage.length;
    const totalAvailable = maxSkillTiers + REGIONS_LIST.length + maxEquipTiers + MOBILITY_LIST.length + ARCANA_LIST.length + POH_LIST.length + MERCHANTS_LIST.length + MINIGAMES_LIST.length + BOSSES_LIST.length + STORAGE_LIST.length;
    return Math.round((totalUnlocked / totalAvailable) * 100);
  }, [totalSkillTiers, totalEquipTiers, unlocks]);

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleGroup = (groupName: string) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  const handleLevelUpClick = (skill: string) => {
    const nextLevel = (unlocks.levels[skill] || 1) + 1;
    const rollChance = Math.ceil(nextLevel / 3);

    // Trigger animations
    setLevelingSkill(skill);
    setFloatingText({
      skill,
      text: `Level ${nextLevel} (${rollChance}% Key Chance)`,
      id: Date.now()
    });

    // Call parent logic
    onSkillLevelUp(skill);

    // Reset animations
    setTimeout(() => setLevelingSkill(null), 300);
    setTimeout(() => setFloatingText(null), 1000);
  };

  const renderSpecialSection = (title: string, items: string[], unlockedItems: string[], type: 'mobility' | 'arcana' | 'housing' | 'merchants' | 'minigames' | 'bosses' | 'storage', colorClass: string, icon: any) => {
     const Icon = icon;
     return (
        <div className="bg-black/20 rounded-lg border border-white/5 p-3 flex-1 min-w-[200px]">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${colorClass}`}>
                <Icon size={14} />
                {title} <span className="text-[10px] opacity-60 ml-auto">{unlockedItems.length}/{items.length}</span>
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {items.map(item => {
                    const isUnlocked = unlockedItems.includes(item);
                    const canSpecialUnlock = !isUnlocked && specialKeys > 0;
                    const wikiIcon = SPECIAL_ICONS[item] || 'Globe_icon.png';

                    if (isUnlocked) {
                      return (
                        <a
                            key={item}
                            href={getWikiUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded border text-left transition-all bg-white/5 border-white/10 text-gray-200 shadow-inner hover:bg-white/10 group cursor-pointer"
                        >
                            <img
                                src={`https://oldschool.runescape.wiki/images/${wikiIcon}`}
                                alt={item}
                                className="w-5 h-5 object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://oldschool.runescape.wiki/images/Globe_icon.png' }}
                            />
                            <span className="text-[10px] font-medium truncate group-hover:underline decoration-white/30">{item}</span>
                        </a>
                      );
                    }

                    return (
                        <button
                            key={item}
                            disabled={!canSpecialUnlock}
                            onClick={() => onSpecialUnlock(type, item)}
                            className={`
                                w-full flex items-center gap-2 px-2 py-1.5 rounded border text-left transition-all
                                ${canSpecialUnlock
                                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 cursor-pointer shadow-[0_0_5px_rgba(168,85,247,0.1)]'
                                        : 'bg-transparent border-transparent text-gray-600 opacity-60 cursor-default'
                                }
                            `}
                        >
                            <img
                                src={`https://oldschool.runescape.wiki/images/${wikiIcon}`}
                                alt={item}
                                className="w-5 h-5 object-contain grayscale opacity-50"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://oldschool.runescape.wiki/images/Globe_icon.png' }}
                            />
                            <span className="text-[10px] font-medium truncate">{item}</span>
                        </button>
                    )
                })}
            </div>
        </div>
     );
  };

  return (
    <div className="bg-osrs-panel border border-osrs-border rounded-lg p-4 lg:p-6 shadow-lg relative space-y-6">
      {specialKeys > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-pulse rounded-t-lg z-10"></div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-osrs-gold flex items-center gap-2">
            Progression
            <div className="group relative flex items-center ml-1 z-50">
              <HelpCircle className="w-4 h-4 text-gray-500 hover:text-osrs-gold cursor-help transition-colors" />
              <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-[#1a1a1a] border border-osrs-border rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs text-gray-300 font-normal leading-relaxed">
                  Track your unlocks here.
                  <br/><br/>
                  <span className="text-green-400 font-bold">Leveling Up:</span> Click unlocked Skills to level them up. Each level grants a roll for a Key (Chance increases with level, max ~33%).
                  <div className="absolute left-2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1a1a1a]"></div>
              </div>
            </div>
            {specialKeys > 0 && (
                <span className="text-xs font-normal text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-500/30 animate-pulse flex items-center gap-1 ml-auto lg:ml-2">
                    <Sparkles size={12} />
                    Omni-Key Active: Click any locked item!
                </span>
            )}
        </h2>
        <span className="text-xs font-mono text-gray-400">
            {completionPercent}% COMPLETE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[600px] h-auto">

        {/* Skills Column */}
        <div className="flex flex-col h-[350px] lg:h-full min-h-0">
          <h3 className="text-blue-400 font-bold mb-2 flex justify-between items-end text-sm">
            Skills (Tiers)
            <span className="text-xs text-blue-400/60">{totalSkillTiers}/{maxSkillTiers}</span>
          </h3>
          <ProgressBar current={totalSkillTiers} total={maxSkillTiers} colorClass="bg-blue-500" />

          <div className="mt-3 overflow-y-auto pr-1 flex-1 custom-scrollbar min-h-0">
            <div className="bg-[#2e2b26] p-[2px] rounded border border-[#1e1d1a] shadow-inner">
              <div className="grid grid-cols-3 gap-[1px]">
                {SKILLS_LIST.map(skill => {
                  const tier = unlocks.skills[skill] || 0;
                  const currentLevel = unlocks.levels[skill] || 1;
                  const isUnlocked = tier > 0;
                  const cap = tier === 0 ? 1 : (tier === 10 ? 99 : tier * 10);
                  const canLevelUp = isUnlocked && currentLevel < cap;

                  const canSpecialUnlock = !isUnlocked && specialKeys > 0;
                  const isInteractive = canLevelUp || canSpecialUnlock;
                  const isCurrentlyLeveling = levelingSkill === skill;

                  let levelColor = '#4a4a4a';
                  if (tier > 0) levelColor = '#e0e0e0';
                  if (canLevelUp) levelColor = '#4ade80';

                  const displayLabel = isUnlocked ? `${currentLevel}/${cap}` : 'Locked';

                  return (
                    <button
                      key={skill}
                      onClick={() => {
                          if (canSpecialUnlock) onSpecialUnlock('skill', skill);
                          else if (canLevelUp) handleLevelUpClick(skill);
                      }}
                      disabled={!isInteractive}
                      className={`
                        relative h-12 flex items-center px-1.5 gap-1.5 text-left
                        bg-[#372e26]
                        shadow-[inset_1px_1px_0_0_rgba(93,86,78,0.6),inset_-1px_-1px_0_0_rgba(20,19,16,0.8)]
                        transition-all duration-150 overflow-visible
                        ${isInteractive ? 'cursor-pointer hover:bg-[#42382f] active:scale-[0.98]' : 'cursor-not-allowed'}
                        ${canLevelUp ? 'ring-1 ring-inset ring-green-500/20' : ''}
                        ${canSpecialUnlock ? 'ring-1 ring-inset ring-purple-500 shadow-[inset_0_0_8px_rgba(168,85,247,0.3)]' : ''}
                        ${isCurrentlyLeveling ? 'scale-105 z-20 bg-[#50453b] ring-2 ring-green-400' : ''}
                      `}
                      title={`${skill}: ${isUnlocked ? `Current Level: ${currentLevel} (Cap: ${cap})` : canSpecialUnlock ? 'Use Omni-Key to Unlock' : 'Locked'}`}
                    >
                      {/* Floating Level Up Feedback */}
                      {floatingText && floatingText.skill === skill && (
                        <div
                          key={floatingText.id}
                          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 border border-green-500 text-green-400 px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap z-[100] animate-float-up shadow-lg"
                        >
                          {floatingText.text}
                        </div>
                      )}

                      <div className={`flex-shrink-0 drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)] relative transition-transform duration-200 ${isCurrentlyLeveling ? 'scale-125' : ''}`}>
                         {getSkillIcon(skill, isUnlocked, isCurrentlyLeveling)}
                         {canLevelUp && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_4px_#22c55e]"></div>
                         )}
                         {canSpecialUnlock && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-bounce shadow-[0_0_4px_#a855f7]"></div>
                         )}
                      </div>
                      <div className="flex flex-col leading-none w-full overflow-hidden justify-center">
                         <span className={`text-[9px] font-bold truncate w-full tracking-wide ${isUnlocked ? 'text-[#ffff00] drop-shadow-[1px_1px_0_rgba(0,0,0,1)]' : canSpecialUnlock ? 'text-purple-300' : 'text-[#6e6e6e]'}`}>
                           {skill}
                         </span>
                         <span
                           className={`text-[9px] font-mono mt-0.5 transition-all duration-300 ${isCurrentlyLeveling ? 'text-white scale-110' : ''}`}
                           style={{ color: isCurrentlyLeveling ? '#fff' : levelColor, textShadow: isUnlocked ? '1px 1px 0 #000' : 'none' }}
                         >
                            {displayLabel}
                         </span>

                         <div className="flex w-full gap-[1px] mt-1 h-1.5">
                            {Array.from({length: 10}).map((_, i) => {
                                const t = i + 1;
                                const unlockedTier = tier >= t;
                                const isMaxTier = t === 10;
                                let bgClass = 'bg-[#1a1a1a]';
                                let shadowClass = '';
                                if (unlockedTier) {
                                    if (isMaxTier) {
                                        bgClass = 'bg-osrs-gold';
                                        shadowClass = 'shadow-[0_0_3px_rgba(251,191,36,0.8)]';
                                    } else {
                                        bgClass = 'bg-blue-500';
                                        shadowClass = 'shadow-[0_0_2px_rgba(59,130,246,0.6)]';
                                    }
                                }
                                return (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-[1px] ${bgClass} ${shadowClass} transition-colors duration-500`}
                                    />
                                );
                            })}
                         </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Areas Column */}
        <div className="flex flex-col h-[350px] lg:h-full min-h-0">
          <h3 className="text-emerald-400 font-bold mb-2 flex justify-between items-end text-sm">
            Areas
            <span className="text-xs text-emerald-400/60">{unlocks.regions.length}/{REGIONS_LIST.length}</span>
          </h3>
          <ProgressBar current={unlocks.regions.length} total={REGIONS_LIST.length} colorClass="bg-emerald-500" />

          <div className="mt-3 space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar min-h-0">
            <div className="rounded border border-emerald-500/20 bg-black/20 overflow-hidden">
                <div className="px-2 py-1.5 flex justify-between items-center border-b border-emerald-500/10 bg-emerald-900/10">
                    <div className="flex items-center gap-2">
                         <div className="w-5 h-5 flex items-center justify-center">
                            {getRegionIcon('Misthalin', true)}
                        </div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Misthalin
                        </h4>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-300/60">Unlocked</span>
                </div>

                <div className="p-1.5 grid grid-cols-2 gap-1 bg-black/10">
                   {MISTHALIN_AREAS.map(area => (
                       <a
                           key={area}
                           href={getWikiUrl(area)}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center px-2 py-1.5 rounded border text-[10px] truncate transition-all text-left w-full bg-emerald-500/10 border-emerald-500/20 text-emerald-100 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)] hover:bg-emerald-500/20 cursor-pointer group"
                       >
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)] mr-2 flex-shrink-0"></div>
                           <span className="truncate group-hover:underline decoration-emerald-400/50">{area}</span>
                       </a>
                   ))}
                </div>
            </div>

            {Object.entries(REGION_GROUPS).map(([groupName, areas]) => {
                const unlockedCount = areas.filter(a => unlocks.regions.includes(a)).length;
                const hasUnlock = unlockedCount > 0;
                const isExpanded = expandedGroup === groupName;

                return (
                  <div
                    key={groupName}
                    className={`rounded border overflow-hidden transition-all duration-300 ${hasUnlock ? 'border-emerald-500/30 bg-black/20' : 'border-white/5 bg-black/10'}`}
                  >
                      <button
                        onClick={() => toggleGroup(groupName)}
                        className={`w-full px-2 py-2 flex justify-between items-center border-b text-left ${hasUnlock ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-white/5 border-white/5'} hover:bg-white/10 transition-colors`}
                      >
                        <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown className={`w-3 h-3 ${hasUnlock ? 'text-emerald-400' : 'text-gray-500'}`} /> : <ChevronRight className={`w-3 h-3 ${hasUnlock ? 'text-emerald-400' : 'text-gray-500'}`} />}
                            {getRegionIcon(groupName, hasUnlock)}
                            <h4 className={`text-[10px] font-bold uppercase tracking-wider ${hasUnlock ? 'text-emerald-400' : 'text-gray-500'}`}>{groupName}</h4>
                        </div>
                        <span className={`text-[9px] font-mono ${hasUnlock ? 'text-emerald-400/60' : 'text-gray-600'}`}>{unlockedCount}/{areas.length}</span>
                      </button>

                      {isExpanded && (
                        <div className="p-1.5 grid grid-cols-2 gap-1 bg-black/10 animate-in fade-in slide-in-from-top-1 duration-200">
                            {areas.map(area => {
                                 const isUnlocked = unlocks.regions.includes(area);
                                 const canSpecialUnlock = !isUnlocked && specialKeys > 0;

                                 return (
                                    <div
                                        key={area}
                                        onClick={() => {
                                            if (!isUnlocked && canSpecialUnlock) {
                                                onSpecialUnlock('region', area);
                                            }
                                        }}
                                        className={`
                                            flex items-center px-2 py-1.5 rounded border text-[10px] truncate transition-all text-left w-full relative group
                                            ${isUnlocked
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]'
                                                : canSpecialUnlock
                                                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 cursor-pointer shadow-[0_0_5px_rgba(168,85,247,0.1)]'
                                                    : 'bg-transparent border-transparent text-gray-700 hover:bg-white/5 cursor-default'
                                            }
                                        `}
                                        title={canSpecialUnlock ? `Unlock ${area}` : area}
                                    >
                                      <div className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 transition-colors ${isUnlocked ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]' : canSpecialUnlock ? 'bg-purple-500 animate-pulse' : 'bg-gray-800'}`}></div>
                                      <a
                                         href={getWikiUrl(area)}
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         onClick={(e) => e.stopPropagation()}
                                         className={`truncate hover:underline z-10 ${isUnlocked ? 'decoration-emerald-400/50' : 'decoration-gray-500'}`}
                                      >
                                        {area}
                                      </a>
                                    </div>
                                 )
                            })}
                        </div>
                      )}
                  </div>
                );
            })}
          </div>
        </div>

        {/* Equipment Column */}
        <div className="flex flex-col h-[350px] lg:h-full min-h-0">
          <h3 className="text-gray-300 font-bold mb-2 flex justify-between items-end text-sm">
            Equipment (Tiers)
            <span className="text-xs text-gray-500">{totalEquipTiers}/{maxEquipTiers}</span>
          </h3>
          <ProgressBar current={totalEquipTiers} total={maxEquipTiers} colorClass="bg-gray-400" />

          <div className="mt-3 flex-1 flex items-center justify-center min-h-0">
            <div className="bg-[#2e2b26] rounded border border-[#1e1d1a] shadow-inner p-4 lg:p-8 relative overflow-hidden shrink-0">
                <div className="relative">
                    <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
                        <div className="absolute left-[50%] top-2 bottom-2 w-1.5 -ml-[3px] bg-[#221f1a] shadow-[inset_1px_0_1px_rgba(255,255,255,0.05)] border-l border-[#3a352e]"></div>
                        <div className="absolute top-[23%] left-[10%] right-[10%] h-1.5 bg-[#221f1a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border-t border-[#3a352e]"></div>
                        <div className="absolute top-[50%] left-[10%] right-[10%] h-1.5 bg-[#221f1a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border-t border-[#3a352e]"></div>
                        <div className="absolute left-[16.66%] top-[50%] bottom-[10%] w-1.5 -ml-[3px] bg-[#221f1a] shadow-[inset_1px_0_1px_rgba(255,255,255,0.05)] border-l border-[#3a352e]"></div>
                        <div className="absolute right-[16.66%] top-[50%] bottom-[10%] w-1.5 -mr-[3px] bg-[#221f1a] shadow-[inset_1px_0_1px_rgba(255,255,255,0.05)] border-l border-[#3a352e]"></div>
                    </div>

                    <div className="grid grid-cols-3 grid-rows-5 gap-3 lg:gap-4 w-max relative z-10">
                    {EQUIPMENT_SLOTS.map(slot => {
                        const tier = unlocks.equipment[slot] || 0;
                        const isUnlocked = tier > 0;
                        const canSpecialUnlock = tier < EQUIPMENT_TIER_MAX && specialKeys > 0;
                        const config = SLOT_CONFIG[slot];
                        if (!config) return null;

                        return (
                        <button
                            key={slot}
                            onClick={() => canSpecialUnlock && onSpecialUnlock('equipment', slot)}
                            disabled={!canSpecialUnlock}
                            className={`
                            ${config.gridArea}
                            w-12 h-12 lg:w-20 lg:h-20
                            relative flex items-center justify-center
                            rounded-[2px] bg-[#383023]
                            shadow-[inset_2px_2px_2px_rgba(0,0,0,0.6),1px_1px_0_rgba(255,255,255,0.05)]
                            transition-all duration-300
                            ${canSpecialUnlock ? 'ring-2 ring-purple-500 cursor-pointer hover:scale-105 z-20' : 'cursor-default'}
                            `}
                            title={isUnlocked ? `${slot}: Tier ${tier}` : canSpecialUnlock ? 'Use Omni-Key to Upgrade' : 'Locked'}
                        >
                            <img
                            src={`https://oldschool.runescape.wiki/images/${config.file}`}
                            alt={slot}
                            className={`
                                w-8 h-8 lg:w-12 lg:h-12 object-contain transition-all duration-300
                                ${isUnlocked
                                ? 'opacity-100 brightness-110 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]'
                                : 'opacity-50 grayscale contrast-100'}
                            `}
                            />

                            <div className="absolute bottom-1 left-1 right-1 lg:bottom-1.5 flex gap-[1px] h-1 lg:h-1.5">
                                {Array.from({ length: EQUIPMENT_TIER_MAX }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`
                                            flex-1 rounded-[1px]
                                            ${tier > i ? 'bg-green-500 shadow-[0_0_2px_#22c55e]' : 'bg-gray-800'}
                                        `}
                                    />
                                ))}
                            </div>

                            {canSpecialUnlock && (
                            <div className="absolute inset-0 bg-purple-500/20 animate-pulse pointer-events-none"></div>
                            )}

                            {isUnlocked && (
                            <div className="absolute inset-0 rounded border border-yellow-400/20 shadow-[inset_0_0_8px_rgba(255,215,0,0.1)] pointer-events-none"></div>
                            )}
                        </button>
                        );
                    })}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Unlocks Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border-t border-white/5 pt-6">
         {renderSpecialSection('Mobility', MOBILITY_LIST, unlocks.mobility, 'mobility', 'text-amber-400', Footprints)}
         {renderSpecialSection('Arcana', ARCANA_LIST, unlocks.arcana, 'arcana', 'text-violet-400', Zap)}
         {renderSpecialSection('Housing', POH_LIST, unlocks.housing, 'housing', 'text-orange-400', Home)}
         {renderSpecialSection('Merchants', MERCHANTS_LIST, unlocks.merchants, 'merchants', 'text-yellow-400', Coins)}
         {renderSpecialSection('Minigames', MINIGAMES_LIST, unlocks.minigames, 'minigames', 'text-cyan-400', Gamepad2)}
         {renderSpecialSection('Bosses', BOSSES_LIST, unlocks.bosses, 'bosses', 'text-fuchsia-400', Skull)}
         {renderSpecialSection('Storage', STORAGE_LIST, unlocks.storage, 'storage', 'text-amber-500', Package)}
      </div>
    </div>
  );
};
