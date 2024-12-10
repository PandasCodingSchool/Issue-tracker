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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  useDisclosure,
  Progress,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

interface Department {
  id: number;
  name: string;
  description: string;
  totalMembers: number;
  activeIssues: number;
  completionRate: number;
}

export default function DepartmentsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/org-admin/departments");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleAddDepartment = () => {
    setModalMode("add");
    setSelectedDepartment(null);
    onOpen();
  };

  const handleEditDepartment = (department: Department) => {
    setModalMode("edit");
    setSelectedDepartment(department);
    onOpen();
  };

  const handleDeleteDepartment = async (departmentId: number) => {
    try {
      const response = await fetch(`/api/org-admin/departments/${departmentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDepartments((prev) =>
          prev.filter((dept) => dept.id !== departmentId)
        );
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(filterValue.toLowerCase()) ||
    dept.description.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Departments</h1>
          <p className="text-gray-500">
            Manage organization departments and their members
          </p>
        </div>
        <Button
          color="primary"
          startContent={<FiPlus />}
          onPress={handleAddDepartment}
        >
          Add Department
        </Button>
      </div>

      <Card className="bg-white">
        <CardHeader className="flex justify-between">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search departments..."
            startContent={<FiSearch />}
            value={filterValue}
            onValueChange={setFilterValue}
          />
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Departments table">
            <TableHeader>
              <TableColumn>DEPARTMENT</TableColumn>
              <TableColumn>MEMBERS</TableColumn>
              <TableColumn>ACTIVE ISSUES</TableColumn>
              <TableColumn>COMPLETION RATE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-small text-default-500">
                        {dept.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-default-500" />
                      <span>{dept.totalMembers}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip color="warning" variant="flat" size="sm">
                      {dept.activeIssues}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Progress
                        size="sm"
                        value={dept.completionRate}
                        color="success"
                        className="max-w-md"
                      />
                      <span className="text-small text-default-500">
                        {dept.completionRate}% Complete
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <FiMoreVertical className="text-default-500" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Department actions">
                        <DropdownItem
                          startContent={<FiEdit2 className="text-default-500" />}
                          onPress={() => handleEditDepartment(dept)}
                        >
                          Edit Department
                        </DropdownItem>
                        <DropdownItem
                          startContent={<FiUsers className="text-default-500" />}
                          href={`/org-admin/departments/${dept.id}/members`}
                        >
                          Manage Members
                        </DropdownItem>
                        <DropdownItem
                          startContent={<FiTrash2 className="text-danger" />}
                          className="text-danger"
                          color="danger"
                          onPress={() => handleDeleteDepartment(dept.id)}
                        >
                          Delete Department
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
                {modalMode === "add" ? "Add New Department" : "Edit Department"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    placeholder="Enter department name"
                    defaultValue={selectedDepartment?.name}
                  />
                  <Input
                    label="Description"
                    placeholder="Enter department description"
                    defaultValue={selectedDepartment?.description}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  {modalMode === "add" ? "Add Department" : "Save Changes"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 