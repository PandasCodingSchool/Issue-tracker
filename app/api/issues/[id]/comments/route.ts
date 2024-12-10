import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { comments } = getRepositories();

    const issueComments = await comments.find({
      where: { issue: { id: parseInt(params.id) } },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });

    return NextResponse.json({
      success: true,
      data: issueComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch comments",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { comments, issues, users } = getRepositories();
    const data = await request.json();

    // Verify issue exists
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

    // Create and save the comment
    const newComment = comments.create({
      content: data.content,
      issue: { id: parseInt(params.id) },
      user: { id: data.userId }, // Replace with actual authenticated user ID
    });

    await comments.save(newComment);

    // Fetch the saved comment with relations
    const savedComment = await comments.findOne({
      where: { id: newComment.id },
      relations: ["user"],
    });

    return NextResponse.json({
      success: true,
      data: savedComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create comment",
      },
      { status: 500 }
    );
  }
}
