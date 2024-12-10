import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Issue } from "./Issue";
import { Project } from "./Project";

@Entity()
export class Department extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.department)
  users: User[];

  @OneToMany(() => Issue, (issue) => issue.department)
  issues: Issue[];

  @OneToMany(() => Project, (project) => project.department)
  projects: Project[];
}
