import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IDepartment, IDepartmentUpdate } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { departments } = getRepositories();
    const department = await departments.findOne({
      where: { id: parseInt(params.id) },
      relations: ["organization"],
    });

    if (!department) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IDepartment>>({
      data: department,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
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
    const { departments, organizations } = getRepositories();
    const body = (await request.json()) as IDepartmentUpdate;

    const department = await departments.findOne({
      where: { id: parseInt(params.id) },
      relations: ["organization"],
    });

    if (!department) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    // If organization is being updated, verify it exists
    if (body.organizationId) {
      const organization = await organizations.findOne({
        where: { id: body.organizationId },
      });

      if (!organization) {
        return NextResponse.json<ApiResponse<never>>(
          { error: "Organization not found" },
          { status: 404 }
        );
      }

      department.organization = organization;
    }

    departments.merge(department, body);
    await departments.save(department);

    return NextResponse.json<ApiResponse<IDepartment>>({
      data: department,
    });
  } catch (error) {
    console.error("Error updating department:", error);
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
    const { departments } = getRepositories();

    const department = await departments.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!department) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    await departments.remove(department);

    return NextResponse.json<ApiResponse<never>>(
      { message: "Department deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
