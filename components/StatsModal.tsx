
import React, { useMemo } from 'react';
import { LogEntry } from '../types';
import { X, TrendingUp, TrendingDown, Skull, Key, Sparkles, Activity, Shield } from 'lucide-react';

interface StatsModalProps {
  history: LogEntry[];
  keysFound: number; // Total raw keys (excluding pity?) We can calculate from history
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ history, onClose }) => {
  const stats = useMemo(() => {
    // Filter only manual rolls (ignore auto-pity logs if they don't have rollValue)
    const rolls = history.filter(h => h.type === 'ROLL');

    const totalRolls = rolls.length;

    // Calculate Actual Successes (Keys found via RNG)
    const actualSuccesses = rolls.filter(h => h.result === 'SUCCESS').length;

    // Calculate Pity Keys
    const pityKeys = history.filter(h => h.type === 'PITY').length;

    // Calculate Expected Successes (Sum of all probabilities)
    // If you roll a 20% chance 5 times, you "expect" 1 key.
    const expectedSuccesses = rolls.reduce((acc, curr) => {
      return acc + ((curr.threshold || 0) / 100);
    }, 0);

    // Luck Score: Positive means lucky, Negative means unlucky
    const luckScore = actualSuccesses - expectedSuccesses;
    const luckPercent = expectedSuccesses > 0 ? ((actualSuccesses - expectedSuccesses) / expectedSuccesses) * 100 : 0;

    // Longest Dry Streak calculation
    let currentDry = 0;
    let maxDry = 0;
    rolls.slice().reverse().forEach(roll => { // Process oldest to newest
       if (roll.result === 'FAIL') {
         currentDry++;
       } else {
         if (currentDry > maxDry) maxDry = currentDry;
         currentDry = 0;
       }
    });
    // Check final streak
    if (currentDry > maxDry) maxDry = currentDry;

    // Current Dry Streak (from most recent backwards)
    let activeDryStreak = 0;
    for (const roll of rolls) { // history is usually appended, so [0] is oldest? LogViewer renders newest first but stores append.
        // Actually App.tsx appends to end. So last element is newest.
        // We need to iterate backwards from end.
        break;
    }
    // Re-check iteration order from App.tsx: setHistory(prev => [...prev, new])
    // So last index is newest.
    for (let i = rolls.length - 1; i >= 0; i--) {
        if (rolls[i].result === 'FAIL') activeDryStreak++;
        else break;
    }

    return {
      totalRolls,
      actualSuccesses,
      pityKeys,
      expectedSuccesses,
      luckScore,
      luckPercent,
      maxDry,
      activeDryStreak
    };
  }, [history]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1e1e1e] border border-osrs-border w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-[#2d2d2d] p-4 border-b border-osrs-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/30 rounded border border-blue-500/30">
                <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-100">Fate Analytics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

          {/* Top Row: Luck Meter */}
          <div className="bg-black/30 rounded-lg p-6 border border-white/5 text-center relative overflow-hidden">
             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Luck Deviation</h3>

             <div className="flex items-center justify-center gap-4 mb-4">
                {stats.luckScore >= 0 ? (
                    <TrendingUp className="w-12 h-12 text-green-500" />
                ) : (
                    <TrendingDown className="w-12 h-12 text-red-500" />
                )}
                <div className="text-5xl font-black text-white tracking-tight">
                    {stats.luckScore > 0 ? '+' : ''}{stats.luckScore.toFixed(2)}
                </div>
             </div>

             <p className={`text-sm font-mono ${stats.luckScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                You have found <b>{Math.abs(stats.luckScore).toFixed(2)}</b> {stats.luckScore >= 0 ? 'more' : 'fewer'} keys than average.
             </p>

             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20"></div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {/* Total Rolls */}
             <div className="bg-[#252525] p-4 rounded border border-white/5 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 font-bold uppercase mb-1">Total Rolls</span>
                <span className="text-2xl font-bold text-white">{stats.totalRolls}</span>
             </div>

             {/* Raw Successes */}
             <div className="bg-[#252525] p-4 rounded border border-white/5 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 font-bold uppercase mb-1">RNG Keys</span>
                <span className="text-2xl font-bold text-osrs-gold flex items-center gap-2">
                    <Key size={16} /> {stats.actualSuccesses}
                </span>
             </div>

             {/* Pity Keys */}
             <div className="bg-[#252525] p-4 rounded border border-white/5 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 font-bold uppercase mb-1">Pity Keys</span>
                <span className="text-2xl font-bold text-osrs-pity flex items-center gap-2">
                    <Shield size={16} /> {stats.pityKeys}
                </span>
             </div>

             {/* Dry Streak */}
             <div className="bg-[#252525] p-4 rounded border border-white/5 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 font-bold uppercase mb-1">Max Dry Streak</span>
                <span className="text-2xl font-bold text-red-400 flex items-center gap-2">
                    <Skull size={16} /> {stats.maxDry}
                </span>
             </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700 pb-2">Technical Details</h3>

            <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Expected Keys (Math):</span>
                    <span className="text-gray-300">{stats.expectedSuccesses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Actual Keys (RNG):</span>
                    <span className="text-gray-300">{stats.actualSuccesses}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Luck Percentage:</span>
                    <span className={stats.luckPercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {stats.luckPercent > 0 ? '+' : ''}{stats.luckPercent.toFixed(1)}%
                    </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-800 pt-2 mt-2">
                    <span className="text-gray-500">Current Dry Streak:</span>
                    <span className="text-white">{stats.activeDryStreak} rolls</span>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
