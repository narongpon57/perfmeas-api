import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
