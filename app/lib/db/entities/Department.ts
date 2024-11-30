import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Organization } from "./Organization";
import { User } from "./User";
import { Issue } from "./Issue";

@Entity("departments")
export class Department {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => Organization, (organization) => organization.departments)
  organization!: Organization;

  @OneToMany(() => User, (user) => user.department)
  users!: User[];

  @OneToMany(() => Issue, (issue) => issue.department)
  issues!: Issue[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
