"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import {
  Map,
  SheetStoreContextType,
  getMapGrade
} from "@/types/Sheet"

const SheetStoreContext = createContext<SheetStoreContextType | undefined>(undefined)

export const SheetStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data
  const [sheetUrl, setSheetUrl] = useState<string>(process.env.NEXT_PUBLIC_SHEET_URL ?? "")
  const [maps, setMaps] = useState<Map[]>([])
  const [staticMaps, setStaticMaps] = useState<Map[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [sortMethod, setSortMethod] = useState<string>("grade.ascending")

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

  // Functions
  const fetchMaps = async (live = false) => {
    let maps: Map[] = []
    if (!live) {
      try {
        const responseFile = await fetch("/maps.json")
        const jsonData = await responseFile.json()
        maps = jsonData
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
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
        copyFrom.sort((a, b) => a.times.alien.localeCompare(b.times.alien))
        break
      case "duration.descending":
        copyFrom.sort((a, b) => b.times.alien.localeCompare(a.times.alien))
        break
    }
    setMaps(copyFrom)
  }

  useEffect(() => {
    fetchMaps()
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
      fetchMaps
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
