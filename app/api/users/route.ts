import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { IUser, IUserCreate } from "@/lib/types";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const { users } = getRepositories();
    const allUsers = await users.find({
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

    return NextResponse.json<ApiResponse<IUser[]>>({
      data: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { users } = getRepositories();
    const body = (await request.json()) as IUserCreate;

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = users.create({
      ...body,
      password: hashedPassword,
    });
    await users.save(newUser);

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json<ApiResponse<IUser>>(
      { data: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
