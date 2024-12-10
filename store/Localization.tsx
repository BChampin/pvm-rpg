"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

import {
  AvailableLanguage,
  LocalizationContextType
} from "@/types/Localization"


const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AvailableLanguage>('fr')
  const [translations, setTranslations] = useState<Record<string, string>>({})

  const loadTranslations = async (lang: AvailableLanguage) => {
    const response = await fetch(`/pvm-rpg/locales/${lang}.json`)
    return await response.json()
  }

  useEffect(() => {
    const fetchTranslations = async () => {
      const loadedTranslations = await loadTranslations(language)
      setTranslations(loadedTranslations)
    }
    fetchTranslations()
  }, [language])

  const switchLanguage = (lang: AvailableLanguage) => { setLanguage(lang) }
  const i18n = (key: string): string => { return translations[key] || key }

  return (
    <LocalizationContext.Provider value={{
      language,
      switchLanguage,
      i18n
    }}>
      {children}
    </LocalizationContext.Provider>
  )
}

export const useLocalization = () => {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error("useLocalization must be used within a LocalizationProvider")
  }
  return context
}
