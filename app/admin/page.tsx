"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Link as NextUILink,
} from "@nextui-org/react";
import Link from "next/link";
import {
  FiUserPlus,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        if (response.ok) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Requests",
      value: stats.totalRequests,
      icon: FiUsers,
      color: "primary",
      href: "/admin/requests",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: FiUserPlus,
      color: "warning",
      href: "/admin/requests?status=pending",
    },
    {
      title: "Approved Requests",
      value: stats.approvedRequests,
      icon: FiCheckCircle,
      color: "success",
      href: "/admin/requests?status=approved",
    },
    {
      title: "Rejected Requests",
      value: stats.rejectedRequests,
      icon: FiXCircle,
      color: "danger",
      href: "/admin/requests?status=rejected",
    },
  ] as const;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of access requests and system statistics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="w-full">
                <CardBody className="gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-lg bg-${card.color}/10`}
                    >
                      <Icon
                        className={`h-6 w-6 text-${card.color}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {card.title}
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button
                    as={Link}
                    href={card.href}
                    color={card.color}
                    variant="light"
                    className="w-full"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 