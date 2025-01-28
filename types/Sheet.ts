export interface SheetStoreContextType {
  error: string | null;

  sortMethod: string;
  setSortMethod: Function;

  // Loading
  loading: {
    maps: boolean;
    players: boolean;
    timeRecords: boolean;
  };

  // Data
  sheetUrl: string;
  sheetData: SheetData[];
  staticMaps: Map[];
  authors: Author[];
  maps: Map[];
  players: Player[];
  timeRecords: TimeRecord[];
  modalPlayer: Player | null;

  // Functions
  fetchSheetData: (sheetName: string) => Promise<void>;
  // fetchMaps: () => Promise<void>;
  fetchPlayers: () => Promise<void>;
  fetchTimeRecords: () => Promise<void>;
  setModalPlayer: Function;
}

export const MapGradeOptions = {
  E: { background: 'lime-300', hex: '#d9ead3', text: 'background', level: 0 },
  D: { background: 'lime-600', hex: '#93c47d', text: 'background', level: 1 },
  C: { background: 'cyan-400', hex: '#c9daf8', text: 'background', level: 2 },
  B: { background: 'blue-500', hex: '#6d9eeb', text: 'background', level: 3 },
  A: { background: 'yellow-300', hex: '#fff2cc', text: 'background', level: 4 },
  S: { background: 'amber-600', hex: '#f6b26b', text: 'background', level: 5 },
  SS: { background: 'red-500', hex: '#ff0000', text: 'background', level: 6 },
  Legend: {
    background: 'red-300',
    hex: '#cc0000',
    text: 'background',
    level: 7,
  },
  Abyssal: {
    background: 'purple-300',
    hex: '#cc0000',
    text: 'background',
    level: 8,
  },
  Omniscient: {
    background: 'violet-900',
    hex: '#b4a7d6',
    text: 'white',
    level: 9,
  },
  Divin: {
    background: 'purple-500',
    hex: '#8e7cc3',
    text: 'background',
    level: 10,
  },
  God: {
    background: 'stone-900',
    hex: '#000000',
    text: 'foreground',
    level: 11,
  },
  'No life': {
    background: 'violet-900',
    hex: '#20124d',
    text: 'white',
    level: 12,
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

export type Author = {
  id: number;
  name: string;
};

export type Exchange = {
  link?: string;
  id?: number;
  author?: Author;
  thumbnail?: string;
  awardCount?: number;
};

export type Map = {
  label: string;
  grade: MapGrade;
  times: {
    alien: number;
    player: number;
    intermediate: number;
    noob: number;
  };
  exchange: Exchange;
  tag?: string;
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
  0: { label: 'F', color: 'violet-800', text: 'background' },
  1: { label: 'E--', color: 'lime-300', text: 'background' },
  2: { label: 'E-', color: 'lime-300', text: 'background' },
  3: { label: 'E', color: 'lime-300', text: 'background' },
  4: { label: 'E+', color: 'lime-300', text: 'background' },
  5: { label: 'E++', color: 'lime-300', text: 'background' },
  6: { label: 'D--', color: 'lime-600', text: 'background' },
  7: { label: 'D-', color: 'lime-600', text: 'background' },
  8: { label: 'D', color: 'lime-600', text: 'background' },
  9: { label: 'D+', color: 'lime-600', text: 'background' },
  10: { label: 'D++', color: 'lime-600', text: 'background' },
  11: { label: 'C--', color: 'cyan-400', text: 'background' },
  12: { label: 'C-', color: 'cyan-400', text: 'background' },
  13: { label: 'C', color: 'cyan-400', text: 'background' },
  14: { label: 'C+', color: 'cyan-400', text: 'background' },
  15: { label: 'C++', color: 'cyan-400', text: 'background' },
  16: { label: 'B--', color: 'blue-500', text: 'background' },
  17: { label: 'B-', color: 'blue-500', text: 'background' },
  18: { label: 'B', color: 'blue-500', text: 'background' },
  19: { label: 'B+', color: 'blue-500', text: 'background' },
  20: { label: 'B++', color: 'blue-500', text: 'background' },
  21: { label: 'A--', color: 'yellow-300', text: 'background' },
  22: { label: 'A-', color: 'yellow-300', text: 'background' },
  23: { label: 'A', color: 'yellow-300', text: 'background' },
  24: { label: 'A+', color: 'yellow-300', text: 'background' },
  25: { label: 'A++', color: 'yellow-300', text: 'background' },
  26: { label: 'S--', color: 'amber-600', text: 'background' },
  27: { label: 'S-', color: 'amber-600', text: 'background' },
  28: { label: 'S', color: 'amber-600', text: 'background' },
  29: { label: 'S+', color: 'amber-600', text: 'background' },
  30: { label: 'S++', color: 'amber-600', text: 'background' },
  31: { label: 'SS--', color: 'red-500', text: 'background' },
  32: { label: 'SS-', color: 'red-500', text: 'background' },
  33: { label: 'SS', color: 'red-500', text: 'background' },
  34: { label: 'SS+', color: 'red-500', text: 'background' },
  35: { label: 'SS++', color: 'red-500', text: 'background' },
  36: { label: 'Mythique--', color: 'red-300', text: 'background' },
  37: { label: 'Mythique-', color: 'red-300', text: 'background' },
  38: { label: 'Mythique', color: 'red-300', text: 'background' },
  39: { label: 'Mythique+', color: 'red-300', text: 'background' },
  40: { label: 'Mythique++', color: 'red-300', text: 'background' },
  41: { label: 'Alien--', color: 'stone-900', text: 'foreground' },
  42: { label: 'Alien-', color: 'stone-900', text: 'foreground' },
  43: { label: 'Alien', color: 'stone-900', text: 'foreground' },
  44: { label: 'Alien+', color: 'stone-900', text: 'foreground' },
  45: { label: 'Alien++', color: 'stone-900', text: 'foreground' },
  46: { label: 'Legend--', color: 'black', text: 'foreground' },
  47: { label: 'Legend-', color: 'black', text: 'foreground' },
  48: { label: 'Legend', color: 'black', text: 'foreground' },
  49: { label: 'Legend+', color: 'black', text: 'foreground' },
  50: { label: 'Legend++', color: 'black', text: 'foreground' },
  51: { label: 'Omniscient--', color: 'violet-900', text: 'foreground' },
  52: { label: 'Omniscient-', color: 'violet-900', text: 'foreground' },
  53: { label: 'Omniscient', color: 'violet-900', text: 'foreground' },
  54: { label: 'Omniscient+', color: 'violet-900', text: 'foreground' },
  55: { label: 'Omniscient++', color: 'violet-900', text: 'foreground' },
  56: { label: 'Divin--', color: 'purple-500', text: 'background' },
  57: { label: 'Divin-', color: 'purple-500', text: 'background' },
  58: { label: 'Divin', color: 'purple-500', text: 'background' },
  59: { label: 'Divin+', color: 'purple-500', text: 'background' },
  60: { label: 'Divin++', color: 'purple-500', text: 'background' },
  61: { label: 'Dragon Celeste --', color: 'red-200', text: 'background' },
  62: { label: 'Dragon Celeste -', color: 'red-200', text: 'background' },
  63: { label: 'Dragon Celeste', color: 'red-200', text: 'background' },
  64: { label: 'Dragon Celeste+', color: 'red-200', text: 'background' },
  65: { label: 'Dragon Celeste++', color: 'red-200', text: 'background' },
  66: { label: 'Éternel', color: 'yellow-500', text: 'background' },
  67: { label: 'No Life', color: 'violet-900', text: 'background' },
  68: { label: 'GOD', color: 'white', text: 'background' },
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

export type TimeCategory =
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

type SheetCell = null | { v: string | null };

type SheetRow = SheetCell[];

export type SheetData = {
  table: {
    cols: { id: string; label: string; type: string }[];
    rows: {
      c: SheetRow;
    }[];
  };
};
