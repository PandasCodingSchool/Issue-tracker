import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Issue } from "./Issue";

@Entity("attachments")
export class Attachment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fileName!: string;

  @Column()
  fileUrl!: string;

  @Column()
  fileType!: string;

  @Column()
  fileSize!: number;

  @ManyToOne(() => Issue, (issue) => issue.attachments)
  issue!: Issue;

  @CreateDateColumn()
  createdAt!: Date;
}
