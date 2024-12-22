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
import {
  PiArrowSquareOut,
  PiFlag,
  PiHouse,
  PiUsersThree,
} from 'react-icons/pi';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { useLocalization } from '@/store/Localization';
import { useState } from 'react';

export default function NavbarComponent() {
  const { i18n } = useLocalization();
  const navbarLinks = [
    { label: i18n('nav.home'), href: '/pvm-rpg', icon: <PiHouse /> },
    { label: i18n('nav.maps'), href: '/pvm-rpg/maps', icon: <PiFlag /> },
    {
      label: i18n('nav.players'),
      href: '/pvm-rpg/players',
      icon: <PiUsersThree />,
    },
    {
      label: 'GSheet',
      href: 'https://docs.google.com/spreadsheets/u/0/d/1z1n6LfHMskAzD4N6CTNrnhyjFtgN_54TGlAyoU6eOnk/htmlview',
      target: '_blank',
      icon: <PiArrowSquareOut />,
    },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen}>
      <NavbarBrand>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden mr-3 text-foreground"
        />
        <Link href="/pvm-rpg">
          <Image
            src="/pvm-rpg/assets/favicon.png"
            alt="Logo"
            width={50}
            height={50}
          />
          <p className="font-bold ml-2">PvM-RPG</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navbarLinks.map((link, index) => (
          <NavbarItem className="mx-2" key={index}>
            <Link
              className="font-semibold text-foreground hover:text-primary"
              href={link.href}
              target={link.target}
            >
              <span className="text-2xl mr-2">{link.icon}</span>
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent className="hidden sm:flex" justify="end">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </NavbarContent>
      <NavbarMenu className="flex flex-col justify-between">
        <div>
          {navbarLinks.map((link, index) => (
            <NavbarMenuItem className="mx-2" key={index}>
              <Link
                className="font-semibold my-4 text-foreground hover:text-primary"
                href={link.href}
                target={link.target}
              >
                <span className="text-2xl mr-2">{link.icon}</span>
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
