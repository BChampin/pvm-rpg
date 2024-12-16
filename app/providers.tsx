import { LocalizationProvider } from '@/store/Localization';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextUIProvider } from '@nextui-org/react';
import { SheetStoreProvider } from '@/store/Sheet';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        themes={['dark', 'light']}
      >
        <LocalizationProvider>
          <SheetStoreProvider>{children}</SheetStoreProvider>
        </LocalizationProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
