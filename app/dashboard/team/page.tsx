"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  FiUserPlus,
  FiMail,
  FiPhone,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";
import { UserRole } from "@/lib/constants/enums";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  avatar: string;
  status: "active" | "inactive";
}

const roleColorMap: Record<UserRole, "default" | "primary" | "secondary" | "success"> = {
  [UserRole.ADMIN]: "secondary",
  [UserRole.MANAGER]: "primary",
  [UserRole.EMPLOYEE]: "default",
  [UserRole.GUEST]: "default",
};

export default function TeamPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockMembers: TeamMember[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: ["John Doe", "Jane Smith", "Alice Johnson", "Bob Wilson"][Math.floor(Math.random() * 4)],
      email: "user@example.com",
      phone: "+1 (555) 000-0000",
      role: Object.values(UserRole)[Math.floor(Math.random() * 4)],
      department: ["Engineering", "Design", "Marketing", "Sales"][Math.floor(Math.random() * 4)],
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
      status: Math.random() > 0.2 ? "active" : "inactive",
    }));

    setMembers(mockMembers);
  }, []);

  const handleAddMember = () => {
    setModalMode("add");
    setSelectedMember(null);
    onOpen();
  };

  const handleEditMember = (member: TeamMember) => {
    setModalMode("edit");
    setSelectedMember(member);
    onOpen();
  };

  const handleDeleteMember = (memberId: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const renderCell = (member: TeamMember, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            name={member.name}
            description={member.email}
            avatarProps={{ src: member.avatar }}
          />
        );
      case "role":
        return (
          <Chip
            color={roleColorMap[member.role]}
            variant="flat"
            size="sm"
          >
            {member.role}
          </Chip>
        );
      case "department":
        return (
          <Chip
            variant="flat"
            size="sm"
          >
            {member.department}
          </Chip>
        );
      case "status":
        return (
          <Chip
            color={member.status === "active" ? "success" : "default"}
            variant="dot"
            size="sm"
          >
            {member.status}
          </Chip>
        );
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <FiMoreVertical className="text-default-500" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Member actions">
              <DropdownItem
                startContent={<FiEdit2 className="text-default-500" />}
                onPress={() => handleEditMember(member)}
              >
                Edit Member
              </DropdownItem>
              <DropdownItem
                startContent={<FiTrash2 className="text-danger" />}
                className="text-danger"
                color="danger"
                onPress={() => handleDeleteMember(member.id)}
              >
                Remove Member
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return member[columnKey as keyof TeamMember];
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your team members and their roles
          </p>
        </div>
        <Button
          color="primary"
          startContent={<FiUserPlus />}
          onPress={handleAddMember}
        >
          Add Member
        </Button>
      </div>

      <Card>
        <CardBody>
          <Table aria-label="Team members table">
            <TableHeader>
              <TableColumn key="name">NAME</TableColumn>
              <TableColumn key="role">ROLE</TableColumn>
              <TableColumn key="department">DEPARTMENT</TableColumn>
              <TableColumn key="phone">PHONE</TableColumn>
              <TableColumn key="status">STATUS</TableColumn>
              <TableColumn key="actions" align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody items={members}>
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
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {modalMode === "add" ? "Add New Member" : "Edit Member"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    placeholder="Enter member name"
                    defaultValue={selectedMember?.name}
                  />
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Enter email address"
                    startContent={<FiMail />}
                    defaultValue={selectedMember?.email}
                  />
                  <Input
                    type="tel"
                    label="Phone"
                    placeholder="Enter phone number"
                    startContent={<FiPhone />}
                    defaultValue={selectedMember?.phone}
                  />
                  <Select
                    label="Role"
                    placeholder="Select member role"
                    defaultSelectedKeys={selectedMember ? [selectedMember.role] : undefined}
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
                    defaultSelectedKeys={selectedMember ? [selectedMember.department] : undefined}
                  >
                    {["Engineering", "Design", "Marketing", "Sales"].map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
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
                  {modalMode === "add" ? "Add Member" : "Save Changes"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 