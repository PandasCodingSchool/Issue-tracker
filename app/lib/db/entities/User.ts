import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { UserRole } from "@/lib/constants/enums";
import { BaseEntity } from "./BaseEntity";

@Entity("users")
export class User extends BaseEntity {
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

  @ManyToOne("Organization", "users", { lazy: true })
  organization!: Promise<any>;

  @ManyToOne("Department", "users", { lazy: true })
  department!: Promise<any>;

  @OneToMany("Issue", "assignee", { lazy: true })
  assignedIssues!: Promise<any[]>;

  @OneToMany("Issue", "reporter", { lazy: true })
  reportedIssues!: Promise<any[]>;

  @OneToMany("Comment", "user", { lazy: true })
  comments!: Promise<any[]>;
}
