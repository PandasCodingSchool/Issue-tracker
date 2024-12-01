import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IOrganization, IOrganizationCreate } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { organizations } = getRepositories();
    const allOrganizations = await organizations.find();

    return NextResponse.json<ApiResponse<IOrganization[]>>({
      data: allOrganizations,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { organizations } = getRepositories();
    const body = (await request.json()) as IOrganizationCreate;

    const newOrganization = organizations.create(body);
    await organizations.save(newOrganization);

    return NextResponse.json<ApiResponse<IOrganization>>(
      { data: newOrganization },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
