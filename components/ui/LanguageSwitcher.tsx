'use client';

import { AvailableLanguage } from '@/types/Localization';
import { Switch } from '@heroui/react';
import { useLocalization } from '@/store/Localization';

export function LanguageSwitcher() {
  const { language, switchLanguage } = useLocalization();
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
    </div>
  );
}
