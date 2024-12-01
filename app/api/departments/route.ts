import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IDepartment, IDepartmentCreate } from "@/lib/types";

export async function GET() {
  try {
    await initializeDatabase();
    const { departments } = getRepositories();
    const allDepartments = await departments.find({
      relations: ["organization"],
    });

    return NextResponse.json<ApiResponse<IDepartment[]>>({
      data: allDepartments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { departments, organizations } = getRepositories();
    const body = (await request.json()) as IDepartmentCreate;

    // Verify organization exists
    const organization = await organizations.findOne({
      where: { id: body.organizationId },
    });

    if (!organization) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const newDepartment = departments.create({
      ...body,
      organization,
    });
    await departments.save(newDepartment);

    return NextResponse.json<ApiResponse<IDepartment>>(
      { data: newDepartment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
