import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("attachments")
export class Attachment extends BaseEntity {
  @Column()
  fileName!: string;

  @Column()
  fileUrl!: string;

  @Column()
  fileType!: string;

  @Column()
  fileSize!: number;

  @ManyToOne("Issue", "attachments", { lazy: true })
  issue!: Promise<any>;
}
