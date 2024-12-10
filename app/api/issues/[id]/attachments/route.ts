import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { attachments } = getRepositories();

    const issueAttachments = await attachments.find({
      where: { issue: { id: parseInt(params.id) } },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });

    return NextResponse.json({
      success: true,
      data: issueAttachments,
    });
  } catch (error) {
    console.error("Error fetching attachments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch attachments",
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
    const { attachments, issues } = getRepositories();

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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string; // Replace with actual authenticated user ID

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Upload the file to a storage service (e.g., S3, Google Cloud Storage)
    // 2. Get the URL of the uploaded file
    // For this example, we'll just store the file name
    const newAttachment = attachments.create({
      filename: file.name,
      filesize: file.size,
      mimetype: file.type,
      url: `/uploads/${file.name}`, // Replace with actual file URL
      issue: { id: parseInt(params.id) },
      user: { id: parseInt(userId) },
    });

    await attachments.save(newAttachment);

    // Fetch the saved attachment with relations
    const savedAttachment = await attachments.findOne({
      where: { id: newAttachment.id },
      relations: ["user"],
    });

    return NextResponse.json({
      success: true,
      data: savedAttachment,
    });
  } catch (error) {
    console.error("Error uploading attachment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload attachment",
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
    const { attachments } = getRepositories();

    const attachmentId = request.nextUrl.searchParams.get("attachmentId");
    if (!attachmentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Attachment ID is required",
        },
        { status: 400 }
      );
    }

    const attachment = await attachments.findOne({
      where: {
        id: parseInt(attachmentId),
        issue: { id: parseInt(params.id) },
      },
    });

    if (!attachment) {
      return NextResponse.json(
        {
          success: false,
          error: "Attachment not found",
        },
        { status: 404 }
      );
    }

    // Here you would typically:
    // 1. Delete the file from your storage service
    // 2. Remove the database record

    await attachments.remove(attachment);

    return NextResponse.json({
      success: true,
      data: { id: parseInt(attachmentId) },
    });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete attachment",
      },
      { status: 500 }
    );
  }
}
