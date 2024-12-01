import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import type { IDepartment, IOrganization, IUser } from "@/lib/types";

@Entity("organizations")
export class Organization
  extends BaseEntity
  implements Omit<IOrganization, "departments" | "users">
{
  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @OneToMany("Department", "organization", { lazy: true })
  departments!: Promise<IDepartment[]>;

  @OneToMany("User", "organization", { lazy: true })
  users!: Promise<IUser[]>;

  async getDepartments(): Promise<IDepartment[]> {
    return this.departments;
  }

  async getUsers(): Promise<IUser[]> {
    return this.users;
  }
}
