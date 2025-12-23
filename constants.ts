
import { DropSource } from './types';

// Reordered to match the 3-column OSRS stats panel layout
// Col 1 (Combat), Col 2 (Support), Col 3 (Gathering/Artisan) roughly
export const SKILLS_LIST = [
  'Attack', 'Hitpoints', 'Mining',
  'Strength', 'Agility', 'Smithing',
  'Defence', 'Herblore', 'Fishing',
  'Ranged', 'Thieving', 'Cooking',
  'Prayer', 'Crafting', 'Firemaking',
  'Magic', 'Fletching', 'Woodcutting',
  'Runecraft', 'Slayer', 'Farming',
  'Construction', 'Hunter', 'Sailing'
];

export const EQUIPMENT_SLOTS = [
  'Head', 'Cape', 'Neck', 'Ammo', 'Weapon', 'Body', 'Shield', 'Legs', 'Gloves', 'Boots', 'Ring'
];

export const EQUIPMENT_TIER_MAX = 9;

export const MOBILITY_LIST = [
  'Spirit Trees',
  'Fairy Rings',
  'Gnome Gliders',
  'Charter Ships',
  'Teleport Tablets',
  'Jewelry Teleports',
  'Canoes',
  'Balloon Transport',
  'Mine Carts',
  'Magic Carpets',
  'Wilderness Obelisks',
  'Minigame Teleports'
];

export const ARCANA_LIST = [
  'Ancient Magicks',
  'Lunar Spellbook',
  'Arceuus Spellbook',
  'Protection Prayers',
  'Piety',
  'Rigour',
  'Augury',
  'Preserve',
  'High Alchemy',
  'Thralls',
  'Vengeance',
  'Bones to Peaches',
  'Charge',
  'Dwarf Cannon'
];

export const POH_LIST = [
  'Costume Room',
  'Chapel (Altars)',
  'Portal Chamber',
  'Portal Nexus',
  'Superior Garden (Pools)',
  'Achievement Gallery (Jewelry)',
  'Study (Lecterns)',
  'Workshop (Repair)',
  'Kitchen (Shelves)',
  'Menagerie (Pets)',
  'Quest Hall (Glory)',
  'Combat Room (Dummy)'
];

export const MERCHANTS_LIST = [
  'General Stores',
  'Magic & Runes',
  'Archery & Ranged',
  'Melee Weaponry',
  'Platebody & Armour',
  'Food & Provisions',
  'Crafting Supplies',
  'Farming & Herblore',
  'Clothing & Vanity',
  'Slayer Masters',
  'Mining & Smithing'
];

export const STORAGE_LIST = [
  'Looting Bag',
  'Rune Pouch',
  'Seed Box',
  'Herb Sack',
  'Gem Bag',
  'Coal Bag',
  'Fish Barrel',
  'Tackle Box',
  'Bolt Pouch',
  'Plank Sack',
  'Huntsman\'s Kit',
  'Log Basket'
];

export const BOSSES_LIST = [
  // Raids & Major Encounters
  'Chambers of Xeric',
  'Theatre of Blood',
  'Tombs of Amascut',
  'The Gauntlet',
  'The Nightmare',
  'Phosani\'s Nightmare',
  'Nex',
  'Corporeal Beast',

  // God Wars Dungeon
  'General Graardor',
  'Commander Zilyana',
  'Kree\'arra',
  'K\'ril Tsutsaroth',

  // Slayer Bosses
  'Abyssal Sire',
  'Alchemical Hydra',
  'Cerberus',
  'Grotesque Guardians',
  'Kraken',
  'Skotizo',
  'Thermonuclear Smoke Devil',
  'Araxxor',

  // Wilderness Bosses
  'Artio',
  'Callisto',
  'Calvar\'ion',
  'Chaos Elemental',
  'Chaos Fanatic',
  'Crazy Archaeologist',
  'Scorpia',
  'Spindel',
  'Venenatis',
  'Vet\'ion',

  // Dragonkin & Varlamore
  'Vorkath',
  'Galvek',
  'The Hueycoatl',
  'Moons of Peril',
  'Fortis Colosseum',

  // Desert Treasure 2
  'Duke Sucellus',
  'The Leviathan',
  'The Whisperer',
  'Vardorvis',

  // Other Bosses
  'Barrows Brothers',
  'Bryophyta',
  'Dagannoth Kings',
  'Deranged Archaeologist',
  'Giant Mole',
  'Hespori',
  'Kalphite Queen',
  'King Black Dragon',
  'Mimic',
  'Obor',
  'Phantom Muspah',
  'Sarachnis',
  'Scurrius',
  'Zulrah',

  // Skilling/Minigame Bosses
  'Wintertodt',
  'Tempoross',
  'Zalcano',
  'TzHaar Fight Cave',
  'Inferno',
  'TzHaar-Ket-Rak\'s Challenges',
];

