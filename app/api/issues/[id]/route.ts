import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";

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
        "comments.user",
        "attachments",
      ],
    });

    if (!issue) {
      return NextResponse.json(
        {
          success: false,
          error: "Issue not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: issue,
    });
  } catch (error) {
    console.error("Error fetching issue:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch issue",
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
    const { issues } = getRepositories();
    const data = await request.json();

    const issue = await issues.findOne({
      where: { id: parseInt(params.id) },
      relations: ["assignee", "reporter", "department"],
    });

    if (!issue) {
      return NextResponse.json(
        {
          success: false,
          error: "Issue not found",
        },
        { status: 404 }
      );
    }

    issues.merge(issue, {
      ...data,
      assignee: data.assigneeId ? { id: data.assigneeId } : issue.assignee,
      department: data.departmentId
        ? { id: data.departmentId }
        : issue.department,
    });

    await issues.save(issue);

    // Fetch updated issue with all relations
    const updatedIssue = await issues.findOne({
      where: { id: parseInt(params.id) },
      relations: [
        "assignee",
        "reporter",
        "department",
        "comments",
        "comments.user",
        "attachments",
      ],
    });

    return NextResponse.json({
      success: true,
      data: updatedIssue,
    });
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update issue",
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
    const { issues } = getRepositories();

    const issue = await issues.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!issue) {
      return NextResponse.json(
        {
          success: false,
          error: "Issue not found",
        },
        { status: 404 }
      );
    }

    await issues.remove(issue);

    return NextResponse.json({
      success: true,
      data: { id: parseInt(params.id) },
    });
  } catch (error) {
    console.error("Error deleting issue:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete issue",
      },
      { status: 500 }
    );
  }
}
