import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { IssueStatus } from "@/lib/constants/enums";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { projects } = getRepositories();

    const project = await projects.findOne({
      where: { id: parseInt(params.id) },
      relations: ["department", "teamMembers", "issues"],
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }

    // Transform the data to include statistics
    const totalIssues = project.issues.length;
    const completedIssues = project.issues.filter(
      (issue) => issue.status === IssueStatus.RESOLVED
    ).length;
    const progress =
      totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

    const transformedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
      department: project.department,
      progress,
      totalIssues,
      completedIssues,
      teamMembers: project.teamMembers.length,
      issues: project.issues,
    };

    return NextResponse.json({
      success: true,
      data: transformedProject,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project",
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
    const { projects, departments } = getRepositories();
    const data = await request.json();

    const project = await projects.findOne({
      where: { id: parseInt(params.id) },
      relations: ["department"],
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }

    // If department is being updated, verify it exists
    if (data.departmentId) {
      const department = await departments.findOne({
        where: { id: data.departmentId },
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
    }

    projects.merge(project, {
      ...data,
      department: data.departmentId
        ? { id: data.departmentId }
        : project.department,
    });

    await projects.save(project);

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project",
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
    const { projects } = getRepositories();

    const project = await projects.findOne({
      where: { id: parseInt(params.id) },
      relations: ["issues"],
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }

    // Check if project has active issues
    const hasActiveIssues = project.issues.some(
      (issue) => issue.status !== IssueStatus.RESOLVED
    );

    if (hasActiveIssues) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete project with active issues",
        },
        { status: 400 }
      );
    }

    await projects.remove(project);

    return NextResponse.json({
      success: true,
      data: { id: parseInt(params.id) },
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete project",
      },
      { status: 500 }
    );
  }
}
