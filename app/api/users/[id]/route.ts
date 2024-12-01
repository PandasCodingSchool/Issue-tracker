import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IUser, IUserUpdate } from "@/lib/types";
import bcrypt from "bcryptjs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { users } = getRepositories();
    const user = await users.findOne({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IUser>>({
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
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
    const { users } = getRepositories();
    const body = (await request.json()) as IUserUpdate;

    const user = await users.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If password is being updated, hash it
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    users.merge(user, body);
    await users.save(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json<ApiResponse<IUser>>({
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating user:", error);
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
    const { users } = getRepositories();

    const user = await users.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await users.remove(user);

    return NextResponse.json<ApiResponse<never>>(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
