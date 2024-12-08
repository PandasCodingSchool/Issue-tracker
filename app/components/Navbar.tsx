"use client";

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
  Link as NextUILink,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact Us", href: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <NextUINavbar
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-primary">
            IssueTracker
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href} isActive={isActive(item.href)}>
            <NextUILink
              as={Link}
              color={isActive(item.href) ? "primary" : "foreground"}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.name}
            </NextUILink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/request-access"
            variant="flat"
          >
            Request Access
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <NextUILink
              as={Link}
              color={isActive(item.href) ? "primary" : "foreground"}
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.name}
            </NextUILink>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button
            as={Link}
            color="primary"
            href="/request-access"
            variant="flat"
            className="w-full"
          >
            Request Access
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
} 