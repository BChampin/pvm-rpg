export interface SheetStoreContextType {
  loading: boolean
  error: string | null

  sortMethod: string
  setSortMethod: Function

  // Data
  sheetUrl: string
  staticMaps: Map[]
  maps: Map[]

  // Functions
  fetchSheetData: () => Promise<void>
  fetchMaps: () => Promise<void>
}

type MapGrade =
  | { label: 'E', background: 'lime-300', hex: '#d9ead3', text: 'black', level: 0 }
  | { label: 'D', background: 'lime-600', hex: '#93c47d', text: 'black', level: 1 }
  | { label: 'C', background: 'cyan-400', hex: '#c9daf8', text: 'black', level: 2 }
  | { label: 'B', background: 'blue-500', hex: '#6d9eeb', text: 'black', level: 3 }
  | { label: 'A', background: 'yellow-300', hex: '#fff2cc', text: 'black', level: 4 }
  | { label: 'S', background: 'amber-600', hex: '#f6b26b', text: 'black', level: 5 }
  | { label: 'SS', background: 'red-500', hex: '#ff0000', text: 'black', level: 6 }
  | { label: 'Legend', background: 'red-300', hex: '#cc0000', text: 'black', level: 7 }
  | { label: 'Omniscient', background: 'violet-900', hex: '#b4a7d6', text: 'white', level: 8 }
  | { label: 'Divin', background: 'purple-500', hex: '#8e7cc3', text: 'black', level: 9 }
  | { label: 'God', background: 'stone-900', hex: '#000000', text: 'white', level: 10 }
  | { label: 'No life', background: 'violet-900', hex: '#20124d', text: 'white', level: 11 }

const gradeMap: Record<string, MapGrade> = {
  E: { label: 'E', background: 'lime-300', hex: '#d9ead3', text: 'black', level: 0 },
  D: { label: 'D', background: 'lime-600', hex: '#93c47d', text: 'black', level: 1 },
  C: { label: 'C', background: 'cyan-400', hex: '#c9daf8', text: 'black', level: 2 },
  B: { label: 'B', background: 'blue-500', hex: '#6d9eeb', text: 'black', level: 3 },
  A: { label: 'A', background: 'yellow-300', hex: '#fff2cc', text: 'black', level: 4 },
  S: { label: 'S', background: 'amber-600', hex: '#f6b26b', text: 'black', level: 5 },
  SS: { label: 'SS', background: 'red-500', hex: '#ff0000', text: 'black', level: 6 },
  Legend: { label: 'Legend', background: 'red-300', hex: '#cc0000', text: 'black', level: 7 },
  Omniscient: { label: 'Omniscient', background: 'violet-900', hex: '#b4a7d6', text: 'white', level: 8 },
  Divin: { label: 'Divin', background: 'purple-500', hex: '#8e7cc3', text: 'black', level: 9 },
  God: { label: 'God', background: 'stone-900', hex: '#000000', text: 'white', level: 10 },
  'No life': { label: 'No life', background: 'violet-900', hex: '#20124d', text: 'white', level: 11 },
}
export function getMapGrade(letter: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'Legend' | 'Omniscient' | 'Divin' | 'God' | 'No life'): MapGrade {
  const mapGrade = gradeMap[letter]
  if (!mapGrade) {
    throw new Error(`Invalid grade: ${letter}`)
  }
  return mapGrade
}

export type Map = {
  label: string
  grade: MapGrade
  times: {
    alien: string
    player: string
    intermediate: string
    noob: string
  }
  exchange: {
    link?: string
    id?: number,
    author?: string,
    thumbnail?: string
  }
}
