import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { users, departments, issues } = getRepositories();

    // Get recent user activities
    const recentUsers = await users
      .createQueryBuilder("user")
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.avatar",
        "user.createdAt",
      ])
      .orderBy("user.createdAt", "DESC")
      .take(5)
      .getMany();

    // Get recent department activities
    const recentDepartments = await departments
      .createQueryBuilder("department")
      .select(["department.id", "department.name", "department.createdAt"])
      .orderBy("department.createdAt", "DESC")
      .take(5)
      .getMany();

    // Get recent resolved issues
    const recentResolvedIssues = await issues
      .createQueryBuilder("issue")
      .leftJoinAndSelect("issue.assignee", "assignee")
      .where("issue.status = :status", { status: "RESOLVED" })
      .orderBy("issue.updatedAt", "DESC")
      .take(5)
      .getMany();

    // Combine and transform activities
    const activities = [
      ...recentUsers.map((user) => ({
        id: `user-${user.id}`,
        type: "user_added" as const,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        description: "New user joined the organization",
        timestamp: user.createdAt,
      })),
      ...recentDepartments.map((dept) => ({
        id: `dept-${dept.id}`,
        type: "department_created" as const,
        user: {
          id: 1, // Replace with actual admin user
          name: "Admin",
          email: "admin@example.com",
          avatar: "",
        },
        description: `Created new department: ${dept.name}`,
        timestamp: dept.createdAt,
      })),
      ...recentResolvedIssues.map((issue) => ({
        id: `issue-${issue.id}`,
        type: "issue_resolved" as const,
        user: {
          id: issue.assignee.id,
          name: issue.assignee.name,
          email: issue.assignee.email,
          avatar: issue.assignee.avatar,
        },
        description: `Resolved issue: ${issue.title}`,
        timestamp: issue.updatedAt,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching activity feed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch activity feed",
      },
      { status: 500 }
    );
  }
}
