
import React, { useState } from 'react';
import { X, Shield, Package, ArrowUp, BookOpen, Dices, Sparkles, Map, Zap, Scroll, Skull, Activity, Lock, Key, Dna, Coins, HelpCircle, GraduationCap } from 'lucide-react';
import { DROP_RATES } from '../constants';

interface ReferenceModalProps {
  onClose: () => void;
}

type TabId = 'core' | 'drops' | 'altar' | 'unlocks' | 'equipment' | 'storage';

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabId>('core');

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'core', label: 'Core Rules', icon: BookOpen },
    { id: 'drops', label: 'RNG & Drop Rates', icon: Dices },
    { id: 'altar', label: 'The Void Altar', icon: Zap },
    { id: 'unlocks', label: 'Unlock Systems', icon: Lock },
    { id: 'equipment', label: 'Equipment Tiers', icon: Shield },
    { id: 'storage', label: 'UIM Storage', icon: Package },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-osrs-border w-full max-w-5xl rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[85vh]">

        {/* Header */}
        <div className="bg-[#1a1a1a] p-4 border-b border-osrs-border flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-osrs-gold/10 p-2 rounded-lg border border-osrs-gold/20">
                <HelpCircle className="w-5 h-5 text-osrs-gold" />
             </div>
            <h2 className="text-xl font-bold text-gray-100 tracking-wide">Fate-Locked UIM: Codex</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-[#161616] border-r border-osrs-border flex flex-col overflow-y-auto custom-scrollbar shrink-0">
                <div className="p-3 space-y-1">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200
                                    ${isActive
                                        ? 'bg-[#252525] text-osrs-gold border border-osrs-gold/20 shadow-md translate-x-1'
                                        : 'text-gray-400 hover:bg-[#202020] hover:text-gray-200 border border-transparent'}
                                `}
                            >
                                <Icon size={18} className={isActive ? 'text-osrs-gold' : 'text-gray-500'} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Flavor Text at bottom of sidebar */}
                <div className="mt-auto p-6 text-center opacity-30">
                    <img src="https://oldschool.runescape.wiki/images/Ultimate_Ironman_Chat_Badge.png" alt="UIM" className="w-8 h-8 mx-auto mb-2 grayscale" />
                    <p className="text-[10px] font-mono text-gray-500">Fate is absolute.</p>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1a1a1a] relative">
                <div className="p-8 max-w-4xl mx-auto">

                    {/* --- CORE RULES --- */}
                    {activeTab === 'core' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h1 className="text-3xl font-black text-white mb-2">Core Rules</h1>
                                <p className="text-gray-400 text-lg">The ultimate test of adaptability and fortune.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#222] p-6 rounded-xl border border-white/5">
                                    <h3 className="text-osrs-gold font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Skull size={18} /> The Constraint
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed text-sm">
                                        You play as an <b>Ultimate Ironman</b>. You cannot use banks.
                                        Furthermore, <b>all content is locked</b> by default.
                                    </p>
                                    <ul className="mt-4 space-y-2 text-sm text-gray-400 list-disc list-inside">
                                        <li>You cannot equip items (unless tier unlocked).</li>
                                        <li>You cannot enter regions (unless unlocked).</li>
                                        <li>You cannot train skills past Level 1 (unless unlocked).</li>
                                        <li>You cannot use travel networks (unless unlocked).</li>
                                    </ul>
                                </div>
                                <div className="bg-[#222] p-6 rounded-xl border border-white/5">
                                    <h3 className="text-green-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Activity size={18} /> The Game Loop
                                    </h3>
                                    <ol className="space-y-4 text-sm text-gray-300">
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center font-bold border border-green-500/20">1</span>
                                            <span><b>Complete a Task:</b> Finish a quest, complete a diary step, or level up a skill.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold border border-blue-500/20">2</span>
                                            <span><b>Roll for Keys:</b> Use the dashboard to roll. Higher difficulty tasks have better drop rates.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-osrs-gold/20 text-osrs-gold flex items-center justify-center font-bold border border-osrs-gold/20">3</span>
                                            <span><b>Unlock Content:</b> Spend Keys to randomly unlock Skills, Equipment Slots, Regions, and more.</span>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                             <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2">Victory Condition</h3>
                                <p className="text-sm text-gray-400">
                                    There is no single end. Set your own goals. Common goals include:
                                    <span className="text-gray-200"> Maxing</span>,
                                    <span className="text-gray-200"> Quest Cape</span>, or
                                    <span className="text-gray-200"> Inferno</span>.
                                </p>
                             </div>
                        </div>
                    )}

                    {/* --- DROPS & RNG --- */}
                    {activeTab === 'drops' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                             <div>
                                <h1 className="text-3xl font-black text-white mb-2">RNG & Drop Rates</h1>
                                <p className="text-gray-400">How to obtain the Keys of Fate.</p>
                            </div>

                            <div className="bg-[#222] rounded-xl border border-white/5 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#111] text-gray-400 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Activity Source</th>
                                            <th className="p-4">Drop Rate</th>
                                            <th className="p-4">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800 text-gray-300">
                                        <tr>
                                            <td className="p-4 font-bold text-white">Quests</td>
                                            <td className="p-4">25% - 100%</td>
                                            <td className="p-4 text-gray-500">Based on difficulty (Novice to GM). GM Quests have bonus Omni chance.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Diaries / CAs</td>
                                            <td className="p-4">2% - 100%</td>
                                            <td className="p-4 text-gray-500">Combat Achievements scale heavily with tier.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Clue Scrolls</td>
                                            <td className="p-4">5% - 100%</td>
                                            <td className="p-4 text-gray-500">Beginner (5%) to Master (100%).</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Level Ups</td>
                                            <td className="p-4">Variable</td>
                                            <td className="p-4 text-gray-500">Chance = Level / 3. (e.g. Level 30 = 10%, Level 99 = 33%).</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Slayer Tasks</td>
                                            <td className="p-4">20%</td>
                                            <td className="p-4 text-gray-500">Flat rate per task completion.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-black/20 p-4 rounded-lg border border-purple-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="text-purple-400" size={20} />
                                        <h4 className="font-bold text-purple-400">Omni-Key</h4>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        <b>2% Chance</b> on any successful roll.
                                        <br/><br/>
                                        Used to unlock a specific item of your choice, bypassing the RNG gacha.
                                    </p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-lg border border-red-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Dna className="text-red-400" size={20} />
                                        <h4 className="font-bold text-red-400">Chaos Key</h4>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Earned every <b>50 Total Levels</b>.
                                        <br/><br/>
                                        Unlocks a completely random item from ANY table in the game. You cannot choose the category.
                                    </p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-lg border border-osrs-pity/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="text-osrs-pity" size={20} />
                                        <h4 className="font-bold text-osrs-pity">Pity System</h4>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Each failed roll grants +1 Fate Point.
                                        <br/><br/>
                                        At <b>50 Points</b>, your next failure is converted into a guaranteed Key.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- THE ALTAR --- */}
                    {activeTab === 'altar' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                             <div>
                                <h1 className="text-3xl font-black text-white mb-2">The Void Altar</h1>
                                <p className="text-gray-400">Sacrifice your Fate Points for power. Accessed via top-right menu.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-xl border border-blue-500/20 bg-blue-900/5 hover:bg-blue-900/10 transition-colors">
                                    <div className="flex justify-between mb-4">
                                        <h3 className="font-bold text-blue-400 flex items-center gap-2"><Dices size={18} /> Ritual of Clarity</h3>
                                        <span className="text-xs font-bold bg-blue-900/40 text-blue-200 px-2 py-1 rounded">15 FP</span>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        Grants <b>Advantage</b> on your next roll. The system rolls twice and takes the lower number (better result).
                                    </p>
                                    <p className="text-xs text-blue-300/60 mt-2 font-mono">Use for Grandmaster quests or high-value low-chance rolls.</p>
                                </div>

                                <div className="p-6 rounded-xl border border-yellow-500/20 bg-yellow-900/5 hover:bg-yellow-900/10 transition-colors">
                                    <div className="flex justify-between mb-4">
                                        <h3 className="font-bold text-yellow-400 flex items-center gap-2"><Coins size={18} /> Ritual of Greed</h3>
                                        <span className="text-xs font-bold bg-yellow-900/40 text-yellow-200 px-2 py-1 rounded">20 FP</span>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        <b>Gamble.</b> If your NEXT roll is successful, you receive <b>2 Keys</b>. If it fails, the points are wasted.
                                    </p>
                                    <p className="text-xs text-yellow-300/60 mt-2 font-mono">High risk, high reward. Best used on high % chance tasks.</p>
                                </div>

                                <div className="p-6 rounded-xl border border-red-500/20 bg-red-900/5 hover:bg-red-900/10 transition-colors">
                                    <div className="flex justify-between mb-4">
                                        <h3 className="font-bold text-red-400 flex items-center gap-2"><Dna size={18} /> Ritual of Chaos</h3>
                                        <span className="text-xs font-bold bg-red-900/40 text-red-200 px-2 py-1 rounded">25 FP</span>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        Manifests your misfortune into a physical form. Instantly grants <b>1 Chaos Key</b>.
                                    </p>
                                    <p className="text-xs text-red-300/60 mt-2 font-mono">Guaranteed reward, but the reward itself is random.</p>
                                </div>

                                <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-900/5 hover:bg-purple-900/10 transition-colors">
                                    <div className="flex justify-between mb-4">
                                        <h3 className="font-bold text-purple-400 flex items-center gap-2"><Sparkles size={18} /> Transmutation</h3>
                                        <span className="text-xs font-bold bg-purple-900/40 text-purple-200 px-2 py-1 rounded">5 Keys</span>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        Fuses 5 standard Keys into <b>1 Omni-Key</b>.
                                    </p>
                                    <p className="text-xs text-purple-300/60 mt-2 font-mono">Expensive, but useful for sniping specific unlocks like Herblore or Morytania.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- UNLOCK SYSTEMS --- */}
                    {activeTab === 'unlocks' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                             <div>
                                <h1 className="text-3xl font-black text-white mb-2">Unlock Systems</h1>
                                <p className="text-gray-400">Understanding how different categories function.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="border-l-4 border-blue-500 pl-4 py-1">
                                    <h3 className="text-lg font-bold text-blue-400">Skills (Tiered System)</h3>
                                    <p className="text-sm text-gray-300 mt-1">
                                        Skills are not fully unlocked instantly. They have level caps.
                                    </p>
                                    <div className="mt-3 grid grid-cols-2 gap-4 text-xs font-mono text-gray-400">
                                        <div className="bg-black/30 p-2 rounded">Tier 1-9: Level Caps (10, 20... 90)</div>
                                        <div className="bg-black/30 p-2 rounded">Tier 10: Unlocked (Level 99)</div>
                                    </div>
                                    <div className="mt-2 text-xs text-osrs-gold">
                                        Cost: 1 Key (Tiers 1-7). 2 Keys (Tiers 8-10).
                                    </div>
                                </div>

                                <div className="border-l-4 border-emerald-500 pl-4 py-1">
                                    <h3 className="text-lg font-bold text-emerald-400">Regions (Binary System)</h3>
                                    <p className="text-sm text-gray-300 mt-1">
                                        You cannot enter a region until it is unlocked.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 italic">
                                        *Exception: You may traverse a locked region ONLY if it is the sole path to an unlocked region or task, and you must not interact with anything in the locked region.
                                    </p>
                                </div>

                                <div className="border-l-4 border-amber-500 pl-4 py-1">
                                    <h3 className="text-lg font-bold text-amber-400">Mobility & Housing</h3>
                                    <p className="text-sm text-gray-300 mt-1">
                                        Transport methods (Spirit Trees, Fairy Rings) and POH Rooms must be unlocked individually.
                                    </p>
                                </div>

                                <div className="border-l-4 border-violet-500 pl-4 py-1">
                                    <h3 className="text-lg font-bold text-violet-400">Arcana</h3>
                                    <p className="text-sm text-gray-300 mt-1">
                                        Spellbooks (Ancients, Lunar) and Prayer Books (Piety, Rigour) are locked.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- EQUIPMENT TIERS --- */}
                    {activeTab === 'equipment' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                             <div>
                                <h1 className="text-3xl font-black text-white mb-2">Equipment Tiers</h1>
                                <p className="text-gray-400">
                                    Slots have Tiers 0-9. You define what items fit these tiers based on stats/rarity.
                                    <br/>
                                    <span className="text-xs opacity-60">This is a recommended guide. Adjust for your own fun.</span>
                                </p>
                            </div>

                            <div className="bg-[#222] rounded-xl border border-white/5 overflow-hidden">
                               <table className="w-full text-left text-sm border-collapse">
                                  <thead>
                                    <tr className="bg-[#111] text-gray-400 text-xs uppercase border-b border-gray-700">
                                      <th className="p-4">Tier</th>
                                      <th className="p-4">Melee</th>
                                      <th className="p-4">Ranged</th>
                                      <th className="p-4">Magic</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-800 text-gray-300">
                                     <tr className="bg-black/10"><td className="p-4 font-mono text-gray-500 font-bold">Tier 1</td><td>Bronze / Iron</td><td>Standard Bow / Leather</td><td>Strike Spells / Robes</td></tr>
                                     <tr><td className="p-4 font-mono text-gray-500 font-bold">Tier 2</td><td>Steel / Mithril</td><td>Oak / Studded</td><td>Bolt Spells</td></tr>
                                     <tr className="bg-black/10"><td className="p-4 font-mono text-gray-500 font-bold">Tier 3</td><td>Adamant</td><td>Willow / Frog-leather</td><td>Blast Spells</td></tr>
                                     <tr><td className="p-4 font-mono text-gray-500 font-bold">Tier 4</td><td>Rune / Granite</td><td>Maple / Green D'hide</td><td>Mystic / Splitbark</td></tr>
                                     <tr className="bg-black/10"><td className="p-4 font-mono text-gray-500 font-bold">Tier 5</td><td>Dragon</td><td>Yew / Blue D'hide</td><td>Wave Spells / Ancient Staff</td></tr>
                                     <tr><td className="p-4 font-mono text-gray-500 font-bold">Tier 6</td><td>Barrows / Obsidian</td><td>Magic / Red D'hide</td><td>Iban's / Infinity</td></tr>
                                     <tr className="bg-black/10"><td className="p-4 font-mono text-gray-500 font-bold">Tier 7</td><td>Bandos / Godswords</td><td>Black D'hide / Karil's</td><td>Ahrim's / Trident</td></tr>
                                     <tr><td className="p-4 font-mono text-gray-500 font-bold">Tier 8</td><td>Torva / Scythe / Prims</td><td>Armadyl / Bowfa</td><td>Virtus / Sang Staff</td></tr>
                                     <tr className="bg-osrs-gold/10"><td className="p-4 font-mono text-osrs-gold font-bold">Tier 9</td><td className="text-osrs-gold">BiS / Raids Mega-Rares</td><td className="text-osrs-gold">Twisted Bow / Masori</td><td className="text-osrs-gold">Ancestral / Shadow</td></tr>
                                  </tbody>
                               </table>
                            </div>
                        </div>
                    )}

                    {/* --- STORAGE --- */}
                    {activeTab === 'storage' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                             <div>
                                <h1 className="text-3xl font-black text-white mb-2">UIM Storage</h1>
                                <p className="text-gray-400">Inventory space is your lifeblood. Unlock these to survive.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-[#222] p-4 rounded-lg border border-white/5 flex flex-col items-center text-center">
                                    <img src="https://oldschool.runescape.wiki/images/Looting_bag.png" className="w-10 h-10 mb-2 object-contain" alt="" />
                                    <span className="font-bold text-gray-200 text-sm">Looting Bag</span>
                                </div>
                                <div className="bg-[#222] p-4 rounded-lg border border-white/5 flex flex-col items-center text-center">
                                    <img src="https://oldschool.runescape.wiki/images/Rune_pouch.png" className="w-10 h-10 mb-2 object-contain" alt="" />
                                    <span className="font-bold text-gray-200 text-sm">Rune Pouch</span>
                                </div>
                                <div className="bg-[#222] p-4 rounded-lg border border-white/5 flex flex-col items-center text-center">
                                    <img src="https://oldschool.runescape.wiki/images/Seed_box.png" className="w-10 h-10 mb-2 object-contain" alt="" />
                                    <span className="font-bold text-gray-200 text-sm">Seed Box</span>
                                </div>
                                <div className="bg-[#222] p-4 rounded-lg border border-white/5 flex flex-col items-center text-center">
                                    <img src="https://oldschool.runescape.wiki/images/Herb_sack.png" className="w-10 h-10 mb-2 object-contain" alt="" />
                                    <span className="font-bold text-gray-200 text-sm">Herb Sack</span>
                                </div>
                                <div className="bg-[#222] p-4 rounded-lg border border-white/5 flex flex-col items-center text-center">
                                    <img src="https://oldschool.runescape.wiki/images/Gem_bag.png" className="w-10 h-10 mb-2 object-contain" alt="" />
                                    <span className="font-bold text-gray-200 text-sm">Gem Bag</span>
                                </div>
                                <div className="bg-[#222] p-4 rounded-lg border border-white/5 flex flex-col items-center text-center">
                                    <img src="https://oldschool.runescape.wiki/images/Fish_barrel.png" className="w-10 h-10 mb-2 object-contain" alt="" />
                                    <span className="font-bold text-gray-200 text-sm">Fish Barrel</span>
                                </div>
                                <div className="bg-[#222] p-4 rounded-lg border border-white/5 flex flex-col items-center text-center">
                                    <img src="https://oldschool.runescape.wiki/images/Tackle_box.png" className="w-10 h-10 mb-2 object-contain" alt="" />
                                    <span className="font-bold text-gray-200 text-sm">Tackle Box</span>
                                </div>
                                <div className="bg-[#222] p-4 rounded-lg border border-white/5 flex flex-col items-center text-center">
                                    <img src="https://oldschool.runescape.wiki/images/Coal_bag.png" className="w-10 h-10 mb-2 object-contain" alt="" />
                                    <span className="font-bold text-gray-200 text-sm">Coal Bag</span>
                                </div>
                            </div>

                            <div className="bg-black/30 p-4 rounded border border-white/10 text-sm text-gray-500 italic">
                                Note: Cosmetic storage (POH Costume Room) is unlocked via the Housing table, not Storage.
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
