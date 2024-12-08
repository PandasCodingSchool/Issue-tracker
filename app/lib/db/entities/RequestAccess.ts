import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import type { TeamSize, RequestStatus } from "@/lib/types/request";

@Entity("request_access")
export class RequestAccess extends BaseEntity {
  @Column()
  companyName!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({
    type: "enum",
    enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
  })
  teamSize!: TeamSize;

  @Column({ type: "text", nullable: true })
  message?: string;

  @Column({
    type: "enum",
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  })
  status!: RequestStatus;
}
