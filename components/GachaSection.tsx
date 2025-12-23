
import React from 'react';
import { TableType } from '../types';
import { Shield, Map, Hammer, Lock, Dices, Sparkles, Footprints, Zap, Gamepad2, HelpCircle, Skull, Home, Coins, Package, Dna } from 'lucide-react';
import { EQUIPMENT_SLOTS, SKILLS_LIST, REGIONS_LIST, MOBILITY_LIST, ARCANA_LIST, MINIGAMES_LIST, BOSSES_LIST, POH_LIST, MERCHANTS_LIST, STORAGE_LIST } from '../constants';
import cubesBg from '../assets/cubes.png';
import diagmondsBg from '../assets/diagmonds-light.png';

interface GachaSectionProps {
  keys: number;
  chaosKeys: number;
  onUnlock: (table: TableType) => void;
  onChaosUnlock: () => void;
  canUnlock: {
    equipment: boolean;
    skills: boolean;
    regions: boolean;
    mobility: boolean;
    arcana: boolean;
    poh: boolean;
    merchants: boolean;
    minigames: boolean;
    bosses: boolean;
    storage: boolean;
  };
}

interface SpendCardProps {
  type: TableType;
  label: string;
  subLabel: string;
  description: string;
  disabled: boolean;
  keysAvailable: boolean;
  complete: boolean;
  icon?: any;
  iconSrc?: string;
  onClick: () => void;
  priceDisplay?: string;
}

const OSRS_GACHA_ICONS = {
  EQUIPMENT: 'https://oldschool.runescape.wiki/images/Equipment_Stats.png',
  SKILLS: 'https://oldschool.runescape.wiki/images/Stats_icon.png',
  REGIONS: 'https://oldschool.runescape.wiki/images/World_map_icon.png',
  MOBILITY: 'https://oldschool.runescape.wiki/images/Graceful_boots.png',
  ARCANA: 'https://oldschool.runescape.wiki/images/Spellbook_Swap.png',
  MINIGAMES: 'https://oldschool.runescape.wiki/images/Minigames.png',
  BOSSES: 'https://oldschool.runescape.wiki/images/Culinaromancer.png',
  POH: 'https://oldschool.runescape.wiki/images/Portal_%28Player-owned_house%29.png',
  MERCHANTS: 'https://oldschool.runescape.wiki/images/General_store_icon.png',
  STORAGE: 'https://oldschool.runescape.wiki/images/Looting_bag.png'
};

const SpendCard: React.FC<SpendCardProps> = ({
  label,
  subLabel,
  description,
  disabled,
  keysAvailable,
  complete,
  icon: Icon,
  iconSrc,
  onClick,
  priceDisplay = "1"
}) => {

  // Unified OSRS Theme (Gold/Brown)
  const theme = {
      bg: 'bg-[#2a2620]',
      border: 'border-[#4a453d]',
      hoverBorder: 'hover:border-[#fbbf24]',
      text: 'text-[#d1d5db]',
      subText: 'text-[#888]',
      iconBg: 'text-[#fbbf24]', // Gold icon
      glow: 'shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_10px_rgba(251,191,36,0.1)]'
  };

  const isClickable = !disabled && keysAvailable && !complete;
  const isLocked = !keysAvailable && !complete;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`
        relative overflow-hidden rounded-md border-2 transition-all duration-150 w-full text-left group flex flex-col p-3 shadow-lg h-full min-h-[110px]
        ${isClickable
          ? `${theme.bg} ${theme.border} ${theme.hoverBorder} ${theme.glow} hover:-translate-y-1 hover:shadow-xl`
          : 'bg-[#111111] border-[#222222] cursor-not-allowed'}
      `}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url(${cubesBg})` }}
      ></div>

      {/* Header: Icon + Price */}
      <div className={`flex justify-between items-start w-full relative z-10 mb-2 transition-opacity duration-300 ${isLocked ? 'opacity-20' : 'opacity-100'}`}>
        <div className={`p-1.5 rounded bg-[#1a1814] border border-[#3a352e] shadow-inner ${theme.iconBg} flex items-center justify-center w-8 h-8 shrink-0`}>
           {iconSrc ? (
               <img src={iconSrc} alt={label} className="w-5 h-5 object-contain drop-shadow-md" />
           ) : (
               Icon && <Icon size={20} strokeWidth={1.5} />
           )}
        </div>

        {complete ? (
           <div className="flex flex-col items-end h-8 justify-center">
             <span className="px-2 py-0.5 bg-green-900/40 text-green-400 text-[9px] font-bold uppercase rounded border border-green-800 tracking-wider">
               Done
             </span>
           </div>
        ) : (
           <div className={`flex flex-col items-end h-8 justify-center`}>
              <span className="text-[9px] uppercase tracking-widest text-[#666] font-bold leading-none mb-0.5 font-mono">Price</span>
              <span className="text-osrs-gold font-bold text-lg leading-none text-shadow-osrs">{priceDisplay}</span>
           </div>
        )}
      </div>

      {/* Middle: Text */}
      <div className={`relative z-10 flex-1 transition-opacity duration-300 ${isLocked ? 'opacity-20' : 'opacity-100'} w-full`}>
          <h3 className={`text-sm font-bold ${theme.text} text-shadow-osrs group-hover:text-[#fbbf24] transition-colors leading-tight pr-1 break-words`}>
            {label}
          </h3>
          <p className={`text-[10px] ${theme.subText} font-mono mt-0.5 text-shadow-osrs uppercase break-words leading-tight`}>{subLabel}</p>
      </div>

      {/* Footer: Details + Action */}
      <div className={`mt-3 flex items-center justify-between w-full relative z-10 pt-2 border-t border-white/5 transition-opacity duration-300 ${isLocked ? 'opacity-20' : 'opacity-100'}`}>
         <span className="text-[9px] text-[#666] uppercase tracking-wide font-bold pr-2 flex-1 leading-tight break-words">{description}</span>
         {isClickable && (
           <div className="flex items-center gap-1 text-[10px] text-[#888] group-hover:text-white transition-colors px-1.5 py-0.5 rounded bg-black/30 border border-[#333] shadow-sm whitespace-nowrap shrink-0">
             <span className="font-medium">Roll</span>
             <Dices size={12} className="group-hover:rotate-12 transition-transform duration-300" />
           </div>
         )}
      </div>

      {/* Locked Overlay */}
      {isLocked && (
           <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/20 backdrop-blur-[1px]">
               <Lock className="w-5 h-5 mb-1 text-[#666] drop-shadow-md" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] font-mono text-shadow-osrs">Need Keys</span>
           </div>
      )}
    </button>
  );
};

