"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Replace with actual user data from auth context
  const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar user={user} />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
} 