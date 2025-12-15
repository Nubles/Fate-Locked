import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/BaseComponents';
import { Shirt, Book, Map } from 'lucide-react';

const GachaModal = ({ isOpen, onClose, onUnlock, keyCount }) => {
  const [isRolling, setIsRolling] = useState(false);

  const handleUnlock = async (type) => {
    setIsRolling(true);
    // Simulate animation delay
    await new Promise(r => setTimeout(r, 800));
    onUnlock(type);
    setIsRolling(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Spend a Key">
      <div className="text-center mb-6">
        <p className="text-gray-300 mb-2">Choose which table to unlock a random item from.</p>
        <p className="text-sm text-osrs-gold">Current Keys: {keyCount}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="primary"
          className="h-16 flex items-center justify-center gap-3 text-lg"
          onClick={() => handleUnlock('GEAR')}
          disabled={keyCount <= 0 || isRolling}
        >
          <Shirt /> Gear Slot
        </Button>
        <Button
          variant="primary"
          className="h-16 flex items-center justify-center gap-3 text-lg"
          onClick={() => handleUnlock('SKILLS')}
          disabled={keyCount <= 0 || isRolling}
        >
          <Book /> Skill
        </Button>
        <Button
          variant="primary"
          className="h-16 flex items-center justify-center gap-3 text-lg"
          onClick={() => handleUnlock('REGIONS')}
          disabled={keyCount <= 0 || isRolling}
        >
          <Map /> Region
        </Button>
      </div>

      {isRolling && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-10">
          <div className="text-osrs-gold font-bold text-xl animate-pulse">Rolling...</div>
        </div>
      )}
    </Modal>
  );
};

export default GachaModal;
