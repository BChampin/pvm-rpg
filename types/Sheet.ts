export interface SheetStoreContextType {
  loading: boolean;
  error: string | null;

  sortMethod: string;
  setSortMethod: Function;

  // Data
  sheetUrl: string;
  staticMaps: Map[];
  maps: Map[];
  players: Player[];
  timeRecords: TimeRecord[];
  modalPlayer: Player | null;

  // Functions
  fetchSheetData: (sheetName: string) => Promise<void>;
  fetchMaps: () => Promise<void>;
  fetchPlayers: () => Promise<void>;
  fetchTimeRecords: () => Promise<void>;
  setModalPlayer: Function;
}

const MapGradeOptions = {
  E: { background: 'lime-300', hex: '#d9ead3', text: 'black', level: 0 },
  D: { background: 'lime-600', hex: '#93c47d', text: 'black', level: 1 },
  C: { background: 'cyan-400', hex: '#c9daf8', text: 'black', level: 2 },
  B: { background: 'blue-500', hex: '#6d9eeb', text: 'black', level: 3 },
  A: { background: 'yellow-300', hex: '#fff2cc', text: 'black', level: 4 },
  S: { background: 'amber-600', hex: '#f6b26b', text: 'black', level: 5 },
  SS: { background: 'red-500', hex: '#ff0000', text: 'black', level: 6 },
  Legend: { background: 'red-300', hex: '#cc0000', text: 'black', level: 7 },
  Omniscient: {
    background: 'violet-900',
    hex: '#b4a7d6',
    text: 'white',
    level: 8,
  },
  Divin: { background: 'purple-500', hex: '#8e7cc3', text: 'black', level: 9 },
  God: { background: 'stone-900', hex: '#000000', text: 'white', level: 10 },
  'No life': {
    background: 'violet-900',
    hex: '#20124d',
    text: 'white',
    level: 11,
  },
} as const;

export type MapGrade = {
  label: keyof typeof MapGradeOptions;
  background: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['background'];
  hex: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['hex'];
  text: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['text'];
  level: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['level'];
};

export function getMapGrade(label: keyof typeof MapGradeOptions): MapGrade {
  const mapGradeData = MapGradeOptions[label as keyof typeof MapGradeOptions];
  return { label, ...mapGradeData };
}

export type Map = {
  label: string;
  grade: MapGrade;
  times: {
    alien: number;
    player: number;
    intermediate: number;
    noob: number;
  };
  exchange: {
    link?: string;
    id?: number;
    author?: string;
    thumbnail?: string;
  };
};

export type Player = {
  id: string;
  name: string;
  rawFame: {
    // Used on generate script
    alien?: string;
    player?: string;
    intermediate?: string;
    noob?: string;
  };
  fames: {
    alien?: Fame;
    player?: Fame;
    intermediate?: Fame;
    noob?: Fame;
  };
  category: PlayerCategory;
  nbRecords?: number;
};

export type PlayerCategory = 'Alien' | 'Player' | 'Novice';

