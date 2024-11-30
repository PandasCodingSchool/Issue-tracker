import { NextResponse } from "next/server";
import dbPromise from "@/lib/db/init";
import { getRepositories } from "@/lib/db";

export async function GET() {
  try {
    // Ensure database is initialized
    await dbPromise;

    const { issues } = getRepositories();

    const allIssues = await issues.find({
      relations: ["assignee", "department"],
    });

    return NextResponse.json(allIssues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
