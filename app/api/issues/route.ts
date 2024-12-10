import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { IssueStatus, IssuePriority, IssueType } from "@/lib/constants/enums";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { issues } = getRepositories();

    const searchParams = request.nextUrl.searchParams;
    const assigneeId = searchParams.get("assigneeId");
    const departmentId = searchParams.get("departmentId");
    const status = searchParams.get("status") as IssueStatus;
    const priority = searchParams.get("priority") as IssuePriority;
    const type = searchParams.get("type") as IssueType;

    let query = issues
      .createQueryBuilder("issue")
      .leftJoinAndSelect("issue.assignee", "assignee")
      .leftJoinAndSelect("issue.reporter", "reporter")
      .leftJoinAndSelect("issue.department", "department")
      .leftJoinAndSelect("issue.comments", "comments")
      .leftJoinAndSelect("issue.attachments", "attachments");

    if (assigneeId) {
      query = query.where("assignee.id = :assigneeId", { assigneeId });
    }
    if (departmentId) {
      query = query.andWhere("department.id = :departmentId", { departmentId });
    }
    if (status) {
      query = query.andWhere("issue.status = :status", { status });
    }
    if (priority) {
      query = query.andWhere("issue.priority = :priority", { priority });
    }
    if (type) {
      query = query.andWhere("issue.type = :type", { type });
    }

    const issuesResult = await query.getMany();

    return NextResponse.json({
      success: true,
      data: issuesResult,
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch issues",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { issues } = getRepositories();
    const data = await request.json();

    const newIssue = issues.create({
      title: data.title,
      description: data.description,
      status: data.status || IssueStatus.OPEN,
      priority: data.priority,
      type: data.type,
      assignee: data.assigneeId,
      reporter: data.reporterId,
      department: data.departmentId,
      dueDate: data.dueDate,
    });

    await issues.save(newIssue);

    return NextResponse.json({
      success: true,
      data: newIssue,
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create issue",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    const { issues } = getRepositories();
    const data = await request.json();
    const { id, ...updateData } = data;

    const issue = await issues.findOne({
      where: { id },
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

    issues.merge(issue, updateData);
    await issues.save(issue);

    return NextResponse.json({
      success: true,
      data: issue,
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
