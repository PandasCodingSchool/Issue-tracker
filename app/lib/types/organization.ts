import { IDepartment } from "./department";
import { IUser } from "./user";

export interface IOrganization {
  id: number;
  name: string;
  description?: string;
  departments?: IDepartment[];
  users?: IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationCreate {
  name: string;
  description?: string;
}

export interface IOrganizationUpdate extends Partial<IOrganizationCreate> {}
