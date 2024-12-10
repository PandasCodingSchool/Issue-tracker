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
  User,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiMail,
} from "react-icons/fi";
import { UserRole } from "@/lib/constants/enums";

interface OrgUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: {
    id: number;
    name: string;
  };
  status: "active" | "inactive";
  avatar: string;
}

interface Department {
  id: number;
  name: string;
}

export default function UsersPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/org-admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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

  const handleAddUser = () => {
    setModalMode("add");
    setSelectedUser(null);
    onOpen();
  };

  const handleEditUser = (user: OrgUser) => {
    setModalMode("edit");
    setSelectedUser(user);
    onOpen();
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/org-admin/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
    user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
    user.department.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Users</h1>
          <p className="text-gray-500">Manage organization users and their roles</p>
        </div>  
        <Button
          color="primary"
          startContent={<FiPlus />}
          onPress={handleAddUser}
        >
          Add User
        </Button>
      </div>

      <Card className="bg-white">
        <CardHeader className="flex justify-between">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search users..."
            startContent={<FiSearch />}
            value={filterValue}
            onValueChange={setFilterValue}
          />
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Users table">
            <TableHeader>
              <TableColumn>USER</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>DEPARTMENT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <User
                      name={user.name}
                      description={user.email}
                      avatarProps={{ src: user.avatar }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={
                        user.role === UserRole.ADMIN
                          ? "secondary"
                          : user.role === UserRole.MANAGER
                          ? "primary"
                          : "default"
                      }
                      variant="flat"
                      size="sm"
                    >
                      {user.role}
                    </Chip>
                  </TableCell>
                  <TableCell>{user.department.name}</TableCell>
                  <TableCell>
                    <Chip
                      color={user.status === "active" ? "success" : "default"}
                      variant="dot"
                      size="sm"
                    >
                      {user.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <FiMoreVertical className="text-default-500" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="User actions">
                        <DropdownItem
                          startContent={<FiEdit2 className="text-default-500" />}
                          onPress={() => handleEditUser(user)}
                        >
                          Edit User
                        </DropdownItem>
                        <DropdownItem
                          startContent={<FiMail className="text-default-500" />}
                        >
                          Send Invite
                        </DropdownItem>
                        <DropdownItem
                          startContent={<FiTrash2 className="text-danger" />}
                          className="text-danger"
                          color="danger"
                          onPress={() => handleDeleteUser(user.id)}
                        >
                          Delete User
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {modalMode === "add" ? "Add New User" : "Edit User"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    placeholder="Enter user name"
                    defaultValue={selectedUser?.name}
                  />
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Enter email address"
                    startContent={<FiMail />}
                    defaultValue={selectedUser?.email}
                  />
                  <Select
                    label="Role"
                    placeholder="Select user role"
                    defaultSelectedKeys={selectedUser ? [selectedUser.role] : undefined}
                  >
                    {Object.values(UserRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Department"
                    placeholder="Select department"
                    defaultSelectedKeys={selectedUser ? [selectedUser.department.id.toString()] : undefined}
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
                  {modalMode === "add" ? "Add User" : "Save Changes"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 