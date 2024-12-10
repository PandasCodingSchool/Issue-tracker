import { NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { EntityMetadataNotFoundError } from "typeorm";

interface AdminStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export async function GET() {
  try {
    const dataSource = await initializeDatabase();
    console.log(
      "Available entities:",
      dataSource.entityMetadatas.map((m) => m.name)
    );

    const { requestAccess } = getRepositories();
    console.log("RequestAccess repository:", requestAccess.metadata.tableName);

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

    if (error instanceof EntityMetadataNotFoundError) {
      return NextResponse.json<ApiResponse<never>>(
        {
          error: "Database Configuration Error",
          message:
            "Entity not found. Please ensure the database is properly configured.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<never>>(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
