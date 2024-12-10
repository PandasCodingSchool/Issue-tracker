import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { users } = getRepositories();

    const orgUsers = await users
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.department", "department")
      .leftJoinAndSelect("user.assignedIssues", "assignedIssues")
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.role",
        "user.avatar",
        "user.status",
        "department.id",
        "department.name",
        "assignedIssues.id",
        "assignedIssues.status",
      ])
      .getMany();

    return NextResponse.json({
      success: true,
      data: orgUsers,
    });
  } catch (error) {
    console.error("Error fetching organization users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch organization users",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { users, departments } = getRepositories();
    const data = await request.json();

    // Verify department exists
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

    // Create new user
    const newUser = users.create({
      name: data.name,
      email: data.email,
      role: data.role,
      department: { id: data.departmentId },
      status: "active",
    });

    await users.save(newUser);

    // Fetch the complete user with relations
    const savedUser = await users.findOne({
      where: { id: newUser.id },
      relations: ["department"],
    });

    return NextResponse.json({
      success: true,
      data: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
      },
      { status: 500 }
    );
  }
}
