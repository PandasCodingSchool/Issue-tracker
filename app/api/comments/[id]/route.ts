import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IComment, ICommentUpdate } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { comments } = getRepositories();
    const comment = await comments.findOne({
      where: { id: parseInt(params.id) },
      relations: ["user", "issue"],
    });

    if (!comment) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IComment>>({
      data: comment,
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
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
    const { comments } = getRepositories();
    const body = (await request.json()) as ICommentUpdate;

    const comment = await comments.findOne({
      where: { id: parseInt(params.id) },
      relations: ["user", "issue"],
    });

    if (!comment) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Only allow updating content
    comments.merge(comment, { content: body.content });
    await comments.save(comment);

    return NextResponse.json<ApiResponse<IComment>>({
      data: comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
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
    const { comments } = getRepositories();

    const comment = await comments.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!comment) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    await comments.remove(comment);

    return NextResponse.json<ApiResponse<never>>(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
