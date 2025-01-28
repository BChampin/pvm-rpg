import { LocalizationProvider } from '@/store/Localization';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { HeroUIProvider } from '@heroui/react';
import { SheetStoreProvider } from '@/store/Sheet';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        themes={['dark', 'light']}
      >
        <SheetStoreProvider>
          <LocalizationProvider>{children}</LocalizationProvider>
        </SheetStoreProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
