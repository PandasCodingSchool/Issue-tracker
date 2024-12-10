"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Sidebar } from "@/components/org-admin/Sidebar";

export default function OrgAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Replace with actual user data from auth context
  const user = {
    name: "Admin User",
    email: "admin@example.com",
    role: "Organization Admin",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
} 