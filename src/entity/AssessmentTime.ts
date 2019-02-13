import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class AssessmentTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255 })
  type: string

  @Column({ type: 'int' })
  year: number

  @Column({ type: 'varchar', length: 100 })
  status: string

  @Column({ type: 'timestamp' })
  date_from: string

  @Column({ type: 'timestamp' })
  date_to: string

  @Column({ type: 'timestamp' })
  published_date: string
}
