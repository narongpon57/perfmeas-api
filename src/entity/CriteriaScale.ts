import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Criteria } from "./Criteria";

@Entity()
export class CriteriaScale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Criteria)
  criteria: Criteria;

  @Column({ type: "varchar", length: 255 })
  label: string;

  @Column()
  value: number;

  @Column()
  isActive: boolean;
}
