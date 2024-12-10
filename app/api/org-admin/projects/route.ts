import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { IssueStatus } from "@/lib/constants/enums";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { projects, users, issues } = getRepositories();

    const projectsData = await projects
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.department", "department")
      .leftJoinAndSelect("project.teamMembers", "teamMembers")
      .leftJoinAndSelect("project.issues", "issues")
      .getMany();

    // Transform the data to include statistics
    const transformedProjects = projectsData.map((project) => {
      const totalIssues = project.issues.length;
      const completedIssues = project.issues.filter(
        (issue) => issue.status === IssueStatus.RESOLVED
      ).length;
      const progress =
        totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

      return {
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
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { projects, departments } = getRepositories();
    const data = await request.json();

    // Verify department exists
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

    const newProject = projects.create({
      name: data.name,
      description: data.description,
      status: data.status || "active",
      priority: data.priority,
      startDate: data.startDate,
      endDate: data.endDate,
      department: { id: data.departmentId },
    });

    await projects.save(newProject);

    // Fetch the complete project with relations
    const savedProject = await projects.findOne({
      where: { id: newProject.id },
      relations: ["department"],
    });

    return NextResponse.json({
      success: true,
      data: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      { status: 500 }
    );
  }
}
