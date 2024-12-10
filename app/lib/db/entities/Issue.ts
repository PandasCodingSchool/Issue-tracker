import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Department } from "./Department";
import { Project } from "./Project";
import { IssueStatus, IssuePriority, IssueType } from "@/lib/constants/enums";

@Entity()
export class Issue extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({
    type: "enum",
    enum: IssueStatus,
    default: IssueStatus.OPEN,
  })
  status: IssueStatus;

  @Column({
    type: "enum",
    enum: IssuePriority,
    default: IssuePriority.MEDIUM,
  })
  priority: IssuePriority;

  @Column({
    type: "enum",
    enum: IssueType,
    default: IssueType.TASK,
  })
  type: IssueType;

  @Column({ type: "date", nullable: true })
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.assignedIssues)
  assignee: User;

  @ManyToOne(() => User, (user) => user.reportedIssues)
  reporter: User;

  @ManyToOne(() => Department, (department) => department.issues)
  department: Department;

  @ManyToOne(() => Project, (project) => project.issues)
  project: Project;
}
