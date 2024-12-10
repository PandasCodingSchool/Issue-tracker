"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  FiUsers,
  FiGrid,
  FiLayers,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

interface OrgStats {
  totalUsers: number;
  totalDepartments: number;
  totalProjects: number;
  activeIssues: number;
  resolvedIssues: number;
}

interface RecentActivity {
  id: number;
  type: "user_added" | "department_created" | "project_created" | "issue_resolved";
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  description: string;
  timestamp: string;
}

export default function OrgAdminPage() {
  const [stats, setStats] = useState<OrgStats>({
    totalUsers: 0,
    totalDepartments: 0,
    totalProjects: 0,
    activeIssues: 0,
    resolvedIssues: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Fetch organization stats
    fetchStats();
    // Fetch recent activity
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/org-admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/org-admin/activity");
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.data);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: FiUsers,
      color: "primary",
    },
    {
      title: "Departments",
      value: stats.totalDepartments,
      icon: FiGrid,
      color: "secondary",
    },
    {
      title: "Projects",
      value: stats.totalProjects,
      icon: FiLayers,
      color: "success",
    },
    {
      title: "Active Issues",
      value: stats.activeIssues,
      icon: FiAlertCircle,
      color: "warning",
    },
    {
      title: "Resolved Issues",
      value: stats.resolvedIssues,
      icon: FiCheckCircle,
      color: "success",
    },
  ] as const;

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_added":
        return <FiUsers className="text-primary" />;
      case "department_created":
        return <FiGrid className="text-secondary" />;
      case "project_created":
        return <FiLayers className="text-success" />;
      case "issue_resolved":
        return <FiCheckCircle className="text-success" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Organization Overview</h1>
        <p className="text-gray-500">Monitor your organization's activity and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="bg-white">
              <CardBody className="flex flex-row items-center gap-4">
                <div className={`p-3 rounded-lg bg-${card.color}/10`}>
                  <Icon className={`h-6 w-6 text-${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-semibold">{card.value}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card className="bg-white">
        <CardHeader className="flex justify-between">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Button variant="light" color="primary">
            View All
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Recent activity table">
            <TableHeader>
              <TableColumn>USER</TableColumn>
              <TableColumn>ACTION</TableColumn>
              <TableColumn>TIME</TableColumn>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <User
                      name={activity.user.name}
                      description={activity.user.email}
                      avatarProps={{ src: activity.user.avatar }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.type)}
                      <span>{activity.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">
                      {new Date(activity.timestamp).toLocaleString()}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
} 