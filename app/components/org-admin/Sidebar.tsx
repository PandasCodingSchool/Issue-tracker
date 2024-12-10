"use client";

import { Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import {
  FiUsers,
  FiGrid,
  FiSettings,
  FiBarChart,
  FiLayers,
} from "react-icons/fi";

const menuItems = [
  {
    name: "Overview",
    href: "/org-admin",
    icon: FiBarChart,
  },
  {
    name: "Users",
    href: "/org-admin/users",
    icon: FiUsers,
  },
  {
    name: "Departments",
    href: "/org-admin/departments",
    icon: FiGrid,
  },
  {
    name: "Projects",
    href: "/org-admin/projects",
    icon: FiLayers,
  },
  {
    name: "Settings",
    href: "/org-admin/settings",
    icon: FiSettings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-64 bg-white border-r border-divider">
      <div className="h-16 flex items-center px-6 border-b border-divider">
        <h2 className="text-xl font-semibold text-primary">Organization Admin</h2>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-default-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 