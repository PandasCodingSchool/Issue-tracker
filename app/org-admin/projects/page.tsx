"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiCalendar,
  FiFlag,
} from "react-icons/fi";

interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  priority: "low" | "medium" | "high";
  startDate: string;
  endDate: string;
  department: {
    id: number;
    name: string;
  };
  progress: number;
  totalIssues: number;
  completedIssues: number;
  teamMembers: number;
}

interface Department {
  id: number;
  name: string;
}

export default function ProjectsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchDepartments();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/org-admin/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleAddProject = () => {
    setModalMode("add");
    setSelectedProject(null);
    onOpen();
  };

  const handleEditProject = (project: Project) => {
    setModalMode("edit");
    setSelectedProject(project);
    onOpen();
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/org-admin/projects/${projectId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "primary";
      case "on-hold":
        return "warning";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: Project["priority"]) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(filterValue.toLowerCase()) ||
    project.description.toLowerCase().includes(filterValue.toLowerCase()) ||
    project.department.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Projects</h1>
          <p className="text-gray-500">Manage organization projects</p>
        </div>
        <Button
          color="primary"
          startContent={<FiPlus />}
          onPress={handleAddProject}
        >
          Add Project
        </Button>
      </div>

      <Card className="bg-white">
        <CardHeader className="flex justify-between">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search projects..."
            startContent={<FiSearch />}
            value={filterValue}
            onValueChange={setFilterValue}
          />
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Projects table">
            <TableHeader>
              <TableColumn>PROJECT</TableColumn>
              <TableColumn>DEPARTMENT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>PRIORITY</TableColumn>
              <TableColumn>PROGRESS</TableColumn>
              <TableColumn>TEAM</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-small text-default-500">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-tiny text-default-400">
                        <FiCalendar />
                        <span>
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{project.department.name}</TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(project.status)}
                      variant="flat"
                      size="sm"
                    >
                      {project.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getPriorityColor(project.priority)}
                      variant="dot"
                      size="sm"
                    >
                      {project.priority}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Progress
                        size="sm"
                        value={project.progress}
                        color="success"
                        className="max-w-md"
                      />
                      <div className="flex justify-between text-tiny text-default-500">
                        <span>{project.progress}%</span>
                        <span>
                          {project.completedIssues}/{project.totalIssues} issues
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-default-500" />
                      <span>{project.teamMembers}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <FiMoreVertical className="text-default-500" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Project actions">
                        <DropdownItem
                          startContent={<FiEdit2 className="text-default-500" />}
                          onPress={() => handleEditProject(project)}
                        >
                          Edit Project
                        </DropdownItem>
                        <DropdownItem
                          startContent={<FiUsers className="text-default-500" />}
                          href={`/org-admin/projects/${project.id}/team`}
                        >
                          Manage Team
                        </DropdownItem>
                        <DropdownItem
                          startContent={<FiTrash2 className="text-danger" />}
                          className="text-danger"
                          color="danger"
                          onPress={() => handleDeleteProject(project.id)}
                        >
                          Delete Project
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {modalMode === "add" ? "Add New Project" : "Edit Project"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    placeholder="Enter project name"
                    defaultValue={selectedProject?.name}
                  />
                  <Input
                    label="Description"
                    placeholder="Enter project description"
                    defaultValue={selectedProject?.description}
                  />
                  <div className="flex gap-4">
                    <Select
                      label="Status"
                      placeholder="Select status"
                      defaultSelectedKeys={
                        selectedProject ? [selectedProject.status] : undefined
                      }
                    >
                      <SelectItem key="active" value="active">
                        Active
                      </SelectItem>
                      <SelectItem key="completed" value="completed">
                        Completed
                      </SelectItem>
                      <SelectItem key="on-hold" value="on-hold">
                        On Hold
                      </SelectItem>
                    </Select>
                    <Select
                      label="Priority"
                      placeholder="Select priority"
                      defaultSelectedKeys={
                        selectedProject ? [selectedProject.priority] : undefined
                      }
                    >
                      <SelectItem key="low" value="low">
                        Low
                      </SelectItem>
                      <SelectItem key="medium" value="medium">
                        Medium
                      </SelectItem>
                      <SelectItem key="high" value="high">
                        High
                      </SelectItem>
                    </Select>
                  </div>
                  <div className="flex gap-4">
                    <Input
                      type="date"
                      label="Start Date"
                      placeholder="Select start date"
                      defaultValue={
                        selectedProject?.startDate.split("T")[0]
                      }
                    />
                    <Input
                      type="date"
                      label="End Date"
                      placeholder="Select end date"
                      defaultValue={selectedProject?.endDate.split("T")[0]}
                    />
                  </div>
                  <Select
                    label="Department"
                    placeholder="Select department"
                    defaultSelectedKeys={
                      selectedProject
                        ? [selectedProject.department.id.toString()]
                        : undefined
                    }
                  >
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  {modalMode === "add" ? "Add Project" : "Save Changes"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 