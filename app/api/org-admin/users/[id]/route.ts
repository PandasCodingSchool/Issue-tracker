import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { users } = getRepositories();

    const user = await users.findOne({
      where: { id: parseInt(params.id) },
      relations: ["department", "assignedIssues"],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
      },
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
    const { users, departments } = getRepositories();
    const data = await request.json();

    const user = await users.findOne({
      where: { id: parseInt(params.id) },
      relations: ["department"],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // If department is being updated, verify it exists
    if (data.departmentId) {
      const department = await departments.findOne({
        where: { id: data.departmentId },
      });

      if (!department) {
        return NextResponse.json(
          {
            success: false,
            error: "Department not found",
          },
          { status: 404 }
        );
      }
    }

    // Update user
    users.merge(user, {
      ...data,
      department: data.departmentId
        ? { id: data.departmentId }
        : user.department,
    });

    await users.save(user);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user",
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
    const { users } = getRepositories();

    const user = await users.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Instead of deleting, set status to inactive
    user.status = "inactive";
    await users.save(user);

    return NextResponse.json({
      success: true,
      data: { id: parseInt(params.id) },
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to deactivate user",
      },
      { status: 500 }
    );
  }
}
