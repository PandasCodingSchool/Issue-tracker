import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { users } = getRepositories();

    const searchParams = request.nextUrl.searchParams;
    const departmentId = searchParams.get("departmentId");

    let query = users
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.department", "department")
      .leftJoinAndSelect("user.assignedIssues", "assignedIssues")
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.phone",
        "user.role",
        "user.avatar",
        "department.id",
        "department.name",
        "assignedIssues.id",
        "assignedIssues.status",
      ]);

    if (departmentId) {
      query = query.where("department.id = :departmentId", { departmentId });
    }

    const members = await query.getMany();

    // Transform the data to include issue counts
    const transformedMembers = members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      avatar: member.avatar,
      department: member.department,
      assignedIssuesCount: {
        total: member.assignedIssues.length,
        open: member.assignedIssues.filter((i) => i.status === "OPEN").length,
        inProgress: member.assignedIssues.filter(
          (i) => i.status === "IN_PROGRESS"
        ).length,
        resolved: member.assignedIssues.filter((i) => i.status === "RESOLVED")
          .length,
      },
    }));

    return NextResponse.json({
      success: true,
      data: transformedMembers,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team members",
      },
      { status: 500 }
    );
  }
}

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
