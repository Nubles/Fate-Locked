import React, { useState } from 'react';
import Header from './components/Header';
import ActionPanel from './components/ActionPanel';
import UnlockTracker from './components/UnlockTracker';
import GachaModal from './components/GachaModal';
import SyncModal from './components/SyncModal';
import { Button } from './components/ui/BaseComponents';
import { Toast } from './components/ui/Toast';
import { useGameLogic } from './hooks/useGameLogic';
import { Key, RotateCcw } from 'lucide-react';

function App() {
  const {
    keyCount,
    fatePoints,
    gearSlots,
    skills,
    regions,
    rsn,
    setRsn,
    rollForKey,
    unlockItem,
    resetProgress,
    fetchStats,
    calculateSyncDiff,
    processSync,
    skillLevels
  } = useGameLogic();

  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
  };

  const handleRoll = (type, value) => {
    const result = rollForKey(type, value);
    showToast(result.message, result.success ? 'success' : 'error');
  };

  const handleUnlock = (tableType) => {
    const result = unlockItem(tableType);
    showToast(result.message, result.success ? 'success' : 'error');
  };

  const handleProcessSync = (diff) => {
      const result = processSync(diff);
      // Wait a bit for modal to show success, then maybe toast?
      // Or just let modal handle it.
      // But we can show toast after modal closes or immediately.
      showToast(result.message, 'success');
      return result;
  };

  return (
    <div className="min-h-screen bg-osrs-bg text-osrs-text pb-20 font-sans selection:bg-osrs-gold selection:text-black">
      <Header
        keyCount={keyCount}
        fatePoints={fatePoints}
        onOpenSync={() => setIsSyncOpen(true)}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">

        {/* Top Actions */}
        <section>
             <ActionPanel onRoll={handleRoll} />
        </section>

        {/* Big Gacha Button */}
        <div className="flex justify-center my-8">
            <Button
                variant="gold"
                className="text-2xl px-12 py-6 rounded-full flex items-center gap-4 transform hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                onClick={() => setIsGachaOpen(true)}
                disabled={keyCount <= 0}
            >
                <Key size={32} />
                <span>SPEND KEY</span>
            </Button>
        </div>

        {/* Unlocks Grid */}
        <section>
             <UnlockTracker gearSlots={gearSlots} skills={skills} regions={regions} skillLevels={skillLevels} />
        </section>

        {/* Reset (Bottom) */}
        <div className="flex justify-center mt-12 opacity-50 hover:opacity-100 transition-opacity">
            <button
                onClick={resetProgress}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400"
            >
                <RotateCcw size={16} /> Reset Progress
            </button>
        </div>

      </main>

      {/* Modals & Overlays */}
      <GachaModal
        isOpen={isGachaOpen}
        onClose={() => setIsGachaOpen(false)}
        onUnlock={handleUnlock}
        keyCount={keyCount}
      />

      <SyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        rsn={rsn}
        setRsn={setRsn}
        fetchStats={fetchStats}
        calculateSyncDiff={calculateSyncDiff}
        processSync={handleProcessSync}
      />

      <Toast
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}

export default App;
