import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IComment, ICommentCreate } from "@/lib/types";

export async function GET() {
  try {
    await initializeDatabase();
    const { comments } = getRepositories();
    const allComments = await comments.find({
      relations: ["user", "issue"],
    });

    return NextResponse.json<ApiResponse<IComment[]>>({
      data: allComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { comments, users, issues } = getRepositories();
    const body = (await request.json()) as ICommentCreate;

    // Verify user exists
    const user = await users.findOne({
      where: { id: body.userId },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify issue exists
    const issue = await issues.findOne({
      where: { id: body.issueId },
    });

    if (!issue) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Issue not found" },
        { status: 404 }
      );
    }

    const newComment = comments.create({
      content: body.content,
      user,
      issue,
    });
    await comments.save(newComment);

    // Fetch the complete comment with relations
    const savedComment = await comments.findOne({
      where: { id: newComment.id },
      relations: ["user", "issue"],
    });

    return NextResponse.json<ApiResponse<IComment>>(
      { data: savedComment! },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
