import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { users, issues } = getRepositories();

    // Get total members count
    const totalMembers = await users.count();

    // Get issues statistics
    const issuesStats = await issues
      .createQueryBuilder("issue")
      .select([
        "COUNT(*) as total",
        "SUM(CASE WHEN issue.status = 'OPEN' THEN 1 ELSE 0 END) as open",
        "SUM(CASE WHEN issue.status = 'RESOLVED' THEN 1 ELSE 0 END) as resolved",
      ])
      .getRawOne();

    return NextResponse.json({
      success: true,
      data: {
        totalMembers,
        totalIssues: parseInt(issuesStats.total) || 0,
        openIssues: parseInt(issuesStats.open) || 0,
        resolvedIssues: parseInt(issuesStats.resolved) || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching team stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team stats",
      },
      { status: 500 }
    );
  }
}
