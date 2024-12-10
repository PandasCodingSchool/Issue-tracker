import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IRequestAccess } from "@/lib/types/request";
import { z } from "zod";
import { EntityMetadataNotFoundError } from "typeorm";

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
    const dataSource = await initializeDatabase();
    console.log("Database connection status:", {
      isInitialized: dataSource.isInitialized,
      isConnected: dataSource.isConnected,
    });

    const { requestAccess } = getRepositories();
    console.log("RequestAccess repository:", requestAccess.metadata.tableName);

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
    const newRequest = requestAccess.create({
      ...validatedData,
      status: "PENDING",
    });

    const savedRequest = await requestAccess.save(newRequest);
    console.log("Request saved successfully:", savedRequest.id);

    return NextResponse.json<ApiResponse<IRequestAccess>>(
      {
        data: savedRequest,
        message: "Request submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);

    if (error instanceof EntityMetadataNotFoundError) {
      return NextResponse.json<ApiResponse<never>>(
        {
          error: "Database Configuration Error",
          message:
            "Entity not found. Please ensure the database is properly configured.",
        },
        { status: 500 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Invalid request data", message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<never>>(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dataSource = await initializeDatabase();
    console.log("Database connection status:", {
      isInitialized: dataSource.isInitialized,
      isConnected: dataSource.isConnected,
    });

    const { requestAccess } = getRepositories();
    console.log(
      "Fetching requests from table:",
      requestAccess.metadata.tableName
    );

    const requests = await requestAccess.find({
      order: { createdAt: "DESC" },
    });

    console.log(`Found ${requests.length} requests`);

    return NextResponse.json<ApiResponse<IRequestAccess[]>>({
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);

    if (error instanceof EntityMetadataNotFoundError) {
      return NextResponse.json<ApiResponse<never>>(
        {
          error: "Database Configuration Error",
          message:
            "Entity not found. Please ensure the database is properly configured.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<never>>(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
