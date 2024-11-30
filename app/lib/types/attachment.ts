import { IIssue } from "./issue";

export interface IAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  issue?: IIssue;
  createdAt: Date;
}

export interface IAttachmentCreate {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  issueId: string;
}

export interface IAttachmentUpdate {
  fileName?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
}
