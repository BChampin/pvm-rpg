"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import {
  Map,
  Player,
  SheetStoreContextType,
  getMapGrade,
  TimeRecord
} from "@/types/Sheet"

const SheetStoreContext = createContext<SheetStoreContextType | undefined>(undefined)

export const SheetStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data
  const [sheetUrl, setSheetUrl] = useState<string>(process.env.NEXT_PUBLIC_SHEET_URL ?? "")
  const [maps, setMaps] = useState<Map[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [staticMaps, setStaticMaps] = useState<Map[]>([])
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [sortMethod, setSortMethod] = useState<string>("grade.ascending")

  const timeNumberToStr = (time: number): string => {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const millis = time % 1000
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
  }

  const fetchSheetData = async (sheetName: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${sheetUrl}${sheetName}`)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const text = await response.text()
      const json = JSON.parse(text.substring(47).slice(0, -2))
      return json
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStaticData = async (file: string) => {
    try {
      const responseFile = await fetch(`/pvm-rpg/data/${file}.json`)
      return await responseFile.json()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Functions
  const fetchMaps = async (live = false) => {
    let maps: Map[] = []
    if (!live) {
      maps = await fetchStaticData('maps')
    } else {
      const alienJson = await fetchSheetData("PvM (Aliens)")
      const noviceJson = await fetchSheetData("PvM (Novice)")
      alienJson.table.rows[2].c.map((cell: any, cellIndex: number) => {
        if (cellIndex <= 1 || !cell.v) return null
        let mapGrade = getMapGrade('E')
        for (let gradeIndex = cellIndex; gradeIndex >= 2; gradeIndex--) {
          const grade = alienJson.table.rows[1].c[gradeIndex]?.v
          if (grade) {
            mapGrade = getMapGrade(grade)
            break
          }
        }
        maps.push({
          label: cell.v,
          grade: mapGrade,
          times: {
            alien: alienJson.table.rows[4].c[cellIndex]?.v ?? "not found",
            player: alienJson.table.rows[3].c[cellIndex]?.v ?? "not found",
            intermediate: noviceJson.table.rows[4].c[cellIndex]?.v ?? "not found",
            noob: noviceJson.table.rows[3].c[cellIndex]?.v ?? "not found",
          },
          exchange: {
            link: alienJson.table.rows[5].c[cellIndex]?.v ?? "not found"
          }
        })
      })
    }
    setStaticMaps(maps.filter(x => !!x))
  }

  const sortMapsFunction = () => {
    const copyFrom = [...staticMaps]
    switch (sortMethod) {
      case "grade.ascending":
        copyFrom.sort((a, b) => a.grade.level - b.grade.level)
        break
      case "grade.descending":
        copyFrom.sort((a, b) => b.grade.level - a.grade.level)
        break
      case "alphabetical.ascending":
        copyFrom.sort((a, b) => a.label.localeCompare(b.label))
        break
      case "alphabetical.descending":
        copyFrom.sort((a, b) => b.label.localeCompare(a.label))
        break
      case "duration.ascending":
        copyFrom.sort((a, b) => a.times.alien - b.times.alien)
        break
      case "duration.descending":
        copyFrom.sort((a, b) => b.times.alien - a.times.alien)
        break
    }
    setMaps(copyFrom)
  }

  const fetchPlayers = async (live = false) => {
    let players: Player[] = []
    if (!live) {
      players = await fetchStaticData('players')
    } else {
      players = []
    }
    setPlayers(players.filter(x => !!x))
  }

  const fetchTimeRecords = async (live = false) => {
    let timeRecords: TimeRecord[] = []
    if (!live) {
      timeRecords = await fetchStaticData('times')
    } else {
      timeRecords = []
    }
    setTimeRecords(timeRecords.filter(x => !!x))
  }


  useEffect(() => {
    fetchMaps()
    fetchPlayers()
    fetchTimeRecords()
  }, [])

  useEffect(() => {
    sortMapsFunction()
  }, [staticMaps, sortMethod])


  return (
    <SheetStoreContext.Provider value={{
      loading,
      error,
      maps,
      sortMethod,
      setSortMethod,
      sheetUrl,
      staticMaps,
      fetchSheetData,
      fetchMaps,
      players,
      fetchPlayers,
      timeRecords,
      fetchTimeRecords,
      timeNumberToStr
    }}>
      {children}
    </SheetStoreContext.Provider>
  )
}

export const useSheetStore = () => {
  const context = useContext(SheetStoreContext)
  if (!context) {
    throw new Error("useSheetStore must be used within a SheetStoreProvider")
  }
  return context
}
