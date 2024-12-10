import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Department } from "./Department";
import { User } from "./User";
import { Issue } from "./Issue";

export type ProjectStatus = "active" | "completed" | "on-hold";
export type ProjectPriority = "low" | "medium" | "high";

@Entity()
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({
    type: "enum",
    enum: ["active", "completed", "on-hold"],
    default: "active",
  })
  status: ProjectStatus;

  @Column({
    type: "enum",
    enum: ["low", "medium", "high"],
    default: "medium",
  })
  priority: ProjectPriority;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @ManyToOne(() => Department, (department) => department.projects)
  department: Department;

  @ManyToMany(() => User)
  @JoinTable({
    name: "project_team_members",
    joinColumn: { name: "project_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
  })
  teamMembers: User[];

  @OneToMany(() => Issue, (issue) => issue.project)
  issues: Issue[];
}
