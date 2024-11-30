import { IUser } from "./user";
import { IIssue } from "./issue";

export interface IComment {
  id: string;
  content: string;
  user?: IUser;
  issue?: IIssue;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentCreate {
  content: string;
  userId: string;
  issueId: string;
}

export interface ICommentUpdate {
  content: string;
}
