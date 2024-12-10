import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { IssueStatus } from "@/lib/constants/enums";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { departments, users, issues } = getRepositories();

    const departmentsData = await departments
      .createQueryBuilder("department")
      .leftJoinAndSelect("department.users", "users")
      .leftJoinAndSelect("department.issues", "issues")
      .getMany();

    // Transform the data to include statistics
    const transformedDepartments = await Promise.all(
      departmentsData.map(async (dept) => {
        const totalMembers = dept.users.length;

        const activeIssues = dept.issues.filter(
          (issue) => issue.status === IssueStatus.OPEN
        ).length;

        const totalIssues = dept.issues.length;
        const resolvedIssues = dept.issues.filter(
          (issue) => issue.status === IssueStatus.RESOLVED
        ).length;

        const completionRate =
          totalIssues > 0
            ? Math.round((resolvedIssues / totalIssues) * 100)
            : 0;

        return {
          id: dept.id,
          name: dept.name,
          description: dept.description,
          totalMembers,
          activeIssues,
          completionRate,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: transformedDepartments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch departments",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { departments } = getRepositories();
    const data = await request.json();

    const newDepartment = departments.create({
      name: data.name,
      description: data.description,
    });

    await departments.save(newDepartment);

    return NextResponse.json({
      success: true,
      data: newDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create department",
      },
      { status: 500 }
    );
  }
}
