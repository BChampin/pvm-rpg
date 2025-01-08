import fetch from 'node-fetch';
import fs from 'fs';

// ## Helpers
const gradeMap = {
  E: {
    label: 'E',
    background: 'lime-300',
    hex: '#d9ead3',
    text: 'black',
    level: 0,
  },
  D: {
    label: 'D',
    background: 'lime-600',
    hex: '#93c47d',
    text: 'black',
    level: 1,
  },
  C: {
    label: 'C',
    background: 'cyan-400',
    hex: '#c9daf8',
    text: 'black',
    level: 2,
  },
  B: {
    label: 'B',
    background: 'blue-500',
    hex: '#6d9eeb',
    text: 'black',
    level: 3,
  },
  A: {
    label: 'A',
    background: 'yellow-300',
    hex: '#fff2cc',
    text: 'black',
    level: 4,
  },
  S: {
    label: 'S',
    background: 'amber-600',
    hex: '#f6b26b',
    text: 'black',
    level: 5,
  },
  SS: {
    label: 'SS',
    background: 'red-500',
    hex: '#ff0000',
    text: 'black',
    level: 6,
  },
  Legend: {
    label: 'Legend',
    background: 'red-300',
    hex: '#cc0000',
    text: 'black',
    level: 7,
  },
  Omniscient: {
    label: 'Omniscient',
    background: 'violet-900',
    hex: '#b4a7d6',
    text: 'white',
    level: 8,
  },
  Divin: {
    label: 'Divin',
    background: 'purple-500',
    hex: '#8e7cc3',
    text: 'black',
    level: 9,
  },
  God: {
    label: 'God',
    background: 'stone-900',
    hex: '#000000',
    text: 'white',
    level: 10,
  },
  'No life': {
    label: 'No life',
    background: 'violet-900',
    hex: '#20124d',
    text: 'white',
    level: 11,
  },
};
function getMapGrade(letter) {
  const mapGrade = gradeMap[letter];
  if (!mapGrade) {
    throw new Error(`Invalid grade: ${letter}`);
  }
  return mapGrade;
}

function readData(file) {
  return JSON.parse(fs.readFileSync(`./public/data/${file}.json`));
}

function writeData(file, data) {
  fs.writeFileSync(`./public/data/${file}.json`, JSON.stringify(data));
}

function uniqueStr() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
}

function getMapFromName(arr, name) {
  return arr.find((item) => item.label === name);
}

function timeStrToNumber(time) {
  const [minutes, seconds] = time.split(':');
  const [sec, millis] = seconds.split('.');
  return (
    parseInt(minutes) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(millis)
  );
}

