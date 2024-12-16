'use client';

import { AvailableLanguage } from '@/types/Localization';
import { Switch } from '@nextui-org/react';
import { useLocalization } from '@/store/Localization';

export function LanguageSwitcher() {
  const { i18n, language, switchLanguage } = useLocalization();
  const languageReverse = {
    fr: 'en',
    en: 'fr',
  };

  return (
    <div className="flex items-center">
      <Switch
        isSelected={language === 'fr'}
        onChange={() =>
          switchLanguage(languageReverse[language] as AvailableLanguage)
        }
        size="lg"
        color="primary"
        startContent={<span>🇫🇷</span>}
        endContent={<span>🇬🇧</span>}
      />
      <span className="flex sm:hidden font-bold ml-1">
        {i18n(`nav.language.${language}`)}
      </span>
    </div>
  );
}
