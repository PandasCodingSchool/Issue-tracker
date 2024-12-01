import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IIssue, IIssueUpdate } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { issues } = getRepositories();
    const issue = await issues.findOne({
      where: { id: parseInt(params.id) },
      relations: [
        "assignee",
        "reporter",
        "department",
        "comments",
        "attachments",
      ],
    });

    if (!issue) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Issue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IIssue>>({
      data: issue,
    });
  } catch (error) {
    console.error("Error fetching issue:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
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
    const { issues, users, departments } = getRepositories();
    const body = (await request.json()) as IIssueUpdate;

    const issue = await issues.findOne({
      where: { id: parseInt(params.id) },
      relations: ["assignee", "reporter", "department"],
    });

    if (!issue) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Issue not found" },
        { status: 404 }
      );
    }

    // Verify assignee exists if being updated
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
      issue.assignee = assignee;
    }

    // Verify department exists if being updated
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
      issue.department = department;
    }

    issues.merge(issue, body);
    await issues.save(issue);

    return NextResponse.json<ApiResponse<IIssue>>({
      data: issue,
    });
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
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
    const { issues } = getRepositories();

    const issue = await issues.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!issue) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Issue not found" },
        { status: 404 }
      );
    }

    await issues.remove(issue);

    return NextResponse.json<ApiResponse<never>>(
      { message: "Issue deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting issue:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
