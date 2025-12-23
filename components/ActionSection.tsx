
import React from 'react';
import { DropSource } from '../types';
import { DROP_RATES } from '../constants';
import { Swords, HelpCircle } from 'lucide-react';

interface ActionSectionProps {
  onRoll: (source: string, chance: number, event: React.MouseEvent) => void;
}

// OSRS Wiki Icon URLs
const OSRS_ICONS = {
  QUEST: 'https://oldschool.runescape.wiki/images/Quest_point_icon.png',
  DIARY: 'https://oldschool.runescape.wiki/images/Achievement_Diaries_icon.png',
  CA: 'https://oldschool.runescape.wiki/images/Combat_Achievements_icon.png',
  SLAYER: 'https://oldschool.runescape.wiki/images/Slayer_icon.png',
  STATS: 'https://oldschool.runescape.wiki/images/Stats_icon.png',
  COLL_LOG: 'https://oldschool.runescape.wiki/images/Collection_log_icon.png',
  CLUE: 'https://oldschool.runescape.wiki/images/Clue_scroll_%28master%29.png'
};

const CLUE_ICONS = {
  BEGINNER: 'https://oldschool.runescape.wiki/images/Clue_scroll_%28beginner%29.png',
  EASY: 'https://oldschool.runescape.wiki/images/Clue_scroll_%28easy%29.png',
  MEDIUM: 'https://oldschool.runescape.wiki/images/Clue_scroll_%28medium%29.png',
  HARD: 'https://oldschool.runescape.wiki/images/Clue_scroll_%28hard%29.png',
  ELITE: 'https://oldschool.runescape.wiki/images/Clue_scroll_%28elite%29.png',
  MASTER: 'https://oldschool.runescape.wiki/images/Clue_scroll_%28master%29.png'
};

// Unified OSRS Difficulty Tier Styles
const TIER_STYLES = {
  STONE: {
    bg: 'bg-[#2a2620]',
    border: 'border-[#4a453d]',
    hover: 'hover:bg-[#38332a] hover:border-[#6a655d]',
    text: 'text-[#a8a29a]',
    pill: 'bg-[#151310] border-[#3a352e] text-[#888]'
  },
  GREEN: { // Easy / Novice
    bg: 'bg-[#142618]',
    border: 'border-[#2a4c30]',
    hover: 'hover:bg-[#1a3320] hover:border-[#3a6640]',
    text: 'text-[#4ade80]',
    pill: 'bg-[#0a150c] border-[#1f3823] text-[#4ade80]'
  },
  BLUE: { // Medium / Intermediate
    bg: 'bg-[#141e26]',
    border: 'border-[#2a3d4c]',
    hover: 'hover:bg-[#1a2833] hover:border-[#3a5466]',
    text: 'text-[#60a5fa]',
    pill: 'bg-[#0a0f13] border-[#1f2d38] text-[#60a5fa]'
  },
  RED: { // Hard / Experienced
    bg: 'bg-[#2a1414]',
    border: 'border-[#4c2a2a]',
    hover: 'hover:bg-[#331a1a] hover:border-[#663a3a]',
    text: 'text-[#f87171]',
    pill: 'bg-[#150a0a] border-[#2e1515] text-[#f87171]'
  },
  PURPLE: { // Elite / Master (Quest)
    bg: 'bg-[#22142a]',
    border: 'border-[#422a4c]',
    hover: 'hover:bg-[#2d1a33] hover:border-[#573a66]',
    text: 'text-[#c084fc]',
    pill: 'bg-[#110a15] border-[#29152e] text-[#c084fc]'
  },
  AMBER: { // Master (CA/Clue)
    bg: 'bg-[#2a1d14]',
    border: 'border-[#4c352a]',
    hover: 'hover:bg-[#33241a] hover:border-[#66473a]',
    text: 'text-[#fbbf24]',
    pill: 'bg-[#150f0a] border-[#2e2015] text-[#fbbf24]'
  },
  GOLD: { // Grandmaster
    bg: 'bg-[#262314]',
    border: 'border-[#4c462a]',
    hover: 'hover:bg-[#332f1a] hover:border-[#665e3a]',
    text: 'text-[#facc15]',
    pill: 'bg-[#13110a] border-[#2e2a15] text-[#facc15] shadow-[0_0_8px_rgba(250,204,21,0.2)]'
  },
  BROWN: { // Collection Log / Misc
    bg: 'bg-[#2a2016]',
    border: 'border-[#5c4033]',
    hover: 'hover:bg-[#3d2e24] hover:border-[#7d5642]',
    text: 'text-[#e0c0a0]',
    pill: 'bg-[#1c120a] border-[#38261b] text-[#e0c0a0]'
  }
};

