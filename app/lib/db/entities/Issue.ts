import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IssueStatus, IssuePriority, IssueType } from "@/lib/constants/enums";
import { User } from "./User";
import { Department } from "./Department";
import { Comment } from "./Comment";
import { Attachment } from "./Attachment";

@Entity("issues")
export class Issue {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column({
    type: "enum",
    enum: IssueStatus,
    default: IssueStatus.OPEN,
  })
  status!: IssueStatus;

  @Column({
    type: "enum",
    enum: IssuePriority,
    default: IssuePriority.MEDIUM,
  })
  priority!: IssuePriority;

  @Column({
    type: "enum",
    enum: IssueType,
    default: IssueType.TASK,
  })
  type!: IssueType;

  @ManyToOne(() => User, (user) => user.assignedIssues)
  assignee!: User;

  @ManyToOne(() => User, (user) => user.reportedIssues)
  reporter!: User;

  @ManyToOne(() => Department, (department) => department.issues)
  department!: Department;

  @OneToMany(() => Comment, (comment) => comment.issue)
  comments!: Comment[];

  @OneToMany(() => Attachment, (attachment) => attachment.issue)
  attachments!: Attachment[];

  @Column({ nullable: true })
  dueDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
