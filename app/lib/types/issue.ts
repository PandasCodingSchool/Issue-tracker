import { IssueStatus, IssuePriority, IssueType } from "../constants/enums";
import { IUser } from "./user";
import { IDepartment } from "./department";
import { IComment } from "./comment";
import { IAttachment } from "./attachment";

export interface IIssue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  assignee?: IUser;
  reporter?: IUser;
  department?: IDepartment;
  comments?: IComment[];
  attachments?: IAttachment[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIssueCreate {
  title: string;
  description: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  type?: IssueType;
  assigneeId?: string;
  reporterId: string;
  departmentId: string;
  dueDate?: Date;
}

export interface IIssueUpdate extends Partial<IIssueCreate> {}