export const MINIGAMES_LIST = [
  // Legacy & Misc
  'Shooting Stars',

  // Combat Minigames
  'Barbarian Assault',
  'Bounty Hunter',
  'Castle Wars',
  'Clan Wars',
  'Emir\'s Arena',
  'Intelligence Gathering',
  'Last Man Standing',
  'Mage Arena',
  'Nightmare Zone',
  'Pest Control',
  'Soul Wars',
  'Temple Trekking',
  'TzHaar Fight Pit',

  // Skilling Minigames
  'Archery Competition',
  'Blast Furnace',
  'Brimhaven Agility Arena',
  'Fishing Trawler',
  'Giants\' Foundry',
  'Gnome Ball',
  'Gnome Restaurant',
  'Guardians of the Rift',
  'Hallowed Sepulchre',
  'Impetuous Impulses',
  'Mage Training Arena',
  'Mahogany Homes',
  'Mastering Mixology',
  'Mess',
  'Pyramid Plunder',
  'Rogues\' Den',
  'Sorceress\'s Garden',
  'Stealing Artefacts',
  'Tithe Farm',
  'Trouble Brewing',
  'Vale Totems',
  'Volcanic Mine',

  // Hybrid
  'Shades of Mort\'ton',
  'Tai Bwo Wannai Cleanup',
  'Warriors\' Guild',

  // Misc
  'Burthorpe Games Room',
  'Forestry',
  'Rat Pits',
  'Tears of Guthix'
];

export const MISTHALIN_AREAS = [
  'Varrock', 'Lumbridge', 'Draynor Village', 'Wizards\' Tower', 'Edgeville',
  'Barbarian Village', 'Digsite', 'Silvarea', 'Paterdomus'
];

