import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IAttachment } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { attachments } = getRepositories();
    const attachment = await attachments.findOne({
      where: { id: parseInt(params.id) },
      relations: ["issue"],
    });

    if (!attachment) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IAttachment>>({
      data: attachment,
    });
  } catch (error) {
    console.error("Error fetching attachment:", error);
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
    const { attachments } = getRepositories();

    const attachment = await attachments.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!attachment) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    await attachments.remove(attachment);

    return NextResponse.json<ApiResponse<never>>(
      { message: "Attachment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
