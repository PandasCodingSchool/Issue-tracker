import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("comments")
export class Comment extends BaseEntity {
  @Column("text")
  content!: string;

  @ManyToOne("User", "comments", { lazy: true })
  user!: Promise<any>;

  @ManyToOne("Issue", "comments", { lazy: true })
  issue!: Promise<any>;
}
