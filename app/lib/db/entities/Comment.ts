import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Issue } from "./Issue";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  content!: string;

  @ManyToOne(() => User, (user) => user.comments)
  user!: User;

  @ManyToOne(() => Issue, (issue) => issue.comments)
  issue!: Issue;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
