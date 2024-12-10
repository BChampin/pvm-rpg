"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "@nextui-org/react"
import { PiMoon, PiSun } from "react-icons/pi"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => { setTheme(theme === "dark" ? "light" : "dark") }

  if (!mounted) return null

  return (
    <div className="flex items-center">
      <Switch
        isSelected={theme === "dark"}
        onChange={toggleTheme}
        size="lg"
        color="primary"
        startContent={<PiMoon />}
        endContent={<PiSun />}
      />
    </div>
  )
}
