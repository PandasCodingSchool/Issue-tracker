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
  Input,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiList,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";
import { UserRole } from "@/lib/constants/enums";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  department: {
    id: number;
    name: string;
  };
  assignedIssuesCount: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
  };
}

interface TeamStats {
  totalMembers: number;
  totalIssues: number;
  resolvedIssues: number;
  openIssues: number;
}

export default function TeamPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [stats, setStats] = useState<TeamStats>({
    totalMembers: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    openIssues: 0,
  });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      // Replace with actual API calls
      const membersResponse = await fetch("/api/team/members");
      const statsResponse = await fetch("/api/team/stats");

      if (membersResponse.ok && statsResponse.ok) {
        const membersData = await membersResponse.json();
        const statsData = await statsResponse.json();
        setMembers(membersData.data);
        setStats(statsData.data);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const handleViewMemberDetails = (member: TeamMember) => {
    setSelectedMember(member);
    onOpen();
  };

  const statCards = [
    {
      title: "Team Members",
      value: stats.totalMembers,
      icon: FiList,
      color: "primary",
    },
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
      title: "Resolved Issues",
      value: stats.resolvedIssues,
      icon: FiCheckCircle,
      color: "success",
    },
  ] as const;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Team Overview</h1>
        <p className="mt-2 text-sm text-gray-700">
          View team members and their progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Team Members</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Team members table">
            <TableHeader>
              <TableColumn key="member">MEMBER</TableColumn>
              <TableColumn key="role">ROLE</TableColumn>
              <TableColumn key="department">DEPARTMENT</TableColumn>
              <TableColumn key="totalIssues">TOTAL ISSUES</TableColumn>
              <TableColumn key="openIssues">OPEN ISSUES</TableColumn>
              <TableColumn key="resolvedIssues">RESOLVED ISSUES</TableColumn>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow
                  key={member.id}
                  className="cursor-pointer"
                  onClick={() => handleViewMemberDetails(member)}
                >
                  <TableCell>
                    <User
                      name={member.name}
                      description={member.email}
                      avatarProps={{ src: member.avatar }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={
                        member.role === UserRole.ADMIN
                          ? "secondary"
                          : member.role === UserRole.MANAGER
                          ? "primary"
                          : "default"
                      }
                      variant="flat"
                      size="sm"
                    >
                      {member.role}
                    </Chip>
                  </TableCell>
                  <TableCell>{member.department.name}</TableCell>
                  <TableCell>{member.assignedIssuesCount.total}</TableCell>
                  <TableCell>
                    <Chip color="warning" variant="flat" size="sm">
                      {member.assignedIssuesCount.open}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip color="success" variant="flat" size="sm">
                      {member.assignedIssuesCount.resolved}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Member Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-4">
                  <User
                    name={selectedMember?.name}
                    description={selectedMember?.email}
                    avatarProps={{ src: selectedMember?.avatar, size: "lg" }}
                  />
                </div>
              </ModalHeader>
              <ModalBody>
                <Tabs aria-label="Member details">
                  <Tab key="details" title="Details">
                    <Card>
                      <CardBody className="gap-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-gray-500">Role</p>
                          <Chip
                            color={
                              selectedMember?.role === UserRole.ADMIN
                                ? "secondary"
                                : selectedMember?.role === UserRole.MANAGER
                                ? "primary"
                                : "default"
                            }
                            variant="flat"
                          >
                            {selectedMember?.role}
                          </Chip>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-gray-500">Department</p>
                          <p>{selectedMember?.department.name}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-gray-500">Contact</p>
                          <div className="flex items-center gap-2">
                            <FiMail className="text-gray-400" />
                            <p>{selectedMember?.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiPhone className="text-gray-400" />
                            <p>{selectedMember?.phone}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="issues" title="Issues">
                    <Card>
                      <CardBody>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col items-center p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-gray-500">Open Issues</p>
                            <p className="text-2xl font-semibold text-warning">
                              {selectedMember?.assignedIssuesCount.open}
                            </p>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-gray-500">In Progress</p>
                            <p className="text-2xl font-semibold text-primary">
                              {selectedMember?.assignedIssuesCount.inProgress}
                            </p>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-gray-500">Resolved</p>
                            <p className="text-2xl font-semibold text-success">
                              {selectedMember?.assignedIssuesCount.resolved}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 