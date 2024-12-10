export interface LocalizationContextType {
  language: AvailableLanguage
  switchLanguage: (lang: AvailableLanguage) => void
  i18n: (key: string) => string
}

export type AvailableLanguage =
  | 'en'
  | 'fr'
