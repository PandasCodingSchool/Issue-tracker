import type { IDepartment } from "./department";
import type { IUser } from "./user";

export interface IOrganization {
  id: number;
  name: string;
  description?: string;
  getDepartments(): Promise<IDepartment[]>;
  getUsers(): Promise<IUser[]>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationCreate {
  name: string;
  description?: string;
}

export interface IOrganizationUpdate extends Partial<IOrganizationCreate> {}
