export const MapGradeOptions = {
  E: { background: 'lime-3', hex: '#d9ead3', text: 'black', level: 0 },
  D: { background: 'lime-6', hex: '#93c47d', text: 'black', level: 1 },
  C: { background: 'cyan-4', hex: '#c9daf8', text: 'black', level: 2 },
  B: { background: 'blue-5', hex: '#6d9eeb', text: 'white', level: 3 },
  A: { background: 'yellow-3', hex: '#fff2cc', text: 'black', level: 4 },
  S: { background: 'amber-6', hex: '#f6b26b', text: 'black', level: 5 },
  SS: { background: 'red-5', hex: '#ff0000', text: 'black', level: 6 },
  Legend: {
    background: 'red-3',
    hex: '#cc0000',
    text: 'black',
    level: 7,
  },
  Abyssal: {
    background: 'purple-3',
    hex: '#cc0000',
    text: 'black',
    level: 8,
  },
  Omniscient: {
    background: 'deep-purple-9',
    hex: '#b4a7d6',
    text: 'white',
    level: 9,
  },
  Divin: {
    background: 'purple-5',
    hex: '#8e7cc3',
    text: 'black',
    level: 10,
  },
  God: {
    background: 'grey-9',
    hex: '#000000',
    text: 'white',
    level: 11,
  },
  'No life': {
    background: 'deep-purple-9',
    hex: '#20124d',
    text: 'white',
    level: 12,
  },
} as const

export type MapGrade = {
  label: keyof typeof MapGradeOptions
  background: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['background']
  hex: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['hex']
  text: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['text']
  level: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['level']
}

export function getMapGrade(label: keyof typeof MapGradeOptions): MapGrade {
  const mapGradeData = MapGradeOptions[label]
  return { label, ...mapGradeData }
}

export type Author = {
  id: number
  name: string
}

export type Exchange = {
  link?: string
  id?: number
  author?: Author
  thumbnail?: string
  awardCount?: number
}

export type Map = {
  label: string
  grade: MapGrade
  times: {
    noway: number
    wr: number
    alien: number
    player: number
    challenger: number
    intermediate: number
    noob: number
  }
  exchange: Exchange
  tag?: string
}

export type Player = {
  id: string
  name: string
  rawFame: {
    // Used on generate script
    noway?: string
    wr?: string
    alien?: string
    player?: string
    challenger?: string
    intermediate?: string
    noob?: string
  }
  fames: {
    noway?: Fame
    wr?: Fame
    alien?: Fame
    player?: Fame
    challenger?: Fame
    intermediate?: Fame
    noob?: Fame
  }
  category: PlayerCategory
  nbRecords?: number
}

export type PlayerCategory = 'Alien' | 'Player' | 'Novice'

