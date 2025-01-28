'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Author,
  Exchange,
  Map,
  MapGradeOptions,
  Player,
  PlayerCategory,
  SheetData,
  SheetStoreContextType,
  TimeCategory,
  TimeRecord,
  getFame,
  getMapGrade,
} from '@/types/Sheet';
import { getMapFromName, timeStrToNumber, uniqueStr } from '@/utils';

const SheetStoreContext = createContext<SheetStoreContextType | undefined>(
  undefined
);

export const SheetStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Data
  const [sheetUrl, setSheetUrl] = useState<string>(
    process.env.NEXT_PUBLIC_SHEET_URL ?? ''
  );
  const [maps, setMaps] = useState<Map[]>([]);
  const [sheetData, setSheetData] = useState([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [staticMaps, setStaticMaps] = useState<Map[]>([]);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [sortMethod, setSortMethod] = useState<string>('grade.ascending');
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);

  // const [loading, setLoading] = useState<boolean>(true);
  // const [loadingMaps, setLoadingMaps] = useState<boolean>(true);
  // const [loadingPlayers, setLoadingPlayers] = useState<boolean>(true);
  // const [loadingTimeRecords, setLoadingTimeRecords] = useState<boolean>(true);

  const [loading, setLoading] = useState<object>({
    global: true,
    maps: true,
    players: true,
    timeRecords: true,
  });
  // Function to set loading state for a specific data type
  const setLoadingState = (dataType: string, isLoading: boolean) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [dataType]: isLoading,
    }));
  };

  const fetchSheetData = async (sheetName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${sheetUrl}${sheetName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      const json = JSON.parse(text.substring(47).slice(0, -2));
      return json;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaticData = async (file: string) => {
    try {
      const responseFile = await fetch(`/data/${file}.json`);
      return await responseFile.json();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Functions
  // const fetchMaps = async (live = false) => {
  //   let maps: Map[] = [];
  //   if (!live) {
  //     maps = await fetchStaticData('maps');
  //   } else {
  //     const alienJson = await fetchSheetData('PvM (Aliens)');
  //     const noviceJson = await fetchSheetData('PvM (Novice)');
  //     alienJson.table.rows[2].c.map((cell: any, cellIndex: number) => {
  //       if (cellIndex <= 1 || !cell.v) return null;
  //       let mapGrade = getMapGrade('E');
  //       for (let gradeIndex = cellIndex; gradeIndex >= 2; gradeIndex--) {
  //         const grade = alienJson.table.rows[1].c[gradeIndex]?.v;
  //         if (grade) {
  //           mapGrade = getMapGrade(grade);
  //           break;
  //         }
  //       }
  //       maps.push({
  //         label: cell.v,
  //         grade: mapGrade,
  //         times: {
  //           alien: alienJson.table.rows[4].c[cellIndex]?.v ?? 'not found',
  //           player: alienJson.table.rows[3].c[cellIndex]?.v ?? 'not found',
  //           intermediate:
  //             noviceJson.table.rows[4].c[cellIndex]?.v ?? 'not found',
  //           noob: noviceJson.table.rows[3].c[cellIndex]?.v ?? 'not found',
  //         },
  //         exchange: {
  //           link: alienJson.table.rows[5].c[cellIndex]?.v ?? 'not found',
  //         },
  //       });
  //     });
  //   }
  //   setStaticMaps(maps.filter((x) => !!x));
  // };

  const sortMapsFunction = () => {
    const copyFrom = [...staticMaps];
    switch (sortMethod) {
      case 'grade.ascending':
        copyFrom.sort((a, b) => a.grade.level - b.grade.level);
        break;
      case 'grade.descending':
        copyFrom.sort((a, b) => b.grade.level - a.grade.level);
        break;
      case 'alphabetical.ascending':
        copyFrom.sort((a, b) => a.label.localeCompare(b.label));
        break;
      case 'alphabetical.descending':
        copyFrom.sort((a, b) => b.label.localeCompare(a.label));
        break;
      case 'duration.ascending':
        copyFrom.sort((a, b) => a.times.alien - b.times.alien);
        break;
      case 'duration.descending':
        copyFrom.sort((a, b) => b.times.alien - a.times.alien);
        break;
    }
    setMaps(copyFrom);
  };

  const fetchPlayers = async (live = false) => {
    let players: Player[] = [];
    if (!live) {
      players = await fetchStaticData('players');
    } else {
      players = [];
    }

    if (timeRecords.length && staticMaps.length) {
      for (const player of players) {
        const playerTimes = timeRecords.filter(
          (timeRecord) => timeRecord.playerId === player.id
        );
        const famesMap = {
          alien: 0,
          player: 0,
          intermediate: 0,
          noob: 0,
        };
        player.nbRecords = playerTimes.length;
        for (const map of staticMaps) {
          const mapRecord = playerTimes.find(
            (timeRecord) => timeRecord.mapId === map.exchange.id
          );
          if (mapRecord) {
            famesMap.alien += Number(mapRecord.time <= map.times.alien);
            famesMap.player += Number(mapRecord.time <= map.times.player);
            famesMap.intermediate += Number(
              mapRecord.time <= map.times.intermediate
            );
            famesMap.noob += Number(mapRecord.time <= map.times.noob);
          }
        }
        player.fames = {
          alien: getFame(famesMap.alien),
          player: getFame(famesMap.player),
          intermediate: getFame(famesMap.intermediate),
          noob: getFame(famesMap.noob),
        };
      }
    }

    setPlayers(players.filter((x) => !!x));
  };

  const fetchTimeRecords = async (live = false) => {
    let timeRecords: TimeRecord[] = [];
    if (!live) {
      timeRecords = await fetchStaticData('times');
    } else {
      timeRecords = [];
    }
    setTimeRecords(timeRecords.filter((x) => !!x));
  };

  // DYNAMIC THIGNS
  const mapMaps = async (alienJson: SheetData, noviceJson: SheetData) => {
    try {
      setLoadingState('maps', true);

      const mapsPromises: Promise<Map | null>[] = alienJson.table.rows[2].c.map(
        async (cell, cellIndex) => {
          if (cellIndex <= 1 || !cell || !cell.v) return null;
          let mapGrade;
          for (let gradeIndex = cellIndex; gradeIndex >= 2; gradeIndex--) {
            const grade = alienJson.table.rows[1].c[gradeIndex]
              ?.v as keyof typeof MapGradeOptions;
            if (grade) {
              mapGrade = getMapGrade(grade);
              break;
            }
          }

          // Building exchange object
          const exchange: Exchange = {};
          let link = alienJson.table.rows[5].c[cellIndex]?.v ?? undefined;
          if (link) {
            // Special not properly formatted links
            if (
              link ===
              'https://trackmania.exchange/tracks/view/205627/rpg-inside'
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
              // const authorRequest = await fetch(
              //   `https://trackmania.exchange/legacymapauthors/${id}`
              // );
              // const authorJson = await authorRequest.json();
              // const author = authorJson[0]
              //   ? {
              //       id: authorJson[0].UserID,
              //       username: authorJson[0].Username,
              //     }
              //   : undefined;
              // if (author) authors.push(author);
              // exchange.author = author;
              exchange.thumbnail = `https://trackmania.exchange/mapimage/${id}`;
            }
          }

          return {
            label: cell.v,
            grade: mapGrade ?? getMapGrade('E'),
            times: {
              alien: alienJson.table.rows[4].c[cellIndex]?.v
                ? timeStrToNumber(alienJson.table.rows[4].c[cellIndex].v)
                : 9999999,
              player: alienJson.table.rows[3].c[cellIndex]?.v
                ? timeStrToNumber(alienJson.table.rows[3].c[cellIndex].v)
                : 9999999,
              intermediate: noviceJson.table.rows[4].c[cellIndex]?.v
                ? timeStrToNumber(noviceJson.table.rows[4].c[cellIndex].v)
                : 9999999,
              noob: noviceJson.table.rows[3].c[cellIndex]?.v
                ? timeStrToNumber(noviceJson.table.rows[3].c[cellIndex].v)
                : 9999999,
            },
            exchange,
            tag: alienJson.table.rows[0].c[cellIndex]?.v ?? undefined,
          };
        }
      );
      const maps: Map[] = (await Promise.all(mapsPromises)).filter((x) => !!x);
      const authors: Author[] = [];

      // Now fetch in one-go all map-related data
      // const bigQuery = await fetch(
      //   `https://trackmania.exchange/api/maps?count=${maps.length}&id=${maps.map((m) => m.exchange.id)}&fields=${encodeURIComponent('Uploader.Name,Uploader.UserId,AwardCount')}`
      // );
      // const bigQueryJson = await bigQuery.json();
      // console.log('bigQueryJson', bigQueryJson);
      // if (bigQueryJson.Results) {
      //   for (const result of bigQueryJson.Results) {
      //     const relatedMap = maps.find((m) => m.exchange.id === result.MapId)
      //     if (relatedMap) {
      //       relatedMap.exchange.awardCount = result.AwardCount ?? undefined;
      //       const author = {
      //         id: result.Uploader.UserId,
      //         name: result.Uploader.Name,
      //       };
      //       authors.push(author);
      //       relatedMap.exchange.author = author;
      //     }
      //   }
      // }
      setStaticMaps(maps);
      setAuthors(authors);
      return maps;
    } catch (error) {
      console.error('Error mapping maps:', error);
    } finally {
      setLoadingState('maps', false);
    }
  };

  const mapPlayersAndTimes = async (sheets: SheetData[], maps: Map[]) => {
    try {
      setLoadingState('players', true);
      setLoadingState('timeRecords', true);

      // Gather maps
      const mapsIdFromCol: { [key: number]: Map } = {};
      for (const [
        mapColIndex,
        mapName,
      ] of sheets[0].table.rows[2].c.entries()) {
        if (mapName && mapName.v) {
          const map = getMapFromName(maps, mapName.v);
          if (map) mapsIdFromCol[mapColIndex] = map;
        }
      }

      // Setup
      const players: Player[] = [];
      const times: TimeRecord[] = [];
      const timeRegex = /^\d{2,3}:\d{2}\.\d{3}$/;
      const playersCategories = [
        'Alien',
        'Player',
        'Player',
        'Player',
        'Novice',
        'Novice',
        'Novice',
      ];

      for (let sheetIndex = 0; sheetIndex < sheets.length; sheetIndex++) {
        const sheet = sheets[sheetIndex];
        for (const [rowIndex, row] of sheet.table.rows.entries()) {
          if (rowIndex < 6 || !row.c[1]?.v || row.c[1]?.v === '/') continue; // Skip header or empty row
          const playerId = uniqueStr();
          const player: Player = {
            name: row.c[1].v,
            category: playersCategories[sheetIndex] as PlayerCategory,
            id: playerId,
            rawFame: {},
            fames: {},
          };
          players.push(player);
          for (const [cellColIndex, cell] of row.c.entries()) {
            if (cell && cell.v && cellColIndex > 1) {
              const currentMap: Map = mapsIdFromCol[cellColIndex];
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
                mapId: currentMap.exchange.id ?? 0,
                time,
                category: mapCategory as TimeCategory,
              });
            }
          }
        }
      }

      setLoadingState('players', false);

      // Getting fame
      // Will be translated on website from rawFame to fame
      const fameJson = await fetchSheetData('Wall of Fame');
      for (const [rowIndex, row] of fameJson.table.rows.entries()) {
        if (!row.c[1] && !row.c[5]) continue;
        const playerLeft = row.c[1] ? row.c[1].v : '/';
        const playerRight = row.c[5] ? row.c[5].v : '/';
        if (playerLeft === '/' && playerRight === '/') continue;

        if (playerLeft !== '/') {
          const findPlayerIndex = players.findIndex(
            (p) => p.name === playerLeft
          );
          if (findPlayerIndex && players[findPlayerIndex]) {
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
          if (findPlayerIndex && players[findPlayerIndex]) {
            players[findPlayerIndex].rawFame = {
              noob: row.c[6].v ?? undefined,
              intermediate: row.c[7].v ?? undefined,
            };
          }
        }
      }

      setPlayers(players.filter((x) => !!x));
      setTimeRecords(times.filter((x) => !!x));
    } catch (error) {
      console.error('Error mapping players and times:', error);
    } finally {
      setLoadingState('players', false);
      setLoadingState('timpeRecords', false);
    }
  };

  useEffect(() => {
    const initialFullFetch = async () => {
      // if (loading) return;
      setLoadingState('maps', true);
      setLoadingState('players', true);
      setLoadingState('timeRecords', true);

      const sheetNames = [
        'PvM (Aliens)',
        'PvM (Players)',
        'PvM (Players 2)',
        'PvM (Players 3)',
        'PvM (Novice)',
        'PvM (Novice 2)',
        'PvM (Novice 3)',
      ];
      const fetchPromises = sheetNames.map((sheetName) =>
        fetchSheetData(sheetName)
      );
      try {
        // Array of data for each sheet
        const sheetDataRequest = await Promise.all(fetchPromises);
        setSheetData(sheetData);

        // Begin mapping everything
        const maps: Map[] = (await mapMaps(
          sheetDataRequest[0],
          sheetDataRequest[4]
        )) as Map[];
        setMaps(maps);
        await mapPlayersAndTimes(sheetDataRequest, maps);

        return true;
      } catch (error) {
        console.error('Error fetching all sheets data:', error);
      }
    };
    // Check if data is already cached
    console.log(sheetData);
    if (!sheetData.length) initialFullFetch();
    // sortMapsFunction();
  }, [sheetData]);

  return (
    <SheetStoreContext.Provider
      value={{
        error,
        maps,
        sortMethod,
        setSortMethod,
        loading,
        sheetUrl,
        sheetData,
        staticMaps,
        fetchSheetData,
        // fetchMaps,
        authors,
        players,
        fetchPlayers,
        timeRecords,
        fetchTimeRecords,
        modalPlayer,
        setModalPlayer,
      }}
    >
      {children}
    </SheetStoreContext.Provider>
  );
};

export const useSheetStore = () => {
  const context = useContext(SheetStoreContext);
  if (!context) {
    throw new Error('useSheetStore must be used within a SheetStoreProvider');
  }
  return context;
};
