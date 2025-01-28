'use client';

import { PiMoon, PiSun } from 'react-icons/pi';
import { useEffect, useState } from 'react';
import { Switch } from '@heroui/react';
import { useLocalization } from '@/store/Localization';
import { useTheme } from 'next-themes';

export function ThemeSwitcher() {
  const { i18n } = useLocalization();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="flex items-center">
      <Switch
        isSelected={theme === 'dark'}
        onChange={toggleTheme}
        size="lg"
        color="primary"
        startContent={<PiMoon />}
        endContent={<PiSun />}
      />
      <span className="flex sm:hidden font-bold ml-1 text-foreground">
        {i18n(`nav.mode.${theme}`)}
      </span>
    </div>
  );
}
