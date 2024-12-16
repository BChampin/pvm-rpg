'use client';

import {
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { useLocalization } from '@/store/Localization';
import { useState } from 'react';

export default function NavbarComponent() {
  const { i18n } = useLocalization();
  const navbarLinks = [
    { label: i18n('nav.home'), href: '/pvm-rpg' },
    { label: i18n('nav.maps'), href: '/pvm-rpg/maps' },
    { label: i18n('nav.players'), href: '/pvm-rpg/players' },
    {
      label: 'GSheet',
      href: process.env.NEXT_PUBLIC_SHEET_URL_HTML,
      target: '_blank',
    },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen}>
      <NavbarBrand>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden mr-3"
        />
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
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navbarLinks.map((link, index) => (
          <NavbarItem key={index}>
            <Link
              className="font-semibold"
              href={link.href}
              target={link.target}
            >
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent className="hidden" justify="end">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </NavbarContent>
      <NavbarMenu className="flex flex-col justify-between">
        <div>
          {navbarLinks.map((link, index) => (
            <NavbarMenuItem key={index}>
              <Link
                className="font-semibold my-4"
                href={link.href}
                target={link.target}
              >
                {link.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
        <div className="flex flex-col space-y-4 pb-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
