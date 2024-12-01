import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("departments")
export class Department extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne("Organization", "departments", { lazy: true })
  organization!: Promise<any>;

  @OneToMany("User", "department", { lazy: true })
  users!: Promise<any[]>;

  @OneToMany("Issue", "department", { lazy: true })
  issues!: Promise<any[]>;
}