export const REGION_GROUPS: Record<string, string[]> = {
  'Asgarnia': [
    'Falador', 'Port Sarim', 'Rimmington', 'Taverley', 'Burthorpe', 'Warriors\' Guild',
    'Heroes\' Guild', 'Crafting Guild', 'Dwarven Mine', 'Ice Mountain', 'Asgarnian Ice Dungeon',
    'Motherlode Mine', 'Goblin Village', 'Mudskipper Point', 'Void Knights\' Outpost', 'Entrana'
  ],
  'Kandarin': [
    'East Ardougne', 'West Ardougne', 'Catherby', 'Seers\' Village', 'Camelot', 'Yanille',
    'Port Khazard', 'Hemenster', 'Fishing Guild', 'Ranging Guild', 'Legends\' Guild',
    'Tree Gnome Stronghold', 'Gnome Village', 'Witchaven', 'Piscatoris Fishing Colony',
    'Feldip Hills', 'Baxtorian Falls', 'Otto\'s Grotto', 'Barbarian Outpost', 'Fight Arena'
  ],
  'Karamja': [
    'Musa Point', 'Brimhaven', 'Tai Bwo Wannai', 'Shilo Village', 'Kharazi Jungle',
    'Mor Ul Rek (TzHaar City)', 'Crandor'
  ],
  'Kharidian Desert': [
    'Al Kharid', 'Duel Arena / PvP Arena', 'Shantay Pass', 'Pollnivneach', 'Nardah',
    'Sophanem', 'Menaphos', 'Bandit Camp', 'Bedabin Camp', 'Ruins of Uzer',
    'Mage Training Arena', 'Agility Pyramid', 'Giants\' Plateau', 'Kalphite Lair'
  ],
  'Morytania': [
    'Canifis', 'Port Phasmatys', 'Mort\'ton', 'Barrows', 'Burgh de Rott', 'Meiyerditch',
    'Darkmeyer', 'Slepe', 'Ver Sinhaza', 'Fenkenstrain\'s Castle', 'Slayer Tower',
    'Mort Myre Swamp', 'Haunted Mine', 'Haunted Woods', 'Harmony Island',
    'Mos Le\'Harmless', 'Braindeath Island', 'Dragontooth Island'
  ],
  'Fremennik': [
    'Rellekka', 'Neitiznot', 'Jatizso', 'Miscellania & Etceteria', 'Waterbirth Island',
    'Lunar Isle', 'Mountain Camp', 'Lighthouse', 'Keldagrim'
  ],
  'Tirannwn': [
    'Prifddinas', 'Lletya', 'Tyras Camp', 'Elf Camp', 'Isafdar', 'Zul-Andra',
    'Arandar', 'Gwenith', 'Iorwerth Camp'
  ],
  'Wilderness': [
    'Ferox Enclave', 'Wilderness Volcano', 'Chaos Temple', 'Rogues\' Castle', 'Lava Maze',
    'Bandit Camp', 'Dark Warriors\' Fortress', 'Graveyard of Shadows', 'Forgotten Cemetery',
    'Resource Area', 'Mage Arena', 'Scorpia\'s Cave', 'Fountain of Rune', 'Wilderness God Wars Dungeon'
  ],
  'Kourend & Kebos': [
    'Kourend Castle', 'Hosidius', 'Piscarilius', 'Shayzien', 'Lovakengj', 'Arceuus',
    'Kebos Lowlands', 'Molch', 'Farming Guild', 'Woodcutting Guild', 'Mount Quidamortem',
    'Mount Karuulm', 'Catacombs of Kourend', 'Land\'s End', 'Wintertodt Camp'
  ],
  'Varlamore': [
    'Civitas illa Fortis', 'Avium Savannah', 'Cam Torum', 'Ralos\' Rise', 'Darkfrost',
    'Hunter\'s Guild', 'Aldarin', 'The Stranglewood'
  ],
  'Islands & Others': [
    'Fossil Island', 'Ape Atoll', 'Zanaris', 'Tutorial Island'
  ],
  'The Open Seas': [
    'Pandemonium', 'The Great Conch', 'The Little Pearl', 'Drumstick Isle', 'Ledger Island',
    'Brittle Island', 'Vatricos Island', 'Laguna Auror', 'Chin Champa Island', 'Doggos Island',
    'Splinter Island', 'Chard Island', 'Grimstone', 'Isle of Bones', 'Minotaur\'s Rest',
    'The Pincers', 'Barracuda Trials', 'Crabclaw Isle', 'Isle of Souls (Expanded)'
  ]
};

// Flattened list for the RNG pool
export const REGIONS_LIST = Object.values(REGION_GROUPS).flat();