const FameOptions = {
  0: { label: 'F', color: 'violet-800', text: 'black' },
  1: { label: 'E--', color: 'lime-300', text: 'black' },
  2: { label: 'E-', color: 'lime-300', text: 'black' },
  3: { label: 'E', color: 'lime-300', text: 'black' },
  4: { label: 'E+', color: 'lime-300', text: 'black' },
  5: { label: 'E++', color: 'lime-300', text: 'black' },
  6: { label: 'D--', color: 'lime-600', text: 'black' },
  7: { label: 'D-', color: 'lime-600', text: 'black' },
  8: { label: 'D', color: 'lime-600', text: 'black' },
  9: { label: 'D+', color: 'lime-600', text: 'black' },
  10: { label: 'D++', color: 'lime-600', text: 'black' },
  11: { label: 'C--', color: 'cyan-400', text: 'black' },
  12: { label: 'C-', color: 'cyan-400', text: 'black' },
  13: { label: 'C', color: 'cyan-400', text: 'black' },
  14: { label: 'C+', color: 'cyan-400', text: 'black' },
  15: { label: 'C++', color: 'cyan-400', text: 'black' },
  16: { label: 'B--', color: 'blue-500', text: 'black' },
  17: { label: 'B-', color: 'blue-500', text: 'black' },
  18: { label: 'B', color: 'blue-500', text: 'black' },
  19: { label: 'B+', color: 'blue-500', text: 'black' },
  20: { label: 'B++', color: 'blue-500', text: 'black' },
  21: { label: 'A--', color: 'yellow-300', text: 'black' },
  22: { label: 'A-', color: 'yellow-300', text: 'black' },
  23: { label: 'A', color: 'yellow-300', text: 'black' },
  24: { label: 'A+', color: 'yellow-300', text: 'black' },
  25: { label: 'A++', color: 'yellow-300', text: 'black' },
  26: { label: 'S--', color: 'amber-600', text: 'black' },
  27: { label: 'S-', color: 'amber-600', text: 'black' },
  28: { label: 'S', color: 'amber-600', text: 'black' },
  29: { label: 'S+', color: 'amber-600', text: 'black' },
  30: { label: 'S++', color: 'amber-600', text: 'black' },
  31: { label: 'SS--', color: 'red-500', text: 'black' },
  32: { label: 'SS-', color: 'red-500', text: 'black' },
  33: { label: 'SS', color: 'red-500', text: 'black' },
  34: { label: 'SS+', color: 'red-500', text: 'black' },
  35: { label: 'SS++', color: 'red-500', text: 'black' },
  36: { label: 'Mythique--', color: 'red-300', text: 'black' },
  37: { label: 'Mythique-', color: 'red-300', text: 'black' },
  38: { label: 'Mythique', color: 'red-300', text: 'black' },
  39: { label: 'Mythique+', color: 'red-300', text: 'black' },
  40: { label: 'Mythique++', color: 'red-300', text: 'black' },
  41: { label: 'Alien--', color: 'stone-900', text: 'black' },
  42: { label: 'Alien-', color: 'stone-900', text: 'black' },
  43: { label: 'Alien', color: 'stone-900', text: 'black' },
  44: { label: 'Alien+', color: 'stone-900', text: 'black' },
  45: { label: 'Alien++', color: 'stone-900', text: 'black' },
  46: { label: 'Legend--', color: 'black', text: 'black' },
  47: { label: 'Legend-', color: 'black', text: 'black' },
  48: { label: 'Legend', color: 'black', text: 'black' },
  49: { label: 'Legend+', color: 'black', text: 'black' },
  50: { label: 'Legend++', color: 'black', text: 'black' },
  51: { label: 'Omniscient--', color: 'violet-900', text: 'black' },
  52: { label: 'Omniscient-', color: 'violet-900', text: 'black' },
  53: { label: 'Omniscient', color: 'violet-900', text: 'black' },
  54: { label: 'Omniscient+', color: 'violet-900', text: 'black' },
  55: { label: 'Omniscient++', color: 'violet-900', text: 'black' },
  56: { label: 'Divin--', color: 'purple-500', text: 'black' },
  57: { label: 'Divin-', color: 'purple-500', text: 'black' },
  58: { label: 'Divin', color: 'purple-500', text: 'black' },
  59: { label: 'Divin+', color: 'purple-500', text: 'black' },
  60: { label: 'Divin++', color: 'purple-500', text: 'black' },
  61: { label: 'Dragon Celeste --', color: 'red-200', text: 'black' },
  62: { label: 'Dragon Celeste -', color: 'red-200', text: 'black' },
  63: { label: 'Dragon Celeste', color: 'red-200', text: 'black' },
  64: { label: 'Dragon Celeste+', color: 'red-200', text: 'black' },
  65: { label: 'Dragon Celeste++', color: 'red-200', text: 'black' },
  66: { label: 'Éternel', color: 'yellow-500', text: 'black' },
  67: { label: 'No Life', color: 'violet-900', text: 'black' },
  68: { label: 'GOD', color: 'white', text: 'black' },
} as const;

export type Fame = {
  level: keyof typeof FameOptions;
  label: (typeof FameOptions)[keyof typeof FameOptions]['label'];
  color: (typeof FameOptions)[keyof typeof FameOptions]['color'];
  text: (typeof FameOptions)[keyof typeof FameOptions]['text'];
};

export function getFame(nb: number): Fame {
  const level = nb as keyof typeof FameOptions;
  const fameData = FameOptions[level as keyof typeof FameOptions];
  return { level, ...fameData };
}

export type TimeRecord = {
  playerId: string;
  mapId: number;
  time: number;
  category?: TimeCategory;
};

type TimeCategory =
  | 'Alien'
  | 'Player'
  | 'Intermediate'
  | 'Noob'
  | 'Not defined';

const LevelOptions = {
  alien: { label: 'Alien', icon: 'author' },
  player: { label: 'Player', icon: 'gold' },
  intermediate: { label: 'Intermediate', icon: 'silver' },
  noob: { label: 'Noob', icon: 'bronze' },
} as const;

export type Level = {
  level: keyof typeof LevelOptions;
  label: (typeof LevelOptions)[keyof typeof LevelOptions]['label'];
  icon: (typeof LevelOptions)[keyof typeof LevelOptions]['icon'];
};

export function getLevel(lvl: string): Level {
  const level = lvl as keyof typeof LevelOptions;
  const levelData = LevelOptions[level as keyof typeof LevelOptions];
  return { level, ...levelData };
}
