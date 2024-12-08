import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IRequestAccess } from "@/lib/types/request";
import { z } from "zod";

// Request validation schema
const requestSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-() ]+$/, "Invalid phone number format"),
  teamSize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { requestAccess } = getRepositories();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    // Check if email already exists
    const existingRequest = await requestAccess.findOne({
      where: { email: validatedData.email },
    });

    if (existingRequest) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "A request with this email already exists" },
        { status: 409 }
      );
    }

    // Create new request
    const newRequest = requestAccess.create(validatedData);
    await requestAccess.save(newRequest);

    // Send email notification (implement this later)
    // await sendRequestNotification(newRequest);

    return NextResponse.json<ApiResponse<IRequestAccess>>(
      {
        data: newRequest,
        message: "Request submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);

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

export async function GET() {
  try {
    await initializeDatabase();
    const { requestAccess } = getRepositories();
    console.log(requestAccess)
    const requests = await requestAccess.find({
      order: { createdAt: "DESC" },
    });

    return NextResponse.json<ApiResponse<IRequestAccess[]>>({
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
