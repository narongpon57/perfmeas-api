import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CriteriaScale } from "./CriteriaScale"

@Entity()
export class Criteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column()
  weight: number;

  @Column({ type: "bit" })
  is_active: number;

  @OneToMany(type => CriteriaScale, criteriaScale => criteriaScale.criteria)
  criteriaScales: CriteriaScale[]
}
