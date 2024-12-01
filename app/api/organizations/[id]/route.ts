import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IOrganization, IOrganizationUpdate } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { organizations } = getRepositories();
    const organization = await organizations.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!organization) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IOrganization>>({
      data: organization,
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
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
    const { organizations } = getRepositories();
    const body = (await request.json()) as IOrganizationUpdate;

    const organization = await organizations.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!organization) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    organizations.merge(organization, body);
    await organizations.save(organization);

    return NextResponse.json<ApiResponse<IOrganization>>({
      data: organization,
    });
  } catch (error) {
    console.error("Error updating organization:", error);
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
    const { organizations } = getRepositories();

    const organization = await organizations.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!organization) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    await organizations.remove(organization);

    return NextResponse.json<ApiResponse<never>>(
      { message: "Organization deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
