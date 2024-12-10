"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

interface DashboardNavbarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    // Implement logout logic
  };

  return (
    <Navbar
      maxWidth="full"
      position="sticky"
      className="border-b border-divider bg-white"
    >
      <NavbarBrand>
        <p className="font-bold text-primary">Debug Deck</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem className="flex-grow max-w-xl">
          <Input
            classNames={{
              base: "max-w-full h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Search..."
            size="sm"
            startContent={<FiSearch size={16} />}
            type="search"
          />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              className="text-default-500"
              radius="full"
            >
              <FiBell className="text-xl" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-danger text-tiny text-white justify-center items-center">
                  2
                </span>
              </span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Notifications" className="w-80">
            <DropdownItem key="notifications" className="h-56 p-0">
              <div className="flex h-full flex-col justify-center items-center gap-2">
                <p className="text-default-500">No new notifications</p>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={user?.name}
              size="sm"
              src={user?.avatar}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            <DropdownItem
              key="settings"
              startContent={<FiSettings className="text-xl" />}
            >
              Settings
            </DropdownItem>
            <DropdownItem
              key="profile"
              startContent={<FiUser className="text-xl" />}
            >
              Profile
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              startContent={<FiLogOut className="text-xl" />}
              onPress={handleLogout}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
} 