// ## Main functions
async function fetchSheetData(sheetName) {
  try {
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/1z1n6LfHMskAzD4N6CTNrnhyjFtgN_54TGlAyoU6eOnk/gviz/tq?tqx=out:json&sheet=${sheetName}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    return json;
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

async function generateMaps() {
  console.log('>> Generating maps ...');
  try {
    const alienJson = await fetchSheetData('PvM (Aliens)');
    const noviceJson = await fetchSheetData('PvM (Novice)');

    const mapsPromises = alienJson.table.rows[2].c.map(
      async (cell, cellIndex) => {
        if (cellIndex <= 1 || !cell.v) return null;
        let mapGrade;
        for (let gradeIndex = cellIndex; gradeIndex >= 2; gradeIndex--) {
          const grade = alienJson.table.rows[1].c[gradeIndex]?.v;
          if (grade) {
            mapGrade = getMapGrade(grade);
            break;
          }
        }

        // Building exchange object
        const exchange = {};
        let link = alienJson.table.rows[5].c[cellIndex]?.v ?? undefined;
        if (link) {
          // Special not properly formatted links
          if (
            link === 'https://trackmania.exchange/tracks/view/205627/rpg-inside'
          ) {
            link = 'https://trackmania.exchange/maps/205627/rpg-inside';
          } else if (
            link === 'https://trackmania.exchange/tracks/view/117963'
          ) {
            link =
              'https://trackmania.exchange/maps/117963/rpg-quandary-islands';
          }

          exchange.link = link;
          const match = link.match(new RegExp(/\/maps\/(\d+)\//));
          if (match && match[1]) {
            const id = Number(match[1]);
            exchange.id = id;
            const authorRequest = await fetch(
              `https://trackmania.exchange/legacymapauthors/${id}`
            );
            const authorJson = await authorRequest.json();
            const author = authorJson[0]
              ? {
                  id: authorJson[0].UserID,
                  username: authorJson[0].Username,
                }
              : undefined;
            exchange.author = author;
            exchange.thumbnail = `https://trackmania.exchange/mapimage/${id}`;
          }
        }

        return {
          label: cell.v,
          grade: mapGrade ?? undefined,
          times: {
            alien: timeStrToNumber(alienJson.table.rows[4].c[cellIndex]?.v),
            player: timeStrToNumber(alienJson.table.rows[3].c[cellIndex]?.v),
            intermediate: timeStrToNumber(
              noviceJson.table.rows[4].c[cellIndex]?.v
            ),
            noob: timeStrToNumber(noviceJson.table.rows[3].c[cellIndex]?.v),
          },
          exchange,
        };
      }
    );
    const maps = (await Promise.all(mapsPromises)).filter((x) => !!x);
    writeData('maps', maps);
    console.log(`Maps generated successfully! - ${maps.length} maps`);
  } catch (error) {
    console.error('Error generating maps:', error);
  }
}

async function generatePlayers() {
  console.log('>> Generating players ...');
  try {
    // Gather maps
    const mapsIdFromCol = {};
    const maps = readData('maps');
    const alienJson = await fetchSheetData('PvM (Aliens)');
    for (const [mapColIndex, mapName] of alienJson.table.rows[2].c.entries()) {
      if (mapName && mapName.v) {
        const map = getMapFromName(maps, mapName.v);
        if (map) mapsIdFromCol[mapColIndex] = map;
      }
    }

    // Setup
    const times = [];
    const players = [];
    const timeRegex = /^\d{2,3}:\d{2}\.\d{3}$/;
    const sheets = [
      { playerCategory: 'Alien', name: 'PvM (Aliens)' },
      { playerCategory: 'Player', name: 'PvM (Players)' },
      { playerCategory: 'Player', name: 'PvM (Players 2)' },
      { playerCategory: 'Player', name: 'PvM (Players 3)' },
      { playerCategory: 'Novice', name: 'PvM (Novice)' },
      { playerCategory: 'Novice', name: 'PvM (Novice 2)' },
      { playerCategory: 'Novice', name: 'PvM (Novice 3)' },
    ];
    for (const sheet of sheets) {
      const sheetJson = await fetchSheetData(sheet.name);
      for (const [rowIndex, row] of sheetJson.table.rows.entries()) {
        if (rowIndex < 6 || !row.c[1].v || row.c[1].v === '/') continue; // Skip header or empty row
        const playerId = uniqueStr();
        const player = {
          name: row.c[1].v,
          category: sheet.playerCategory,
          id: playerId,
          rawFame: {},
        };
        players.push(player);
        for (const [cellColIndex, cell] of row.c.entries()) {
          if (cell && cell.v && cellColIndex > 1) {
            const currentMap = mapsIdFromCol[cellColIndex];
            if (!timeRegex.test(cell.v)) continue;
            const time = timeStrToNumber(cell.v);
            const mapCategory = [
              'Alien',
              'Player',
              'Intermediate',
              'Noob',
              'Not defined',
            ][
              [
                currentMap.times.alien,
                currentMap.times.player,
                currentMap.times.intermediate,
                currentMap.times.noob,
              ].findIndex((threshold) => time < threshold) ?? 4
            ];
            times.push({
              playerId,
              mapId: currentMap.exchange.id,
              time,
              category: mapCategory,
            });
          }
        }
      }
    }

    // Getting fame
    // Will be translated on website from rawFame to fame
    const fameJson = await fetchSheetData('Wall of Fame');
    for (const [rowIndex, row] of fameJson.table.rows.entries()) {
      if (!row.c[1] && !row.c[5]) continue;
      const playerLeft = row.c[1] ? row.c[1].v : '/';
      const playerRight = row.c[5] ? row.c[5].v : '/';
      if (playerLeft === '/' && playerRight === '/') continue;

      if (playerLeft !== '/') {
        const findPlayerIndex = players.findIndex((p) => p.name === playerLeft);
        if (findPlayerIndex) {
          players[findPlayerIndex].rawFame = {
            player: row.c[2].v ?? undefined,
            alien: row.c[3].v ?? undefined,
          };
        }
      }

      if (playerRight !== '/') {
        const findPlayerIndex = players.findIndex(
          (p) => p.name === playerRight
        );
        if (findPlayerIndex) {
          players[findPlayerIndex].rawFame = {
            noob: row.c[6].v ?? undefined,
            intermediate: row.c[7].v ?? undefined,
          };
        }
      }
    }

    writeData('times', times);
    console.log(`Times generated successfully! - ${times.length} times`);
    writeData('players', players);
    console.log(`Players generated successfully! - ${players.length} players`);
  } catch (error) {
    console.error('Error generating Players:', error);
  }
}

function setCurrentDataUpdateTimestamp() {
  const currentTimestamp = new Date().toISOString();
  fs.readFile('.env', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading .env file:', err);
      return;
    }

    const updatedData = data
      .split('\n')
      .map((line) => {
        if (line.startsWith('NEXT_PUBLIC_DATA_UPDATE_TIMESTAMP=')) {
          return `NEXT_PUBLIC_DATA_UPDATE_TIMESTAMP=${currentTimestamp}`;
        }
        return line;
      })
      .join('\n');

    // Write the updated content back to the .env file
    fs.writeFile('.env', updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to .env file:', err);
      } else {
        console.log(
          'Updated NEXT_PUBLIC_DATA_UPDATE_TIMESTAMP to:',
          currentTimestamp
        );
      }
    });
  });
}

// Run the script
generateMaps();
generatePlayers();
setCurrentDataUpdateTimestamp();
