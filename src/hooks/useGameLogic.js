import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

// --- Data Constants ---

const INITIAL_GEAR_SLOTS = [
  'Head', 'Cape', 'Neck', 'Ammo', 'Weapon', 'Body', 'Shield', 'Legs', 'Hands', 'Feet', 'Ring'
];

const INITIAL_SKILLS = [
  'Attack', 'Strength', 'Defence', 'Ranged', 'Prayer', 'Magic', 'Runecraft', 'Construction',
  'Agility', 'Herblore', 'Thieving', 'Crafting', 'Fletching', 'Slayer', 'Hunter', 'Mining',
  'Smithing', 'Fishing', 'Cooking', 'Firemaking', 'Woodcutting', 'Farming', 'Hitpoints'
];

const INITIAL_REGIONS = [
  'Misthalin', 'Asgarnia', 'Kharidian Desert', 'Kandarin', 'Morytania', 'Fremennik',
  'Tirannwn', 'Wilderness', 'Kourend', 'Karamja'
];

// Helper to init state with locked/unlocked
const createInitialState = (items, unlockedItems = []) => {
  return items.map(name => ({
    name,
    isUnlocked: unlockedItems.includes(name)
  }));
};

const STORAGE_KEY = 'osrs-fate-locked-save-v1';

export const useGameLogic = () => {
  // --- State ---
  const [keyCount, setKeyCount] = useState(0);
  const [fatePoints, setFatePoints] = useState(0);

  const [gearSlots, setGearSlots] = useState(() => createInitialState(INITIAL_GEAR_SLOTS));
  const [skills, setSkills] = useState(() => createInitialState(INITIAL_SKILLS));
  const [regions, setRegions] = useState(() => createInitialState(INITIAL_REGIONS, ['Misthalin']));

  // --- Persistence ---

  // Load on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setKeyCount(parsed.keyCount ?? 0);
        setFatePoints(parsed.fatePoints ?? 0);
        setGearSlots(parsed.gearSlots ?? createInitialState(INITIAL_GEAR_SLOTS));
        setSkills(parsed.skills ?? createInitialState(INITIAL_SKILLS));
        setRegions(parsed.regions ?? createInitialState(INITIAL_REGIONS, ['Misthalin']));
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  // Save on change
  useEffect(() => {
    const stateToSave = {
      keyCount,
      fatePoints,
      gearSlots,
      skills,
      regions
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [keyCount, fatePoints, gearSlots, skills, regions]);


  // --- Logic ---

  const addKey = (amount = 1) => {
    setKeyCount(prev => prev + amount);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffff00', '#ffd700'] // Gold colors
    });
  };

  const handleRollResult = (success, activityName) => {
    if (success) {
      setFatePoints(0);
      addKey(1);
      return { success: true, message: `Success! Key found from ${activityName}.` };
    } else {
      let newFate = fatePoints + 1;
      let msg = `Failed roll. Fate Points: ${newFate}/50`;

      if (newFate >= 50) {
        setFatePoints(0);
        addKey(1);
        msg = "Fate Pity Reached! Free Key granted.";
        return { success: true, message: msg }; // Technically a success due to pity
      } else {
        setFatePoints(newFate);
        return { success: false, message: msg };
      }
    }
  };

  const rollForKey = (activityType, value) => {
    let chance = 0;

    switch (activityType) {
      case 'QUEST':
        if (value === 'short') chance = 25;
        else if (value === 'long') chance = 50;
        else if (value === 'grandmaster') chance = 100;
        break;
      case 'COMBAT_ACHIEVEMENT':
        if (value === 'easy') chance = 5;
        else if (value === 'medium') chance = 10;
        else if (value === 'hard') chance = 20;
        else if (value === 'elite') chance = 50;
        break;
      case 'LEVEL_UP':
        // Value is current level (1-99)
        // Chance is value% (if level 50, 50% chance)
        chance = Math.min(Math.max(parseInt(value) || 1, 1), 99);
        break;
      case 'COLLECTION_LOG':
        chance = 5;
        break;
      default:
        console.warn("Unknown activity type");
        return { success: false, message: "Error: Unknown activity" };
    }

    const roll = Math.random() * 100;
    const isSuccess = roll <= chance;

    // For debugging
    console.log(`Rolled for ${activityType} (${value}): Chance ${chance}%, Roll ${roll.toFixed(2)}, Success: ${isSuccess}`);

    return handleRollResult(isSuccess, activityType);
  };

  const unlockItem = (tableType) => {
    if (keyCount <= 0) return { success: false, message: "No keys available!" };

    let items, setItems;
    if (tableType === 'GEAR') {
      items = gearSlots;
      setItems = setGearSlots;
    } else if (tableType === 'SKILLS') {
      items = skills;
      setItems = setSkills;
    } else if (tableType === 'REGIONS') {
      items = regions;
      setItems = setRegions;
    } else {
      return { success: false, message: "Invalid table selected" };
    }

    const lockedItems = items.filter(i => !i.isUnlocked);

    if (lockedItems.length === 0) {
      return { success: false, message: "All items in this category are already unlocked!" };
    }

    const randomIndex = Math.floor(Math.random() * lockedItems.length);
    const itemToUnlock = lockedItems[randomIndex];

    // Update state
    setItems(prevItems => prevItems.map(item =>
      item.name === itemToUnlock.name ? { ...item, isUnlocked: true } : item
    ));

    setKeyCount(prev => prev - 1);

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });

    return { success: true, message: `Unlocked: ${itemToUnlock.name}`, item: itemToUnlock.name };
  };

  // Reset function (optional, useful for dev or user reset)
  const resetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      setKeyCount(0);
      setFatePoints(0);
      setGearSlots(createInitialState(INITIAL_GEAR_SLOTS));
      setSkills(createInitialState(INITIAL_SKILLS));
      setRegions(createInitialState(INITIAL_REGIONS, ['Misthalin']));
    }
  };

  return {
    keyCount,
    fatePoints,
    gearSlots,
    skills,
    regions,
    rollForKey,
    unlockItem,
    resetProgress
  };
};