type TierStyle = typeof TIER_STYLES.GREEN;

const getTierStyle = (tier: string): TierStyle => {
  const t = tier.toLowerCase();
  if (t.includes('grandmaster')) return TIER_STYLES.GOLD;
  if (t.includes('master') && !t.includes('grand')) return TIER_STYLES.AMBER;
  if (t.includes('elite')) return TIER_STYLES.PURPLE;
  if (t.includes('hard') || t.includes('experienced')) return TIER_STYLES.RED;
  if (t.includes('medium') || t.includes('intermediate')) return TIER_STYLES.BLUE;
  if (t.includes('easy') || t.includes('novice')) return TIER_STYLES.GREEN;
  if (t.includes('beginner')) return TIER_STYLES.STONE;
  return TIER_STYLES.STONE;
};

const RollButton = ({
  label,
  chance,
  onClick,
  style = TIER_STYLES.STONE,
  icon: Icon,
  iconSrc
}: {
  label: string;
  chance: string;
  onClick: (e: React.MouseEvent) => void;
  style?: TierStyle;
  icon?: any;
  iconSrc?: string;
}) => (
  <button
    onClick={onClick}
    className={`
      w-full flex flex-col items-center justify-center px-3 py-3 rounded-[4px] text-sm transition-all border shadow-sm group relative overflow-hidden active:scale-[0.97] active:brightness-125
      ${style.bg} ${style.border} ${style.hover}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="flex items-center gap-2 mb-1 relative z-10">
      {iconSrc ? (
        <img src={iconSrc} alt="" className="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md" />
      ) : Icon ? (
        <Icon className={`w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity ${style.text}`} />
      ) : null}
      <span className={`font-bold whitespace-nowrap tracking-wide ${style.text} text-shadow-sm`}>{label}</span>
    </div>
    <div className={`text-[10px] font-mono px-3 py-0.5 rounded-full border relative z-10 tracking-wider font-bold ${style.pill}`}>
        {chance}
    </div>
  </button>
);

const GridButton = ({
  tier,
  chance,
  onClick,
  iconSrc,
  icon: Icon,
  style: styleOverride
}: {
  tier: string;
  chance: string;
  onClick: (e: React.MouseEvent) => void;
  iconSrc?: string;
  icon?: any;
  style?: TierStyle;
}) => {
  const style = styleOverride || getTierStyle(tier);
  return (
    <button
      onClick={onClick}
      className={`
        ${style.bg} ${style.border} ${style.hover}
        w-full flex flex-col items-center justify-center px-2 py-3 rounded-[4px] text-sm transition-all border shadow-sm group h-full relative active:scale-[0.97] active:brightness-125
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="flex items-center gap-2 mb-1.5 justify-center relative z-10">
        {iconSrc ? (
            <img src={iconSrc} alt="" className="w-6 h-6 object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] opacity-90 group-hover:opacity-100 transition-transform group-hover:scale-110" />
        ) : Icon ? (
            <Icon className={`w-5 h-5 ${style.text} drop-shadow-md opacity-80 group-hover:opacity-100 transition-transform group-hover:scale-110`} />
        ) : (
            <div className={`w-1.5 h-1.5 rounded-full ${style.text} bg-current opacity-70 group-hover:opacity-100 shadow-[0_0_4px_currentColor]`} />
        )}
        <span className={`font-bold text-xs uppercase tracking-wider ${style.text} text-shadow-sm`}>{tier}</span>
      </div>
      <div className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold relative z-10 ${style.pill}`}>
          {chance}
      </div>
    </button>
  );
};

export const ActionSection: React.FC<ActionSectionProps> = ({ onRoll }) => {
  return (
    <div className="bg-osrs-panel border border-osrs-border rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-osrs-gold mb-6 flex items-center gap-2 text-shadow-osrs">
        <Swords className="w-5 h-5 drop-shadow-md" />
        Farm Keys
        <div className="group relative flex items-center ml-1 z-50">
            <HelpCircle className="w-4 h-4 text-gray-500 hover:text-osrs-gold cursor-help transition-colors" />
            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-[#1a1a1a] border border-osrs-border rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs text-gray-300 font-normal leading-relaxed">
                Complete tasks to roll for Keys. Higher difficulty means higher drop rates.
                <br/><br/>
                <span className="text-osrs-gold font-bold">Pity System:</span> Failed rolls grant Fate Points. 50 Points guarantees a key.
                <div className="absolute left-2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1a1a1a]"></div>
            </div>
        </div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-1">
              <img src={OSRS_ICONS.QUEST} alt="Quest" className="w-3.5 h-3.5 object-contain opacity-70" />
              Questing
            </h3>
            <div className="flex flex-col gap-2">
              <RollButton label="Novice" chance={`${DROP_RATES[DropSource.QUEST_NOVICE]}%`} style={TIER_STYLES.STONE} onClick={(e) => onRoll(DropSource.QUEST_NOVICE, DROP_RATES[DropSource.QUEST_NOVICE], e)} />
              <RollButton label="Intermediate" chance={`${DROP_RATES[DropSource.QUEST_INTERMEDIATE]}%`} style={TIER_STYLES.BLUE} onClick={(e) => onRoll(DropSource.QUEST_INTERMEDIATE, DROP_RATES[DropSource.QUEST_INTERMEDIATE], e)} />
              <RollButton label="Experienced" chance={`${DROP_RATES[DropSource.QUEST_EXPERIENCED]}%`} style={TIER_STYLES.RED} onClick={(e) => onRoll(DropSource.QUEST_EXPERIENCED, DROP_RATES[DropSource.QUEST_EXPERIENCED], e)} />
              <RollButton label="Master" chance={`${DROP_RATES[DropSource.QUEST_MASTER]}%`} style={TIER_STYLES.PURPLE} onClick={(e) => onRoll(DropSource.QUEST_MASTER, DROP_RATES[DropSource.QUEST_MASTER], e)} />
              <RollButton label="Grandmaster" chance={`${DROP_RATES[DropSource.QUEST_GRANDMASTER]}% + 20% Omnikey`} style={TIER_STYLES.GOLD} iconSrc={OSRS_ICONS.QUEST} onClick={(e) => onRoll(DropSource.QUEST_GRANDMASTER, DROP_RATES[DropSource.QUEST_GRANDMASTER], e)} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-1">
              <img src={OSRS_ICONS.DIARY} alt="Diary" className="w-3.5 h-3.5 object-contain opacity-70" />
              Achievement Diaries
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <GridButton tier="Easy" chance={`${DROP_RATES[DropSource.DIARY_EASY]}%`} onClick={(e) => onRoll(DropSource.DIARY_EASY, DROP_RATES[DropSource.DIARY_EASY], e)} />
              <GridButton tier="Medium" chance={`${DROP_RATES[DropSource.DIARY_MEDIUM]}%`} onClick={(e) => onRoll(DropSource.DIARY_MEDIUM, DROP_RATES[DropSource.DIARY_MEDIUM], e)} />
              <GridButton tier="Hard" chance={`${DROP_RATES[DropSource.DIARY_HARD]}%`} onClick={(e) => onRoll(DropSource.DIARY_HARD, DROP_RATES[DropSource.DIARY_HARD], e)} />
              <GridButton tier="Elite" chance={`${DROP_RATES[DropSource.DIARY_ELITE]}% + 10% Omnikey`} onClick={(e) => onRoll(DropSource.DIARY_ELITE, DROP_RATES[DropSource.DIARY_ELITE], e)} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-1">
              <img src={OSRS_ICONS.SLAYER} alt="Slayer" className="w-3.5 h-3.5 object-contain opacity-70" />
              Slayer
            </h3>
            <RollButton label="Task Complete" chance={`${DROP_RATES[DropSource.SLAYER_TASK]}%`} iconSrc={OSRS_ICONS.SLAYER} style={TIER_STYLES.RED} onClick={(e) => onRoll(DropSource.SLAYER_TASK, DROP_RATES[DropSource.SLAYER_TASK], e)} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-1">
              <img src={OSRS_ICONS.CA} alt="CA" className="w-3.5 h-3.5 object-contain opacity-70" />
              Combat Achievements
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <GridButton tier="Easy" chance={`${DROP_RATES[DropSource.CA_EASY]}%`} icon={Swords} onClick={(e) => onRoll(DropSource.CA_EASY, DROP_RATES[DropSource.CA_EASY], e)} />
              <GridButton tier="Medium" chance={`${DROP_RATES[DropSource.CA_MEDIUM]}%`} icon={Swords} onClick={(e) => onRoll(DropSource.CA_MEDIUM, DROP_RATES[DropSource.CA_MEDIUM], e)} />
              <GridButton tier="Hard" chance={`${DROP_RATES[DropSource.CA_HARD]}%`} icon={Swords} onClick={(e) => onRoll(DropSource.CA_HARD, DROP_RATES[DropSource.CA_HARD], e)} />
              <GridButton tier="Elite" chance={`${DROP_RATES[DropSource.CA_ELITE]}%`} icon={Swords} onClick={(e) => onRoll(DropSource.CA_ELITE, DROP_RATES[DropSource.CA_ELITE], e)} />
              <GridButton tier="Master" chance={`${DROP_RATES[DropSource.CA_MASTER]}%`} icon={Swords} onClick={(e) => onRoll(DropSource.CA_MASTER, DROP_RATES[DropSource.CA_MASTER], e)} />
              <GridButton tier="G.Master" chance={`${DROP_RATES[DropSource.CA_GRANDMASTER]}%`} icon={Swords} onClick={(e) => onRoll(DropSource.CA_GRANDMASTER, DROP_RATES[DropSource.CA_GRANDMASTER], e)} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-1">
              <img src={OSRS_ICONS.CLUE} alt="Clue" className="w-3.5 h-3.5 object-contain opacity-70" />
              Clue Scrolls
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <GridButton tier="Beginner" chance={`${DROP_RATES[DropSource.CLUE_BEGINNER]}%`} iconSrc={CLUE_ICONS.BEGINNER} onClick={(e) => onRoll(DropSource.CLUE_BEGINNER, DROP_RATES[DropSource.CLUE_BEGINNER], e)} />
              <GridButton tier="Easy" chance={`${DROP_RATES[DropSource.CLUE_EASY]}%`} iconSrc={CLUE_ICONS.EASY} onClick={(e) => onRoll(DropSource.CLUE_EASY, DROP_RATES[DropSource.CLUE_EASY], e)} />
              <GridButton tier="Medium" chance={`${DROP_RATES[DropSource.CLUE_MEDIUM]}%`} iconSrc={CLUE_ICONS.MEDIUM} onClick={(e) => onRoll(DropSource.CLUE_MEDIUM, DROP_RATES[DropSource.CLUE_MEDIUM], e)} />
              <GridButton tier="Hard" chance={`${DROP_RATES[DropSource.CLUE_HARD]}%`} iconSrc={CLUE_ICONS.HARD} onClick={(e) => onRoll(DropSource.CLUE_HARD, DROP_RATES[DropSource.CLUE_HARD], e)} />
              <GridButton tier="Elite" chance={`${DROP_RATES[DropSource.CLUE_ELITE]}%`} iconSrc={CLUE_ICONS.ELITE} onClick={(e) => onRoll(DropSource.CLUE_ELITE, DROP_RATES[DropSource.CLUE_ELITE], e)} />
              <GridButton tier="Master" chance={`${DROP_RATES[DropSource.CLUE_MASTER]}%`} iconSrc={CLUE_ICONS.MASTER} onClick={(e) => onRoll(DropSource.CLUE_MASTER, DROP_RATES[DropSource.CLUE_MASTER], e)} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-1">
              <img src={OSRS_ICONS.COLL_LOG} alt="Coll" className="w-3.5 h-3.5 object-contain opacity-70" />
              Collection Log
            </h3>
            <RollButton label="Collection Log" chance={`${DROP_RATES[DropSource.COLLECTION_LOG]}%`} iconSrc={OSRS_ICONS.COLL_LOG} style={TIER_STYLES.BROWN} onClick={(e) => onRoll(DropSource.COLLECTION_LOG, DROP_RATES[DropSource.COLLECTION_LOG], e)} />
          </div>
          <div className="space-y-2 opacity-60">
             <div className="w-full bg-[#111] border border-dashed border-[#333] px-3 py-2 rounded text-[10px] text-gray-500 flex items-center justify-center text-center font-mono">
               <img src={OSRS_ICONS.STATS} alt="" className="w-3 h-3 mr-2 grayscale opacity-50" />
               Click unlocked skills in the panel below to roll.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
