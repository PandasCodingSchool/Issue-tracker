import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { IssueStatus } from "@/lib/constants/enums";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { departments } = getRepositories();

    const department = await departments.findOne({
      where: { id: parseInt(params.id) },
      relations: ["users", "issues"],
    });

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          error: "Department not found",
        },
        { status: 404 }
      );
    }

    // Transform the data to include statistics
    const totalMembers = (await department.users).length;
    const activeIssues = (await department.issues).filter(
      (issue) => issue.status === IssueStatus.OPEN
    ).length;
    const totalIssues = (await department.issues).length;
    const resolvedIssues = (await department.issues).filter(
      (issue) => issue.status === IssueStatus.COMPLETED
    ).length;
    const completionRate =
      totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

    const transformedDepartment = {
      id: department.id,
      name: department.name,
      description: department.description,
      totalMembers,
      activeIssues,
      completionRate,
      users: department.users,
      issues: department.issues,
    };

    return NextResponse.json({
      success: true,
      data: transformedDepartment,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch department",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { departments } = getRepositories();
    const data = await request.json();

    const department = await departments.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          error: "Department not found",
        },
        { status: 404 }
      );
    }

    departments.merge(department, {
      name: data.name,
      description: data.description,
    });

    await departments.save(department);

    return NextResponse.json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update department",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { departments, users } = getRepositories();

    const department = await departments.findOne({
      where: { id: parseInt(params.id) },
      relations: ["users"],
    });

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          error: "Department not found",
        },
        { status: 404 }
      );
    }

    // Check if department has users
    if ((await department.users).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete department with active users",
        },
        { status: 400 }
      );
    }

    await departments.remove(department);

    return NextResponse.json({
      success: true,
      data: { id: parseInt(params.id) },
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete department",
      },
      { status: 500 }
    );
  }
}
