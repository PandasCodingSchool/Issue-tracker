import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Department } from "./Department";
import type { IOrganization, IUser, IDepartment } from "@/lib/types";

@Entity("organizations")
export class Organization implements IOrganization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @OneToMany(() => Department, (department) => department.organization)
  departments!: IDepartment[];

  @OneToMany(() => User, (user) => user.organization)
  users!: IUser[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
