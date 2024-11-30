import { NextResponse } from "next/server";
import { AppDataSource } from "@/lib/db";
import { Issue } from "@/lib/db/entities/Issue";
import { IIssue, IApiResponse, IPaginatedResponse } from "@/lib/types";

export async function GET(
  request: Request
): Promise<NextResponse<IApiResponse<IPaginatedResponse<IIssue>>>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const issueRepository = AppDataSource.getRepository(Issue);
    const [issues, total] = await issueRepository.findAndCount({
      relations: ["assignee", "department"],
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        data: issues,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