const FameOptions = {
  0: { label: 'F', color: 'violet-8', text: 'black' },
  1: { label: 'E--', color: 'lime-3', text: 'black' },
  2: { label: 'E-', color: 'lime-3', text: 'black' },
  3: { label: 'E', color: 'lime-3', text: 'black' },
  4: { label: 'E+', color: 'lime-3', text: 'black' },
  5: { label: 'E++', color: 'lime-3', text: 'black' },
  6: { label: 'D--', color: 'lime-6', text: 'black' },
  7: { label: 'D-', color: 'lime-6', text: 'black' },
  8: { label: 'D', color: 'lime-6', text: 'black' },
  9: { label: 'D+', color: 'lime-6', text: 'black' },
  10: { label: 'D++', color: 'lime-6', text: 'black' },
  11: { label: 'C--', color: 'cyan-4', text: 'black' },
  12: { label: 'C-', color: 'cyan-4', text: 'black' },
  13: { label: 'C', color: 'cyan-4', text: 'black' },
  14: { label: 'C+', color: 'cyan-4', text: 'black' },
  15: { label: 'C++', color: 'cyan-4', text: 'black' },
  16: { label: 'B--', color: 'blue-5', text: 'black' },
  17: { label: 'B-', color: 'blue-5', text: 'black' },
  18: { label: 'B', color: 'blue-5', text: 'black' },
  19: { label: 'B+', color: 'blue-5', text: 'black' },
  20: { label: 'B++', color: 'blue-5', text: 'black' },
  21: { label: 'A--', color: 'yellow-3', text: 'black' },
  22: { label: 'A-', color: 'yellow-3', text: 'black' },
  23: { label: 'A', color: 'yellow-3', text: 'black' },
  24: { label: 'A+', color: 'yellow-3', text: 'black' },
  25: { label: 'A++', color: 'yellow-3', text: 'black' },
  26: { label: 'S--', color: 'amber-6', text: 'black' },
  27: { label: 'S-', color: 'amber-6', text: 'black' },
  28: { label: 'S', color: 'amber-6', text: 'black' },
  29: { label: 'S+', color: 'amber-6', text: 'black' },
  30: { label: 'S++', color: 'amber-6', text: 'black' },
  31: { label: 'SS--', color: 'red-5', text: 'black' },
  32: { label: 'SS-', color: 'red-5', text: 'black' },
  33: { label: 'SS', color: 'red-5', text: 'black' },
  34: { label: 'SS+', color: 'red-5', text: 'black' },
  35: { label: 'SS++', color: 'red-5', text: 'black' },
  36: { label: 'Mythique--', color: 'red-3', text: 'black' },
  37: { label: 'Mythique-', color: 'red-3', text: 'black' },
  38: { label: 'Mythique', color: 'red-3', text: 'black' },
  39: { label: 'Mythique+', color: 'red-3', text: 'black' },
  40: { label: 'Mythique++', color: 'red-3', text: 'black' },
  41: { label: 'Alien--', color: 'grey-9', text: 'white' },
  42: { label: 'Alien-', color: 'grey-9', text: 'white' },
  43: { label: 'Alien', color: 'grey-9', text: 'white' },
  44: { label: 'Alien+', color: 'grey-9', text: 'white' },
  45: { label: 'Alien++', color: 'grey-9', text: 'white' },
  46: { label: 'Legend--', color: 'black', text: 'white' },
  47: { label: 'Legend-', color: 'black', text: 'white' },
  48: { label: 'Legend', color: 'black', text: 'white' },
  49: { label: 'Legend+', color: 'black', text: 'white' },
  50: { label: 'Legend++', color: 'black', text: 'white' },
  51: { label: 'Abyssal--', color: 'purple-4', text: 'black' },
  52: { label: 'Abyssal-', color: 'purple-4', text: 'black' },
  53: { label: 'Abyssal', color: 'purple-4', text: 'black' },
  54: { label: 'Abyssal+', color: 'purple-4', text: 'black' },
  55: { label: 'Abyssal++', color: 'purple-4', text: 'black' },
  56: { label: 'Omniscient--', color: 'deep-purple-9', text: 'white' },
  57: { label: 'Omniscient-', color: 'deep-purple-9', text: 'white' },
  58: { label: 'Omniscient', color: 'deep-purple-9', text: 'white' },
  59: { label: 'Omniscient+', color: 'deep-purple-9', text: 'white' },
  60: { label: 'Omniscient++', color: 'deep-purple-9', text: 'white' },
  61: { label: 'Divin--', color: 'purple-5', text: 'black' },
  62: { label: 'Divin-', color: 'purple-5', text: 'black' },
  63: { label: 'Divin', color: 'purple-5', text: 'black' },
  64: { label: 'Divin+', color: 'purple-5', text: 'black' },
  65: { label: 'Divin++', color: 'purple-5', text: 'black' },
  66: { label: 'Dragon Celeste --', color: 'red-2', text: 'black' },
  67: { label: 'Dragon Celeste -', color: 'red-2', text: 'black' },
  68: { label: 'Dragon Celeste', color: 'red-2', text: 'black' },
  69: { label: 'Dragon Celeste+', color: 'red-2', text: 'black' },
  70: { label: 'Dragon Celeste++', color: 'red-2', text: 'black' },
  71: { label: 'Éternel--', color: 'yellow-5', text: 'black' },
  72: { label: 'Éternel-', color: 'yellow-5', text: 'black' },
  73: { label: 'Éternel', color: 'yellow-5', text: 'black' },
  74: { label: 'Éternel+', color: 'yellow-5', text: 'black' },
  75: { label: 'Éternel++', color: 'yellow-5', text: 'black' },
  76: { label: 'No Life', color: 'deep-purple-9', text: 'black' },
  77: { label: 'GOD', color: 'white', text: 'black' },
} as const

export type Fame = {
  level: keyof typeof FameOptions
  label: (typeof FameOptions)[keyof typeof FameOptions]['label']
  color: (typeof FameOptions)[keyof typeof FameOptions]['color']
  text: (typeof FameOptions)[keyof typeof FameOptions]['text']
}

export function getFame(nb: number): Fame {
  const level = nb as keyof typeof FameOptions
  const fameData = FameOptions[level]
  return { level, ...fameData }
}

export type TimeRecord = {
  playerId: string
  mapId: number
  time: number
  category?: TimeCategory
}

export type TimeCategory = 'Alien' | 'Player' | 'Intermediate' | 'Noob' | 'Not defined'

const LevelOptions = {
  noway: { label: 'No Way', icon: 'noway' },
  wr: { label: 'World Record', icon: 'wr' },
  alien: { label: 'Alien', icon: 'alien' },
  player: { label: 'Player', icon: 'player' },
  challenger: { label: 'Challenger', icon: 'challenger' },
  intermediate: { label: 'Intermediate', icon: 'intermediate' },
  noob: { label: 'Noob', icon: 'noob' },
} as const

export type Level = {
  level: keyof typeof LevelOptions
  label: (typeof LevelOptions)[keyof typeof LevelOptions]['label']
  icon: (typeof LevelOptions)[keyof typeof LevelOptions]['icon']
}

export function getLevel(lvl: string): Level {
  const level = lvl as keyof typeof LevelOptions
  const levelData = LevelOptions[level]
  return { level, ...levelData }
}

export type SheetCell = null | { v: string | null }

type SheetRow = SheetCell[]

export type SheetData = {
  table: {
    cols: { id: string; label: string; type: string }[]
    rows: {
      c: SheetRow
    }[]
  }
}
