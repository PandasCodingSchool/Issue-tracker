"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  User,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Select,
  SelectItem,
  Pagination,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { IssueStatus, IssuePriority, IssueType } from "@/lib/constants/enums";

interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  assignee: {
    name: string;
    email: string;
    avatar: string;
  };
  dueDate: string;
  createdAt: string;
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
  CRITICAL: "danger",
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<IssueStatus>>(new Set([]));
  const [priorityFilter, setPriorityFilter] = useState<Set<IssuePriority>>(new Set([]));
  const [typeFilter, setTypeFilter] = useState<Set<IssueType>>(new Set([]));
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockIssues: Issue[] = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `Issue ${i + 1}: ${["Bug fix", "Feature request", "Documentation", "Enhancement"][Math.floor(Math.random() * 4)]}`,
      status: Object.values(IssueStatus)[Math.floor(Math.random() * 4)],
      priority: Object.values(IssuePriority)[Math.floor(Math.random() * 4)],
      type: Object.values(IssueType)[Math.floor(Math.random() * 4)],
      assignee: {
        name: ["John Doe", "Jane Smith", "Alice Johnson"][Math.floor(Math.random() * 3)],
        email: "user@example.com",
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 10) + 1}`,
      },
      dueDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    setIssues(mockIssues);
  }, []);

  const filteredIssues = useMemo(() => {
    let filtered = [...issues];

    // Text search
    if (filterValue) {
      filtered = filtered.filter((issue) =>
        issue.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter.size > 0) {
      filtered = filtered.filter((issue) =>
        statusFilter.has(issue.status)
      );
    }

    // Priority filter
    if (priorityFilter.size > 0) {
      filtered = filtered.filter((issue) =>
        priorityFilter.has(issue.priority)
      );
    }

    // Type filter
    if (typeFilter.size > 0) {
      filtered = filtered.filter((issue) =>
        typeFilter.has(issue.type)
      );
    }

    return filtered;
  }, [issues, filterValue, statusFilter, priorityFilter, typeFilter]);

  const pages = Math.ceil(filteredIssues.length / rowsPerPage);
  const items = filteredIssues.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const renderCell = (issue: Issue, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold">{issue.title}</p>
            <p className="text-tiny text-default-500">
              Created {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>
        );
      case "assignee":
        return (
          <User
            name={issue.assignee.name}
            description={issue.assignee.email}
            avatarProps={{ src: issue.assignee.avatar }}
          />
        );
      case "status":
        return (
          <Chip
            color={statusColorMap[issue.status]}
            variant="flat"
            size="sm"
          >
            {issue.status}
          </Chip>
        );
      case "priority":
        return (
          <Chip
            color={priorityColorMap[issue.priority]}
            variant="dot"
            size="sm"
          >
            {issue.priority}
          </Chip>
        );
      case "type":
        return (
          <Chip
            variant="flat"
            size="sm"
          >
            {issue.type}
          </Chip>
        );
      case "dueDate":
        return new Date(issue.dueDate).toLocaleDateString();
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <FiMoreVertical className="text-default-500" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Issue actions">
              <DropdownItem
                startContent={<FiEdit className="text-default-500" />}
              >
                Edit Issue
              </DropdownItem>
              <DropdownItem
                startContent={<FiTrash2 className="text-danger" />}
                className="text-danger"
                color="danger"
              >
                Delete Issue
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Issues</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage and track your assigned issues
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            isClearable
            placeholder="Search issues..."
            startContent={<FiSearch />}
            value={filterValue}
            onValueChange={setFilterValue}
            className="w-full sm:max-w-[44%]"
          />
          <div className="flex flex-1 gap-4 items-end">
            <Select
              label="Status"
              placeholder="Filter by status"
              selectionMode="multiple"
              className="max-w-xs"
              startContent={<FiFilter />}
              onSelectionChange={(keys) => setStatusFilter(keys as Set<IssueStatus>)}
            >
              {Object.values(IssueStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Priority"
              placeholder="Filter by priority"
              selectionMode="multiple"
              className="max-w-xs"
              startContent={<FiFilter />}
              onSelectionChange={(keys) => setPriorityFilter(keys as Set<IssuePriority>)}
            >
              {Object.values(IssuePriority).map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Type"
              placeholder="Filter by type"
              selectionMode="multiple"
              className="max-w-xs"
              startContent={<FiFilter />}
              onSelectionChange={(keys) => setTypeFilter(keys as Set<IssueType>)}
            >
              {Object.values(IssueType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="border rounded-large">
          <Table
            aria-label="Issues table"
            bottomContent={
              pages > 1 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn key="title">TITLE</TableColumn>
              <TableColumn key="assignee">ASSIGNEE</TableColumn>
              <TableColumn key="status">STATUS</TableColumn>
              <TableColumn key="priority">PRIORITY</TableColumn>
              <TableColumn key="type">TYPE</TableColumn>
              <TableColumn key="dueDate">DUE DATE</TableColumn>
              <TableColumn key="actions" align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              items={items}
              emptyContent="No issues found"
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(item, columnKey.toString())}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 