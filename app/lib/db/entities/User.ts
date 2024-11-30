import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "@/lib/constants/enums";
import { Organization } from "./Organization";
import { Department } from "./Department";
import { Issue } from "./Issue";
import { Comment } from "./Comment";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role!: UserRole;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization!: Organization;

  @ManyToOne(() => Department, (department) => department.users)
  department!: Department;

  @OneToMany(() => Issue, (issue) => issue.assignee)
  assignedIssues!: Issue[];

  @OneToMany(() => Issue, (issue) => issue.reporter)
  reportedIssues!: Issue[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
