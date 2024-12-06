import fs from 'fs'
import fetch from 'node-fetch'

// ## Helpers
const gradeMap = {
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
function getMapGrade(letter) {
  const mapGrade = gradeMap[letter]
  if (!mapGrade) {
    throw new Error(`Invalid grade: ${letter}`)
  }
  return mapGrade
}

function writeData(file, data) {
  // Define the output path
  const outputPath = `./public/${file}.json`

  // Write the formatted data to a JSON file
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
}

// ## Main functions
async function fetchSheetData(sheetName) {
  try {
    const response = await fetch(`https://docs.google.com/spreadsheets/d/1z1n6LfHMskAzD4N6CTNrnhyjFtgN_54TGlAyoU6eOnk/gviz/tq?tqx=out:json&sheet=${sheetName}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const text = await response.text()
    const json = JSON.parse(text.substring(47).slice(0, -2))
    return json
  } catch (err) {
    console.error('Error fetching data:', err)
  }
}

async function generateMaps() {
  try {
    const alienJson = await fetchSheetData('PvM (Aliens)')
    const noviceJson = await fetchSheetData('PvM (Novice)')
    // const maps = []

    const mapsPromises = alienJson.table.rows[2].c.map(async (cell, cellIndex) => {
      if (cellIndex <= 1 || !cell.v) return null
      let mapGrade
      for (let gradeIndex = cellIndex; gradeIndex >= 2; gradeIndex--) {
        const grade = alienJson.table.rows[1].c[gradeIndex]?.v
        if (grade) {
          mapGrade = getMapGrade(grade)
          break
        }
      }

      // Building exchange object
      const exchange = {}
      const link = alienJson.table.rows[5].c[cellIndex]?.v ?? undefined
      if (link) {
        exchange.link = link
        const match = link.match(new RegExp(/\/maps\/(\d+)\//))
        if (match && match[1]) {
          const id = match[1]
          exchange.id = id
          const authorRequest = await fetch(`https://trackmania.exchange/api/maps/get_authors/${id}`)
          const authorJson = await authorRequest.json()
          const author = authorJson[0]?.Username ?? undefined
          exchange.author = author
          exchange.thumbnail = `https://trackmania.exchange/maps/screenshot_normal/${id}`
        }
      }

      return {
        label: cell.v,
        grade: mapGrade ?? undefined,
        times: {
          alien: alienJson.table.rows[4].c[cellIndex]?.v ?? 'not found',
          player: alienJson.table.rows[3].c[cellIndex]?.v ?? 'not found',
          intermediate: noviceJson.table.rows[4].c[cellIndex]?.v ?? 'not found',
          noob: noviceJson.table.rows[3].c[cellIndex]?.v ?? 'not found',
        },
        exchange
      }
    })
    const maps = (await Promise.all(mapsPromises)).filter(x => !!x)
    writeData('maps', maps)
    console.log('Maps generated successfully!')
  } catch (error) {
    console.error('Error generating maps:', error)
  }
}


// Run the script
generateMaps()
