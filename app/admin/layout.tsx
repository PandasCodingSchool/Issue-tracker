"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@nextui-org/react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiBarChart,
  FiInbox,
} from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: FiHome },
    { name: "Access Requests", href: "/admin/requests", icon: FiInbox },
    { name: "Users", href: "/admin/users", icon: FiUsers },
    { name: "Analytics", href: "/admin/analytics", icon: FiBarChart },
    { name: "Settings", href: "/admin/settings", icon: FiSettings },
  ];

  // Replace with actual user data from auth context
  const user = {
    name: "Super Admin",
    email: "superadmin@example.com",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar user={user} />
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-divider">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  variant={isActive ? "flat" : "light"}
                  color={isActive ? "primary" : "default"}
                  className="w-full justify-start"
                  startContent={<Icon className="text-xl" />}
                >
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
} 