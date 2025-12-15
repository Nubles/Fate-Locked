import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

// --- Data Constants ---

const INITIAL_GEAR_SLOTS = [
  'Head', 'Cape', 'Neck', 'Ammo', 'Weapon', 'Body', 'Shield', 'Legs', 'Hands', 'Feet', 'Ring'
];

const INITIAL_SKILLS = [
  'Attack', 'Strength', 'Defence', 'Ranged', 'Prayer', 'Magic', 'Runecraft', 'Construction',
  'Agility', 'Herblore', 'Thieving', 'Crafting', 'Fletching', 'Slayer', 'Hunter', 'Mining',
  'Smithing', 'Fishing', 'Cooking', 'Firemaking', 'Woodcutting', 'Farming', 'Hitpoints', 'Sailing'
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

const createInitialSkillLevels = () => {
  const levels = {};
  INITIAL_SKILLS.forEach(skill => {
    levels[skill] = skill === 'Hitpoints' ? 10 : 1;
  });
  return levels;
};

const STORAGE_KEY = 'osrs-fate-locked-save-v1';

export const useGameLogic = () => {
  // --- State ---
  const [keyCount, setKeyCount] = useState(0);
  const [fatePoints, setFatePoints] = useState(0);

  const [gearSlots, setGearSlots] = useState(() => createInitialState(INITIAL_GEAR_SLOTS));
  const [skills, setSkills] = useState(() => createInitialState(INITIAL_SKILLS));
  const [regions, setRegions] = useState(() => createInitialState(INITIAL_REGIONS, ['Misthalin']));

  // New state for API Sync
  const [rsn, setRsn] = useState("");
  const [skillLevels, setSkillLevels] = useState(() => createInitialSkillLevels());
  const [clogScore, setClogScore] = useState(0);

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

        // Load sync data or defaults
        setRsn(parsed.rsn ?? "");
        setSkillLevels(parsed.skillLevels ?? createInitialSkillLevels());
        setClogScore(parsed.clogScore ?? 0);
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
      regions,
      rsn,
      skillLevels,
      clogScore
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [keyCount, fatePoints, gearSlots, skills, regions, rsn, skillLevels, clogScore]);


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
        if (value === 'novice') chance = 20;
        else if (value === 'intermediate') chance = 35;
        else if (value === 'experienced') chance = 50;
        else if (value === 'master') chance = 80;
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

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      setKeyCount(0);
      setFatePoints(0);
      setGearSlots(createInitialState(INITIAL_GEAR_SLOTS));
      setSkills(createInitialState(INITIAL_SKILLS));
      setRegions(createInitialState(INITIAL_REGIONS, ['Misthalin']));
      setRsn("");
      setSkillLevels(createInitialSkillLevels());
      setClogScore(0);
    }
  };

  // --- API Sync Logic ---

  const fetchStats = async (username) => {
    if (!username) return { success: false, message: "Please enter a username" };
    try {
      // Using WiseOldMan API
      const response = await fetch(`https://api.wiseoldman.net/v2/players/${username}`);
      if (!response.ok) {
        throw new Error("Player not found or API error");
      }
      const data = await response.json();
      return { success: true, data: data };
    } catch (err) {
      return { success: false, message: err.message || "Failed to fetch stats" };
    }
  };

  const calculateSyncDiff = (apiData) => {
    const changes = {
      levels: {},
      clog: 0
    };

    // Check Skills
    if (apiData.latestSnapshot && apiData.latestSnapshot.data && apiData.latestSnapshot.data.skills) {
      const apiSkills = apiData.latestSnapshot.data.skills;

      INITIAL_SKILLS.forEach(skillName => {
        // WiseOldMan keys are lowercase, usually. e.g. 'attack'
        // But 'Sailing' might be tricky if not yet fully standard, currently it is 'sailing' in WOM if active
        // Or Runecraft might be 'runecrafting'
        let apiSkillKey = skillName.toLowerCase();
        if (apiSkillKey === 'runecraft') apiSkillKey = 'runecrafting';

        if (apiSkills[apiSkillKey]) {
            const apiLevel = apiSkills[apiSkillKey].level;
            const currentLevel = skillLevels[skillName];

            if (apiLevel > currentLevel) {
                changes.levels[skillName] = { from: currentLevel, to: apiLevel };
            }
        }
      });

      // Check Collection Log
      // WOM: data.latestSnapshot.data.activities.collections_logged.score
      // Note: older snapshots might not have it.
      if (apiData.latestSnapshot.data.activities && apiData.latestSnapshot.data.activities.collections_logged) {
        const apiClog = apiData.latestSnapshot.data.activities.collections_logged.score;
        if (apiClog > clogScore && apiClog > -1) {
            changes.clog = apiClog - clogScore;
            changes.newClogScore = apiClog;
        }
      }
    }

    return changes;
  };

  const processSync = (changes) => {
    let keysWon = 0;
    let currentFate = fatePoints;
    let newSkillLevels = { ...skillLevels };
    let newClogScore = clogScore;

    // Process Levels
    Object.entries(changes.levels).forEach(([skillName, { from, to }]) => {
      for (let lvl = from + 1; lvl <= to; lvl++) {
        // Roll for Level Up (Chance = lvl%)
        const chance = Math.min(Math.max(lvl, 1), 99);
        const roll = Math.random() * 100;

        if (roll <= chance) {
          keysWon++;
          currentFate = 0;
        } else {
          currentFate++;
          if (currentFate >= 50) {
            keysWon++;
            currentFate = 0;
          }
        }
      }
      newSkillLevels[skillName] = to;
    });

    // Process Clog
    if (changes.clog > 0) {
        for (let i = 0; i < changes.clog; i++) {
            // Chance fixed 5%
            const roll = Math.random() * 100;
            if (roll <= 5) {
                keysWon++;
                currentFate = 0;
            } else {
                currentFate++;
                if (currentFate >= 50) {
                    keysWon++;
                    currentFate = 0;
                }
            }
        }
        newClogScore = changes.newClogScore;
    }

    // Apply updates
    setKeyCount(prev => prev + keysWon);
    setFatePoints(currentFate);
    setSkillLevels(newSkillLevels);
    if (changes.clog > 0) setClogScore(newClogScore);

    if (keysWon > 0) {
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 },
            colors: ['#ffff00', '#ffd700']
        });
    }

    return {
        success: true,
        message: `Sync Complete! Won ${keysWon} Keys. Fate Points: ${currentFate}.`
    };
  };

  return {
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
    processSync
  };
};
