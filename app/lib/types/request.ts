export type TeamSize = "1-10" | "11-50" | "51-200" | "201-500" | "500+";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IRequestAccess {
  id: number;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  teamSize: TeamSize;
  message?: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRequestAccessCreate {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  teamSize: TeamSize;
  message?: string;
}
