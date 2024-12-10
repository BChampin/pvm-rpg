"use client"

import { useLocalization } from "@/store/Localization"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react"
import { Image } from "@nextui-org/react"
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher"
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher"

export default function NavbarComponent () {
  const { i18n } = useLocalization()
  const navbarLinks = [
    { label: i18n('nav.home'), href: "/pvm-rpg" },
    { label: i18n('nav.maps'), href: "/pvm-rpg/maps" },
    { label: i18n('nav.players'), href: "/pvm-rpg/players" },
    { label: "GSheet", href: process.env.NEXT_PUBLIC_SHEET_URL_HTML, target: "_blank" },
  ]

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/pvm-rpg">
          <Image
            src="/pvm-rpg/assets/logo.png"
            alt="Logo"
            width={50}
            height={50}
          />
          <p className="font-bold ml-2">PvM-RPG</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4" justify="center">
        {navbarLinks.map((link, index) => (
          <NavbarItem key={index}>
            <Link className="font-semibold" href={link.href} target={link.target}>
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </NavbarContent>
    </Navbar>
  )
}
