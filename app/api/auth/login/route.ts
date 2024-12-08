import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";
import { ApiResponse } from "@/lib/types/api";
import { AuthResponse } from "@/lib/types/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { users } = getRepositories();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await users.findOne({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        organizationId: true,
        departmentId: true,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isValidPassword) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        data: {
          user: userWithoutPassword,
          token,
        },
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

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
