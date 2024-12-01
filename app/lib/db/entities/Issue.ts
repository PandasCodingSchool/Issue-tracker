import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { IssueStatus, IssuePriority, IssueType } from "@/lib/constants/enums";
import { BaseEntity } from "./BaseEntity";

@Entity("issues")
export class Issue extends BaseEntity {
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

  @ManyToOne("User", "assignedIssues", { lazy: true })
  assignee!: Promise<any>;

  @ManyToOne("User", "reportedIssues", { lazy: true })
  reporter!: Promise<any>;

  @ManyToOne("Department", "issues", { lazy: true })
  department!: Promise<any>;

  @OneToMany("Comment", "issue", { lazy: true })
  comments!: Promise<any[]>;

  @OneToMany("Attachment", "issue", { lazy: true })
  attachments!: Promise<any[]>;

  @Column({ nullable: true })
  dueDate!: Date;
}
