import { Department } from "@/lib/db/entities/Department";
import { User } from "@/lib/db/entities/User";
import { Issue } from "@/lib/db/entities/Issue";

export interface IProject {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  priority: "low" | "medium" | "high";
  startDate: Date;
  endDate: Date;
  department: Department;
  teamMembers: User[];
  issues: Issue[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectCreate {
  name: string;
  description: string;
  status?: "active" | "completed" | "on-hold";
  priority: "low" | "medium" | "high";
  startDate: string;
  endDate: string;
  departmentId: number;
}

export interface IProjectUpdate extends Partial<IProjectCreate> {
  id: number;
}

export interface IProjectStats {
  totalIssues: number;
  completedIssues: number;
  progress: number;
  teamMembers: number;
}
