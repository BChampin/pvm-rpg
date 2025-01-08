'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Author,
  Exchange,
  Map,
  Player,
  SheetData,
  SheetStoreContextType,
  TimeRecord,
  getFame,
  getMapGrade,
} from '@/types/Sheet';
import { timeStrToNumber } from '@/utils';

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
  const [players, setPlayers] = useState<Player[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [staticMaps, setStaticMaps] = useState<Map[]>([]);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [sortMethod, setSortMethod] = useState<string>('grade.ascending');
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMaps, setLoadingMaps] = useState<boolean>(true);
  const [loadingPlayers, setLoadingPlayers] = useState<boolean>(true);
  const [loadingTimeRecords, setLoadingTimeRecords] = useState<boolean>(true);

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
  const fetchMaps = async (live = false) => {
    let maps: Map[] = [];
    if (!live) {
      maps = await fetchStaticData('maps');
    } else {
      const alienJson = await fetchSheetData('PvM (Aliens)');
      const noviceJson = await fetchSheetData('PvM (Novice)');
      alienJson.table.rows[2].c.map((cell: any, cellIndex: number) => {
        if (cellIndex <= 1 || !cell.v) return null;
        let mapGrade = getMapGrade('E');
        for (let gradeIndex = cellIndex; gradeIndex >= 2; gradeIndex--) {
          const grade = alienJson.table.rows[1].c[gradeIndex]?.v;
          if (grade) {
            mapGrade = getMapGrade(grade);
            break;
          }
        }
        maps.push({
          label: cell.v,
          grade: mapGrade,
          times: {
            alien: alienJson.table.rows[4].c[cellIndex]?.v ?? 'not found',
            player: alienJson.table.rows[3].c[cellIndex]?.v ?? 'not found',
            intermediate:
              noviceJson.table.rows[4].c[cellIndex]?.v ?? 'not found',
            noob: noviceJson.table.rows[3].c[cellIndex]?.v ?? 'not found',
          },
          exchange: {
            link: alienJson.table.rows[5].c[cellIndex]?.v ?? 'not found',
          },
        });
      });
    }
    setStaticMaps(maps.filter((x) => !!x));
  };

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
      setLoadingMaps(true);

      const mapsPromises: Promise<Map>[] = alienJson.table.rows[2].c.map(
        async (cell, cellIndex) => {
          if (cellIndex <= 1 || !cell || !cell.v) return null;
          let mapGrade;
          for (let gradeIndex = cellIndex; gradeIndex >= 2; gradeIndex--) {
            const grade = alienJson.table.rows[1].c[gradeIndex]?.v;
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
            grade: mapGrade ?? undefined,
            times: {
              alien: alienJson.table.rows[4].c[cellIndex]?.v
                ? timeStrToNumber(alienJson.table.rows[4].c[cellIndex].v)
                : undefined,
              player: alienJson.table.rows[3].c[cellIndex]?.v
                ? timeStrToNumber(alienJson.table.rows[3].c[cellIndex].v)
                : undefined,
              intermediate: noviceJson.table.rows[4].c[cellIndex]?.v
                ? timeStrToNumber(noviceJson.table.rows[4].c[cellIndex].v)
                : undefined,
              noob: noviceJson.table.rows[3].c[cellIndex]?.v
                ? timeStrToNumber(noviceJson.table.rows[3].c[cellIndex].v)
                : undefined,
            },
            exchange,
          };
        }
      );
      const maps = (await Promise.all(mapsPromises)).filter((x) => !!x);
      const authors: Author[] = [];

      // Now fetch in one-go all map-related data
      const bigQuery = await fetch(
        `https://trackmania.exchange/api/maps?count=${maps.length}&id=${maps.map((m) => m.exchange.id)}&fields=${encodeURIComponent('Uploader.Name,Uploader.UserId,AwardCount')}`
      );
      const bigQueryJson = await bigQuery.json();
      console.log('bigQueryJson', bigQueryJson);
      if (bigQueryJson.Results) {
        for (const result of bigQueryJson.Results) {
          const relatedMap = maps.find((m) => m.exchange.id === result.MapId)
          if (relatedMap) {
            relatedMap.exchange.awardCount = result.AwardCount ?? undefined;
            const author = {
              id: result.Uploader.UserId,
              name: result.Uploader.Name,
            };
            authors.push(author);
            relatedMap.exchange.author = author;
          }
        }
      }

      setStaticMaps(maps);
      setAuthors(authors);
    } catch (error) {
      console.error('Error mapping maps:', error);
    } finally {
      setLoadingMaps(false);
    }
  };

  const initialFullFetch = async () => {
    // if (loading) return;
    setLoading(true);
    setLoadingMaps(true);
    setLoadingPlayers(true);
    setLoadingTimeRecords(true);

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
      const sheetData = await Promise.all(fetchPromises);

      // Begin mapping everything
      // Mapping maps
      mapMaps(sheetData[0], sheetData[4]);

      return true;
    } catch (error) {
      console.error('Error fetching all sheets data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaps();
    fetchTimeRecords();
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [staticMaps]);

  useEffect(() => {
    sortMapsFunction();
  }, [staticMaps, sortMethod]);

  useEffect(() => {
    console.log('oui');
    initialFullFetch();
  }, []);

  return (
    <SheetStoreContext.Provider
      value={{
        error,
        maps,
        sortMethod,
        setSortMethod,
        loading,
        loadingMaps,
        loadingPlayers,
        loadingTimeRecords,
        sheetUrl,
        staticMaps,
        fetchSheetData,
        fetchMaps,
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
