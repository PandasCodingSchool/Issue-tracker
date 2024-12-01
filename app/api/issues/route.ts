import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IIssue, IIssueCreate } from "@/lib/types";

export async function GET() {
  try {
    await initializeDatabase();
    const { issues } = getRepositories();
    const allIssues = await issues.find({
      relations: ["assignee", "reporter", "department"],
    });

    return NextResponse.json<ApiResponse<IIssue[]>>({
      data: allIssues,
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { issues, users, departments } = getRepositories();
    const body = (await request.json()) as IIssueCreate;

    // Verify assignee exists
    if (body.assigneeId) {
      const assignee = await users.findOne({
        where: { id: body.assigneeId },
      });
      if (!assignee) {
        return NextResponse.json<ApiResponse<never>>(
          { error: "Assignee not found" },
          { status: 404 }
        );
      }
    }

    // Verify reporter exists
    const reporter = await users.findOne({
      where: { id: body.reporterId },
    });
    if (!reporter) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Reporter not found" },
        { status: 404 }
      );
    }

    // Verify department exists
    if (body.departmentId) {
      const department = await departments.findOne({
        where: { id: body.departmentId },
      });
      if (!department) {
        return NextResponse.json<ApiResponse<never>>(
          { error: "Department not found" },
          { status: 404 }
        );
      }
    }

    const newIssue = issues.create({
      ...body,
      assignee: body.assigneeId ? { id: body.assigneeId } : null,
      reporter: { id: body.reporterId },
      department: body.departmentId ? { id: body.departmentId } : null,
    });
    await issues.save(newIssue);

    // Fetch the complete issue with relations
    const savedIssue = await issues.findOne({
      where: { id: newIssue.id },
      relations: ["assignee", "reporter", "department"],
    });

    return NextResponse.json<ApiResponse<IIssue>>(
      { data: savedIssue! },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
