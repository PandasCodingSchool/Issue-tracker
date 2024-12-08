"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  User,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  FiHome,
  FiList,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiInbox,
  FiBarChart,
} from "react-icons/fi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: FiHome },
    { name: "My Issues", href: "/dashboard/issues", icon: FiList },
    { name: "My Team", href: "/dashboard/team", icon: FiUsers },
    { name: "Inbox", href: "/dashboard/inbox", icon: FiInbox },
    { name: "Reports", href: "/dashboard/reports", icon: FiBarChart },
    { name: "Settings", href: "/dashboard/settings", icon: FiSettings },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Navbar maxWidth="full" position="sticky">
        <NavbarBrand>
          <Button
            isIconOnly
            variant="light"
            onPress={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </Button>
          <p className="font-bold text-primary">IssueTracker</p>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <User
                  as="button"
                  name="John Doe"
                  description="Project Manager"
                  className="transition-transform text-secondary"
                  avatarProps={{
                    src: "https://i.pravatar.cc/150?img=8",
                  }}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue="Profile"
                >
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">john.doe@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings" textValue="Settings">
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  textValue="Log Out"
                  startContent={<FiLogOut className="text-danger" />}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative lg:translate-x-0 z-20 h-[calc(100vh-64px)] w-64 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200`}
        >
          <nav className="h-full p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isCurrentPage = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Button
                      as={Link}
                      href={item.href}
                      variant={isCurrentPage ? "flat" : "light"}
                      color={isCurrentPage ? "primary" : "default"}
                      className="w-full justify-start"
                      startContent={<Icon className="h-5 w-5" />}
                    >
                      {item.name}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
} 