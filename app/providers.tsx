import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SheetStoreProvider } from "@/store/Sheet"
import { LocalizationProvider } from "@/store/Localization"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light" themes={["dark", "light"]}>
        <LocalizationProvider>
          <SheetStoreProvider>
            {children}
          </SheetStoreProvider>
        </LocalizationProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
