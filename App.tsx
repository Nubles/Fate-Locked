import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, LogEntry, TableType, UnlockState, DropSource } from './types';
import { EQUIPMENT_SLOTS, REGIONS_LIST, SKILLS_LIST, REGION_GROUPS, MISTHALIN_AREAS, MOBILITY_LIST, ARCANA_LIST, MINIGAMES_LIST, BOSSES_LIST, POH_LIST, MERCHANTS_LIST, STORAGE_LIST, EQUIPMENT_TIER_MAX, REGION_ICONS, SLOT_CONFIG, SPECIAL_ICONS, WIKI_OVERRIDES } from './constants';
import { ActionSection } from './components/ActionSection';
import { GachaSection } from './components/GachaSection';
import { Dashboard } from './components/Dashboard';
import { LogViewer } from './components/LogViewer';
import { FateMechanics } from './components/FateMechanics';
import { VoidReveal } from './components/VoidReveal';
import { StatsModal } from './components/StatsModal';
import { ReferenceModal } from './components/ReferenceModal';
import { VoidAltar } from './components/VoidAltar';
import { ShareModal } from './components/ShareModal';
import { TransmutationEffect } from './components/TransmutationEffect';
import { ClarityEffect, GreedEffect, ChaosEffect } from './components/RitualEffects';
import { Key, BookOpen, Dices, Shield, Skull, Sparkles, Download, Upload, Save, RotateCcw, BarChart3, HelpCircle, Orbit, Dna, Coins, Share2 } from 'lucide-react';

// --- Utils ---
const uuid = () => Math.random().toString(36).substr(2, 9);
const rollDice = (max: number = 100) => Math.floor(Math.random() * max) + 1;

const STORAGE_KEY = 'FATE_UIM_SAVE_V1';

const getInitialUnlocks = (): UnlockState => ({
  equipment: EQUIPMENT_SLOTS.reduce((acc, slot) => ({ ...acc, [slot]: 0 }), {} as Record<string, number>),
  skills: { 'Hitpoints': 1 },
  levels: SKILLS_LIST.reduce((acc, skill) => ({
    ...acc,
    [skill]: skill === 'Hitpoints' ? 10 : 1
  }), {} as Record<string, number>),
  regions: [],
  mobility: [],
  arcana: [],
  housing: [],
  merchants: [],
  minigames: [],
  bosses: [],
  storage: []
});

interface PendingUnlock {
  table: string;
  item: string;
  costType: 'key' | 'specialKey' | 'chaosKey';
  displayType: string;
  itemImage?: string;
  costAmount?: number;
}

interface Particle {
    id: string;
    x: number;
    y: number;
    type: 'key' | 'omni';
}

interface RollFeedback {
  id: string;
  x: number;
  y: number;
  roll: number;
  threshold: number;
  type: 'SUCCESS' | 'FAIL' | 'OMNI' | 'PITY';
}

const fetchWikiImage = async (pageName: string): Promise<string | null> => {
    try {
        const title = WIKI_OVERRIDES[pageName] || pageName;
        const res = await fetch(`https://oldschool.runescape.wiki/api.php?${new URLSearchParams({
            action: 'query', titles: title, prop: 'pageimages', format: 'json', pithumbsize: '600', origin: '*'
        }).toString()}`);
        const data = await res.json();
        const pages = data.query?.pages;
        if (!pages) return null;
        const pageId = Object.keys(pages)[0];
        if (pageId === '-1') return null;
        return pages[pageId].thumbnail?.source || null;
    } catch (e) {
        console.error("Wiki Image Fetch Error:", e);
        return null;
    }
};

const getUnlockImage = (table: string, item: string) => {
    const baseUrl = 'https://oldschool.runescape.wiki/images/';
    if (table === 'skill') return `${baseUrl}${item}_icon.png`;
    if (table === 'equipment') {
        const config = SLOT_CONFIG[item];
        return config ? `${baseUrl}${config.file}` : undefined;
    }
    if (table === 'region') return REGION_ICONS[item] ? `${baseUrl}${REGION_ICONS[item]}` : `${baseUrl}Globe_icon.png`;
    const specialIcon = SPECIAL_ICONS[item];
    return specialIcon ? `${baseUrl}${specialIcon}` : undefined;
}

