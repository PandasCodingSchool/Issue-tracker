import { UserRole } from "../constants/enums";
import { IOrganization } from "./organization";
import { IDepartment } from "./department";
import { IIssue } from "./issue";
import { IComment } from "./comment";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  organization?: IOrganization;
  department?: IDepartment;
  assignedIssues?: IIssue[];
  reportedIssues?: IIssue[];
  comments?: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
  organizationId?: string;
  departmentId?: string;
}

export interface IUserUpdate extends Partial<IUserCreate> {}
