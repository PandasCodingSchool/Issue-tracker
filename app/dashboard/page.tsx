"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  AvatarGroup,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  FiList,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import { IssueStatus, IssuePriority } from "@/lib/constants/enums";

interface DashboardStats {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
}

interface RecentIssue {
  id: number;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignees: { name: string; avatar: string }[];
  dueDate: string;
}

const statusColorMap: Record<IssueStatus, "default" | "warning" | "success" | "danger"> = {
  OPEN: "warning",
  IN_PROGRESS: "primary",
  COMPLETED: "success",
  CLOSED: "default",
};

const priorityColorMap: Record<IssuePriority, "default" | "warning" | "danger"> = {
  LOW: "default",
  MEDIUM: "warning",
  HIGH: "danger",
};

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIssues: 0,
    openIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
  });

  const [recentIssues, setRecentIssues] = useState<RecentIssue[]>([]);

  useEffect(() => {
    // Simulated data - replace with actual API calls
    setStats({
      totalIssues: 125,
      openIssues: 45,
      resolvedIssues: 65,
      inProgressIssues: 15,
    });

    setRecentIssues([
      {
        id: 1,
        title: "Update user authentication flow",
        status: IssueStatus.IN_PROGRESS,
        priority: IssuePriority.HIGH,
        assignees: [
          { name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
          { name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" },
        ],
        dueDate: "2024-02-15",
      },
      {
        id: 2,
        title: "Fix responsive layout issues",
        status: IssueStatus.OPEN,
        priority: IssuePriority.MEDIUM,
        assignees: [
          { name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
        ],
        dueDate: "2024-02-20",
      },
      {
        id: 3,
        title: "Implement dark mode",
        status: IssueStatus.COMPLETED,
        priority: IssuePriority.LOW,
        assignees: [
          { name: "Bob Wilson", avatar: "https://i.pravatar.cc/150?img=4" },
          { name: "Carol Brown", avatar: "https://i.pravatar.cc/150?img=5" },
        ],
        dueDate: "2024-02-10",
      },
    ]);
  }, []);

  const statCards = [
    {
      title: "Total Issues",
      value: stats.totalIssues,
      icon: FiList,
      color: "default",
    },
    {
      title: "Open Issues",
      value: stats.openIssues,
      icon: FiAlertCircle,
      color: "warning",
    },
    {
      title: "In Progress",
      value: stats.inProgressIssues,
      icon: FiClock,
      color: "primary",
    },
    {
      title: "Resolved Issues",
      value: stats.resolvedIssues,
      icon: FiCheckCircle,
      color: "success",
    },
  ] as const;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here&apos;s an overview of your project&apos;s status.
        </p>
      </div>

      {/* Stats Grid */}
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
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card>
          <CardHeader className="flex gap-3">
            <FiTrendingUp className="w-6 h-6 text-primary" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Project Progress</p>
              <p className="text-small text-default-500">
                {Math.round((stats.resolvedIssues / stats.totalIssues) * 100)}% of
                issues resolved
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <Progress
              aria-label="Project Progress"
              value={(stats.resolvedIssues / stats.totalIssues) * 100}
              className="max-w-full"
              color="success"
            />
          </CardBody>
        </Card>
      </motion.div>

      {/* Recent Issues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Issues</h3>
          </CardHeader>
          <CardBody>
            <Table aria-label="Recent issues table">
              <TableHeader>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>PRIORITY</TableColumn>
                <TableColumn>ASSIGNEES</TableColumn>
                <TableColumn>DUE DATE</TableColumn>
              </TableHeader>
              <TableBody>
                {recentIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>{issue.title}</TableCell>
                    <TableCell>
                      <Chip
                        color={statusColorMap[issue.status]}
                        variant="flat"
                        size="sm"
                      >
                        {issue.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={priorityColorMap[issue.priority]}
                        variant="dot"
                        size="sm"
                      >
                        {issue.priority}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <AvatarGroup max={3} size="sm">
                        {issue.assignees.map((assignee) => (
                          <Avatar
                            key={assignee.name}
                            src={assignee.avatar}
                            name={assignee.name}
                          />
                        ))}
                      </AvatarGroup>
                    </TableCell>
                    <TableCell>
                      {new Date(issue.dueDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
} 