function App() {
  const loadSaveData = (): Partial<GameState> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  };

  const savedData = loadSaveData();
  const [keys, setKeys] = useState<number>(savedData.keys ?? 3);
  const [specialKeys, setSpecialKeys] = useState<number>(savedData.specialKeys ?? 0);
  const [chaosKeys, setChaosKeys] = useState<number>(savedData.chaosKeys ?? 0);
  const [fatePoints, setFatePoints] = useState<number>(savedData.fatePoints ?? 0);

  // Clean up legacy buffs (PRESERVE) on load
  const initialBuff = (savedData.activeBuff as any) === 'PRESERVE' ? 'NONE' : (savedData.activeBuff as any) ?? 'NONE';
  const [activeBuff, setActiveBuff] = useState<'NONE' | 'LUCK' | 'GREED'>(initialBuff);

  const [unlocks, setUnlocks] = useState<UnlockState>(() => {
    const defaults = getInitialUnlocks();
    let initialUnlocks = {
        ...defaults,
        ...savedData.unlocks,
        equipment: { ...defaults.equipment, ...savedData.unlocks?.equipment },
        skills: { ...defaults.skills, ...savedData.unlocks?.skills },
        levels: { ...defaults.levels, ...savedData.unlocks?.levels },
        housing: savedData.unlocks?.housing ?? defaults.housing,
        merchants: savedData.unlocks?.merchants ?? defaults.merchants,
        storage: savedData.unlocks?.storage ?? defaults.storage,
    };

    // Migration: Power -> Arcana
    if ((savedData.unlocks as any)?.power) {
        initialUnlocks.arcana = (savedData.unlocks as any).power;
    }

    if (savedData.unlocks && (savedData.unlocks as any).content) {
       const legacyContent = (savedData.unlocks as any).content as string[];
       const newMinigames = new Set([...initialUnlocks.minigames]);
       const newBosses = new Set([...initialUnlocks.bosses]);
       legacyContent.forEach(item => {
           if (BOSSES_LIST.includes(item)) newBosses.add(item);
           else if (MINIGAMES_LIST.includes(item)) newMinigames.add(item);
       });
       initialUnlocks.minigames = Array.from(newMinigames);
       initialUnlocks.bosses = Array.from(newBosses);
    }
    return initialUnlocks;
  });
  const [history, setHistory] = useState<LogEntry[]>(savedData.history ?? []);
  const [pendingUnlock, setPendingUnlock] = useState<PendingUnlock | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [showAltar, setShowAltar] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [activeRitualAnim, setActiveRitualAnim] = useState<'NONE' | 'LUCK' | 'GREED' | 'CHAOS' | 'TRANSMUTE'>('NONE');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [rollFeedback, setRollFeedback] = useState<RollFeedback[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ keys, specialKeys, chaosKeys, fatePoints, unlocks, history, activeBuff }));
  }, [keys, specialKeys, chaosKeys, fatePoints, unlocks, history, activeBuff]);

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    setHistory(prev => [...prev, { ...entry, id: uuid(), timestamp: Date.now() }]);
  }, []);

  const spawnParticle = (x: number, y: number, type: 'key' | 'omni') => {
    const id = uuid();
    setParticles(prev => [...prev, { id, x, y, type }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  const spawnFeedback = (x: number, y: number, roll: number, threshold: number, type: 'SUCCESS' | 'FAIL' | 'OMNI' | 'PITY') => {
    const id = uuid();
    setRollFeedback(prev => [...prev, { id, x, y, roll, threshold, type }]);
    setTimeout(() => {
        setRollFeedback(prev => prev.filter(f => f.id !== id));
    }, 2000);
  };

  const processRoll = useCallback((source: string, threshold: number, event?: React.MouseEvent) => {
    let roll = rollDice(100);
    let advantageRoll = null;
    let buffUsed = false;
    let isGreedActive = activeBuff === 'GREED';

    // Apply Rituals
    if (activeBuff === 'LUCK') {
        advantageRoll = rollDice(100);
        // In this system, <= Threshold is success. So LOWER is better.
        roll = Math.min(roll, advantageRoll);
        setActiveBuff('NONE');
        buffUsed = true;
    } else if (activeBuff === 'GREED') {
        setActiveBuff('NONE'); // Consumed immediately on next roll attempt
        buffUsed = true;
    }

    const success = roll <= threshold;
    const clickX = event?.clientX ?? window.innerWidth / 2;
    const clickY = event?.clientY ?? window.innerHeight / 2;

    const rollMessage = buffUsed && advantageRoll !== null
        ? `Clarity Ritual! Rolled ${Math.max(roll, advantageRoll)} & ${roll} (Took ${roll})`
        : `Rolled ${roll}`;

    if (success) {
      let omniChance = 2; // Default 2% chance for most activities

      if (source === DropSource.QUEST_GRANDMASTER) omniChance = 20; // 20% for GM Quests
      else if (source === DropSource.DIARY_ELITE) omniChance = 10; // 10% for Elite Diaries

      const isRare = rollDice(100) <= omniChance;

      if (isRare) {
        setSpecialKeys(prev => prev + 1);
        spawnParticle(clickX, clickY, 'omni');
        spawnFeedback(clickX, clickY, roll, threshold, 'OMNI');
        addLog({
            type: 'ROLL',
            source,
            result: 'SUCCESS',
            message: `LEGENDARY DROP! You found an Omni-Key!`,
            details: `${rollMessage}. Critical Success! (1 in ${Math.round(100/omniChance)} chance)`,
            rollValue: roll,
            threshold
        });
      } else {
        const keysToAdd = isGreedActive ? 2 : 1;
        setKeys(prev => prev + keysToAdd);

        spawnParticle(clickX, clickY, 'key');
        if (isGreedActive) {
            setTimeout(() => spawnParticle(clickX + 20, clickY + 10, 'key'), 150); // Second key particle
        }

        spawnFeedback(clickX, clickY, roll, threshold, 'SUCCESS');

        const extraMsg = isGreedActive ? ' (Doubled by Greed!)' : '';
        addLog({
            type: 'ROLL',
            source,
            result: 'SUCCESS',
            message: `Key Found!${extraMsg} ${rollMessage} (needed ≤ ${threshold})`,
            details: 'Fate points reset to 0.',
            rollValue: roll,
            threshold
        });
      }

      setFatePoints(0);
    } else {
      setFatePoints(prev => {
        const newFate = prev + 1;
        if (newFate >= 50) {
          setKeys(k => k + 1);
          spawnParticle(clickX, clickY, 'key');
          spawnFeedback(clickX, clickY, roll, threshold, 'PITY');
          addLog({ type: 'ROLL', source, result: 'FAIL', message: `No Key. ${rollMessage} (needed ≤ ${threshold})`, details: 'MAX FATE REACHED! Pity Key granted.' });
          addLog({ type: 'PITY', message: 'The Fates take pity on you.', details: '+1 Key Added' });
          return 0;
        }
        spawnFeedback(clickX, clickY, roll, threshold, 'FAIL');

        const greedMsg = isGreedActive ? ' (Greed Ritual Wasted!)' : '';
        addLog({
            type: 'ROLL',
            source,
            result: 'FAIL',
            message: `No Key.${greedMsg} ${rollMessage} (needed ≤ ${threshold})`,
            details: `Fate Points: ${newFate}/50`
        });
        return newFate;
      });
    }
  }, [addLog, activeBuff]);

  const handleRoll = (source: string, chance: number, event: React.MouseEvent) => processRoll(source, chance, event);

  // --- RITUAL HANDLERS ---
  const handleRitual = (type: 'LUCK' | 'TRANSMUTE' | 'GREED' | 'CHAOS') => {
      // Logic triggers AFTER animation, now just verify cost and start animation
      if (type === 'LUCK' && fatePoints >= 15) {
          setShowAltar(false);
          setActiveRitualAnim('LUCK');
      } else if (type === 'TRANSMUTE' && keys >= 5) {
          setShowAltar(false);
          setActiveRitualAnim('TRANSMUTE');
      } else if (type === 'GREED' && fatePoints >= 20) {
          setShowAltar(false);
          setActiveRitualAnim('GREED');
      } else if (type === 'CHAOS' && fatePoints >= 25) {
          setShowAltar(false);
          setActiveRitualAnim('CHAOS');
      }
  };

  const finishClarity = () => {
    setFatePoints(prev => prev - 15);
    setActiveBuff('LUCK');
    addLog({ type: 'ALTAR', message: 'Ritual of Clarity Performed', details: 'Next roll will use Advantage (roll twice).' });
    setActiveRitualAnim('NONE');
  };

  const finishGreed = () => {
    setFatePoints(prev => prev - 20);
    setActiveBuff('GREED');
    addLog({ type: 'ALTAR', message: 'Ritual of Greed Performed', details: 'Next roll will yield Double Keys if successful. Consumed on next attempt.' });
    setActiveRitualAnim('NONE');
  };

  const finishChaos = () => {
    setFatePoints(prev => prev - 25);
    setChaosKeys(prev => prev + 1);
    addLog({ type: 'ALTAR', message: 'Ritual of Chaos Performed', details: 'Manifested 25 Fate Points into a Chaos Key.' });
    setActiveRitualAnim('NONE');
  };

  const finishTransmutation = () => {
    setKeys(prev => prev - 5);
    setSpecialKeys(prev => prev + 1);
    setActiveRitualAnim('NONE');
    addLog({ type: 'ALTAR', message: 'Ritual of Transmutation Complete', details: 'Fused 5 Keys into 1 Omni-Key.' });
  };
  // -----------------------

  const handleSkillLevelUp = (skill: string) => {
    setUnlocks(prev => {
      const prevTotal = (Object.values(prev.levels) as number[]).reduce((a, b) => a + b, 0);
      const tier = prev.skills[skill] || 0;
      const currentLevel = (prev.levels[skill] as number) || 1;
      const cap = tier === 0 ? 1 : (tier === 10 ? 99 : tier * 10);

      if (currentLevel >= cap) return prev;

      const newLevel = currentLevel + 1;
      const newTotal = prevTotal + 1;

      // Handle Key Roll
      const rollChance = Math.ceil(newLevel / 3);
      processRoll(`${skill} Level ${newLevel}`, rollChance);

      // Handle Total Level Milestone (Chaos Key every 50 levels)
      if (Math.floor(newTotal / 50) > Math.floor(prevTotal / 50)) {
          setChaosKeys(c => c + 1);
          addLog({ type: 'ALTAR', message: 'Total Level Milestone!', details: `Level ${newTotal} reached. +1 Chaos Key awarded!` });
      }

      return { ...prev, levels: { ...prev.levels, [skill]: newLevel } };
    });
  };

  const handleSpecialUnlock = async (type: string, name: string) => {
    if (specialKeys <= 0) return;
    setPendingUnlock({
      table: type, item: name, costType: 'specialKey', displayType: type.charAt(0).toUpperCase() + type.slice(1), itemImage: getUnlockImage(type, name)
    });
    if (['region', 'boss', 'bosses', 'minigame', 'minigames', 'storage'].includes(type)) {
         const imageUrl = await fetchWikiImage(name);
         if (imageUrl) setPendingUnlock(prev => (prev && prev.item === name ? { ...prev, itemImage: imageUrl } : prev));
    }
  };

  const handleChaosUnlock = () => {
      if (chaosKeys <= 0) return;

      const canUnlock = canUnlockHelper(unlocks);
      const availableTables: TableType[] = [];
      if (canUnlock.equipment) availableTables.push(TableType.EQUIPMENT);
      if (canUnlock.skills) availableTables.push(TableType.SKILLS);
      if (canUnlock.regions) availableTables.push(TableType.REGIONS);
      if (canUnlock.mobility) availableTables.push(TableType.MOBILITY);
      if (canUnlock.arcana) availableTables.push(TableType.ARCANA);
      if (canUnlock.poh) availableTables.push(TableType.POH);
      if (canUnlock.merchants) availableTables.push(TableType.MERCHANTS);
      if (canUnlock.minigames) availableTables.push(TableType.MINIGAMES);
      if (canUnlock.bosses) availableTables.push(TableType.BOSSES);
      if (canUnlock.storage) availableTables.push(TableType.STORAGE);

      if (availableTables.length === 0) {
        alert("The void is silent. There is nothing left to chaos unlock.");
        return;
      }

      const randomTable = availableTables[Math.floor(Math.random() * availableTables.length)];
      let pool: string[] = [];
      let stateKey: string = '';

      switch (randomTable) {
          case TableType.SKILLS: pool = SKILLS_LIST; stateKey = 'skill'; break;
          case TableType.EQUIPMENT: pool = EQUIPMENT_SLOTS; stateKey = 'equipment'; break;
          case TableType.REGIONS: pool = REGIONS_LIST; stateKey = 'region'; break;
          case TableType.MOBILITY: pool = MOBILITY_LIST; stateKey = 'mobility'; break;
          case TableType.ARCANA: pool = ARCANA_LIST; stateKey = 'arcana'; break;
          case TableType.POH: pool = POH_LIST; stateKey = 'housing'; break;
          case TableType.MERCHANTS: pool = MERCHANTS_LIST; stateKey = 'merchants'; break;
          case TableType.MINIGAMES: pool = MINIGAMES_LIST; stateKey = 'minigame'; break;
          case TableType.BOSSES: pool = BOSSES_LIST; stateKey = 'boss'; break;
          case TableType.STORAGE: pool = STORAGE_LIST; stateKey = 'storage'; break;
      }

      // Filter to find only locked valid items
      const lockedItems = pool.filter(item => {
          if (randomTable === TableType.SKILLS) return (unlocks.skills[item] || 0) < 10;
          if (randomTable === TableType.EQUIPMENT) return (unlocks.equipment[item] || 0) < EQUIPMENT_TIER_MAX;
          if (randomTable === TableType.REGIONS) return !unlocks.regions.includes(item);
          if (randomTable === TableType.MOBILITY) return !unlocks.mobility.includes(item);
          if (randomTable === TableType.ARCANA) return !unlocks.arcana.includes(item);
          if (randomTable === TableType.POH) return !unlocks.housing.includes(item);
          if (randomTable === TableType.MERCHANTS) return !unlocks.merchants.includes(item);
          if (randomTable === TableType.MINIGAMES) return !unlocks.minigames.includes(item);
          if (randomTable === TableType.BOSSES) return !unlocks.bosses.includes(item);
          if (randomTable === TableType.STORAGE) return !unlocks.storage.includes(item);
          return false;
      });

      if (lockedItems.length === 0) {
          // Retry if table was technically available but specific logic filtered all items (rare edge case)
          handleChaosUnlock();
          return;
      }

      const selectedItem = lockedItems[Math.floor(Math.random() * lockedItems.length)];

      setPendingUnlock({
          table: stateKey,
          item: selectedItem,
          costType: 'chaosKey',
          displayType: randomTable,
          itemImage: getUnlockImage(stateKey, selectedItem)
      });

      // Fetch wiki image if needed
      if (['region', 'boss', 'bosses', 'minigame', 'minigames', 'storage'].includes(stateKey)) {
           fetchWikiImage(selectedItem).then(url => {
               if (url) setPendingUnlock(prev => (prev && prev.item === selectedItem ? { ...prev, itemImage: url } : prev));
           });
      }
  };

  const handleUnlock = async (table: TableType) => {
    if (keys <= 0) return;
    let pool: string[] = [];
    let stateKey: string = '';

    // Skill Cost Scaling: Tiers 8, 9, 10 cost 2 keys
    // If we have < 2 keys, we can only roll for tiers 1-7
    const currentKeys = keys;

    const validator = (item: string) => {
        if (table === TableType.SKILLS) {
            const currentTier = unlocks.skills[item] || 0;
            if (currentTier >= 10) return false;
            // If going to Tier 8, 9, 10 (Current is 7, 8, 9), need 2 keys
            if (currentTier >= 7 && currentKeys < 2) return false;
            return true;
        }
        if (table === TableType.EQUIPMENT) return (unlocks.equipment[item] || 0) < EQUIPMENT_TIER_MAX;
        if (table === TableType.REGIONS) return !unlocks.regions.includes(item);
        if (table === TableType.MOBILITY) return !unlocks.mobility.includes(item);
        if (table === TableType.ARCANA) return !unlocks.arcana.includes(item);
        if (table === TableType.POH) return !unlocks.housing.includes(item);
        if (table === TableType.MERCHANTS) return !unlocks.merchants.includes(item);
        if (table === TableType.MINIGAMES) return !unlocks.minigames.includes(item);
        if (table === TableType.BOSSES) return !unlocks.bosses.includes(item);
        if (table === TableType.STORAGE) return !unlocks.storage.includes(item);
        return true;
    };

    switch (table) {
        case TableType.SKILLS: pool = SKILLS_LIST; stateKey = 'skill'; break;
        case TableType.EQUIPMENT: pool = EQUIPMENT_SLOTS; stateKey = 'equipment'; break;
        case TableType.REGIONS: pool = REGIONS_LIST; stateKey = 'region'; break;
        case TableType.MOBILITY: pool = MOBILITY_LIST; stateKey = 'mobility'; break;
        case TableType.ARCANA: pool = ARCANA_LIST; stateKey = 'arcana'; break;
        case TableType.POH: pool = POH_LIST; stateKey = 'housing'; break;
        case TableType.MERCHANTS: pool = MERCHANTS_LIST; stateKey = 'merchants'; break;
        case TableType.MINIGAMES: pool = MINIGAMES_LIST; stateKey = 'minigame'; break;
        case TableType.BOSSES: pool = BOSSES_LIST; stateKey = 'boss'; break;
        case TableType.STORAGE: pool = STORAGE_LIST; stateKey = 'storage'; break;
    }

    // Filter pool first for efficient selection, especially important for skill cost limits
    const validPool = pool.filter(validator);

    if (validPool.length === 0) {
        if (table === TableType.SKILLS && keys < 2) {
            alert("You need 2 Keys to unlock higher skill tiers!");
        } else {
            alert("Nothing left to unlock in this category!");
        }
        return;
    }

    const item = validPool[Math.floor(Math.random() * validPool.length)];

    // Calculate cost
    let cost = 1;
    if (table === TableType.SKILLS) {
        const currentTier = unlocks.skills[item] || 0;
        if (currentTier >= 7) cost = 2;
    }

    setPendingUnlock({
        table: stateKey,
        item,
        costType: 'key',
        displayType: table,
        itemImage: getUnlockImage(stateKey, item),
        costAmount: cost
    });

    if (['region', 'boss', 'bosses', 'minigame', 'minigames', 'storage'].includes(stateKey)) {
        const imageUrl = await fetchWikiImage(item);
        if (imageUrl) setPendingUnlock(prev => (prev && prev.item === item ? { ...prev, itemImage: imageUrl } : prev));
    }
  };

  const finalizeUnlock = () => {
    if (!pendingUnlock) return;
    const { table, item, costType, costAmount } = pendingUnlock;

    if (costType === 'key') {
        setKeys(prev => prev - (costAmount || 1));
    } else if (costType === 'specialKey') {
        setSpecialKeys(prev => prev - 1);
    } else if (costType === 'chaosKey') {
        setChaosKeys(prev => prev - 1);
    }

    setUnlocks(prev => {
        const newUnlocks = { ...prev };
        if (table === 'skill') newUnlocks.skills = { ...prev.skills, [item]: (prev.skills[item] || 0) + 1 };
        else if (table === 'equipment') newUnlocks.equipment = { ...prev.equipment, [item]: (prev.equipment[item] || 0) + 1 };
        else if (table === 'region') newUnlocks.regions = [...prev.regions, item];
        else if (table === 'mobility') newUnlocks.mobility = [...prev.mobility, item];
        else if (table === 'arcana') newUnlocks.arcana = [...prev.arcana, item];
        else if (table === 'housing') newUnlocks.housing = [...prev.housing, item];
        else if (table === 'merchants') newUnlocks.merchants = [...prev.merchants, item];
        else if (table === 'minigame') newUnlocks.minigames = [...prev.minigames, item];
        else if (table === 'boss') newUnlocks.bosses = [...prev.bosses, item];
        else if (table === 'storage') newUnlocks.storage = [...prev.storage, item];
        return newUnlocks;
    });
    setPendingUnlock(null);
  };

  const handleExport = () => {
    const data = JSON.stringify({ keys, specialKeys, chaosKeys, fatePoints, unlocks, history, activeBuff });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fate_locked_uim_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.keys !== undefined) setKeys(imported.keys);
        if (imported.specialKeys !== undefined) setSpecialKeys(imported.specialKeys);
        if (imported.chaosKeys !== undefined) setChaosKeys(imported.chaosKeys);
        if (imported.fatePoints !== undefined) setFatePoints(imported.fatePoints);
        if (imported.activeBuff !== undefined) setActiveBuff(imported.activeBuff === 'PRESERVE' ? 'NONE' : imported.activeBuff);
        if (imported.unlocks) {
            // Migration logic for import
            if (imported.unlocks.power) {
                imported.unlocks.arcana = imported.unlocks.power;
                delete imported.unlocks.power;
            }
            if (!imported.unlocks.storage) imported.unlocks.storage = [];
            setUnlocks(imported.unlocks);
        }
        if (imported.history) setHistory(imported.history);
      } catch (err) {
        alert("Failed to import save data.");
      }
    };
    reader.readAsText(file);
  };

  const canUnlock = canUnlockHelper(unlocks);

  return (
    <div className="min-h-screen bg-osrs-bg text-osrs-text pb-12 font-sans selection:bg-osrs-gold selection:text-black relative">
      {particles.map(p => (
          <div
            key={p.id}
            className="fixed z-[200] pointer-events-none transition-all duration-1000 ease-in-out"
            style={{
                left: p.x,
                top: p.y,
                animation: 'key-fly 1s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
             {p.type === 'key' ? (
                 <Key className="text-osrs-gold w-8 h-8 drop-shadow-[0_0_10px_#fbbf24]" />
             ) : (
                 <Sparkles className="text-purple-400 w-8 h-8 drop-shadow-[0_0_10px_#a855f7]" />
             )}
          </div>
      ))}

      {rollFeedback.map(f => (
          <div key={f.id}
               className="fixed z-[200] pointer-events-none font-bold text-sm flex flex-col items-center justify-center text-shadow-osrs whitespace-nowrap"
               style={{
                   left: f.x,
                   top: f.y,
                   animation: f.type === 'FAIL' ? 'float-fade-down 1.5s forwards' : 'float-fade-up 2s forwards'
               }}>
               <span className={`text-2xl font-black tracking-wide ${f.type === 'OMNI' ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]' : f.type === 'SUCCESS' ? 'text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]' : f.type === 'PITY' ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]' : 'text-red-400 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]'}`}>
                   {f.type === 'OMNI' ? 'OMNI-KEY!' : f.type === 'PITY' ? 'PITY KEY!' : f.type === 'SUCCESS' ? 'SUCCESS!' : 'MISS'}
               </span>
               <span className="text-xs text-white opacity-90 font-mono bg-black/60 px-2 py-0.5 rounded-full mt-1 border border-white/10 shadow-xl backdrop-blur-sm">
                   {f.roll} {f.type === 'FAIL' ? '>' : '≤'} {f.threshold}
               </span>
          </div>
      ))}

      <style>{`
        @keyframes key-fly {
            0% { transform: scale(0.5) translate(0, 0); opacity: 0; }
            20% { opacity: 1; transform: scale(1.2) translate(0, -20px); }
            100% { transform: scale(0.2) translate(0, -100vh); opacity: 0; }
        }
        @keyframes float-fade-up {
            0% { transform: translate(-50%, -50%) translateY(0) scale(0.8); opacity: 0; }
            15% { transform: translate(-50%, -50%) translateY(-20px) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) translateY(-80px) scale(1); opacity: 0; }
        }
        @keyframes float-fade-down {
            0% { transform: translate(-50%, -50%) translateY(0) scale(0.8); opacity: 0; }
            15% { transform: translate(-50%, -50%) translateY(10px) scale(1); opacity: 1; }
            20%, 40%, 60%, 80% { transform: translate(-50%, -50%) translateY(10px) translateX(2px); }
            30%, 50%, 70% { transform: translate(-50%, -50%) translateY(10px) translateX(-2px); }
            100% { transform: translate(-50%, -50%) translateY(40px) scale(0.9); opacity: 0; }
        }
      `}</style>

      {activeRitualAnim === 'TRANSMUTE' && <TransmutationEffect onComplete={finishTransmutation} />}
      {activeRitualAnim === 'LUCK' && <ClarityEffect onComplete={finishClarity} />}
      {activeRitualAnim === 'GREED' && <GreedEffect onComplete={finishGreed} />}
      {activeRitualAnim === 'CHAOS' && <ChaosEffect onComplete={finishChaos} />}

      {pendingUnlock && <VoidReveal itemName={pendingUnlock.item} itemType={pendingUnlock.displayType} itemImage={pendingUnlock.itemImage} onComplete={finalizeUnlock} isChaos={pendingUnlock.costType === 'chaosKey'} />}
      {showStats && <StatsModal history={history} keysFound={keys} onClose={() => setShowStats(false)} />}
      {showReference && <ReferenceModal onClose={() => setShowReference(false)} />}
      {showAltar && <VoidAltar onClose={() => setShowAltar(false)} fatePoints={fatePoints} keys={keys} activeBuff={activeBuff} onRitual={handleRitual} />}
      {showShare && <ShareModal
        onClose={() => setShowShare(false)}
        gameState={{ keys, specialKeys, chaosKeys, fatePoints, unlocks, history }}
      />}

      <header className="bg-[#1e1e1e] border-b border-white/10 sticky top-0 z-50 shadow-xl backdrop-blur-md bg-opacity-95">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col xl:flex-row items-center justify-between gap-4">

          {/* 1. LOGO & TITLE */}
          <div className="flex items-center gap-3 shrink-0 self-start xl:self-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-900 rounded-lg flex items-center justify-center border border-amber-500/50 shadow-inner">
              <span className="text-2xl drop-shadow-md">🗝️</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-100 tracking-tight uppercase leading-none">Fate-Locked UIM</h1>
              <p className="text-[10px] text-gray-500 font-mono mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                V0.5 BETA
              </p>
            </div>
          </div>

          {/* 2. RESOURCES (Center Stage) */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 bg-black/20 p-2 pr-4 rounded-xl border border-white/5 w-full xl:w-auto">

            {/* Fate Meter */}
            <div className="w-full md:w-48 lg:w-64 px-2">
               <div className="flex justify-between text-[10px] mb-1 font-bold uppercase tracking-wider">
                  <span className={fatePoints >= 40 ? "text-red-400 animate-pulse" : "text-gray-500"}>Fate Points</span>
                  <span className="text-gray-400">{fatePoints}/50</span>
               </div>
               <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10 relative">
                 <div className={`h-full transition-all duration-300 ${fatePoints >= 40 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-amber-600'}`} style={{ width: `${(fatePoints / 50) * 100}%` }} />
                 {/* Tick marks */}
                 <div className="absolute top-0 left-1/4 w-px h-full bg-black/20"></div>
                 <div className="absolute top-0 left-2/4 w-px h-full bg-black/20"></div>
                 <div className="absolute top-0 left-3/4 w-px h-full bg-black/20"></div>
              </div>
            </div>

            {/* Vertical Divider (Desktop) */}
            <div className="hidden md:block w-px h-8 bg-white/10"></div>

            {/* Currencies */}
            <div className="flex items-center gap-3 justify-center">
                {/* Keys */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                   <Key className="w-4 h-4 text-amber-400" />
                   <span className="font-bold text-amber-100 text-lg leading-none">{keys}</span>
                </div>

                {/* Omni */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${specialKeys > 0 ? 'bg-purple-500/20 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/10 opacity-50'}`}>
                   <Sparkles className={`w-4 h-4 ${specialKeys > 0 ? 'text-purple-400 animate-pulse' : 'text-gray-500'}`} />
                   <span className={`font-bold text-lg leading-none ${specialKeys > 0 ? 'text-purple-200' : 'text-gray-500'}`}>{specialKeys}</span>
                </div>

                {/* Chaos */}
                {chaosKeys > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded-lg animate-in fade-in slide-in-from-right-4">
                     <Dna className="w-4 h-4 text-red-400 animate-pulse" />
                     <span className="font-bold text-red-100 text-lg leading-none">{chaosKeys}</span>
                  </div>
                )}
            </div>
          </div>

          {/* 3. TOOLBAR (Right) */}
          <div className="flex items-center gap-3 shrink-0 self-end xl:self-center">
             <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />

             {/* Primary Action: Altar */}
             <button
                onClick={() => setShowAltar(true)}
                className={`
                   relative group overflow-hidden px-4 py-2 rounded-lg border font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg
                   ${activeBuff !== 'NONE'
                        ? activeBuff === 'GREED'
                             ? 'bg-amber-900/40 border-amber-500 text-amber-300 hover:bg-amber-900/60'
                             : 'bg-blue-900/40 border-blue-500 text-blue-300 hover:bg-blue-900/60'
                        : 'bg-[#252525] border-purple-500/30 text-purple-300 hover:border-purple-400 hover:text-purple-200 hover:bg-purple-900/20'
                   }
                `}
             >
                {/* Status Indicator Dot */}
                <span className={`w-2 h-2 rounded-full ${activeBuff !== 'NONE' ? (activeBuff === 'GREED' ? 'bg-amber-400 animate-bounce' : 'bg-blue-400 animate-pulse') : 'bg-purple-500'}`}></span>
                <span>{activeBuff === 'NONE' ? 'Void Altar' : activeBuff}</span>
                {activeBuff !== 'NONE' && <div className="absolute inset-0 bg-white/5 animate-pulse"></div>}
             </button>

             {/* Secondary Actions Group */}
             <div className="flex items-center bg-[#252525] border border-white/10 rounded-lg p-1 gap-1">
                 <button onClick={() => setShowShare(true)} className="p-2 text-gray-400 hover:text-pink-400 hover:bg-white/5 rounded-md transition-colors" title="Share"><Share2 size={16} /></button>
                 <button onClick={() => setShowStats(true)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/5 rounded-md transition-colors" title="Stats"><BarChart3 size={16} /></button>
                 <button onClick={() => setShowReference(true)} className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-md transition-colors" title="Rules"><HelpCircle size={16} /></button>
             </div>

             {/* Data Actions Group */}
             <div className="flex items-center bg-[#252525] border border-white/10 rounded-lg p-1 gap-1">
                 <button onClick={handleImportClick} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Import Save"><Upload size={16} /></button>
                 <button onClick={handleExport} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Export Save"><Download size={16} /></button>
                 <button onClick={() => { if (window.confirm("Start a new game?")) { localStorage.removeItem(STORAGE_KEY); setKeys(3); setSpecialKeys(0); setChaosKeys(0); setFatePoints(0); setUnlocks(getInitialUnlocks()); setHistory([]); setActiveBuff('NONE'); } }} className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors" title="Reset Game"><RotateCcw size={16} /></button>
             </div>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <FateMechanics />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6"><ActionSection onRoll={handleRoll} /></div>
          <div className="space-y-6"><GachaSection keys={keys} chaosKeys={chaosKeys} onUnlock={handleUnlock} onChaosUnlock={handleChaosUnlock} canUnlock={canUnlock} /><LogViewer history={history} /></div>
        </div>
        <Dashboard unlocks={unlocks} onSkillLevelUp={handleSkillLevelUp} specialKeys={specialKeys} onSpecialUnlock={handleSpecialUnlock} />
      </main>
    </div>
  );
}

const canUnlockHelper = (unlocks: UnlockState) => {
    const totalSkillTiers = (Object.values(unlocks.skills) as number[]).reduce((a, b) => a + b, 0);
    const totalEquipTiers = (Object.values(unlocks.equipment) as number[]).reduce((a, b) => a + b, 0);
    return {
        equipment: totalEquipTiers < (EQUIPMENT_SLOTS.length * EQUIPMENT_TIER_MAX),
        skills: totalSkillTiers < (SKILLS_LIST.length * 10),
        regions: unlocks.regions.length < REGIONS_LIST.length,
        mobility: unlocks.mobility.length < MOBILITY_LIST.length,
        arcana: unlocks.arcana.length < ARCANA_LIST.length,
        poh: unlocks.housing.length < POH_LIST.length,
        merchants: unlocks.merchants.length < MERCHANTS_LIST.length,
        minigames: unlocks.minigames.length < MINIGAMES_LIST.length,
        bosses: unlocks.bosses.length < BOSSES_LIST.length,
        storage: unlocks.storage.length < STORAGE_LIST.length,
    };
};

export default App;