import { NextResponse } from "next/server";
import { initializeDatabase, getRepositories } from "@/lib/db";

export async function GET() {
  try {
    // Ensure database is initialized
    await initializeDatabase();

    const { issues } = getRepositories();

    const allIssues = await issues.find();
    const populatedIssues = await Promise.all(
      allIssues.map(async (issue) => ({
        ...issue,
        assignee: await issue.assignee,
        department: await issue.department,
      }))
    );

    return NextResponse.json(populatedIssues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
