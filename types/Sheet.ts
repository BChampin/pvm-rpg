export interface SheetStoreContextType {
  loading: boolean
  error: string | null

  sortMethod: string
  setSortMethod: Function

  // Data
  sheetUrl: string
  staticMaps: Map[]
  maps: Map[]
  players: Player[]
  timeRecords: TimeRecord[]

  // Functions
  fetchSheetData: (sheetName: string) => Promise<void>
  fetchMaps: () => Promise<void>
  fetchPlayers: () => Promise<void>
  fetchTimeRecords: () => Promise<void>
  timeNumberToStr: (time: number) => string
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
  Omniscient: { background: 'violet-900', hex: '#b4a7d6', text: 'white', level: 8 },
  Divin: { background: 'purple-500', hex: '#8e7cc3', text: 'black', level: 9 },
  God: { background: 'stone-900', hex: '#000000', text: 'white', level: 10 },
  'No life': { background: 'violet-900', hex: '#20124d', text: 'white', level: 11 },
} as const

export type MapGrade = {
  label: keyof typeof MapGradeOptions
  background: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['background']
  hex: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['hex']
  text: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['text']
  level: (typeof MapGradeOptions)[keyof typeof MapGradeOptions]['level']
}

export function getMapGrade(label: keyof typeof MapGradeOptions): MapGrade {
  const mapGradeData = MapGradeOptions[label as keyof typeof MapGradeOptions]
  return { label, ...mapGradeData }
}


export type Map = {
  label: string
  grade: MapGrade
  times: {
    alien: number
    player: number
    intermediate: number
    noob: number
  }
  exchange: {
    link?: string
    id?: number,
    author?: string,
    thumbnail?: string
  }
}


export type Player = {
  id: string
  name: string
  rawFame: { // Used on generate script
    alien?: string
    player?: string
    intermediate?: string
    noob?: string
  }
  fames: {
    alien?: Fame
    player?: Fame
    intermediate?: Fame
    noob?: Fame
  }
  category: PlayerCategory
}

export type PlayerCategory =
  | 'Alien'
  | 'Player'
  | 'Novice'


const FameOptions = {
  0: { label: 'F', color: 'violet-800' },
  1: { label: 'E--', color: 'lime-300' },
  2: { label: 'E-', color: 'lime-300' },
  3: { label: 'E', color: 'lime-300' },
  4: { label: 'E+', color: 'lime-300' },
  5: { label: 'E++', color: 'lime-300' },
  6: { label: 'D--', color: 'lime-600' },
  7: { label: 'D-', color: 'lime-600' },
  8: { label: 'D', color: 'lime-600' },
  9: { label: 'D+', color: 'lime-600' },
  10: { label: 'D++', color: 'lime-600' },
  11: { label: 'C--', color: 'cyan-400' },
  12: { label: 'C-', color: 'cyan-400' },
  13: { label: 'C', color: 'cyan-400' },
  14: { label: 'C+', color: 'cyan-400' },
  15: { label: 'C++', color: 'cyan-400' },
  16: { label: 'B--', color: 'blue-500' },
  17: { label: 'B-', color: 'blue-500' },
  18: { label: 'B', color: 'blue-500' },
  19: { label: 'B+', color: 'blue-500' },
  20: { label: 'B++', color: 'blue-500' },
  21: { label: 'A--', color: 'yellow-300' },
  22: { label: 'A-', color: 'yellow-300' },
  23: { label: 'A', color: 'yellow-300' },
  24: { label: 'A+', color: 'yellow-300' },
  25: { label: 'A++', color: 'yellow-300' },
  26: { label: 'S--', color: 'amber-600' },
  27: { label: 'S-', color: 'amber-600' },
  28: { label: 'S', color: 'amber-600' },
  29: { label: 'S+', color: 'amber-600' },
  30: { label: 'S++', color: 'amber-600' },
  31: { label: 'SS--', color: 'red-500' },
  32: { label: 'SS-', color: 'red-500' },
  33: { label: 'SS', color: 'red-500' },
  34: { label: 'SS+', color: 'red-500' },
  35: { label: 'SS++', color: 'red-500' },
  36: { label: 'Mythique--', color: 'red-300' },
  37: { label: 'Mythique-', color: 'red-300' },
  38: { label: 'Mythique', color: 'red-300' },
  39: { label: 'Mythique+', color: 'red-300' },
  40: { label: 'Mythique++', color: 'red-300' },
  41: { label: 'Alien--', color: 'stone-900' },
  42: { label: 'Alien-', color: 'stone-900' },
  43: { label: 'Alien', color: 'stone-900' },
  44: { label: 'Alien+', color: 'stone-900' },
  45: { label: 'Alien++', color: 'stone-900' },
  46: { label: 'Legend--', color: 'black' },
  47: { label: 'Legend-', color: 'black' },
  48: { label: 'Legend', color: 'black' },
  49: { label: 'Legend+', color: 'black' },
  50: { label: 'Legend++', color: 'black' },
  51: { label: 'Omniscient--', color: 'violet-900' },
  52: { label: 'Omniscient-', color: 'violet-900' },
  53: { label: 'Omniscient', color: 'violet-900' },
  54: { label: 'Omniscient+', color: 'violet-900' },
  55: { label: 'Omniscient++', color: 'violet-900' },
  56: { label: 'Divin--', color: 'purple-500' },
  57: { label: 'Divin-', color: 'purple-500' },
  58: { label: 'Divin', color: 'purple-500' },
  59: { label: 'Divin+', color: 'purple-500' },
  60: { label: 'Divin++', color: 'purple-500' },
  61: { label: 'Dragon Celeste --', color: 'red-200' },
  62: { label: 'Dragon Celeste -', color: 'red-200' },
  63: { label: 'Dragon Celeste', color: 'red-200' },
  64: { label: 'Dragon Celeste+', color: 'red-200' },
  65: { label: 'Dragon Celeste++', color: 'red-200' },
  66: { label: 'Éternel', color: 'yellow-500' },
  67: { label: 'No Life', color: 'violet-900' },
  68: { label: 'GOD', color: 'white' },
} as const

export type Fame = {
  level: keyof typeof FameOptions
  label: (typeof FameOptions)[keyof typeof FameOptions]['label']
  color: (typeof FameOptions)[keyof typeof FameOptions]['color']
}

export function getFame(level: keyof typeof FameOptions): Fame {
  const fameData = FameOptions[level as keyof typeof FameOptions]
  return { level, ...fameData }
}

export type TimeRecord = {
  playerId: string
  mapId: number
  time: string
  category?: TimeCategory
}

type TimeCategory =
 | 'Alien'
 | 'Player'
 | 'Intermediate'
 | 'Noob'
 | 'Not defined'
