import { NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";

interface AdminStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export async function GET() {
  try {
    await initializeDatabase();
    const { requestAccess } = getRepositories();

    const [totalRequests, pendingRequests, approvedRequests, rejectedRequests] =
      await Promise.all([
        requestAccess.count(),
        requestAccess.count({ where: { status: "PENDING" } }),
        requestAccess.count({ where: { status: "APPROVED" } }),
        requestAccess.count({ where: { status: "REJECTED" } }),
      ]);

    return NextResponse.json<ApiResponse<AdminStats>>({
      data: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