export const DROP_RATES: Record<string, number> = {
  [DropSource.QUEST_NOVICE]: 25,
  [DropSource.QUEST_INTERMEDIATE]: 50,
  [DropSource.QUEST_EXPERIENCED]: 75,
  [DropSource.QUEST_MASTER]: 100,
  [DropSource.QUEST_GRANDMASTER]: 100,
  [DropSource.CA_EASY]: 2,
  [DropSource.CA_MEDIUM]: 5,
  [DropSource.CA_HARD]: 10,
  [DropSource.CA_ELITE]: 25,
  [DropSource.CA_MASTER]: 50,
  [DropSource.CA_GRANDMASTER]: 100,
  [DropSource.COLLECTION_LOG]: 5,
  [DropSource.DIARY_EASY]: 33,
  [DropSource.DIARY_MEDIUM]: 66,
  [DropSource.DIARY_HARD]: 100,
  [DropSource.DIARY_ELITE]: 100,
  [DropSource.SLAYER_TASK]: 20,
  [DropSource.CLUE_BEGINNER]: 5,
  [DropSource.CLUE_EASY]: 10,
  [DropSource.CLUE_MEDIUM]: 20,
  [DropSource.CLUE_HARD]: 35,
  [DropSource.CLUE_ELITE]: 65,
  [DropSource.CLUE_MASTER]: 100,
};

// --- ICON & WIKI MAPPINGS ---

export const REGION_ICONS: Record<string, string> = {
  'Misthalin': 'Misthalin_Area_Badge.png',        // Varrock Teleport
  'Asgarnia': 'Asgarnia_Area_Badge.png',         // Falador Teleport
  'Kandarin': 'Kandarin_Area_Badge.png',         // Camelot Teleport
  'Karamja': 'Karamja_Area_Badge.png',          // Karamja Gloves
  'Kharidian Desert': 'Desert_Area_Badge.png',  // Desert Amulet
  'Morytania': 'Morytania_Area_Badge.png',               // Ectophial
  'Fremennik': 'Fremennik_Area_Badge.png',   // Sea Boots
  'Tirannwn': 'Tirannwn_Area_Badge.png',    // Crystal Teleport Seed
  'Wilderness': 'Wilderness_Area_Badge.png',     // Wilderness Sword
  'Kourend & Kebos': 'Kourend_Area_Badge.png', // Xeric's Talisman
  'Varlamore': 'Varlamore_Area_Badge.png',
  'Islands & Others': 'Fossil_Island_Teleport.png',
  'The Open Seas': 'Sea_charting_icon.png'
};

export const SLOT_CONFIG: Record<string, { file: string, gridArea: string }> = {
  'Head':   { file: 'Head_slot.png', gridArea: 'col-start-2 row-start-1' },
  'Cape':   { file: 'Cape_slot.png', gridArea: 'col-start-1 row-start-2' },
  'Neck':   { file: 'Neck_slot.png', gridArea: 'col-start-2 row-start-2' },
  'Ammo':   { file: 'Ammo_slot.png', gridArea: 'col-start-3 row-start-2' },
  'Weapon': { file: 'Weapon_slot.png', gridArea: 'col-start-1 row-start-3' },
  'Body':   { file: 'Body_slot.png', gridArea: 'col-start-2 row-start-3' },
  'Shield': { file: 'Shield_slot.png', gridArea: 'col-start-3 row-start-3' },
  'Legs':   { file: 'Legs_slot.png', gridArea: 'col-start-2 row-start-4' },
  'Gloves': { file: 'Hands_slot.png', gridArea: 'col-start-1 row-start-5' },
  'Boots':  { file: 'Feet_slot.png', gridArea: 'col-start-2 row-start-5' },
  'Ring':   { file: 'Ring_slot.png', gridArea: 'col-start-3 row-start-5' },
};

