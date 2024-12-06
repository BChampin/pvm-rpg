import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SheetStoreProvider } from "@/store/Sheet"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light" themes={["dark", "light"]}>
        <SheetStoreProvider>
          {children}
        </SheetStoreProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