export const GachaSection: React.FC<GachaSectionProps> = ({ keys, chaosKeys, onUnlock, onChaosUnlock, canUnlock }) => {
  return (
    <div className="bg-[#1b1b1b] border border-[#2d2d2d] rounded-lg h-auto flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-2">
           <span className="w-4 h-4 text-osrs-gold drop-shadow-md flex items-center justify-center">
             <Sparkles size={16} />
           </span>
           <h2 className="text-lg font-bold text-osrs-gold uppercase tracking-wide text-shadow-osrs">Spend Keys</h2>
           <div className="group relative flex items-center ml-1 z-50">
              <HelpCircle className="w-3.5 h-3.5 text-gray-500 hover:text-osrs-gold cursor-help transition-colors" />
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-[#1a1a1a] border border-osrs-border rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs text-gray-300 font-normal leading-relaxed z-[60]">
                  Unlock new content tables.
                  <br/><br/>
                  <span className="text-osrs-gold font-bold">Strategy:</span> Unlocking early game areas and mobility can accelerate your account faster than gear!
              </div>
           </div>
        </div>

        {keys > 0 ? (
            <div className="flex items-center gap-2 px-2 py-0.5 bg-osrs-gold/10 border border-osrs-gold/30 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-osrs-gold shadow-[0_0_5px_#fbbf24]"></span>
                <span className="text-[10px] font-bold text-osrs-gold tracking-wide">AVAILABLE</span>
            </div>
        ) : (
            <div className="text-[10px] font-mono text-gray-600">NO KEYS</div>
        )}
      </div>

      {chaosKeys > 0 && (
          <div className="p-4 pb-0">
            <button
                onClick={onChaosUnlock}
                className="w-full p-4 rounded-lg border border-red-500/50 bg-gradient-to-r from-red-900/20 via-purple-900/20 to-red-900/20 flex items-center justify-between group hover:border-red-400 transition-all shadow-[0_0_15px_rgba(220,38,38,0.15)] relative overflow-hidden"
            >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: `url(${diagmondsBg})` }}
                ></div>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-red-500/20 rounded-full border border-red-500/50 animate-pulse">
                        <Dna className="text-red-400 w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                            Chaos Key Available
                            <span className="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded border border-red-500/30 text-red-300 animate-pulse">WILDCARD</span>
                        </h3>
                        <p className="text-xs text-red-300/60 font-mono">Unlocks a random item from ANY category.</p>
                    </div>
                </div>
                <div className="text-2xl font-bold text-red-500 group-hover:scale-110 transition-transform relative z-10 text-shadow-osrs">
                    {chaosKeys}
                </div>
            </button>
          </div>
      )}

      {/* Cards Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 custom-scrollbar content-start">
         {/* Equipment */}
         <SpendCard
            type={TableType.EQUIPMENT}
            label="Equipment"
            subLabel="Upgrade Gear"
            description={`${EQUIPMENT_SLOTS.length} Slots available`}
            disabled={!canUnlock.equipment}
            keysAvailable={keys > 0}
            complete={!canUnlock.equipment}
            iconSrc={OSRS_GACHA_ICONS.EQUIPMENT}
            onClick={() => onUnlock(TableType.EQUIPMENT)}
          />

          {/* Skills */}
          <SpendCard
            type={TableType.SKILLS}
            label="Skills"
            subLabel="+10 Level Cap"
            description={`1 of ${SKILLS_LIST.length} Skills`}
            disabled={!canUnlock.skills}
            keysAvailable={keys > 0}
            complete={!canUnlock.skills}
            priceDisplay="1-2"
            iconSrc={OSRS_GACHA_ICONS.SKILLS}
            onClick={() => onUnlock(TableType.SKILLS)}
          />

          {/* Regions */}
          <SpendCard
            type={TableType.REGIONS}
            label="Areas"
            subLabel="New Territory"
            description={`1 of ${REGIONS_LIST.length} Areas`}
            disabled={!canUnlock.regions}
            keysAvailable={keys > 0}
            complete={!canUnlock.regions}
            iconSrc={OSRS_GACHA_ICONS.REGIONS}
            onClick={() => onUnlock(TableType.REGIONS)}
          />

          {/* Mobility */}
          <SpendCard
            type={TableType.MOBILITY}
            label="Mobility"
            subLabel="Travel Networks"
            description={`1 of ${MOBILITY_LIST.length} Types`}
            disabled={!canUnlock.mobility}
            keysAvailable={keys > 0}
            complete={!canUnlock.mobility}
            iconSrc={OSRS_GACHA_ICONS.MOBILITY}
            onClick={() => onUnlock(TableType.MOBILITY)}
          />

          {/* Arcana */}
          <SpendCard
            type={TableType.ARCANA}
            label="Arcana"
            subLabel="Spells & Prayers"
            description={`1 of ${ARCANA_LIST.length} Upgrades`}
            disabled={!canUnlock.arcana}
            keysAvailable={keys > 0}
            complete={!canUnlock.arcana}
            iconSrc={OSRS_GACHA_ICONS.ARCANA}
            onClick={() => onUnlock(TableType.ARCANA)}
          />

          {/* Storage (New) */}
          <SpendCard
            type={TableType.STORAGE}
            label="Storage"
            subLabel="Inventory Space"
            description={`1 of ${STORAGE_LIST.length} Items`}
            disabled={!canUnlock.storage}
            keysAvailable={keys > 0}
            complete={!canUnlock.storage}
            iconSrc={OSRS_GACHA_ICONS.STORAGE}
            onClick={() => onUnlock(TableType.STORAGE)}
          />

          {/* Housing */}
          <SpendCard
            type={TableType.POH}
            label="Housing"
            subLabel="POH Facilities"
            description={`1 of ${POH_LIST.length} Upgrades`}
            disabled={!canUnlock.poh}
            keysAvailable={keys > 0}
            complete={!canUnlock.poh}
            iconSrc={OSRS_GACHA_ICONS.POH}
            onClick={() => onUnlock(TableType.POH)}
          />

          {/* Merchants */}
          <SpendCard
            type={TableType.MERCHANTS}
            label="Merchants"
            subLabel="Shops & Wares"
            description={`1 of ${MERCHANTS_LIST.length} Types`}
            disabled={!canUnlock.merchants}
            keysAvailable={keys > 0}
            complete={!canUnlock.merchants}
            iconSrc={OSRS_GACHA_ICONS.MERCHANTS}
            onClick={() => onUnlock(TableType.MERCHANTS)}
          />

          {/* Minigames */}
          <SpendCard
            type={TableType.MINIGAMES}
            label="Minigames"
            subLabel="Activities & Fun"
            description={`1 of ${MINIGAMES_LIST.length} Activities`}
            disabled={!canUnlock.minigames}
            keysAvailable={keys > 0}
            complete={!canUnlock.minigames}
            iconSrc={OSRS_GACHA_ICONS.MINIGAMES}
            onClick={() => onUnlock(TableType.MINIGAMES)}
          />

          {/* Bosses */}
          <SpendCard
            type={TableType.BOSSES}
            label="Bosses"
            subLabel="Major Encounters"
            description={`1 of ${BOSSES_LIST.length} Bosses`}
            disabled={!canUnlock.bosses}
            keysAvailable={keys > 0}
            complete={!canUnlock.bosses}
            iconSrc={OSRS_GACHA_ICONS.BOSSES}
            onClick={() => onUnlock(TableType.BOSSES)}
          />
      </div>
    </div>
  );
};