export const SPECIAL_ICONS: Record<string, string> = {
  // Mobility
  'Spirit Trees': 'Spirit_tree.png',
  'Fairy Rings': 'Fairy_ring.png',
  'Gnome Gliders': 'Gnome_glider.png',
  'Charter Ships': 'Trader_Stan.png',
  'Teleport Tablets': 'Teleport_to_house_%28tablet%29.png',
  'Jewelry Teleports': 'Games_necklace(8).png',
  'Canoes': 'Waka_canoe.png',
  'Balloon Transport': 'Origami_balloon.png',
  'Mine Carts': 'Minecart_%28Lovakengj_Minecart_Network%29.png',
  'Magic Carpets': 'Rug_Merchant_%281%29.png',
  'Wilderness Obelisks': 'Obelisk_%28Wilderness%2C_activated%29.png',
  'Minigame Teleports': 'Minigame_map_icon.png',

  // Arcana (Power)
  'Ancient Magicks': 'Ancient_Magicks_icon.png',
  'Lunar Spellbook': 'Lunar_spells_icon.png',
  'Arceuus Spellbook': 'Arceuus_spells_icon.png',
  'Protection Prayers': 'Protect_from_Melee_icon.png',
  'High Alchemy': 'High_Level_Alchemy_icon.png',
  'Piety': 'Piety_icon.png',
  'Rigour': 'Rigour_icon.png',
  'Augury': 'Augury_icon.png',
  'Preserve': 'Preserve_icon.png',
  'Iban Blast': 'Iban_Blast.png',
  'Thralls': 'Resurrect_Greater_Zombie.png',
  'Vengeance': 'Vengeance_icon.png',
  'Bones to Peaches': 'Bones_to_Peaches_icon.png',
  'Charge': 'Charge_icon.png',
  'Dwarf Cannon': 'Dwarf_multicannon.png',

  // Storage (New)
  'Looting Bag': 'Looting_bag.png',
  'Rune Pouch': 'Rune_pouch.png',
  'Seed Box': 'Seed_box.png',
  'Herb Sack': 'Herb_sack.png',
  'Gem Bag': 'Gem_bag.png',
  'Coal Bag': 'Coal_bag.png',
  'Fish Barrel': 'Fish_barrel.png',
  'Tackle Box': 'Tackle_box.png',
  'Bolt Pouch': 'Bolt_pouch.png',
  'Plank Sack': 'Plank_sack.png',
  'Huntsman\'s Kit': 'Huntsman\'s_kit.png',
  'Log Basket': 'Log_basket.png',

  // POH
  'Costume Room': 'Oak_costume_room.png',
  'Chapel (Altars)': 'Altar_space.png',
  'Portal Chamber': 'Portal_(Construction).png',
  'Portal Nexus': 'Portal_nexus.png',
  'Superior Garden (Pools)': 'Ornate_pool_of_rejuvenation.png',
  'Achievement Gallery (Jewelry)': 'Jewellery_box.png',
  'Study (Lecterns)': 'Lectern.png',
  'Workshop (Repair)': 'Armour_stand_(Construction).png',
  'Kitchen (Shelves)': 'Oak_shelves_1.png',
  'Menagerie (Pets)': 'Pet_house_(oak).png',
  'Quest Hall (Glory)': 'Mounted_amulet_of_glory.png',
  'Combat Room (Dummy)': 'Undead_combat_dummy.png',

  // Merchants
  'General Stores': 'General_store_icon.png',
  'Magic & Runes': 'Runes_icon.png',
  'Archery & Ranged': 'Bow_and_arrow_shop_icon.png',
  'Melee Weaponry': 'Sword_shop_icon.png',
  'Platebody & Armour': 'Armour_shop_icon.png',
  'Food & Provisions': 'Food_shop_icon.png',
  'Crafting Supplies': 'Crafting_shop_icon.png',
  'Farming & Herblore': 'Farming_shop_icon.png',
  'Clothing & Vanity': 'Clothes_shop_icon.png',
  'Slayer Masters': 'Slayer_icon.png',
  'Mining & Smithing': 'Pickaxe_shop_icon.png',

  // BOSSES (Images from OSRS Wiki)
  'Abyssal Sire': 'Abyssal_Sire.png',
  'Alchemical Hydra': 'Alchemical_Hydra.png',
  'Araxxor': 'Araxxor.png',
  'Artio': 'Artio.png',
  'Barrows Brothers': 'Barrows_icon.png',
  'Bryophyta': 'Bryophyta.png',
  'Callisto': 'Callisto.png',
  'Calvar\'ion': 'Calvar\'ion.png',
  'Cerberus': 'Cerberus.png',
  'Chambers of Xeric': 'Great_Olm.png',
  'Chaos Elemental': 'Chaos_Elemental.png',
  'Chaos Fanatic': 'Chaos_Fanatic.png',
  'Commander Zilyana': 'Commander_Zilyana.png',
  'Corporeal Beast': 'Corporeal_Beast.png',
  'Crazy Archaeologist': 'Crazy_archaeologist.png',
  'Dagannoth Kings': 'Dagannoth_Supreme.png',
  'Deranged Archaeologist': 'Deranged_archaeologist.png',
  'Duke Sucellus': 'Duke_Sucellus.png',
  'Fortis Colosseum': 'Dizana\'s_quiver.png', // Or Sol_Heredit.png
  'Galvek': 'Galvek.png',
  'General Graardor': 'General_Graardor.png',
  'Giant Mole': 'Giant_Mole.png',
  'Grotesque Guardians': 'Dusk.png',
  'Hespori': 'Hespori.png',
  'The Hueycoatl': 'The_Hueycoatl.png',
  'Inferno': 'Infernal_cape.png',
  'Kalphite Queen': 'Kalphite_Queen.png',
  'King Black Dragon': 'King_Black_Dragon.png',
  'Kraken': 'Kraken.png',
  'Kree\'arra': 'Kree\'arra.png',
  'K\'ril Tsutsaroth': 'K\'ril_Tsutsaroth.png',
  'Mimic': 'The_Mimic.png',
  'Moons of Peril': 'Lunar_Chest.png',
  'Nex': 'Nex.png',
  'Obor': 'Obor.png',
  'Phantom Muspah': 'Phantom_Muspah_(ranged).png',
  'Phosani\'s Nightmare': 'Phosani\'s_Nightmare.png',
  'Sarachnis': 'Sarachnis.png',
  'Scorpia': 'Scorpia.png',
  'Scurrius': 'Scurrius.png',
  'Skotizo': 'Skotizo.png',
  'Spindel': 'Spindel.png',
  'Tempoross': 'Tempoross_icon.png',
  'The Gauntlet': 'Crystal_helm.png',
  'The Leviathan': 'The_Leviathan.png',
  'The Nightmare': 'The_Nightmare.png',
  'The Whisperer': 'The_Whisperer.png',
  'Theatre of Blood': 'Verzik_Vitur.png',
  'Thermonuclear Smoke Devil': 'Thermonuclear_smoke_devil.png',
  'Tombs of Amascut': 'Tombs_of_Amascut.png',
  'TzHaar Fight Cave': 'Fire_cape.png',
  'TzHaar-Ket-Rak\'s Challenges': 'Tokkul.png',
  'Vardorvis': 'Vardorvis.png',
  'Venenatis': 'Venenatis.png',
  'Vet\'ion': 'Vet\'ion.png',
  'Vorkath': 'Vorkath.png',
  'Wintertodt': 'Wintertodt_icon.png',
  'Zalcano': 'Zalcano.png',
  'Zulrah': 'Zulrah_(serpentine).png',

  // Minigames
  'Shooting Stars': 'Celestial_ring.png',
  'Barbarian Assault': 'Fighter_torso.png',
  'Bounty Hunter': 'Bounty_hunter_emblem_tier_1.png',
  'Castle Wars': 'Saradomin_standard.png',
  'Clan Wars': 'Clan_Wars_cape_(purple).png',
  'Emir\'s Arena': 'Duel_Arena_teleport.png',
  'Intelligence Gathering': 'Stolen_scroll.png',
  'Last Man Standing': 'Victor\'s_cape_(1000).png',
  'Mage Arena': 'God_cape.png',
  'Nightmare Zone': 'Black_mask_(i).png',
  'Pest Control': 'Void_knight_helm.png',
  'Soul Wars': 'Soul_wars_portal.png',
  'Temple Trekking': 'Gadderhammer.png',
  'TzHaar Fight Pit': 'Toktz-ket-xil.png',
  'Archery Competition': 'Bronze_arrow.png',
  'Blast Furnace': 'Blast_furnace_icon.png',
  'Brimhaven Agility Arena': 'Agility_arena_ticket.png',
  'Fishing Trawler': 'Angler_hat.png',
  'Giants\' Foundry': 'Kovac.png',
  'Gnome Ball': 'Gnomeball.png',
  'Gnome Restaurant': 'Mint_cocktail.png',
  'Guardians of the Rift': 'Abyssal_pearl.png',
  'Hallowed Sepulchre': 'Hallowed_ring.png',
  'Impetuous Impulses': 'Eclectic_impling_jar.png',
  'Mage Training Arena': 'Teacher_wand.png',
  'Mahogany Homes': 'Carpenter\'s_helmet.png',
  'Mastering Mixology': 'Herblore_icon.png',
  'Mess': 'Fried_mushrooms.png',
  'Pyramid Plunder': 'Pharaoh\'s_sceptre.png',
  'Rogues\' Den': 'Rogue_kit.png',
  'Sorceress\'s Garden': 'Summer_sq\'irkjuice.png',
  'Stealing Artefacts': 'Golden_goblet.png',
  'Tithe Farm': 'Farmer_Gricoller\'s_can.png',
  'Trouble Brewing': 'Rum_(blue).png',
  'Vale Totems': 'Agility_icon.png',
  'Volcanic Mine': 'Volcanic_Mine_teleport.png',
  'Shades of Mort\'ton': 'Flamtaer_hammer.png',
  'Tai Bwo Wannai Cleanup': 'Trading_sticks.png',
  'Warriors\' Guild': 'Dragon_defender.png',
  'Burthorpe Games Room': 'RuneLink_table.png',
  'Forestry': 'Forestry_kit.png',
  'Rat Pits': 'Rat_pole.png',
  'Tears of Guthix': 'Tears_of_Guthix.png'
};

