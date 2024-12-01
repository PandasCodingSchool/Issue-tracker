import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IAttachment, IAttachmentCreate } from "@/lib/types";

export async function GET() {
  try {
    await initializeDatabase();
    const { attachments } = getRepositories();
    const allAttachments = await attachments.find({
      relations: ["issue"],
    });

    return NextResponse.json<ApiResponse<IAttachment[]>>({
      data: allAttachments,
    });
  } catch (error) {
    console.error("Error fetching attachments:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { attachments, issues } = getRepositories();
    const body = (await request.json()) as IAttachmentCreate;

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

    const newAttachment = attachments.create({
      ...body,
      issue,
    });
    await attachments.save(newAttachment);

    // Fetch the complete attachment with relations
    const savedAttachment = await attachments.findOne({
      where: { id: newAttachment.id },
      relations: ["issue"],
    });

    return NextResponse.json<ApiResponse<IAttachment>>(
      { data: savedAttachment! },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating attachment:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
