import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import type {
  // Author,
  Exchange,
  Map,
  MapGradeOptions,
  Player,
  PlayerCategory,
  SheetCell,
  SheetData,
  TimeCategory,
  TimeRecord,
} from 'src/types/Sheet'
import {
  // getFame,
  getMapGrade,
} from 'src/types/Sheet'
import { getMapFromName, timeStrToNumber, uniqueStr } from 'src/utils'

export const useSheetStore = defineStore('sheet', () => {
  // Sheet
  const SHEET_URL =
    'https://docs.google.com/spreadsheets/d/1z1n6LfHMskAzD4N6CTNrnhyjFtgN_54TGlAyoU6eOnk/gviz/tq?tqx=out:json&headers=0&sheet='
  const SHEET_URL_HTML =
    'https://docs.google.com/spreadsheets/u/0/d/1z1n6LfHMskAzD4N6CTNrnhyjFtgN_54TGlAyoU6eOnk/htmlview'
  const SHEET_NAMES = [
    'PvM (Aliens)',
    'PvM (Players 1)',
    'PvM (Players 2)',
    'PvM (Players 3)',
    'PvM (Novice)',
    'PvM (Novice 2)',
    'PvM (Novice 3)',
  ]
  const sheetData = ref<SheetData[]>([])
  const loading = ref({
    maps: true,
    players: true,
    timeRecords: true,
  })
  const fetchSheetData = async (sheetName: string) => {
    try {
      const response = await fetch(`${SHEET_URL}${sheetName}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const text = await response.text()
      const json = JSON.parse(text.substring(47).slice(0, -2))
      return json
    } catch (err: unknown) {
      console.error(err)
    }
  }
  const init = async () => {
    if (sheetData.value.length) return true

    loading.value.maps = true
    loading.value.players = true
    loading.value.timeRecords = true

    const fetchPromises = SHEET_NAMES.map((sheetName) => fetchSheetData(sheetName))
    try {
      // Array of data for each sheet
      sheetData.value = await Promise.all(fetchPromises)
      await mapMaps()
      await mapPlayersAndTimes()
      return true
    } catch (error) {
      console.error('Error fetching all sheets data:', error)
    }
  }

  // TM data
  const maps = ref<Map[]>([])
  // const authors = ref<Author[]>([])
  const players = ref<Player[]>([])
  const timeRecords = ref<TimeRecord[]>([])
  const mapMaps = async () => {
    try {
      loading.value.maps = true

      const alienJson = sheetData.value[0]
      const noviceJson = sheetData.value[4]
      if (
        !alienJson ||
        !noviceJson ||
        !alienJson.table.rows[0] ||
        !alienJson.table.rows[1] ||
        !alienJson.table.rows[2] ||
        !alienJson.table.rows[3] ||
        !alienJson.table.rows[4] ||
        !alienJson.table.rows[5] ||
        !alienJson.table.rows[6] ||
        !noviceJson.table.rows[3] ||
        !noviceJson.table.rows[4]
      )
        throw new Error('No data found')

      const mapsPromises: Promise<Map>[] = alienJson.table.rows[2].c
        .map((cell: SheetCell, cellIndex: number) => {
          if (cellIndex <= 1 || !cell || !cell.v) return undefined
          return new Promise<Map>((resolve) => {
            let mapGrade
            for (let gradeIndex = cellIndex; gradeIndex >= 2; gradeIndex--) {
              const grade = alienJson.table.rows[1]?.c[gradeIndex]
                ?.v as keyof typeof MapGradeOptions
              if (grade) {
                mapGrade = getMapGrade(grade)
                break
              }
            }

            // Building exchange object
            const exchange: Exchange = {}
            let link = alienJson.table.rows[7]?.c[cellIndex]?.v ?? undefined
            if (link) {
              // Special not properly formatted links
              if (link === 'https://trackmania.exchange/tracks/view/205627/rpg-inside') {
                link = 'https://trackmania.exchange/maps/205627/rpg-inside'
              } else if (link === 'https://trackmania.exchange/tracks/view/117963') {
                link = 'https://trackmania.exchange/maps/117963/rpg-quandary-islands'
              }

              exchange.link = link
              const match = link.match(new RegExp(/\/maps\/(\d+)\//))
              if (match && match[1]) {
                const id = Number(match[1])
                exchange.id = id
                // const authorRequest = await fetch(
                //   `https://trackmania.exchange/legacymapauthors/${id}`
                // )
                // const authorJson = await authorRequest.json()
                // const author = authorJson[0]
                //   ? {
                //       id: authorJson[0].UserID,
                //       username: authorJson[0].Username,
                //     }
                //   : undefined
                // if (author) authors.push(author)
                // exchange.author = author
                exchange.thumbnail = `https://trackmania.exchange/mapimage/${id}`
              }
            }
            resolve({
              label: cell.v,
              grade: mapGrade ?? getMapGrade('E'),
              times: {
                noway: alienJson.table.rows[6]?.c[cellIndex]?.v
                  ? timeStrToNumber(alienJson.table.rows[6]?.c[cellIndex].v)
                  : 9999999,
                wr: alienJson.table.rows[5]?.c[cellIndex]?.v
                  ? timeStrToNumber(alienJson.table.rows[5]?.c[cellIndex].v)
                  : 9999999,
                alien: alienJson.table.rows[4]?.c[cellIndex]?.v
                  ? timeStrToNumber(alienJson.table.rows[4]?.c[cellIndex].v)
                  : 9999999,
                player: alienJson.table.rows[3]?.c[cellIndex]?.v
                  ? timeStrToNumber(alienJson.table.rows[3].c[cellIndex].v)
                  : 9999999,
                challenger: noviceJson.table.rows[5]?.c[cellIndex]?.v
                  ? timeStrToNumber(noviceJson.table.rows[5]?.c[cellIndex].v)
                  : 9999999,
                intermediate: noviceJson.table.rows[4]?.c[cellIndex]?.v
                  ? timeStrToNumber(noviceJson.table.rows[4]?.c[cellIndex].v)
                  : 9999999,
                noob: noviceJson.table.rows[3]?.c[cellIndex]?.v
                  ? timeStrToNumber(noviceJson.table.rows[3]?.c[cellIndex].v)
                  : 9999999,
              },
              exchange,
              tag: alienJson.table.rows[0]?.c[cellIndex]?.v ?? undefined,
            } as Map)
          })
        })
        .filter((promise): promise is Promise<Map> => promise !== undefined)

      // Now fetch in one-go all map-related data
      // const bigQuery = await fetch(
      //   `https://trackmania.exchange/api/maps?count=${maps.length}&id=${maps.map((m) => m.exchange.id)}&fields=${encodeURIComponent('Uploader.Name,Uploader.UserId,AwardCount')}`
      // )
      // const bigQueryJson = await bigQuery.json()
      // console.log('bigQueryJson', bigQueryJson)
      // if (bigQueryJson.Results) {
      //   for (const result of bigQueryJson.Results) {
      //     const relatedMap = maps.find((m) => m.exchange.id === result.MapId)
      //     if (relatedMap) {
      //       relatedMap.exchange.awardCount = result.AwardCount ?? undefined
      //       const author = {
      //         id: result.Uploader.UserId,
      //         name: result.Uploader.Name,
      //       }
      //       authors.value.push(author)
      //       relatedMap.exchange.author = author
      //     }
      //   }
      // }
      maps.value = await Promise.all(mapsPromises)
      return maps
    } catch (error) {
      console.error('Error mapping maps:', error)
    } finally {
      loading.value.maps = false
    }
  }
  const mapPlayersAndTimes = async () => {
    try {
      loading.value.players = true
      loading.value.timeRecords = true

      if (!sheetData.value[0] || !sheetData.value[0].table.rows[2]) throw new Error('No data found')

      // Gather maps
      const mapsIdFromCol: { [key: number]: Map } = {}
      for (const [mapColIndex, mapName] of sheetData.value[0].table.rows[2].c.entries()) {
        if (mapName && mapName.v) {
          const map = getMapFromName(maps.value, mapName.v)
          if (map) mapsIdFromCol[mapColIndex] = map
        }
      }

      // Setup
      const playersTmp: Player[] = []
      const timeRegex = /^\d{2,3}:\d{2}\.\d{3}$/
      const playersCategories = [
        'Alien',
        'Player',
        'Player',
        'Player',
        'Novice',
        'Novice',
        'Novice',
      ]

      for (let sheetIndex = 0; sheetIndex < sheetData.value.length; sheetIndex++) {
        const sheet = sheetData.value[sheetIndex]
        if (!sheet) continue
        for (const [rowIndex, row] of sheet.table.rows.entries()) {
          if (rowIndex < (sheetIndex ? 7 : 9 /* Alien skips more rows */) || !row.c[1]?.v || row.c[1]?.v === '/') continue // Skip header or empty row
          const playerId = uniqueStr()
          const player: Player = {
            name: row.c[1].v,
            category: playersCategories[sheetIndex] as PlayerCategory,
            id: playerId,
            rawFame: {},
            fames: {},
          }
          playersTmp.push(player)
          for (const [cellColIndex, cell] of row.c.entries()) {
            if (cell && cell.v && cellColIndex > 1) {
              const currentMap: Map | undefined = mapsIdFromCol[cellColIndex]
              if (!timeRegex.test(cell.v) || !currentMap) continue
              const time = timeStrToNumber(cell.v)
              const mapCategory = [
                'No Way',
                'World Record',
                'Alien',
                'Player',
                'Challenger',
                'Intermediate',
                'Noob',
                'Not defined',
              ][
                [
                  currentMap.times.noway,
                  currentMap.times.wr,
                  currentMap.times.alien,
                  currentMap.times.player,
                  currentMap.times.challenger,
                  currentMap.times.intermediate,
                  currentMap.times.noob,
                ].findIndex((threshold) => time < threshold) ?? 4
              ]
              timeRecords.value.push({
                playerId,
                mapId: currentMap.exchange.id ?? 0,
                time,
                category: mapCategory as TimeCategory,
              })
            }
          }
        }
      }

      loading.value.players = false

      // Getting fame
      // Will be translated on website from rawFame to fame
      const fameJson = await fetchSheetData('Wall of Fame')
      for (const [rowIndex, row] of fameJson.table.rows.entries()) {
        if (rowIndex && !row.c[1] && !row.c[5]) continue // Quick shutp up ts with rowIndex
        const playerLeft = row.c[1] ? row.c[1].v : '/'
        const playerRight = row.c[5] ? row.c[5].v : '/'
        if (playerLeft === '/' && playerRight === '/') continue

        if (playerLeft !== '/') {
          const findPlayerIndex = playersTmp.findIndex((p) => p.name === playerLeft)
          if (findPlayerIndex && playersTmp[findPlayerIndex]) {
            playersTmp[findPlayerIndex].rawFame = {
              player: row.c[2].v ?? undefined,
              alien: row.c[3].v ?? undefined,
            }
          }
        }

        if (playerRight !== '/') {
          const findPlayerIndex = playersTmp.findIndex((p) => p.name === playerRight)
          if (findPlayerIndex && playersTmp[findPlayerIndex]) {
            playersTmp[findPlayerIndex].rawFame = {
              noob: row.c[6].v ?? undefined,
              intermediate: row.c[7].v ?? undefined,
              challenger: row.c[8].v ?? undefined,
            }
          }
        }
      }

      players.value = playersTmp.filter((x) => !!x)
    } catch (error) {
      console.error('Error mapping players and times:', error)
    } finally {
      loading.value.players = false
      loading.value.timeRecords = false
    }
  }

  return {
    // Sheet
    SHEET_URL_HTML,
    loading,
    init,

    // TM data
    maps,
    players,
    timeRecords,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSheetStore, import.meta.hot))
}
