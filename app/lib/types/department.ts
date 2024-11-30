import { IOrganization } from "./organization";
import { IUser } from "./user";
import { IIssue } from "./issue";

export interface IDepartment {
  id: number;
  name: string;
  description?: string;
  organization?: IOrganization;
  users?: IUser[];
  issues?: IIssue[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepartmentCreate {
  name: string;
  description?: string;
  organizationId: number;
}

export interface IDepartmentUpdate extends Partial<IDepartmentCreate> {}