export const WIKI_OVERRIDES: Record<string, string> = {
  'Duel Arena / PvP Arena': 'PvP_Arena',
  'Miscellania & Etceteria': 'Miscellania',
  'Isle of Souls (Expanded)': 'Isle_of_Souls',
  'Mort\'ton': 'Mort\'ton',
  'Shades of Mort\'ton': 'Shades_of_Mort\'ton',
  'Civitas illa Fortis': 'Civitas_illa_Fortis',
  'Hunter\'s Guild': 'Hunter_Guild',
  'Mor Ul Rek (TzHaar City)': 'Mor_Ul_Rek',
  'Barrows Brothers': 'Barrows',
  'Iban Blast': 'Iban_Blast',
  'Intelligence Gathering': 'Civitas_illa_Fortis',
  'Vale Totems': 'Civitas_illa_Fortis',
  'Mastering Mixology': 'Mixology',
  'Magic & Runes': 'Magic_store',
  'Archery & Ranged': 'Archery_store',
  'Melee Weaponry': 'Sword_shop',
  'Platebody & Armour': 'Armour_shop',
  'Food & Provisions': 'Food_shop',
  'Crafting Supplies': 'Crafting_store',
  'Farming & Herblore': 'Farming_shop',
  'Clothing & Vanity': 'Clothes_shop',
  'Mining & Smithing': 'Pickaxe_shop',
  'Looting Bag': 'Looting_bag',
  'Rune Pouch': 'Rune_pouch',
  'Seed Box': 'Seed_box',
  'Herb Sack': 'Herb_sack',
  'Gem Bag': 'Gem_bag',
  'Coal Bag': 'Coal_bag',
  'Fish Barrel': 'Fish_barrel',
  'Tackle Box': 'Tackle_box',
  'Bolt Pouch': 'Bolt_pouch',
  'Plank Sack': 'Plank_sack',
  'Log Basket': 'Log_basket',
  'Huntsman\'s Kit': 'Huntsman\'s_kit'
};
