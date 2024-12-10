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
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Select,
  SelectItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCalendar,
} from "react-icons/fi";
import { IssueStatus, IssuePriority, IssueType } from "@/lib/constants/enums";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  assignee: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  reporter: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  department: {
    id: number;
    name: string;
  };
  dueDate: string;
  createdAt: string;
}

const statusColorMap: Record<IssueStatus, "default" | "warning" | "success" | "danger"> = {
  OPEN: "warning",
  IN_PROGRESS: "primary",
  RESOLVED: "success",
  CLOSED: "default",
};

const priorityColorMap: Record<IssuePriority, "default" | "warning" | "danger"> = {
  LOW: "default",
  MEDIUM: "warning",
  HIGH: "danger",
  CRITICAL: "danger",
};

export default function IssuesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<IssueStatus>>(new Set([]));
  const [priorityFilter, setPriorityFilter] = useState<Set<IssuePriority>>(new Set([]));
  const [typeFilter, setTypeFilter] = useState<Set<IssueType>>(new Set([]));
  const [viewMode, setViewMode] = useState<"all" | "assigned" | "reported">("assigned");
  const [page, setPage] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const rowsPerPage = 10;

  useEffect(() => {
    fetchIssues();
  }, [viewMode]);

  const fetchIssues = async () => {
    try {
      // Replace with actual API call
      const response = await fetch("/api/issues");
      const data = await response.json();
      if (response.ok) {
        setIssues(data.data);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const handleCreateIssue = () => {
    setModalMode("create");
    setSelectedIssue(null);
    onOpen();
  };

  const handleEditIssue = (issue: Issue) => {
    setModalMode("edit");
    setSelectedIssue(issue);
    onOpen();
  };

  const handleDeleteIssue = async (issueId: number) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

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

    // View mode filter
    switch (viewMode) {
      case "assigned":
        filtered = filtered.filter((issue) => issue.assignee.id === 1); // Replace with actual user ID
        break;
      case "reported":
        filtered = filtered.filter((issue) => issue.reporter.id === 1); // Replace with actual user ID
        break;
    }

    return filtered;
  }, [issues, filterValue, statusFilter, priorityFilter, typeFilter, viewMode]);

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
      case "reporter":
        return (
          <User
            name={issue.reporter.name}
            description={issue.reporter.email}
            avatarProps={{ src: issue.reporter.avatar }}
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
                startContent={<FiEdit2 className="text-default-500" />}
                onPress={() => handleEditIssue(issue)}
              >
                Edit Issue
              </DropdownItem>
              <DropdownItem
                startContent={<FiTrash2 className="text-danger" />}
                className="text-danger"
                color="danger"
                onPress={() => handleDeleteIssue(issue.id)}
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Issues</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track your issues
          </p>
        </div>
        <Button
          color="primary"
          startContent={<FiPlus />}
          onPress={handleCreateIssue}
        >
          Create Issue
        </Button>
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
              label="View"
              placeholder="Select view"
              selectedKeys={[viewMode]}
              className="max-w-xs"
              onChange={(e) => setViewMode(e.target.value as typeof viewMode)}
            >
              <SelectItem key="all" value="all">All Issues</SelectItem>
              <SelectItem key="assigned" value="assigned">Assigned to Me</SelectItem>
              <SelectItem key="reported" value="reported">Reported by Me</SelectItem>
            </Select>
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
              <TableColumn key="reporter">REPORTER</TableColumn>
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {modalMode === "create" ? "Create New Issue" : "Edit Issue"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Title"
                    placeholder="Enter issue title"
                    defaultValue={selectedIssue?.title}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Describe the issue"
                    minRows={3}
                    defaultValue={selectedIssue?.description}
                  />
                  <div className="flex gap-4">
                    <Select
                      label="Type"
                      placeholder="Select issue type"
                      defaultSelectedKeys={selectedIssue ? [selectedIssue.type] : undefined}
                    >
                      {Object.values(IssueType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Priority"
                      placeholder="Select priority"
                      defaultSelectedKeys={selectedIssue ? [selectedIssue.priority] : undefined}
                    >
                      {Object.values(IssuePriority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="flex gap-4">
                    <Select
                      label="Status"
                      placeholder="Select status"
                      defaultSelectedKeys={selectedIssue ? [selectedIssue.status] : undefined}
                    >
                      {Object.values(IssueStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      type="date"
                      label="Due Date"
                      placeholder="Select due date"
                      defaultValue={selectedIssue?.dueDate.split("T")[0]}
                      startContent={<FiCalendar />}
                    />
                  </div>
                  <Select
                    label="Assignee"
                    placeholder="Select assignee"
                    defaultSelectedKeys={selectedIssue ? [selectedIssue.assignee.id.toString()] : undefined}
                  >
                    {/* Replace with actual team members */}
                    <SelectItem key="1" value="1">John Doe</SelectItem>
                    <SelectItem key="2" value="2">Jane Smith</SelectItem>
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  {modalMode === "create" ? "Create Issue" : "Save Changes"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 