import React, { useState } from 'react';
import { Button, Card } from './ui/BaseComponents';
import { Scroll, Sword, ArrowUpCircle, BookOpen } from 'lucide-react';

const ActionPanel = ({ onRoll }) => {
  const [levelInput, setLevelInput] = useState('');

  const handleLevelRoll = () => {
    const lvl = parseInt(levelInput);
    if (!lvl || lvl < 1 || lvl > 99) {
      alert("Please enter a valid level (1-99)");
      return;
    }
    onRoll('LEVEL_UP', lvl);
    setLevelInput('');
  };

  return (
    <Card title="Earn Keys" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quest Section */}
        <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2 text-osrs-gold">
            <Scroll size={20} />
            <span className="font-bold">Quests</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onRoll('QUEST', 'novice')} className="flex-1 text-xs">Novice (20%)</Button>
            <Button onClick={() => onRoll('QUEST', 'intermediate')} className="flex-1 text-xs">Interm. (35%)</Button>
            <Button onClick={() => onRoll('QUEST', 'experienced')} className="flex-1 text-xs">Exper. (50%)</Button>
            <Button onClick={() => onRoll('QUEST', 'master')} className="flex-1 text-xs">Master (80%)</Button>
            <Button onClick={() => onRoll('QUEST', 'grandmaster')} className="w-full text-xs">Grandmaster (100%)</Button>
          </div>
        </div>

        {/* Combat Achievements */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2 text-osrs-gold">
            <Sword size={20} />
            <span className="font-bold">Combat Achievements</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => onRoll('COMBAT_ACHIEVEMENT', 'easy')}>Easy (5%)</Button>
            <Button onClick={() => onRoll('COMBAT_ACHIEVEMENT', 'medium')}>Med (10%)</Button>
            <Button onClick={() => onRoll('COMBAT_ACHIEVEMENT', 'hard')}>Hard (20%)</Button>
            <Button onClick={() => onRoll('COMBAT_ACHIEVEMENT', 'elite')}>Elite (50%)</Button>
          </div>
        </div>

        {/* Level Up */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2 text-osrs-gold">
            <ArrowUpCircle size={20} />
            <span className="font-bold">Level Up</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Lvl (1-99)"
              className="w-28 bg-black/30 border border-gray-600 rounded px-2 py-1 text-white focus:border-osrs-gold outline-none text-sm"
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              min="1"
              max="99"
            />
            <Button onClick={handleLevelRoll} className="flex-1">Roll</Button>
          </div>
          <p className="text-xs text-gray-500">Chance = Current Level %</p>
        </div>

        {/* Collection Log */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2 text-osrs-gold">
            <BookOpen size={20} />
            <span className="font-bold">Collection Log</span>
          </div>
          <Button onClick={() => onRoll('COLLECTION_LOG')} className="w-full h-12">
            New Item (5%)
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ActionPanel;
