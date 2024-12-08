import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IRequestAccess } from "@/lib/types/request";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { requestAccess } = getRepositories();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    // Find the request
    const accessRequest = await requestAccess.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!accessRequest) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Update the status
    accessRequest.status = validatedData.status;
    await requestAccess.save(accessRequest);

    // TODO: Send email notification to user about status update

    return NextResponse.json<ApiResponse<IRequestAccess>>({
      data: accessRequest,
      message: "Request status updated successfully",
    });
  } catch (error) {
    console.error("Error updating request status:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Invalid request data", message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
