"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { FiMoreVertical } from "react-icons/fi";
import { IRequestAccess, RequestStatus } from "@/lib/types/request";

const statusColorMap: Record<RequestStatus, "default" | "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default function RequestsPage() {
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<IRequestAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/request-access");
        const data = await response.json();
        if (response.ok) {
          setRequests(data.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId: number, newStatus: RequestStatus) => {
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === requestId
              ? { ...request, status: newStatus }
              : request
          )
        );
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const statusFilter = searchParams.get("status");
    if (!statusFilter) return true;
    return request.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const pages = Math.ceil(filteredRequests.length / rowsPerPage);
  const items = filteredRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const renderCell = (request: IRequestAccess, columnKey: string) => {
    switch (columnKey) {
      case "company":
        return (
          <div>
            <p className="font-medium">{request.companyName}</p>
            <p className="text-sm text-gray-500">{request.teamSize} employees</p>
          </div>
        );
      case "contact":
        return (
          <div>
            <p className="font-medium">{request.name}</p>
            <p className="text-sm text-gray-500">{request.email}</p>
            <p className="text-sm text-gray-500">{request.phone}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            color={statusColorMap[request.status]}
            variant="flat"
            size="sm"
          >
            {request.status}
          </Chip>
        );
      case "date":
        return new Date(request.createdAt).toLocaleDateString();
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <FiMoreVertical className="text-default-500" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Request actions">
              <DropdownItem
                key="approve"
                color="success"
                className={request.status !== "PENDING" ? "hidden" : ""}
                onPress={() => handleStatusChange(request.id, "APPROVED")}
              >
                Approve Request
              </DropdownItem>
              <DropdownItem
                key="reject"
                color="danger"
                className={request.status !== "PENDING" ? "hidden" : ""}
                onPress={() => handleStatusChange(request.id, "REJECTED")}
              >
                Reject Request
              </DropdownItem>
              <DropdownItem
                key="reset"
                className={request.status === "PENDING" ? "hidden" : ""}
                onPress={() => handleStatusChange(request.id, "PENDING")}
              >
                Reset Status
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Access Requests</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage and respond to access requests from organizations
        </p>
      </div>

      <Table
        aria-label="Access requests table"
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
          <TableColumn key="company">Company</TableColumn>
          <TableColumn key="contact">Contact</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="date">Date</TableColumn>
          <TableColumn key="actions" align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          items={items}
          emptyContent="No requests found"
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
  );
} 