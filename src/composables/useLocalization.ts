import { computed, ref } from 'vue'
import type { AvailableLanguage, Translations } from 'src/types/Localization'
import fr from 'src/assets/locales/fr.json'
import en from 'src/assets/locales/fr.json'

export function useLocalization() {
  const language = ref<AvailableLanguage>('fr')
  const translations = computed<Translations>(() => {
    if (language.value === 'fr') return fr
    else if (language.value === 'en') return en
    else return fr
  })

  const switchLanguage = (lang: AvailableLanguage) => {
    language.value = lang
  }
  const i18n = (key: string): string => {
    return translations.value[key] || key
  }

  return {
    language,
    switchLanguage,
    i18n,
  }
}
