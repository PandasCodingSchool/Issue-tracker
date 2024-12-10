import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { IssueStatus } from "@/lib/constants/enums";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { users, departments, issues } = getRepositories();

    // Get total users count
    const totalUsers = await users.count();

    // Get total departments count
    const totalDepartments = await departments.count();

    // Get total projects count (assuming projects are stored in departments)
    const totalProjects = await departments.count();

    // Get active issues count
    const activeIssues = await issues.count({
      where: {
        status: IssueStatus.OPEN,
      },
    });

    // Get resolved issues count
    const resolvedIssues = await issues.count({
      where: {
        status: IssueStatus.RESOLVED,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalDepartments,
        totalProjects,
        activeIssues,
        resolvedIssues,
      },
    });
  } catch (error) {
    console.error("Error fetching organization stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch organization stats",
      },
      { status: 500 }
    );
  }
}
